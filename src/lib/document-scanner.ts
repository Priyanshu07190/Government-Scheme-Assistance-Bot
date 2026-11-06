import { VerifiedDocument, DocumentType, UserProfile } from '../types';

/**
 * Intelligent OCR Scanner: processes uploaded citizen documents (PDF, JPG, PNG)
 */
export async function scanDocument(input: { 
  file: File; 
  selectedType?: DocumentType;
  applicantName?: string;
  userProfile?: UserProfile;
}): Promise<VerifiedDocument> {
  // Simulate OCR text parsing & cryptographic validation time
  await new Promise((r) => setTimeout(r, 1000));

  const fileName = input.file.name.toLowerCase();
  const userName = input.applicantName || 'Citizen Applicant';
  const state = input.userProfile?.state || 'All States';
  const year = new Date().getFullYear();

  // Determine type: explicitly chosen or inferred from file name
  let type: DocumentType = input.selectedType || 'income_cert';

  if (!input.selectedType) {
    if (fileName.includes('pan')) type = 'pan';
    else if (fileName.includes('aadhaar') || fileName.includes('adhar')) type = 'aadhaar';
    else if (fileName.includes('ration') || fileName.includes('rashan') || fileName.includes('bpl')) type = 'ration_card';
    else if (fileName.includes('income') || fileName.includes('aay')) type = 'income_cert';
    else if (fileName.includes('caste') || fileName.includes('jati')) type = 'caste_cert';
    else if (fileName.includes('land') || fileName.includes('khat') || fileName.includes('ror')) type = 'land_record';
    else if (fileName.includes('bank') || fileName.includes('passbook')) type = 'bank_passbook';
    else if (fileName.includes('domicile') || fileName.includes('niwas')) type = 'domicile_cert';
    else if (fileName.includes('voter') || fileName.includes('epic')) type = 'voter_id';
    else if (fileName.includes('mark') || fileName.includes('edu')) type = 'education_cert';
    else if (fileName.includes('disability') || fileName.includes('udid')) type = 'disability_cert';
    else if (fileName.includes('ayushman') || fileName.includes('pmjay')) type = 'ayushman_card';
    else if (fileName.includes('kisan') || fileName.includes('kcc')) type = 'kisan_card';
    else if (fileName.includes('shram') || fileName.includes('labor')) type = 'eshram_card';
    else if (fileName.includes('nrega') || fileName.includes('mgnrega')) type = 'mgnrega_card';
    else if (fileName.includes('license') || fileName.includes('dl')) type = 'driving_license';
  }

  const randNum = Math.floor(100000 + Math.random() * 900000);
  const stateCode = state !== 'All States' ? state.substring(0, 2).toUpperCase() : 'DL';

  let title = 'Verified Government Document';
  let docNumber = `GOV-${randNum}`;
  let issuingAuthority = 'Competent Government Authority / Revenue Dept';
  const extractedData: VerifiedDocument['extractedData'] = {
    name: userName,
    state
  };

  switch (type) {
    case 'pan':
      title = 'Permanent Account Number (PAN Card)';
      docNumber = `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`;
      issuingAuthority = 'Income Tax Department, Govt of India';
      extractedData.panNumber = docNumber;
      break;

    case 'aadhaar':
      title = 'Aadhaar Identification Document';
      docNumber = `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;
      issuingAuthority = 'Unique Identification Authority of India (UIDAI)';
      extractedData.aadhaarNumber = docNumber;
      break;

    case 'income_cert':
      title = 'Annual Income Certificate (आय प्रमाण पत्र)';
      docNumber = `${stateCode}-INC-${year}-${randNum}`;
      issuingAuthority = 'Office of the Tehsildar, Revenue Department';
      extractedData.income = input.userProfile?.income || 65000;
      extractedData.category = input.userProfile?.category || 'obc';
      break;

    case 'ration_card':
      title = 'NFSA Priority Household Ration Card';
      docNumber = `${stateCode}-RC-${year}-${randNum}`;
      issuingAuthority = 'Department of Food, Civil Supplies & Consumer Affairs';
      extractedData.rationCardType = 'BPL (Priority Household)';
      extractedData.income = input.userProfile?.income || 50000;
      break;

    case 'caste_cert':
      title = 'Category / Caste Certificate (जाति प्रमाण पत्र)';
      docNumber = `${stateCode}-CST-${year}-${randNum}`;
      issuingAuthority = 'Office of the Sub-Divisional Magistrate (SDM)';
      extractedData.category = input.userProfile?.category || 'obc';
      break;

    case 'land_record':
      title = 'Record of Rights (RoR) / Khatauni';
      docNumber = `LR-${year}-KHT-${Math.floor(10000 + Math.random() * 90000)}`;
      issuingAuthority = 'Department of Revenue & Land Records';
      extractedData.landAreaAcres = 2.0;
      break;

    case 'bank_passbook':
      title = 'Bank Account Passbook / Mandate';
      docNumber = `BANK-${stateCode}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      issuingAuthority = 'Public Sector Commercial Bank (RBI Scheduled)';
      extractedData.bankAccount = `****${Math.floor(1000 + Math.random() * 9000)}`;
      extractedData.ifscCode = 'SBIN0001234';
      break;

    case 'domicile_cert':
      title = 'Permanent Domicile & Residence Certificate';
      docNumber = `${stateCode}-DOM-${year}-${randNum}`;
      issuingAuthority = 'Office of the District Magistrate / Tehsildar';
      break;

    case 'voter_id':
      title = "Elector's Photo Identity Card (EPIC)";
      docNumber = `EPIC/${stateCode}/${randNum}`;
      issuingAuthority = 'Election Commission of India';
      extractedData.epicNumber = docNumber;
      break;

    default:
      title = `${type.replace(/_/g, ' ').toUpperCase()} Certificate`;
      docNumber = `GOV-${stateCode}-${randNum}`;
      issuingAuthority = 'Government of India / State Administration';
  }

  return {
    id: `doc-${Date.now()}`,
    type,
    title: `${title} (${input.file.name})`,
    docNumber,
    issuingAuthority,
    issueDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    fileName: input.file.name,
    fileSize: `${(input.file.size / (1024 * 1024)).toFixed(2)} MB`,
    extractedData,
    status: 'verified',
    confidence: 0.95 + Math.floor(Math.random() * 4) / 100
  };
}

/**
 * Checks document completeness for a specific scheme against user's verified documents
 */
export function checkDocumentCompleteness(
  requiredDocuments: string[],
  userDocs: VerifiedDocument[]
): {
  total: number;
  matched: number;
  percentage: number;
  items: { name: string; isReady: boolean; matchedDocTitle?: string }[];
} {
  const items = requiredDocuments.map((reqDoc) => {
    const reqLower = reqDoc.toLowerCase();
    
    // Check if user has an uploaded/verified doc matching this requirement
    const match = userDocs.find((uDoc) => {
      const type = uDoc.type;
      if (reqLower.includes('aadhaar') && (type === 'aadhaar' || uDoc.title.toLowerCase().includes('aadhaar'))) return true;
      if (reqLower.includes('pan') && (type === 'pan' || uDoc.title.toLowerCase().includes('pan'))) return true;
      if (reqLower.includes('income') && type === 'income_cert') return true;
      if ((reqLower.includes('ration') || reqLower.includes('bpl')) && type === 'ration_card') return true;
      if ((reqLower.includes('caste') || reqLower.includes('category')) && type === 'caste_cert') return true;
      if ((reqLower.includes('land') || reqLower.includes('fard') || reqLower.includes('khatauni') || reqLower.includes('ror')) && type === 'land_record') return true;
      if ((reqLower.includes('bank') || reqLower.includes('passbook') || reqLower.includes('cheque')) && type === 'bank_passbook') return true;
      if ((reqLower.includes('domicile') || reqLower.includes('residence') || reqLower.includes('niwas')) && type === 'domicile_cert') return true;
      if ((reqLower.includes('voter') || reqLower.includes('epic')) && type === 'voter_id') return true;
      if ((reqLower.includes('marksheet') || reqLower.includes('education') || reqLower.includes('certificate')) && type === 'education_cert') return true;
      if ((reqLower.includes('disability') || reqLower.includes('udid') || reqLower.includes('handicap')) && type === 'disability_cert') return true;
      if ((reqLower.includes('ayushman') || reqLower.includes('abha') || reqLower.includes('health card')) && type === 'ayushman_card') return true;
      if ((reqLower.includes('kcc') || reqLower.includes('kisan credit') || reqLower.includes('farmer')) && type === 'kisan_card') return true;
      if ((reqLower.includes('shram') || reqLower.includes('labor') || reqLower.includes('labour')) && type === 'eshram_card') return true;
      if ((reqLower.includes('mgnrega') || reqLower.includes('nrega') || reqLower.includes('job card')) && type === 'mgnrega_card') return true;
      if ((reqLower.includes('license') || reqLower.includes('driving')) && type === 'driving_license') return true;
      return false;
    });

    return {
      name: reqDoc,
      isReady: !!match || reqLower.includes('mobile') || reqLower.includes('photo'),
      matchedDocTitle: match?.title
    };
  });

  const matched = items.filter(i => i.isReady).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((matched / total) * 100) : 100;

  return { total, matched, percentage, items };
}
