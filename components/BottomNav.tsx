import React from 'react';
import { Screen } from '../App';
import HomeIcon from './icons/HomeIcon';
import ShopIcon from './icons/ShopIcon';
import ProfileIcon from './icons/ProfileIcon';
import InvestIcon from './icons/InvestIcon';
import WalletIcon from './icons/WalletIcon';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-1 w-full transition-colors duration-200 ${isActive ? 'text-[#007aff]' : 'text-gray-400'}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: <HomeIcon /> },
        { id: 'shop', label: 'Shop', icon: <ShopIcon /> },
        { id: 'invest', label: 'Invest', icon: <InvestIcon /> },
        { id: 'wallet', label: 'Wallet', icon: <WalletIcon /> },
        { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeScreen === item.id}
                        onClick={() => setActiveScreen(item.id as Screen)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNav;