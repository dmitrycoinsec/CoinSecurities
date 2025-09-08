export default function handler(req, res) {
    res.status(200).json({ 
        status: 'OK', 
        message: 'CoinSecurities Backend is running',
        timestamp: new Date().toISOString()
    });
}
