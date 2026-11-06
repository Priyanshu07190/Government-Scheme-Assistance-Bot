import React from 'react';

interface TypingIndicatorProps {
  language: 'en' | 'hi';
}

export default function TypingIndicator({ language }: TypingIndicatorProps) {
  const isHindi = language === 'hi';
  
  return (
    <div className="message-row bot typing-row">
      <div className="typing-bubble">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '6px' }}>
          {isHindi ? 'खोज रहा है' : 'Searching'}
        </span>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
}
