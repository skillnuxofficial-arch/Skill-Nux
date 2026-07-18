import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import RevealText from '../components/RevealText';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';

// ── Feature bullets per portal ─────────────────────────────────────────────
const STUDENT_FEATURES = [
  { icon: '🎯', title: 'Smart Gig Matching', desc: 'AI matches you to brand projects based on your skill score' },
  { icon: '🛡️', title: 'UPI Escrow Safety', desc: 'Your earnings are locked in escrow until client approves' },
  { icon: '🏅', title: 'Verified Badges', desc: 'Earn Expert, Advanced & Beginner badges from quiz scores' },
  { icon: '💬', title: 'Direct Client Chat', desc: 'Real-time inbox to sync with your hiring brand client' },
  { icon: '🧾', title: 'Invoice Generator', desc: 'Printable receipts for every completed milestone gig' },
  { icon: '🏆', title: 'Campus Leaderboard', desc: 'Climb your college ranking & get discovered by top brands' },
];

const BUSINESS_FEATURES = [
  { icon: '🔍', title: 'Instant Talent Match', desc: 'Find verified students sorted by skill quiz score instantly' },
  { icon: '💳', title: 'Escrow Payments', desc: 'Lock budget safely; release only after you approve the work' },
  { icon: '📤', title: 'Deliverable Review', desc: 'Inspect submitted work and request revisions with one click' },
  { icon: '💬', title: 'Team Inbox', desc: 'Message hired freelancers directly inside your dashboard' },
  { icon: '📊', title: 'Payment Ledger', desc: 'Full transaction history and receipt download for every gig' },
  { icon: '❤️', title: 'Favourite Talent', desc: 'Save top-performing students and re-hire with a single click' },
];

// ── Stats for social proof ─────────────────────────────────────────────────
const STUDENT_STATS = [
  { val: '12,000+', label: 'Students Registered' },
  { val: '₹48L+', label: 'Earned via Platform' },
  { val: '4.9★', label: 'Avg Student Rating' },
];
const BUSINESS_STATS = [
  { val: '3,200+', label: 'Brands Onboarded' },
  { val: '98%', label: 'Delivery Success Rate' },
  { val: '₹1Cr+', label: 'Escrow Processed' },
];

// ── Floating particles ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 10,
}));

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('type') === 'business' ? 'business' : 'student';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [succ, setSucc] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'newpass'
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotUserType, setForgotUserType] = useState('');

  // Animate feature cards on tab switch
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey(k => k + 1);
    setErr(''); setSucc('');
  }, [activeTab]);

  // Pre-fill remembered email
  useEffect(() => {
    const saved = localStorage.getItem('skillnux_remember_email');
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(''); setSucc('');
    if (!email || !password) { setErr('⚠️ Please enter email and password!'); return; }
    setLoading(true);

    try {
      const table = activeTab === 'student' ? 'students' : 'businesses';
      const { data, error } = await supabase
        .from(table).select('*')
        .eq('email', email.trim()).eq('password', password).single();

      if (error || !data) { setErr('⚠️ Invalid email or password!'); setLoading(false); return; }

      if (rememberMe) localStorage.setItem('skillnux_remember_email', email.trim());
      else localStorage.removeItem('skillnux_remember_email');

      localStorage.setItem('skillnux_user', JSON.stringify({ type: activeTab, ...data }));
      setSucc('✅ Login successful! Taking you in...');

      setTimeout(() => {
        navigate(activeTab === 'student' ? '/dashboard/student' : '/dashboard/business');
      }, 1200);
    } catch { setErr('⚠️ Something went wrong. Try again!'); }
    finally { setLoading(false); }
  };

  const isStudent = activeTab === 'student';
  const features = isStudent ? STUDENT_FEATURES : BUSINESS_FEATURES;
  const stats = isStudent ? STUDENT_STATS : BUSINESS_STATS;

  // Color scheme per portal
  const accent = isStudent ? '#7c3aed' : '#ff6b35';
  const accentGlow = isStudent ? 'rgba(124,58,237,0.35)' : 'rgba(255,107,53,0.35)';
  const accentGrad = isStudent
    ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
    : 'linear-gradient(135deg, #ff6b35, #f7931e)';
  const bgGrad = isStudent
    ? 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.12) 0%, transparent 60%)'
    : 'radial-gradient(ellipse at 30% 20%, rgba(255,107,53,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(247,147,30,0.12) 0%, transparent 60%)';

  return (
    <PageEntrance style={{
      minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0',
      fontFamily: "'Inter', 'Outfit', sans-serif", position: 'relative', overflow: 'hidden'
    }}>

      {/* ── Animated Background ── */}
      <div style={{ position: 'fixed', inset: 0, background: bgGrad, transition: 'all 0.8s ease', zIndex: 0 }} />

      {/* Floating Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'fixed', borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
          width: p.size, height: p.size, left: `${p.left}%`, bottom: '-20px',
          background: accent, opacity: 0.15,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`
        }} />
      ))}

      {/* ── Top Nav Bar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 6%', height: '64px',
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${accentGlow}`
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="SkillNux" style={{ height: '36px', objectFit: 'contain' }} />
        </Link>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Portal switcher in nav */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.06)',
            borderRadius: '50px', padding: '4px', border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {['student', 'business'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '6px 18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700', transition: 'all 0.3s ease',
                background: activeTab === tab ? accentGrad : 'transparent',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                boxShadow: activeTab === tab ? `0 0 16px ${accentGlow}` : 'none'
              }}>
                {tab === 'student' ? '🎓 Student' : '🏢 Business'}
              </button>
            ))}
          </div>
          <Link to="/" style={{
            padding: '8px 18px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: '600'
          }}>← Home</Link>
        </div>
      </nav>

      {/* ── Page Body ── */}
      <main style={{
        position: 'relative', zIndex: 10, minHeight: '100vh',
        display: 'flex', alignItems: 'stretch', paddingTop: '64px'
      }}>

        {/* ── LEFT PANEL — Features Showcase ── */}
        <div style={{
          flex: '1 1 55%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 5% 60px 8%'
        }}>

          {/* Portal Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
            border: `1px solid ${accentGlow}`, borderRadius: '50px',
            padding: '6px 18px', fontSize: '12px', fontWeight: '700',
            color: accent, marginBottom: '24px', width: 'fit-content',
            letterSpacing: '1px', textTransform: 'uppercase'
          }}>
            {isStudent ? '🎓 Student Portal' : '🏢 Client Portal'}
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', lineHeight: '1.2',
            marginBottom: '16px', color: '#fff'
          }}>
            {isStudent ? (
              <>
                <span style={{ display: 'block' }}>Start Earning With</span>
                <span style={{ display: 'block', background: accentGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Your Skills Today
                </span>
              </>
            ) : (
              <>
                <span style={{ display: 'block' }}>Hire Verified Campus</span>
                <span style={{ display: 'block', color: accent, fontStyle: 'italic' }}>
                  Talent — Instantly.
                </span>
              </>
            )}
          </h1>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px', maxWidth: '480px', lineHeight: '1.7' }}>
            {isStudent
              ? 'Join 12,000+ students earning real money from brands & businesses across India — all with UPI escrow protection.'
              : "Access India's largest pool of skill-verified student freelancers. Post gigs, secure payments with escrow & review every deliverable — all in one powerful dashboard."}
          </p>

          {/* ── Stats Row ── */}
          <div style={{ display: 'flex', gap: '28px', marginBottom: '36px', flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: 'left', padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${accentGlow}`,
                borderRadius: '12px', minWidth: '110px'
              }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── How It Works (Business only) or Feature Cards (Student) ── */}
          {!isStudent ? (
            <>
              {/* How It Works Steps */}
              <div style={{ marginBottom: '28px', maxWidth: '520px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: accent, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '18px' }}>
                  ⚡ How It Works — 4 Simple Steps
                </div>
                {[
                  { step: '01', icon: '📝', title: 'Post Your Gig', desc: 'Describe your project, set your budget & timeline in under 2 minutes.' },
                  { step: '02', icon: '🔍', title: 'Get Matched Instantly', desc: 'Our AI surfaces the top skill-verified students matching your exact requirements.' },
                  { step: '03', icon: '💳', title: 'Secure with Escrow', desc: 'Lock funds safely — student gets paid only after you approve the work.' },
                  { step: '04', icon: '✅', title: 'Approve & Done', desc: 'Review deliverables, request revisions if needed, then release payment in one click.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    marginBottom: '14px', padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    transition: 'all 0.25s ease',
                    animation: `slideInFeature 0.5s ${i * 0.1}s both ease-out`,
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.07)';
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.25)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      minWidth: '36px', height: '36px', borderRadius: '10px',
                      background: `linear-gradient(135deg, #ff6b35, #f7931e)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#ff6b35', letterSpacing: '1px' }}>STEP {item.step}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{item.title}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges Row */}
              <div style={{
                display: 'flex', gap: '10px', flexWrap: 'wrap',
                marginBottom: '28px', maxWidth: '520px'
              }}>
                {[
                  { icon: '🛡️', text: 'UPI Escrow Protected' },
                  { icon: '✅', text: 'Skill-Verified Talent' },
                  { icon: '⚡', text: 'Match in 60 Seconds' },
                  { icon: '📊', text: 'Real-Time Dashboard' },
                ].map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '50px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600'
                  }}>
                    <span>{b.icon}</span> {b.text}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ── Student Feature Cards ── */
            <div key={animKey} style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', maxWidth: '520px', marginBottom: '28px'
            }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: '14px', padding: '16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease', cursor: 'default',
                  animation: `slideInFeature 0.5s ${i * 0.07}s both ease-out`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = accentGlow;
                    e.currentTarget.style.background = `rgba(255,255,255,0.07)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Testimonial Quote ── */}
          <div style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
            border: `1px solid ${accentGlow}`, borderRadius: '14px',
            maxWidth: '520px'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
              {isStudent
                ? '"Earned ₹18,000 in my first month on SkillNux. The escrow payment system gives me full confidence in every project!"'
                : '"We hired 5 student designers through SkillNux — all skill-verified, all delivered on time. The escrow system made every transaction completely stress-free. Highly recommend for any growing brand!"'}
            </p>
            <div style={{ marginTop: '10px', fontSize: '12px', color: accent, fontWeight: '700' }}>
              {isStudent ? '— Aryan K., UI/UX Student, Pune' : '— Priya S., Marketing Head, GrowthLabs India'}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Login Form ── */}
        <div style={{
          flex: '0 0 420px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '80px 5% 60px',
          borderLeft: `1px solid rgba(255,255,255,0.06)`
        }}>
          <div style={{
            width: '100%', maxWidth: '380px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '36px',
            boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px ${accentGlow}`,
          }}>
            {/* Form Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: accentGrad, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px',
                boxShadow: `0 8px 24px ${accentGlow}`
              }}>
                {isStudent ? '🎓' : '🏢'}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>
                {isStudent ? 'Student Login' : 'Client Login'}
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {isStudent ? 'Access your freelancing dashboard' : 'Access your client portal'}
              </p>
            </div>

            {/* Alerts */}
            {err && (
              <div style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                fontSize: '13px', color: '#fca5a5'
              }}>{err}</div>
            )}
            {succ && (
              <div style={{
                background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)',
                borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                fontSize: '13px', color: '#6ee7b7'
              }}>{succ}</div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>📧</span>
                  <input
                    type="email"
                    placeholder={isStudent ? 'student@college.edu' : 'business@company.com'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '13px 44px 13px 42px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)', padding: 0
                  }}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: accent, width: '15px', height: '15px' }} />
                  Remember me
                </label>
                <span
                  onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotMsg(''); setForgotErr(''); setForgotStep('email'); setEnteredOTP(''); setNewPassword(''); }}
                  style={{ fontSize: '12px', color: accent, cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: loading ? 'rgba(255,255,255,0.1)' : accentGrad,
                  color: '#fff', fontSize: '15px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : `0 8px 24px ${accentGlow}`,
                  transition: 'all 0.3s ease', marginTop: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Logging in...
                  </>
                ) : (
                  <>{isStudent ? 'Login as Student' : 'Login as Client'} →</>
                )}
              </button>

            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Switch portal */}
            <button onClick={() => setActiveTab(isStudent ? 'business' : 'student')} style={{
              width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              {isStudent ? '🏢 Switch to Client Login' : '🎓 Switch to Student Login'}
            </button>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Don't have an account?{' '}
              <Link
                to={isStudent ? '/register/student' : '/register/business'}
                style={{ color: accent, fontWeight: '700', textDecoration: 'none' }}
              >
                Register Free →
              </Link>
            </p>

            {/* Security Badge */}
            <div style={{
              marginTop: '20px', padding: '12px', borderRadius: '10px',
              background: 'rgba(29,191,115,0.08)', border: '1px solid rgba(29,191,115,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '11px', color: 'rgba(255,255,255,0.5)'
            }}>
              <span style={{ fontSize: '16px' }}>🔐</span>
              <span>256-bit SSL encrypted. Your data is fully protected by SkillNux Secure Cloud.</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowForgot(false)}>
          <div style={{ background: '#13131a', border: `1px solid ${accentGlow}`, borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '400px', boxShadow: `0 32px 80px rgba(0,0,0,0.6)` }} onClick={e => e.stopPropagation()}>

            {/* Steps indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {['email','otp','newpass'].map((s, i) => (
                <div key={s} style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, background: forgotStep === s ? accentGrad : 'rgba(255,255,255,0.08)', color: forgotStep === s ? '#fff' : 'rgba(255,255,255,0.3)', border: forgotStep === s ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>{i + 1}</div>
              ))}
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{forgotStep === 'email' ? '📧' : forgotStep === 'otp' ? '🔢' : '🔒'}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>
                {forgotStep === 'email' ? 'Find Your Account' : forgotStep === 'otp' ? 'Enter OTP Code' : 'Set New Password'}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {forgotStep === 'email' ? 'Enter your registered email address' : forgotStep === 'otp' ? 'Check your browser — OTP is shown below' : 'Choose a new strong password'}
              </p>
            </div>

            {/* Error */}
            {forgotErr && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#fca5a5' }}>{forgotErr}</div>}

            {/* STEP 1 — Email */}
            {forgotStep === 'email' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>📧</span>
                    <input type="email" placeholder="Enter your registered email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                      style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>
                <button disabled={forgotLoading} onClick={async () => {
                  if (!forgotEmail) { setForgotErr('⚠️ Please enter your email.'); return; }
                  setForgotLoading(true); setForgotErr('');
                  try {
                    // Check students table first
                    const { data: sData } = await supabase.from('students').select('id').eq('email', forgotEmail.trim()).single();
                    // Check businesses table if not found
                    const { data: bData } = !sData ? await supabase.from('businesses').select('id').eq('email', forgotEmail.trim()).single() : { data: null };
                    if (!sData && !bData) { setForgotErr('⚠️ No account found with this email.'); setForgotLoading(false); return; }
                    const userType = sData ? 'students' : 'businesses';
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const expiry = Date.now() + 10 * 60 * 1000; // 10 min
                    localStorage.setItem('skillnux_otp', JSON.stringify({ otp, email: forgotEmail.trim(), expiry, userType }));
                    setGeneratedOTP(otp);
                    setForgotUserType(userType);
                    setForgotStep('otp');
                  } catch { setForgotErr('⚠️ Something went wrong. Try again.'); }
                  finally { setForgotLoading(false); }
                }} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: forgotLoading ? 'rgba(255,255,255,0.1)' : accentGrad, color: '#fff', fontSize: '15px', fontWeight: '800', cursor: forgotLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {forgotLoading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Checking...</> : 'Get OTP →'}
                </button>
              </>
            )}

            {/* STEP 2 — OTP */}
            {forgotStep === 'otp' && (
              <>
                {/* Show OTP to user (since no email service yet) */}
                <div style={{ background: 'rgba(0,240,200,0.08)', border: '1px solid rgba(0,240,200,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>YOUR OTP CODE (valid 10 min)</div>
                  <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '8px', color: '#00f0c8' }}>{generatedOTP}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Enter OTP</label>
                  <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={enteredOTP} onChange={e => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '20px', fontWeight: '700', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '6px' }}
                    onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <button onClick={() => {
                  setForgotErr('');
                  const stored = JSON.parse(localStorage.getItem('skillnux_otp') || '{}');
                  if (!stored.otp) { setForgotErr('⚠️ Session expired. Start again.'); setForgotStep('email'); return; }
                  if (Date.now() > stored.expiry) { setForgotErr('⚠️ OTP expired. Please request again.'); setForgotStep('email'); return; }
                  if (enteredOTP !== stored.otp) { setForgotErr('⚠️ Wrong OTP. Please try again.'); return; }
                  setForgotStep('newpass');
                }} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: accentGrad, color: '#fff', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}>
                  Verify OTP →
                </button>
              </>
            )}

            {/* STEP 3 — New Password */}
            {forgotStep === 'newpass' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔒</span>
                    <input type="password" placeholder="Enter new password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>
                <button disabled={forgotLoading} onClick={async () => {
                  if (!newPassword || newPassword.length < 6) { setForgotErr('⚠️ Password must be at least 6 characters.'); return; }
                  setForgotLoading(true); setForgotErr('');
                  try {
                    const stored = JSON.parse(localStorage.getItem('skillnux_otp') || '{}');
                    const { error } = await supabase.from(stored.userType).update({ password: newPassword }).eq('email', stored.email);
                    if (error) { setForgotErr('⚠️ Failed to update. Try again.'); }
                    else {
                      localStorage.removeItem('skillnux_otp');
                      setForgotStep('email');
                      setForgotMsg('done');
                    }
                  } catch { setForgotErr('⚠️ Something went wrong.'); }
                  finally { setForgotLoading(false); }
                }} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: forgotLoading ? 'rgba(255,255,255,0.1)' : accentGrad, color: '#fff', fontSize: '15px', fontWeight: '800', cursor: forgotLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {forgotLoading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Saving...</> : '✅ Update Password'}
                </button>
              </>
            )}

            {/* Success */}
            {forgotMsg === 'done' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h4 style={{ color: '#00f0c8', fontWeight: 800, margin: '0 0 8px' }}>Password Updated!</h4>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 16px' }}>You can now login with your new password.</p>
                <button onClick={() => { setShowForgot(false); setForgotMsg(''); }} style={{ padding: '10px 28px', borderRadius: '10px', border: 'none', background: accentGrad, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Login Now →</button>
              </div>
            )}

            {/* Cancel */}
            {forgotMsg !== 'done' && (
              <button onClick={() => { setShowForgot(false); setForgotStep('email'); setForgotErr(''); setForgotMsg(''); }} style={{ width: '100%', padding: '11px', marginTop: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes slideInFeature {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          main { flex-direction: column !important; }
          main > div:first-child { padding: 40px 6% 20px !important; flex: none !important; }
          main > div:last-child { flex: none !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; width: 100% !important; }
        }
      `}</style>
    </PageEntrance>
  );
}
