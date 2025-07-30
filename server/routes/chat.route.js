import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  getOrCreateChat,
  sendMessage,
  getMessages,
  listChats,
  markMessageRead
} from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/chat', isAuthenticated, getOrCreateChat);
router.get('/chats', isAuthenticated, listChats);
router.post('/message', isAuthenticated, sendMessage);
router.get('/messages/:chatId', isAuthenticated, getMessages);
router.post('/message/read', isAuthenticated, markMessageRead);

export default router;
