import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import useGameLogic from './hooks/useGameLogic';
import InvestScreen from './screens/InvestScreen';
import Preloader from './components/Preloader';

export type Screen = 'home' | 'shop' | 'invest' | 'wallet' | 'profile';

const App: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const gameLogic = useGameLogic();

    const screens: { id: Screen; component: React.FC<any> }[] = [
        { id: 'home', component: HomeScreen },
        { id: 'shop', component: ShopScreen },
        { id: 'invest', component: InvestScreen },
        { id: 'wallet', component: WalletScreen },
        { id: 'profile', component: ProfileScreen },
    ];
    
     const componentProps = {
        ...gameLogic,
        applyBooster: gameLogic.applyBooster, // Pass applyBooster specifically
    };


    return (
        <div className="min-h-screen w-full flex flex-col items-center text-black selection:bg-blue-200 bg-transparent overflow-hidden">
            <Header />
            <main className="w-full max-w-md p-4 flex-grow relative">
                {screens.map(({ id, component: Component }) => {
                    if (activeScreen !== id) return null;
                    return (
                        <div
                            key={id}
                            className="w-full h-full transition-all duration-300 ease-in-out"
                        >
                            <Component 
                                {...gameLogic} 
                                boosterEndTime={gameLogic.boosterEndTime} 
                                applyBooster={gameLogic.applyBooster}
                            />
                        </div>
                    );
                })}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default App;