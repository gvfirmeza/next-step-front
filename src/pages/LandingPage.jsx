import React, { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ajustar o canvas para o tamanho da tela
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Classe para as partículas
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Reposicionar partículas que saem da tela
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `#ed4575`;
        ctx.fill();

        // Borda branca
        ctx.strokeStyle = `#ed4575`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Criar partículas
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 10; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    // Desenhar linhas conectando partículas próximas
    const drawConnections = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.4;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `rgb(237, 69, 117, 0.3)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    // Loop de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar partículas
      for (let particle of particlesRef.current) {
        particle.update();
        particle.draw();
      }

      // Desenhar conexões
      drawConnections();

      animationRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Inicializar
    createParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
};

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/form');
    };

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
                    onClick={handleNavigation}
                >
                    Comece Já
                </button>
            </header>

            {/* Section com gradiente só na altura inicial */}
            <section className="relative flex flex-col items-center py-42 px-6 before:absolute before:inset-0 before:top-0 before:left-0 before:-z-10 before:block before:h-full before:bg-[radial-gradient(circle_at_-15%_-10%,_hsla(343,_98%,_60%,_0.2)_0px,_transparent_40%)] after:absolute after:inset-0 after:top-0 after:right-0 after:-z-10 after:mt-auto after:mb-0 after:block after:h-full after:bg-[radial-gradient(circle_at_120%_125%,_hsla(248,_99%,_70%,_0.2)_0px,_transparent_40%)]">
                <div className="relative container mx-auto max-w-5xl">
                    <main className="flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="md:w-1/2">
                            <div>
                                <h1 className="text-5xl font-bold mb-2">NextStep:</h1>
                                <h2 className="text-5xl font-bold mb-2">
                                    Mentor de Carreira
                                </h2>
                                <h2 className="text-5xl font-bold mb-2">
                                    <TypeAnimation
                                        sequence={[
                                            'Generativo',
                                            2000,
                                            'Inteligente',
                                            2000,
                                            'Personalizado',
                                            2000,
                                        ]}
                                        wrapper="span"
                                        speed={40}
                                        repeat={Infinity}
                                    />
                                </h2>
                            </div>
                            <p className="text-[#9facaf] font-semibold text-lg mt-6 mb-8 max-w-sm">
                                Planeje sua trajetória profissional com IA que analisa seu perfil,
                                tendências de mercado e propõe reflexões sobre sua carreira.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-[#ED4575] px-5 py-2 rounded-md font-medium transition-colors hover:bg-[#d13965]" onClick={handleNavigation}>
                                    Comece Já
                                </button>
                                <a className="border border-gray-700 hover:border-gray-600 hover:bg-gray-800 px-5 py-2 rounded-md font-medium transition-colors" href='#info'>
                                    Saiba Mais
                                </a>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img src="/assets/illustration.png" alt="Chat Illustration" className='-mr-12 -mb-4' />
                        </div>
                    </main>
                </div>
            </section>

            {/* Brain AI Transition */}
            <img src="/assets/brain-waves-new.svg" alt="AI Brain Transition" className="w-full absolute left-0 z-10" style={{ height: '180px', marginTop: '-90px' }} />

            {/* Features Section */}
            <section className="relative py-20 px-6 bg-[#19191c] min-h-[100vh] flex items-center justify-center overflow-hidden" id='info'>
                {/* Efeito de partículas */}
                <ParticlesBackground />

                {/* Efeito de estrelas animadas */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute inset-0 bg-repeat animate-pulse"
                        style={{
                            backgroundImage: `radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                                            radial-gradient(2px 2px at 40px 20px, #fff, transparent),
                                            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                                            radial-gradient(1px 1px at 130px 80px, #fff, transparent),
                                            radial-gradient(2px 2px at 160px 30px, #fff, transparent)`,
                            backgroundSize: '200px 100px',
                            animation: 'twinkle 4s ease-in-out infinite alternate'
                        }}
                    />
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center mb-16 flex flex-col justify-center items-center">
                        <h2 className="text-6xl font-bold mb-12 max-w-3xl leading-20">Como o NextStep transforma sua trajetória</h2>
                        <p className="text-[#9facaf] text-xl max-w-2xl mx-auto">
                            Nossa plataforma combina inteligência artificial com dados de mercado para oferecer
                            uma orientação personalizada e reflexiva sobre sua carreira.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                        {/* Card 1 */}
                        <motion.div
                            className="bg-[#212124] border border-[#303033] rounded-lg p-6 w-full max-w-sm"
                            whileHover={{ scale: 1.05, borderColor: '#ED4575' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-center mb-4">
                                <motion.img
                                    src="\assets\data-analysis.png"
                                    alt="Análise de Perfil"
                                    className="h-12 w-12"
                                    whileHover={{ rotate: 10 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">Análise de Perfil</h3>
                            <p className="text-[#9facaf] text-center">
                                Entenda seus interesses, valores e habilidades para decisões de carreira mais conscientes.
                            </p>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            className="bg-[#212124] border border-[#303033] rounded-lg p-6 w-full max-w-sm"
                            whileHover={{ scale: 1.05, borderColor: '#ED4575' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-center mb-4">
                                <motion.img
                                    src="/assets/trend.png"
                                    alt="Tendências de Mercado"
                                    className="h-12 w-12"
                                    whileHover={{ rotate: 10 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">Tendências de Mercado</h3>
                            <p className="text-[#9facaf] text-center">
                                Receba insights atualizados sobre as áreas em crescimento relacionadas ao seu curso.
                            </p>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            className="bg-[#212124] border border-[#303033] rounded-lg p-6 w-full max-w-sm"
                            whileHover={{ scale: 1.05, borderColor: '#ED4575' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-center mb-4">
                                <motion.img
                                    src="/assets/otherside.png"
                                    alt="Reflexões Guiadas"
                                    className="h-12 w-12"
                                    whileHover={{ rotate: 10 }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">Reflexões Guiadas</h3>
                            <p className="text-[#9facaf] text-center">
                                Explore questões que ajudam a aprofundar seu autoconhecimento profissional.
                            </p>
                        </motion.div>
                    </div>

                    {/* Instrução interativa */}
                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                    </motion.div>
                </div>

                <style jsx>{`
                    @keyframes twinkle {
                        0% { opacity: 0.3; }
                        50% { opacity: 0.8; }
                        100% { opacity: 0.3; }
                    }
                `}</style>
            </section>

            {/* Wave Transition */}
            <div className="w-full overflow-hidden relative">
                <img src="/assets/wave-white.svg" alt="Wave Transition" className="w-full" />
            </div>

            {/* Process Section */}
            <section className="relative py-20 px-6 bg-[#f5f5f7] text-[#19191c] min-h-[90vh] flex items-center justify-center">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        className="text-center mb-16 flex flex-col justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold mb-6">Processo Simples em 3 Passos</h2>
                        <p className="text-[#4a4a4c] text-xl max-w-2xl mx-auto">
                            Descubra seu caminho profissional ideal em apenas alguns minutos.
                        </p>
                    </motion.div>

                    <div className="relative mt-20">
                        {/* Progress Line */}
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#ED4575] w-4/5 md:w-3/4 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                            {/* Step 1 */}
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#ED4575] mb-6">
                                    <span className="text-[#ED4575] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-center mb-3">Preencha o Questionário</h3>
                                <p className="text-[#4a4a4c] text-center">
                                    Compartilhe informações sobre seus interesses, habilidades e valores profissionais.
                                </p>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#ED4575] mb-6">
                                    <span className="text-[#ED4575] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-center mb-3">Receba Recomendações</h3>
                                <p className="text-[#4a4a4c] text-center">
                                    Nossa IA analisa seu perfil e sugere caminhos profissionais alinhados com suas preferências.
                                </p>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#ED4575] mb-6">
                                    <span className="text-[#ED4575] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-center mb-3">Explore Possibilidades</h3>
                                <p className="text-[#4a4a4c] text-center">
                                    Conheça detalhes sobre cada opção de carreira, cursos recomendados e próximos passos.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        className="mt-20 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <button className="bg-[#ED4575] text-white px-8 py-3 rounded-md font-medium transition-colors hover:bg-[#d13965] text-lg" onClick={handleNavigation}>
                            Comece Agora
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
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
                                <li className="text-[#9facaf] hover:text-white transition-colors">São Paulo, Brasil</li>
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
        </>
    );
};

export default LandingPage;