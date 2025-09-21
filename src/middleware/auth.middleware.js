import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
        
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed', error);
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin role required.' 
    });
  }
  next();
};

export const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
    
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }
    
  if (req.user.role === 'admin' || req.user.id === userId) {
    return next();
  }
    
  return res.status(403).json({ 
    message: 'Access denied. You can only access your own data.' 
  });
};