/*const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the env variable
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};*/
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    console.log("Authorization Header:", req.headers["authorization"]); // ✅ Check if the token is received
    /*const newToken = jwt.sign(
        { id: "67cc658037ee90062d67ba2b" }, // Use the correct user ID
        process.env.JWT_SECRET,  // Ensure JWT_SECRET is correctly loaded
        { expiresIn: "1h" }  // Change expiration if needed (e.g., "24h")
      );
      
      console.log("New Token:", newToken);*/
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        console.log("No token received"); // ✅ Debugging
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const token = authHeader.split(" ")[1];  // ✅ Extract only the token part
        console.log("Extracted Token:", token);  // ✅ Debugging
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Token verification failed:", err.message); // ✅ Debugging
        res.status(401).json({ message: "Token is not valid" });
    }
};

