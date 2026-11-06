'use client';

import React from 'react';
import { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
  language: 'en' | 'hi';
  onGenerateForm?: (scheme: Scheme) => void;
  onChecklist?: (scheme: Scheme) => void;
}

export default function SchemeCard({ scheme, language, onGenerateForm, onChecklist }: SchemeCardProps) {
  const isHindi = language === 'hi';
  
  // Resolve localized text strings
  const translation = scheme.language?.hi;
  const displayName = isHindi && translation ? translation.name : scheme.name;
  const displayFullName = isHindi && translation ? translation.fullName : scheme.fullName;
  const displayDesc = isHindi && translation ? translation.description : scheme.description;
  const displayBenefits = isHindi && translation ? translation.benefits : scheme.benefits;
  const displayDocs = isHindi && translation ? translation.documents : scheme.documents;

  return (
    <div className="scheme-card">
      <div className="scheme-ministry">
        {scheme.ministry}
      </div>
      <h3 className="scheme-title" title={displayFullName}>
        {displayName}
      </h3>
      <p className="scheme-desc">
        {displayDesc}
      </p>

      {/* Benefits Summary Badge */}
      <div className="scheme-meta">
        <div className="meta-item">
          <span className="meta-label">{isHindi ? 'फ़ायदे:' : 'Benefits:'}</span>
          <span className="meta-value" style={{ color: 'var(--success)', textAlign: 'right' }}>
            {displayBenefits}
          </span>
        </div>
      </div>

      {/* Required Documents Section */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', margin: 0 }}>
            {isHindi ? 'आवश्यक दस्तावेज़:' : 'Required Documents:'}
          </h4>
          {onChecklist && (
            <button
              type="button"
              onClick={() => onChecklist(scheme)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.1rem 0.3rem',
                borderRadius: '4px'
              }}
              title={isHindi ? 'दस्तावेज़ पूर्णता जाँच' : 'Check completeness'}
            >
              📋 {isHindi ? 'जाँच करें' : 'Check Ready?'}
            </button>
          )}
        </div>
        <ul style={{ paddingLeft: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {displayDocs.slice(0, 3).map((doc, idx) => (
            <li key={idx}>{doc}</li>
          ))}
          {displayDocs.length > 3 && (
            <li style={{ listStyleType: 'none', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              +{displayDocs.length - 3} {isHindi ? 'और दस्तावेज़' : 'more documents'}
            </li>
          )}
        </ul>
      </div>

      {/* Tag Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {scheme.tags.map((tag) => (
          <span 
            key={tag} 
            style={{ 
              fontSize: '0.68rem', 
              fontWeight: '600', 
              padding: '0.15rem 0.45rem', 
              backgroundColor: 'var(--bg-color)', 
              color: 'var(--text-muted)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Buttons: Pre-filled PDF Form + Official Portal Link */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
        {onGenerateForm && (
          <button
            type="button"
            onClick={() => onGenerateForm(scheme)}
            className="btn btn-outline"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            📄 {isHindi ? '1-क्लिक आवेदन पत्र (PDF) बनाएं' : 'Generate Pre-Filled Form (PDF)'}
          </button>
        )}

        <a 
          href={scheme.applicationUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="scheme-link"
          style={{ width: '100%' }}
        >
          {isHindi ? 'आधिकारिक पोर्टल पर आवेदन करें 🔗' : 'Apply on Official Portal 🔗'}
        </a>
      </div>
    </div>
  );
}
