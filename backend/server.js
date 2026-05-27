const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/uploads");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));


app.use(express.json());

// open frontend without Live Server
app.use(express.static(path.join(__dirname, "../frontend")));

// open uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
