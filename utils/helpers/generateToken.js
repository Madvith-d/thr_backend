import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  /// Load environment variables importantly before using them


const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15days',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
  });
};

export default generateTokenAndSetCookie;
