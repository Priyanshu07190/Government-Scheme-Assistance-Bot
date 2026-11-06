'use client';

import React, { useState, useMemo } from 'react';
import { VerifiedDocument, DocumentType, UserProfile } from '../types';
import { 
  CITIZEN_DOCUMENT_SLOTS, 
  DocumentSlotDefinition, 
  createVerifiedDocFromFile 
} from '../lib/citizen-documents';

interface DocumentLockerSectionProps {
  documents: VerifiedDocument[];
  onDocumentUpload: (doc: VerifiedDocument) => void;
  onDocumentRemove: (type: DocumentType) => void;
  onClearAllDocs?: () => void;
  userName?: string | null;
  language: 'en' | 'hi';
  isSidebarMode?: boolean;
  onOpenExpandedModal?: () => void;
}

export default function DocumentLockerSection({
  documents,
  onDocumentUpload,
  onDocumentRemove,
  onClearAllDocs,
  userName,
  language,
  isSidebarMode = false,
  onOpenExpandedModal
}: DocumentLockerSectionProps) {
  const isHindi = language === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'uploaded' | 'blank'>('all');
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VerifiedDocument | null>(null);

  // Map of uploaded documents indexed by type for quick lookup
  const uploadedDocMap = useMemo(() => {
    const map = new Map<DocumentType, VerifiedDocument>();
    documents.forEach(doc => {
      map.set(doc.type, doc);
    });
    return map;
  }, [documents]);

  const totalSlots = CITIZEN_DOCUMENT_SLOTS.length;
  const uploadedCount = documents.length;
  const completionPercentage = Math.round((uploadedCount / totalSlots) * 100);

  // Filtered document slots
  const filteredSlots = useMemo(() => {
    return CITIZEN_DOCUMENT_SLOTS.filter(slot => {
      // Category filter
      if (selectedCategory !== 'all' && slot.category !== selectedCategory) {
        return false;
      }

      // Upload status filter
      const isUploaded = uploadedDocMap.has(slot.type);
      if (filterStatus === 'uploaded' && !isUploaded) return false;
      if (filterStatus === 'blank' && isUploaded) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNameEn = slot.titleEn.toLowerCase().includes(q);
        const matchesNameHi = slot.titleHi.toLowerCase().includes(q);
        const matchesDeptEn = slot.deptEn.toLowerCase().includes(q);
        const matchesDeptHi = slot.deptHi.toLowerCase().includes(q);
        const matchesType = slot.type.toLowerCase().includes(q);
        return matchesNameEn || matchesNameHi || matchesDeptEn || matchesDeptHi || matchesType;
      }

      return true;
    });
  }, [selectedCategory, filterStatus, searchQuery, uploadedDocMap]);

  // Handle direct file upload
  const handleFileUpload = (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    setTimeout(() => {
      const verified = createVerifiedDocFromFile(type, file, userName || undefined);
      onDocumentUpload(verified);
      setUploadingType(null);
    }, 600);
  };

  return (
    <div className={`doc-locker-container ${isSidebarMode ? 'sidebar-mode' : 'full-mode'}`}>
      {/* Locker Header */}
      <div className="locker-header">
        <div className="locker-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: isSidebarMode ? '1.1rem' : '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isHindi ? '📁 नागरिक दस्तावेज़ लॉकर' : '📁 Citizen Document Locker'}
            </h2>
            <span className="locker-count-pill">
              {uploadedCount}/{totalSlots} {isHindi ? 'अपलोड' : 'Uploaded'}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            {isHindi 
              ? 'अपने दस्तावेज़ अपलोड करें। जो दस्तावेज़ आपके पास नहीं हैं, उन्हें खाली छोड़ दें।' 
              : 'Upload your documents. You can leave any slot blank if you do not have it.'}
          </p>
        </div>

        {/* Top actions */}
        <div className="locker-header-actions">
          {isSidebarMode && onOpenExpandedModal && (
            <button 
              onClick={onOpenExpandedModal}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              title={isHindi ? 'बड़ा दृश्य खोलें' : 'Open Full Grid View'}
            >
              <span>{isHindi ? 'विस्तारित दृश्य ↗' : 'Expanded View ↗'}</span>
            </button>
          )}

          {uploadedCount > 0 && onClearAllDocs && (
            <button
              onClick={() => {
                if (window.confirm(isHindi ? 'क्या आप सभी दस्तावेज़ हटाना चाहते हैं?' : 'Remove all uploaded documents?')) {
                  onClearAllDocs();
                }
              }}
              className="btn btn-outline btn-sm"
              style={{ 
                borderColor: 'var(--danger)', 
                color: 'var(--danger)', 
                fontSize: '0.78rem',
                padding: '0.35rem 0.65rem' 
              }}
              title={isHindi ? 'सभी दस्तावेज़ खाली करें' : 'Clear all documents'}
            >
              {isHindi ? 'खाली करें' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* Progress & Readiness Bar */}
      <div className="locker-progress-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-primary)' }}>
            {isHindi ? 'दस्तावेज़ पूर्णता स्तर' : 'Document Readiness Level'}
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
            {completionPercentage}% ({uploadedCount} of {totalSlots})
          </span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${completionPercentage}%`,
              backgroundColor: completionPercentage > 60 ? 'var(--success)' : completionPercentage > 25 ? 'var(--primary)' : 'var(--warning)'
            }}
          />
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          💡 {isHindi 
            ? 'केवल वही अपलोड करें जो आपके पास हैं। शेष स्लॉट रिक्त रहने पर कोई रुकावट नहीं होगी।' 
            : 'Only upload what you have. Blank slots will simply be skipped without penalty.'}
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="locker-controls">
        <div className="locker-search-box">
          <input
            type="text"
            placeholder={isHindi ? '🔍 दस्तावेज़ खोजें (उदा: PAN, राशन, आय, Land)...' : '🔍 Search document (e.g., PAN, Ration, Income, Land)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="locker-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="locker-filter-pills">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            {isHindi ? 'सभी (16)' : 'All (16)'}
          </button>
          <button
            onClick={() => setSelectedCategory('identity')}
            className={`filter-pill ${selectedCategory === 'identity' ? 'active' : ''}`}
          >
            🆔 {isHindi ? 'पहचान व पता (5)' : 'Identity (5)'}
          </button>
          <button
            onClick={() => setSelectedCategory('income_land')}
            className={`filter-pill ${selectedCategory === 'income_land' ? 'active' : ''}`}
          >
            🌾 {isHindi ? 'आय व भूमि (4)' : 'Income & Land (4)'}
          </button>
          <button
            onClick={() => setSelectedCategory('social_welfare')}
            className={`filter-pill ${selectedCategory === 'social_welfare' ? 'active' : ''}`}
          >
            📜 {isHindi ? 'सामाजिक व शिक्षा (3)' : 'Social & Edu (3)'}
          </button>
          <button
            onClick={() => setSelectedCategory('employment_health')}
            className={`filter-pill ${selectedCategory === 'employment_health' ? 'active' : ''}`}
          >
            🏥 {isHindi ? 'स्वास्थ्य व श्रमिक (4)' : 'Health & Labor (4)'}
          </button>
        </div>

        {/* Status Toggle: All / Uploaded / Blank */}
        <div className="locker-status-toggle">
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {isHindi ? 'दिखाएँ:' : 'Filter:'}
          </span>
          <button 
            onClick={() => setFilterStatus('all')}
            className={`status-btn ${filterStatus === 'all' ? 'active' : ''}`}
          >
            {isHindi ? 'सब' : 'All'}
          </button>
          <button 
            onClick={() => setFilterStatus('uploaded')}
            className={`status-btn ${filterStatus === 'uploaded' ? 'active' : ''}`}
          >
            ✅ {isHindi ? `अपलोड (${uploadedCount})` : `Uploaded (${uploadedCount})`}
          </button>
          <button 
            onClick={() => setFilterStatus('blank')}
            className={`status-btn ${filterStatus === 'blank' ? 'active' : ''}`}
          >
            ⚪ {isHindi ? `खाली (${totalSlots - uploadedCount})` : `Blank (${totalSlots - uploadedCount})`}
          </button>
        </div>
      </div>

      {/* Document Slots Grid */}
      <div className={`doc-slots-grid ${isSidebarMode ? 'sidebar-grid' : 'normal-grid'}`}>
        {filteredSlots.length === 0 ? (
          <div className="empty-search-state">
            <span style={{ fontSize: '2rem' }}>🔍</span>
            <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>
              {isHindi ? 'कोई दस्तावेज़ नहीं मिला' : 'No matching documents found'}
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setFilterStatus('all'); }}
              className="btn btn-outline btn-sm"
              style={{ marginTop: '0.75rem' }}
            >
              {isHindi ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          filteredSlots.map(slot => {
            const uploaded = uploadedDocMap.get(slot.type);
            const isUploading = uploadingType === slot.type;

            return (
              <div 
                key={slot.type}
                className={`doc-slot-card ${uploaded ? 'is-uploaded' : 'is-blank'}`}
              >
                {/* Slot Top Bar */}
                <div className="slot-top-row">
                  <div className="slot-icon-title">
                    <span className="slot-icon">{slot.icon}</span>
                    <div>
                      <h4 className="slot-title">
                        {isHindi ? slot.titleHi : slot.titleEn}
                      </h4>
                      <p className="slot-dept">
                        {isHindi ? slot.deptHi : slot.deptEn}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {uploaded ? (
                      <span className="badge badge-uploaded">
                        ✅ {isHindi ? 'सत्यापित' : 'Uploaded & Verified'}
                      </span>
                    ) : (
                      <span className="badge badge-blank">
                        ⚪ {isHindi ? 'रिक्त (वैकल्पिक)' : 'Blank (Not Held)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Slot Description */}
                <p className="slot-description">
                  {isHindi ? slot.descriptionHi : slot.descriptionEn}
                </p>

                {/* State: When Document is UPLOADED */}
                {uploaded ? (
                  <div className="uploaded-details-box">
                    <div className="uploaded-meta-row">
                      <div className="meta-item">
                        <span className="meta-label">{isHindi ? 'दस्तावेज़ संख्या:' : 'Doc Number:'}</span>
                        <span className="meta-value doc-number-pill">{uploaded.docNumber}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">{isHindi ? 'जारी तिथि:' : 'Issued Date:'}</span>
                        <span className="meta-value">{uploaded.issueDate}</span>
                      </div>
                    </div>

                    {/* Extracted Highlights */}
                    <div className="extracted-pills">
                      {uploaded.extractedData.income && (
                        <span className="ext-pill">
                          💰 ₹{uploaded.extractedData.income.toLocaleString('en-IN')}/yr
                        </span>
                      )}
                      {uploaded.extractedData.category && (
                        <span className="ext-pill" style={{ textTransform: 'uppercase' }}>
                          🏛️ {uploaded.extractedData.category}
                        </span>
                      )}
                      {uploaded.extractedData.rationCardType && (
                        <span className="ext-pill">
                          🌾 {uploaded.extractedData.rationCardType}
                        </span>
                      )}
                      {uploaded.extractedData.landAreaAcres && (
                        <span className="ext-pill">
                          🌱 {uploaded.extractedData.landAreaAcres} Acres
                        </span>
                      )}
                      {uploaded.extractedData.state && (
                        <span className="ext-pill">
                          📍 {uploaded.extractedData.state}
                        </span>
                      )}
                      {uploaded.fileName && (
                        <span className="ext-pill file-name-pill" title={uploaded.fileName}>
                          📄 {uploaded.fileName}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons for Uploaded Doc */}
                    <div className="slot-actions-row">
                      <button
                        onClick={() => setPreviewDoc(uploaded)}
                        className="slot-btn btn-view"
                        title={isHindi ? 'विवरण देखें' : 'View Extracted Details'}
                      >
                        👁️ {isHindi ? 'देखें' : 'View'}
                      </button>

                      {/* Replace file input */}
                      <label className="slot-btn btn-replace" title={isHindi ? 'नया दस्तावेज़ अपलोड करें' : 'Replace document'}>
                        🔄 {isHindi ? 'बदलें' : 'Replace'}
                        <input
                          type="file"
                          accept={slot.acceptedFormats}
                          onChange={(e) => handleFileUpload(slot.type, e)}
                          style={{ display: 'none' }}
                        />
                      </label>

                      <button
                        onClick={() => onDocumentRemove(slot.type)}
                        className="slot-btn btn-remove"
                        title={isHindi ? 'दस्तावेज़ हटाएं' : 'Remove document'}
                      >
                        🗑️ {isHindi ? 'हटाएं' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* State: When Slot is BLANK / UNUPLOADED */
                  <div className="blank-slot-box">
                    {isUploading ? (
                      <div className="uploading-state">
                        <div className="spinner-sm" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                          {isHindi ? 'दस्तावेज़ स्कैन व सत्यापन हो रहा है...' : 'Scanning & Verifying Document...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="blank-notice">
                          <span>⚪</span>
                          <span>
                            {isHindi 
                              ? 'यदि आपके पास यह दस्तावेज़ नहीं है, तो इसे खाली रहने दें।' 
                              : 'Leave blank if not possessed. You can still apply for schemes that don\'t require it.'}
                          </span>
                        </div>

                        <div className="blank-actions">
                          {/* Real Local File Upload */}
                          <label className="btn btn-primary btn-sm upload-file-btn" style={{ padding: '0.45rem 1rem', cursor: 'pointer', fontWeight: 600 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <span>{isHindi ? 'दस्तावेज़ अपलोड करें' : `Upload ${slot.titleEn.split(' ')[0]}`}</span>
                            <input
                              type="file"
                              accept={slot.acceptedFormats}
                              onChange={(e) => handleFileUpload(slot.type, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detail / Preview Modal Lightbox */}
      {previewDoc && (
        <div className="preview-lightbox-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="preview-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="preview-lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {CITIZEN_DOCUMENT_SLOTS.find(s => s.type === previewDoc.type)?.icon || '📄'}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {previewDoc.title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {previewDoc.issuingAuthority}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="close-lightbox-btn"
              >
                ✕
              </button>
            </div>

            <div className="preview-lightbox-body">
              <div className="cert-preview-watermark">
                <div className="cert-seal">
                  <div className="seal-emblem">🇮🇳</div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Govt of India Verified
                  </span>
                </div>

                <div className="cert-field-grid">
                  <div className="cert-field">
                    <span className="cert-label">{isHindi ? 'दस्तावेज़ संख्या' : 'Document Number'}:</span>
                    <span className="cert-val highlight">{previewDoc.docNumber}</span>
                  </div>
                  <div className="cert-field">
                    <span className="cert-label">{isHindi ? 'सत्यापन स्थिति' : 'Verification Status'}:</span>
                    <span className="cert-val" style={{ color: 'var(--success)', fontWeight: 700 }}>
                      Verified ({(previewDoc.confidence * 100).toFixed(0)}% confidence)
                    </span>
                  </div>
                  <div className="cert-field">
                    <span className="cert-label">{isHindi ? 'जारी तिथि' : 'Issue Date'}:</span>
                    <span className="cert-val">{previewDoc.issueDate}</span>
                  </div>
                  <div className="cert-field">
                    <span className="cert-label">{isHindi ? 'जारीकर्ता संस्था' : 'Issuing Authority'}:</span>
                    <span className="cert-val">{previewDoc.issuingAuthority}</span>
                  </div>

                  {/* Extracted fields */}
                  {Object.entries(previewDoc.extractedData).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <div key={key} className="cert-field">
                        <span className="cert-label" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="cert-val">{String(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="btn btn-primary btn-sm"
                >
                  {isHindi ? 'ठीक है' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS styling */}
      <style jsx>{`
        .doc-locker-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .locker-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .locker-count-pill {
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          border: 1px solid rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.2);
        }

        .locker-header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .locker-progress-box {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
        }

        .progress-bar-track {
          width: 100%;
          height: 8px;
          background-color: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        :root[data-theme="dark"] .progress-bar-track {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.4s ease, background-color 0.3s ease;
        }

        .locker-controls {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .locker-search-box {
          position: relative;
          width: 100%;
        }

        .locker-search-input {
          width: 100%;
          padding: 0.55rem 2rem 0.55rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .locker-search-input:focus {
          border-color: var(--primary);
        }

        .search-clear-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
        }

        .locker-filter-pills {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: thin;
        }

        .filter-pill {
          white-space: nowrap;
          font-size: 0.74rem;
          padding: 0.3rem 0.65rem;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          background: var(--panel-bg);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 600;
        }

        .locker-status-toggle {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .status-btn {
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .status-btn.active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          border-color: var(--primary);
        }

        .doc-slots-grid {
          display: grid;
          gap: 0.85rem;
        }

        .normal-grid {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .sidebar-grid {
          grid-template-columns: 1fr;
        }

        .doc-slot-card {
          background: var(--panel-bg);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.2s ease;
          position: relative;
        }

        .doc-slot-card.is-uploaded {
          border: 1.5px solid var(--success);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
        }

        .doc-slot-card.is-blank {
          border: 1.5px dashed var(--border-color);
          background: rgba(0, 0, 0, 0.01);
        }

        :root[data-theme="dark"] .doc-slot-card.is-blank {
          background: rgba(255, 255, 255, 0.02);
        }

        .slot-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .slot-icon-title {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
        }

        .slot-icon {
          font-size: 1.6rem;
          line-height: 1;
        }

        .slot-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.25;
        }

        .slot-dept {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          line-height: 1.2;
        }

        .badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          white-space: nowrap;
        }

        .badge-uploaded {
          background: var(--success-light);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        :root[data-theme="dark"] .badge-uploaded {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .badge-blank {
          background: rgba(0, 0, 0, 0.04);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        :root[data-theme="dark"] .badge-blank {
          background: rgba(255, 255, 255, 0.05);
        }

        .slot-description {
          font-size: 0.76rem;
          color: var(--text-secondary);
          line-height: 1.35;
          margin: 0;
        }

        /* Uploaded State Box */
        .uploaded-details-box {
          background: rgba(16, 185, 129, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        :root[data-theme="dark"] .uploaded-details-box {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .uploaded-meta-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 0.75rem;
        }

        .meta-item {
          display: flex;
          gap: 0.3rem;
          align-items: center;
        }

        .meta-label {
          color: var(--text-muted);
        }

        .doc-number-pill {
          font-family: monospace;
          font-weight: 700;
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.05);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        :root[data-theme="dark"] .doc-number-pill {
          background: rgba(255, 255, 255, 0.1);
        }

        .extracted-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .ext-pill {
          font-size: 0.7rem;
          font-weight: 600;
          background: var(--panel-bg);
          border: 1px solid var(--border-color);
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          color: var(--text-secondary);
        }

        .file-name-pill {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .slot-actions-row {
          display: flex;
          gap: 0.4rem;
          align-items: center;
          margin-top: 0.2rem;
          padding-top: 0.4rem;
          border-top: 1px dashed rgba(16, 185, 129, 0.2);
        }

        .slot-btn {
          font-size: 0.72rem;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .btn-view {
          background: var(--panel-bg);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .btn-view:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-replace {
          background: var(--panel-bg);
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        .btn-replace:hover {
          border-color: var(--accent-teal);
          color: var(--accent-teal);
        }

        .btn-remove {
          background: transparent;
          color: var(--danger);
          margin-left: auto;
        }

        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Blank Slot Box */
        .blank-slot-box {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .blank-notice {
          display: flex;
          gap: 0.4rem;
          align-items: flex-start;
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .blank-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .upload-file-btn {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          padding: 0.35rem 0.65rem;
          border-color: var(--border-color);
          color: var(--text-primary);
          background: var(--panel-bg);
        }

        .upload-file-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .uploading-state {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem;
          background: var(--input-bg);
          border-radius: var(--radius-sm);
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.2);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Preview Lightbox */
        .preview-lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 1rem;
        }

        .preview-lightbox-card {
          background: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          max-width: 520px;
          width: 100%;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .preview-lightbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .close-lightbox-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
        }

        .preview-lightbox-body {
          padding: 1.25rem;
        }

        .cert-preview-watermark {
          border: 2px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: var(--input-bg);
          position: relative;
        }

        .cert-seal {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--success);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .seal-emblem {
          font-size: 1.2rem;
        }

        .cert-field-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.55rem;
        }

        .cert-field {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          gap: 0.5rem;
        }

        .cert-label {
          color: var(--text-muted);
        }

        .cert-val {
          color: var(--text-primary);
          font-weight: 600;
          text-align: right;
        }

        .cert-val.highlight {
          font-family: monospace;
          background: rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
          color: var(--primary);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .empty-search-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          text-align: center;
        }
      `}</style>
    </div>
  );
}

