import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as any,
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret as string) as JwtPayload;
};

export const JwtUtils = {
  generateToken,
  verifyToken,
};
