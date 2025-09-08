import React, { useState, useEffect } from 'react';

interface FloatingText {
    id: number;
    value: string;
    x: number;
    y: number;
}

interface HomeScreenProps {
    points: number;
    energy: number;
    maxEnergy: number;
    pointsPerTap: number;
    boosterEndTime: number | null;
    handleTap: () => boolean;
}

const BoosterTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = endTime - Date.now();
            if (newTimeLeft > 0) {
                setTimeLeft(newTimeLeft);
            } else {
                setTimeLeft(0);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full animate-pulse">
            🚀 Booster Active: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
    );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ points, energy, maxEnergy, pointsPerTap, boosterEndTime, handleTap }) => {
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const isBoosterActive = boosterEndTime && Date.now() < boosterEndTime;
    
    const currentPointsPerTap = isBoosterActive ? pointsPerTap * 2 : pointsPerTap;

    const onTap = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (handleTap()) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left + (Math.random() * 60 - 30);
            const y = event.clientY - rect.top - 40;

            const newText: FloatingText = {
                id: Date.now() + Math.random(),
                value: `+${currentPointsPerTap.toFixed(1)}`,
                x,
                y,
            };

            setFloatingTexts(prev => [...prev, newText]);
            setTimeout(() => {
                setFloatingTexts(current => current.filter(t => t.id !== newText.id));
            }, 2000);
        }
    };

    const energyPercentage = (energy / maxEnergy) * 100;

    return (
        <div className="w-full h-full flex flex-col justify-between items-center text-center pb-20">
            <div className="flex flex-col items-center mt-4 space-y-2">
                {isBoosterActive && boosterEndTime && <BoosterTimer endTime={boosterEndTime} />}
                <h1 className="text-5xl font-extrabold text-black">
                    {points.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </h1>
                <p className="text-gray-500 font-medium">+{currentPointsPerTap.toFixed(1)} per tap</p>
            </div>
            
            <div className="relative w-full flex justify-center mt-8 mb-8">
                 <button 
                    onClick={onTap}
                    className="w-64 h-64 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg text-white flex flex-col justify-center items-center select-none active:scale-95 transition-transform duration-100"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <div className="w-40 h-40 rounded-full bg-white/20 flex justify-center items-center">
                         <div className="w-32 h-32 rounded-full bg-white/30 flex flex-col justify-center items-center">
                            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 11.12V15H12v-1.88c1.4-.22 2.5-1.53 2.5-3.12 0-1.77-1.43-3.2-3.2-3.2s-3.2 1.43-3.2 3.2c0 1.28.83 2.37 1.9 2.82V11H9.5v2h1.7zm.5-3.62c.44 0 .8.36.8.8s-.36.8-.8.8-.8-.36-.8-.8.36-.8.8-.8z" fill="#007aff"/>
                                <path d="M12.5 13.12V15H11v-1.88l-.1-.02c-1.07-.45-1.9-1.54-1.9-2.82 0-1.77 1.43-3.2 3.2-3.2s3.2 1.43 3.2 3.2c0 1.59-1.1 2.9-2.5 3.12l-.1.02zm-1.2-5.62c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8z" fill="white"/>
                                <path d="m14 8-2-3-2 3h4z" fill="#007aff"/>
                                <path d="m14 8-2-3-2 3h4z" fill="white" stroke="#007aff" stroke-width="0.5"/>
                            </svg>
                            <span className="font-bold text-lg mt-1">TAP TO EARN</span>
                        </div>
                    </div>
                 </button>
                {floatingTexts.map(text => (
                    <span
                        key={text.id}
                        className="absolute text-3xl font-bold text-black opacity-0 pointer-events-none"
                        style={{
                            left: text.x,
                            top: text.y,
                            animation: 'floatUp 2s ease-out forwards',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {text.value}
                    </span>
                ))}
            </div>

            <div className="w-full px-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">
                        {isBoosterActive ? '⚡️ Energy: ∞' : `⚡️ Energy: ${Math.floor(energy)}/${maxEnergy}`}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${isBoosterActive ? 100 : energyPercentage}%` }}></div>
                </div>
            </div>

            <style>{`
                @keyframes floatUp {
                    0% { transform: translate(-50%, -50%) translateY(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) translateY(-100px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default HomeScreen;