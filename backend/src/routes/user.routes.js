import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateProfile,getRecomendedUsers ,getMyContacts ,sendFriendRequest,acceptFriendRequest,getFriendRequest,outgoingFriendRequest,rejectFriendRequest } from '../controllers/user.controller.js';
const router = express.Router();

router.get ('/', protectRoute, getRecomendedUsers);
router.get ('/contact', protectRoute, getMyContacts);
router.post('/profile', protectRoute, updateProfile);

router.post ('/friend-request/:id', protectRoute, sendFriendRequest);
router.put ('/friend-request/:id/accept', protectRoute, acceptFriendRequest);
router.get ('/friend-request/', protectRoute, getFriendRequest);
router.get ('/outgoing-friend-request/', protectRoute, outgoingFriendRequest);
router.put ('/friend-request/:id/reject', protectRoute, rejectFriendRequest);


export default router;