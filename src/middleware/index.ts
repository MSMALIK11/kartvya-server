
import jwt, { Secret, GetPublicKeyOrSecret } from 'jsonwebtoken';
import User, { IUserModel } from '../models/userModal';
import { Request, Response, NextFunction } from 'express';
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const secret = process?.env?.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'Login First' });
        }
        try {
            const decode: any = jwt.verify(token, secret);

            // // Check token expiration
            // if (new Date(decode.exp * 1000) < new Date()) {
            //     return res.status(401).json({ message: 'Token has expired, please log in again' });
            // }
            const userId = decode._id as string | undefined;
            console.log('userId', userId)
            // Attach user data to the request
            // req.user = await User.findById(userId) as IUserModel || "";
            req.user = (await User.findById(userId)) || undefined;
            next();
        } catch (error) {
            // Token verification failed
            return res.status(401).json({ message: 'Invalid token, please log in again' });
        }
    } catch (error) {
        // General error handling
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
