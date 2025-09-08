import { verifyTransaction } from '../backend/services/tonVerificationSimple.js';
import { applyBooster } from '../backend/services/gameServiceSimple.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

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
}
