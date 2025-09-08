import React, { useState } from 'react';
import { Upgrade } from '../hooks/useGameLogic';
import TapIcon from '../components/icons/TapIcon';
import ClockIcon from '../components/icons/ClockIcon';
import BoosterIcon from '../components/icons/BoosterIcon';
import RocketIcon from '../components/icons/RocketIcon';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { RECIPIENT_WALLET_ADDRESS, BOOSTER_PRICE_TON } from '../config';

interface ShopScreenProps {
    points: number;
    upgrades: { [key: string]: Upgrade };
    buyUpgrade: (upgradeId: any) => void;
    applyBooster: () => void;
    boosterEndTime: number | null;
}

const ShopItem: React.FC<{
    icon: React.ReactNode,
    name: string,
    description: string,
    price: number,
    onBuy: () => void,
    canAfford: boolean
}> = ({ icon, name, description, price, onBuy, canAfford }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
        <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="font-bold">{name}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        <button
            onClick={onBuy}
            disabled={!canAfford}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
            {price.toLocaleString()} P
        </button>
    </div>
);


const ShopScreen: React.FC<ShopScreenProps> = ({ points, upgrades, buyUpgrade, applyBooster, boosterEndTime }) => {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const [isLoading, setIsLoading] = useState(false);
    const isBoosterActive = boosterEndTime && Date.now() < boosterEndTime;

    const handleBuyBooster = async () => {
        if (!wallet) {
            alert('Please connect your TON wallet first.');
            tonConnectUI.openModal();
            return;
        }

        setIsLoading(true);
        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
                messages: [
                    {
                        address: RECIPIENT_WALLET_ADDRESS,
                        amount: (parseFloat(BOOSTER_PRICE_TON) * 1e9).toString(), // Convert TON to nanoton
                    },
                ],
            };

            const result = await tonConnectUI.sendTransaction(transaction);
            
            // Send the result.boc to backend for verification
            const verificationResponse = await fetch('/api/verify-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boc: result.boc,
                    userAddress: wallet.account.address,
                    boosterType: 'standard'
                })
            });

            const verificationResult = await verificationResponse.json();
            
            if (verificationResult.success) {
                console.log("Transaction verified successfully");
                alert("Purchase successful! Your booster is now active.");
                applyBooster();
            } else {
                console.error("Transaction verification failed:", verificationResult.error);
                alert("Transaction verification failed. Please try again.");
            }

        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Purchase failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full pb-20">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">SECCO Shop</h1>
                    <div className="text-right">
                        <p className="font-semibold text-lg">{points.toLocaleString('en-US', { maximumFractionDigits: 1 })} P</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Click Upgrades */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">Click Upgrades</h2>
                        <div className="space-y-2">
                           <ShopItem 
                             icon={<TapIcon />} 
                             name="Power Tap" 
                             description={`+${upgrades.powerTap.increase.toFixed(1)} per tap`} 
                             price={upgrades.powerTap.price} 
                             onBuy={() => buyUpgrade('powerTap')}
                             canAfford={points >= upgrades.powerTap.price}
                           />
                           <ShopItem 
                             icon={<ClockIcon />} 
                             name="Mega Click" 
                             description={`+${upgrades.megaClick.increase.toFixed(1)} per tap`} 
                             price={upgrades.megaClick.price} 
                             onBuy={() => buyUpgrade('megaClick')}
                             canAfford={points >= upgrades.megaClick.price}
                           />
                        </div>
                    </div>

                    {/* Auto-Farm */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">Auto-Farm</h2>
                        <div className="space-y-2">
                             <ShopItem 
                                icon={<ClockIcon />} 
                                name="Basic Auto" 
                                description={`+${upgrades.basicAuto.increase}/min passive`} 
                                price={upgrades.basicAuto.price} 
                                onBuy={() => buyUpgrade('basicAuto')}
                                canAfford={points >= upgrades.basicAuto.price}
                             />
                             <ShopItem 
                                icon={<BoosterIcon />} 
                                name="Turbo Auto" 
                                description={`+${upgrades.turboAuto.increase}/min passive`} 
                                price={upgrades.turboAuto.price} 
                                onBuy={() => buyUpgrade('turboAuto')}
                                canAfford={points >= upgrades.turboAuto.price}
                            />
                        </div>
                    </div>

                    {/* Boosters */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">Boosters</h2>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg"><RocketIcon /></div>
                                    <div>
                                        <h3 className="font-bold">2x Points (30 min)</h3>
                                        <p className="text-sm text-gray-500">Infinite Energy (30 min)</p>
                                    </div>
                                </div>
                                <button 
                                  onClick={handleBuyBooster}
                                  disabled={isLoading || isBoosterActive}
                                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[90px]">
                                    {isLoading ? '...' : (isBoosterActive ? 'Active' : `${BOOSTER_PRICE_TON} TON`)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopScreen;