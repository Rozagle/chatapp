import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecomendedUsers ,getMyContacts } from '../controllers/user.controller.js';
const router = express.Router();

router.get ('/', protectRoute, getRecomendedUsers);
router.get ('/contact', protectRoute, getMyContacts);



export default router;