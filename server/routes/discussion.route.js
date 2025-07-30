import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  createDiscussion,
  listDiscussions,
  addReply,
  listReplies,
  editDiscussion,
  deleteDiscussion,
  editReply,
  deleteReply
} from '../controllers/discussion.controller.js';

const router = express.Router();

router.post('/discussion', isAuthenticated, createDiscussion);
router.get('/discussions/:courseId', isAuthenticated, listDiscussions);
router.put('/discussion/:discussionId', isAuthenticated, editDiscussion);
router.delete('/discussion/:discussionId', isAuthenticated, deleteDiscussion);
router.post('/discussion/reply', isAuthenticated, addReply);
router.get('/discussion/replies/:discussionId', isAuthenticated, listReplies);
router.put('/discussion/reply/:replyId', isAuthenticated, editReply);
router.delete('/discussion/reply/:replyId', isAuthenticated, deleteReply);

export default router;
