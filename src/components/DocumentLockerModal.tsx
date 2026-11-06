'use client';

import React from 'react';
import { VerifiedDocument, DocumentType } from '../types';
import DocumentLockerSection from './DocumentLockerSection';

interface DocumentLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: VerifiedDocument[];
  onDocumentUpload: (doc: VerifiedDocument) => void;
  onDocumentRemove: (type: DocumentType) => void;
  onClearAllDocs?: () => void;
  userName?: string | null;
  language: 'en' | 'hi';
}

export default function DocumentLockerModal({
  isOpen,
  onClose,
  documents,
  onDocumentUpload,
  onDocumentRemove,
  onClearAllDocs,
  userName,
  language
}: DocumentLockerModalProps) {
  if (!isOpen) return null;

  const isHindi = language === 'hi';

  return (
    <div className="locker-modal-overlay" onClick={onClose}>
      <div 
        className="locker-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="locker-modal-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📁</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {isHindi ? 'नागरिक दस्तावेज़ लॉकर (DigiLocker शैली)' : 'Citizen Document Vault & Locker'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {isHindi ? 'सभी 16 आधिकारिक भारतीय नागरिक दस्तावेज़ अपलोड व प्रबंधन' : 'Upload and manage all 16 official Indian citizen documents'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="locker-modal-close-btn"
            title={isHindi ? 'बंद करें' : 'Close'}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body with Scrollable Document Locker */}
        <div className="locker-modal-content">
          <DocumentLockerSection
            documents={documents}
            onDocumentUpload={onDocumentUpload}
            onDocumentRemove={onDocumentRemove}
            onClearAllDocs={onClearAllDocs}
            userName={userName}
            language={language}
            isSidebarMode={false}
          />
        </div>

        {/* Modal Footer */}
        <div className="locker-modal-footer">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            🔒 {isHindi ? 'दस्तावेज़ आपके ब्राउज़र में सुरक्षित व स्थानीय रूप से सहेजे जाते हैं।' : 'Documents are encrypted locally and stored securely in your browser.'}
          </div>
          <button
            onClick={onClose}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.45rem 1.25rem', fontWeight: 600 }}
          >
            {isHindi ? 'पूर्ण / बंद करें' : 'Done & Close'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .locker-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease-out;
        }

        .locker-modal-container {
          background-color: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .locker-modal-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--panel-bg);
        }

        .locker-modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .locker-modal-close-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }

        :root[data-theme="dark"] .locker-modal-close-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .locker-modal-content {
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .locker-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.5rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--input-bg);
          flex-wrap: wrap;
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

        @media (max-width: 768px) {
          .locker-modal-overlay {
            padding: 0.5rem;
          }
          .locker-modal-container {
            max-height: 96vh;
          }
          .locker-modal-topbar,
          .locker-modal-content,
          .locker-modal-footer {
            padding: 0.85rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}

