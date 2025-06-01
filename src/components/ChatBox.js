import React, { useState } from 'react';
import API from '../api';
import FeedbackCard from './FeedbackCard';

const ChatBox = ({ selectedRole }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await API.post('/ask', {
        role: selectedRole,
        answer,
      });
      setFeedback(res.data.feedback);
    } catch (error) {
      console.error("API error:", error);
      setFeedback("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <textarea
        rows="5"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Type your answer here..."
      />
      <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white p-2 rounded">
        Submit Answer
      </button>
      {feedback && <FeedbackCard feedback={feedback} />}
    </div>
  );
};

export default ChatBox;
