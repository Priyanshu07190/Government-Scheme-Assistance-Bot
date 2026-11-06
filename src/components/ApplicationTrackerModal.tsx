'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationTrackRecord } from '../types';
import { 
  lookupApplicationFromDb, 
  fetchUserApplicationsFromDb, 
  progressApplicationInDb, 
  deleteApplicationFromDb,
  UserSavedApplication 
} from '../lib/application-tracker';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  initialApplicationId?: string;
  applicantName?: string | null;
  applicantAadhaar?: string | null;
  applicantState?: string | null;
  onOpenCSC?: () => void;
  onOpenDocsLocker?: () => void;
}

export default function ApplicationTrackerModal({
  isOpen,
  onClose,
  language,
  initialApplicationId,
  applicantName,
  applicantAadhaar,
  applicantState,
  onOpenCSC,
  onOpenDocsLocker
}: ApplicationTrackerModalProps) {
  const isHindi = language === 'hi';

  const [searchId, setSearchId] = useState(initialApplicationId || '');
  const [currentRecord, setCurrentRecord] = useState<ApplicationTrackRecord | null>(null);
  const [savedUserApps, setSavedUserApps] = useState<UserSavedApplication[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [advanceMsg, setAdvanceMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user applications from MongoDB whenever tracker opens
  useEffect(() => {
    if (!isOpen) return;

    // Fetch genuine applications saved in MongoDB Atlas
    fetchUserApplicationsFromDb(applicantAadhaar, applicantName).then((apps) => {
      setSavedUserApps(apps);
    });

    if (initialApplicationId) {
      setSearchId(initialApplicationId);
      handleSearch(initialApplicationId);
    } else {
      setCurrentRecord(null);
      setSearchError('');
    }
  }, [initialApplicationId, isOpen, applicantName, applicantAadhaar, applicantState]);

  if (!isOpen) return null;

  const handleSearch = async (idToLookup?: string) => {
    const target = (idToLookup || searchId).trim();
    if (!target) {
      setSearchError(isHindi ? 'कृपया एक वैध आवेदन संदर्भ संख्या दर्ज करें।' : 'Please enter an Application Reference ID.');
      setCurrentRecord(null);
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setAdvanceMsg('');

    try {
      const found = await lookupApplicationFromDb(target);
      if (!found) {
        setSearchError(
          isHindi
            ? `राष्ट्रीय डेटाबेस में संदर्भ संख्या "${target}" से कोई आधिकारिक आवेदन नहीं मिला। कृपया संदर्भ संख्या जांचें।`
            : `No application record found with Reference ID "${target}" in the National Database. Please verify the Application Reference Number or submit an application first.`
        );
        setCurrentRecord(null);
      } else {
        setCurrentRecord(found);
        setSearchId(found.applicationId);
        setSearchError('');
      }
    } catch (err: any) {
      setSearchError(isHindi ? 'डेटाबेस से कनेक्ट करने में त्रुटि।' : 'Error connecting to the National Database.');
      setCurrentRecord(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdvanceMilestone = async () => {
    if (!currentRecord) return;
    setIsAdvancing(true);
    setAdvanceMsg('');
    try {
      const updated = await progressApplicationInDb(currentRecord.applicationId);
      if (updated) {
        setCurrentRecord(updated);
        setAdvanceMsg(isHindi ? '✅ मील का पत्थर सफलतापूर्वक राष्ट्रीय डेटाबेस में अपडेट किया गया!' : '✅ Milestone progress updated in National Database!');
        setTimeout(() => setAdvanceMsg(''), 4000);
        // Refresh list
        fetchUserApplicationsFromDb(applicantAadhaar, applicantName).then((apps) => {
          setSavedUserApps(apps);
        });
      }
    } catch (e) {
      console.error('Failed to advance stage in DB:', e);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleDeleteApplication = async (appIdToDelete: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteApplicationFromDb(appIdToDelete);
      if (success) {
        // Refresh active list from MongoDB
        fetchUserApplicationsFromDb(applicantAadhaar, applicantName).then((apps) => {
          setSavedUserApps(apps);
        });
        // If current record is the one deleted, clear it
        if (currentRecord?.applicationId === appIdToDelete) {
          setCurrentRecord(null);
          setSearchId('');
        }
        setSearchError(
          isHindi
            ? `आवेदन ${appIdToDelete} को राष्ट्रीय डेटाबेस से सफलतापूर्वक वापस ले लिया गया और हटा दिया गया है।`
            : `Application ${appIdToDelete} has been successfully withdrawn and deleted from the National Database.`
        );
      }
    } catch (e) {
      console.error('Failed to delete application from DB:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyId = () => {
    if (!currentRecord) return;
    navigator.clipboard.writeText(currentRecord.applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const getStatusBadge = (record: ApplicationTrackRecord) => {
    switch (record.overallStatus) {
      case 'disbursed':
        return (
          <span className="status-badge badge-success">
            🟢 {isHindi ? 'डीबीटी राशि अंतरित / सफल' : 'DBT Disbursed & Successful'}
          </span>
        );
      case 'action_required':
        return (
          <span className="status-badge badge-warning">
            ⚠️ {isHindi ? 'कार्रवाई आवश्यक (कार्रवाई करें)' : 'Action Required by Citizen'}
          </span>
        );
      case 'approved':
        return (
          <span className="status-badge badge-success">
            ✅ {isHindi ? 'स्वीकृत / भुगतान प्रक्रियाधीन' : 'Sanctioned & Payment Pending'}
          </span>
        );
      default:
        return (
          <span className="status-badge badge-progress">
            🔄 {isHindi ? `प्रक्रियाधीन (चरण ${record.currentStageNumber}/5)` : `In Progress (Stage ${record.currentStageNumber}/5)`}
          </span>
        );
    }
  };

  return (
    <div className="tracker-modal-overlay" onClick={onClose}>
      <div 
        className="tracker-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="tracker-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.45rem' }}>🚚</span>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {isHindi ? 'आवेदन स्थिति व डीबीटी ट्रैकर' : 'Application Status & DBT Tracker'}
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                {isHindi 
                  ? 'सरकारी सत्यापन मील के पत्थर व सीधे बैंक अंतरण (DBT) की रीयल-टाइम स्थिति' 
                  : 'Track real-time government milestones, officer scrutiny & direct benefit transfer'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="tracker-close-btn" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="tracker-content">
          {/* Search Bar Section */}
          <div className="tracker-search-section">
            <div className="tracker-search-input-wrap">
              <input
                type="text"
                placeholder={isHindi ? 'आवेदन संदर्भ संख्या दर्ज करें (उदा. GOV-PMKI-2024-88912)...' : 'Enter Application Reference ID (e.g., GOV-PMKI-2024-88912)...'}
                value={searchId}
                onChange={(e) => { setSearchId(e.target.value); setSearchError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="tracker-input"
              />
              <button
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="btn btn-primary btn-sm search-action-btn"
              >
                {isSearching ? (isHindi ? 'खोज रहे हैं...' : 'Tracking...') : (isHindi ? 'ट्रैक करें' : 'Track Status')}
              </button>
            </div>
            {searchError && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}>
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
                <div>
                  <strong style={{ color: 'var(--danger)', fontSize: '0.88rem', display: 'block', marginBottom: '0.2rem' }}>
                    {isHindi ? 'आवेदन नहीं मिला (Not Found in Database)' : 'Application Not Found in Database'}
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, display: 'block' }}>
                    {searchError}
                  </span>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isHindi 
                      ? '🔒 केवल वही आवेदन ट्रैक किए जा सकते हैं जो डेटाबेस में पंजीकृत हों।' 
                      : '🔒 Only authentic applications recorded in MongoDB database can be tracked.'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STATE A: WHEN NO RECORD IS SELECTED / SEARCHED YET */}
          {!currentRecord && (
            <div className="empty-tracker-view">
              {savedUserApps.length > 0 ? (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    {isHindi ? '📋 आपके द्वारा उत्पन्न किए गए आवेदन:' : '📋 Your Active Generated Applications:'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {savedUserApps.map((app) => (
                      <div 
                        key={app.applicationId}
                        className="user-app-card"
                        onClick={() => handleSearch(app.applicationId)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                          <span className="app-card-id">{app.applicationId}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{app.submissionDate}</span>
                        </div>
                        <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {app.schemeFullName}
                        </h5>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            👤 {app.applicantName}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(isHindi 
                                  ? `क्या आप आवेदन ${app.applicationId} को राष्ट्रीय डेटाबेस से हटाना / वापस लेना चाहते हैं?` 
                                  : `Are you sure you want to withdraw and delete application ${app.applicationId} from the National Database?`
                                )) {
                                  handleDeleteApplication(app.applicationId);
                                }
                              }}
                              className="btn btn-outline btn-sm"
                              style={{
                                padding: '0.2rem 0.45rem',
                                fontSize: '0.74rem',
                                borderColor: 'var(--danger)',
                                color: 'var(--danger)',
                                borderRadius: 'var(--radius-sm)'
                              }}
                              title={isHindi ? 'आवेदन हटाएं' : 'Withdraw & Delete Application'}
                            >
                              🗑️
                            </button>
                            <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700 }}>
                              {isHindi ? 'ट्रैक करें ➔' : 'Track Status ➔'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="tracker-guide-box">
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏛️</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
                    {isHindi ? 'राष्ट्रीय योजना आवेदन ट्रैकिंग पोर्टल' : 'National Scheme Application Tracking Portal'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                    {isHindi 
                      ? 'अपनी आवेदन पावती रसीद या उत्पन्न किए गए आवेदन पत्र से 12-20 अंकों का संदर्भ कोड ऊपर दर्ज करें।' 
                      : 'Enter your Application Reference Number from your submission acknowledgement slip or generated application form to view real-time department milestones and DBT progress.'
                    }
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--input-bg)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', maxWidth: '420px', margin: '0 auto', textAlign: 'left' }}>
                    💡 <strong>{isHindi ? 'आवेदन कैसे बनाएं?' : 'How to apply?'}</strong> {isHindi 
                      ? 'पात्र योजनाओं में से किसी पर "प्री-फिल्ड फॉर्म जनरेट करें" पर क्लिक करें। आपको एक आधिकारिक संदर्भ संख्या प्राप्त होगी।' 
                      : 'Click "Generate Pre-Filled Form" on any eligible scheme card. You will instantly receive an official reference ID to track here.'
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE B: RECORD IS LOADED & DISPLAYED */}
          {currentRecord && (
            <div className="printable-slip">
              {/* Reset to Search Bar Link & DB Sync Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>🟢</span> {isHindi ? 'डेटाबेस रिकॉर्ड सक्रिय' : 'MongoDB Atlas Live Record'}
                  </span>
                  {currentRecord.currentStageNumber < 5 && (
                    <button
                      onClick={handleAdvanceMilestone}
                      disabled={isAdvancing}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                        fontWeight: 700
                      }}
                      title={isHindi ? 'अगले चरण की जांच करें और डेटाबेस अपडेट करें' : 'Simulate officer action & update stage in Database'}
                    >
                      {isAdvancing 
                        ? (isHindi ? 'डेटाबेस अपडेट हो रहा है...' : 'Updating DB...') 
                        : (isHindi ? '🔄 अगला चरण अपडेट करें (DB)' : '🔄 Advance Milestone in DB')
                      }
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      if (confirm(isHindi 
                        ? `क्या आप आवेदन ${currentRecord.applicationId} को वापस लेकर राष्ट्रीय डेटाबेस से हटाना चाहते हैं?` 
                        : `Are you sure you want to withdraw and permanently delete application ${currentRecord.applicationId} from the National Database?`
                      )) {
                        handleDeleteApplication(currentRecord.applicationId);
                      }
                    }}
                    disabled={isDeleting}
                    className="btn btn-outline btn-sm"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.55rem',
                      borderColor: 'var(--danger)',
                      color: 'var(--danger)',
                      fontWeight: 700
                    }}
                    title={isHindi ? 'आवेदन वापस लें व डेटाबेस से हटाएं' : 'Withdraw & Delete Application from Database'}
                  >
                    {isDeleting 
                      ? (isHindi ? 'हटाया जा रहा है...' : 'Deleting...') 
                      : (isHindi ? '🗑️ आवेदन वापस लें / हटाएं' : '🗑️ Withdraw / Delete')
                    }
                  </button>

                  <button
                    onClick={() => { setCurrentRecord(null); setSearchId(''); setSearchError(''); }}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
                  >
                    ← {isHindi ? 'अन्य आवेदन खोजें' : 'Search Another Application'}
                  </button>
                </div>
              </div>

              {advanceMsg && (
                <div style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid var(--success)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  color: 'var(--success)',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  {advanceMsg}
                </div>
              )}

              {/* Overview Card */}
              <div className="tracker-overview-card">
                <div className="overview-top">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="ref-number-tag">{currentRecord.applicationId}</span>
                      <button 
                        onClick={handleCopyId}
                        className="copy-btn"
                        title="Copy Reference ID"
                      >
                        {copied ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <h4 className="scheme-title">{currentRecord.schemeFullName}</h4>
                  </div>
                  <div>{getStatusBadge(currentRecord)}</div>
                </div>

                {/* Citizen & Submission Metadata */}
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                    <span className="item-value">{currentRecord.applicantName}</span>
                  </div>
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'आधार संख्या:' : 'Aadhaar (Last 4):'}</span>
                    <span className="item-value">XXXX-XXXX-{currentRecord.aadhaarLast4}</span>
                  </div>
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'जमा करने की तिथि:' : 'Submitted On:'}</span>
                    <span className="item-value">{currentRecord.submissionDate}</span>
                  </div>
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'अपेक्षित निस्तारण:' : 'Expected Date:'}</span>
                    <span className="item-value highlight">{currentRecord.expectedResolutionDate}</span>
                  </div>
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'राज्य व जिला:' : 'State & District:'}</span>
                    <span className="item-value">{currentRecord.district}, {currentRecord.state}</span>
                  </div>
                  <div className="overview-item">
                    <span className="item-label">{isHindi ? 'वर्तमान स्तर:' : 'Current Level:'}</span>
                    <span className="item-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      Stage {currentRecord.currentStageNumber} of 5
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION REQUIRED BANNER (if applicable) */}
              {currentRecord.actionRequired && (
                <div className="action-required-banner">
                  <div className="action-icon">⚠️</div>
                  <div className="action-content">
                    <h5 className="action-title">
                      {isHindi ? currentRecord.actionRequired.titleHi : currentRecord.actionRequired.titleEn}
                    </h5>
                    <p className="action-desc">
                      {isHindi ? currentRecord.actionRequired.descriptionHi : currentRecord.actionRequired.descriptionEn}
                    </p>
                    <div className="action-buttons-row">
                      {onOpenCSC && (
                        <button 
                          onClick={() => { onClose(); onOpenCSC(); }}
                          className="btn btn-sm action-btn-primary"
                        >
                          📍 {isHindi ? 'निकटतम सेवा केंद्र खोजें' : 'Locate Nearest CSC Kendra'}
                        </button>
                      )}
                      {onOpenDocsLocker && (
                        <button 
                          onClick={() => { onClose(); onOpenDocsLocker(); }}
                          className="btn btn-sm action-btn-secondary"
                        >
                          📁 {isHindi ? 'दस्तावेज़ लॉकर खोलें' : 'Open Document Locker'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Milestones Timeline */}
              <div className="timeline-section">
                <h4 className="timeline-title">
                  {isHindi ? '🏛️ आधिकारिक सत्यापन एवं प्रगति मील के पत्थर' : '🏛️ Official Verification Milestones & Department Workflow'}
                </h4>

                <div className="milestones-flow">
                  {currentRecord.stages.map((stage, idx) => {
                    const isDone = stage.status === 'completed';
                    const isCurrent = stage.status === 'in_progress';
                    const isAction = stage.status === 'action_required';

                    return (
                      <div 
                        key={stage.id} 
                        className={`milestone-row ${isDone ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''} ${isAction ? 'is-action' : ''}`}
                      >
                        {/* Left Icon Node & Connector */}
                        <div className="milestone-node-wrap">
                          <div className="milestone-node">
                            {isDone ? '✓' : isAction ? '!' : stage.stepNumber}
                          </div>
                          {idx < currentRecord.stages.length - 1 && <div className="milestone-line" />}
                        </div>

                        {/* Right Details Box */}
                        <div className="milestone-content">
                          <div className="milestone-header-row">
                            <h5 className="milestone-name">
                              {isHindi ? stage.titleHi : stage.titleEn}
                            </h5>
                            {stage.completedDate && (
                              <span className="milestone-date">
                                📅 {stage.completedDate}
                              </span>
                            )}
                          </div>

                          <div className="milestone-dept">
                            🏢 {isHindi ? stage.departmentHi : stage.departmentEn}
                            {stage.officerName && ` • 👤 ${stage.officerName}`}
                          </div>

                          {(stage.remarksEn || stage.remarksHi) && (
                            <div className="milestone-remarks">
                              <span className="remarks-label">{isHindi ? 'आधिकारिक टिप्पणी:' : 'Official Remarks:'}</span>{' '}
                              {isHindi ? stage.remarksHi : stage.remarksEn}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DBT Financial Disbursement Box (if payment details available) */}
              {currentRecord.paymentDetails && (
                <div className="dbt-payment-box">
                  <div className="dbt-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>💰</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                          {isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) व वित्तीय विवरण' : 'Direct Benefit Transfer (DBT) & Payment Gateways'}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {currentRecord.paymentDetails.installmentNumber || 'Welfare Disbursal'}
                        </span>
                      </div>
                    </div>
                    <div className="dbt-amount-tag">
                      ₹{currentRecord.paymentDetails.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="dbt-grid">
                    <div className="dbt-item">
                      <span className="dbt-label">{isHindi ? 'लाभार्थी बैंक:' : 'Beneficiary Bank:'}</span>
                      <span className="dbt-value">{currentRecord.paymentDetails.bankName}</span>
                    </div>
                    <div className="dbt-item">
                      <span className="dbt-label">{isHindi ? 'खाता संख्या:' : 'A/c (Last 4):'}</span>
                      <span className="dbt-value font-mono">****{currentRecord.paymentDetails.accountLast4}</span>
                    </div>
                    <div className="dbt-item">
                      <span className="dbt-label">IFSC Code:</span>
                      <span className="dbt-value font-mono">{currentRecord.paymentDetails.ifscCode}</span>
                    </div>
                    <div className="dbt-item">
                      <span className="dbt-label">{isHindi ? 'पीएफएमएस स्थिति:' : 'PFMS Status:'}</span>
                      <span className={`dbt-value ${currentRecord.paymentDetails.pfmsStatus === 'Validated' ? 'text-green' : 'text-amber'}`}>
                        {currentRecord.paymentDetails.pfmsStatus}
                      </span>
                    </div>
                    <div className="dbt-item">
                      <span className="dbt-label">{isHindi ? 'एनपीसीआई आधार सीडिंग:' : 'NPCI Aadhaar Bridge:'}</span>
                      <span className={`dbt-value ${currentRecord.paymentDetails.npciAadhaarSeeding === 'Active' ? 'text-green' : 'text-red'}`}>
                        {currentRecord.paymentDetails.npciAadhaarSeeding === 'Active' ? '🟢 Active / सक्रिय' : '🔴 Inactive / असक्रिय'}
                      </span>
                    </div>
                    {currentRecord.paymentDetails.utrNumber && (
                      <div className="dbt-item">
                        <span className="dbt-label">{isHindi ? 'यूटीआर संदर्भ संख्या:' : 'UTR Transaction No:'}</span>
                        <span className="dbt-value font-mono highlight">{currentRecord.paymentDetails.utrNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="tracker-footer">
          {currentRecord && (
            <button
              onClick={handlePrintSlip}
              className="btn btn-outline btn-sm print-btn"
            >
              🖨️ {isHindi ? 'स्थिति रसीद प्रिंट करें (PDF)' : 'Print Status Slip (PDF)'}
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.45rem 1.4rem', fontWeight: 600, marginLeft: 'auto' }}
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .tracker-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        .tracker-modal-card {
          background-color: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 900px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .tracker-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.25rem;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tracker-close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }

        :root[data-theme="dark"] .tracker-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tracker-content {
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .tracker-search-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .tracker-search-input-wrap {
          display: flex;
          gap: 0.5rem;
        }

        .tracker-input {
          flex: 1;
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          font-family: monospace;
          font-weight: 600;
        }

        .tracker-input:focus {
          border-color: var(--primary);
        }

        .search-action-btn {
          padding: 0.65rem 1.25rem;
          font-weight: 700;
        }

        .empty-tracker-view {
          padding: 1.5rem 0;
        }

        .user-app-card {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-app-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .app-card-id {
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--primary);
          background: rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .tracker-guide-box {
          text-align: center;
          padding: 2.5rem 1rem;
        }

        /* Overview Card */
        .tracker-overview-card {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .overview-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .ref-number-tag {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
          background: rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .copy-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.72rem;
          padding: 0.15rem 0.45rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .copy-btn:hover {
          color: var(--text-primary);
        }

        .scheme-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0.4rem 0 0 0;
          color: var(--text-primary);
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 14px;
          white-space: nowrap;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-progress {
          background: rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.15);
          color: var(--primary);
          border: 1px solid rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.3);
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.15);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-color);
        }

        .overview-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .item-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .item-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-value.highlight {
          color: var(--primary);
          font-weight: 700;
        }

        /* Action Required Banner */
        .action-required-banner {
          background: rgba(245, 158, 11, 0.1);
          border: 1.5px solid #f59e0b;
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-top: 1rem;
        }

        .action-icon {
          font-size: 1.6rem;
          line-height: 1;
        }

        .action-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #b45309;
          margin: 0 0 0.35rem 0;
        }

        :root[data-theme="dark"] .action-title {
          color: #fde68a;
        }

        .action-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0 0 0.75rem 0;
        }

        .action-buttons-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn-primary {
          background: #d97706;
          color: #ffffff;
          border: none;
          font-weight: 700;
        }

        .action-btn-secondary {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        /* Timeline Section */
        .timeline-section {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .timeline-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .milestones-flow {
          display: flex;
          flex-direction: column;
        }

        .milestone-row {
          display: flex;
          gap: 1rem;
          position: relative;
        }

        .milestone-node-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .milestone-node {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          background: var(--input-bg);
          border: 2px solid var(--border-color);
          color: var(--text-muted);
          z-index: 2;
          transition: all 0.2s ease;
        }

        .milestone-line {
          width: 2px;
          flex: 1;
          background-color: var(--border-color);
          min-height: 40px;
        }

        .milestone-row.is-completed .milestone-node {
          background: var(--success);
          border-color: var(--success);
          color: #ffffff;
        }

        .milestone-row.is-completed .milestone-line {
          background-color: var(--success);
        }

        .milestone-row.is-current .milestone-node {
          background: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.25);
          animation: pulse 1.5s infinite;
        }

        .milestone-row.is-action .milestone-node {
          background: #ef4444;
          border-color: #ef4444;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25);
        }

        .milestone-content {
          flex: 1;
          padding-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .milestone-header-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .milestone-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .milestone-date {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .milestone-dept {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .milestone-remarks {
          font-size: 0.78rem;
          color: var(--text-secondary);
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.4rem 0.65rem;
          margin-top: 0.35rem;
          line-height: 1.35;
        }

        .remarks-label {
          font-weight: 700;
          color: var(--text-primary);
        }

        /* DBT Payment Box */
        .dbt-payment-box {
          background: rgba(16, 185, 129, 0.05);
          border: 1.5px solid var(--success);
          border-radius: var(--radius-md);
          padding: 1.15rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .dbt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dbt-amount-tag {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--success);
          font-family: monospace;
        }

        .dbt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.65rem;
          padding-top: 0.65rem;
          border-top: 1px dashed rgba(16, 185, 129, 0.3);
        }

        .dbt-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .dbt-label {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .dbt-value {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .font-mono {
          font-family: monospace;
        }

        .text-green {
          color: var(--success);
        }

        .text-amber {
          color: #d97706;
        }

        .text-red {
          color: var(--danger);
        }

        .tracker-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.5rem;
          border-top: 1px solid var(--border-color);
          background: var(--input-bg);
          gap: 0.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.25);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .tracker-modal-overlay {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: white !important;
            padding: 0;
          }
          .tracker-modal-card {
            border: none;
            box-shadow: none;
            max-width: 100%;
            max-height: none;
            overflow: visible;
          }
          .printable-slip, .printable-slip * {
            visibility: visible;
          }
          .printable-slip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .tracker-header, .tracker-search-section, .tracker-footer, .copy-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .tracker-modal-overlay {
            padding: 0.5rem;
          }
          .tracker-header, .tracker-content, .tracker-footer {
            padding: 0.85rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
