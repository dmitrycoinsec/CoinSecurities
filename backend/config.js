м все новое // Configuration file for CoinSecurities Backend
export const config = {
    // Server Configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Frontend URL
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // TON Configuration
    tonRecipientWallet: process.env.TON_RECIPIENT_WALLET || 'UQBOxIuUPXHOu1fY0O7uGe9yIIaa0-DRcLIk2qVNa_0tZbFD',
    boosterPriceTon: parseFloat(process.env.BOOSTER_PRICE_TON || '0.5'),
    boosterDurationMinutes: parseInt(process.env.BOOSTER_DURATION_MINUTES || '30'),
    
    // Database
    databasePath: process.env.DATABASE_PATH || './database.sqlite',
    
    // TON API (for production)
    tonApiKey: process.env.TON_API_KEY || null,
    tonNetwork: process.env.TON_NETWORK || 'testnet',
    
    // Game Configuration
    game: {
        defaultPoints: 0,
        defaultEnergy: 500,
        defaultMaxEnergy: 500,
        defaultPointsPerTap: 0.1,
        defaultPassiveIncome: 0,
        energyRechargeTime: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
        referralBonus: 10000
    }
};
