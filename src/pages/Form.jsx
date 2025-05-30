import React, { useEffect, useRef, useState } from 'react';

// Message Component
const Message = ({ text, isUser, options, animationDelay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const userMessageClasses = "ml-auto bg-pink-500 text-white";
  const systemMessageClasses = "mr-auto bg-gray-700 text-white";

  return (
    <>
      <header className="relative z-10 flex justify-between items-center py-4 px-16 bg-[#19191c] border-b border-[#303033] text-white font-sans">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md flex items-center justify-center mr-2">
            <img src="src/assets/logo.png" alt="Logo" className="w-9 -mr-3" />
          </div>
          <span className="font-semibold text-xl">NextStep</span>
        </div>
        <button
          className="bg-[#ED4575] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          onClick={() => navigate('/')}
        >
          Voltar
        </button>
      </header>

      <div
        className={`
        transition-all duration-300 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isUser ? 'flex justify-end' : 'flex justify-start'}
        mb-4
      `}
      >
        <div
          className={`
          rounded-xl px-4 py-3 max-w-xs shadow-md
          ${isUser ? userMessageClasses : systemMessageClasses}
        `}
        >
          <p>{text}</p>
          {options && !isUser && (
            <div className="text-sm opacity-70 mt-2">
              <p>Options: {options.map(opt => opt.label).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Question Input Component
const QuestionInput = ({ type, options = [], onSubmit, isActive }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  if (!isActive) return null;

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    }
  };

  const handleSelectSubmit = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value) {
      onSubmit(value);
      setSelectValue('');
    }
  };

  if (type === 'text') {
    return (
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow bg-gray-800 text-white rounded-md px-4 py-2 outline-none border border-gray-600 focus:border-pink-500"
          placeholder="Type your answer..."
          autoFocus
        />
        <button
          onClick={handleTextSubmit}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors duration-200"
        >
          Send
        </button>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="mt-4">
        <select
          value={selectValue}
          onChange={handleSelectSubmit}
          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 outline-none border border-gray-600 focus:border-pink-500 cursor-pointer"
        >
          <option value="" disabled>
            Select an option...
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

// Main Chat Form Component
const ChatForm = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [messages, setMessages] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const messagesEndRef = useRef(null);

  // Display the first question when the component mounts
  useEffect(() => {
    if (questions.length > 0) {
      const firstQuestion = questions[0];
      setMessages([
        {
          id: `question-${firstQuestion.id}`,
          text: firstQuestion.text,
          isUser: false,
          questionType: firstQuestion.type,
          options: firstQuestion.options,
        },
      ]);
    }
  }, [questions]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (response) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Add user response message
    const responseText = currentQuestion.type === 'select' && currentQuestion.options
      ? currentQuestion.options.find(opt => opt.value === response)?.label || response
      : response;

    const userMessage = {
      id: `response-${currentQuestion.id}`,
      text: responseText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);

    // Update responses state
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: response,
    };
    setResponses(updatedResponses);

    // Check if there's a next question
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];

      // Add a slight delay before showing the next question
      setTimeout(() => {
        const questionMessage = {
          id: `question-${nextQuestion.id}`,
          text: nextQuestion.text,
          isUser: false,
          questionType: nextQuestion.type,
          options: nextQuestion.options,
        };

        setMessages(prev => [...prev, questionMessage]);
        setCurrentQuestionIndex(nextIndex);
      }, 500);
    } else {
      // Form is complete
      setIsComplete(true);
      if (onComplete) {
        onComplete(updatedResponses);
      }
    }
  };

  const resetForm = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setIsComplete(false);
    setMessages([
      {
        id: `question-${questions[0].id}`,
        text: questions[0].text,
        isUser: false,
        questionType: questions[0].type,
        options: questions[0].options,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-medium">Chat Form</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              text={message.text}
              isUser={message.isUser}
              options={message.options}
              animationDelay={200 * index}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        {!isComplete && currentQuestionIndex < questions.length && (
          <QuestionInput
            type={questions[currentQuestionIndex]?.type || 'text'}
            options={questions[currentQuestionIndex]?.options}
            onSubmit={handleSubmit}
            isActive={!isComplete}
          />
        )}
        {isComplete && (
          <div className="text-center p-4">
            <p className="text-green-400 mb-2">Thank you for your responses!</p>
            <button
              onClick={resetForm}
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Demo App Component
export default function App() {
  const questions = [
    {
      id: 'name',
      text: 'What is your name?',
      type: 'text',
    },
    {
      id: 'role',
      text: 'What is your role?',
      type: 'select',
      options: [
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'manager', label: 'Manager' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'experience',
      text: 'How many years of experience do you have?',
      type: 'select',
      options: [
        { value: '0-1', label: '0-1 years' },
        { value: '2-5', label: '2-5 years' },
        { value: '6-10', label: '6-10 years' },
        { value: '10+', label: '10+ years' },
      ],
    },
    {
      id: 'feedback',
      text: 'Any additional feedback?',
      type: 'text',
    },
  ];

  const handleFormComplete = (responses) => {
    console.log('Form completed with responses:', responses);
    alert(`Form completed! Check console for details.`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-96 bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <ChatForm
          questions={questions}
          onComplete={handleFormComplete}
        />
      </div>
    </div>
  );
}