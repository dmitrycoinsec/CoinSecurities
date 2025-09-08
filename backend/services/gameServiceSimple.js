// Simplified game service for Vercel serverless
// Using in-memory storage for demo purposes

const userData = new Map();
const BOOSTER_DURATION_MINUTES = 30;

export async function applyBooster(userAddress, boosterType = 'standard') {
    try {
        const now = Date.now();
        const boosterEndTime = now + (BOOSTER_DURATION_MINUTES * 60 * 1000);

        // Get or create user data
        let user = userData.get(userAddress) || createDefaultUser(userAddress);
        
        // Apply booster
        user.boosterEndTime = boosterEndTime;
        user.lastUpdated = now;
        
        // Save user data
        userData.set(userAddress, user);

        console.log(`✅ Booster applied for user ${userAddress}, ends at ${new Date(boosterEndTime)}`);

        return {
            success: true,
            boosterEndTime: boosterEndTime
        };

    } catch (error) {
        console.error('Error applying booster:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getUserData(userAddress) {
    try {
        let user = userData.get(userAddress);
        
        if (!user) {
            user = createDefaultUser(userAddress);
            userData.set(userAddress, user);
        }

        // Calculate offline progress
        const now = Date.now();
        const timeOfflineInSeconds = (now - user.lastTick) / 1000;

        if (user.passiveIncome > 0) {
            const passiveEarnings = timeOfflineInSeconds * (user.passiveIncome / 60);
            user.points += passiveEarnings;
        }

        // Update energy
        const isBoosterActive = user.boosterEndTime && now < user.boosterEndTime;
        if (isBoosterActive) {
            user.energy = user.maxEnergy;
        } else {
            const energyRegen = (timeOfflineInSeconds / (6 * 60 * 60)) * user.maxEnergy;
            user.energy = Math.min(user.maxEnergy, user.energy + energyRegen);
        }

        user.lastTick = now;
        userData.set(userAddress, user);

        return user;

    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

export async function saveUserData(userAddress, gameData) {
    try {
        const now = Date.now();
        const user = {
            ...gameData,
            lastUpdated: now
        };
        
        userData.set(userAddress, user);
        console.log(`✅ Game data saved for user ${userAddress}`);

    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

export async function getUserTransactions(userAddress) {
    // Return empty array for now
    // In production, this would query a database
    return [];
}

function createDefaultUser(userAddress) {
    return {
        address: userAddress,
        points: 0,
        energy: 500,
        maxEnergy: 500,
        pointsPerTap: 0.1,
        passiveIncome: 0,
        upgrades: {
            powerTap: { id: 'powerTap', level: 1, price: 150, increase: 0.5 },
            megaClick: { id: 'megaClick', level: 1, price: 500, increase: 1 },
            basicAuto: { id: 'basicAuto', level: 0, price: 1000, increase: 10 },
            turboAuto: { id: 'turboAuto', level: 0, price: 5000, increase: 50 }
        },
        investments: {},
        lastTick: Date.now(),
        boosterEndTime: null,
        referralBonusClaimed: false,
        lastUpdated: Date.now()
    };
}
