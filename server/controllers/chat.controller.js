import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
// import User from '../models/user.model.js';
import { User } from '../models/user.model.js';

// Create or get chat between two users
export const getOrCreateChat = async (req, res) => {
  const userId = req.id;
  const { otherUserId } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] }
    });
    if (!chat) {
      chat = await Chat.create({ participants: [userId, otherUserId] });
    }
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const userId = req.id;
  const { chatId, receiverId, content, attachment } = req.body;
  try {
    const message = await Message.create({
      chat: chatId,
      sender: userId,
      receiver: receiverId,
      content,
      attachment,
      status: 'sent',
    });
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: Date.now() });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all chats for a user
export const listChats = async (req, res) => {
  const userId = req.id;
  try {
    const chats = await Chat.find({ participants: userId }).populate('lastMessage');
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as read
export const markMessageRead = async (req, res) => {
  const { messageId } = req.body;
  try {
    await Message.findByIdAndUpdate(messageId, { status: 'read' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
