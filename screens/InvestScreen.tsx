import React, { useState } from 'react';
import { Investment, STOCKS } from '../hooks/useGameLogic';

// A simple map for stock icons
const StockIcon: React.FC<{ stockId: string }> = ({ stockId }) => {
    const baseStyle = "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm";
    switch (stockId) {
        case 'secco-tech': return <div className={`${baseStyle} bg-blue-500`}>SI</div>;
        case 'ton-ventures': return <div className={`${baseStyle} bg-cyan-500`}>TV</div>;
        case 'global-net': return <div className={`${baseStyle} bg-purple-500`}>GN</div>;
        default: return <div className={`${baseStyle} bg-gray-500`}>?</div>;
    }
};

interface InvestScreenProps {
    points: number;
    investments: { [key: string]: Investment };
    buyStock: (stockId: string, amount: number) => void;
}

const InvestScreen: React.FC<InvestScreenProps> = ({ points, investments, buyStock }) => {
    const [investAmount, setInvestAmount] = useState<{ [key: string]: string }>({});

    const totalInvested = Object.values(investments).reduce((sum, inv) => sum + inv.amountInvested, 0);

    const handleAmountChange = (stockId: string, value: string) => {
        if (/^\d*$/.test(value)) { // only allow numbers
            setInvestAmount(prev => ({ ...prev, [stockId]: value }));
        }
    };

    const handleInvest = (stockId: string) => {
        const amount = parseInt(investAmount[stockId] || '0', 10);
        if (amount > 0 && points >= amount) {
            buyStock(stockId, amount);
            setInvestAmount(prev => ({ ...prev, [stockId]: '' }));
        } else {
            alert("Invalid amount or insufficient points.");
        }
    };

    return (
        <div className="w-full pb-20">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-4 mb-4">
                 <h1 className="text-2xl font-bold text-center mb-2">My Portfolio</h1>
                 <div className="text-center">
                    <p className="text-gray-500">Total Invested</p>
                    <p className="text-3xl font-extrabold">{totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })} P</p>
                 </div>
            </div>

            <div className="space-y-3">
                {STOCKS.map(stock => {
                    const currentInvestment = investments[stock.id]?.amountInvested || 0;
                    return (
                        <div key={stock.id} className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <StockIcon stockId={stock.id} />
                                    <div>
                                        <h3 className="font-bold">{stock.name}</h3>
                                        <p className="text-sm text-green-600 font-semibold">{stock.apy * 100}% APY</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-lg">{currentInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })} P</p>
                                     <p className="text-xs text-gray-500">Invested</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Amount to invest"
                                    value={investAmount[stock.id] || ''}
                                    onChange={(e) => handleAmountChange(stock.id, e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => handleInvest(stock.id)}
                                    disabled={!investAmount[stock.id] || parseInt(investAmount[stock.id]) > points}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300 transition-colors"
                                >
                                    Invest
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
             <p className="text-center text-xs text-gray-400 mt-4">
                APY is Annual Percentage Yield. Earnings are added to your balance in real-time.
            </p>
        </div>
    );
};

export default InvestScreen;