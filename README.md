# Village Hub — Web-Based Rural Community & Development Platform

Village Hub is a full-stack digital rural empowerment and governance platform for Western Uttar Pradesh (covering 46 villages across Hapur, Ghaziabad, Meerut, Bulandshahr, Noida, and Greater Noida).

---

## 🏗️ Architecture Overview

- **Frontend**: Vanilla HTML5, Modern Glassmorphism Design System (CSS3), Interactive Leaflet.js Mapping, Responsive Navigation with Hamburger Drawer, Need Matcher Wizard, and Client-Side REST API Consumer (`js/api.js`).
- **Backend**: Node.js & Express.js REST API with modular MVC architecture (`server/`).
- **Authentication & Security**:
  - JWT (JSON Web Tokens) with 7-day expiration.
  - bcrypt.js password hashing (10 salt rounds).
  - Server-side Role-Based Access Control (RBAC) middleware (`auth.js`, `admin.js`).
  - Rate limiting with `express-rate-limit` (100 requests per 15 minutes per IP on `/api/*`).
  - Strict input validation and safe error responses (no stack traces exposed to clients).
  - Environment variables for all secrets (`.env`).
- **Database Architecture**:
  - **Primary**: MongoDB with Mongoose ORM.
  - **Development Fallback**: Local JSON persistence engine (`server/data/`) for zero-dependency local development when MongoDB is not running.
  - At startup, the server automatically detects whether MongoDB is connected or reports the development fallback mode.

---

## 🚀 Quick Start & Running Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB** (Optional): MongoDB Community Server running on `localhost:27017` (if not running, the development JSON fallback activates automatically).

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` template to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/villagehub
JWT_SECRET=your_strong_random_jwt_secret
ADMIN_EMAIL=admin@villagehub.in
ADMIN_PASSWORD=your_secure_admin_password
```

### 4. Database Seeding
Populate the database with the official 46-village Western UP census dataset and initialize the administrator account:
```bash
npm run seed
```

### 5. Start the Server
Start the Village Hub application server:
```bash
npm start
# or for development
npm run dev
```

The application will be accessible at: **`http://localhost:5000`**

### 6. Run Automated Test Suite
Run the automated end-to-end API test suite:
```bash
node server/test_suite.js
```

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register citizen account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with email and password, returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### 🏘️ Village Directory (`/api/villages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/villages` | Public | List all villages (filters: `?district=`, `?status=`, `?search=`) |
| `GET` | `/api/villages/:id` | Public | Get single village details by ID |
| `POST` | `/api/villages` | Admin Only | Create new village project |
| `PUT` | `/api/villages/:id` | Admin Only | Update village details, progress, or status |
| `DELETE` | `/api/villages/:id` | Admin Only | Delete village project |

### 📝 Citizen Complaints & Grievances (`/api/complaints`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Public | Submit village grievance (auto-assigns `CMP-XXXX` ID, status: `Submitted`) |
| `GET` | `/api/complaints` | Auth / Admin | Get citizen's own complaints (or all if admin) |
| `GET` | `/api/complaints/track/:query`| Public | Live tracking by Complaint ID or 10-digit Phone Number |
| `GET` | `/api/complaints/:id` | Public | Get single complaint by ID |
| `PUT` | `/api/complaints/:id/status` | Admin Only | Update status (`Under Review`, `In Progress`, `Resolved`, `Rejected`). *Complaints are never deleted to preserve audit history.* |

### 🤝 Volunteer & Member Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Public | Submit membership/volunteer application |
| `GET` | `/api/applications` | Admin Only | List all submitted applications |
| `PUT` | `/api/applications/:id/status` | Admin Only | Update application status (`Approved`, `Rejected`) |

### 📊 Platform Statistics (`/api/stats`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats` | Public | Real-time platform counts (villages, complaints, applications, projects) |

---

## 🏛️ Project Pages Overview

1. **`index.html`** — Homepage with hero stats, interactive preview, quick-action cards, and featured villages.
2. **`villages.html`** — Multi-district filtered census directory (46 villages) with live search and details modal.
3. **`schemes.html`** — Government Schemes & Need Matcher Wizard with 10 Central/UP schemes and step-by-step application instructions.
4. **`complaint.html`** — Citizen grievance registration form with image preview and live complaint tracking timeline.
5. **`map.html`** — Fullscreen interactive Leaflet map of Western UP with village status markers and popups.
6. **`admin.html`** — Protected Administrative Dashboard with JWT authentication, village CRUD, complaint review, and application approval.
7. **`dashboard.html`** — Citizen Member Dashboard displaying submitted grievances and application status.
8. **`register.html`** — Youth leader, volunteer, and CSR sponsor enlistment form.
9. **`benefits.html`** — Platform impact analysis and village transformation benefits.
10. **`terms.html`** — Terms of service and citizen data privacy policies.

---

## 🔒 Security & Privacy Notice

- All administrator operations require a signed JWT token with `role: "admin"`.
- Passwords are never stored in plaintext and are hashed using bcrypt with salt rounds = 10.
- Resolved citizen grievances are preserved in the system with their complete lifecycle status.
- Village Hub is a community development initiative and grievance monitoring platform for rural Uttar Pradesh.
