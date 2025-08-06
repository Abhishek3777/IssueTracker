const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

exports.authenticate = async (req, res, next) => {

    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access denied. No token." });
    const token = authHeader.replace("Bearer", "").trim();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

const allowedTransitions = {
    Open: ["In Progress"],
    "In Progress": ["Resolved"],
    Resolved: ["Closed", "UnResolved"],
    Unresolved: ["In Progress"],
};

exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden : Insufficient Role' });
        }
        next();
    };
};
