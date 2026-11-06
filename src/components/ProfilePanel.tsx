'use client';

import React from 'react';
import { UserProfile, VerifiedDocument, DocumentType } from '../types';
import CSCLocator from './CSCLocator';
import DocumentLockerSection from './DocumentLockerSection';

interface ThreadSummary {
  _id: string;
  title: string;
  updatedAt: string;
  profile: UserProfile;
}

export type ProfilePanelTab = 'chats' | 'profile' | 'docs' | 'csc';

interface ProfilePanelProps {
  // Original Profile parameters
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  language: 'en' | 'hi';
  
  // Threads list & session control parameters
  activeThreadId: string | null;
  threads: ThreadSummary[];
  onThreadSelect: (threadId: string) => void;
  onNewChat: () => void;
  onDeleteThread: (threadId: string) => void;
  
  // Tab controller parameters
  activeTab: ProfilePanelTab;
  onTabChange: (tab: ProfilePanelTab) => void;

  // Document locker parameters
  documents?: VerifiedDocument[];
  onDocumentUpload?: (doc: VerifiedDocument) => void;
  onDocumentRemove?: (type: DocumentType) => void;
  onClearAllDocs?: () => void;
  userName?: string | null;
  onOpenDocsModal?: () => void;
}

const STATES = [
  'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
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

export default function ProfilePanel({
  profile,
  onProfileChange,
  language,
  activeThreadId,
  threads,
  onThreadSelect,
  onNewChat,
  onDeleteThread,
  activeTab,
  onTabChange,
  documents = [],
  onDocumentUpload,
  onDocumentRemove,
  onClearAllDocs,
  userName,
  onOpenDocsModal
}: ProfilePanelProps) {
  const isHindi = language === 'hi';
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!confirmingId) return;
    const timer = setTimeout(() => {
      setConfirmingId(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [confirmingId]);

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    let parsedValue = value;
    if (field === 'age' || field === 'income') {
      parsedValue = value === '' ? '' : parseInt(value, 10);
      if (isNaN(parsedValue)) parsedValue = undefined;
    }
    
    onProfileChange({
      ...profile,
      [field]: parsedValue,
    });
  };

  const clearProfile = () => {
    onProfileChange({
      age: undefined,
      gender: 'all',
      category: '',
      income: undefined,
      occupation: 'any',
      state: 'All States',
    });
  };

  return (
    <aside className="profile-panel">
      {/* Tab Selectors */}
      <div className="sidebar-tabs">
        <button 
          onClick={() => onTabChange('chats')}
          className={`sidebar-tab ${activeTab === 'chats' ? 'active' : ''}`}
          title={isHindi ? 'चैट इतिहास' : 'Chat History'}
        >
          {isHindi ? '💬 चैट' : '💬 Chats'}
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
          title={isHindi ? 'पात्रता प्रोफ़ाइल' : 'Eligibility Profile'}
        >
          {isHindi ? '👤 पात्रता' : '👤 Profile'}
        </button>
        <button 
          onClick={() => onTabChange('docs')}
          className={`sidebar-tab ${activeTab === 'docs' ? 'active' : ''}`}
          title={isHindi ? 'नागरिक दस्तावेज़ लॉकर' : 'Document Locker'}
        >
          📁 {isHindi ? 'दस्तावेज़' : 'Docs'}
          {documents && documents.length > 0 && (
            <span style={{
              marginLeft: '4px',
              fontSize: '0.68rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.1rem 0.35rem',
              borderRadius: '8px',
              fontWeight: 700
            }}>
              {documents.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => onTabChange('csc')}
          className={`sidebar-tab ${activeTab === 'csc' ? 'active' : ''}`}
          title={isHindi ? 'जन सेवा केंद्र लोकेटर' : 'CSC Locator'}
        >
          {isHindi ? '📍 केंद्र' : '📍 CSC'}
        </button>
      </div>

      {/* VIEW A: THREAD HISTORY LIST */}
      {activeTab === 'chats' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <button onClick={onNewChat} className="new-chat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {isHindi ? 'नया चैट शुरू करें' : 'New Chat'}
          </button>

          {threads.length === 0 ? (
            <div className="empty-threads">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {isHindi ? 'कोई पुराना चैट नहीं मिला।' : 'No past chats found.'}
              </p>
            </div>
          ) : (
            <div className="threads-list">
              {threads.map((t) => {
                const isActive = t._id === activeThreadId;
                let formattedDate = '';
                try {
                  formattedDate = new Date(t.updatedAt).toLocaleDateString([], { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  });
                } catch (e) {
                  formattedDate = t.updatedAt;
                }

                return (
                  <div 
                    key={t._id} 
                    onClick={() => onThreadSelect(t._id)}
                    className={`thread-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="thread-info">
                      <span className="thread-title" title={t.title}>
                        {t.title || (isHindi ? 'नया चैट' : 'New Chat')}
                      </span>
                      <span className="thread-date">{formattedDate}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirmingId === t._id) {
                          onDeleteThread(t._id);
                          setConfirmingId(null);
                        } else {
                          setConfirmingId(t._id);
                        }
                      }}
                      className={`thread-delete-btn ${confirmingId === t._id ? 'confirming' : ''}`}
                      title={confirmingId === t._id 
                        ? (isHindi ? 'हटाने की पुष्टि करें' : 'Confirm Delete') 
                        : (isHindi ? 'चैट हटाएं' : 'Delete Chat')
                      }
                      style={confirmingId === t._id ? {
                        backgroundColor: 'var(--danger)',
                        color: '#ffffff',
                        opacity: 1,
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: 'auto',
                        width: 'auto'
                      } : {}}
                    >
                      {confirmingId === t._id ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{isHindi ? 'पक्का?' : 'Sure?'}</span>
                        </>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW B: ELIGIBILITY PROFILE */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="panel-title" style={{ margin: '0' }}>
              {isHindi ? 'पात्रता प्रोफ़ाइल' : 'Eligibility Profile'}
            </h2>
            <button 
              onClick={clearProfile} 
              className="btn btn-outline btn-sm"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              {isHindi ? 'साफ करें' : 'Reset'}
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            {isHindi 
              ? 'आपके द्वारा चैट में विवरण साझा करने पर यह प्रोफ़ाइल अपने आप अपडेट हो जाती है। आप इसे स्वयं भी बदल सकते हैं।'
              : 'This profile fills up automatically as you share details in the chat. You can also adjust it manually.'
            }
          </p>

          {/* Age Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'आयु (वर्ष)' : 'Age (Years)'}</label>
            <input
              type="number"
              min="1"
              max="110"
              value={profile.age ?? ''}
              onChange={(e) => handleProfileFieldChange('age', e.target.value)}
              placeholder={isHindi ? 'उदा. 25' : 'e.g. 25'}
              className="form-control"
            />
          </div>

          {/* Gender Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'लिंग' : 'Gender'}</label>
            <select
              value={profile.gender || 'all'}
              onChange={(e) => handleProfileFieldChange('gender', e.target.value)}
              className="form-control"
            >
              <option value="all">{isHindi ? 'सभी' : 'All'}</option>
              <option value="male">{isHindi ? 'पुरुष' : 'Male'}</option>
              <option value="female">{isHindi ? 'महिला' : 'Female'}</option>
              <option value="transgender">{isHindi ? 'ट्रांसजेंडर' : 'Transgender'}</option>
            </select>
          </div>

          {/* State Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'राज्य' : 'State'}</label>
            <select
              value={profile.state || 'All States'}
              onChange={(e) => handleProfileFieldChange('state', e.target.value)}
              className="form-control"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state === 'All States' && isHindi ? 'सभी राज्य' : state}
                </option>
              ))}
            </select>
          </div>

          {/* Annual Income Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Family Income (₹)'}</label>
            <input
              type="number"
              min="0"
              step="5000"
              value={profile.income ?? ''}
              onChange={(e) => handleProfileFieldChange('income', e.target.value)}
              placeholder={isHindi ? 'उदा. 150000' : 'e.g. 150000'}
              className="form-control"
            />
          </div>

          {/* Category Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'सामाजिक श्रेणी (जाति)' : 'Social Category (Caste)'}</label>
            <select
              value={profile.category || ''}
              onChange={(e) => handleProfileFieldChange('category', e.target.value)}
              className="form-control"
            >
              <option value="">{isHindi ? 'चुनें (सभी)' : 'Select (All)'}</option>
              <option value="general">{isHindi ? 'सामान्य (General)' : 'General'}</option>
              <option value="obc">{isHindi ? 'अन्य पिछड़ा वर्ग (OBC)' : 'OBC'}</option>
              <option value="sc">{isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Caste (SC)'}</option>
              <option value="st">{isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribe (ST)'}</option>
            </select>
          </div>

          {/* Occupation Group */}
          <div className="form-group">
            <label className="form-label">{isHindi ? 'व्यवसाय' : 'Occupation'}</label>
            <select
              value={profile.occupation || 'any'}
              onChange={(e) => handleProfileFieldChange('occupation', e.target.value)}
              className="form-control"
            >
              {OCCUPATIONS.map((occ) => (
                <option key={occ.value} value={occ.value}>
                  {isHindi ? occ.hi : occ.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* VIEW C: CSC / SEVA KENDRA LOCATOR */}
      {activeTab === 'csc' && (
        <CSCLocator language={language} />
      )}

      {/* VIEW D: CITIZEN DOCUMENT LOCKER */}
      {activeTab === 'docs' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          <DocumentLockerSection
            documents={documents}
            onDocumentUpload={onDocumentUpload || (() => {})}
            onDocumentRemove={onDocumentRemove || (() => {})}
            onClearAllDocs={onClearAllDocs}
            userName={userName}
            language={language}
            isSidebarMode={true}
            onOpenExpandedModal={onOpenDocsModal}
          />
        </div>
      )}
    </aside>
  );
}
