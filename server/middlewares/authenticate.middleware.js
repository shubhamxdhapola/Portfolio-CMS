import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = req?.cookies?.access_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Invalid or expired token'
        });
      }

      const userId = decodedToken.userId;
      const user =
        await User.findById(userId).select('+tokenVersion');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User not found'
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      if (
        decodedToken.tokenVersion !== undefined &&
        user.tokenVersion !== undefined &&
        decodedToken.tokenVersion !== user.tokenVersion
      ) {
        return res.status(401).json({
          success: false,
          message: 'Session expired, please login again'
        });
      }

      req.user = user;
      req.admin = user;
      next();
    });
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden - Administrator privileges required' });
};

export const protect = authenticate;
export default authenticate;