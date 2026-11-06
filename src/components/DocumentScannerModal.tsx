'use client';

import React, { useState } from 'react';
import { VerifiedDocument, UserProfile, DocumentType } from '../types';
import { scanDocument } from '../lib/document-scanner';
import { CITIZEN_DOCUMENT_SLOTS } from '../lib/citizen-documents';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  onDocumentVerified: (doc: VerifiedDocument) => void;
  currentProfile: UserProfile;
  userName?: string | null;
}

export default function DocumentScannerModal({
  isOpen,
  onClose,
  language,
  onDocumentVerified,
  currentProfile,
  userName
}: DocumentScannerModalProps) {
  const isHindi = language === 'hi';
  const [selectedType, setSelectedType] = useState<DocumentType>('income_cert');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDoc, setScannedDoc] = useState<VerifiedDocument | null>(null);
  const [activeStep, setActiveStep] = useState<'upload' | 'scanning' | 'result'>('upload');

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setActiveStep('scanning');
    setIsScanning(true);

    try {
      const doc = await scanDocument({ 
        file, 
        selectedType, 
        applicantName: userName || undefined,
        userProfile: currentProfile 
      });
      setScannedDoc(doc);
      setActiveStep('result');
    } catch (e) {
      console.error(e);
      alert(isHindi ? 'स्कैनिंग विफल रही। कृपया वैध दस्तावेज़ फ़ाइल चुनें।' : 'Scanning failed. Please choose a valid document file.');
      setActiveStep('upload');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyAndClose = () => {
    if (scannedDoc) {
      onDocumentVerified(scannedDoc);
    }
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setScannedDoc(null);
    setActiveStep('upload');
    setIsScanning(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(5px)'
    }}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--panel-bg)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          padding: '1.75rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📄</span> {isHindi ? 'स्मार्ट दस्तावेज़ स्कैनर और सत्यापन' : 'Smart Document Scanner & OCR'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              {isHindi 
                ? 'अपना आधिकारिक दस्तावेज़ अपलोड करें। एआई तुरंत आपकी पात्रता और विवरण निकालेगा।' 
                : 'Upload your official certificate or card for automated verification and profile extraction.'
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-sm"
            style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* STEP 1: SELECT TYPE & UPLOAD */}
        {activeStep === 'upload' && (
          <div>
            {/* Document Type Dropdown */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {isHindi ? 'दस्तावेज़ का प्रकार चुनें:' : 'Select Document Type to Verify:'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                className="form-control"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {CITIZEN_DOCUMENT_SLOTS.map((slot) => (
                  <option key={slot.type} value={slot.type}>
                    {slot.icon} {isHindi ? slot.titleHi : slot.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Zone */}
            <div 
              style={{
                border: '2px dashed var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--input-bg)',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                const input = document.getElementById('scanner-file-input');
                if (input) (input as HTMLInputElement).click();
              }}
            >
              <input
                id="scanner-file-input"
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>📤</div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                {isHindi ? 'दस्तावेज़ फ़ाइल चुनें या यहाँ खींचें' : 'Choose Document File or Drag & Drop'}
              </p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isHindi ? 'स्वीकार्य फ़ॉर्मैट: PDF, JPG, PNG (अधिकतम 10MB)' : 'Accepted formats: PDF, JPG, PNG (Max 10MB)'}
              </span>

              <div style={{ marginTop: '1.25rem' }}>
                <span className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1.25rem', pointerEvents: 'none', fontWeight: 600 }}>
                  📁 {isHindi ? 'फ़ाइल ब्राउज़ करें' : 'Browse Files'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              🔒 {isHindi ? 'दस्तावेज़ केवल आपकी पात्रता सत्यापन के लिए प्रोसेस किए जाते हैं।' : 'Documents are processed securely for eligibility verification per government guidelines.'}
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING PROGRESS */}
        {activeStep === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem auto'
            }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              {isHindi ? 'दस्तावेज़ का विश्लेषण व ओसीआर स्कैन हो रहा है...' : 'Analyzing Document & Performing OCR...'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
              {isHindi 
                ? 'सरकारी मुहर, डिजिटल हस्ताक्षर एवं सुरक्षा विवरणों का सत्यापन किया जा रहा है...' 
                : 'Verifying official seal, document structure, issuing authority, and cryptographic attributes...'
              }
            </p>
          </div>
        )}

        {/* STEP 3: SCANNING RESULT & PREVIEW */}
        {activeStep === 'result' && scannedDoc && (
          <div>
            <div style={{
              backgroundColor: 'var(--input-bg)',
              border: '1.5px solid var(--success)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>✅</span> {isHindi ? 'सफलतापूर्वक सत्यापित' : 'Verification Successful'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {scannedDoc.docNumber}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                {scannedDoc.title}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                {scannedDoc.issuingAuthority} • {scannedDoc.issueDate}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.82rem' }}>
                {scannedDoc.extractedData.name && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>{isHindi ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{scannedDoc.extractedData.name}</strong>
                  </div>
                )}
                {scannedDoc.extractedData.income !== undefined && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>{isHindi ? 'वार्षिक आय:' : 'Annual Income:'}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{scannedDoc.extractedData.income.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                {scannedDoc.extractedData.category && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>{isHindi ? 'श्रेणी (जाति):' : 'Social Category:'}</span>
                    <strong style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>{scannedDoc.extractedData.category}</strong>
                  </div>
                )}
                {scannedDoc.extractedData.state && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>{isHindi ? 'राज्य:' : 'State:'}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{scannedDoc.extractedData.state}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleReset}
                className="btn btn-outline btn-sm"
              >
                {isHindi ? 'नया स्कैन करें' : 'Scan Another'}
              </button>
              <button 
                onClick={handleApplyAndClose}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 700 }}
              >
                {isHindi ? 'लॉकर में सुरक्षित करें' : 'Save to Document Vault'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
