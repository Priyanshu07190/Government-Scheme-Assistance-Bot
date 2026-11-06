'use client';

import React, { useRef } from 'react';
import { Scheme, UserProfile } from '../types';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
  profile: UserProfile;
  userName: string | null;
  userAadhaar: string | null;
  language: 'en' | 'hi';
  onTrackApplication?: (appRefId: string) => void;
}

export default function ApplicationFormModal({
  isOpen,
  onClose,
  scheme,
  profile,
  userName,
  userAadhaar,
  language,
  onTrackApplication
}: ApplicationFormModalProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hi';

  if (!isOpen || !scheme) return null;

  const translation = scheme.language?.hi;
  const displayName = isHindi && translation ? translation.name : scheme.name;
  const displayFullName = isHindi && translation ? translation.fullName : scheme.fullName;
  const benefits = isHindi && translation ? translation.benefits : scheme.benefits;
  const documents = isHindi && translation ? translation.documents : scheme.documents;

  // Mask Aadhaar: e.g. "XXXX-XXXX-4567"
  const cleanAadhaar = userAadhaar && userAadhaar !== 'guest' ? userAadhaar : '901234567890';
  const maskedAadhaar = `XXXX-XXXX-${cleanAadhaar.slice(-4)}`;
  const [appRefId, setAppRefId] = React.useState<string>('');
  const [isSavedToDb, setIsSavedToDb] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isOpen || !scheme) return;
    const cleanSchemeTag = scheme.name.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase() || 'WELF';
    const refId = `GOV-${cleanSchemeTag}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setAppRefId(refId);
    setIsSavedToDb(false);

    // Persist application record directly to MongoDB Atlas
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: refId,
        schemeId: (scheme as any)._id || scheme.name,
        schemeName: scheme.name,
        schemeFullName: scheme.fullName,
        applicantName: userName || 'Citizen Applicant',
        aadhaarNumber: userAadhaar && userAadhaar !== 'guest' ? userAadhaar : undefined,
        state: profile.state || 'All States',
        district: profile.district,
        category: profile.category,
        annualIncome: profile.income,
        verifiedDocumentsAttached: scheme.documents || []
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsSavedToDb(true);
        }
      })
      .catch(err => {
        console.error('Failed to save application to MongoDB:', err);
      });
  }, [isOpen, scheme, userName, userAadhaar, profile.state, profile.district, profile.category, profile.income]);

  const applicantName = userName || 'Citizen Applicant';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
===================================================================
       GOVERNMENT OF INDIA - WELFARE APPLICATION SUMMARY
===================================================================
Application Reference ID: ${appRefId}
Date of Generation: ${new Date().toLocaleDateString('en-GB')}

SCHEME DETAILS:
- Scheme Name: ${scheme.name} (${scheme.fullName})
- Sponsoring Ministry: ${scheme.ministry}
- Benefits: ${scheme.benefits}

APPLICANT PROFILE:
- Applicant Name: ${applicantName}
- Aadhaar Number: ${maskedAadhaar}
- Age: ${profile.age || 'Not Specified'}
- Gender: ${profile.gender || 'All'}
- State: ${profile.state || 'All States'}
- Category / Caste: ${profile.category || 'General'}
- Annual Income: ₹${profile.income?.toLocaleString('en-IN') || 'Eligible'}
- Occupation: ${profile.occupation || 'Any'}

REQUIRED ENCLOSURES:
${documents.map((d, i) => `[ ] ${i + 1}. ${d}`).join('\n')}

DECLARATION:
I hereby solemnly declare that all statements made in this application are 
true, complete, and correct to the best of my knowledge and belief.

Applicant Signature: _______________________
Date & Place: ______________________________
===================================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Application_${scheme.name.replace(/\s+/g, '_')}_${appRefId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
      backdropFilter: 'blur(4px)'
    }}>
      <div 
        className="modal-card application-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '2rem'
        }}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isHindi ? 'राष्ट्रीय योजना आवेदन प्रपत्र' : 'National Scheme Application Generator'}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
              {isHindi ? '1-क्लिक प्री-फिल्ड आवेदन पत्र' : '1-Click Pre-Filled Application Form'}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {onTrackApplication && (
              <button
                onClick={() => {
                  onClose();
                  onTrackApplication(appRefId);
                }}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.45rem 0.75rem', borderColor: '#2563eb', color: '#2563eb', fontWeight: 700 }}
                title={isHindi ? 'इस आवेदन को ट्रैक करें' : 'Track This Application'}
              >
                🚚 {isHindi ? 'ट्रैक करें' : 'Track Status'}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700, padding: '0.45rem 0.9rem' }}
            >
              🖨️ {isHindi ? 'प्रिंट / पीडीएफ सेव करें' : 'Print / Save as PDF'}
            </button>
            <button
              onClick={handleDownloadText}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.45rem 0.75rem', borderColor: '#cbd5e1', color: '#475569' }}
              title="Download text summary"
            >
              ⬇️ {isHindi ? 'टेक्स्ट डाउनलोड' : 'Download Summary'}
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8', padding: '0.2rem 0.5rem' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL APPLICATION SHEET */}
        <div id="printable-application" ref={formRef} style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '1.5rem',
          border: '2px solid #0f172a',
          borderRadius: '4px',
          fontFamily: "'Inter', sans-serif"
        }}>
          {/* Header with National Emblem style watermark banner */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏛️</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: '#0f172a' }}>
              {isHindi ? 'भारत सरकार / GOVERNMENT OF INDIA' : 'GOVERNMENT OF INDIA'}
            </h2>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', margin: '0.2rem 0' }}>
              {scheme.ministry}
            </h4>
            <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.25rem 0.75rem', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 800 }}>
              {isHindi ? 'कल्याणकारी योजना आधिकारिक आवेदन प्रपत्र' : 'OFFICIAL WELFARE SCHEME APPLICATION FORM'}
            </div>
          </div>

          {/* Reference Meta Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#475569', marginBottom: '1rem', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span><strong>Application ID:</strong> <code style={{ color: '#2563eb', fontWeight: 800 }}>{appRefId}</code></span>
            <span><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-GB')}</span>
            <span>
              <strong>DB Status:</strong>{' '}
              {isSavedToDb ? (
                <span style={{ color: '#16a34a', fontWeight: 700 }}>🟢 Synced to MongoDB Database</span>
              ) : (
                <span style={{ color: '#ca8a04', fontWeight: 700 }}>🔄 Saving to Database...</span>
              )}
            </span>
          </div>

          {/* Scheme Information */}
          <div style={{ marginBottom: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              SECTION 1: SCHEME DETAILS / योजना विवरण
            </div>
            <div style={{ padding: '0.75rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong>Scheme Name:</strong> {displayName} ({displayFullName})</div>
              <div><strong>Ministry / Department:</strong> {scheme.ministry}</div>
              <div><strong>Entitlement / Benefits:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>{benefits}</span></div>
            </div>
          </div>

          {/* Applicant Details Table */}
          <div style={{ marginBottom: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              SECTION 2: APPLICANT PARTICULARS / आवेदक का विवरण
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600, width: '35%' }}>Full Name of Applicant:</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>{applicantName}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>Aadhaar Number (UIDAI):</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{maskedAadhaar} (Verified)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>Age / Gender:</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{profile.age ? `${profile.age} Years` : 'As per Aadhaar'} / {profile.gender?.toUpperCase() || 'GENERAL'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>Social Category (Caste):</td>
                  <td style={{ padding: '0.5rem 0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{profile.category || 'General'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>Annual Household Income:</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>₹{profile.income ? profile.income.toLocaleString('en-IN') : 'Below Threshold Limit'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>State & Domicile:</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{profile.state || 'All States / Resident of India'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', fontWeight: 600 }}>Primary Occupation:</td>
                  <td style={{ padding: '0.5rem 0.75rem', textTransform: 'capitalize' }}>{profile.occupation || 'Farmer / Citizen'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Enclosures Checklist */}
          <div style={{ marginBottom: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              SECTION 3: MANDATORY DOCUMENT ENCLOSURES / संलग्न दस्तावेज़
            </div>
            <div style={{ padding: '0.75rem', fontSize: '0.78rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>
                Please attach self-attested photocopies of the following documents:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ border: '1.5px solid #0f172a', width: '12px', height: '12px', display: 'inline-block' }}></span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Self Declaration & Signature Block */}
          <div style={{ border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '4px', backgroundColor: '#fcfcfc', fontSize: '0.74rem', color: '#334155', lineHeight: '1.4' }}>
            <strong>SELF-DECLARATION / स्व-घोषणा:</strong>
            <p style={{ margin: '0.35rem 0 1.25rem 0' }}>
              I hereby declare that all particulars stated in this application are true and correct to the best of my knowledge and belief. I have not suppressed or misrepresented any material information. If any information is found incorrect, my application may be rejected and appropriate legal action may be taken against me.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
              <div>
                <div><strong>Place / स्थान:</strong> ______________________</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Date / दिनांक:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '160px', height: '35px', borderBottom: '1px solid #0f172a', marginBottom: '0.25rem' }}></div>
                <strong>Signature / Thumb Impression of Applicant</strong>
              </div>
            </div>
          </div>

          {/* Submission Guidance Note */}
          <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: '#64748b', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
            💡 Take this printed application form along with photocopies of required documents to your nearest <strong>Common Service Center (CSC) / Jan Seva Kendra</strong> or <strong>Panchayat Office</strong> for processing.
          </div>
        </div>
      </div>

      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-application, #printable-application * {
            visibility: visible;
          }
          #printable-application {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
