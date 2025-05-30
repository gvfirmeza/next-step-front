import React from "react";
import {
  Heart,
  ArrowRight,
  AlertTriangle,
  Quote,
  CheckCircle,
  Circle,
  GraduationCap,
  Laptop,
  BookOpen,
  Star,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const CareerHeader = ({ title, introduction }) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      <div className="bg-[#ED4575] p-3 rounded-full mr-4">
        <GraduationCap size={24} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </div>
    <p className="text-lg text-gray-300 leading-relaxed">{introduction}</p>
  </div>
);

const RoadmapCard = ({ roadmap }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
    <h2 className="text-2xl font-bold text-white mb-6">Roadmap da Carreira</h2>
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#ED4575]/30 z-0" />
      <div className="space-y-8">
        {roadmap.map((item, index) => (
          <div key={index} className="relative z-10">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                {item.completed ? (
                  <CheckCircle size={24} className="text-[#ED4575]" />
                ) : (
                  <Circle size={24} className="text-[#ED4575]/60" />
                )}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-[#ED4575]/20 text-[#E4E4E7] rounded">
                    {item.timeframe}
                  </span>
                </div>
                <p className="mt-1 text-gray-300">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NextStepsCard = ({ nextSteps }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
    <h2 className="text-2xl font-bold text-white mb-4">Próximos Passos</h2>
    <ul className="space-y-3">
      {nextSteps.map((step, index) => (
        <li key={index} className="flex">
          <ArrowRight
            className="flex-shrink-0 mr-2 text-[#ED4575] mt-1"
            size={18}
          />
          <span className="text-gray-300">{step}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SoftSkillsCard = ({ softSkills }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
    <h2 className="text-2xl font-bold text-white mb-4">
      Soft Skills Necessárias
    </h2>
    <div className="flex flex-wrap gap-2">
      {softSkills.map((skill, index) => (
        <div
          key={index}
          className="flex items-center px-3 py-2 bg-[#ED4575]/20 text-[#E4E4E7] rounded-full"
        >
          <Heart size={16} className="mr-1" />
          <span>{skill}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChallengesCard = ({ challenges }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
    <h2 className="text-2xl font-bold text-white mb-4">Potenciais Desafios</h2>
    <div className="space-y-3">
      {challenges.map((challenge, index) => (
        <div key={index} className="flex">
          <AlertTriangle
            size={18}
            className="flex-shrink-0 text-[#ED4575] mr-2 mt-1"
          />
          <p className="text-gray-300">{challenge}</p>
        </div>
      ))}
    </div>
  </div>
);

const QuoteCard = ({ quote }) => (
  <div className="bg-[#ED4575] rounded-lg p-8 mb-8 text-white relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex mb-4">
        <Quote size={36} className="text-white/80" />
      </div>
      <p className="text-xl italic font-light mb-4">{quote.text}</p>
      <p className="text-right font-medium">— {quote.author}</p>
    </div>
    <div className="gradient-bg" />
  </div>
);

const CareerLayout = ({ mockCareerData }) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="relative z-10 flex justify-between items-center py-4 px-16 bg-[#19191c] border-b border-[#303033] text-white font-sans">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md flex items-center justify-center mr-2">
            <img src="/assets/logo.png" alt="Logo" className="w-9 -mr-3" />
          </div>
          <span className="font-semibold text-xl">NextStep</span>
        </div>
        <button
          className="bg-[#ED4575] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-[#d13965]"
          onClick={() => navigate('/')}
        >
          Voltar
        </button>
      </header>

      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <CareerHeader
              title={mockCareerData.title}
              introduction={mockCareerData.introduction}
            />
            <RoadmapCard roadmap={mockCareerData.roadmap} />
            <div className="grid md:grid-cols-2 gap-6">
              <NextStepsCard nextSteps={mockCareerData.nextSteps} />
              <SoftSkillsCard softSkills={mockCareerData.softSkills} />
            </div>
            <ChallengesCard challenges={mockCareerData.potentialChallenges} />
            <QuoteCard quote={mockCareerData.inspirationalQuote} />
          </div>
        </main>

        <footer className="bg-[#19191c] text-white py-12 px-6 border-t border-[#303033]">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo e Descrição */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-md flex items-center justify-center mr-2">
                                    <img src="/assets/logo.png" alt="Logo" className="w-7" />
                                </div>
                                <span className="font-semibold text-lg">NextStep</span>
                            </div>
                            <p className="text-[#9facaf] text-sm">
                                Transformando carreiras com inteligência artificial e orientação personalizada.
                            </p>
                        </div>

                        {/* Links Rápidos */}
                        <div className="col-span-1">
                            <h4 className="font-semibold mb-4 text-lg">Links Rápidos</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-[#9facaf] hover:text-white transition-colors">Início</a></li>
                                <li><a href="#" className="text-[#9facaf] hover:text-white transition-colors">Sobre Nós</a></li>
                                <li><a href="#" className="text-[#9facaf] hover:text-white transition-colors">Recursos</a></li>
                                <li><a href="#" className="text-[#9facaf] hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        {/* Contato */}
                        <div className="col-span-1">
                            <h4 className="font-semibold mb-4 text-lg">Contato</h4>
                            <ul className="space-y-2">
                                <li className="text-[#9facaf] hover:text-white transition-colors">contato@nextstep.com</li>
                                <li className="text-[#9facaf] hover:text-white transition-colors">(11) 9999-9999</li>
                                <li className="text-[#9facaf] hover:text-white transition-colors">Rio de Janeiro, Brasil</li>
                            </ul>
                        </div>

                        {/* Redes Sociais */}
                        <div className="col-span-1">
                            <h4 className="font-semibold mb-4 text-lg">Siga-nos</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-[#9facaf] hover:text-white transition-colors">
                                    <svg width="24" height="24" className="fill-current">
                                        <use xlinkHref="/assets/social-icons.svg#facebook"></use>
                                    </svg>
                                </a>
                                <a href="#" className="text-[#9facaf] hover:text-white transition-colors">
                                    <svg width="24" height="24" className="fill-current">
                                        <use xlinkHref="/assets/social-icons.svg#twitter"></use>
                                    </svg>
                                </a>
                                <a href="#" className="text-[#9facaf] hover:text-white transition-colors">
                                    <svg width="24" height="24" className="fill-current">
                                        <use xlinkHref="/assets/social-icons.svg#instagram"></use>
                                    </svg>
                                </a>
                                <a href="#" className="text-[#9facaf] hover:text-white transition-colors">
                                    <svg width="24" height="24" className="fill-current">
                                        <use xlinkHref="/assets/social-icons.svg#linkedin"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#303033] text-center text-[#9facaf] text-sm">
                        <p>© {new Date().getFullYear()} NextStep. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
      </div>
    </>
  );
};

export default CareerLayout;
