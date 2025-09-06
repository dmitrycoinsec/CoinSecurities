import React, { useMemo } from 'react';
import { useTelegram } from '../hooks/useTelegram';

interface LeaderboardScreenProps {
    points: number;
}

// Fix: Define an interface for leaderboard entries to solve type error on `isPlayer`.
interface LeaderboardEntry {
    name: string;
    points: number;
    isPlayer?: boolean;
}

// Mock data for the leaderboard
const mockLeaderboard: LeaderboardEntry[] = [
    { name: 'CryptoKing', points: 15_234_567 }, { name: 'TapMaster', points: 12_098_345 },
    { name: 'CoinQueen', points: 11_567_890 }, { name: 'Satoshi Jr.', points: 9_876_543 },
    { name: 'Etherion', points: 8_765_432 }, { name: 'Lambooon', points: 7_654_321 },
    { name: 'DiamondHand', points: 6_543_210 }, { name: 'Whale Rider', points: 5_432_109 },
    { name: 'TokenTitan', points: 4_321_098 }, { name: 'ProfitProphet', points: 3_210_987 },
    { name: 'ShibaInuLover', points: 2_109_876 }, { name: 'Mr. Hodl', points: 1_098_765 },
    { name: 'ToTheMoon', points: 987_654 }, { name: 'DeFi Don', points: 876_543 },
    { name: 'NFTCollector', points: 765_432 }, { name: 'Altcoin Andy', points: 654_321 },
    { name: 'Gas Fee Hater', points: 543_210 }, { name: 'YieldFarmer', points: 432_109 },
    { name: 'Bullrun Betty', points: 321_098 }, { name: 'Bear Market Bob', points: 210_987 },
    { name: 'Laser Eyes', points: 109_876 }, { name: 'Chad', points: 50_000 },
    { name: 'Gigachad', points: 10_000 },
];

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ points }) => {
    const { user } = useTelegram();
    const playerName = user?.username || 'You';

    const sortedLeaderboard = useMemo(() => {
        const playerEntry: LeaderboardEntry = { name: playerName, points, isPlayer: true };
        const combined = [...mockLeaderboard, playerEntry];
        return combined.sort((a, b) => b.points - a.points);
    }, [points, playerName]);

    return (
        <div className="w-full pb-20">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-4">
                <h1 className="text-2xl font-bold text-center mb-4">Global Player Ranking</h1>
                <div className="space-y-2">
                    {sortedLeaderboard.map((player, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-lg ${player.isPlayer ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}
                        >
                            <div className="flex-shrink-0 w-8 text-center font-bold text-lg">
                                {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                            </div>
                            <div className="ml-3 font-semibold truncate">
                                {player.name}
                            </div>
                            <div className="ml-auto font-bold text-right">
                                {Math.floor(player.points).toLocaleString()} P
                            </div>
                        </div>
                    ))}
                </div>
                 <p className="text-center text-xs text-gray-400 mt-4">
                    Note: The global ranking is currently a simulation for demonstration purposes.
                </p>
            </div>
        </div>
    );
};

export default LeaderboardScreen;