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
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .copy-button {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          margin-left: 12px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .copy-button:hover {
          background: linear-gradient(135deg, var(--primary-color-hover), var(--primary-color-dark-hover));
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .copy-button:active {
          transform: translateY(0);
        }
        .copy-success {
          color: var(--success-color);
          font-weight: 600;
          margin-left: 12px;
          user-select: none;
          animation: fadeIn 0.3s ease;
        }
        .score-pulse {
          animation: pulse 0.6s ease;
        }
        .emoji-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          '--primary-color': '#3b82f6',
          '--primary-color-dark': '#2563eb',
          '--primary-color-hover': '#60a5fa',
          '--primary-color-dark-hover': '#1d4ed8',
          '--success-color': '#10b981',
          margin: '30px auto',
          maxWidth: '700px',
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#1f2937',
          whiteSpace: 'pre-wrap',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'text',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src={getImage()}
            alt={`Reaction face showing ${
              score <= 3 ? 'sad' : score <= 6 ? 'neutral' : 'happy'
            } emotion`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
              marginBottom: '16px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            className="emoji-float"
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
          />
          <p
            style={{
              fontWeight: '800',
              fontSize: '1.75rem',
              margin: '0.5rem 0',
              color: score <= 3 ? '#ef4444' : score <= 6 ? '#f59e0b' : '#10b981',
              transition: 'all 0.4s ease',
              textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
            className="score-pulse"
            aria-label={`Your score is ${animScore} out of 10`}
          >
            Your Score: {animScore}/10
          </p>
          <div 
            style={{
              height: '4px',
              width: '100px',
              background: 'linear-gradient(90deg, rgba(239,68,68,0.2), rgba(245,158,11,0.2), rgba(16,185,129,0.2))',
              margin: '1rem auto',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div 
              style={{
                height: '100%',
                width: `${animScore * 10}%`,
                background: score <= 3 ? '#ef4444' : score <= 6 ? '#f59e0b' : '#10b981',
                transition: 'width 0.6s ease, background 0.4s ease',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>

        <div
          className={visibleFeedback ? 'fade-in' : ''}
          ref={feedbackRef}
          style={{
            fontSize: '1.05rem',
            lineHeight: '1.7',
            backgroundColor: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '16px',
            color: '#111827',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.03)',
            position: 'relative',
            border: '1px solid rgba(0,0,0,0.03)',
          }}
          tabIndex={0}
        >
          {visibleFeedback}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
            <button
              className="copy-button"
              onClick={handleCopy}
              aria-label="Copy feedback to clipboard"
            >
              {copied ? 'Copied!' : 'Copy Feedback'}
            </button>
            {copied && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: '8px' }}
              >
                <path
                  d="M5 13L9 17L19 7"
                  stroke="var(--success-color)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackCard;