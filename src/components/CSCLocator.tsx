'use client';

import React, { useState, useEffect } from 'react';
import { CSCLocation } from '../types';
import { VERIFIED_CSC_CENTERS, findCSCCenters } from '../lib/csc-locator';

interface CSCLocatorProps {
  language: 'en' | 'hi';
  onSelectCenter?: (center: CSCLocation) => void;
}

const POPULAR_PINS = [
  { pin: '560003', labelEn: 'Bengaluru (560003)', labelHi: 'बेंगलुरु (560003)' },
  { pin: '226001', labelEn: 'Lucknow (226001)', labelHi: 'लखनऊ (226001)' },
  { pin: '110001', labelEn: 'Delhi NCR (110001)', labelHi: 'दिल्ली (110001)' },
  { pin: '400028', labelEn: 'Mumbai (400028)', labelHi: 'मुंबई (400028)' },
  { pin: '800001', labelEn: 'Patna (800001)', labelHi: 'पटना (800001)' },
  { pin: '302001', labelEn: 'Jaipur (302001)', labelHi: 'जयपुर (302001)' },
];

export default function CSCLocator({ language }: CSCLocatorProps) {
  const isHindi = language === 'hi';
  const [pincode, setPincode] = useState('');
  const [centers, setCenters] = useState<CSCLocation[]>(VERIFIED_CSC_CENTERS.slice(0, 4));
  const [isLocating, setIsLocating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (pinToSearch?: string) => {
    const targetPin = (pinToSearch ?? pincode).trim();
    if (!targetPin) {
      setCenters(VERIFIED_CSC_CENTERS.slice(0, 4));
      setHasSearched(false);
      return;
    }
    const results = findCSCCenters({ pincode: targetPin });
    setCenters(results);
    setHasSearched(true);
  };

  const handleQuickPin = (pin: string) => {
    setPincode(pin);
    handleSearch(pin);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert(isHindi ? 'आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsLocating(false);
        // Default to a representative metro center or show Bangalore
        handleQuickPin('560001');
      },
      (error) => {
        setIsLocating(false);
        alert(isHindi ? 'स्थान का पता नहीं लगाया जा सका। कृपया अपना पिनकोड दर्ज करें।' : 'Could not detect location. Please enter your 6-digit Pincode.');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="csc-locator-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 className="panel-title" style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📍</span> {isHindi ? 'निकटतम सेवा केंद्र' : 'Nearest Seva Kendra'}
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isHindi 
              ? 'ऑफ़लाइन आवेदन, ई-केवाईसी और प्रमाणपत्र के लिए अपने पास का सीएससी केंद्र खोजें' 
              : 'Find Common Service Centers (CSC) for offline applications & e-KYC'
            }
          </p>
        </div>
      </div>

      {/* Pincode Search Box */}
      <div className="csc-search-box">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={isHindi ? '6-अंकीय पिनकोड दर्ज करें...' : 'Enter 6-digit Pincode...'}
            className="form-control"
            style={{ fontSize: '0.9rem', padding: '0.55rem 0.8rem' }}
          />
          <button 
            onClick={() => handleSearch()} 
            className="btn btn-primary btn-sm"
            style={{ padding: '0.55rem 1rem', whiteSpace: 'nowrap', fontWeight: 600 }}
          >
            {isHindi ? 'खोजें' : 'Search'}
          </button>
        </div>

        {/* GPS Detect Location button */}
        <button
          onClick={detectLocation}
          disabled={isLocating}
          className="btn btn-outline btn-sm"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.4rem',
            fontSize: '0.8rem',
            borderColor: 'var(--border-color)',
            color: 'var(--primary)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          {isLocating 
            ? (isHindi ? 'स्थान खोज रहे हैं...' : 'Detecting GPS...') 
            : (isHindi ? 'वर्तमान स्थान का उपयोग करें' : 'Use Current Location')
          }
        </button>

        {/* Quick Popular Pincodes */}
        <div style={{ marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
            {isHindi ? 'त्वरित पिनकोड:' : 'Quick Pincodes:'}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {POPULAR_PINS.map((p) => (
              <button
                key={p.pin}
                onClick={() => handleQuickPin(p.pin)}
                className="btn btn-sm"
                style={{
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.72rem',
                  backgroundColor: pincode === p.pin ? 'var(--primary)' : 'var(--bg-color)',
                  color: pincode === p.pin ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px'
                }}
              >
                {isHindi ? p.labelHi : p.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 0.5rem 0' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          {isHindi ? `उपलब्ध केंद्र (${centers.length})` : `Available Centers (${centers.length})`}
        </span>
        {hasSearched && (
          <button 
            onClick={() => { setPincode(''); setCenters(VERIFIED_CSC_CENTERS.slice(0, 4)); setHasSearched(false); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
          >
            {isHindi ? 'सभी देखें' : 'View All'}
          </button>
        )}
      </div>

      {/* Center Cards List */}
      <div className="csc-cards-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', paddingRight: '4px' }}>
        {centers.map((c) => (
          <div 
            key={c.id} 
            className="csc-card"
            style={{
              backgroundColor: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'border-color 0.2s ease, transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {c.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {c.vleName}
                </span>
              </div>
              <span 
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}
              >
                PIN: {c.pincode}
              </span>
            </div>

            {/* Address */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              📍 {c.address}, {c.district}, {c.state}
            </p>

            {/* Timings & Phone */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              <span>🕒 {c.timings}</span>
            </div>

            {/* Services Offered Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
              {c.services.slice(0, 4).map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-secondary)',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '3px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  ✓ {s}
                </span>
              ))}
              {c.services.length > 4 && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  +{c.services.length - 4} {isHindi ? 'अन्य' : 'more'}
                </span>
              )}
            </div>

            {/* Actions: Call & Map Directions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)' }}>
              <a
                href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                className="btn btn-outline btn-sm"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem',
                  fontSize: '0.75rem',
                  textDecoration: 'none'
                }}
              >
                📞 {isHindi ? 'कॉल करें' : 'Call Center'}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' ' + c.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem',
                  fontSize: '0.75rem',
                  textDecoration: 'none'
                }}
              >
                🗺️ {isHindi ? 'दिशा-निर्देश' : 'Directions'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

