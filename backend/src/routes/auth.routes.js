import express from 'express';
import {
  signupController,
  loginController,
  logoutController
} from '../controllers/auth.controller.js';

const router = express.Router();

// post Endpoints to send informations
router.post('/signup', signupController); 
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;