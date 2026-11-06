import mongoose, { Schema, Document } from 'mongoose';

export interface ICitizenDocument extends Document {
  documentId: string;
  type: string;
  titleEn: string;
  titleHi: string;
  aadhaarNumber?: string;
  applicantName?: string;
  fileDetails: {
    fileName: string;
    fileSizeFormatted: string;
    mimeType: string;
    uploadDate: string;
    fileHash: string;
  };
  extractedData: {
    name?: string;
    dob?: string;
    gender?: string;
    state?: string;
    district?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    bankAccount?: string;
    ifscCode?: string;
    epicNumber?: string;
    landAreaAcres?: number;
    disabilityPercent?: number;
    educationLevel?: string;
    income?: number;
    category?: string;
  };
  status: 'verified' | 'pending' | 'rejected';
  confidence: number;
  uploadedAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const CitizenDocumentSchema = new Schema({
  documentId: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true, index: true },
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  aadhaarNumber: { type: String, index: true },
  applicantName: { type: String },
  fileDetails: {
    fileName: { type: String, required: true },
    fileSizeFormatted: { type: String, required: true },
    mimeType: { type: String, default: 'application/pdf' },
    uploadDate: { type: String, required: true },
    fileHash: { type: String, required: true }
  },
  extractedData: {
    name: { type: String },
    dob: { type: String },
    gender: { type: String },
    state: { type: String },
    district: { type: String },
    panNumber: { type: String },
    aadhaarNumber: { type: String },
    bankAccount: { type: String },
    ifscCode: { type: String },
    epicNumber: { type: String },
    landAreaAcres: { type: Number },
    disabilityPercent: { type: Number },
    educationLevel: { type: String },
    income: { type: Number },
    category: { type: String }
  },
  status: { type: String, enum: ['verified', 'pending', 'rejected'], default: 'verified' },
  confidence: { type: Number, default: 0.98 },
  uploadedAt: { type: String, required: true }
}, {
  timestamps: true
});

const CitizenDocumentModel = mongoose.models.CitizenDocument || mongoose.model<ICitizenDocument>('CitizenDocument', CitizenDocumentSchema);

export default CitizenDocumentModel;

