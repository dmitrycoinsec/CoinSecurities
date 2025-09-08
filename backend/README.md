# CoinSecurities Backend

Backend API для игры CoinSecurities с верификацией TON транзакций.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Запуск в продакшене
```bash
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Проверка состояния сервера.

### Верификация транзакции
```
POST /api/verify-transaction
```
Верифицирует TON транзакцию и применяет бустер.

**Body:**
```json
{
  "boc": "base64_encoded_boc",
  "userAddress": "TON_wallet_address",
  "boosterType": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction verified and booster applied",
  "boosterEndTime": 1234567890
}
```

### Получение данных пользователя
```
GET /api/user/:address
```
Возвращает игровые данные пользователя.

### Сохранение данных пользователя
```
POST /api/user/:address/save
```
Сохраняет игровые данные пользователя.

**Body:**
```json
{
  "points": 1000,
  "energy": 500,
  "upgrades": {...},
  "investments": {...}
}
```

### История транзакций
```
GET /api/user/:address/transactions
```
Возвращает историю транзакций пользователя.

## 🗄️ База данных

Используется SQLite с следующими таблицами:
- `users` - основные данные пользователей
- `user_upgrades` - улучшения пользователей
- `user_investments` - инвестиции пользователей
- `transactions` - история транзакций
- `boosters` - активные бустеры

## 🔧 Конфигурация

Настройки в `config.js`:
- Порт сервера
- URL фронтенда
- TON кошелек получателя
- Цена бустера
- Настройки игры

## 🛡️ Безопасность

- CORS настроен для фронтенда
- Валидация входных данных
- Верификация TON транзакций
- Защита от SQL инъекций

## 📝 TODO

- [ ] Полная верификация TON транзакций через API
- [ ] Аутентификация пользователей
- [ ] Rate limiting
- [ ] Логирование
- [ ] Мониторинг
