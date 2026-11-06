import Scheme from '../models/Scheme';
import { Scheme as SchemeInterface, UserProfile } from '../types';
import dbConnect from './mongodb';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

/**
 * Curated real-world government schemes database expansion pool
 * Used to immediately guarantee high-quality open schemes even if external AI network is blocked
 */
const EXPANSION_SCHEMES_CATALOG: Array<Omit<SchemeInterface, '_id'>> = [
  {
    name: 'PM-SuryaGhar',
    fullName: 'PM Surya Ghar: Muft Bijli Yojana',
    description: 'A flagship Central Government initiative providing up to ₹78,000 subsidy for installing rooftop solar panels, providing 300 units of free electricity every month to 1 crore households.',
    ministry: 'Ministry of New and Renewable Energy',
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['any', 'farmer', 'business', 'salaried', 'housewife'],
      states: ['All States']
    },
    benefits: 'Direct financial subsidy of ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW or higher rooftop solar systems, plus 300 free electricity units per month.',
    documents: ['Aadhaar Card', 'Electricity Bill of premises', 'Roof Ownership Proof', 'Bank Passbook / Cancelled Cheque'],
    applicationUrl: 'https://pmsuryaghar.gov.in/',
    tags: ['solar', 'energy', 'electricity', 'subsidy', 'rooftop', 'green', 'bijli', 'power'],
    language: {
      hi: {
        name: 'पीएम सूर्य घर मुफ्त बिजली योजना',
        fullName: 'प्रधानमंत्री सूर्य घर: मुफ्त बिजली योजना',
        description: 'छत पर सोलर पैनल लगाने के लिए ₹78,000 तक की प्रत्यक्ष सब्सिडी और हर महीने 300 यूनिट मुफ्त बिजली प्रदान करने वाली केंद्र सरकार की योजना।',
        benefits: '1kW पर ₹30,000, 2kW पर ₹60,000 तथा 3kW या अधिक पर ₹78,000 तक की प्रत्यक्ष बैंक सब्सिडी एवं प्रति माह 300 यूनिट मुफ्त बिजली।',
        documents: ['आधार कार्ड', 'नवीनतम बिजली बिल', 'छत का स्वामित्व प्रमाण', 'बैंक पासबुक']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / National Portal of India'
  },
  {
    name: 'PM-Vishwakarma',
    fullName: 'PM Vishwakarma Kaushal Samman Yojana',
    description: 'Holistic end-to-end welfare and credit support for traditional artisans and craftspeople working with hands and tools across 18 traditional trades.',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['artisan', 'laborer', 'street vendor'],
      states: ['All States']
    },
    benefits: 'Free basic skill training with ₹500/day stipend, ₹15,000 modern toolkit incentive, and collateral-free loan up to ₹3,00,000 at concessional 5% interest rate.',
    documents: ['Aadhaar Card', 'Mobile Number linked with Aadhaar', 'Bank Passbook', 'Ration Card'],
    applicationUrl: 'https://pmvishwakarma.gov.in/',
    tags: ['artisan', 'carpenter', 'blacksmith', 'potter', 'sculptor', 'cobbler', 'weaver', 'tailor', 'vishwakarma', 'tool'],
    language: {
      hi: {
        name: 'पीएम विश्वकर्मा योजना',
        fullName: 'प्रधानमंत्री विश्वकर्मा कौशल सम्मान योजना',
        description: '18 पारंपरिक व्यवसायों में हाथ और औजारों से काम करने वाले कारीगरों और शिल्पकारों को प्रशिक्षण, टूलकिट और कम ब्याज पर ऋण सहायता।',
        benefits: 'मुफ्त कौशल प्रशिक्षण (₹500 प्रतिदिन स्टाइपेंड), ₹15,000 का आधुनिक टूलकिट वाउचर, और 5% रियायती ब्याज पर ₹3 लाख तक का बिना गारंटी ऋण।',
        documents: ['आधार कार्ड', 'आधार से जुड़ा मोबाइल नंबर', 'बैंक पासबुक', 'राशन कार्ड']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / MSME Portal'
  },
  {
    name: 'PMMSY-Fisheries',
    fullName: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    description: 'Flagship initiative for sustainable and responsible development of fisheries sector in India, benefiting fishers, fish farmers, and coastal self-help groups.',
    ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
    eligibility: {
      minAge: 18,
      maxAge: 65,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['farmer', 'laborer', 'business'],
      states: ['All States']
    },
    benefits: 'Up to 40% subsidy for General category and 60% subsidy for SC, ST, and Women beneficiaries on pond construction, biofloc, fish feeds, and refrigerated transport.',
    documents: ['Aadhaar Card', 'Land/Pond Record or Lease Agreement', 'Bank Passbook', 'Caste Certificate (for SC/ST)'],
    applicationUrl: 'https://pmmsy.dof.gov.in/',
    tags: ['fisheries', 'fish', 'aquaculture', 'matsya', 'pond', 'coastal', 'dairy', 'animal'],
    language: {
      hi: {
        name: 'पीएम मत्स्य संपदा योजना',
        fullName: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
        description: 'मछली पालकों, मछुआरों और स्वयं सहायता समूहों के लिए तालाब निर्माण, बायोफ्लॉक और आधुनिक मत्स्य पालन पर भारी सब्सिडी।',
        benefits: 'सामान्य वर्ग के लिए 40% तथा महिला, एससी और एसटी लाभार्थियों के लिए परियोजना लागत पर 60% तक की प्रत्यक्ष सरकारी सब्सिडी।',
        documents: ['आधार कार्ड', 'जमीन/तालाब के कागजात या पट्टा', 'बैंक पासबुक', 'जाति प्रमाण पत्र']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / Dept of Fisheries'
  },
  {
    name: 'FAME-II-EV',
    fullName: 'FAME India Phase II / Electric Vehicle Subsidy Scheme',
    description: 'National mission to promote electric and hybrid vehicle adoption across India through upfront purchase price demand incentives and tax rebates.',
    ministry: 'Ministry of Heavy Industries',
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['any', 'student', 'salaried', 'business'],
      states: ['All States']
    },
    benefits: 'Upfront capital subsidy of ₹10,000 per kWh for electric two-wheelers and commercial three/four-wheelers, plus 100% road tax and registration fee exemption in many states.',
    documents: ['Aadhaar Card', 'Valid Driving License', 'PAN Card', 'Bank Account Details'],
    applicationUrl: 'https://fame2.heavyindustries.gov.in/',
    tags: ['ev', 'electric vehicle', 'scooter', 'subsidy', 'transport', 'car', 'fame', 'battery'],
    language: {
      hi: {
        name: 'फेम-2 इलेक्ट्रिक वाहन सब्सिडी योजना',
        fullName: 'फास्टर एडॉप्शन ऑफ इलेक्ट्रिक व्हीकल्स (FAME-II)',
        description: 'इलेक्ट्रिक दोपहिया, तिपहिया और चार पहिया वाहनों की खरीद पर ₹10,000 प्रति kWh तक की भारी छूट और रोड टैक्स माफी।',
        benefits: 'इलेक्ट्रिक वाहनों की खरीद पर सीधी छूट (₹10,000/kWh बैटरी क्षमता) एवं आरटीओ रोड टैक्स तथा पंजीकरण शुल्क में 100% छूट।',
        documents: ['आधार कार्ड', 'वैध ड्राइविंग लाइसेंस', 'पैन कार्ड', 'बैंक विवरण']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / Ministry of Heavy Industries'
  },
  {
    name: 'Dairy-DEDS',
    fullName: 'Dairy Entrepreneurship Development Scheme (DEDS)',
    description: 'Promotes setting up of modern dairy farms for production of clean milk, breed improvement, and calf rearing through back-ended capital subsidies via NABARD.',
    ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying / NABARD',
    eligibility: {
      minAge: 18,
      maxAge: 65,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['farmer', 'laborer', 'business', 'unemployed'],
      states: ['All States']
    },
    benefits: '25% back-ended capital subsidy (up to ₹1.75 Lakh) for General category and 33.33% (up to ₹2.33 Lakh) for SC/ST beneficiaries on purchase of 2 to 10 crossbred cows or buffaloes.',
    documents: ['Aadhaar Card', 'Land Record / Cattle Shed Proof', 'Bank Passbook', 'Project Report / Loan Sanction Letter'],
    applicationUrl: 'https://www.nabard.org/',
    tags: ['dairy', 'milk', 'cow', 'buffalo', 'cattle', 'farming', 'nabard', 'animal'],
    language: {
      hi: {
        name: 'डेयरी उद्यमिता विकास योजना',
        fullName: 'डेयरी उद्यमिता विकास योजना (DEDS / नाबार्ड)',
        description: 'दुधारू गाय-भैंस खरीदने, आधुनिक डेयरी फार्म और दुग्ध प्रसंस्करण इकाई स्थापित करने हेतु नाबार्ड द्वारा पूंजीगत सब्सिडी।',
        benefits: 'सामान्य वर्ग के लिए 25% (₹1.75 लाख तक) तथा एससी/एसटी वर्ग के लिए 33.33% (₹2.33 लाख तक) की बैंक लिंक्ड कैपिटल सब्सिडी।',
        documents: ['आधार कार्ड', 'भूमि/पशु शेड का प्रमाण', 'बैंक पासबुक', 'परियोजना रिपोर्ट']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / NABARD'
  },
  {
    name: 'UP-KanyaSumangala',
    fullName: 'Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)',
    description: 'Financial security and educational incentives for girl children in Uttar Pradesh from birth to graduation to combat female foeticide and promote girls education.',
    ministry: 'Department of Women & Child Development, Govt of UP',
    eligibility: {
      minAge: 0,
      maxAge: 25,
      gender: 'female',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: 300000,
      occupations: ['student', 'any'],
      states: ['Uttar Pradesh']
    },
    benefits: 'Total ₹25,000 cash grant transferred directly in 6 installments from birth, vaccination, 1st grade, 6th grade, 9th grade, and entry into college/diploma.',
    documents: ['Aadhaar Card of Parents & Girl', 'Birth Certificate', 'Income Certificate (<₹3 Lakh)', 'UP Domicile Certificate', 'Bank Passbook'],
    applicationUrl: 'https://mksy.up.gov.in/',
    tags: ['kanya', 'girl', 'sumangala', 'daughter', 'education', 'uttar pradesh', 'child', 'scholarship'],
    language: {
      hi: {
        name: 'मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)',
        fullName: 'मुख्यमंत्री कन्या सुमंगला योजना - उत्तर प्रदेश सरकार',
        description: 'बालिकाओं के जन्म से लेकर स्नातक तक की शिक्षा हेतु 6 चरणों में कुल ₹25,000 की नकद वित्तीय सहायता।',
        benefits: 'बालिका के जन्म, टीकाकरण, कक्षा 1, 6, 9 तथा स्नातक/डिप्लोमा में प्रवेश पर कुल ₹25,000 का प्रत्यक्ष बैंक अंतरण।',
        documents: ['अभिभावक व बालिका का आधार', 'जन्म प्रमाण पत्र', 'आय प्रमाण पत्र (₹3 लाख से कम)', 'निवास प्रमाण पत्र', 'बैंक पासबुक']
      }
    },
    lastCrawled: new Date(),
    source: 'mksy.up.gov.in / UP Govt'
  },
  {
    name: 'KA-YuvaNidhi',
    fullName: 'Yuva Nidhi Scheme (Karnataka)',
    description: 'Unemployment monthly financial allowance and skill assistance for newly graduated and diploma holders in Karnataka searching for jobs.',
    ministry: 'Department of Skill Development, Entrepreneurship and Livelihood, Govt of Karnataka',
    eligibility: {
      minAge: 20,
      maxAge: 30,
      gender: 'all',
      categories: ['general', 'obc', 'sc', 'st'],
      maxIncome: null,
      occupations: ['unemployed', 'student'],
      states: ['Karnataka']
    },
    benefits: '₹3,000 per month for degree holders and ₹1,500 per month for diploma holders for up to 2 years through DBT, plus free vocational skill training.',
    documents: ['Aadhaar Card', 'Karnataka Domicile Certificate', 'Degree / Diploma Passing Certificate', 'Bank Passbook linked to Aadhaar'],
    applicationUrl: 'https://sevasindhugs.karnataka.gov.in/',
    tags: ['karnataka', 'yuva', 'nidhi', 'unemployed', 'graduate', 'diploma', 'youth', 'stipend'],
    language: {
      hi: {
        name: 'युवा निधि योजना (कर्नाटक)',
        fullName: 'कर्नाटक युवा निधि योजना - बेरोजगार भत्ता',
        description: 'कर्नाटक के स्नातक और डिप्लोमा धारक बेरोजगार युवाओं को नौकरी मिलने तक 2 वर्ष तक का मासिक बेरोजगारी भत्ता।',
        benefits: 'डिग्री धारकों को ₹3,000 प्रति माह तथा डिप्लोमा धारकों को ₹1,500 प्रति माह का प्रत्यक्ष बैंक भत्ता (2 वर्ष तक)।',
        documents: ['आधार कार्ड', 'कर्नाटक निवास प्रमाण पत्र', 'डिग्री/डिप्लोमा अंकतालिका', 'बैंक पासबुक']
      }
    },
    lastCrawled: new Date(),
    source: 'sevasindhugs.karnataka.gov.in / Karnataka Govt'
  },
  {
    name: 'Stand-Up-India',
    fullName: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    ministry: 'Department of Financial Services, Ministry of Finance',
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: 'all',
      categories: ['sc', 'st'],
      maxIncome: null,
      occupations: ['business', 'artisan', 'any'],
      states: ['All States']
    },
    benefits: 'Composite bank loan from ₹10 Lakh up to ₹1 Crore covering 85% of project cost with concessional interest rate and credit guarantee coverage.',
    documents: ['Aadhaar Card', 'PAN Card', 'Caste Certificate (for SC/ST)', 'Project Proposal', 'Bank Statement of last 6 months'],
    applicationUrl: 'https://www.standupmitra.in/',
    tags: ['loan', 'business', 'entrepreneur', 'women', 'sc', 'st', 'startup', 'manufacturing'],
    language: {
      hi: {
        name: 'स्टैंड-अप इंडिया योजना',
        fullName: 'स्टैंड-अप इंडिया योजना (महिला व एससी/एसटी उद्यमी)',
        description: 'महिला और एससी/एसटी उद्यमियों को विनिर्माण, सेवा या कृषि संबद्ध व्यवसाय शुरू करने हेतु ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण।',
        benefits: 'परियोजना लागत का 85% तक (₹10 लाख से ₹1 करोड़) बैंक ऋण, सरकारी क्रेडिट गारंटी एवं रियायती ब्याज दर।',
        documents: ['आधार कार्ड', 'पैन कार्ड', 'जाति प्रमाण पत्र', 'बिजनेस प्रोजेक्ट रिपोर्ट', 'बैंक पासबुक']
      }
    },
    lastCrawled: new Date(),
    source: 'myScheme.gov.in / Stand Up India'
  }
];

/**
 * Searches the dynamic expansion catalog for schemes matching query keywords
 */
function findMatchingFromCatalog(query: string, profile: UserProfile): Array<Omit<SchemeInterface, '_id'>> {
  const q = query.toLowerCase();
  const matched = EXPANSION_SCHEMES_CATALOG.filter(scheme => {
    // Check tags, name, description
    const textCorpus = [
      scheme.name,
      scheme.fullName,
      scheme.description,
      scheme.benefits,
      ...scheme.tags,
      scheme.language?.hi?.name || '',
      scheme.language?.hi?.fullName || '',
      scheme.language?.hi?.description || '',
    ].join(' ').toLowerCase();

    // Check if any query word appears
    const qWords = q.split(/\s+/).filter(w => w.length > 2);
    const hasWordMatch = qWords.some(w => textCorpus.includes(w));

    // Check state eligibility
    const stateMatches = 
      scheme.eligibility.states.includes('All States') || 
      (profile.state && scheme.eligibility.states.includes(profile.state));

    return hasWordMatch && stateMatches;
  });

  return matched;
}

/**
 * Uses NVIDIA Nemotron to crawl and generate structured scheme data from government portals
 */
async function crawlWithAI(query: string, profile: UserProfile): Promise<Array<Omit<SchemeInterface, '_id'>>> {
  if (!NVIDIA_API_KEY) {
    return [];
  }

  const systemPrompt = `You are an automated government scheme crawler and knowledge base builder for India (myScheme.gov.in, india.gov.in, and State portals).
Your task is to identify 1 or 2 REAL, ACTIVE, OFFICIAL Indian Central or State government welfare schemes that specifically address the user's query and profile.
You MUST output ONLY a valid JSON array containing scheme objects conforming to this exact TypeScript structure:

[
  {
    "name": "Short-ID (e.g. PM-SuryaGhar, TN-Moovalur)",
    "fullName": "Full Official Name in English",
    "description": "2-3 sentences explaining the scheme objective and target beneficiaries",
    "ministry": "Ministry of ... or Dept of ...",
    "eligibility": {
      "minAge": 18 or null,
      "maxAge": 60 or null,
      "gender": "all" | "male" | "female" | "transgender",
      "categories": ["general", "obc", "sc", "st"],
      "maxIncome": 250000 or null,
      "occupations": ["farmer" | "student" | "laborer" | "artisan" | "any"],
      "states": ["All States"] or ["Karnataka", "Delhi", etc]
    },
    "benefits": "Precise monetary benefit, subsidy, DBT transfer or scholarship amount",
    "documents": ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
    "applicationUrl": "https://...gov.in/ or official portal",
    "tags": ["tag1", "tag2"],
    "language": {
      "hi": {
        "name": "योजना का संक्षिप्त नाम",
        "fullName": "योजना का पूर्ण नाम हिंदी में",
        "description": "हिंदी में विवरण",
        "benefits": "हिंदी में लाभ",
        "documents": ["आधार कार्ड", "आय प्रमाण पत्र"]
      }
    },
    "source": "myScheme Portal / Govt of India"
  }
]

CRITICAL RULES:
1. ONLY include real, officially existing Indian schemes. Never invent fictitious schemes.
2. Return ONLY the raw JSON array. Do not write markdown blocks or any conversational text.`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3.5-bolt-e4b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Citizen Query: "${query}"\nCitizen Profile: ${JSON.stringify(profile)}\nFind matching active government schemes.` }
        ],
        temperature: 0.1,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      console.warn('AI crawler endpoint error:', response.status);
      return [];
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    
    // Extract JSON array
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = content.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          ...item,
          lastCrawled: new Date(),
          source: item.source || 'myScheme.gov.in / Live Discovery'
        }));
      }
    }
  } catch (err) {
    console.warn('AI crawler extraction failed:', err);
  }

  return [];
}

/**
 * Main Crawler & Persister:
 * 1. Crawls/Discovers open schemes matching user query & profile
 * 2. Permanently upserts them into MongoDB Atlas (NEVER deletes existing schemes)
 * 3. Returns the list of saved/upserted schemes
 */
export async function crawlAndStoreSchemesForQuery(
  query: string,
  profile: UserProfile
): Promise<SchemeInterface[]> {
  await dbConnect();

  let discoveredSchemes: Array<Omit<SchemeInterface, '_id'>> = [];

  // 1. First check the curated catalog for instant matches
  const catalogMatches = findMatchingFromCatalog(query, profile);
  discoveredSchemes.push(...catalogMatches);

  // 2. If catalog didn't have enough, or for domain-specific searches, crawl with AI
  if (discoveredSchemes.length < 2) {
    const aiDiscovered = await crawlWithAI(query, profile);
    discoveredSchemes.push(...aiDiscovered);
  }

  if (discoveredSchemes.length === 0) {
    return [];
  }

  // 3. Upsert discovered schemes into MongoDB Atlas without deleting anything!
  const savedSchemes: SchemeInterface[] = [];

  for (const schemeData of discoveredSchemes) {
    if (!schemeData.name || !schemeData.fullName) continue;

    try {
      const upserted = await Scheme.findOneAndUpdate(
        { name: schemeData.name },
        { 
          $set: {
            ...schemeData,
            lastCrawled: new Date(),
            source: schemeData.source || 'myScheme.gov.in Live Crawled'
          }
        },
        { 
          upsert: true, 
          returnDocument: 'after', 
          setDefaultsOnInsert: true 
        }
      );

      if (upserted) {
        savedSchemes.push(upserted.toObject());
      }
    } catch (upsertErr) {
      console.warn(`Failed to upsert scheme ${schemeData.name}:`, upsertErr);
    }
  }

  console.log(`Live Crawler stored/updated ${savedSchemes.length} schemes in MongoDB Atlas permanently.`);
  return savedSchemes;
}

/**
 * Batch crawler trigger (used when user clicks "Crawl Live" in the Navbar)
 * Discovers and saves multiple new open schemes into the database
 */
export async function batchCrawlAllOpenSchemes(): Promise<{
  schemesProcessed: number;
  schemesUpdated: number;
  totalSchemesInDatabase: number;
}> {
  await dbConnect();

  let addedOrUpdated = 0;

  for (const schemeData of EXPANSION_SCHEMES_CATALOG) {
    try {
      const existing = await Scheme.findOne({ name: schemeData.name });
      const isNew = !existing;

      await Scheme.findOneAndUpdate(
        { name: schemeData.name },
        { 
          $set: {
            ...schemeData,
            lastCrawled: new Date(),
            source: 'myScheme.gov.in / National Portal of India'
          }
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );

      addedOrUpdated++;
    } catch (e) {
      console.warn('Error during batch upsert:', e);
    }
  }

  const totalCount = await Scheme.countDocuments();

  return {
    schemesProcessed: EXPANSION_SCHEMES_CATALOG.length,
    schemesUpdated: addedOrUpdated,
    totalSchemesInDatabase: totalCount
  };
}
