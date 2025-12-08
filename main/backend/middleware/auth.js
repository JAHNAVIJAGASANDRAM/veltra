import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Securely load secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET is missing");
  process.exit(1);
}

// Utility: Extract Bearer token
const extractToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ error: "Invalid token - user not found" });
    if (!user.isActive) return res.status(401).json({ error: "Account is deactivated" });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Role-based authorization
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Team-based permission middleware
export const requireTeamAccess = (permission = "view") => {
  return async (req, res, next) => {
    try {
      const teamId = req.params.teamId || req.body.teamId;
      if (!teamId) return res.status(400).json({ error: "Team ID required" });

      // Ensure team data exists
      if (!req.user.teams || !Array.isArray(req.user.teams)) {
        return res.status(400).json({ error: "User team information not available" });
      }

      const isMember = req.user.teams.map(id => id.toString()).includes(teamId);
      if (!isMember) {
        return res.status(403).json({ error: "Access denied - not a team member" });
      }

      next();
    } catch (error) {
      console.error("Team access middleware error:", error);
      res.status(500).json({ error: "Team access validation failed" });
    }
  };
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// Optional authentication (public routes)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next(); // ignore errors
  }
};
