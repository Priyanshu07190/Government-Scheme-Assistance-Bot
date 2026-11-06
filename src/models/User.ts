import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  aadhaarNumber: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'transgender';
  state: string;
  category: string;
  income: number;
  occupation: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  aadhaarNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'transgender'], required: true },
  state: { type: String, required: true },
  category: { type: String, required: true },
  income: { type: Number, required: true },
  occupation: { type: String, required: true },
}, {
  timestamps: true
});

const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
