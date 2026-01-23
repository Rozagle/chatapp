import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecomendedUsers ,getMyContacts ,sendFriendRequest,acceptFriendRequest,getFriendRequest,outgoingFriendRequest } from '../controllers/user.controller.js';
const router = express.Router();

router.get ('/', protectRoute, getRecomendedUsers);
router.get ('/contact', protectRoute, getMyContacts);

router.post ('/friend-request/:id', protectRoute, sendFriendRequest);
router.put ('/friend-request/:id/accept', protectRoute, acceptFriendRequest);
router.get ('/friend-request/', protectRoute, getFriendRequest);
router.get ('/outgoing-friend-request/', protectRoute, outgoingFriendRequest);


export default router;