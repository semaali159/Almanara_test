# NestJS Shipments API

## Setup

```bash
npm install
```

Configure `.env`:
```
MONGODB_URI=mongodb://localhost:27017/shipments-db
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
JWT_ACCESS_SECRET=your_access_secret_key_change_this
JWT_ACCESS_EXPIRE_IN=your_Expire_in_access_change_this
JWT_REFRESH_EXPIRE_IN=your_Expire_in_refresh_change_this

```

```bash
npm run start:dev
```

---

## API Endpoints

### Auth (Public)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| POST | `/auth/refresh` | refresh token |

**Register:**
```json
POST /auth/register
{ "email": "user@example.com", "password": "123456" }
```

**Login:**
```json
POST /auth/login
{ "email": "user@example.com", "password": "123456" }
// Returns: { "access_token": "eyJ..." }
```

---

### Shipments (Protected - requires JWT)

Add header: `Authorization: Bearer <token>`

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/shipments` | Create shipment |
| GET | `/shipments` | Get all shipments |
| GET | `/shipments/:id` | Get shipment by ID |

**Create Shipment:**
```json
POST /shipments
{ "orderId": "ORD-001", "weight": 2.5, "isAvailable": true }
```
