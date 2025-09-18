import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization middleware
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role 
      });
    }

    next();
  };
};

// Team permission middleware
export const requireTeamAccess = (permission = 'view') => {
  return async (req, res, next) => {
    try {
      const teamId = req.params.teamId || req.body.teamId;
      
      if (!teamId) {
        return res.status(400).json({ error: 'Team ID required' });
      }

      // Check if user is a member of the team
      const userTeams = req.user.teams.map(team => team.toString());
      
      if (!userTeams.includes(teamId)) {
        return res.status(403).json({ error: 'Access denied - not a team member' });
      }

      // For more granular permissions, you would check the user's role within the team
      // This would require populating the team membership details

      next();
    } catch (error) {
      console.error('Team access middleware error:', error);
      res.status(500).json({ error: 'Team access validation failed' });
    }
  };
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Optional authentication (for public routes that might have optional auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    next();
  }
};