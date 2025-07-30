import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    console.log('🔍 Authentication Debug:', {
      cookies: req.cookies,
      headers: req.headers,
      url: req.url
    });
    
    // Support both cookie and Authorization header
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
      // Bearer <token>
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // console.log('✅ Token found:', token.substring(0, 20) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('✅ Token decoded:', {
      userId: decoded.userId,
      role: decoded.role
    });

    if (!decoded || !decoded.userId) {
      console.log('❌ Invalid token payload');
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.id = decoded.userId;
    req.role = decoded.role; // ✅ optional if you included role in token
    // console.log('✅ Authentication successful:', {
    //   id: req.id,
    //   role: req.role
    // });
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuthenticated;
