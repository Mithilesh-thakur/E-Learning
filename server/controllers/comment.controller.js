import LectureComment from '../models/lectureComment.model.js';

// Add a comment to a lecture
export const addComment = async (req, res) => {
  const userId = req.id;
  const { lectureId, comment } = req.body;
  try {
    const newComment = await LectureComment.create({ lecture: lectureId, user: userId, comment });
    res.json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List comments for a lecture
export const listComments = async (req, res) => {
  const { lectureId } = req.params;
  try {
    const comments = await LectureComment.find({ lecture: lectureId }).populate('user');
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.id;
  try {
    const comment = await LectureComment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
    }
    await LectureComment.findByIdAndDelete(commentId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.id;
  try {
    const commentDoc = await LectureComment.findById(commentId);
    if (!commentDoc) return res.status(404).json({ success: false, message: "Comment not found" });
    if (commentDoc.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this comment" });
    }
    commentDoc.comment = comment;
    await commentDoc.save();
    res.json({ success: true, comment: commentDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
