import { useState, useEffect, useCallback } from 'react';

export interface Upgrade {
    id: string;
    level: number;
    price: number;
    increase: number;
}

export interface Stock {
    id: string;
    name: string;
    apy: number; // Annual Percentage Yield e.g., 0.15 for 15%
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
    passiveIncome: number; // from auto-farm upgrades (per minute)
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
}

export const STOCKS: Stock[] = [
    { id: 'secco-tech', name: 'SECCO Innovations', apy: 0.15, price: 10000 },
    { id: 'ton-ventures', name: 'TON Ventures', apy: 0.25, price: 50000 },
    { id: 'global-net', name: 'GlobalNet', apy: 0.10, price: 5000 },
];

const FULL_RECHARGE_SECONDS = 6 * 60 * 60; // 6 hours

const getInitialState = (): GameState => {
    const savedStateJSON = localStorage.getItem('seccoGameStateV2');
    const now = Date.now();

    if (savedStateJSON) {
        try {
            const state = JSON.parse(savedStateJSON) as GameState;
            const timeOfflineInSeconds = (now - state.lastTick) / 1000;

            // --- Offline Progress Calculation ---
            // 1. Passive income from upgrades
            if (state.passiveIncome > 0) {
                const passiveEarnings = timeOfflineInSeconds * (state.passiveIncome / 60);
                state.points += passiveEarnings;
            }

            // 2. Investment earnings
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
            
            // 3. Energy regeneration
            const energyRegen = (timeOfflineInSeconds / FULL_RECHARGE_SECONDS) * state.maxEnergy;
            state.energy = Math.min(state.maxEnergy, state.energy + energyRegen);

            state.lastTick = now;
            return state;
        } catch (error) {
            console.error("Failed to parse saved game state, resetting.", error);
            localStorage.removeItem('seccoGameStateV2');
            // Fall through to return the default state below
        }
    }

    // Default state for first-time players
    return {
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
        lastTick: now
    };
};

export default function useGameLogic() {
    const [gameState, setGameState] = useState<GameState>(getInitialState);

    // Main Game Loop (tick)
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setGameState(prev => {
                const now = Date.now();
                const deltaSeconds = (now - prev.lastTick) / 1000;

                // 1. Passive income from upgrades
                const passiveEarnings = deltaSeconds * (prev.passiveIncome / 60);
                
                // 2. Energy regeneration
                const energyRegen = (deltaSeconds / FULL_RECHARGE_SECONDS) * prev.maxEnergy;
                const newEnergy = Math.min(prev.maxEnergy, prev.energy + energyRegen);

                // 3. Investment earnings (accrued to be claimed)
                // In this simplified model, we'll add directly to points.
                // A more complex version would have a separate 'claimable' pool.
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
                    lastTick: now
                };
            });
        }, 1000);

        return () => clearInterval(gameLoop);
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('seccoGameStateV2', JSON.stringify(gameState));
    }, [gameState]);


    const handleTap = useCallback(() => {
        if (gameState.energy >= 1) { // Each tap costs 1 energy
            setGameState(prev => ({
                ...prev,
                points: prev.points + prev.pointsPerTap,
                energy: prev.energy - 1,
            }));
            return true;
        }
        return false;
    }, [gameState.energy, gameState.pointsPerTap]);

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

    return {
        ...gameState,
        handleTap,
        buyUpgrade,
        buyStock
    };
}