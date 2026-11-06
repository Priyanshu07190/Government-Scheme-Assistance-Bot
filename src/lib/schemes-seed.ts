import { Scheme } from '../types';

export const SEED_SCHEMES: Omit<Scheme, '_id'>[] = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to small and marginal landholding farmer families across the country.",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["farmer"],
      states: ["all"]
    },
    benefits: "₹6,000 per year paid in three equal installments of ₹2,000 directly into bank accounts.",
    documents: ["Aadhaar Card", "Landholding Records / Fard", "Bank Account Passbook", "Mobile Number linked to Aadhaar"],
    applicationUrl: "https://pmkisan.gov.in/",
    tags: ["agriculture", "farmer", "income support", "money", "land", "rural"],
    language: {
      hi: {
        name: "पीएम-किसान",
        fullName: "प्रधानमंत्री किसान सम्मान निधि",
        description: "देशभर के छोटे और सीमांत भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
        benefits: "बैंक खातों में सीधे ₹2,000 की तीन समान किस्तों में प्रति वर्ष ₹6,000 का भुगतान।",
        documents: ["आधार कार्ड", "भूमि रिकॉर्ड", "बैंक खाता पासबुक", "आधार से लिंक मोबाइल नंबर"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    fullName: "Pradhan Mantri Jan Arogya Yojana",
    description: "Health insurance scheme offering cashless and paperless secondary and tertiary healthcare coverage to low-income families.",
    ministry: "Ministry of Health and Family Welfare",
    eligibility: {
      minAge: null,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 250000,
      occupations: ["any", "unemployed", "laborer", "domestic worker"],
      states: ["all"]
    },
    benefits: "Health cover of up to ₹5,00,000 per family per year for secondary and tertiary hospitalization care.",
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "SECC-2011 Data proof"],
    applicationUrl: "https://dashboard.pmjay.gov.in/pmjay-portal/home",
    tags: ["health", "medical", "hospital", "insurance", "cashless", "treatment"],
    language: {
      hi: {
        name: "आयुष्मान भारत पीएम-जय",
        fullName: "प्रधानमंत्री जन आरोग्य योजना",
        description: "कम आय वाले परिवारों को कैशलेस और पेपरलेस माध्यमिक और तृतीयक स्वास्थ्य देखभाल कवरेज प्रदान करने वाली स्वास्थ्य बीमा योजना।",
        benefits: "माध्यमिक और तृतीयक अस्पताल में भर्ती देखभाल के लिए प्रति परिवार प्रति वर्ष ₹5,00,000 तक का स्वास्थ्य कवर।",
        documents: ["आधार कार्ड", "राशन कार्ड", "आय प्रमाण पत्र", "SECC-2011 डेटा प्रमाण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PMAY-G",
    fullName: "Pradhan Mantri Awas Yojana - Gramin",
    description: "Financial assistance to rural families living below poverty line to construct a pucca house with basic amenities.",
    ministry: "Ministry of Rural Development",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 180000,
      occupations: ["any", "laborer", "farmer", "unemployed"],
      states: ["all"]
    },
    benefits: "Financial assistance of up to ₹1.2 Lakhs in plains and ₹1.3 Lakhs in hilly/difficult areas for house construction.",
    documents: ["Aadhaar Card", "Bank Account Details", "Ration Card", "MGNREGA Job Card number", "Income Certificate"],
    applicationUrl: "https://pmayg.nic.in/",
    tags: ["housing", "home", "pucca house", "rural", "construction", "grant"],
    language: {
      hi: {
        name: "पीएमएवाई-जी",
        fullName: "प्रधानमंत्री आवास योजना - ग्रामीण",
        description: "गरीबी रेखा से नीचे रहने वाले ग्रामीण परिवारों को बुनियादी सुविधाओं के साथ पक्का मकान बनाने के लिए वित्तीय सहायता।",
        benefits: "मकान निर्माण के लिए मैदानी क्षेत्रों में ₹1.2 लाख और पहाड़ी/दुर्गम क्षेत्रों में ₹1.3 लाख तक की वित्तीय सहायता।",
        documents: ["आधार कार्ड", "बैंक खाता विवरण", "राशन कार्ड", "मनरेगा जॉब कार्ड नंबर", "आय प्रमाण पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PMAY-U",
    fullName: "Pradhan Mantri Awas Yojana - Urban",
    description: "Housing for All initiative providing interest subsidy and grants for urban house acquisition or construction.",
    ministry: "Ministry of Housing and Urban Affairs",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 600000,
      occupations: ["any", "salaried", "business", "self-employed"],
      states: ["all"]
    },
    benefits: "Credit Linked Interest Subsidy (CLSS) up to 6.5% on home loans, or central grant of ₹1.5 Lakhs for construction.",
    documents: ["Aadhaar Card", "PAN Card", "Income Certificate / Salary Slip", "Affidavit stating no ownership of pucca house in India"],
    applicationUrl: "https://pmaymis.gov.in/",
    tags: ["housing", "home", "urban", "loan subsidy", "apartment", "city"],
    language: {
      hi: {
        name: "पीएमएवाई-यू",
        fullName: "प्रधानमंत्री आवास योजना - शहरी",
        description: "शहरी क्षेत्रों में मकान खरीदने या बनाने के लिए ब्याज सब्सिडी और अनुदान प्रदान करने वाली 'सभी के लिए आवास' पहल।",
        benefits: "गृह ऋण पर 6.5% तक की क्रेडिट लिंक्ड ब्याज सब्सिडी (CLSS), या निर्माण के लिए ₹1.5 लाख का केंद्रीय अनुदान।",
        documents: ["आधार कार्ड", "पैन कार्ड", "आय प्रमाण पत्र / वेतन पर्ची", "भारत में पक्के मकान के मालिकाना हक न होने का हलफनामा"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Mudra Yojana",
    fullName: "Pradhan Mantri MUDRA Yojana",
    description: "Collateral-free loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises to start or expand business.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: 65,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["business", "self-employed", "entrepreneur", "artisan"],
      states: ["all"]
    },
    benefits: "Three loan categories: Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5L), and Tarun (₹5L to ₹10L) with zero collateral.",
    documents: ["Aadhaar Card", "PAN Card", "Business Address Proof", "Business Plan / Project Report", "Last 6 Months Bank Statement"],
    applicationUrl: "https://www.mudra.org.in/",
    tags: ["business", "loan", "startup", "funding", "entrepreneur", "finance"],
    language: {
      hi: {
        name: "पीएम मुद्रा योजना",
        fullName: "प्रधानमंत्री मुद्रा योजना",
        description: "व्यवसाय शुरू करने या उसका विस्तार करने के लिए गैर-कॉर्पोरेट, गैर-कृषि लघु/सूक्ष्म उद्यमों को ₹10 लाख तक के संपार्श्विक-मुक्त ऋण।",
        benefits: "तीन ऋण श्रेणियां: शिशु (₹50,000 तक), किशोर (₹50,000 से ₹5 लाख), और तरुण (₹5 लाख से ₹10 लाख) बिना किसी सुरक्षा के।",
        documents: ["आधार कार्ड", "पैन कार्ड", "व्यापार पता प्रमाण", "बिजनेस प्लान / प्रोजेक्ट रिपोर्ट", "पिछले 6 महीनों का बैंक स्टेटमेंट"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    fullName: "Sukanya Samriddhi Account",
    description: "A small deposit savings scheme for girl children launched under Beti Bachao Beti Padhao campaign with attractive interest rates.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 0,
      maxAge: 10,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any"],
      states: ["all"]
    },
    benefits: "High-interest rate savings account with triple tax benefits (Section 80C deduction, tax-free interest, tax-free maturity amount).",
    documents: ["Birth Certificate of Girl Child", "Aadhaar Card of Parent/Guardian", "PAN Card of Parent/Guardian", "Address Proof"],
    applicationUrl: "https://www.indiapost.gov.in/VAS/Pages/Form.aspx",
    tags: ["savings", "girl child", "education", "marriage", "tax free", "deposit"],
    language: {
      hi: {
        name: "सुकन्या समृद्धि योजना",
        fullName: "सुकन्या समृद्धि खाता",
        description: "बेटी बचाओ बेटी पढ़ाओ अभियान के तहत बालिकाओं के लिए आकर्षक ब्याज दरों के साथ शुरू की गई एक छोटी बचत योजना।",
        benefits: "त्रिपल कर लाभ (धारा 80C कटौती, कर-मुक्त ब्याज, कर-मुक्त परिपक्वता राशि) के साथ उच्च ब्याज दर बचत खाता।",
        documents: ["बालिका का जन्म प्रमाण पत्र", "माता-पिता/अभिभावक का आधार कार्ड", "माता-पिता/अभिभावक का पैन कार्ड", "पता प्रमाण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Atal Pension Yojana",
    fullName: "Atal Pension Yojana (APY)",
    description: "Pension scheme focused on the unorganized sector workers to provide guaranteed monthly pension after age 60.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any", "unemployed", "laborer", "domestic worker", "self-employed"],
      states: ["all"]
    },
    benefits: "Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 post 60 years based on contributions.",
    documents: ["Aadhaar Card", "Mobile Number linked to Aadhaar", "Savings Bank Account details with auto-debited mandate"],
    applicationUrl: "https://www.npscra.nsdl.co.in/scheme-details.php",
    tags: ["pension", "retirement", "unorganized", "savings", "monthly income"],
    language: {
      hi: {
        name: "अटल पेंशन योजना",
        fullName: "अटल पेंशन योजना (APY)",
        description: "असंगठित क्षेत्र के श्रमिकों पर केंद्रित पेंशन योजना, जो 60 वर्ष की आयु के बाद गारंटीकृत मासिक पेंशन प्रदान करती है।",
        benefits: "योगदान के आधार पर 60 वर्ष के बाद ₹1,000, ₹2,000, ₹3,000, ₹4,000 या ₹5,000 की गारंटीकृत मासिक पेंशन।",
        documents: ["आधार कार्ड", "आधार से लिंक मोबाइल नंबर", "ऑटो-डेबिट जनादेश के साथ बचत बैंक खाता विवरण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "MGNREGA",
    fullName: "Mahatma Gandhi National Rural Employment Guarantee Act",
    description: "Provides at least 100 days of guaranteed wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.",
    ministry: "Ministry of Rural Development",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["laborer", "farmer", "any", "unemployed"],
      states: ["all"]
    },
    benefits: "Guaranteed 100 days of unskilled manual labor job per year with wages paid directly into bank accounts within 15 days.",
    documents: ["Aadhaar Card", "Ration Card", "Voter ID Card", "Passport Size Photograph", "Bank Account Passbook"],
    applicationUrl: "https://nrega.nic.in/",
    tags: ["employment", "job", "rural", "labor", "unskilled", "work"],
    language: {
      hi: {
        name: "मनरेगा",
        fullName: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम",
        description: "प्रत्येक ग्रामीण परिवार को वित्तीय वर्ष में कम से कम 100 दिनों के गारंटीकृत मजदूरी रोजगार प्रदान करता है जिसके वयस्क सदस्य अकुशल शारीरिक श्रम करने के इच्छुक हैं।",
        benefits: "15 दिनों के भीतर सीधे बैंक खातों में भुगतान की जाने वाली मजदूरी के साथ प्रति वर्ष 100 दिनों के अकुशल शारीरिक श्रम रोजगार की गारंटी।",
        documents: ["आधार कार्ड", "राशन कार्ड", "मतदाता पहचान पत्र", "पासपोर्ट आकार का फोटो", "बैंक खाता पासबुक"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Ujjwala Yojana",
    fullName: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    description: "Provides free clean cooking fuel (LPG connection) to women from below poverty line (BPL) households.",
    ministry: "Ministry of Petroleum and Natural Gas",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 150000,
      occupations: ["any", "unemployed", "laborer"],
      states: ["all"]
    },
    benefits: "Free LPG connection with one filled cylinder, stove, and regulatory assistance, plus ₹1,600 financial support per connection.",
    documents: ["Aadhaar Card of Applicant", "Ration Card issued by State Govt", "BPL Certificate / Income Proof", "Bank Account Details"],
    applicationUrl: "https://www.pmuy.gov.in/",
    tags: ["lpg", "cooking gas", "women", "fuel", "subsidy", "rural health"],
    language: {
      hi: {
        name: "पीएम उज्ज्वला योजना",
        fullName: "प्रधानमंत्री उज्ज्वला योजना (PMUY)",
        description: "गरीबी रेखा से नीचे (BPL) के परिवारों की महिलाओं को मुफ्त स्वच्छ खाना पकाने का ईंधन (LPG कनेक्शन) प्रदान करता है।",
        benefits: "एक भरे हुए सिलेंडर, स्टोव और नियामक सहायता के साथ मुफ्त एलपीजी कनेक्शन, साथ ही प्रति कनेक्शन ₹1,600 की वित्तीय सहायता।",
        documents: ["आवेदक का आधार कार्ड", "राज्य सरकार द्वारा जारी राशन कार्ड", "बीपीएल प्रमाण पत्र / आय का प्रमाण", "बैंक खाता विवरण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Swanidhi",
    fullName: "PM Street Vendor's AtmaNirbhar Nidhi",
    description: "A special micro-credit facility scheme for providing affordable working capital loans to street vendors to resume their livelihoods.",
    ministry: "Ministry of Housing and Urban Affairs",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["business", "self-employed", "street vendor", "artisan"],
      states: ["all"]
    },
    benefits: "Collateral-free working capital loan of ₹10,000, followed by ₹20,000 and ₹50,000 loans on timely repayment with 7% interest subsidy.",
    documents: ["Aadhaar Card", "Voter ID Card", "Certificate of Vending / Letter of Recommendation from Municipal Body"],
    applicationUrl: "https://pmsvanidhi.mohua.gov.in/",
    tags: ["street vendor", "loan", "working capital", "business", "micro credit"],
    language: {
      hi: {
        name: "पीएम स्वनिधि",
        fullName: "प्रधानमंत्री स्ट्रीट वेंडर्स आत्मनिर्भर निधि",
        description: "रेहड़ी-पटरी वालों (स्ट्रीट वेंडर्स) को अपनी आजीविका फिर से शुरू करने के लिए किफायती कार्यशील पूंजी ऋण प्रदान करने के लिए एक विशेष सूक्ष्म-ऋण सुविधा योजना।",
        benefits: "समय पर पुनर्भुगतान पर 7% ब्याज सब्सिडी के साथ ₹10,000 का संपार्श्विक-मुक्त कार्यशील पूंजी ऋण, उसके बाद ₹20,000 और ₹50,000 का ऋण।",
        documents: ["आधार कार्ड", "मतदाता पहचान पत्र", "वेंडिंग का प्रमाण पत्र / नगर निकाय से सिफारिश पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Post Matric Scholarship for SC Students",
    fullName: "Centrally Sponsored Post Matric Scholarship Scheme for SC Students",
    description: "Financial assistance to Scheduled Caste students studying at post-matriculation or post-secondary stages to enable them to complete their education.",
    ministry: "Ministry of Social Justice and Empowerment",
    eligibility: {
      minAge: 16,
      maxAge: null,
      gender: "all",
      categories: ["sc"],
      maxIncome: 250000,
      occupations: ["student"],
      states: ["all"]
    },
    benefits: "100% compulsory non-refundable fees reimbursement and maintenance allowance ranging from ₹2,500 to ₹13,500 per year.",
    documents: ["Caste Certificate (SC)", "Income Certificate (Family income < 2.5L)", "Aadhaar Card", "Previous Class Marksheet", "Fee Receipt of Current Course"],
    applicationUrl: "https://scholarships.gov.in/",
    tags: ["scholarship", "education", "student", "sc", "fees reimbursement", "college"],
    language: {
      hi: {
        name: "अनुसूचित जाति के लिए पोस्ट मैट्रिक छात्रवृत्ति",
        fullName: "अनुसूचित जाति के छात्रों के लिए केंद्र प्रायोजित पोस्ट मैट्रिक छात्रवृत्ति योजना",
        description: "मैट्रिक या माध्यमिक शिक्षा के बाद के स्तरों पर पढ़ रहे अनुसूचित जाति के छात्रों को उनकी शिक्षा पूरी करने में सक्षम बनाने के लिए वित्तीय सहायता।",
        benefits: "100% अनिवार्य गैर-वापसी योग्य शुल्क प्रतिपूर्ति और प्रति वर्ष ₹2,500 से ₹13,500 तक का रखरखाव भत्ता।",
        documents: ["जाति प्रमाण पत्र (SC)", "आय प्रमाण पत्र (पारिवारिक आय < 2.5 लाख)", "आधार कार्ड", "पिछली कक्षा की मार्कशीट", "वर्तमान पाठ्यक्रम की शुल्क रसीद"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "National Means-cum-Merit Scholarship",
    fullName: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    description: "Scholarship to meritorious students of economically weaker sections to arrest their drop-out at class VIII and encourage them to continue education.",
    ministry: "Ministry of Education",
    eligibility: {
      minAge: 12,
      maxAge: 16,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 350000,
      occupations: ["student"],
      states: ["all"]
    },
    benefits: "Scholarship of ₹12,000 per annum (₹1,000 per month) from Class IX to Class XII in State Govt/Govt-aided schools.",
    documents: ["Class VIII Marksheet with min 55% marks", "Family Income Certificate (under 3.5 Lakhs)", "Caste Certificate if applicable", "Aadhaar Card"],
    applicationUrl: "https://scholarships.gov.in/",
    tags: ["scholarship", "school student", "education", "merit scholarship", "middle school"],
    language: {
      hi: {
        name: "राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति",
        fullName: "राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना (NMMSS)",
        description: "आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों को आठवीं कक्षा में पढ़ाई छोड़ने से रोकने और उन्हें शिक्षा जारी रखने के लिए प्रोत्साहित करने हेतु छात्रवृत्ति।",
        benefits: "राज्य सरकार/सरकारी सहायता प्राप्त स्कूलों में कक्षा IX से कक्षा XII तक ₹12,000 प्रति वर्ष (₹1,000 प्रति माह) की छात्रवृत्ति।",
        documents: ["न्यूनतम 55% अंकों के साथ कक्षा VIII की मार्कशीट", "पारिवारिक आय प्रमाण पत्र (3.5 लाख से कम)", "जाति प्रमाण पत्र यदि लागू हो", "आधार कार्ड"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Stand Up India",
    fullName: "Stand-Up India Scheme for Greenfield Enterprises",
    description: "Loans to promote entrepreneurship among women and SC/ST communities to start a greenfield manufacturing, services, or trading business.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all", // SC/ST males also allowed, or any female
      categories: ["sc", "st", "general", "obc"], // SC/ST gets it, or General/OBC females
      maxIncome: null,
      occupations: ["business", "self-employed", "entrepreneur"],
      states: ["all"]
    },
    benefits: "Bank loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield enterprises (first-time venture). At least one SC/ST or one woman borrower per bank branch.",
    documents: ["Aadhaar Card", "Proof of Category (SC/ST certificate)", "Business Project Report", "Partnership deed / Company registration", "Rent / Lease Agreement of Business"],
    applicationUrl: "https://www.standupmitra.in/",
    tags: ["business loan", "women entrepreneur", "sc st entrepreneur", "greenfield business", "startup loan"],
    language: {
      hi: {
        name: "स्टैंड अप इंडिया",
        fullName: "ग्रीनफील्ड उद्यमों के लिए स्टैंड-अप इंडिया योजना",
        description: "महिलाओं और अनुसूचित जाति/अनुसूचित जनजाति समुदायों के बीच ग्रीनफील्ड विनिर्माण, सेवाओं या व्यापारिक व्यवसाय शुरू करने के लिए उद्यमिता को बढ़ावा देने हेतु ऋण।",
        benefits: "ग्रीनफील्ड उद्यम स्थापित करने के लिए ₹10 लाख और ₹1 करोड़ के बीच बैंक ऋण। प्रति बैंक शाखा में कम से कम एक SC/ST या एक महिला उधारकर्ता।",
        documents: ["आधार कार्ड", "श्रेणी का प्रमाण (SC/ST प्रमाण पत्र)", "व्यापार परियोजना रिपोर्ट", "साझेदारी विलेख / कंपनी पंजीकरण", "व्यवसाय का किराया / पट्टा समझौता"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Gruha Jyothi Scheme",
    fullName: "Karnataka Gruha Jyothi Free Electricity Scheme",
    description: "State welfare scheme providing free electricity up to 200 units per month to all domestic households in Karnataka.",
    ministry: "Department of Energy, Government of Karnataka",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any"],
      states: ["Karnataka"]
    },
    benefits: "Zero electricity bill for households consuming less than their average consumption (calculated up to 200 units maximum).",
    documents: ["Aadhaar Card (linked to voter ID/tenant agreement)", "Electricity Consumer Account ID (RR Number)", "Tenancy Agreement / Address Proof"],
    applicationUrl: "https://sevasindhuservice.karnataka.gov.in/",
    tags: ["free electricity", "electricity bill", "karnataka", "subsidy", "power", "state scheme"],
    language: {
      hi: {
        name: "गृह ज्योति योजना",
        fullName: "कर्नाटक गृह ज्योति मुफ्त बिजली योजना",
        description: "कर्नाटक में सभी घरेलू परिवारों को प्रति माह 200 यूनिट तक मुफ्त बिजली प्रदान करने वाली राज्य कल्याणकारी योजना।",
        benefits: "200 यूनिट अधिकतम तक गणना की गई औसत खपत से कम बिजली खपत करने वाले परिवारों के लिए शून्य बिजली बिल।",
        documents: ["आधार कार्ड", "बिजली उपभोक्ता खाता आईडी (RR नंबर)", "किराया समझौता / पता प्रमाण"]
      }
    },
    lastCrawled: new Date(),
    source: "Karnataka State Portal"
  },
  {
    name: "Gruha Lakshmi Scheme",
    fullName: "Karnataka Gruha Lakshmi Scheme for Women Heads",
    description: "Financial assistance scheme in Karnataka offering monthly cash support to the woman head of a household.",
    ministry: "Women and Child Development Department, Government of Karnataka",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null, // Eligible unless GST or Income Tax paying household
      occupations: ["any", "unemployed", "housewife"],
      states: ["Karnataka"]
    },
    benefits: "Direct monthly cash transfer of ₹2,000 to the bank account of the designated woman head of household.",
    documents: ["Aadhaar Card of Applicant", "Aadhaar Card of Husband", "Ration Card (RC containing applicant as head)", "Bank Account Details (linked to Aadhaar)"],
    applicationUrl: "https://sevasindhuservice.karnataka.gov.in/",
    tags: ["monthly cash", "women empowerment", "karnataka", "financial aid", "state scheme", "housewife"],
    language: {
      hi: {
        name: "गृह लक्ष्मी योजना",
        fullName: "महिला प्रमुखों के लिए कर्नाटक गृह लक्ष्मी योजना",
        description: "कर्नाटक में वित्तीय सहायता योजना जो एक परिवार की महिला प्रमुख को मासिक नकद सहायता प्रदान करती है।",
        benefits: "परिवार की नामित महिला प्रमुख के बैंक खाते में सीधे ₹2,000 का मासिक नकद हस्तांतरण।",
        documents: ["आवेदक का आधार कार्ड", "पति का आधार कार्ड", "राशन कार्ड", "बैंक खाता विवरण (आधार से लिंक)"]
      }
    },
    lastCrawled: new Date(),
    source: "Karnataka State Portal"
  },
  {
    name: "Yuva Nidhi Scheme",
    fullName: "Karnataka Yuva Nidhi Unemployment Allowance",
    description: "Unemployment allowance for educated youth of Karnataka who completed their graduation or diploma courses and remain unemployed.",
    ministry: "Department of Skill Development, Entrepreneurship and Livelihood, Government of Karnataka",
    eligibility: {
      minAge: 20,
      maxAge: 30,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["unemployed", "student"], // completed degree, currently unemployed
      states: ["Karnataka"]
    },
    benefits: "Monthly allowance of ₹3,000 for unemployed graduates and ₹1,500 for unemployed diploma holders for up to 2 years.",
    documents: ["Aadhaar Card", "Degree/Diploma Passing Certificate", "Domicile Certificate of Karnataka", "Unemployment Declaration Certificate"],
    applicationUrl: "https://sevasindhu.karnataka.gov.in/",
    tags: ["unemployment", "youth", "graduate", "diploma", "karnataka", "money allowance", "state scheme"],
    language: {
      hi: {
        name: "युवा निधि योजना",
        fullName: "कर्नाटक युवा निधि बेरोजगारी भत्ता",
        description: "कर्नाटक के शिक्षित युवाओं के लिए बेरोजगारी भत्ता जिन्होंने अपना स्नातक या डिप्लोमा पूरा कर लिया है और बेरोजगार हैं।",
        benefits: "बेरोजगार स्नातकों के लिए ₹3,000 और बेरोजगार डिप्लोमा धारकों के लिए ₹1,500 का मासिक भत्ता अधिकतम 2 वर्षों तक।",
        documents: ["आधार कार्ड", "डिग्री/डिप्लोमा उत्तीर्ण प्रमाण पत्र", "कर्नाटक का अधिवास प्रमाण पत्र", "बेरोजगारी स्व-घोषणा पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "Karnataka State Portal"
  },
  {
    name: "Kanya Sumangala Yojana",
    fullName: "Uttar Pradesh Mukhya Mantri Kanya Sumangala Yojana",
    description: "Conditional cash transfer scheme in UP to improve health and education of girls and eliminate female foeticide.",
    ministry: "Women and Child Development Department, Uttar Pradesh",
    eligibility: {
      minAge: 0,
      maxAge: 18,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 300000,
      occupations: ["any"],
      states: ["Uttar Pradesh"]
    },
    benefits: "Total monetary assistance of ₹15,000 paid in six stages from birth to graduation (e.g. at birth, immunization, admission in class 1, 6, 9, and degree/diploma).",
    documents: ["Birth Certificate of Girl", "Aadhaar Card of Parent/Guardian", "Domicile Certificate of UP", "Income Certificate (under 3L)", "Joint family photo with girl child"],
    applicationUrl: "https://mksy.up.gov.in/",
    tags: ["girl child", "birth assistance", "up govt", "education subsidy", "state scheme", "female child"],
    language: {
      hi: {
        name: "कन्या सुमंगला योजना",
        fullName: "उत्तर प्रदेश मुख्यमंत्री कन्या सुमंगला योजना",
        description: "लड़कियों के स्वास्थ्य और शिक्षा में सुधार और कन्या भ्रूण हत्या को समाप्त करने के लिए यूपी में सशर्त नकद हस्तांतरण योजना।",
        benefits: "जन्म से स्नातक तक छह चरणों में भुगतान की जाने वाली कुल ₹15,000 की नकद सहायता।",
        documents: ["लड़की का जन्म प्रमाण पत्र", "माता-पिता का आधार कार्ड", "यूपी का अधिवास प्रमाण पत्र", "आय प्रमाण पत्र (3 लाख से कम)", "लड़की के साथ संयुक्त पारिवारिक फोटो"]
      }
    },
    lastCrawled: new Date(),
    source: "UP State Portal"
  },
  {
    name: "PM Vishwakarma",
    fullName: "Pradhan Mantri Vishwakarma Scheme",
    description: "Support for traditional artisans and craftspeople with skill training, toolkits, collateral-free credit, and digital transaction incentives.",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["artisan", "carpenter", "blacksmith", "potter", "weaver", "tailor", "barber"],
      states: ["all"]
    },
    benefits: "Skill verification, 5-7 days basic training, toolkit incentive of ₹15,000, collateral-free enterprise development loan of up to ₹3 Lakhs at 5% interest rate.",
    documents: ["Aadhaar Card", "Mobile Number linked to Aadhaar", "Bank Account Passbook", "Proof of traditional trade/vocation"],
    applicationUrl: "https://pmvishwakarma.gov.in/",
    tags: ["artisan", "traditional craft", "loan", "skill development", "tailor", "carpenter", "weaver"],
    language: {
      hi: {
        name: "पीएम विश्वकर्मा",
        fullName: "प्रधानमंत्री विश्वकर्मा योजना",
        description: "पारंपरिक कारीगरों और शिल्पकारों को कौशल प्रशिक्षण, टूलकिट, संपार्श्विक-मुक्त ऋण और डिजिटल लेनदेन प्रोत्साहन के साथ सहायता।",
        benefits: "कौशल सत्यापन, 5-7 दिनों का बुनियादी प्रशिक्षण, ₹15,000 का टूलकिट प्रोत्साहन, 5% ब्याज दर पर ₹3 लाख तक का उद्यम विकास ऋण।",
        documents: ["आधार कार्ड", "आधार से लिंक मोबाइल नंबर", "बैंक खाता पासबुक", "पारंपरिक व्यापार/व्यवसाय का प्रमाण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM-KMY",
    fullName: "Pradhan Mantri Kisan Maandhan Yojana",
    description: "Government pension scheme for old age protection and social security of Small and Marginal Farmers (SMFs) in their elder years.",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["farmer"],
      states: ["all"]
    },
    benefits: "Assured monthly pension of ₹3,000 after attaining the age of 60 years. Requires monthly contribution of ₹55 to ₹200 based on entry age.",
    documents: ["Aadhaar Card", "Landholding documents / Jamabandi", "Savings Bank Account Details", "Mobile Number linked to Aadhaar"],
    applicationUrl: "https://maandhan.in/",
    tags: ["pension", "retirement", "farmer pension", "savings", "farmers social security"],
    language: {
      hi: {
        name: "पीएम-केएमवाई",
        fullName: "प्रधानमंत्री किसान मानधन योजना",
        description: "छोटे और सीमांत किसानों (SMFs) के बुढ़ापे में सुरक्षा और सामाजिक सुरक्षा के लिए सरकारी पेंशन योजना।",
        benefits: "60 वर्ष की आयु प्राप्त करने के बाद ₹3,000 की सुनिश्चित मासिक पेंशन। प्रवेश आयु के आधार पर ₹55 से ₹200 का मासिक योगदान आवश्यक है।",
        documents: ["आधार कार्ड", "भूमि रिकॉर्ड / जमाबंदी", "बचत बैंक खाता विवरण", "आधार से लिंक मोबाइल नंबर"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Garib Kalyan Anna Yojana",
    fullName: "Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)",
    description: "Food security welfare scheme providing free food grains (wheat, rice) to eligible beneficiaries of National Food Security Act (NFSA).",
    ministry: "Ministry of Consumer Affairs, Food and Public Distribution",
    eligibility: {
      minAge: null,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 120000,
      occupations: ["any", "laborer", "unemployed", "domestic worker"],
      states: ["all"]
    },
    benefits: "Free 5 kg food grains per person per month to all priority household ration card holders, over and above their regular quota.",
    documents: ["NFSA Ration Card", "Aadhaar Card of all family members", "Income Proof"],
    applicationUrl: "https://dfpd.gov.in/",
    tags: ["free food", "ration", "wheat", "rice", "food security", "low income support"],
    language: {
      hi: {
        name: "प्रधानमंत्री गरीब कल्याण अन्न योजना",
        fullName: "प्रधानमंत्री गरीब कल्याण अन्न योजना (PMGKAY)",
        description: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के पात्र लाभार्थियों को मुफ्त खाद्यान्न (गेहूं, चावल) प्रदान करने वाली खाद्य सुरक्षा कल्याण योजना।",
        benefits: "सभी प्राथमिकता वाले घरेलू राशन कार्ड धारकों को नियमित कोटे के अतिरिक्त प्रति व्यक्ति प्रति माह 5 किलोग्राम मुफ्त खाद्यान्न।",
        documents: ["NFSA राशन कार्ड", "सभी परिवार के सदस्यों का आधार कार्ड", "आय का प्रमाण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Atal Vayoshri Yojana",
    fullName: "Atal Vayoshri Yojana (AVY)",
    description: "Assistance and physical aids to senior citizens belonging to BPL category suffering from age-related disabilities.",
    ministry: "Ministry of Social Justice and Empowerment",
    eligibility: {
      minAge: 60,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 180000,
      occupations: ["any", "unemployed", "retired"],
      states: ["all"]
    },
    benefits: "Free distribution of physical aids and assisted-living devices (wheelchairs, walking sticks, hearing aids, spectacles) to BPL senior citizens.",
    documents: ["Age Proof (Senior Citizen Card/Aadhaar)", "BPL Certificate / Income Certificate (family income under 1.8 Lakhs)", "Doctor Certificate for disability/hearing impairment"],
    applicationUrl: "https://socialjustice.gov.in/",
    tags: ["elderly support", "senior citizen", "wheelchair", "hearing aids", "free assistance", "disabled support"],
    language: {
      hi: {
        name: "अटल वयोश्री योजना",
        fullName: "अटल वयोश्री योजना (AVY)",
        description: "उम्र से संबंधित विकलांगता से पीड़ित बीपीएल श्रेणी के वरिष्ठ नागरिकों को सहायता और शारीरिक उपकरण प्रदान करना।",
        benefits: "बीपीएल वरिष्ठ नागरिकों को शारीरिक सहायता और सहायक उपकरण (व्हीलचेयर, चलने की छड़ी, श्रवण यंत्र, चश्मा) का मुफ्त वितरण।",
        documents: ["आयु प्रमाण (वरिष्ठ नागरिक कार्ड/आधार)", "बीपीएल प्रमाण पत्र / आय प्रमाण पत्र", "विकलांगता/श्रवण दोष के लिए डॉक्टर का प्रमाण पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Jan Dhan Yojana",
    fullName: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    description: "National Mission for Financial Inclusion to ensure access to financial services namely Basic Savings Bank Account, remittance, insurance, pension in an affordable manner.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 10,
      maxAge: null,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any"],
      states: ["all"]
    },
    benefits: "Zero balance bank account, free RuPay debit card, ₹10,000 overdraft facility (subject to eligibility), ₹2 Lakhs accidental insurance cover.",
    documents: ["Aadhaar Card", "PAN Card if available", "Passport size photograph"],
    applicationUrl: "https://www.pmjdy.gov.in/",
    tags: ["bank account", "zero balance", "financial inclusion", "rupay card", "insurance cover"],
    language: {
      hi: {
        name: "पीएम जन धन योजना",
        fullName: "प्रधानमंत्री जन धन योजना (PMJDY)",
        description: "वित्तीय समावेशन के लिए राष्ट्रीय मिशन ताकि बुनियादी बचत बैंक खाते, प्रेषण, बीमा, पेंशन तक किफायती तरीके से पहुंच सुनिश्चित हो सके।",
        benefits: "शून्य बैलेंस बैंक खाता, मुफ्त रुपे डेबिट कार्ड, ₹10,000 की ओवरड्राफ्ट सुविधा, ₹2 लाख का दुर्घटना बीमा कवर।",
        documents: ["आधार कार्ड", "पैन कार्ड यदि उपलब्ध हो", "पासपोर्ट आकार का फोटो"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Suraksha Bima Yojana",
    fullName: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    description: "Accident insurance scheme offering one-year accidental death and disability cover at a very low premium.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: 70,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any"],
      states: ["all"]
    },
    benefits: "Accidental death and full disability coverage of ₹2 Lakhs, partial disability coverage of ₹1 Lakh. Premium is only ₹20 per annum auto-debited.",
    documents: ["Aadhaar Card", "Savings Bank Account details with auto-debit consent", "Mobile Number linked to Bank account"],
    applicationUrl: "https://www.jansuraksha.gov.in/",
    tags: ["insurance", "accident insurance", "cheap premium", "death cover", "disability cover"],
    language: {
      hi: {
        name: "पीएम सुरक्षा बीमा योजना",
        fullName: "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)",
        description: "बहुत कम प्रीमियम पर एक साल की दुर्घटना मृत्यु और विकलांगता कवर प्रदान करने वाली दुर्घटना बीमा योजना।",
        benefits: "दुर्घटना में मृत्यु और पूर्ण विकलांगता के लिए ₹2 लाख का कवर, आंशिक विकलांगता के लिए ₹1 लाख का कवर। प्रीमियम केवल ₹20 प्रति वर्ष।",
        documents: ["आधार कार्ड", "ऑटो-डेबिट सहमति के साथ बचत बैंक खाता विवरण", "बैंक खाते से जुड़ा मोबाइल नंबर"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana",
    fullName: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    description: "Government-backed life insurance scheme in India providing ₹2 Lakhs life cover for death due to any reason at low premium.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: 50,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["any"],
      states: ["all"]
    },
    benefits: "Life cover of ₹2,000,000 in case of death of the insured due to any reason. Premium is ₹436 per annum auto-debited.",
    documents: ["Aadhaar Card", "Savings Bank Account details with auto-debit consent", "Nominee details"],
    applicationUrl: "https://www.jansuraksha.gov.in/",
    tags: ["life insurance", "term insurance", "death cover", "cheap insurance", "financial security"],
    language: {
      hi: {
        name: "पीएम जीवन ज्योति बीमा योजना",
        fullName: "प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)",
        description: "भारत में सरकार समर्थित जीवन बीमा योजना जो कम प्रीमियम पर किसी भी कारण से मृत्यु होने पर ₹2 लाख का जीवन कवर प्रदान करती है।",
        benefits: "किसी भी कारण से बीमित व्यक्ति की मृत्यु के मामले में ₹2 लाख का जीवन कवर। प्रीमियम ₹436 प्रति वर्ष।",
        documents: ["आधार कार्ड", "ऑटो-डेबिट सहमति के साथ बचत बैंक खाता विवरण", "नामांकित व्यक्ति (नॉमिनी) का विवरण"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Post Matric Scholarship for OBC Students",
    fullName: "Centrally Sponsored Scheme of Post Matric Scholarship for OBC Students",
    description: "Financial assistance to Other Backward Classes (OBC) students pursuing post-matriculation courses to complete high education.",
    ministry: "Ministry of Social Justice and Empowerment",
    eligibility: {
      minAge: 16,
      maxAge: null,
      gender: "all",
      categories: ["obc"],
      maxIncome: 250000,
      occupations: ["student"],
      states: ["all"]
    },
    benefits: "Maintenance allowance and academic allowance up to ₹10,000 per year plus reimbursement of compulsory non-refundable fees.",
    documents: ["OBC Caste Certificate", "Family Income Certificate (under 2.5 Lakhs)", "Aadhaar Card", "Marksheet of Previous Class", "Current Course Fee Receipt"],
    applicationUrl: "https://scholarships.gov.in/",
    tags: ["scholarship", "obc", "education help", "fees waiver", "college tuition", "student support"],
    language: {
      hi: {
        name: "ओबीसी के लिए पोस्ट मैट्रिक छात्रवृत्ति",
        fullName: "ओबीसी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति योजना",
        description: "उच्च शिक्षा पूरी करने के लिए पोस्ट-मैट्रिक पाठ्यक्रम करने वाले अन्य पिछड़ा वर्ग (OBC) के छात्रों को वित्तीय सहायता।",
        benefits: "अनिवार्य गैर-वापसी योग्य शुल्कों की प्रतिपूर्ति के साथ-साथ प्रति वर्ष ₹10,000 तक का रखरखाव भत्ता और शैक्षणिक भत्ता।",
        documents: ["ओबीसी जाति प्रमाण पत्र", "पारिवारिक आय प्रमाण पत्र (2.5 लाख से कम)", "आधार कार्ड", "पिछली कक्षा की मार्कशीट", "वर्तमान पाठ्यक्रम की शुल्क रसीद"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Central Sector Scheme of Scholarship for College Students",
    fullName: "Central Sector Scheme of Scholarship for College and University Students",
    description: "Scholarship to merit students of economically weaker sections who score above 80th percentile in Class 12 board exams.",
    ministry: "Ministry of Education",
    eligibility: {
      minAge: 17,
      maxAge: 25,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 450000,
      occupations: ["student"],
      states: ["all"]
    },
    benefits: "Scholarship of ₹12,000 per annum for graduation (first 3 years) and ₹20,000 per annum for post-graduation.",
    documents: ["Class 12 Board Board Exam Marksheet (80th percentile proof)", "Income Certificate (family income under 4.5 Lakhs)", "Aadhaar Card", "College Joining Certificate / Admission Receipt"],
    applicationUrl: "https://scholarships.gov.in/",
    tags: ["merit scholarship", "college scholarship", "university fund", "class 12 board merit", "student financial help"],
    language: {
      hi: {
        name: "कॉलेज छात्रों के लिए केंद्रीय क्षेत्र की छात्रवृत्ति",
        fullName: "कॉलेज और विश्वविद्यालय के छात्रों के लिए केंद्रीय क्षेत्र की छात्रवृत्ति योजना",
        description: "आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों को छात्रवृत्ति जो कक्षा 12 वीं की बोर्ड परीक्षाओं में 80वें प्रतिशत से ऊपर अंक प्राप्त करते हैं।",
        benefits: "स्नातक के लिए ₹12,000 प्रति वर्ष (पहले 3 वर्ष) और स्नातकोत्तर (पीजी) के लिए ₹20,000 प्रति वर्ष की छात्रवृत्ति।",
        documents: ["कक्षा 12 की बोर्ड परीक्षा की मार्कशीट (80वें परसेंटाइल का प्रमाण)", "आय प्रमाण पत्र (4.5 लाख से कम)", "आधार कार्ड", "कॉलेज प्रवेश रसीद"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Lado Protsahan Yojana",
    fullName: "Rajasthan Lado Protsahan Yojana for Girl Child",
    description: "Financial savings bond support scheme in Rajasthan to support poor families upon the birth of a girl child.",
    ministry: "Department of Women and Child Development, Rajasthan",
    eligibility: {
      minAge: 0,
      maxAge: 1,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 200000,
      occupations: ["any"],
      states: ["Rajasthan"]
    },
    benefits: "A savings bond of ₹2,00,000 in the name of the girl child maturing at age 21, helping fund her higher studies and marriage.",
    documents: ["Birth Certificate of Girl Child", "Bhashah / Jan Aadhaar Card of Rajasthan", "Domicile Certificate of Rajasthan", "BPL Ration Card or Income Certificate"],
    applicationUrl: "https://wcd.rajasthan.gov.in/",
    tags: ["girl child Rajasthan", "lado scheme", "savings bond", "state scheme Rajasthan", "women development"],
    language: {
      hi: {
        name: "लाडो प्रोत्साहन योजना",
        fullName: "बालिकाओं के लिए राजस्थान लाडो प्रोत्साहन योजना",
        description: "राजस्थान में गरीब परिवारों को लड़की के जन्म पर वित्तीय सहायता प्रदान करने वाली बचत बांड योजना।",
        benefits: "लड़की के नाम पर ₹2,00,000 का बचत बांड जो 21 वर्ष की आयु में परिपक्व होगा, जिससे उच्च शिक्षा और विवाह में सहायता मिलेगी।",
        documents: ["बालिका का जन्म प्रमाण पत्र", "राजस्थान का जन आधार कार्ड", "राजस्थान का अधिवास प्रमाण पत्र", "बीपीएल राशन कार्ड या आय प्रमाण पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "Rajasthan State Portal"
  },
  {
    name: "Laxmi Ladli Yojana",
    fullName: "Madhya Pradesh Mukhya Mantri Ladli Laxmi Yojana 2.0",
    description: "A comprehensive savings and financial aid scheme in Madhya Pradesh to secure health, education, and marriage status of girls.",
    ministry: "Department of Women and Child Development, Madhya Pradesh",
    eligibility: {
      minAge: 0,
      maxAge: 18,
      gender: "female",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: 250000,
      occupations: ["any"],
      states: ["Madhya Pradesh"]
    },
    benefits: "Sequential payouts at Class 6 (₹2,000), Class 9 (₹4,000), Class 11 (₹6,000), Class 12 (₹6,000), plus ₹25,000 during college, and a final lump sum of ₹1 Lakh at age 21.",
    documents: ["Birth Certificate of Girl Child", "Samagra ID of Parent/Child in MP", "Domicile Certificate of MP", "Income Certificate / Non-tax paying declaration"],
    applicationUrl: "https://ladlilaxmi.mp.gov.in/",
    tags: ["girl child MP", "ladli laxmi", "education fund", "mp state welfare", "female welfare"],
    language: {
      hi: {
        name: "लाड़ली लक्ष्मी योजना",
        fullName: "मध्य प्रदेश मुख्यमंत्री लाड़ली लक्ष्मी योजना 2.0",
        description: "लड़कियों के स्वास्थ्य, शिक्षा और विवाह की स्थिति को सुरक्षित करने के लिए मध्य प्रदेश में एक बचत और वित्तीय सहायता योजना।",
        benefits: "कक्षा 6, 9, 11, 12 में क्रमिक भुगतान, कॉलेज के दौरान ₹25,000 और 21 वर्ष की आयु में ₹1 लाख का अंतिम एकमुश्त भुगतान।",
        documents: ["बालिका का जन्म प्रमाण पत्र", "मध्य प्रदेश का समग्र आईडी", "एमपी का अधिवास प्रमाण पत्र", "आय प्रमाण पत्र"]
      }
    },
    lastCrawled: new Date(),
    source: "MP State Portal"
  },
  {
    name: "PM Kisan Maandhan Yojana",
    fullName: "Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)",
    description: "Voluntary and contributory pension scheme for all Small and Marginal Farmers (SMFs) in the country.",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      gender: "all",
      categories: ["general", "obc", "sc", "st"],
      maxIncome: null,
      occupations: ["farmer"],
      states: ["all"]
    },
    benefits: "A guaranteed minimum pension of ₹3,000 per month upon reaching 60 years of age, with matching contribution from central govt.",
    documents: ["Aadhaar Card", "Land possession details", "Savings Bank Account details", "Mobile Number linked to Aadhaar"],
    applicationUrl: "https://pmkmy.gov.in/",
    tags: ["farmers pension", "old age security", "monthly retirement fund", "farming", "social security pension"],
    language: {
      hi: {
        name: "प्रधानमंत्री किसान मान-धन योजना",
        fullName: "प्रधानमंत्री किसान मान-धन योजना (PM-KMY)",
        description: "देश के सभी छोटे और सीमांत किसानों (SMFs) के लिए स्वैच्छिक और अंशदायी पेंशन योजना।",
        benefits: "60 वर्ष की आयु पूरी होने पर ₹3,000 प्रति माह की गारंटीकृत न्यूनतम पेंशन, केंद्र सरकार द्वारा समान योगदान के साथ।",
        documents: ["आधार कार्ड", "भूमि स्वामित्व विवरण", "बचत बैंक खाता विवरण", "आधार से लिंक मोबाइल नंबर"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  },
  {
    name: "Stand-Up India Scheme",
    fullName: "Stand-Up India Scheme for SC/ST and Women Entrepreneurs",
    description: "Specialized financial loan scheme encouraging enterprise setup by women and lower caste entrepreneurs in greenfield projects.",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      maxAge: null,
      gender: "all", // Any woman, or SC/ST males
      categories: ["sc", "st", "general", "obc"], // SC/ST males/females or general/obc females
      maxIncome: null,
      occupations: ["business", "self-employed", "entrepreneur"],
      states: ["all"]
    },
    benefits: "Bank loans from ₹10 Lakhs to ₹100 Lakhs covering up to 75% of project cost for greenfield manufacturing, services, or trading enterprises.",
    documents: ["Aadhaar Card", "Category Certificate (SC/ST)", "Detailed Business Project Report", "Bank Statement for last 1 year", "Colleteral security details if applicable"],
    applicationUrl: "https://www.standupmitra.in/",
    tags: ["business loan", "women entrepreneur loan", "sc st loan", "startup loan", "finance capital"],
    language: {
      hi: {
        name: "स्टैंड-अप इंडिया योजना",
        fullName: "अनुसूचित जाति / अनुसूचित जनजाति और महिला उद्यमियों के लिए स्टैंड-अप इंडिया योजना",
        description: "ग्रीनफील्ड परियोजनाओं में महिला और अनुसूचित जाति/अनुसूचित जनजाति वर्ग के उद्यमियों द्वारा उद्यम स्थापित करने को प्रोत्साहित करने वाली विशेष ऋण योजना।",
        benefits: "ग्रीनफील्ड विनिर्माण, सेवाओं या व्यापारिक उद्यमों के लिए परियोजना लागत का 75% तक कवर करने वाला ₹10 लाख से ₹100 लाख तक का बैंक ऋण।",
        documents: ["आधार कार्ड", "जाति प्रमाण पत्र (SC/ST)", "विस्तृत व्यापार परियोजना रिपोर्ट", "पिछले 1 वर्ष का बैंक स्टेटमेंट"]
      }
    },
    lastCrawled: new Date(),
    source: "myscheme.gov.in"
  }
];
