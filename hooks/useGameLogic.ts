import { useState, useEffect, useCallback } from 'react';
import { BOOSTER_DURATION_MINUTES } from '../config';

export interface Upgrade {
    id: string;
    level: number;
    price: number;
    increase: number;
}

export interface Stock {
    id: string;
    name: string;
    apy: number;
    price: number;
}

export interface Investment {
    amountInvested: number;
    lastUpdated: number;
}

export interface GameState {
    points: number;
    energy: number;
    maxEnergy: number;
    pointsPerTap: number;
    passiveIncome: number;
    upgrades: {
        powerTap: Upgrade;
        megaClick: Upgrade;
        basicAuto: Upgrade;
        turboAuto: Upgrade;
    };
    investments: {
        [key: string]: Investment;
    };
    lastTick: number;
    boosterEndTime: number | null;
    referralBonusClaimed: boolean;
}

export const STOCKS: Stock[] = [
    { id: 'secco-tech', name: 'SECCO Innovations', apy: 0.15, price: 10000 },
    { id: 'ton-ventures', name: 'TON Ventures', apy: 0.25, price: 50000 },
    { id: 'global-net', name: 'GlobalNet', apy: 0.10, price: 5000 },
];

const FULL_RECHARGE_SECONDS = 6 * 60 * 60;
const REFERRAL_BONUS = 10000;

const getInitialState = (): GameState => {
    const savedStateJSON = localStorage.getItem('seccoGameStateV2');
    const now = Date.now();

    let initialState: GameState = {
        points: 0,
        energy: 500,
        maxEnergy: 500,
        pointsPerTap: 0.1,
        passiveIncome: 0,
        upgrades: {
            powerTap: { id: 'powerTap', level: 1, price: 150, increase: 0.5 },
            megaClick: { id: 'megaClick', level: 1, price: 500, increase: 1 },
            basicAuto: { id: 'basicAuto', level: 0, price: 1000, increase: 10 },
            turboAuto: { id: 'turboAuto', level: 0, price: 5000, increase: 50 },
        },
        investments: {},
        lastTick: now,
        boosterEndTime: null,
        referralBonusClaimed: false,
    };

    if (savedStateJSON) {
        try {
            const state = JSON.parse(savedStateJSON) as GameState;
            const timeOfflineInSeconds = (now - state.lastTick) / 1000;

            if (state.passiveIncome > 0) {
                const passiveEarnings = timeOfflineInSeconds * (state.passiveIncome / 60);
                state.points += passiveEarnings;
            }

            Object.keys(state.investments).forEach(stockId => {
                const stock = STOCKS.find(s => s.id === stockId);
                const investment = state.investments[stockId];
                if (stock && investment) {
                    const apyPerSecond = stock.apy / (365 * 24 * 60 * 60);
                    const investmentEarnings = investment.amountInvested * apyPerSecond * timeOfflineInSeconds;
                    state.points += investmentEarnings;
                    investment.lastUpdated = now;
                }
            });
            
            if (!state.boosterEndTime || now > state.boosterEndTime) {
                const energyRegen = (timeOfflineInSeconds / FULL_RECHARGE_SECONDS) * state.maxEnergy;
                state.energy = Math.min(state.maxEnergy, state.energy + energyRegen);
            } else {
                state.energy = state.maxEnergy; // Infinite energy while booster is active
            }

            state.lastTick = now;
            initialState = state;
        } catch (error) {
            console.error("Failed to parse saved game state, resetting.", error);
            localStorage.removeItem('seccoGameStateV2');
        }
    }

    // Handle referral bonus
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');
    if (refId && !initialState.referralBonusClaimed) {
        initialState.points += REFERRAL_BONUS;
        initialState.referralBonusClaimed = true;
    }

    return initialState;
};

export default function useGameLogic() {
    const [gameState, setGameState] = useState<GameState>(getInitialState);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setGameState(prev => {
                const now = Date.now();
                const deltaSeconds = (now - prev.lastTick) / 1000;
                
                const isBoosterActive = prev.boosterEndTime && now < prev.boosterEndTime;
                
                let newEnergy = prev.energy;
                if (isBoosterActive) {
                    newEnergy = prev.maxEnergy;
                } else {
                    const energyRegen = (deltaSeconds / FULL_RECHARGE_SECONDS) * prev.maxEnergy;
                    newEnergy = Math.min(prev.maxEnergy, prev.energy + energyRegen);
                }

                const passiveEarnings = deltaSeconds * (prev.passiveIncome / 60);
                
                let investmentEarnings = 0;
                const newInvestments = { ...prev.investments };
                Object.keys(newInvestments).forEach(stockId => {
                    const stock = STOCKS.find(s => s.id === stockId);
                    const investment = newInvestments[stockId];
                    if (stock && investment) {
                         const apyPerSecond = stock.apy / (365 * 24 * 60 * 60);
                         investmentEarnings += investment.amountInvested * apyPerSecond * deltaSeconds;
                         newInvestments[stockId] = { ...investment, lastUpdated: now };
                    }
                });

                return {
                    ...prev,
                    points: prev.points + passiveEarnings + investmentEarnings,
                    energy: newEnergy,
                    investments: newInvestments,
                    lastTick: now,
                    boosterEndTime: isBoosterActive ? prev.boosterEndTime : null,
                };
            });
        }, 1000);

        return () => clearInterval(gameLoop);
    }, []);

    useEffect(() => {
        localStorage.setItem('seccoGameStateV2', JSON.stringify(gameState));
    }, [gameState]);

    const handleTap = useCallback(() => {
        const now = Date.now();
        const isBoosterActive = gameState.boosterEndTime && now < gameState.boosterEndTime;
        
        if (isBoosterActive || gameState.energy >= 1) {
            const tapValue = isBoosterActive ? gameState.pointsPerTap * 2 : gameState.pointsPerTap;
            setGameState(prev => ({
                ...prev,
                points: prev.points + tapValue,
                energy: isBoosterActive ? prev.energy : prev.energy - 1,
            }));
            return true;
        }
        return false;
    }, [gameState.energy, gameState.pointsPerTap, gameState.boosterEndTime]);

    const buyUpgrade = useCallback((upgradeId: keyof typeof gameState.upgrades) => {
        const upgrade = gameState.upgrades[upgradeId];
        if (gameState.points >= upgrade.price) {
            setGameState(prev => {
                const newPoints = prev.points - upgrade.price;
                let newPointsPerTap = prev.pointsPerTap;
                let newPassiveIncome = prev.passiveIncome;

                if (upgradeId === 'powerTap' || upgradeId === 'megaClick') {
                    newPointsPerTap += upgrade.increase;
                } else if (upgradeId === 'basicAuto' || upgradeId === 'turboAuto') {
                    newPassiveIncome += upgrade.increase;
                }
                
                return {
                    ...prev,
                    points: newPoints,
                    pointsPerTap: newPointsPerTap,
                    passiveIncome: newPassiveIncome,
                    upgrades: {
                        ...prev.upgrades,
                        [upgradeId]: {
                            ...prev.upgrades[upgradeId],
                            level: prev.upgrades[upgradeId].level + 1,
                            price: Math.floor(prev.upgrades[upgradeId].price * 1.8),
                        }
                    }
                };
            });
        }
    }, [gameState.points, gameState.upgrades]);

    const buyStock = useCallback((stockId: string, amount: number) => {
        const stock = STOCKS.find(s => s.id === stockId);
        if (!stock || gameState.points < amount || amount <= 0) return;

        setGameState(prev => {
            const existingInvestment = prev.investments[stockId] || { amountInvested: 0, lastUpdated: Date.now() };
            return {
                ...prev,
                points: prev.points - amount,
                investments: {
                    ...prev.investments,
                    [stockId]: {
                        ...existingInvestment,
                        amountInvested: existingInvestment.amountInvested + amount,
                        lastUpdated: Date.now()
                    }
                }
            }
        });
    }, [gameState.points]);
    
    const applyBooster = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            boosterEndTime: Date.now() + BOOSTER_DURATION_MINUTES * 60 * 1000,
        }));
    }, []);

    return {
        ...gameState,
        handleTap,
        buyUpgrade,
        buyStock,
        applyBooster,
    };
}