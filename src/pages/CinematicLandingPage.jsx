import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ChevronRight, CheckCircle2, MessageCircle, Moon, Sun, 
  Monitor, Star, ShieldCheck, Phone, Code, Video, Bot, Award, Sparkles, Check
} from 'lucide-react';

// --- 1. Global Navigation Bar ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo & Search */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center">
              <span className="font-bold text-slate-950 text-sm">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SkillNux</span>
          </div>
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors cursor-text group w-64">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="text-sm text-slate-500 ml-3">Search skills...</span>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">Trending <span className="text-orange-500">🔥</span></a>
          <a href="#" className="hover:text-white transition-colors">Digital Marketing</a>
          <a href="#" className="hover:text-white transition-colors">Design & Creative</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</a>
          <button className="text-sm font-medium text-emerald-400 border border-emerald-400/50 hover:bg-emerald-400/10 px-5 py-2 rounded-full transition-all">
            Join Now
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- 2. Cinematic Hero Section ---
const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Our student experts <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">will take it from here</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          SkillNux connects India's top college specialists with businesses needing reliable, on-demand project deliveries.
        </p>

        {/* Big Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center max-w-2xl mx-auto shadow-2xl shadow-black/50"
        >
          <div className="pl-6 flex-1 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-lg"
            />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
            Search <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Popular Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3 items-center text-sm"
        >
          <span className="text-slate-500 font-medium mr-2">Popular:</span>
          {['Website Development', 'UI/UX Design', 'Video Editing'].map((tag) => (
            <span key={tag} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Trusted By */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-white/5"
        >
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-6">Trusted by innovators at</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            <span className="text-2xl font-black tracking-tighter">META</span>
            <span className="text-2xl font-bold font-serif">Google</span>
            <span className="text-2xl font-black text-red-500 uppercase tracking-widest">Netflix</span>
            <span className="text-2xl font-bold font-serif">P&G</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- 3. Value Proposition Row ---
const ValueProps = () => {
  const props = [
    { icon: <Sparkles />, title: 'Over 42+ Skills', desc: 'From coding to creative design, find the exact skill you need.' },
    { icon: <Award />, title: 'Verified Scores', desc: 'Every student passes rigorous vetting and live tests.' },
    { icon: <ShieldCheck />, title: 'UPI Escrow Shield', desc: 'Your money is safe until you approve the final delivery.' },
    { icon: <MessageCircle />, title: 'WhatsApp Sync', desc: 'Direct, instant communication with your hired expert.' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {props.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col gap-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
              {React.cloneElement(p.icon, { className: 'w-6 h-6' })}
            </div>
            <h3 className="text-lg font-bold text-white">{p.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- 4. Popular Services Grid ---
const PopularServices = () => {
  const services = [
    { title: 'Vibe Coding', color: 'bg-emerald-500', icon: <Code />, snippet: 'const vibe = true;\nif(vibe) render();' },
    { title: 'Video Editing', color: 'bg-orange-500', icon: <Video />, snippet: '[Timeline Active]\nRendering 4K...' },
    { title: 'Software Dev', color: 'bg-blue-500', icon: <Monitor />, snippet: 'API Connected\nLatency: 12ms' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Popular services</h2>
        <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
          View all <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="group relative h-[380px] rounded-3xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col justify-between p-8"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${s.color} opacity-80`} />
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-6">
                {React.cloneElement(s.icon, { className: 'w-6 h-6' })}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-400 leading-relaxed group-hover:border-white/20 transition-colors">
              {s.snippet.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- 5. Expert Sourcing Feature ---
const ExpertSourcing = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-[40px] p-12 relative overflow-hidden border border-emerald-900/30 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-8">
              Let experts find the right student for you
            </h2>
            <ul className="space-y-6 mb-12">
              {['Vetted portfolios & past projects', 'Direct matching based on skill scores', 'Verified college identities', 'Zero hassle hiring process'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-emerald-50 text-lg">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
              Discover expert sourcing <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="relative h-[500px] w-full hidden md:block" style={{ perspective: '1000px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateZ: -5 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: -5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute top-10 left-10 z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl w-72 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">A</div>
              <div>
                <h4 className="text-white font-bold">Aarav Sharma</h4>
                <p className="text-xs text-slate-300">Frontend Developer</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium"><Star className="w-3 h-3 fill-current"/> 5.0</div>
              <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Score: 9.8 • Verified</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50, rotateZ: 5 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: 5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute top-40 right-4 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl w-72 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">N</div>
              <div>
                <h4 className="text-white font-bold">Neha Gupta</h4>
                <p className="text-xs text-slate-300">UI/UX Designer</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium"><Star className="w-3 h-3 fill-current"/> 4.9</div>
              <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Score: 9.6 • Verified</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute -bottom-4 left-1/4 z-30 bg-emerald-500 text-slate-950 p-4 rounded-2xl w-64 shadow-2xl shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-slate-950" /></div>
              <div>
                <h4 className="font-bold text-sm">Match Found!</h4>
                <p className="text-xs opacity-80 font-medium">Top 1% candidate selected</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- 6. AI Integration Section ---
const AIIntegration = () => {
  const pills = [
    { name: 'Billy Boman', role: 'AI Art', gradient: 'from-purple-600 to-fuchsia-600' },
    { name: 'Sarah Chen', role: 'Prompt Eng', gradient: 'from-emerald-600 to-teal-600' },
    { name: 'Raj Patel', role: 'AI Video', gradient: 'from-violet-600 to-indigo-600' },
    { name: 'Elena R.', role: 'Automation', gradient: 'from-rose-600 to-red-600' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
            <Bot className="w-4 h-4" /> AI Specializations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
            The AI Director era <br />has arrived
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-md">
            Hire pre-vetted AI specialists who can leverage the latest LLMs, image generators, and workflow automations to 10x your productivity.
          </p>
          <button className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors">
            Find your AI Specialist
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px]">
          {pills.map((pill, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-full bg-gradient-to-b ${pill.gradient} p-1 overflow-hidden group hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-2">
                <p className="text-white font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">{pill.name}</p>
                <p className="text-white/70 text-xs mt-1 font-medium">{pill.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 7. The College Leaderboard ---
const Leaderboard = () => {
  const students = [
    { rank: 1, medal: '🥇', name: 'Kabir Singh', role: 'Full Stack', score: '9.9' },
    { rank: 2, medal: '🥈', name: 'Priya M.', role: 'UI/UX Design', score: '9.7' },
    { rank: 3, medal: '🥉', name: 'Rahul V.', role: 'Video Editor', score: '9.5' },
    { rank: 4, medal: '', name: 'Ananya D.', role: 'Content Writer', score: '9.4' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 relative">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-amber-400" /> College Leaderboard
            </h3>
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
          </div>
          
          <div className="space-y-4">
            {students.map((st, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center text-xl">{st.medal || <span className="text-slate-500 font-bold text-base">#{st.rank}</span>}</div>
                  <div>
                    <h4 className="text-white font-bold">{st.name}</h4>
                    <p className="text-slate-400 text-xs">{st.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">{st.score}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">Score</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
            Be the First to Top Your <br />College Leaderboard
          </h2>
          <ul className="space-y-4 mb-10">
            {['Get exclusive invites to premium projects', 'Earn verified badges for your resume', 'Compete with peers across India'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
              </li>
            ))}
          </ul>
          <button className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-colors">
            Join the Leaderboard
          </button>
        </div>
      </div>
    </section>
  );
};

// --- 8. How it Works ---
const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Business Posts project', desc: 'Detail your requirements in minutes.' },
    { num: '02', title: 'Automated Matchmaker', desc: 'Our AI finds the perfect student match instantly.' },
    { num: '03', title: 'Milestones & Escrow', desc: 'Secure payments tied to project milestones.' },
    { num: '04', title: 'Review & Rise', desc: 'Approve work and boost the student\'s rank.' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 mb-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Simple. Fast. Effective.</h2>
        <p className="text-slate-400">How SkillNux connects businesses and students effortlessly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-slate-100 rounded-3xl p-8 overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500" />
            
            <div className="absolute -bottom-4 -right-2 text-[120px] font-black text-slate-200/60 leading-none select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
              {step.num}
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-3 pr-8">{step.title}</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- 9. Floating Actions ---
const FloatingActions = () => {
  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-slate-700 transition-colors shadow-lg">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-transform hover:scale-105 shadow-xl shadow-emerald-500/20">
          <Phone className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-lg border border-white/10 p-1.5 rounded-full shadow-lg">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Sun className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shadow-sm">
            <Moon className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

// --- Main Page Assembly ---
export default function CinematicLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <PopularServices />
        <ExpertSourcing />
        <AIIntegration />
        <Leaderboard />
        <HowItWorks />
      </main>
      <FloatingActions />
    </div>
  );
}
