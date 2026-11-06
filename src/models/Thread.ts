import mongoose, { Schema, Document } from 'mongoose';
import { ChatMessage, UserProfile } from '../types';

export interface ThreadDocument extends Document {
  aadhaarNumber: string;
  title: string;
  messages: ChatMessage[];
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema({
  aadhaarNumber: { 
    type: String, 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  messages: { 
    type: Array, 
    default: [] 
  },
  profile: {
    age: { type: Number },
    gender: { type: String },
    state: { type: String },
    category: { type: String },
    income: { type: Number },
    occupation: { type: String }
  }
}, {
  timestamps: true
});

const ThreadModel = mongoose.models.Thread || mongoose.model<ThreadDocument>('Thread', ThreadSchema);

export default ThreadModel;
