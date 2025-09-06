import React, { useMemo } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import RankIcon from '../components/icons/RankIcon';

interface ProfileScreenProps {
    points: number;
    passiveIncome: number;
}

interface LeaderboardEntry {
    name: string;
    points: number;
    isPlayer?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
    { name: 'CryptoKing', points: 15_234_567 }, { name: 'TapMaster', points: 12_098_345 },
    { name: 'CoinQueen', points: 11_567_890 }, { name: 'Satoshi Jr.', points: 9_876_543 },
    { name: 'Etherion', points: 8_765_432 }, { name: 'Lambooon', points: 7_654_321 },
    { name: 'DiamondHand', points: 6_543_210 }, { name: 'Whale Rider', points: 5_432_109 },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ points, passiveIncome }) => {
    const { user } = useTelegram();
    const playerName = user?.username || 'You';

    const sortedLeaderboard = useMemo(() => {
        const playerEntry: LeaderboardEntry = { name: playerName, points, isPlayer: true };
        const combined = [...mockLeaderboard, playerEntry];
        return combined.sort((a, b) => b.points - a.points);
    }, [points, playerName]);

    const handleInvite = () => {
        alert('The referral system is coming soon! Get ready to invite your friends.');
    };

    const StatCard: React.FC<{ label: string, value: string }> = ({ label, value }) => (
        <div className="bg-gray-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );

    return (
        <div className="w-full pb-20 flex flex-col items-center space-y-4">
             <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-6 w-full">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-3">
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <h1 className="text-2xl font-bold">{user?.first_name || 'Player'} {user?.last_name || ''}</h1>
                    <p className="text-gray-500">@{user?.username || 'telegram_user'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatCard label="Total Points" value={points.toLocaleString('en-US', { maximumFractionDigits: 1 })} />
                    <StatCard label="Passive Income" value={`${passiveIncome.toLocaleString()}/min`} />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                    <p className="text-blue-800">Invite a friend and get a bonus!</p>
                    <button
                        onClick={handleInvite}
                        className="mt-2 bg-blue-500 text-white font-bold py-2 px-5 rounded-lg"
                    >
                        Invite
                    </button>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-4 w-full">
                <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2"><RankIcon /> Global Ranking</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
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
            </div>
        </div>
    );
};

export default ProfileScreen;