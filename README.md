# CoinSecurities - Tap to Earn Game

A React-based tap-to-earn game with TON blockchain integration.

## 🎮 Features

- **Tap to Earn**: Earn points by tapping the main button
- **Energy System**: Limited energy that regenerates over time
- **Upgrades**: Purchase power-ups to increase earnings
- **Investments**: Invest in virtual stocks with APY returns
- **TON Integration**: Connect TON wallet and buy boosters
- **Referral System**: Earn bonus points for referrals

## 🚀 Live Demo

[Play the Game](https://dmitrycoinsec.github.io/CoinSecurities-main/)

## 🛠️ Local Development

1. Clone the repository:
```bash
git clone https://github.com/dmitrycoinsec/CoinSecurities-main.git
cd CoinSecurities-main
```

2. Install dependencies:
```bash
cd CoinSecurities-main
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📱 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: TON Connect
- **Deployment**: GitHub Pages

## 🎯 Game Mechanics

- **Points**: Earned by tapping, affected by upgrades
- **Energy**: Consumed per tap, regenerates over 6 hours
- **Upgrades**: Power Tap, Mega Click, Auto-Farm systems
- **Investments**: 3 virtual stocks with different APY rates
- **Boosters**: 2x points + infinite energy for 30 minutes

## 🔗 API Endpoints

- `GET /api/health` - Health check
- `POST /api/verify-transaction` - Verify TON transactions
- `GET /api/user/:address` - Get user data
- `POST /api/user/:address/save` - Save user data

## 📄 License

MIT License
