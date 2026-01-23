import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        const user = await User.findById(decoded.id).select('-password'); // Exclude password field to delete password from response security risks 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }
        req.user = user;
        next(); // Go to next parameter in the route
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};