import mongoose, { Schema, Document } from 'mongoose';
import { Scheme as SchemeInterface } from '../types';

export interface SchemeDocument extends Omit<SchemeInterface, '_id'>, Document {}

const SchemeEligibilitySchema = new Schema({
  minAge: { type: Number, default: null },
  maxAge: { type: Number, default: null },
  gender: { type: String, enum: ['all', 'male', 'female', 'transgender'], default: 'all' },
  categories: { type: [String], default: [] },
  maxIncome: { type: Number, default: null },
  occupations: { type: [String], default: [] },
  states: { type: [String], default: [] },
}, { _id: false });

const SchemeTranslationSchema = new Schema({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  documents: { type: [String], required: true },
}, { _id: false });

const SchemeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  description: { type: String, required: true },
  ministry: { type: String, required: true },
  eligibility: { type: SchemeEligibilitySchema, required: true },
  benefits: { type: String, required: true },
  documents: { type: [String], default: [] },
  applicationUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
  language: {
    hi: { type: SchemeTranslationSchema, required: false }
  },
  lastCrawled: { type: Date, default: Date.now },
  source: { type: String, required: true }
}, {
  timestamps: true
});

// Define text indexes for keyword search matching
SchemeSchema.index({
  name: 'text',
  fullName: 'text',
  description: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    fullName: 5,
    tags: 3,
    description: 1
  },
  language_override: 'none'
});

const SchemeModel = mongoose.models.Scheme || mongoose.model<SchemeDocument>('Scheme', SchemeSchema);

export default SchemeModel;
