import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getStreamToken, getChatRooms, createChatRoom, getMessages, sendMessage } from '../controllers/chat.controller.js'; 

const router = express.Router();
router.get('/token', protectRoute, getStreamToken)
router.get('/rooms', protectRoute, getChatRooms);
router.post('/rooms', protectRoute, createChatRoom);
router.get('/rooms/:roomId/messages', protectRoute, getMessages);
router.post('/rooms/:roomId/messages', protectRoute, sendMessage);

export default router;