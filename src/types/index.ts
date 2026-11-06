export interface SchemeEligibility {
  minAge: number | null;
  maxAge: number | null;
  gender: 'all' | 'male' | 'female' | 'transgender';
  categories: string[]; // ['general', 'obc', 'sc', 'st']
  maxIncome: number | null; // Annual income limit
  occupations: string[]; // ['farmer', 'student', 'unemployed', 'any', etc.]
  states: string[]; // ['all'] or specific state names like ['Karnataka', 'Uttar Pradesh']
}

export interface SchemeTranslation {
  name: string;
  fullName: string;
  description: string;
  benefits: string;
  documents: string[];
}

export interface Scheme {
  _id?: string;
  name: string;
  fullName: string;
  description: string;
  ministry: string;
  eligibility: SchemeEligibility;
  benefits: string;
  documents: string[];
  applicationUrl: string;
  tags: string[];
  language?: {
    hi?: SchemeTranslation;
  };
  lastCrawled: Date;
  source: string;
}

export interface UserProfile {
  age?: number;
  gender?: 'all' | 'male' | 'female' | 'transgender';
  category?: string; // general, obc, sc, st
  income?: number; // annual income
  occupation?: string; // farmer, student, etc.
  state?: string; // Karnataka, Uttar Pradesh, etc.
  district?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  schemes?: Scheme[]; // If matching schemes were found in this turn
}

export interface CSCLocation {
  id: string;
  name: string;
  vleName: string; // Village Level Entrepreneur / Center Incharge
  pincode: string;
  district: string;
  state: string;
  address: string;
  phone: string;
  timings: string;
  services: string[];
  distanceKm?: number;
}

export type DocumentType = 
  | 'aadhaar'
  | 'pan'
  | 'ration_card'
  | 'income_cert'
  | 'caste_cert'
  | 'domicile_cert'
  | 'land_record'
  | 'bank_passbook'
  | 'voter_id'
  | 'driving_license'
  | 'education_cert'
  | 'disability_cert'
  | 'ayushman_card'
  | 'kisan_card'
  | 'eshram_card'
  | 'mgnrega_card';

export interface VerifiedDocument {
  id: string;
  type: DocumentType;
  title: string;
  docNumber: string;
  issuingAuthority: string;
  issueDate: string;
  fileName?: string;
  fileSize?: string;
  extractedData: {
    name?: string;
    income?: number;
    category?: string;
    rationCardType?: string; // BPL / Antyodaya / APL
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
  };
  status: 'verified' | 'pending' | 'rejected';
  confidence: number;
  uploadedAt?: string;
}

export type StageStatus = 'completed' | 'in_progress' | 'pending' | 'action_required' | 'rejected';

export interface ApplicationStage {
  id: string;
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  departmentEn: string;
  departmentHi: string;
  status: StageStatus;
  completedDate?: string;
  officerName?: string;
  remarksEn?: string;
  remarksHi?: string;
}

export interface ApplicationTrackRecord {
  applicationId: string;
  schemeName: string;
  schemeFullName: string;
  applicantName: string;
  aadhaarLast4: string;
  state: string;
  district: string;
  submissionDate: string;
  expectedResolutionDate: string;
  currentStageNumber: number;
  overallStatus: 'approved' | 'in_progress' | 'action_required' | 'disbursed';
  stages: ApplicationStage[];
  paymentDetails?: {
    amount: number;
    installmentNumber?: string;
    utrNumber?: string;
    bankName: string;
    accountLast4: string;
    ifscCode: string;
    pfmsStatus: 'Validated' | 'Pending' | 'Rejected';
    npciAadhaarSeeding: 'Active' | 'Inactive';
    disbursementDate?: string;
  };
  actionRequired?: {
    titleEn: string;
    titleHi: string;
    descriptionEn: string;
    descriptionHi: string;
    actionType: 'visit_csc' | 'link_npci' | 'upload_doc';
  };
}
