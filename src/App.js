import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import QuestionBox from './components/QuestionBox';
import FeedbackCard from './components/FeedbackCard';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [selectedRole, setSelectedRole] = useState('DSA');
  const [feedback, setFeedback] = useState('');
  const [sessionId] = useState(uuidv4());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-title">
          <img src="images/logo.png" alt="Logo" className="logo" />
          <h1>AI Interview Coach</h1>
        </div>
      </header>

      <main>
        <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

        

        <QuestionBox
          selectedRole={selectedRole}
          sessionId={sessionId}
          onFeedback={setFeedback}
          feedback={feedback}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          difficulty={sliderValue}
        />

        {feedback && <FeedbackCard feedback={feedback} />}
      </main>

      <footer className="app-footer">
        <p>© 2025 AI Interview Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
