import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import RevealText from '../components/RevealText';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';

// ── Skills Data ────────────────────────────────────────────────────────────
const skillsList = {
  'Digital Marketing': ['SEO & SEM','Social Media Management','Content Writing','Email Marketing','YouTube & Blog','Paid Ads','WhatsApp Marketing','Influencer Outreach','Online Reputation'],
  'Design & Creative': ['Logo & Brand Design','UI/UX Design','Video Editing','Thumbnail Design','Poster & Flyer','Motion Graphics','Reels Editing','Product Photography','Packaging Design','Pitch Deck Design','Canva Design'],
  'Tech & Development': ['Web Development','No-Code Automation','Database Management','API Integration','Landing Pages','Shopify Setup','WordPress','App UI Design','Chatbot Setup'],
  'Business & Finance': ['Market Research','Data Entry & Analysis','Excel & Google Sheets','Presentations PPT','Business Writing','Customer Support','Amazon Flipkart Listing','Hindi Content Writing','Regional Language Content'],
  'AI & Automation': ['ChatGPT Prompting','AI Image Generation','AI Video Creation','Notion Zapier Automation'],
};

const categoryIcons = { 'Digital Marketing':'📣','Design & Creative':'🎨','Tech & Development':'💻','Business & Finance':'📊','AI & Automation':'🤖' };

// ── Quiz Data (trimmed — keeping original full set) ────────────────────────
const allQuestions = {
  'SEO & SEM':[{q:'What does SEO stand for?',opts:['Search Engine Optimization','Social Engine Output','Search Email Outreach','Site Engine Optimization'],ans:0},{q:'Which tag is most important for SEO?',opts:['footer','title','div','span'],ans:1},{q:'What is a backlink?',opts:['A broken link','A link from another website to yours','An internal link','A paid ad link'],ans:1},{q:'What is keyword density?',opts:['Keywords in meta tags','How often a keyword appears relative to total words','Number of images','Website speed'],ans:1},{q:'What is Google Search Console used for?',opts:['Running paid ads','Monitoring website performance in Google search','Email campaigns','Building websites'],ans:1}],
  'Social Media Management':[{q:'What does reach mean on social media?',opts:['Number of comments','Unique users who saw your post','Total likes','Number of shares'],ans:1},{q:'What is a content calendar?',opts:['A holiday calendar','A planned schedule of posts','A follower list','A payment schedule'],ans:1},{q:'Which metric shows interactions on your post?',opts:['Impressions','Reach','Engagement Rate','Followers'],ans:2},{q:'What is the ideal Instagram bio length?',opts:['500 chars','150 chars','300 chars','50 chars'],ans:1},{q:'What is a social media audit?',opts:['Deleting posts','Reviewing your social media performance and strategy','Adding followers','Creating ads'],ans:1}],
  'Content Writing':[{q:'What is a CTA in content writing?',opts:['Create Text Always','Call To Action','Content Title Area','Copy Text Automation'],ans:1},{q:'What is the ideal blog length for SEO?',opts:['200-300 words','500-600 words','1500-2500 words','5000+ words'],ans:2},{q:'What is evergreen content?',opts:['Content about nature','Content that stays relevant over time','Seasonal content','Spring content'],ans:1},{q:'What is a hook in writing?',opts:['A fishing term','An opening that grabs readers attention','A conclusion','A subheading'],ans:1},{q:'What is the inverted pyramid style?',opts:['Writing from bottom to top','Most important info first then details','Writing in triangles','A design technique'],ans:1}],
  'UI/UX Design':[{q:'What does UX stand for?',opts:['User Experience','Unique Exchange','User Export','Unified Experience'],ans:0},{q:'What is a wireframe?',opts:['A website template','A basic visual layout showing structure','A final design','A code file'],ans:1},{q:'What is the purpose of a user persona?',opts:['A social media profile','A fictional representation of your target user','A design template','A testing tool'],ans:1},{q:'What is Figma used for?',opts:['Video editing','UI/UX design and prototyping','Email marketing','Coding websites'],ans:1},{q:'What is A/B testing in UX?',opts:['Testing two websites','Comparing two design versions to see which performs better','Testing on mobile','A coding test'],ans:1}],
  'Web Development':[{q:'What does HTML stand for?',opts:['Hyper Text Markup Language','High Text Making Language','Hyper Tool Main Language','Home Text Markup Language'],ans:0},{q:'What is CSS used for?',opts:['Adding functionality','Styling and layout of web pages','Database management','Server configuration'],ans:1},{q:'What is responsive design?',opts:['Fast loading websites','Design that adapts to different screen sizes','Colorful design','Animated design'],ans:1},{q:'What is JavaScript used for?',opts:['Styling pages','Making web pages interactive and dynamic','Creating databases','Sending emails'],ans:1},{q:'What is a domain name?',opts:['A web hosting service','The address of a website like skillnux.in','A programming language','A website template'],ans:1}],
  'Video Editing':[{q:'What is a jump cut?',opts:['A transition effect','Cutting between two shots of the same subject','A sound effect','A color grade'],ans:1},{q:'What is color grading?',opts:['Changing video speed','Adjusting colors and tones of a video for aesthetic effect','Adding subtitles','Trimming clips'],ans:1},{q:'What is the standard frame rate for smooth video?',opts:['10 FPS','24-30 FPS','5 FPS','100 FPS'],ans:1},{q:'What does B-roll mean?',opts:['Bad footage','Supplementary footage used to support the main video','Background music','A video format'],ans:1},{q:'Which software is best for professional video editing?',opts:['MS Word','Adobe Premiere Pro','Paint','Notepad'],ans:1}],
  'ChatGPT Prompting':[{q:'What is prompt engineering?',opts:['Building chatbots','Crafting effective instructions to get better outputs from AI models','Programming AI','Testing software'],ans:1},{q:'What is a system prompt in ChatGPT?',opts:['A coding command','Instructions given to set the AI role and behavior','A user message','A chat title'],ans:1},{q:'What does temperature control in AI models?',opts:['Processing speed','The randomness and creativity of AI responses','Memory usage','Response length'],ans:1},{q:'What is chain-of-thought prompting?',opts:['Asking multiple questions','Asking AI to reason step-by-step before giving an answer','A prompt format','A chat style'],ans:1},{q:'What is a zero-shot prompt?',opts:['A blank prompt','Asking AI to complete a task without providing examples','A short prompt','A complex prompt'],ans:1}],
  'Canva Design':[{q:'What is Canva primarily used for?',opts:['Video editing','Graphic design for non-designers','Coding websites','Data analysis'],ans:1},{q:'What is a Canva template?',opts:['A blank page','A pre-designed layout that can be customized','A color palette','A font collection'],ans:1},{q:'What does brand kit in Canva allow you to do?',opts:['Save payment details','Store your brand colors fonts and logo for consistency','Download designs','Share with team'],ans:1},{q:'What is the magic resize feature?',opts:['Making images larger','Automatically resizing a design for different platforms','Changing colors','Adding animations'],ans:1},{q:'What is Canva Pro?',opts:['A free version','A paid version with advanced features','A mobile app','A design course'],ans:1}],
};
// Fallback for skills without specific questions
const defaultQuestions = allQuestions['Web Development'];

// ── Floating Particles ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i, size: Math.random() * 7 + 3,
  left: Math.random() * 100, delay: Math.random() * 6, duration: Math.random() * 8 + 10,
}));

// ── Left Panel Content ─────────────────────────────────────────────────────
const STEP_INFO = [
  { step: 1, title: 'Your Basic Details', desc: 'Enter your name, college info & UPI ID to start your profile.', icon: '👤' },
  { step: 2, title: 'Pick Your Top Skill', desc: 'Choose the skill you want to monetize and get verified for.', icon: '🎯' },
  { step: 3, title: 'Take the Skill Quiz', desc: 'Answer 5 quick questions to earn your verified badge level.', icon: '📝' },
  { step: 4, title: 'See Your Badge & Go!', desc: 'Review your score, complete your profile, and start earning.', icon: '🏅' },
];

const PERKS = [
  { icon: '🎯', text: 'AI-matched to brand gigs in your skill area' },
  { icon: '🛡️', text: 'UPI escrow protects your payment — always' },
  { icon: '🏅', text: 'Verified badges boost your profile visibility' },
  { icon: '💬', text: 'Chat directly with hiring business clients' },
  { icon: '🏆', text: 'Rank on your college leaderboard' },
  { icon: '🧾', text: 'Downloadable receipt for every completed gig' },
];

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 1 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Step 3 Quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Accent — Purple/Cyan for student
  const accent = '#7c3aed';
  const accent2 = '#06b6d4';
  const accentGrad = 'linear-gradient(135deg, #7c3aed, #06b6d4)';
  const accentGlow = 'rgba(124,58,237,0.3)';

  const inputSt = {
    width: '100%', padding: '12px 14px 12px 40px',
    borderRadius: '11px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.25s', fontFamily: 'inherit',
  };
  const noIconSt = { ...inputSt, paddingLeft: '14px' };
  const fo = e => e.target.style.borderColor = accent;
  const fb = e => e.target.style.borderColor = 'rgba(255,255,255,0.1)';

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStep1 = (e) => {
    e.preventDefault(); setErr('');
    if (!name || !email || !phone || !college || !course || !year || !upiId || !password || !confirmPassword) { setErr('⚠️ Please fill all required fields!'); return; }
    if (!email.includes('@')) { setErr('⚠️ Please enter a valid email!'); return; }
    if (phone.length < 10) { setErr('⚠️ Please enter a valid 10-digit number!'); return; }
    if (password.length < 8) { setErr('⚠️ Password must be at least 8 characters!'); return; }
    if (password !== confirmPassword) { setErr('⚠️ Passwords do not match!'); return; }
    setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQuiz = () => {
    if (selectedSkills.length === 0) { setErr('⚠️ Please choose at least one skill!'); return; }
    setErr('');
    setQuizQuestions(allQuestions[selectedSkills[0]] || defaultQuestions);
    setUserAnswers({}); setQuizSubmitted(false); setScore(0);
    setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (qIdx, oIdx) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleQuizSubmit = () => {
    if (Object.keys(userAnswers).length < 5) { setErr('⚠️ Please answer all 5 questions!'); return; }
    setErr('');
    let calc = 0;
    quizQuestions.forEach((q, idx) => { if (userAnswers[idx] === q.ans) calc++; });
    setScore(calc); setQuizSubmitted(true);
    if (calc >= 3) confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
    setTimeout(() => { setStep(4); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 1500);
  };

  const getBadge = (s, skill) => {
    if (s === 5) return { label: `🥇 Expert — ${skill}`, cls: 'gold', level: 'Expert', color: '#ffd700' };
    if (s === 4) return { label: `🥈 Advanced — ${skill}`, cls: 'silver', level: 'Advanced', color: '#c0c0c0' };
    if (s === 3) return { label: `🥉 Intermediate — ${skill}`, cls: 'bronze', level: 'Intermediate', color: '#cd7f32' };
    return { label: '📚 Beginner — Keep Practicing!', cls: 'beg', level: 'Beginner', color: '#60a5fa' };
  };

  const handleCompleteRegistration = async () => {
    setErr(''); setLoading(true);
    const badge = getBadge(score, selectedSkills[0]);
    try {
      const { error } = await supabase.from('students').insert([{
        name, email: email.trim(), phone: phone.trim(), college: college.trim(),
        course, year: parseInt(year), skill: selectedSkills[0], skills: selectedSkills, password,
        upi_id: upiId.trim(), score, level: badge.level, badge: badge.label,
        refer_code: 'SN' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        streak: 0, earnings: 0,
      }]);
      if (error) { setErr(error.message.includes('duplicate') ? '⚠️ Email already registered!' : '⚠️ ' + error.message); setLoading(false); return; }
      setSuccess(true);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    } catch { setErr('⚠️ Something went wrong!'); }
    finally { setLoading(false); }
  };

  const badge = getBadge(score, selectedSkills[0] || 'Web Development');
  const progressPct = ((step - 1) / 3) * 100;

  return (
    <PageEntrance style={{ minHeight: '100vh', background: '#08080f', color: '#e2e8f0', fontFamily: "'Inter','Outfit',sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* ── Background Orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '8%', left: '3%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'orbFloat 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '3%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'orbFloat 11s ease-in-out infinite reverse' }} />
      </div>

      {/* Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{ position: 'fixed', borderRadius: '50%', zIndex: 1, pointerEvents: 'none', width: p.size, height: p.size, left: `${p.left}%`, bottom: '-20px', background: accent, opacity: 0.12, animation: `floatUp ${p.duration}s ${p.delay}s infinite linear` }} />
      ))}

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', height: '64px', background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${accentGlow}` }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="SkillNux" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ padding: '3px 10px', borderRadius: '50px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '10px', fontWeight: '800', color: accent, letterSpacing: '1px' }}>STUDENT</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" style={{ padding: '8px 16px', borderRadius: '50px', background: accentGrad, color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: '700', boxShadow: `0 4px 16px ${accentGlow}` }}>Login →</Link>
          <Link to="/" style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>← Home</Link>
        </div>
      </nav>

      {/* ── Main Layout ── */}
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh', paddingTop: '64px' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex: '1 1 50%', padding: '60px 4% 60px 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 16px', borderRadius: '50px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '11px', fontWeight: '800', color: accent, letterSpacing: '1px', textTransform: 'uppercase', width: 'fit-content', marginBottom: '22px' }}>
            🎓 Student Registration Portal
          </div>

          <h1 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: '900', lineHeight: '1.1', color: '#fff', marginBottom: '16px' }}>
            <RevealText type="letter" text="Turn Your Skills Into" /><br />
            <span style={{ background: accentGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><RevealText type="letter" text="Real Earnings" delay={0.4} /></span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px', maxWidth: '440px', lineHeight: '1.75' }}>
            <RevealText type="word" text="Join 12,000+ college students earning real money from verified brands. Complete the 4-step registration, take your skill quiz, and start getting hired today!" delay={0.8} />
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '28px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {[['12,000+','Students Earning'],['₹48L+','Paid Out to Date'],['4.9★','Average Rating']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>{v}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* 4-Step Visual Journey */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Your 4-Step Registration Journey</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {STEP_INFO.map((s) => (
                <div key={s.step} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                  borderRadius: '12px', background: step === s.step ? `linear-gradient(135deg,${accentGlow},transparent)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${step === s.step ? accentGlow : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: step > s.step ? '#1dbf73' : (step === s.step ? accentGrad : 'rgba(255,255,255,0.08)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: step > s.step ? '16px' : '13px', fontWeight: '900', color: '#fff', flexShrink: 0, boxShadow: step === s.step ? `0 4px 16px ${accentGlow}` : 'none' }}>
                    {step > s.step ? '✓' : s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: step === s.step ? '#fff' : 'rgba(255,255,255,0.5)' }}>Step {s.step}: {s.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>{s.desc}</div>
                  </div>
                  {step === s.step && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}`, animation: 'pulse 1.5s ease infinite' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* 6 Perks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', maxWidth: '460px', marginBottom: '32px' }}>
            {PERKS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: `slideInCard 0.5s ${i * 0.06}s both` }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{p.icon}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{ padding: '18px 22px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, borderRadius: '14px', maxWidth: '460px' }}>
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
              "Earned ₹22,000 in 6 weeks by designing logos for brands I found on SkillNux. The UPI escrow made every project feel safe!"
            </p>
            <div style={{ marginTop: '8px', fontSize: '12px', color: accent, fontWeight: '700' }}>— Priya M., UI/UX Student, Bangalore</div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Multi-Step Form ── */}
        <div style={{ flex: '0 0 480px', padding: '76px 5% 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>

            {!success ? (
              <>
                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: accent }}>Step {step} of 4 — {STEP_INFO[step - 1]?.title}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{Math.round(progressPct)}% complete</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '50px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPct}%`, background: accentGrad, borderRadius: '50px', transition: 'width 0.6s ease', boxShadow: `0 0 10px ${accentGlow}` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: step > n ? '#1dbf73' : (step === n ? accentGrad : 'rgba(255,255,255,0.07)'), color: '#fff', border: step === n ? `2px solid ${accent}` : 'none', boxShadow: step === n ? `0 0 12px ${accentGlow}` : 'none', transition: 'all 0.4s' }}>
                        {step > n ? '✓' : n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {err && <div style={{ background: 'rgba(239,68,68,0.13)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '11px 15px', marginBottom: '16px', fontSize: '13px', color: '#fca5a5' }}>{err}</div>}

                {/* ── STEP 1: Basic Info ── */}
                {step === 1 && (
                  <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 10px', boxShadow: `0 8px 24px ${accentGlow}` }}>👤</div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Tell Us About Yourself</h2>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Basic info to create your verified freelancer profile</p>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px' }}>👤</span>
                      <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} required style={inputSt} onFocus={fo} onBlur={fb} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>📧</span>
                        <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required style={inputSt} onFocus={fo} onBlur={fb} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>📱</span>
                        <input type="tel" placeholder="WhatsApp *" value={phone} onChange={e => setPhone(e.target.value)} required style={inputSt} onFocus={fo} onBlur={fb} />
                      </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🎓</span>
                      <input type="text" placeholder="College Name *" value={college} onChange={e => setCollege(e.target.value)} required style={inputSt} onFocus={fo} onBlur={fb} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', zIndex: 1 }}>📚</span>
                        <select value={course} onChange={e => setCourse(e.target.value)} required style={{ ...inputSt, appearance: 'none', cursor: 'pointer' }} onFocus={fo} onBlur={fb}>
                          <option value="">Course *</option>
                          {['B.Tech','BCA','BBA','B.Com','B.Sc','MBA','MCA','M.Tech','Other'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', zIndex: 1 }}>📅</span>
                        <select value={year} onChange={e => setYear(e.target.value)} required style={{ ...inputSt, appearance: 'none', cursor: 'pointer' }} onFocus={fo} onBlur={fb}>
                          <option value="">Year *</option>
                          {['1','2','3','4','5'].map(y => <option key={y} value={y}>{y === '5' ? '5th+' : `${y}${y==='1'?'st':y==='2'?'nd':y==='3'?'rd':'th'} Year`}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>💳</span>
                      <input type="text" placeholder="UPI ID * (e.g. rohan@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} required style={inputSt} onFocus={fo} onBlur={fb} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '-6px', paddingLeft: '4px' }}>💰 Earnings are credited to this UPI ID</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔒</span>
                        <input type={showPass ? 'text' : 'password'} placeholder="Password *" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputSt, paddingRight: '38px' }} onFocus={fo} onBlur={fb} />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.4)', padding: 0 }}>{showPass ? '🙈' : '👁️'}</button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>✅</span>
                        <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ ...inputSt, paddingRight: '38px' }} onFocus={fo} onBlur={fb} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.4)', padding: 0 }}>{showConfirm ? '🙈' : '👁️'}</button>
                      </div>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: accentGrad, color: '#fff', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: `0 8px 24px ${accentGlow}`, marginTop: '4px' }}>
                      Continue → Choose Skill
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      Already registered? <Link to="/login" style={{ color: accent, fontWeight: '700', textDecoration: 'none' }}>Login →</Link>
                    </p>
                  </form>
                )}

                {/* ── STEP 2: Choose Skill ── */}
                {step === 2 && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 10px', boxShadow: `0 8px 24px ${accentGlow}` }}>🎯</div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Choose Your Skills</h2>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Select up to 3 skills (first selected will be your primary skill for the test)</p>
                    </div>

                    {Object.keys(skillsList).map(cat => (
                      <div key={cat} style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: accent, letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{categoryIcons[cat]}</span> {cat}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {skillsList[cat].map(skill => {
                            const isSel = selectedSkills.includes(skill);
                            return (
                              <button key={skill} type="button" onClick={() => {
                                setErr('');
                                setSelectedSkills(prev => {
                                  if (prev.includes(skill)) {
                                    return prev.filter(s => s !== skill);
                                  } else {
                                    if (prev.length >= 3) {
                                      setErr('⚠️ Maximum 3 skills can be selected!');
                                      return prev;
                                    }
                                    return [...prev, skill];
                                  }
                                });
                              }} style={{
                                padding: '7px 13px', borderRadius: '50px', border: `1px solid ${isSel ? accent : 'rgba(255,255,255,0.1)'}`,
                                background: isSel ? `linear-gradient(135deg,${accentGlow},transparent)` : 'rgba(255,255,255,0.04)',
                                color: isSel ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: isSel ? '700' : '500',
                                cursor: 'pointer', transition: 'all 0.2s',
                              }}>
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {selectedSkills.length > 0 && (
                      <div style={{ padding: '12px 16px', borderRadius: '11px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '13px', color: '#fff', marginBottom: '14px' }}>
                        <div style={{ fontWeight: '700', marginBottom: '6px' }}>✅ Selected Skills ({selectedSkills.length}/3):</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {selectedSkills.map((sk, idx) => (
                            <span key={sk} style={{ padding: '3px 8px', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', fontSize: '11px', border: idx === 0 ? `1px solid ${accent}` : 'none' }}>
                              {sk} {idx === 0 ? '⭐️ (Primary)' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
                      <button type="button" onClick={startQuiz} style={{ flex: 2, padding: '12px', borderRadius: '11px', border: 'none', background: accentGrad, color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: `0 6px 20px ${accentGlow}` }}>Take Skill Test →</button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Quiz ── */}
                {step === 3 && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 10px', boxShadow: `0 8px 24px ${accentGlow}` }}>📝</div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Skill Quiz: {selectedSkills[0]}</h2>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Answer all 5 questions to earn your badge level (Quiz is based on your primary skill)</p>
                    </div>

                    {/* Answered count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Answered: {Object.keys(userAnswers).length}/5</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[0,1,2,3,4].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: userAnswers[i] !== undefined ? accent : 'rgba(255,255,255,0.15)', transition: 'background 0.2s' }} />)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} style={{ padding: '16px', borderRadius: '13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: accent, marginBottom: '8px', letterSpacing: '0.5px' }}>Q{qIdx + 1}</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '12px', lineHeight: '1.5' }}>{q.q}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {q.opts.map((opt, oIdx) => {
                              const isSel = userAnswers[qIdx] === oIdx;
                              const isCorrect = q.ans === oIdx;
                              let bg = 'rgba(255,255,255,0.04)';
                              let border = 'rgba(255,255,255,0.08)';
                              let col = 'rgba(255,255,255,0.65)';
                              if (quizSubmitted) {
                                if (isCorrect) { bg = 'rgba(29,191,115,0.15)'; border = 'rgba(29,191,115,0.5)'; col = '#6ee7b7'; }
                                else if (isSel) { bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.5)'; col = '#fca5a5'; }
                              } else if (isSel) { bg = `linear-gradient(135deg,${accentGlow},transparent)`; border = accent; col = '#fff'; }
                              return (
                                <button key={oIdx} type="button" disabled={quizSubmitted} onClick={() => handleAnswerSelect(qIdx, oIdx)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '9px', border: `1px solid ${border}`, background: bg, color: col, fontSize: '13px', cursor: quizSubmitted ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', background: isSel && !quizSubmitted ? accent : 'rgba(255,255,255,0.1)', color: '#fff', flexShrink: 0 }}>
                                    {['A','B','C','D'][oIdx]}
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
                        <button type="button" onClick={handleQuizSubmit} disabled={Object.keys(userAnswers).length < 5} style={{ flex: 2, padding: '12px', borderRadius: '11px', border: 'none', background: Object.keys(userAnswers).length < 5 ? 'rgba(255,255,255,0.08)' : accentGrad, color: '#fff', fontSize: '14px', fontWeight: '800', cursor: Object.keys(userAnswers).length < 5 ? 'not-allowed' : 'pointer', boxShadow: Object.keys(userAnswers).length >= 5 ? `0 6px 20px ${accentGlow}` : 'none' }}>
                          Submit Test →
                        </button>
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '16px', fontSize: '13px', fontStyle: 'italic' }}>⏳ Evaluating score, loading result...</p>
                    )}
                  </div>
                )}

                {/* ── STEP 4: Score + Confirm ── */}
                {step === 4 && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 14px', boxShadow: `0 12px 32px ${accentGlow}`, animation: 'popIn 0.5s ease' }}>🏅</div>
                      <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 6px' }}>Your Score: {score}/5</h2>

                      {/* Badge Display */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '50px', background: `linear-gradient(135deg, ${badge.color}22, transparent)`, border: `2px solid ${badge.color}66`, fontSize: '15px', fontWeight: '800', color: badge.color, marginBottom: '12px' }}>
                        {badge.label}
                      </div>

                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                        {score >= 3 ? '🎉 You passed! Your verified badge is ready.' : '📚 Keep practicing — you can retake in your dashboard!'}
                      </p>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                        Skills: <strong style={{ color: accent }}>{selectedSkills.join(', ')}</strong>
                      </div>
                    </div>

                    {/* Summary */}
                    <div style={{ padding: '16px', borderRadius: '13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[['👤 Name', name],['📧 Email', email],['🎓 College', college],['🎯 Skills', selectedSkills.join(', ')],['📊 Badge', badge.level]].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                          <span style={{ color: '#fff', fontWeight: '600', maxWidth: '60%', textAlign: 'right' }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    {err && <div style={{ background: 'rgba(239,68,68,0.13)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '11px 15px', marginBottom: '14px', fontSize: '13px', color: '#fca5a5' }}>{err}</div>}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>← Review</button>
                      <button type="button" onClick={handleCompleteRegistration} disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: '11px', border: 'none', background: loading ? 'rgba(255,255,255,0.08)' : accentGrad, color: '#fff', fontSize: '14px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 6px 20px ${accentGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Creating...</> : '🚀 Complete Registration'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px', boxShadow: `0 16px 40px ${accentGlow}`, animation: 'popIn 0.5s ease' }}>🎉</div>
                <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>Welcome to SkillNux!</h2>
                <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '50px', background: `linear-gradient(135deg,${badge.color}22,transparent)`, border: `2px solid ${badge.color}55`, fontSize: '15px', fontWeight: '800', color: badge.color, marginBottom: '16px' }}>{badge.label}</div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', marginBottom: '24px' }}>
                  Your profile is live! Login to your dashboard and start applying to brand projects matched to your <strong style={{ color: accent }}>{selectedSkills.join(', ')}</strong> skills.
                </p>
                <div style={{ padding: '14px', borderRadius: '13px', background: 'rgba(29,191,115,0.08)', border: '1px solid rgba(29,191,115,0.2)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '20px' }}>
                  📱 Check your WhatsApp at <strong style={{ color: '#fff' }}>{phone}</strong> — your first project match notification will arrive soon!
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/login')} style={{ padding: '13px 28px', borderRadius: '12px', border: 'none', background: accentGrad, color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: `0 8px 24px ${accentGlow}` }}>Login to Dashboard →</button>
                  <Link to="/" style={{ padding: '13px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Home</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Global Keyframes ── */}
      <style>{`
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:0.12;} 50%{opacity:0.2;} 100%{transform:translateY(-100vh) scale(0.4);opacity:0;} }
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-30px) scale(1.05);} }
        @keyframes slideInCard { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0;} 80%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.8);} }
        select option { background: #1a1a2e; color: #fff; }
        @media(max-width:860px) {
          main { flex-direction: column !important; }
          main > div:last-child { flex: none !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; width: 100% !important; padding: 40px 6% !important; }
        }
      `}</style>
    </PageEntrance>
  );
}
