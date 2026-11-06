'use client';

import React from 'react';
import { Scheme, VerifiedDocument } from '../types';
import { checkDocumentCompleteness } from '../lib/document-scanner';

interface DocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
  userDocs: VerifiedDocument[];
  language: 'en' | 'hi';
  onOpenScanner: () => void;
}

export default function DocumentChecklistModal({
  isOpen,
  onClose,
  scheme,
  userDocs,
  language,
  onOpenScanner,
}: DocumentChecklistModalProps) {
  const isHindi = language === 'hi';

  if (!isOpen || !scheme) return null;

  const translation = scheme.language?.hi;
  const displayName = isHindi && translation ? translation.name : scheme.name;
  const displayDocs = isHindi && translation ? translation.documents : scheme.documents;

  const completeness = checkDocumentCompleteness(displayDocs, userDocs);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--panel-bg)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          padding: '1.75rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              📋 {isHindi ? 'दस्तावेज़ पूर्णता जाँच' : 'Document Completeness Checklist'}
            </h3>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem', display: 'inline-block' }}>
              {displayName}
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Readiness Meter Card */}
        <div style={{
          backgroundColor: 'var(--bg-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isHindi ? 'आवेदन तैयारी स्थिति:' : 'Application Readiness:'}
            </span>
            <span style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: completeness.percentage >= 75 ? '#10b981' : completeness.percentage >= 50 ? '#f59e0b' : '#ef4444'
            }}>
              {completeness.matched} / {completeness.total} {isHindi ? 'दस्तावेज़ तैयार' : 'Documents Ready'} ({completeness.percentage}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completeness.percentage}%`,
              height: '100%',
              backgroundColor: completeness.percentage >= 75 ? '#10b981' : completeness.percentage >= 50 ? '#f59e0b' : '#ef4444',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }}></div>
          </div>
        </div>

        {/* Document Checklist Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          {completeness.items.map((item, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: item.isReady ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: item.isReady ? '#10b981' : 'var(--border-color)',
                  color: item.isReady ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {item.isReady ? '✓' : '!'}
                </span>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                  {item.matchedDocTitle && (
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#10b981' }}>
                      🔗 {item.matchedDocTitle}
                    </span>
                  )}
                </div>
              </div>

              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: item.isReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: item.isReady ? '#10b981' : '#ef4444'
              }}>
                {item.isReady 
                  ? (isHindi ? 'तैयार' : 'Ready') 
                  : (isHindi ? 'आवश्यक' : 'Action Required')
                }
              </span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              onClose();
              onOpenScanner();
            }}
            className="btn btn-outline"
            style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', fontWeight: 700, borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            📤 {isHindi ? 'दस्तावेज़ स्कैन करें' : 'Scan / Upload Document'}
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {isHindi ? 'ठीक है' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

