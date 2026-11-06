import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationStage {
  id: string;
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  departmentEn: string;
  departmentHi: string;
  status: 'completed' | 'in_progress' | 'pending' | 'action_required' | 'rejected';
  completedDate?: string;
  officerName?: string;
  remarksEn?: string;
  remarksHi?: string;
}

export interface IApplicationPayment {
  amount: number;
  installmentNumber?: string;
  utrNumber?: string;
  bankName: string;
  accountLast4: string;
  ifscCode: string;
  pfmsStatus: 'Validated' | 'Pending' | 'Rejected';
  npciAadhaarSeeding: 'Active' | 'Inactive';
  disbursementDate?: string;
}

export interface IApplication extends Document {
  applicationId: string;
  schemeId?: string;
  schemeName: string;
  schemeFullName: string;
  applicantName: string;
  aadhaarNumber?: string;
  aadhaarLast4: string;
  state: string;
  district: string;
  category?: string;
  annualIncome?: number;
  mobile?: string;
  submissionDate: string;
  expectedResolutionDate: string;
  currentStageNumber: number;
  overallStatus: 'submitted' | 'in_progress' | 'approved' | 'action_required' | 'disbursed' | 'rejected';
  stages: IApplicationStage[];
  paymentDetails?: IApplicationPayment;
  verifiedDocumentsAttached?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StageSchema = new Schema({
  id: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  departmentEn: { type: String, required: true },
  departmentHi: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['completed', 'in_progress', 'pending', 'action_required', 'rejected'],
    default: 'pending' 
  },
  completedDate: { type: String },
  officerName: { type: String },
  remarksEn: { type: String },
  remarksHi: { type: String }
}, { _id: false });

const PaymentSchema = new Schema({
  amount: { type: Number, default: 0 },
  installmentNumber: { type: String },
  utrNumber: { type: String },
  bankName: { type: String, default: 'Public Sector Commercial Bank' },
  accountLast4: { type: String, default: '9012' },
  ifscCode: { type: String, default: 'SBIN0001000' },
  pfmsStatus: { type: String, enum: ['Validated', 'Pending', 'Rejected'], default: 'Pending' },
  npciAadhaarSeeding: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  disbursementDate: { type: String }
}, { _id: false });

const ApplicationSchema = new Schema({
  applicationId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    uppercase: true,
    trim: true 
  },
  schemeId: { type: String },
  schemeName: { type: String, required: true },
  schemeFullName: { type: String, required: true },
  applicantName: { type: String, required: true },
  aadhaarNumber: { type: String, index: true },
  aadhaarLast4: { type: String, default: '9012' },
  state: { type: String, default: 'All States' },
  district: { type: String, default: 'District Headquarters' },
  category: { type: String },
  annualIncome: { type: Number },
  mobile: { type: String },
  submissionDate: { type: String, required: true },
  expectedResolutionDate: { type: String, required: true },
  currentStageNumber: { type: Number, default: 1 },
  overallStatus: { 
    type: String, 
    enum: ['submitted', 'in_progress', 'approved', 'action_required', 'disbursed', 'rejected'],
    default: 'submitted' 
  },
  stages: { type: [StageSchema], default: [] },
  paymentDetails: { type: PaymentSchema },
  verifiedDocumentsAttached: { type: [String], default: [] }
}, {
  timestamps: true
});

const ApplicationModel = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default ApplicationModel;

