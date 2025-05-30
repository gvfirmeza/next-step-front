import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function Form() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const questions = [
    {
      id: 'curso',
      text: 'Qual curso você está fazendo?',
      type: 'text',
      placeholder: 'Ex: Engenharia de Software, Administração...'
    },
    {
      id: 'experiencia',
      text: 'Qual seu nível de experiência profissional?',
      type: 'select',
      options: [
        { value: 'estudante', label: 'Estudante sem experiência' },
        { value: 'estagiario', label: 'Estagiário' },
        { value: 'junior', label: 'Profissional Júnior (0-2 anos)' },
        { value: 'pleno', label: 'Profissional Pleno (2-5 anos)' },
        { value: 'senior', label: 'Profissional Sênior (5+ anos)' }
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    if (inputValue.trim() !== '' || currentQuestion.type === 'select') {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: inputValue
      }));
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setInputValue('');
      }
    }
  };

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.type === 'select') {
      setInputValue(currentQuestion.options[0].value);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, answers]);

  return (
    <div className="min-h-screen bg-[#19191c] flex flex-col">
      <header className="relative z-10 flex justify-between items-center py-4 px-16 bg-[#19191c] border-b border-[#303033] text-white font-sans">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md flex items-center justify-center mr-2">
            <img src="src/assets/logo.png" alt="Logo" className="w-9 -mr-3" />
          </div>
          <span className="font-semibold text-xl">NextStep</span>
        </div>
        <button className="bg-[#ED4575] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors" onClick={() => window.history.back()}>
          Voltar
        </button>
      </header>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 md:p-6">
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold mb-2">Vamos conversar sobre sua carreira</h1>
          <p className="text-[#9facaf] text-lg">
            Me conte um pouco sobre você para que eu possa te ajudar a encontrar seu caminho profissional ideal.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-6">
          {questions.slice(0, currentQuestionIndex + 1).map((question, index) => {
            const hasAnswer = index < currentQuestionIndex;
            return (
              <div key={question.id} className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#ED4575] h-8 w-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white text-sm">NS</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#212124] rounded-2xl rounded-tl-none py-3 px-4 max-w-[80%]"
                  >
                    <p>{question.text}</p>
                  </motion.div>
                </div>

                {hasAnswer && (
                  <div className="flex items-start justify-end">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#ED4575] rounded-2xl rounded-tr-none py-3 px-4 max-w-[80%] text-white"
                    >
                      <p>
                        {question.type === 'select'
                          ? question.options.find((opt) => opt.value === answers[question.id])?.label || answers[question.id]
                          : answers[question.id]}
                      </p>
                    </motion.div>
                    <div className="bg-gray-300 h-8 w-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                      <span className="text-gray-800 text-sm">EU</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {currentQuestionIndex < questions.length && (
          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="relative">
              {questions[currentQuestionIndex].type === 'text' ? (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={questions[currentQuestionIndex].placeholder}
                  className="w-full bg-[#212124] border border-[#303033] rounded-full py-3 px-4 pr-12 text-white focus:outline-none focus:border-[#ED4575]"
                  autoFocus
                />
              ) : (
                <div className="relative">
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-[#212124] border border-[#303033] rounded-full py-3 px-4 pr-12 text-white focus:outline-none focus:border-[#ED4575] appearance-none cursor-pointer"
                    autoFocus
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      textIndent: 1,
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {questions[currentQuestionIndex].options.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[#19191c] text-white hover:bg-[#303033]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <svg className="fill-current h-4 w-4 text-[#ED4575]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className={twMerge(
                  clsx(
                    "absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ED4575] text-white rounded-full w-8 h-8 flex items-center justify-center",
                    {
                      'opacity-50 cursor-not-allowed': inputValue.trim() === '' && questions[currentQuestionIndex].type === 'text',
                      'hover:bg-[#d13d69] transition-colors': inputValue.trim() !== '' || questions[currentQuestionIndex].type === 'select'
                    }
                  )
                )}
                disabled={inputValue.trim() === '' && questions[currentQuestionIndex].type === 'text'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {currentQuestionIndex >= questions.length && (
          <div className="mt-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#212124] p-6 rounded-xl border border-[#303033] shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#ED4575] h-12 w-12 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">✓</span>
                </div>
                <h2 className="text-2xl font-bold">Obrigado pelas informações!</h2>
              </div>
              <p className="text-[#9facaf] mb-6">Agora posso te ajudar melhor em sua jornada profissional.</p>
              <div className="bg-[#19191c] p-5 rounded-lg text-left overflow-auto max-h-60 border border-[#303033]">
                <h3 className="text-lg font-semibold mb-3 text-[#ED4575]">Dados Salvos:</h3>
                {Object.entries(answers).map(([key, value]) => {
                  const question = questions.find((q) => q.id === key);
                  const displayValue = question?.type === 'select'
                    ? question.options.find((opt) => opt.value === value)?.label || value
                    : value;
                  return (
                    <div key={key} className="mb-2 pb-2 border-b border-[#303033] last:border-0">
                      <p className="text-[#9facaf] text-sm">{question?.text || key}:</p>
                      <p className="text-white font-medium">{displayValue}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
