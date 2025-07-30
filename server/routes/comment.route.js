import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  addComment,
  listComments,
  deleteComment,
  editComment
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/comment', isAuthenticated, addComment);
router.get('/comments/:lectureId', isAuthenticated, listComments);
router.delete('/comment/:commentId', isAuthenticated, deleteComment);
router.put('/comment/:commentId', isAuthenticated, editComment);

export default router;
