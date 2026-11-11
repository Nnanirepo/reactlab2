const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "StudentMart API is running"
    });
});

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Return JSON for unknown API routes.
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

const PORT = process.env.PORT || 5002;
const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";

const startServer = async () => {
    let connected = false;

    // 1. Try Atlas connection if configured
    if (rawUri && !rawUri.includes("<username>") && !rawUri.includes("<password>")) {
        try {
            console.log("🔄 Connecting to configured MongoDB Atlas database...");
            const conn = await mongoose.connect(rawUri, {
                serverSelectionTimeoutMS: 3000
            });
            console.log(`✅ Connected to MongoDB Atlas at: ${conn.connection.host}`);
            connected = true;
        } catch (err) {
            console.warn(`⚠️ Could not reach Atlas (${err.message}). Trying local MongoDB on port 27017...`);
        }
    }

    // 2. Try Local MongoDB on standard port 27017 (Compass default)
    if (!connected) {
        try {
            const localUri = "mongodb://127.0.0.1:27017/studentmart_db";
            const conn = await mongoose.connect(localUri, {
                serverSelectionTimeoutMS: 2000
            });
            console.log(`✅ Connected to persistent Local MongoDB at: ${conn.connection.host}:27017 (Database: studentmart_db)`);
            connected = true;
        } catch (err) {
            console.warn(`⚠️ Local MongoDB port 27017 not available (${err.message}). Trying in-memory DB...`);
        }
    }

    // 3. Fallback to in-memory DB if needed
    if (!connected) {
        try {
            const { MongoMemoryServer } = require("mongodb-memory-server");
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`✅ Connected via in-memory database at: ${uri}`);
            connected = true;
        } catch (err) {
            console.error("❌ Failed to start in-memory database:", err.message);
        }
    }

    app.listen(PORT, () => {
        console.log(`🚀 StudentMart Server running on http://localhost:${PORT}`);
    });
};

startServer();
