import React from 'react';
import { Upgrade } from '../hooks/useGameLogic';
import TapIcon from '../components/icons/TapIcon';
import ClockIcon from '../components/icons/ClockIcon';
import BoosterIcon from '../components/icons/BoosterIcon';
import RocketIcon from '../components/icons/RocketIcon';

interface ShopScreenProps {
    points: number;
    upgrades: { [key: string]: Upgrade };
    buyUpgrade: (upgradeId: any) => void;
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


const ShopScreen: React.FC<ShopScreenProps> = ({ points, upgrades, buyUpgrade }) => {

    const handleBuyBooster = () => {
        alert('Purchasing with TON is coming soon!');
    };

    return (
        <div className="w-full pb-20">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">SECCO Shop</h1>
                    <div className="text-right">
                        <p className="font-semibold text-lg">{points.toLocaleString('en-US', { maximumFractionDigits: 1 })} P</p>
                        <p className="text-sm text-gray-500">TON: 2.75</p>
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
                                        <h3 className="font-bold">2x Points (1 hour)</h3>
                                        <p className="text-sm text-gray-500">Infinite Energy (30 min)</p>
                                    </div>
                                </div>
                                <button 
                                  onClick={handleBuyBooster}
                                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                                    0.5 TON
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