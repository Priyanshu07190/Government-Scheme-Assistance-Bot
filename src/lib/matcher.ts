import { UserProfile } from '../types';

// Map of common state abbreviations to full names
const STATE_MAP: { [key: string]: string } = {
  up: 'Uttar Pradesh',
  mp: 'Madhya Pradesh',
  ap: 'Andhra Pradesh',
  hp: 'Himachal Pradesh',
  jk: 'Jammu and Kashmir',
  uk: 'Uttarakhand',
  tn: 'Tamil Nadu',
  kl: 'Kerala',
  mh: 'Maharashtra',
  gj: 'Gujarat',
  rj: 'Rajasthan',
  pb: 'Punjab',
  hr: 'Haryana',
  ka: 'Karnataka',
  wb: 'West Bengal',
  jh: 'Jharkhand',
  cg: 'Chhattisgarh',
  or: 'Odisha',
  as: 'Assam',
  br: 'Bihar',
};

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const OCCUPATIONS = [
  'farmer', 'student', 'laborer', 'domestic worker', 'business', 'self-employed',
  'entrepreneur', 'artisan', 'carpenter', 'blacksmith', 'potter', 'weaver', 'tailor',
  'barber', 'unemployed', 'housewife', 'salaried'
];

export function extractProfileFromText(text: string): UserProfile {
  const profile: UserProfile = {};
  const cleanedText = text.toLowerCase().trim();

  // 1. AGE EXTRACTION
  // Look for "25 years old", "age 30", "i am 18", "21 yr old"
  const ageRegexes = [
    /\b(\d{1,2})\s*(?:years?|yrs?)\s*old\b/,
    /\b(?:age|aged)\s*[:=]?\s*(\d{1,2})\b/,
    /\bi\s*am\s*(\d{1,2})\b/,
    /\bmy\s*age\s*is\s*(\d{1,2})\b/,
  ];

  for (const regex of ageRegexes) {
    const match = cleanedText.match(regex);
    if (match && match[1]) {
      const age = parseInt(match[1], 10);
      if (age > 0 && age < 110) {
        profile.age = age;
        break;
      }
    }
  }

  // Fallback: If no age pattern matches but we see a number between 15 and 90, assume it's age
  if (!profile.age) {
    const numbers = cleanedText.match(/\b\d{2}\b/g);
    if (numbers) {
      for (const numStr of numbers) {
        const num = parseInt(numStr, 10);
        if (num >= 15 && num <= 85) {
          // Verify it's not part of an income pattern (like 50k, 50000)
          const index = cleanedText.indexOf(numStr);
          const segment = cleanedText.substring(Math.max(0, index - 2), index + 6);
          if (!segment.includes('k') && !segment.match(/\d{3,}/) && !segment.includes('lakh')) {
            profile.age = num;
            break;
          }
        }
      }
    }
  }

  // 2. GENDER EXTRACTION
  if (/\b(?:female|women|woman|girl|lady|she|her)\b/.test(cleanedText)) {
    profile.gender = 'female';
  } else if (/\b(?:male|man|boy|he|his|him|gentleman)\b/.test(cleanedText)) {
    profile.gender = 'male';
  } else if (/\b(?:transgender|trans)\b/.test(cleanedText)) {
    profile.gender = 'transgender';
  }

  // 3. CATEGORY EXTRACTION (Caste/Category)
  if (/\b(?:obc|other backward)\b/.test(cleanedText)) {
    profile.category = 'obc';
  } else if (/\b(?:sc|scheduled caste)\b/.test(cleanedText)) {
    profile.category = 'sc';
  } else if (/\b(?:st|scheduled tribe)\b/.test(cleanedText)) {
    profile.category = 'st';
  } else if (/\b(?:general|gen|unreserved)\b/.test(cleanedText)) {
    profile.category = 'general';
  }

  // 4. INCOME EXTRACTION
  // Matches: "1.5 lakh", "2 lakhs", "50,000", "50k", "income 200000"
  const incomeRegexes = [
    /\b(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)\b/,
    /\b(?:income|earn|earning)\s*(?:of|is)?\s*(?:rs\.?|inr|₹)?\s*(\d{3,7})\b/,
    /\b(\d{1,3})\s*k\b/,
    /\b(?:rs\.?|inr|₹)?\s*(\d{5,7})\b/
  ];

  for (const regex of incomeRegexes) {
    const match = cleanedText.match(regex);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (regex.source.includes('lakh')) {
        profile.income = Math.round(val * 100000);
      } else if (regex.source.includes('k\\b')) {
        profile.income = Math.round(val * 1000);
      } else {
        profile.income = val;
      }
      break;
    }
  }

  // 5. OCCUPATION EXTRACTION
  for (const occ of OCCUPATIONS) {
    const regex = new RegExp(`\\b${occ}s?\\b`);
    if (regex.test(cleanedText)) {
      profile.occupation = occ;
      break;
    }
  }
  // Extra mapping
  if (!profile.occupation) {
    if (/\b(?:study|studying|college|school)\b/.test(cleanedText)) {
      profile.occupation = 'student';
    } else if (/\b(?:farm|agriculture|cultivator)\b/.test(cleanedText)) {
      profile.occupation = 'farmer';
    } else if (/\b(?:shop|vendor|hawker|seller)\b/.test(cleanedText)) {
      profile.occupation = 'street vendor';
    }
  }

  // 6. STATE EXTRACTION
  for (const state of STATES) {
    const regex = new RegExp(`\\b${state.toLowerCase()}\\b`);
    if (regex.test(cleanedText)) {
      profile.state = state;
      break;
    }
  }
  if (!profile.state) {
    // Check abbreviation map
    for (const abbrev in STATE_MAP) {
      const regex = new RegExp(`\\b${abbrev}\\b`);
      if (regex.test(cleanedText)) {
        profile.state = STATE_MAP[abbrev];
        break;
      }
    }
  }

  return profile;
}

// Deterministic filtering engine to run MongoDB queries
export function buildQueryFromProfile(profile: UserProfile): any {
  const query: any = {};

  // Default filter to ensure we handle general matching rules
  const eligibilityFilters: any[] = [];

  // Age match: (minAge <= userAge OR null) AND (maxAge >= userAge OR null)
  if (profile.age !== undefined) {
    eligibilityFilters.push({
      $and: [
        { $or: [{ 'eligibility.minAge': null }, { 'eligibility.minAge': { $lte: profile.age } }] },
        { $or: [{ 'eligibility.maxAge': null }, { 'eligibility.maxAge': { $gte: profile.age } }] }
      ]
    });
  }

  // Gender match: gender is 'all' OR matches user's gender
  if (profile.gender) {
    eligibilityFilters.push({
      'eligibility.gender': { $in: ['all', profile.gender] }
    });
  }

  // Category match: categories contains user's category OR empty array (general fallback)
  if (profile.category) {
    eligibilityFilters.push({
      $or: [
        { 'eligibility.categories': { $size: 0 } },
        { 'eligibility.categories': profile.category }
      ]
    });
  }

  // Income match: maxIncome >= userIncome OR null
  if (profile.income !== undefined) {
    eligibilityFilters.push({
      $or: [
        { 'eligibility.maxIncome': null },
        { 'eligibility.maxIncome': { $gte: profile.income } }
      ]
    });
  }

  // Occupation match: occupations is empty OR contains user's occupation OR contains 'any'
  if (profile.occupation) {
    eligibilityFilters.push({
      $or: [
        { 'eligibility.occupations': { $size: 0 } },
        { 'eligibility.occupations': 'any' },
        { 'eligibility.occupations': profile.occupation }
      ]
    });
  }

  // State match: states contains user's state OR contains 'all'
  if (profile.state) {
    eligibilityFilters.push({
      $or: [
        { 'eligibility.states': 'all' },
        { 'eligibility.states': profile.state }
      ]
    });
  }

  if (eligibilityFilters.length > 0) {
    query.$and = eligibilityFilters;
  }

  return query;
}
