import React, { useState } from 'react';

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
    handleTap: () => boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ points, energy, maxEnergy, pointsPerTap, handleTap }) => {
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

    const onTap = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (handleTap()) {
            const rect = event.currentTarget.getBoundingClientRect();
            // Get a random position within the button
            const x = event.clientX - rect.left + (Math.random() * 60 - 30);
            const y = event.clientY - rect.top - 40; // Start slightly above the tap position

            const newText: FloatingText = {
                id: Date.now() + Math.random(),
                value: `+${pointsPerTap.toFixed(1)}`,
                x,
                y,
            };

            setFloatingTexts(prev => [...prev, newText]);
            setTimeout(() => {
                setFloatingTexts(current => current.filter(t => t.id !== newText.id));
            }, 2000);
        }
    };

    const handleBuyTon = () => {
        alert('This feature is coming soon!');
    };

    const energyPercentage = (energy / maxEnergy) * 100;

    return (
        <div className="w-full h-full flex flex-col justify-between items-center text-center pb-20">
            {/* Points Display */}
            <div className="flex flex-col items-center mt-4">
                <span className="text-gray-500 font-medium">SECCO-Points Balance</span>
                <h1 className="text-5xl font-extrabold text-black">
                    {points.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </h1>
                <p className="text-gray-500 font-medium mt-1">+{pointsPerTap.toFixed(1)} per tap</p>
            </div>
            
            {/* Floating text container */}
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


            {/* Energy Bar and TON buttons */}
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">⚡️ Energy: {Math.floor(energy)}/{maxEnergy}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${energyPercentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center gap-2">
                     <button 
                        onClick={handleBuyTon}
                        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                        <span>Buy TON</span>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.32 12.68c-.14.4-.46.72-.88.88l-2.03.78c-.19.07-.39.07-.58 0l-2.03-.78c-.42-.16-.74-.48-.88-.88l-.78-2.03c-.07-.19-.07-.39 0-.58l.78-2.03c.14-.4.46-.72.88-.88l2.03-.78c.19-.07.39-.07-.58 0l2.03.78c.42.16.74.48.88.88l.78 2.03c.07.19.07.39 0 .58l-.78 2.03z" fill="#fff"/><path d="M12.63 12.38l1.39-1.39-1.1-2.92-2.3.87.61.61-1.38 1.38 2.78 1.45zM12 13.16l-2.42.91.91-2.42 1.51 1.51z" fill="#007aff"/></svg>
                    </button>
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