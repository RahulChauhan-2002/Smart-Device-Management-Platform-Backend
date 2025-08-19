# Curvvtech Backend Developer Assignment – Smart Device Management API

A production-ready Node/Express + MongoDB backend that lets users register, authenticate, and manage IoT-style devices (logging, analytics, heartbeats). Designed for scalability, includes rate-limiting, background jobs, Docker support and automated tests.

---

## 1 Tech Stack
* **Runtime:** Node.js 18  
* **Framework:** Express 5  
* **Database:** MongoDB Atlas (Mongoose 7)  
* **Auth:** JWT (http-only cookies)  
* **Validation:** Joi  
* **Background jobs:** node-cron  
* **Rate limiting:** express-rate-limit (100 req / min / user)  
* **Testing:** Jest + Supertest  
* **Containerisation:** Docker & docker-compose  
* **Lint/format:** ESLint, Prettier  

---

## 2 Setup Instructions

### Prerequisites
1. Node ≥ 18, npm ≥ 9  
2. Docker & docker-compose (optional but recommended)

### Clone & install<br/>
git clone https://github.com/<your-handle>/curvvtech-device-backend.git<br/>
cd curvvtech-device-backend<br/>
npm install<br/>
cp .env.example .env # fill in DB_URI, JWT_SECRET, etc.


### Local run
npm run dev # nodemon reload
### Docker run
docker-compose up --build
API available at `http://localhost:3000`.

---

## 3 Environment Variables (`.env.example`)<br/>
PORT=3000<br/>
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/curvv<br/>
JWT_SECRET=supersecret<br/>
JWT_EXPIRE=7d<br/>
JWT_COOKIE_EXPIRE=7 # days<br/>
RATE_LIMIT_WINDOW=60 # seconds<br/>
RATE_LIMIT_MAX=100

---

## 4 Folder Structure<br/>
curvvtech-device-backend/<br/>
├─ src/<br/>
│ ├─ config/ # db, rate-limiter<br/>
│ ├─ controllers/ # route handlers<br/>
│ ├─ services/ # business logic<br/>
│ ├─ models/ # Mongoose schemas<br/>
│ ├─ routes/ # express routers<br/>
│ ├─ middleware/ # auth, validation, error-handler<br/>
│ ├─ jobs/ # cron tasks (auto-deactivate)<br/>
│ └─ utils/ # helpers<br/>
├─ postman/ # Smart-Device.postman_collection.json<br/>
└─ README.md


---

## 5 API Reference  
All routes are prefixed with **`/api/v1`**.

### 5.1 User Management
| Method | Endpoint        | Description                   | Auth |
| ------ | --------------- | ----------------------------- | ---- |
| POST   | `/auth/signup`  | Register new account          | ❌   |
| POST   | `/auth/login`   | Login, returns JWT cookie     | ❌   |

**Signup – request**
{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePass123",
"role": "user"
}
**Signup – response**
{ "success": true, "message": "User registered successfully" }

**Login – request**
{ "email": "john@example.com", "password": "SecurePass123" }
**Login – response** (`Set-Cookie: token=…`)
{
"success": true,
"token": "<jwt>",
"user": { "id":"u1","name":"John Doe","email":"john@example.com","role":"user" }
}

---

### 5.2 Device Management (Requires Auth)
| Method | Endpoint                   | Description                          |
| ------ | -------------------------- | ------------------------------------ |
| POST   | `/devices`                 | Register new device                  |
| GET    | `/devices?type=&status=`   | List devices (filter optional)       |
| PATCH  | `/devices/:id`             | Update device                        |
| DELETE | `/devices/:id`             | Delete device                        |
| POST   | `/devices/:id/heartbeat`   | Update status + last_active_at       |

**Register device – request**
{ "name":"Living Room Light", "type":"light", "status":"active" }
**Register device – response**
{
"success": true,
"device": {
"id": "d1",
"name": "Living Room Light",
"type": "light",
"status": "active",
"last_active_at": null,
"owner_id": "u1"
}
}

text

**Heartbeat – request**
{ "status": "active" }

text
**Heartbeat – response**
{
"success": true,
"message": "Device heartbeat recorded",
"last_active_at": "2025-08-17T10:15:30Z"
}

text

---

### 5.3 Logs & Analytics (Requires Auth)
| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| POST   | `/devices/:id/logs`                   | Create log entry               |
| GET    | `/devices/:id/logs?limit=10`          | Fetch last *n* logs            |
| GET    | `/devices/:id/usage?range=24h`        | Aggregated usage (rolling)     |

Example log entry request:
{ "event": "units_consumed", "value": 2.5 }

text

---

## 6 Advanced Features
1. **Rate limiting** – 100 requests/min per user/IP  
2. **Background job** – runs hourly; sets `status=inactive` if `last_active_at` > 24 h  
3. **Unit tests** – `npm test` (coverage included)  
4. **Docker** – one-command startup (`docker-compose up`)  
5. **CI** – GitHub Actions: lint + tests on each PR  

---

## 7 Running Tests
npm test

text
Generates coverage report in `/coverage`.

---

## 8 Postman Collection
Import **`postman/Smart-Device.postman_collection.json`**.  
Environment variable `{{base_url}}` defaults to `http://localhost:3000`.

---

## 9 Assumptions
* Device `type` limited to `light | fan | ac | smart_meter | sensor`  
* Only `units_consumed` events aggregated for usage endpoint  
* Roles: `user` (default) & `admin`; fine-grained RBAC out-of-scope  
* Passwords hashed with bcrypt (12 rounds)  
* Email uniqueness enforced at DB level  

---

## 10 Future Work
* MQTT/web-socket layer for real-time updates  
* Swap Mongoose for Prisma + PostgreSQL  
* Autoscaling deployment on AWS ECS/Fargate

