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

  // Cores atualizadas das mensagens do chat
  const userMessageClasses = "ml-auto bg-gradient-to-r from-[#ED4575] to-[#d13965] text-white";
  const systemMessageClasses = "mr-auto bg-gradient-to-r from-gray-700 to-gray-800 text-white";

  return (
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
          rounded-xl px-4 py-3 max-w-xs md:max-w-sm shadow-lg
          ${isUser ? userMessageClasses : systemMessageClasses}
        `}
      >
        <p className="text-sm md:text-base">{text}</p>
        {options && !isUser && (
          <div className="text-xs opacity-70 mt-2">
            <p>Options: {options.map(opt => opt.label).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Question Input Component
const QuestionInput = ({ type, options = [], onSubmit, isActive, placeholder }) => {
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
          className="flex-grow bg-gray-800 text-white rounded-md px-4 py-2 outline-none border border-gray-600 focus:border-[#ED4575] transition-all duration-200"
          placeholder={placeholder || "Digite sua resposta..."}
          autoFocus
        />
        <button
          onClick={handleTextSubmit}
          className="bg-gradient-to-r from-[#ED4575] to-[#d13965] text-white px-4 py-2 rounded-md hover:from-[#d13965] hover:to-[#c02e58] transition-all duration-200 shadow-md"
        >
          Enviar
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
          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 outline-none border border-gray-600 focus:border-[#ED4575] cursor-pointer transition-all duration-200"
        >
          <option value="" disabled>
            Selecione uma opção...
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
const ChatForm = ({ questions, onComplete, isFormLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [messages, setMessages] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [chatHeight, setChatHeight] = useState(300);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

  // Scroll to the bottom when messages change and adjust height
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Aumentar a altura do chat conforme as mensagens são adicionadas
    if (messages.length > 3 && chatContainerRef.current) {
      const newHeight = Math.min(600, 400 + (messages.length - 3) * 50);
      setChatHeight(newHeight);
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
    setChatHeight(400); // Reset chat height
    if (questions.length > 0) {
      setMessages([
        {
          id: `question-${questions[0].id}`,
          text: questions[0].text,
          isUser: false,
          questionType: questions[0].type,
          options: questions[0].options,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1e1e24] to-[#262626] text-white rounded-lg overflow-hidden shadow-2xl border border-gray-700">
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto custom-scrollbar"
        style={{ height: `${chatHeight}px`, transition: 'height 0.3s ease-in-out' }}
      >
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

      <div className="p-4 border-t border-gray-700 bg-[#1a1a1f]">
        {!isComplete && currentQuestionIndex < questions.length && (
          <QuestionInput
            type={questions[currentQuestionIndex]?.type || 'text'}
            options={questions[currentQuestionIndex]?.options}
            placeholder={questions[currentQuestionIndex]?.placeholder}
            onSubmit={handleSubmit}
            isActive={!isComplete && !isFormLoading}
          />
        )}
        {isComplete && (
          <div className="text-center p-4">
            {isFormLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED4575] mb-3"></div>
                <p className="text-gray-300 mb-2">Analisando suas respostas...</p>
                <p className="text-sm text-gray-400">Criando sua análise personalizada</p>
              </div>
            ) : (
              <>
                <p className="text-green-400 mb-2">Obrigado pelas suas respostas!</p>
                <button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-[#ED4575] to-[#d13965] text-white px-6 py-2 rounded-md hover:from-[#d13965] hover:to-[#c02e58] transition-all duration-200 shadow-md"
                >
                  Recomeçar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Demo App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 'genero',
      text: 'Qual é o seu gênero?',
      type: 'select',
      options: [
        { value: 'masculino', label: 'Masculino' },
        { value: 'feminino', label: 'Feminino' },
        { value: 'outro', label: 'Outro' },
        { value: 'prefiro_nao_informar', label: 'Prefiro não informar' },
      ],
    },
    {
      id: 'idade',
      text: 'Qual é a sua idade?',
      type: 'select',
      options: [
        { value: 18, label: '18 anos' },
        { value: 19, label: '19 anos' },
        { value: 20, label: '20 anos' },
        { value: 21, label: '21 anos' },
        { value: 22, label: '22 anos' },
        { value: 23, label: '23 anos' },
        { value: 24, label: '24 anos' },
        { value: 25, label: '25 anos' },
        { value: 26, label: '26 anos' },
        { value: 27, label: '27 anos' },
        { value: 28, label: '28 anos' },
        { value: 29, label: '29 anos' },
        { value: 30, label: '30+ anos' },
      ],
    },
    {
      id: 'area_graduacao',
      text: 'Qual é a sua área de graduação?',
      type: 'select',
      options: [
        { value: 'Ciência da Computação', label: 'Ciência da Computação' },
        { value: 'Engenharia de Software', label: 'Engenharia de Software' },
        { value: 'Sistemas de Informação', label: 'Sistemas de Informação' },
        { value: 'Análise e Desenvolvimento de Sistemas', label: 'Análise e Desenvolvimento de Sistemas' },
        { value: 'Design', label: 'Design' },
        { value: 'Design Gráfico', label: 'Design Gráfico' },
        { value: 'Publicidade e Propaganda', label: 'Publicidade e Propaganda' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Administração', label: 'Administração' },
        { value: 'Engenharia', label: 'Engenharia' },
        { value: 'Outro', label: 'Outro' },
      ],
    },
    {
      id: 'ano_conclusao',
      text: 'Qual é o ano previsto para conclusão da graduação?',
      type: 'select',
      options: [
        { value: 2024, label: '2024' },
        { value: 2025, label: '2025' },
        { value: 2026, label: '2026' },
        { value: 2027, label: '2027' },
        { value: 2028, label: '2028' },
        { value: 2029, label: '2029' },
      ],
    },
    {
      id: 'interesses',
      text: 'Quais são suas principais áreas de interesse? (Use vírgulas para separar)',
      type: 'text',
      placeholder: 'Ex: Desenvolvimento Web, UX Design, Inteligência Artificial'
    },
    {
      id: 'preferencia_ambiente',
      text: 'Qual tipo de ambiente de trabalho você prefere?',
      type: 'select',
      options: [
        { value: 'presencial e colaborativo', label: 'Presencial e colaborativo' },
        { value: 'remoto e independente', label: 'Remoto e independente' },
        { value: 'remoto e colaborativo', label: 'Remoto e colaborativo' },
        { value: 'híbrido e flexível', label: 'Híbrido e flexível' },
        { value: 'presencial e individual', label: 'Presencial e individual' },
      ],
    },
    {
      id: 'hard_skills',
      text: 'Quais são suas principais hard skills? (Use vírgulas para separar)',
      type: 'text',
      placeholder: 'Ex: HTML, CSS, JavaScript, React, Python'
    },
    {
      id: 'soft_skills',
      text: 'Quais são suas principais soft skills? (Use vírgulas para separar)',
      type: 'text',
      placeholder: 'Ex: comunicação, empatia, organização, liderança'
    },
  ];

  const handleFormComplete = async (responses) => {
    console.log('Formulário completo com respostas:', responses);
    
    setIsLoading(true);
    
    // Montar os dados baseados nas respostas do formulário
    const formData = {
      genero: responses.genero || "feminino",
      idade: parseInt(responses.idade) || 23,
      area_graduacao: responses.area_graduacao || "Ciência da Computação",
      ano_conclusao: parseInt(responses.ano_conclusao) || 2025,
      interesses: responses.interesses || "Desenvolvimento Web, UX Design, Inteligência Artificial",
      preferencia_ambiente: responses.preferencia_ambiente || "remoto e colaborativo",
      hard_skills: responses.hard_skills || "HTML, CSS, JavaScript, React",
      soft_skills: responses.soft_skills || "comunicação, empatia, organização"
    };

    console.log('Dados a serem enviados:', formData);

    try {
      const response = await fetch('https://next-step-backend-six.vercel.app/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta da API:', result);
      
      if (result.success && result.data) {
        // Armazenar dados no sessionStorage para acessar na próxima página
        sessionStorage.setItem('careerAnalysis', JSON.stringify(result.data));
        
        // Aguardar um pouco para garantir que o loading seja visível
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirecionar para /tep
        window.location.href = '/tep';
      } else {
        throw new Error('Resposta da API não contém dados válidos');
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      
      // Verificar se os dados foram salvos (caso o erro seja só do redirecionamento)
      const storedData = sessionStorage.getItem('careerAnalysis');
      if (storedData) {
        console.log('Dados foram salvos, redirecionando...');
        window.location.href = '/tep';
      } else {
        alert('Erro ao processar sua solicitação. Tente novamente.');
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <header className="fixed w-full z-10 flex justify-between items-center py-4 px-6 md:px-16 bg-[#19191c] border-b border-[#303033] text-white font-sans shadow-md">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md flex items-center justify-center mr-2">
            <img src="/assets/logo.png" alt="Logo" className="w-9 -mr-3" />
          </div>
          <span className="font-semibold text-xl">NextStep</span>
        </div>
        <button
          className="bg-gradient-to-r from-[#ED4575] to-[#ED4575] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:from-[#d13965] hover:to-[#c02e58] shadow-md"
          onClick={() => window.history.back()}
        >
          Voltar
        </button>
      </header>

      <div className="min-h-screen bg-gradient-to-b from-[#121214] to-[#1e1e24] pt-16">
        <div className="p-6 text-center">
          <h2 className="text-4xl font-bold my-2">Vamos conversar sobre sua carreira</h2>
          <p className="text-gray-300 text-md">Me conte um pouco sobre você para que eu possa te ajudar a encontrar seu caminho profissional ideal.</p>
        </div>

        <div className="container mx-auto flex items-center justify-center p-4 pt-8">
          <div className="w-full max-w-2xl bg-transparent rounded-lg overflow-hidden">
            <ChatForm
              questions={questions}
              onComplete={handleFormComplete}
              isFormLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}