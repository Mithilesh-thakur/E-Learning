// Edit a discussion question
export const editDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { question } = req.body;
  const userId = req.id;
  try {
    const discussion = await CourseDiscussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found" });
    if (discussion.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this question" });
    }
    discussion.question = question;
    await discussion.save();
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a discussion question
export const deleteDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const userId = req.id;
  try {
    const discussion = await CourseDiscussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found" });
    if (discussion.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this question" });
    }
    await CourseDiscussion.findByIdAndDelete(discussionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a reply
export const editReply = async (req, res) => {
  const { replyId } = req.params;
  const { reply } = req.body;
  const userId = req.id;
  try {
    const replyDoc = await DiscussionReply.findById(replyId);
    if (!replyDoc) return res.status(404).json({ success: false, message: "Reply not found" });
    if (replyDoc.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this reply" });
    }
    replyDoc.reply = reply;
    await replyDoc.save();
    res.json({ success: true, reply: replyDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.id;
  try {
    const replyDoc = await DiscussionReply.findById(replyId);
    if (!replyDoc) return res.status(404).json({ success: false, message: "Reply not found" });
    if (replyDoc.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this reply" });
    }
    await DiscussionReply.findByIdAndDelete(replyId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import CourseDiscussion from '../models/courseDiscussion.model.js';
import DiscussionReply from '../models/discussionReply.model.js';

// Create a new discussion post/question
export const createDiscussion = async (req, res) => {
  const userId = req.id;
  const { courseId, question } = req.body;
  try {
    const discussion = await CourseDiscussion.create({ course: courseId, user: userId, question });
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all discussions for a course
export const listDiscussions = async (req, res) => {
  const { courseId } = req.params;
  try {
    const discussions = await CourseDiscussion.find({ course: courseId }).populate('user');
    res.json({ success: true, discussions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a reply to a discussion
export const addReply = async (req, res) => {
  const userId = req.id;
  const { discussionId, reply } = req.body;
  try {
    const discussionReply = await DiscussionReply.create({ discussion: discussionId, user: userId, reply });
    res.json({ success: true, discussionReply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List replies for a discussion
export const listReplies = async (req, res) => {
  const { discussionId } = req.params;
  try {
    const replies = await DiscussionReply.find({ discussion: discussionId }).populate('user');
    res.json({ success: true, replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
