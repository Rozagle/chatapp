import express from 'express';
import {
  signupController,
  loginController,
  logoutController,
  OnboardingController
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// post Endpoints to send informations
router.post('/signup', signupController); 
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/onboarding', protectRoute, OnboardingController); // Protected route add cause should protect in middleware

router.get('/test', protectRoute, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});
//forget password 
//send reset password mail 
// ikisinide sonra ekle
export default router;