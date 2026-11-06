'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProfilePanel from '../components/ProfilePanel';
import ChatWindow from '../components/ChatWindow';
import DocumentScannerModal from '../components/DocumentScannerModal';
import ApplicationFormModal from '../components/ApplicationFormModal';
import DocumentChecklistModal from '../components/DocumentChecklistModal';
import DocumentLockerModal from '../components/DocumentLockerModal';
import ApplicationTrackerModal from '../components/ApplicationTrackerModal';
import { ChatMessage, UserProfile, Scheme, VerifiedDocument, DocumentType } from '../types';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const OCCUPATIONS = [
  { value: 'any', en: 'Any / Other', hi: 'कोई भी / अन्य' },
  { value: 'student', en: 'Student', hi: 'छात्र' },
  { value: 'farmer', en: 'Farmer', hi: 'किसान' },
  { value: 'laborer', en: 'Laborer / Wage Worker', hi: 'मज़दूर / दिहाड़ी कामगार' },
  { value: 'street vendor', en: 'Street Vendor / Hawker', hi: 'रेहड़ी-पटरी विक्रेता' },
  { value: 'artisan', en: 'Artisan / Craftsman', hi: 'कारीगर / शिल्पकार' },
  { value: 'business', en: 'Small Business Owner', hi: 'छोटे व्यवसाय के मालिक' },
  { value: 'unemployed', en: 'Unemployed', hi: 'बेरोज़गार' },
  { value: 'housewife', en: 'Housewife / Homemaker', hi: 'गृहणी' },
  { value: 'salaried', en: 'Salaried Employee', hi: 'वेतनभोगी कर्मचारी' },
];

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isCrawling, setIsCrawling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Authentication states
  const [userName, setUserName] = useState<string | null>(null);
  const [userAadhaar, setUserAadhaar] = useState<string | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Auth Form Input States
  const [loginAadhaar, setLoginAadhaar] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Registration Form States
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('male');
  const [regState, setRegState] = useState('Karnataka');
  const [regIncome, setRegIncome] = useState('');
  const [regCategory, setRegCategory] = useState('general');
  const [regOccupation, setRegOccupation] = useState('any');

  // Thread states
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chats' | 'profile' | 'docs' | 'csc'>('chats');

  // New Feature States: Document Locker, Document Scanner, Pre-Filled Application Form, Document Checklist, Application Tracker
  const [isDocsLockerOpen, setIsDocsLockerOpen] = useState(false);
  const [isDocScannerOpen, setIsDocScannerOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerInitialId, setTrackerInitialId] = useState<string | undefined>(undefined);
  const [selectedSchemeForForm, setSelectedSchemeForForm] = useState<Scheme | null>(null);
  const [selectedSchemeForChecklist, setSelectedSchemeForChecklist] = useState<Scheme | null>(null);
  const [userVerifiedDocs, setUserVerifiedDocs] = useState<VerifiedDocument[]>([]);

  const handleOpenTracker = (appId?: string) => {
    setTrackerInitialId(appId);
    setIsTrackerOpen(true);
  };

  // Base eligibility profile details
  const [defaultProfile, setDefaultProfile] = useState<UserProfile>({
    age: undefined,
    gender: 'all',
    category: '',
    income: undefined,
    occupation: 'any',
    state: 'All States',
  });

  const [profile, setProfile] = useState<UserProfile>({
    age: undefined,
    gender: 'all',
    category: '',
    income: undefined,
    occupation: 'any',
    state: 'All States',
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const isHindi = language === 'hi';

  // Prevent hydration layout flashes
  useEffect(() => {
    setIsMounted(true);

    const savedName = localStorage.getItem('gov_scheme_user_name');
    const savedAadhaar = localStorage.getItem('gov_scheme_user_aadhaar');
    const savedProfile = localStorage.getItem('gov_scheme_user_profile');
    const savedDocs = localStorage.getItem('gov_scheme_verified_docs');

    if (savedAadhaar && savedAadhaar !== 'guest') {
      // Fetch verified documents strictly for this authenticated citizen from MongoDB Atlas
      fetch(`/api/documents?aadhaar=${encodeURIComponent(savedAadhaar)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.documents)) {
            setUserVerifiedDocs(data.documents);
            if (data.documents.length === 0) {
              localStorage.removeItem('gov_scheme_verified_docs');
            } else {
              localStorage.setItem('gov_scheme_verified_docs', JSON.stringify(data.documents));
            }
          }
        })
        .catch(err => {
          console.error('Failed to fetch docs from DB:', err);
          setUserVerifiedDocs([]);
        });
    } else {
      // Unauthenticated or guest citizen: strictly 0 documents unless physically uploaded
      setUserVerifiedDocs([]);
      localStorage.removeItem('gov_scheme_verified_docs');
    }
    
    if (savedName && savedAadhaar) {
      setUserName(savedName);
      setUserAadhaar(savedAadhaar);
      
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setDefaultProfile(parsed);
        } catch (e) {
          console.error('Failed to parse cached user profile:', e);
        }
      }
    }
  }, []);

  // Fetch threads when Aadhaar changes
  const fetchUserThreads = async (aadhaar: string) => {
    try {
      const res = await fetch(`/api/threads?aadhaarNumber=${aadhaar}`);
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads || []);
      }
    } catch (e) {
      console.error('Failed to fetch user threads:', e);
    }
  };

  useEffect(() => {
    if (userAadhaar) {
      fetchUserThreads(userAadhaar);
    } else {
      setThreads([]);
      setActiveThreadId(null);
    }
  }, [userAadhaar]);

  const triggerCrawl = async () => {
    setIsCrawling(true);
    
    const tempId = `crawl-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      sender: 'bot',
      text: isHindi 
        ? '🔍 सरकारी योजना डेटाबेस को सिंक कर रहा हूँ... कृपया प्रतीक्षा करें।'
        : '🔍 Synchronizing government schemes database... Please wait.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);

    try {
      const res = await fetch('/api/crawl', { method: 'POST' });
      const data = await res.json();
      
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [
          ...filtered,
          {
            id: `crawl-success-${Date.now()}`,
            sender: 'bot',
            text: isHindi
              ? `✅ **डेटाबेस सफलतापूर्वक विस्तारित किया गया!**\n* **स्रोत:** ${data.results.source}\n* **नयी खोजी गई योजनाएं:** ${data.results.schemesUpdated}\n* **डेटाबेस में कुल सुरक्षित योजनाएं:** ${data.results.totalSchemesInDatabase || '38'}\n\nसभी योजनाएं स्थायी रूप से डेटाबेस में सुरक्षित हैं और भविष्य में भी उपलब्ध रहेंगी!`
              : `✅ **Government Schemes Database Expanded!**\n* **Source Crawled:** ${data.results.source}\n* **Newly Added Schemes:** ${data.results.schemesUpdated} open schemes\n* **Total Schemes in DB:** ${data.results.totalSchemesInDatabase || '38'}\n\nAll crawled schemes are permanently saved in MongoDB Atlas and will never be deleted!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];
      });
    } catch (error) {
      console.error('Crawling trigger failed:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [
          ...filtered,
          {
            id: `crawl-error-${Date.now()}`,
            sender: 'bot',
            text: isHindi 
              ? '❌ पोर्टल को क्रॉल करने में विफलता। कृपया बाद में प्रयास करें।'
              : '❌ Failed to connect to crawler daemon. Please try again later.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];
      });
    } finally {
      setIsCrawling(false);
    }
  };

  const handleDocumentVerified = (doc: VerifiedDocument) => {
    setUserVerifiedDocs((prev) => {
      const filtered = prev.filter(d => d.type !== doc.type);
      const nextDocs = [doc, ...filtered];
      try {
        localStorage.setItem('gov_scheme_verified_docs', JSON.stringify(nextDocs));
      } catch (e) {}
      return nextDocs;
    });

    // Save directly to MongoDB Atlas
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: doc,
        aadhaarNumber: userAadhaar,
        applicantName: userName
      })
    }).catch(err => console.error('Failed to sync document to DB:', err));

    // Update eligibility profile based on verified attributes quietly (no unwanted auto-search)
    const updatedProfile: UserProfile = { ...profile };
    if (doc.extractedData.income !== undefined) updatedProfile.income = doc.extractedData.income;
    if (doc.extractedData.category) updatedProfile.category = doc.extractedData.category;
    if (doc.extractedData.state) updatedProfile.state = doc.extractedData.state;
    if (doc.type === 'land_record') updatedProfile.occupation = 'farmer';
    if (doc.type === 'eshram_card' && (!updatedProfile.occupation || updatedProfile.occupation === 'any')) {
      updatedProfile.occupation = 'laborer';
    }
    if (doc.type === 'kisan_card') updatedProfile.occupation = 'farmer';
    if (doc.extractedData.name && (!userName || userName === 'Guest Citizen')) {
      setUserName(doc.extractedData.name);
    }
    setProfile(updatedProfile);
  };

  const handleDocumentRemoved = (type: DocumentType) => {
    setUserVerifiedDocs((prev) => {
      const nextDocs = prev.filter(d => d.type !== type);
      try {
        localStorage.setItem('gov_scheme_verified_docs', JSON.stringify(nextDocs));
      } catch (e) {}
      return nextDocs;
    });

    // Delete from MongoDB Atlas
    fetch(`/api/documents?type=${encodeURIComponent(type)}${userAadhaar ? `&aadhaar=${encodeURIComponent(userAadhaar)}` : ''}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to remove document from DB:', err));
  };

  const handleClearAllDocs = () => {
    setUserVerifiedDocs([]);
    try {
      localStorage.removeItem('gov_scheme_verified_docs');
    } catch (e) {}

    // Delete all from MongoDB Atlas
    fetch(`/api/documents?all=true${userAadhaar ? `&aadhaar=${encodeURIComponent(userAadhaar)}` : ''}`, {
      method: 'DELETE'
    }).catch(err => console.error('Failed to clear documents from DB:', err));
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile,
          language,
          threadId: activeThreadId,
          aadhaarNumber: userAadhaar
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Switch page to new thread if we created one
        if (data.threadId && data.threadId !== activeThreadId) {
          setActiveThreadId(data.threadId);
        }

        // Restore chat log
        if (data.messages) {
          setMessages(data.messages);
        } else {
          // Fallback structure
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: data.response,
            schemes: data.schemes,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
        }

        if (data.profile) {
          setProfile((prev) => ({
            ...prev,
            age: data.profile.age !== undefined ? data.profile.age : prev.age,
            gender: data.profile.gender !== undefined ? data.profile.gender : prev.gender,
            category: data.profile.category !== undefined ? data.profile.category : prev.category,
            income: data.profile.income !== undefined ? data.profile.income : prev.income,
            occupation: data.profile.occupation !== undefined ? data.profile.occupation : prev.occupation,
            state: data.profile.state !== undefined ? data.profile.state : prev.state,
          }));
        }

        // Refresh threads listing in sidebar to update titles
        if (userAadhaar) {
          fetchUserThreads(userAadhaar);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Chat routing error:', error);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: isHindi
          ? 'क्षमा करें, आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई। कृपया दोबारा प्रयास करें।'
          : 'Sorry, I encountered an error processing your query. Please check your database connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    
    // If active chat exists, save modified eligibility profile configuration to DB
    if (activeThreadId && userAadhaar) {
      try {
        await fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId: activeThreadId,
            aadhaarNumber: userAadhaar,
            profile: newProfile
          })
        });
        
        // Refresh sidebar summary
        fetchUserThreads(userAadhaar);
      } catch (e) {
        console.error('Failed to sync thread profile:', e);
      }
    }
  };

  // Actions for Threads
  const handleThreadSelect = async (threadId: string) => {
    if (!userAadhaar) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/threads?aadhaarNumber=${userAadhaar}&threadId=${threadId}`);
      const data = await res.json();
      if (data.success && data.thread) {
        setActiveThreadId(data.thread._id);
        setMessages(data.thread.messages || []);
        setProfile(data.thread.profile || defaultProfile);
      }
    } catch (e) {
      console.error('Failed to load thread details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    setProfile(defaultProfile);
    setActiveTab('chats');
  };

  const handleClearChat = async () => {
    console.log('handleClearChat called. activeThreadId:', activeThreadId);
    setMessages([]);
    if (activeThreadId && userAadhaar) {
      try {
        const res = await fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId: activeThreadId,
            aadhaarNumber: userAadhaar,
            messages: []
          })
        });
        const data = await res.json();
        console.log('Clear Chat API response:', data);
        fetchUserThreads(userAadhaar);
      } catch (e) {
        console.error('Failed to clear thread messages in DB:', e);
      }
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    console.log('handleDeleteThread called for threadId:', threadId);
    if (!userAadhaar) {
      console.warn('Cannot delete thread: userAadhaar is not set');
      return;
    }
    
    console.log('Firing DELETE request for threadId:', threadId);
    try {
      const res = await fetch(`/api/threads?aadhaarNumber=${userAadhaar}&threadId=${threadId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      console.log('DELETE response data:', data);
      if (data.success) {
        // If we deleted our current thread, clear client view
        if (activeThreadId === threadId) {
          handleNewChat();
        }
        fetchUserThreads(userAadhaar);
      } else {
        alert(isHindi ? `हटाने में विफल: ${data.error}` : `Deletion failed: ${data.error}`);
      }
    } catch (e) {
      console.error('Failed to delete thread:', e);
    }
  };

  // Auth Button Submissions
  const triggerSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!/^\d{12}$/.test(loginAadhaar)) {
      setAuthError(isHindi ? 'आधार संख्या ठीक 12 अंकों की होनी चाहिए।' : 'Aadhaar number must be exactly 12 digits.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: loginAadhaar })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setSimulatedOtp(data.otp);
        setAuthSuccess(isHindi ? 'सत्यापन कोड भेजा गया!' : 'Verification OTP generated!');
      } else {
        setAuthError(data.error || 'Aadhaar login failed.');
      }
    } catch (e) {
      setAuthError(isHindi ? 'सर्वर से कनेक्ट करने में विफल।' : 'Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!/^\d{6}$/.test(enteredOtp)) {
      setAuthError(isHindi ? 'कृपया 6 अंकों का ओटीपी दर्ज करें।' : 'Please enter a 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth?action=verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaarNumber: loginAadhaar,
          otp: enteredOtp,
          expectedOtp: simulatedOtp
        })
      });
      const data = await res.json();

      if (data.success) {
        const aadhaarNum = data.user.aadhaarNumber || loginAadhaar;
        setUserName(data.user.name);
        setUserAadhaar(aadhaarNum);
        
        const baseline: UserProfile = {
          age: data.user.age,
          gender: data.user.gender,
          state: data.user.state,
          category: data.user.category,
          income: data.user.income,
          occupation: data.user.occupation
        };
        setProfile(baseline);
        setDefaultProfile(baseline);

        localStorage.setItem('gov_scheme_user_name', data.user.name);
        localStorage.setItem('gov_scheme_user_aadhaar', aadhaarNum);
        localStorage.setItem('gov_scheme_user_profile', JSON.stringify(baseline));

        // Greet user on log-in
        const welcomeMsg: ChatMessage = {
          id: `auth-${Date.now()}`,
          sender: 'bot',
          text: isHindi
            ? `🔒 **आधार कार्ड सत्यापित!** आपका स्वागत है, **${data.user.name}**।\n\nमैंने सरकारी रिकॉर्ड (UIDAI/DigiLocker) से आपकी पात्रता सिंक कर ली है:\n* **आयु:** ${data.user.age} वर्ष\n* **लिंग:** ${data.user.gender === 'male' ? 'पुरुष' : data.user.gender === 'female' ? 'महिला' : 'ट्रांसजेंडर'}\n* **राज्य:** ${data.user.state}\n* **श्रेणी:** ${data.user.category?.toUpperCase()}\n* **पारिवारिक आय:** ₹${data.user.income}/वर्ष\n* **व्यवसाय:** ${data.user.occupation}\n\nआप सीधे सरकारी योजनाओं की पात्रता जांचने के लिए मुझसे चैट कर सकते हैं!`
            : `🔒 **Aadhaar Verified!** Welcome, **${data.user.name}**.\n\nI have automatically synced your eligibility profile from your official Aadhaar record:\n* **Age:** ${data.user.age} years\n* **Gender:** ${data.user.gender}\n* **State:** ${data.user.state}\n* **Category:** ${data.user.category?.toUpperCase()}\n* **Family Income:** ₹${data.user.income}/year\n* **Occupation:** ${data.user.occupation}\n\nAsk me anything to find eligible schemes!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([welcomeMsg]);

        // Clean input state
        setLoginAadhaar('');
        setOtpSent(false);
        setEnteredOtp('');
        setSimulatedOtp('');
      } else {
        setAuthError(data.error || 'OTP verification failed.');
      }
    } catch (e) {
      setAuthError(isHindi ? 'सत्यापन त्रुटि।' : 'Verification failure.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!/^\d{12}$/.test(regAadhaar)) {
      setAuthError(isHindi ? 'आधार संख्या ठीक 12 अंकों की होनी चाहिए।' : 'Aadhaar number must be exactly 12 digits.');
      return;
    }

    if (!regName.trim()) {
      setAuthError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }

    if (!regAge || isNaN(parseInt(regAge, 10)) || parseInt(regAge, 10) < 1) {
      setAuthError(isHindi ? 'कृपया वैध आयु दर्ज करें।' : 'Please enter a valid age.');
      return;
    }

    if (!regIncome || isNaN(parseInt(regIncome, 10)) || parseInt(regIncome, 10) < 0) {
      setAuthError(isHindi ? 'कृपया अपनी आय दर्ज करें।' : 'Please enter a valid income.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaarNumber: regAadhaar,
          name: regName,
          age: regAge,
          gender: regGender,
          state: regState,
          category: regCategory,
          income: regIncome,
          occupation: regOccupation
        })
      });
      const data = await res.json();

      if (data.success) {
        setAuthSuccess(isHindi ? 'सफल पंजीकरण! कृपया लॉगिन करें।' : 'Registered successfully! Please login.');
        setAuthTab('login');
        setLoginAadhaar(regAadhaar);
        setRegAadhaar('');
        setRegName('');
        setRegAge('');
        setRegIncome('');
      } else {
        setAuthError(data.error || 'Registration failed.');
      }
    } catch (e) {
      setAuthError(isHindi ? 'सर्वर से कनेक्ट करने में विफल।' : 'Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUserName(null);
    setUserAadhaar(null);
    
    const initialProfile: UserProfile = {
      age: undefined,
      gender: 'all',
      category: '',
      income: undefined,
      occupation: 'any',
      state: 'All States',
    };
    
    setProfile(initialProfile);
    setDefaultProfile(initialProfile);
    
    localStorage.removeItem('gov_scheme_user_name');
    localStorage.removeItem('gov_scheme_user_aadhaar');
    localStorage.removeItem('gov_scheme_user_profile');
    localStorage.removeItem('gov_scheme_verified_docs');
    
    setUserVerifiedDocs([]);
    setMessages([]);
    setActiveThreadId(null);
    setThreads([]);
  };

  if (!isMounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)' }}>
        Loading GovScheme Assist...
      </div>
    );
  }

  // VIEW 1: UNAUTHENTICATED PORTAL VIEW
  if (!userName) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Navbar 
          language={language} 
          onLanguageChange={setLanguage} 
          onTriggerCrawl={triggerCrawl}
          onClearChat={handleClearChat}
          isCrawling={isCrawling}
          userName={userName}
          onLoginClick={() => {}}
          onLogoutClick={handleLogout}
          onOpenDocsLocker={() => setIsDocsLockerOpen(true)}
          onOpenTracker={() => handleOpenTracker()}
          docsCount={userVerifiedDocs.length}
          totalDocs={16}
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flex: 1, 
          padding: '2rem',
          backgroundColor: 'var(--bg-color)'
        }}>
          <div className="modal-card" style={{ 
            maxWidth: '500px', 
            maxHeight: 'none', 
            backgroundColor: 'var(--panel-bg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-icon" style={{ margin: '0 auto 1rem auto', width: '48px', height: '48px' }}></div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isHindi ? 'सरकारी योजना सहायक' : 'GovScheme Assist'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {isHindi ? 'पात्रता की जांच करने के लिए आधार के माध्यम से लॉगिन करें' : 'Sign in via Aadhaar number to verify eligible welfare schemes'}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="auth-tabs">
            <button 
              onClick={() => { setAuthTab('login'); setAuthError(''); setAuthSuccess(''); }}
              className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {isHindi ? 'लॉगिन करें' : 'Login'}
            </button>
            <button 
              onClick={() => { setAuthTab('register'); setAuthError(''); setAuthSuccess(''); }}
              className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {isHindi ? 'नया पंजीकरण' : 'Register'}
            </button>
          </div>

          {/* Validation Messages */}
          {authError && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>⚠️ {authError}</div>}
          {authSuccess && <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>✓ {authSuccess}</div>}

          {/* Login tab forms */}
          {authTab === 'login' && (
            <div>
              {!otpSent ? (
                <form onSubmit={triggerSendOtp}>
                  <div className="form-group">
                    <label className="form-label">{isHindi ? '12-अंकीय आधार नंबर' : '12-digit Aadhaar Number'}</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={loginAadhaar}
                      onChange={(e) => setLoginAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456789012"
                      required
                      className="form-control"
                      disabled={isLoading}
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}>
                    {isLoading ? (isHindi ? 'सत्यापन हो रहा है...' : 'Validating...') : (isHindi ? 'ओटीपी कोड प्राप्त करें' : 'Get OTP Code')}
                  </button>
                </form>
              ) : (
                <form onSubmit={triggerVerifyOtp}>
                  <div className="otp-alert">
                    {isHindi ? 'सुरक्षा सत्यापन ओटीपी कोड:' : 'SMS Verification OTP:'} <strong>{simulatedOtp}</strong>
                  </div>
                  <div className="form-group" style={{ alignItems: 'center' }}>
                    <label className="form-label">{isHindi ? '6-अंकीय वन टाइम पासवर्ड (OTP)' : 'Enter 6-digit OTP'}</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className="form-control otp-control"
                      placeholder="e.g. 123456"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}>
                    {isLoading ? (isHindi ? 'सत्यापन हो रहा है...' : 'Verifying...') : (isHindi ? 'सत्यापित करें और सिंक करें' : 'Verify & Sync Profile')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setEnteredOtp(''); }} 
                    className="btn btn-outline" 
                    style={{ width: '100%', marginTop: '0.75rem', border: 'none' }}
                  >
                    {isHindi ? 'पीछे जाएं' : 'Back'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Registration Forms */}
          {authTab === 'register' && (
            <form onSubmit={triggerRegister}>
              <div className="form-group">
                <label className="form-label">{isHindi ? 'आधार संख्या' : 'Aadhaar Number'}</label>
                <input
                  type="text"
                  maxLength={12}
                  value={regAadhaar}
                  onChange={(e) => setRegAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456789012"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isHindi ? 'पूरा नाम' : 'Full Name'}</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priyanshu Bhargav"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'आयु' : 'Age'}</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'लिंग' : 'Gender'}</label>
                  <select value={regGender} onChange={(e) => setRegGender(e.target.value)} className="form-control">
                    <option value="male">{isHindi ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{isHindi ? 'महिला' : 'Female'}</option>
                    <option value="transgender">{isHindi ? 'ट्रांसजेंडर' : 'Transgender'}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{isHindi ? 'राज्य' : 'State'}</label>
                <select value={regState} onChange={(e) => setRegState(e.target.value)} className="form-control">
                  {STATES.filter(s => s !== 'All States').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'पारिवारिक आय (₹)' : 'Family Income (₹)'}</label>
                  <input
                    type="number"
                    min="0"
                    value={regIncome}
                    onChange={(e) => setRegIncome(e.target.value)}
                    placeholder="Annual income"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'सामाजिक श्रेणी' : 'Social Category'}</label>
                  <select value={regCategory} onChange={(e) => setRegCategory(e.target.value)} className="form-control">
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{isHindi ? 'व्यवसाय' : 'Occupation'}</label>
                <select value={regOccupation} onChange={(e) => setRegOccupation(e.target.value)} className="form-control">
                  {OCCUPATIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {isHindi ? o.hi : o.en}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}>
                {isHindi ? 'आधार प्रोफाइल पंजीकृत करें' : 'Register Profile'}
              </button>
            </form>
          )}

          {/* Guest login option to inspect */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isHindi ? 'सत्यापन के बिना जांचना चाहते हैं?' : 'Want to inspect the bot without authentication?'}
            </span>
            <button 
              onClick={() => { 
                setUserName('Guest Citizen'); 
                setUserAadhaar('guest');
                setUserVerifiedDocs([]);
                const baseline: UserProfile = { age: 25, gender: 'all', state: 'All States', category: 'general', income: 100000, occupation: 'any' };
                setProfile(baseline);
                setDefaultProfile(baseline);
                localStorage.setItem('gov_scheme_user_name', 'Guest Citizen');
                localStorage.setItem('gov_scheme_user_aadhaar', 'guest');
                localStorage.setItem('gov_scheme_user_profile', JSON.stringify(baseline));
                localStorage.removeItem('gov_scheme_verified_docs');
              }} 
              className="btn btn-outline btn-sm" 
              style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '700', paddingLeft: '0.25rem' }}
            >
              {isHindi ? 'अतिथि के रूप में प्रवेश करें' : 'Explore as Guest'}
            </button>
          </div>

        </div>
      </div>

      {/* Citizen Document Locker Modal in unauthenticated view */}
      <DocumentLockerModal
        isOpen={isDocsLockerOpen}
        onClose={() => setIsDocsLockerOpen(false)}
        documents={userVerifiedDocs}
        onDocumentUpload={handleDocumentVerified}
        onDocumentRemove={handleDocumentRemoved}
        onClearAllDocs={handleClearAllDocs}
        userName={userName}
        language={language}
      />

      {/* Live Application Status Tracker Modal in unauthenticated view */}
      <ApplicationTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackerInitialId(undefined);
        }}
        language={language}
        initialApplicationId={trackerInitialId}
        applicantName={userName}
        applicantAadhaar={userAadhaar}
        applicantState={profile.state}
        onOpenCSC={() => setActiveTab('csc')}
        onOpenDocsLocker={() => setIsDocsLockerOpen(true)}
      />
    </div>
  );
}

  // VIEW 2: AUTHENTICATED CHAT DASHBOARD
  return (
    <div className="app-container">
      <Navbar 
        language={language} 
        onLanguageChange={setLanguage} 
        onTriggerCrawl={triggerCrawl}
        onClearChat={handleClearChat}
        isCrawling={isCrawling}
        userName={userName}
        onLoginClick={() => {}}
        onLogoutClick={handleLogout}
        onOpenDocsLocker={() => setIsDocsLockerOpen(true)}
        onOpenTracker={() => handleOpenTracker()}
        docsCount={userVerifiedDocs.length}
        totalDocs={16}
      />
      
      <div className="dashboard-grid">
        <ProfilePanel 
          profile={profile} 
          onProfileChange={handleProfileChange} 
          language={language}
          activeThreadId={activeThreadId}
          threads={threads}
          onThreadSelect={handleThreadSelect}
          onNewChat={handleNewChat}
          onDeleteThread={handleDeleteThread}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          documents={userVerifiedDocs}
          onDocumentUpload={handleDocumentVerified}
          onDocumentRemove={handleDocumentRemoved}
          onClearAllDocs={handleClearAllDocs}
          userName={userName}
          onOpenDocsModal={() => setIsDocsLockerOpen(true)}
        />
        
        <main style={{ height: '100%' }}>
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            language={language}
            onOpenScanner={() => setIsDocsLockerOpen(true)}
            onOpenTracker={() => handleOpenTracker()}
            onGenerateForm={(s) => setSelectedSchemeForForm(s)}
            onChecklist={(s) => setSelectedSchemeForChecklist(s)}
          />
        </main>
      </div>

      {/* Citizen Document Locker Modal */}
      <DocumentLockerModal
        isOpen={isDocsLockerOpen}
        onClose={() => setIsDocsLockerOpen(false)}
        documents={userVerifiedDocs}
        onDocumentUpload={handleDocumentVerified}
        onDocumentRemove={handleDocumentRemoved}
        onClearAllDocs={handleClearAllDocs}
        userName={userName}
        language={language}
      />

      {/* Smart Document Scanner Modal */}
      <DocumentScannerModal
        isOpen={isDocScannerOpen}
        onClose={() => setIsDocScannerOpen(false)}
        language={language}
        onDocumentVerified={handleDocumentVerified}
        currentProfile={profile}
      />

      {/* 1-Click Pre-Filled Application Form Modal */}
      <ApplicationFormModal
        isOpen={!!selectedSchemeForForm}
        onClose={() => setSelectedSchemeForForm(null)}
        scheme={selectedSchemeForForm}
        profile={profile}
        userName={userName}
        userAadhaar={userAadhaar}
        language={language}
        onTrackApplication={(appId) => handleOpenTracker(appId)}
      />

      {/* Document Completeness Checklist Modal */}
      <DocumentChecklistModal
        isOpen={!!selectedSchemeForChecklist}
        onClose={() => setSelectedSchemeForChecklist(null)}
        scheme={selectedSchemeForChecklist}
        userDocs={userVerifiedDocs}
        language={language}
        onOpenScanner={() => setIsDocsLockerOpen(true)}
      />

      {/* Live Application Status & DBT Tracker Modal */}
      <ApplicationTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackerInitialId(undefined);
        }}
        language={language}
        initialApplicationId={trackerInitialId}
        applicantName={userName}
        applicantAadhaar={userAadhaar}
        applicantState={profile.state}
        onOpenCSC={() => setActiveTab('csc')}
        onOpenDocsLocker={() => setIsDocsLockerOpen(true)}
      />
    </div>
  );
}
