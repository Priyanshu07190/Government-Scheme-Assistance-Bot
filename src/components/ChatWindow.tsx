'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Scheme } from '../types';
import SchemeCard from './SchemeCard';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  language: 'en' | 'hi';
  onOpenScanner?: () => void;
  onOpenTracker?: () => void;
  onGenerateForm?: (scheme: Scheme) => void;
  onChecklist?: (scheme: Scheme) => void;
}

const QUICK_SUGGESTIONS = {
  en: [
    "I am a student from Karnataka",
    "I am a farmer with low income",
    "Schemes for women starting a business",
    "Where is the nearest CSC / Jan Seva Kendra?",
    "Am I eligible for PM-Kisan?",
  ],
  hi: [
    "मैं कर्नाटक से एक छात्र हूँ",
    "मैं कम आय वाला किसान हूँ",
    "व्यवसाय शुरू करने के लिए महिलाओं की योजनाएं",
    "निकटतम जन सेवा केंद्र (CSC) कहाँ है?",
    "क्या मैं पीएम-किसान के लिए पात्र हूँ?",
  ],
};

function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Replace markdown links [label](url) with just label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove markdown symbols #, *, _, `, >, ~
    .replace(/[#*_`>~]/g, '')
    // Normalize extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function formatMessage(text: string): string {
  if (!text) return '';
  
  // 1. Escape HTML first for security (XSS prevention)
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // 2. Convert bold markers (**text** -> <strong>text</strong>)
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // 3. Convert markdown links ([label](url) -> <a href="url" target="_blank" rel="noopener noreferrer">label</a>)
  formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // 4. Convert plain URLs that are not part of markdown links:
  const urlRegex = /(^|\s)(https?:\/\/[^\s<]+)/g;
  formatted = formatted.replace(urlRegex, (match, spacing, url) => {
    if (match.includes('href=') || match.includes('target=')) {
      return match;
    }
    return `${spacing}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
  
  return formatted;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading,
  language,
  onOpenScanner,
  onOpenTracker,
  onGenerateForm,
  onChecklist
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isHindi = language === 'hi';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up speech synthesis & speech recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Stop listening if active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  // Text-to-Speech (Voice Output)
  const toggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(isHindi ? 'आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता है।' : 'Text-to-speech is not supported in your browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text (Voice Input)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHindi 
        ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता है। कृपया Google Chrome या Edge का उपयोग करें।' 
        : 'Voice input is not supported in this browser. Please use Google Chrome or Edge.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Scrollable messages viewport */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center',
            color: 'var(--text-secondary)',
            padding: '2rem'
          }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="48" 
              height="48" 
              fill="none" 
              stroke="var(--text-muted)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginBottom: '1.25rem' }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {isHindi ? 'योजना सहायक चैट में आपका स्वागत है' : 'Welcome to GovScheme Assistant'}
            </h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '440px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              {isHindi 
                ? 'सरकारी योजनाओं को खोजने के लिए अपनी पात्रता पूछें, दस्तावेज़ 📄 स्कैन करें, या सीधे माइक 🎙️ से बोलकर पूछें।'
                : 'Ask questions, type your details, scan certificates 📄, or click the mic button 🎙️ below to speak naturally in English or Hindi.'
              }
            </p>

            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="btn btn-outline btn-sm"
                style={{
                  marginTop: '1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 700,
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)'
                }}
              >
                📄 {isHindi ? 'राशन/आय प्रमाणपत्र स्कैन करें' : 'Scan Ration / Income Certificate'}
              </button>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className="message-bubble">
                <div 
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />

                {/* If the message contains matched schemes cards */}
                {msg.schemes && msg.schemes.length > 0 && (
                  <div className="schemes-grid">
                    {msg.schemes.map((scheme) => (
                      <SchemeCard 
                        key={scheme.name} 
                        scheme={scheme} 
                        language={language}
                        onGenerateForm={onGenerateForm}
                        onChecklist={onChecklist}
                      />
                    ))}
                  </div>
                )}

                {/* Message Footer Actions */}
                <div className="message-footer" style={{ display: 'flex', justifyContent: msg.sender === 'bot' ? 'space-between' : 'flex-end', alignItems: 'center', marginTop: '0.45rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      onClick={() => toggleSpeech(msg.id, msg.text)}
                      className={`speech-btn ${speakingMsgId === msg.id ? 'active' : ''}`}
                      title={speakingMsgId === msg.id ? (isHindi ? 'आवाज़ बंद करें' : 'Stop Audio') : (isHindi ? 'आवाज़ में सुनें' : 'Read Aloud')}
                      aria-label="Read message aloud"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <span className="sound-wave">
                            <span></span><span></span><span></span>
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="6" width="12" height="12" rx="2" />
                          </svg>
                          <span>{isHindi ? 'रोकें' : 'Stop'}</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                          </svg>
                          <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  )}
                  <span className="message-timestamp" style={{ margin: 0 }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && <TypingIndicator language={language} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions pills & Input box */}
      <div className="chat-input-area">
        {messages.length < 5 && (
          <div className="quick-suggestions">
            {onOpenScanner && (
              <button 
                type="button" 
                onClick={onOpenScanner}
                className="suggestion-pill"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}
              >
                📄 {isHindi ? 'दस्तावेज़ स्कैन करें' : 'Scan Document'}
              </button>
            )}
            {onOpenTracker && (
              <button 
                type="button" 
                onClick={onOpenTracker}
                className="suggestion-pill"
                style={{ borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)', fontWeight: 700 }}
              >
                🚚 {isHindi ? 'आवेदन ट्रैक करें' : 'Track Status'}
              </button>
            )}
            {QUICK_SUGGESTIONS[language].map((sug) => (
              <button 
                key={sug} 
                onClick={() => handleSuggestionClick(sug)}
                disabled={isLoading}
                className="suggestion-pill"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Live Listening Banner */}
        {isListening && (
          <div className="listening-banner">
            <span className="listening-dot"></span>
            <span>
              {isHindi ? '🎙️ सुन रहा हूँ... कृपया बोलिए...' : '🎙️ Listening to your voice... Speak now...'}
            </span>
            <button 
              type="button" 
              onClick={toggleListening}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', marginLeft: 'auto' }}
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="input-container">
          {/* Document Upload Button in Input Bar */}
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              disabled={isLoading}
              className="doc-attach-btn"
              title={isHindi ? 'दस्तावेज़ स्कैन करें / अपलोड करें' : 'Scan or Upload Document'}
              aria-label="Upload document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening 
              ? (isHindi ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...') 
              : (isHindi ? 'पात्रता पूछें, दस्तावेज़ जोड़ें या माइक से बोलें...' : 'Ask about schemes, attach doc, or speak...')
            }
            disabled={isLoading}
            className={`chat-input ${isListening ? 'listening-input' : ''}`}
            autoFocus
          />

          {/* Voice Microphone Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
            title={isListening 
              ? (isHindi ? 'सुनना बंद करें' : 'Stop Listening') 
              : (isHindi ? 'बोलकर पूछें (माइक चालू करें)' : 'Speak your query (Click Mic)')
            }
            aria-label="Voice input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>

          {/* Text Send Button */}
          <button 
            type="submit" 
            disabled={isLoading || !inputText.trim()} 
            className="chat-send-btn"
            title={isHindi ? 'संदेश भेजें' : 'Send Message'}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
