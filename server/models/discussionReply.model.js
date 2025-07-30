import mongoose from 'mongoose';

const DiscussionReplySchema = new mongoose.Schema({
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseDiscussion', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('DiscussionReply', DiscussionReplySchema);
