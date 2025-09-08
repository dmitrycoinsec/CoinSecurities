import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

/**
 * Initialize SQLite database
 */
export async function initDatabase() {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(__dirname, '..', 'database.sqlite');
        
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
            } else {
                console.log('📊 Connected to SQLite database');
                createTables().then(resolve).catch(reject);
            }
        });
    });
}

/**
 * Create database tables
 */
async function createTables() {
    const run = promisify(db.run.bind(db));
    
    try {
        // Users table
        await run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                address TEXT UNIQUE NOT NULL,
                points INTEGER DEFAULT 0,
                energy INTEGER DEFAULT 500,
                maxEnergy INTEGER DEFAULT 500,
                pointsPerTap REAL DEFAULT 0.1,
                passiveIncome REAL DEFAULT 0,
                lastTick INTEGER DEFAULT 0,
                boosterEndTime INTEGER DEFAULT NULL,
                referralBonusClaimed BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // User upgrades table
        await run(`
            CREATE TABLE IF NOT EXISTS user_upgrades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_address TEXT NOT NULL,
                upgrade_id TEXT NOT NULL,
                level INTEGER DEFAULT 1,
                price INTEGER NOT NULL,
                increase REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_address) REFERENCES users (address)
            )
        `);

        // User investments table
        await run(`
            CREATE TABLE IF NOT EXISTS user_investments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_address TEXT NOT NULL,
                stock_id TEXT NOT NULL,
                amount_invested REAL NOT NULL,
                last_updated INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_address) REFERENCES users (address)
            )
        `);

        // Transactions table
        await run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_address TEXT NOT NULL,
                transaction_boc TEXT NOT NULL,
                transaction_type TEXT NOT NULL,
                amount_nanoton TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                verified_at DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_address) REFERENCES users (address)
            )
        `);

        // Boosters table
        await run(`
            CREATE TABLE IF NOT EXISTS boosters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_address TEXT NOT NULL,
                booster_type TEXT NOT NULL,
                start_time INTEGER NOT NULL,
                end_time INTEGER NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_address) REFERENCES users (address)
            )
        `);

        console.log('✅ Database tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

/**
 * Get database instance
 */
export function getDatabase() {
    return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('📊 Database connection closed');
            }
        });
    }
}
