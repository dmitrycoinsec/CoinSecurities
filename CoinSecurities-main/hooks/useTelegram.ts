import { useMemo } from 'react';

declare global {
    interface Window {
        Telegram: {
            WebApp: any;
        };
    }
}

export function useTelegram() {
    const tg = useMemo(() => window.Telegram?.WebApp, []);

    return {
        tg,
        user: tg?.initDataUnsafe?.user,
        isReady: !!tg?.initData,
    };
}