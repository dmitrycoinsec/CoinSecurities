import { getDatabase } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const BOOSTER_DURATION_MINUTES = 30;

/**
 * Apply booster to user
 * @param {string} userAddress - User's wallet address
 * @param {string} boosterType - Type of booster
 * @returns {Promise<{success: boolean, boosterEndTime?: number, error?: string}>}
 */
export async function applyBooster(userAddress, boosterType = 'standard') {
    const db = getDatabase();
    const run = promisify(db.run.bind(db));
    const get = promisify(db.get.bind(db));

    try {
        const now = Date.now();
        const boosterEndTime = now + (BOOSTER_DURATION_MINUTES * 60 * 1000);

        // Insert booster record
        await run(`
            INSERT INTO boosters (user_address, booster_type, start_time, end_time, is_active)
            VALUES (?, ?, ?, ?, ?)
        `, [userAddress, boosterType, now, boosterEndTime, true]);

        // Update user's booster end time
        await run(`
            INSERT OR REPLACE INTO users (address, boosterEndTime, updated_at)
            VALUES (?, ?, ?)
        `, [userAddress, boosterEndTime, now]);

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

/**
 * Get user game data
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<object>} User's game data
 */
export async function getUserData(userAddress) {
    const db = getDatabase();
    const get = promisify(db.get.bind(db));
    const all = promisify(db.all.bind(db));

    try {
        // Get user basic data
        const user = await get(`
            SELECT * FROM users WHERE address = ?
        `, [userAddress]);

        if (!user) {
            // Create new user with default values
            return await createNewUser(userAddress);
        }

        // Get user upgrades
        const upgrades = await all(`
            SELECT * FROM user_upgrades WHERE user_address = ?
        `, [userAddress]);

        // Get user investments
        const investments = await all(`
            SELECT * FROM user_investments WHERE user_address = ?
        `, [userAddress]);

        // Get active boosters
        const activeBoosters = await all(`
            SELECT * FROM boosters 
            WHERE user_address = ? AND is_active = TRUE AND end_time > ?
        `, [userAddress, Date.now()]);

        // Format upgrades
        const upgradesObj = {
            powerTap: { id: 'powerTap', level: 1, price: 150, increase: 0.5 },
            megaClick: { id: 'megaClick', level: 1, price: 500, increase: 1 },
            basicAuto: { id: 'basicAuto', level: 0, price: 1000, increase: 10 },
            turboAuto: { id: 'turboAuto', level: 0, price: 5000, increase: 50 }
        };

        upgrades.forEach(upgrade => {
            if (upgradesObj[upgrade.upgrade_id]) {
                upgradesObj[upgrade.upgrade_id] = {
                    id: upgrade.upgrade_id,
                    level: upgrade.level,
                    price: upgrade.price,
                    increase: upgrade.increase
                };
            }
        });

        // Format investments
        const investmentsObj = {};
        investments.forEach(investment => {
            investmentsObj[investment.stock_id] = {
                amountInvested: investment.amount_invested,
                lastUpdated: investment.last_updated
            };
        });

        return {
            points: user.points || 0,
            energy: user.energy || 500,
            maxEnergy: user.maxEnergy || 500,
            pointsPerTap: user.pointsPerTap || 0.1,
            passiveIncome: user.passiveIncome || 0,
            upgrades: upgradesObj,
            investments: investmentsObj,
            lastTick: user.lastTick || Date.now(),
            boosterEndTime: user.boosterEndTime,
            referralBonusClaimed: user.referralBonusClaimed || false
        };

    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

/**
 * Save user game data
 * @param {string} userAddress - User's wallet address
 * @param {object} gameData - Game data to save
 */
export async function saveUserData(userAddress, gameData) {
    const db = getDatabase();
    const run = promisify(db.run.bind(db));

    try {
        const now = Date.now();

        // Update user basic data
        await run(`
            INSERT OR REPLACE INTO users (
                address, points, energy, maxEnergy, pointsPerTap, 
                passiveIncome, lastTick, boosterEndTime, referralBonusClaimed, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userAddress,
            gameData.points || 0,
            gameData.energy || 500,
            gameData.maxEnergy || 500,
            gameData.pointsPerTap || 0.1,
            gameData.passiveIncome || 0,
            gameData.lastTick || now,
            gameData.boosterEndTime || null,
            gameData.referralBonusClaimed || false,
            now
        ]);

        // Update upgrades
        if (gameData.upgrades) {
            for (const [upgradeId, upgrade] of Object.entries(gameData.upgrades)) {
                await run(`
                    INSERT OR REPLACE INTO user_upgrades (
                        user_address, upgrade_id, level, price, increase
                    ) VALUES (?, ?, ?, ?, ?)
                `, [userAddress, upgradeId, upgrade.level, upgrade.price, upgrade.increase]);
            }
        }

        // Update investments
        if (gameData.investments) {
            for (const [stockId, investment] of Object.entries(gameData.investments)) {
                await run(`
                    INSERT OR REPLACE INTO user_investments (
                        user_address, stock_id, amount_invested, last_updated
                    ) VALUES (?, ?, ?, ?)
                `, [userAddress, stockId, investment.amountInvested, investment.lastUpdated]);
            }
        }

        console.log(`✅ Game data saved for user ${userAddress}`);

    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

/**
 * Create new user with default values
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<object>} Default user data
 */
async function createNewUser(userAddress) {
    const db = getDatabase();
    const run = promisify(db.run.bind(db));

    const now = Date.now();
    const defaultData = {
        points: 0,
        energy: 500,
        maxEnergy: 500,
        pointsPerTap: 0.1,
        passiveIncome: 0,
        lastTick: now,
        boosterEndTime: null,
        referralBonusClaimed: false
    };

    // Insert new user
    await run(`
        INSERT INTO users (
            address, points, energy, maxEnergy, pointsPerTap, 
            passiveIncome, lastTick, boosterEndTime, referralBonusClaimed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        userAddress,
        defaultData.points,
        defaultData.energy,
        defaultData.maxEnergy,
        defaultData.pointsPerTap,
        defaultData.passiveIncome,
        defaultData.lastTick,
        defaultData.boosterEndTime,
        defaultData.referralBonusClaimed
    ]);

    // Insert default upgrades
    const defaultUpgrades = [
        ['powerTap', 1, 150, 0.5],
        ['megaClick', 1, 500, 1],
        ['basicAuto', 0, 1000, 10],
        ['turboAuto', 0, 5000, 50]
    ];

    for (const [upgradeId, level, price, increase] of defaultUpgrades) {
        await run(`
            INSERT INTO user_upgrades (user_address, upgrade_id, level, price, increase)
            VALUES (?, ?, ?, ?, ?)
        `, [userAddress, upgradeId, level, price, increase]);
    }

    console.log(`✅ New user created: ${userAddress}`);

    return {
        ...defaultData,
        upgrades: {
            powerTap: { id: 'powerTap', level: 1, price: 150, increase: 0.5 },
            megaClick: { id: 'megaClick', level: 1, price: 500, increase: 1 },
            basicAuto: { id: 'basicAuto', level: 0, price: 1000, increase: 10 },
            turboAuto: { id: 'turboAuto', level: 0, price: 5000, increase: 50 }
        },
        investments: {}
    };
}

/**
 * Get user transaction history
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<Array>} Transaction history
 */
export async function getUserTransactions(userAddress) {
    const db = getDatabase();
    const all = promisify(db.all.bind(db));

    try {
        const transactions = await all(`
            SELECT * FROM transactions 
            WHERE user_address = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        `, [userAddress]);

        return transactions;
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw error;
    }
}

// Helper function to promisify database methods
function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}
