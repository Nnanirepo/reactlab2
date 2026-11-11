# Practical 02: User Profile Management System

Built based on [Pratyusha-Chowdary/React-NodeJS-Assignments - Practical 02](https://github.com/Pratyusha-Chowdary/React-NodeJS-Assignments/tree/main/Practical-02-User-Profile-Management).

## Features Included
1. **User Registration** (`POST /api/auth/register`)
2. **User Login & JWT Issuance** (`POST /api/auth/login`)
3. **View User Profile** (`GET /api/profile/me`)
4. **Edit User Profile** (`PUT /api/profile/me`) - updates name, phone, department, year, address
5. **Change Password** (`PUT /api/profile/change-password`) - verifies current password before hashing & updating new password
6. **MongoDB Atlas Database Storage**
7. **Protected Authentication** using JSON Web Tokens (JWT)

---

## Folder Structure

```
program 2/
├── package.json
├── README.md
├── server/
│   ├── .env               <-- Put your MongoDB Atlas connection string here
│   ├── .env.example
│   ├── package.json
│   ├── server.js          <-- Express app listening on port 5002
│   ├── models/
│   │   └── User.js        <-- Schema with name, email, password, phone, department, year, address
│   ├── middleware/
│   │   └── authMiddleware.js <-- Verifies Bearer JWT token
│   └── routes/
│       ├── authRoutes.js  <-- Register & Login routes
│       └── profileRoutes.js <-- View profile, Edit profile, Change password
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── components/
        │   ├── Register.jsx
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   └── Logout.jsx
        └── styles/
            ├── Register.css
            ├── Login.css
            └── Dashboard.css
```

---

## Quick Setup & Execution

### 1. Configure MongoDB Atlas
Open `server/.env` and replace `MONGO_URI` with your MongoDB Atlas connection string:
```env
PORT=5002
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studentmart_db?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_studentmart_12345
```

### 2. Install Dependencies
```bash
# In the server folder:
cd server
npm install

# In the client folder:
cd ../client
npm install
```

### 3. Start the Backend Server
```bash
cd server
npm start
```
Server runs on: **http://localhost:5002**

### 4. Start the Frontend React Client
```bash
cd client
npm run dev
```
Client runs on: **http://localhost:5173**
