import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyTransaction } from './services/tonVerification.js';
import { initDatabase } from './services/database.js';
import { applyBooster, getUserData, saveUserData } from './services/gameService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Initialize database
await initDatabase();

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'CoinSecurities Backend is running' });
});

// Verify TON transaction and apply booster
app.post('/api/verify-transaction', async (req, res) => {
    try {
        const { boc, userAddress, boosterType } = req.body;
        
        if (!boc || !userAddress) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: boc, userAddress' 
            });
        }

        // Verify transaction on TON blockchain
        const verificationResult = await verifyTransaction(boc, userAddress);
        
        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                error: verificationResult.error
            });
        }

        // Apply booster to user
        const boosterResult = await applyBooster(userAddress, boosterType || 'standard');
        
        res.json({
            success: true,
            message: 'Transaction verified and booster applied',
            boosterEndTime: boosterResult.boosterEndTime
        });

    } catch (error) {
        console.error('Transaction verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get user game data
app.get('/api/user/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const userData = await getUserData(address);
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Get user data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user data'
        });
    }
});

// Save user game data
app.post('/api/user/:address/save', async (req, res) => {
    try {
        const { address } = req.params;
        const gameData = req.body;
        
        await saveUserData(address, gameData);
        
        res.json({
            success: true,
            message: 'Game data saved successfully'
        });
    } catch (error) {
        console.error('Save user data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save user data'
        });
    }
});

// Get transaction history
app.get('/api/user/:address/transactions', async (req, res) => {
    try {
        const { address } = req.params;
        // TODO: Implement transaction history
        res.json({
            success: true,
            data: []
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get transactions'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 CoinSecurities Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
