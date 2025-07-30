import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  attachment: { type: String }, // URL to file/image
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
