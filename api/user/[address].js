import { getUserData, saveUserData } from '../../backend/services/gameServiceSimple.js';

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

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({
            success: false,
            error: 'Missing user address'
        });
    }

    try {
        if (req.method === 'GET') {
            // Get user data
            const userData = await getUserData(address);
            
            res.json({
                success: true,
                data: userData
            });
        } else if (req.method === 'POST') {
            // Save user data
            const gameData = req.body;
            await saveUserData(address, gameData);
            
            res.json({
                success: true,
                message: 'Game data saved successfully'
            });
        } else {
            res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }
    } catch (error) {
        console.error('User data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process user data'
        });
    }
}
