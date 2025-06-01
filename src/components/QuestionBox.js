import React, { useEffect, useState, useRef } from 'react';
import API from '../api';

const QuestionBox = ({ selectedRole, sessionId, onFeedback }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]); // store question history for Previous button
  const [historyIndex, setHistoryIndex] = useState(-1); // track position in history
  const [listening, setListening] = useState(false);

  // Ref for SpeechRecognition instance
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition API if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        if (event.results.length > 0) {
          const speechResult = event.results[0][0].transcript;
          setAnswer((prev) => (prev ? prev + ' ' : '') + speechResult);
        }
        setListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };
    } else {
      recognitionRef.current = null;
    }
  }, []);

  // Fetch question helper
  const fetchQuestion = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post(endpoint, { role: selectedRole, session_id: sessionId });
      if (res.data && res.data.question) {
        setQuestion(res.data.question);
        setAnswer('');
        setFeedback('');
        onFeedback('');

        if (endpoint === '/get_question' || endpoint === '/next_question') {
          setHistory((prev) => [...prev.slice(0, historyIndex + 1), res.data.question]);
          setHistoryIndex((prev) => prev + 1);
        }
      } else {
        setQuestion('');
        setError('No question available. Please try again later.');
      }
    } catch (e) {
      setError('Failed to fetch question. Please check your connection.');
      setQuestion('');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedRole || !sessionId) return;
    fetchQuestion('/get_question');
  }, [selectedRole, sessionId]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await API.post('/ask', { role: selectedRole, answer });
      setFeedback(res.data.feedback);
      onFeedback(res.data.feedback);
    } catch {
      setFeedback('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const tryAgain = () => {
    if (historyIndex >= 0) {
      setQuestion(history[historyIndex]);
      setAnswer('');
      setFeedback('');
      onFeedback('');
    }
  };

  const nextQuestion = () => {
    fetchQuestion('/next_question');
  };

  const previousQuestion = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setQuestion(history[prevIndex]);
      setHistoryIndex(prevIndex);
      setAnswer('');
      setFeedback('');
      onFeedback('');
    }
  };

  const playAudio = () => {
    if (!question) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Start/stop speech recognition for answer input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="p-4 border rounded my-4">
      <h2 className="font-bold mb-2">Question:</h2>
      {loading ? (
        <p>Loading question...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : question ? (
        <>
          <p className="mb-4 whitespace-pre-wrap">{question}</p>
          <button
            onClick={playAudio}
            disabled={loading || !question}
            className="bg-indigo-600 text-white px-3 py-1 rounded mb-4"
          >
            🔊 Play Audio
          </button>
        </>
      ) : (
        <p>No active question found, please request a new question.</p>
      )}

      <textarea
        rows="4"
        className="w-full p-2 border rounded"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        disabled={loading || !question}
      />

      <button
        onClick={toggleListening}
        disabled={loading || !question}
        className={`mb-4 px-4 py-2 rounded text-white ${listening ? 'bg-red-600' : 'bg-green-600'}`}
      >
        {listening ? '🎙️ Listening...' : '🎤 Speak Answer'}
      </button>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={submitAnswer}
          disabled={!answer.trim() || loading || !question}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Answer
        </button>
        <button
          onClick={tryAgain}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
        <button
          onClick={nextQuestion}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Next Question
        </button>
        <button
          onClick={previousQuestion}
          disabled={loading || historyIndex <= 0}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Previous Question
        </button>
      </div>

      {feedback && (
        <div className="mt-4 p-3 bg-gray-100 rounded whitespace-pre-wrap">{feedback}</div>
      )}
    </div>
  );
};

export default QuestionBox;
