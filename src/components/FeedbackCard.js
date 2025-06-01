import React, { useMemo, useState, useEffect, useRef } from 'react';

const FeedbackCard = ({ feedback }) => {
  const score = useMemo(() => {
    const match = feedback.match(/Overall Score:\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  }, [feedback]);

  const [visibleFeedback, setVisibleFeedback] = useState('');
  const [animScore, setAnimScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const feedbackRef = useRef(null);

  // Fade effect on feedback change
  useEffect(() => {
    setVisibleFeedback('');
    const timeout = setTimeout(() => {
      setVisibleFeedback(feedback);
      setCopied(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [feedback]);

  // Animate score count up when feedback changes
  useEffect(() => {
    if (score === null) return;
    let start = 0;
    const duration = 600; // ms
    const stepTime = 20;
    const increment = score / (duration / stepTime);
    const interval = setInterval(() => {
      start += increment;
      if (start >= score) {
        start = score;
        clearInterval(interval);
      }
      setAnimScore(Math.floor(start));
    }, stepTime);
    return () => clearInterval(interval);
  }, [score]);

  if (score === null) return null;

  const getImage = () => {
    if (score <= 3) return '/images/sad.png';
    if (score <= 6) return '/images/neutral.png';
    return '/images/happy.png';
  };

  const handleCopy = () => {
    if (!visibleFeedback) return;
    navigator.clipboard.writeText(visibleFeedback).then(() => {
      setCopied(true);
    });
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        .copy-button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
          margin-left: 10px;
        }
        .copy-button:hover {
          background: var(--primary-color-hover);
        }
        .copy-success {
          color: #16a34a;
          font-weight: 600;
          margin-left: 10px;
          user-select: none;
        }
      `}</style>

      <div
        style={{
          '--primary-color': '#2563eb',
          '--primary-color-hover': '#1e40af',
          margin: '30px auto',
          maxWidth: '700px',
          padding: '30px 40px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.15)',
          fontFamily: "'Inter', sans-serif",
          color: '#1f2937',
          whiteSpace: 'pre-wrap',
          transition: 'all 0.4s ease',
          userSelect: 'text',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src={getImage()}
            alt={`Reaction face showing ${
              score <= 3 ? 'sad' : score <= 6 ? 'neutral' : 'happy'
            } emotion`}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25)',
              marginBottom: '12px',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <p
            style={{
              fontWeight: '700',
              fontSize: '1.5rem',
              color: score <= 3 ? '#dc2626' : score <= 6 ? '#f59e0b' : '#10b981',
              transition: 'color 0.3s ease',
            }}
            aria-label={`Your score is ${animScore} out of 10`}
          >
            Your Score: {animScore}/10
          </p>
        </div>

        <div
          className={visibleFeedback ? 'fade-in' : ''}
          ref={feedbackRef}
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            backgroundColor: '#f3f4f6',
            padding: '1rem 1.2rem',
            borderRadius: '14px',
            color: '#111827',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.07)',
            position: 'relative',
          }}
          tabIndex={0}
        >
          {visibleFeedback}
          <button
            className="copy-button"
            onClick={handleCopy}
            aria-label="Copy feedback to clipboard"
          >
            Copy
          </button>
          {copied && <span className="copy-success">Copied!</span>}
        </div>
      </div>
    </>
  );
};

export default FeedbackCard;
