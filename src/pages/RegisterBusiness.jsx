import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import RevealText from '../components/RevealText';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';

// ── Floating Particles ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i, size: Math.random() * 7 + 3,
  left: Math.random() * 100, delay: Math.random() * 6, duration: Math.random() * 8 + 10,
}));

// ── Why Join Perks ─────────────────────────────────────────────────────────
const WHY_JOIN = [
  { icon: '🔍', title: 'Instant Talent Match', desc: 'Find skill-verified students in seconds sorted by quiz score.' },
  { icon: '🛡️', title: 'Escrow Protection', desc: 'Lock budget safely. Release funds only after work approval.' },
  { icon: '📤', title: 'Review Deliverables', desc: 'Approve, reject or request revisions on submitted work.' },
  { icon: '💬', title: 'Direct Messaging', desc: 'Chat with hired freelancers inside your portal inbox.' },
  { icon: '📊', title: 'Payment Ledger', desc: 'Full transaction history and downloadable receipts for every gig.' },
  { icon: '❤️', title: 'Talent Shortlist', desc: 'Save favourite students and re-hire them with one click.' },
];

const TRUST_LOGOS = ['🏬', '🏥', '🍕', '🛒', '🏗️', '📚', '✈️', '🎓'];

// ── Input Component ─────────────────────────────────────────────────────────
function Field({ icon, label, optional, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        {label} {optional && <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', zIndex: 1 }}>{icon}</span>}
        {children}
      </div>
      {hint && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', paddingLeft: '4px' }}>{hint}</div>}
    </div>
  );
}

const inputStyle = (accent, hasIcon = true) => ({
  width: '100%', padding: `12px 14px 12px ${hasIcon ? '40px' : '14px'}`,
  borderRadius: '11px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.25s',
  fontFamily: 'inherit',
});

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [gst, setGst] = useState('');
  const [website, setWebsite] = useState('');
  const [workNeeded, setWorkNeeded] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Accent colours — Orange/Gold for business
  const accent = '#ff6b35';
  const accent2 = '#f7931e';
  const accentGrad = 'linear-gradient(135deg, #ff6b35, #f7931e)';
  const accentGlow = 'rgba(255,107,53,0.3)';

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr('');
    if (!agreed) { setErr('⚠️ Please agree to the Terms & Conditions!'); return; }
    if (!businessName || !ownerName || !email || !phone || !businessType || !city || !workNeeded || !password || !confirmPassword) {
      setErr('⚠️ Please fill all required fields!'); return;
    }
    if (!email.includes('@')) { setErr('⚠️ Please enter a valid email!'); return; }
    if (phone.length < 10) { setErr('⚠️ Please enter a valid 10-digit WhatsApp number!'); return; }
    if (password.length < 8) { setErr('⚠️ Password must be at least 8 characters!'); return; }
    if (password !== confirmPassword) { setErr('⚠️ Passwords do not match!'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from('businesses').insert([{
        business_name: businessName, owner_name: ownerName,
        email: email.trim(), phone: phone.trim(), business_type: businessType,
        city: city.trim(), gst: gst || null, website: website || null,
        work_needed: workNeeded, password,
      }]);
      if (error) {
        setErr(error.message.includes('duplicate') ? '⚠️ This email is already registered!' : '⚠️ ' + error.message);
        setLoading(false); return;
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setErr('⚠️ Something went wrong. Please try again!'); }
    finally { setLoading(false); }
  };

  const focusStyle = { borderColor: accent };

  return (
    <PageEntrance style={{ minHeight: '100vh', background: '#080810', color: '#e2e8f0', fontFamily: "'Inter','Outfit',sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* ── Animated Background Orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'orbFloat 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,147,30,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'orbFloat 10s ease-in-out infinite reverse' }} />
      </div>

      {/* Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'fixed', borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
          width: p.size, height: p.size, left: `${p.left}%`, bottom: '-20px',
          background: accent, opacity: 0.12,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`
        }} />
      ))}

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 6%', height: '64px',
        background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${accentGlow}`
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="SkillNux" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ padding: '3px 10px', borderRadius: '50px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '10px', fontWeight: '800', color: accent, letterSpacing: '1px' }}>BIZ</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" style={{ padding: '8px 16px', borderRadius: '50px', background: accentGrad, color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: '700', boxShadow: `0 4px 16px ${accentGlow}` }}>Login →</Link>
          <Link to="/" style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>← Home</Link>
        </div>
      </nav>

      {/* ── Main Layout ── */}
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh', paddingTop: '64px' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex: '1 1 52%', padding: '60px 4% 60px 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 16px', borderRadius: '50px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '11px', fontWeight: '800', color: accent, letterSpacing: '1px', textTransform: 'uppercase', width: 'fit-content', marginBottom: '22px' }}>
            🏢 Business Registration Portal
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: '900', lineHeight: '1.1', color: '#fff', marginBottom: '16px' }}>
            <RevealText type="letter" text="Hire Campus Talent" /><br />
            <span style={{ background: accentGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><RevealText type="letter" text="On Your Terms" delay={0.4} /></span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px', maxWidth: '440px', lineHeight: '1.75' }}>
            <RevealText type="word" text="Register your business and instantly access 12,000+ skill-verified student freelancers. Post gigs, secure payments with escrow, and only pay when you're satisfied." delay={0.8} />
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '28px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {[['3,200+', 'Brands Registered'], ['₹1Cr+', 'Escrow Processed'], ['98%', 'Client Satisfaction']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: accent }}>{v}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* 6 Feature Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '500px', marginBottom: '36px' }}>
            {WHY_JOIN.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', padding: '15px', transition: 'all 0.3s', cursor: 'default',
                animation: `slideInCard 0.5s ${i * 0.07}s both`
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accentGlow; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '20px', marginBottom: '7px' }}>{f.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Trust Logos */}
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Trusted by businesses across India</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {TRUST_LOGOS.map((logo, i) => (
                <div key={i} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accentGlow; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  {logo}
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{ marginTop: '32px', padding: '18px 22px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, borderRadius: '14px', maxWidth: '500px' }}>
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
              "We hired 3 college students for our digital campaign. Delivered in 5 days, amazing quality, zero risk with escrow payments!"
            </p>
            <div style={{ marginTop: '8px', fontSize: '12px', color: accent, fontWeight: '700' }}>— Vikram S., Founder, NexaBrand Pvt Ltd</div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Registration Form ── */}
        <div style={{ flex: '0 0 460px', padding: '80px 5% 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>

          {!success ? (
            <div style={{ width: '100%', maxWidth: '400px' }}>

              {/* Form Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 14px', boxShadow: `0 8px 28px ${accentGlow}` }}>🏢</div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>Register Your Business</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Free to join. Hire & pay only when satisfied.</p>
              </div>

              {/* Error Alert */}
              {err && (
                <div style={{ background: 'rgba(239,68,68,0.13)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '11px 15px', marginBottom: '18px', fontSize: '13px', color: '#fca5a5' }}>{err}</div>
              )}

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Section: Business Info */}
                <div style={{ padding: '10px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>📋</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Business Information</span>
                </div>

                <Field icon="🏢" label="Business / Brand Name *">
                  <input type="text" placeholder="e.g. Sharma Enterprises" value={businessName} onChange={e => setBusinessName(e.target.value)} required style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>

                <Field icon="👤" label="Owner / Contact Person *">
                  <input type="text" placeholder="Your full name" value={ownerName} onChange={e => setOwnerName(e.target.value)} required style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field icon="📧" label="Business Email *">
                    <input type="email" placeholder="biz@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field icon="📱" label="WhatsApp *" hint="Updates will be sent here">
                    <input type="tel" placeholder="+91 98765..." value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field icon="🏷️" label="Business Type *">
                    <select value={businessType} onChange={e => setBusinessType(e.target.value)} required style={{ ...inputStyle(accent), appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                      <option value="">Select Type</option>
                      {['D2C Brand','Local Shop / Store','Startup','Agency','Freelancer / Solopreneur','Restaurant / Food Business','Education / Coaching','Healthcare / Clinic','E-commerce Store','Real Estate','Manufacturing','Service Business','NGO / Non-profit','Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field icon="📍" label="City *">
                    <input type="text" placeholder="Mumbai, Delhi..." value={city} onChange={e => setCity(e.target.value)} required style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field icon="🧾" label="GST Number" optional hint="Needed for tax invoice">
                    <input type="text" placeholder="22AAAAA0000A1Z5" value={gst} onChange={e => setGst(e.target.value)} style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                  <Field icon="🌐" label="Website / Social" optional>
                    <input type="text" placeholder="instagram.com/brand" value={website} onChange={e => setWebsite(e.target.value)} style={inputStyle(accent)} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </Field>
                </div>

                {/* Section: Work */}
                <div style={{ padding: '10px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>💼</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Work Requirements</span>
                </div>

                <Field icon="🎯" label="What kind of work do you need? *">
                  <select value={workNeeded} onChange={e => setWorkNeeded(e.target.value)} required style={{ ...inputStyle(accent), appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                    <option value="">Select Category</option>
                    {['Digital Marketing (SEO, Social Media, Ads)','Design & Creative (Logo, UI/UX, Video)','Tech & Development (Website, App, Automation)','Business & Finance (Research, Excel, PPT)','AI & Automation (ChatGPT, AI Tools)','Content Writing (Hindi, English, Regional)','Multiple Services','Not Sure Yet'].map(w => <option key={w}>{w}</option>)}
                  </select>
                </Field>

                {/* Section: Account */}
                <div style={{ padding: '10px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🔐</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Create Your Account</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field icon="🔒" label="Password *" hint="Min 8 characters">
                    <input type={showPass ? 'text' : 'password'} placeholder="Strong password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle(accent), paddingRight: '40px' }} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'rgba(255,255,255,0.4)', padding: 0 }}>{showPass ? '🙈' : '👁️'}</button>
                  </Field>
                  <Field icon="✅" label="Confirm Password *">
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ ...inputStyle(accent), paddingRight: '40px' }} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'rgba(255,255,255,0.4)', padding: 0 }}>{showConfirm ? '🙈' : '👁️'}</button>
                  </Field>
                </div>

                {/* Terms Checkbox */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: accent, marginTop: '2px', width: '15px', height: '15px', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                    I agree to SkillNux <span style={{ color: accent, fontWeight: '600' }}>Terms & Conditions</span> and <span style={{ color: accent, fontWeight: '600' }}>Privacy Policy</span>. My account will be reviewed within 24 hours.
                  </span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: loading ? 'rgba(255,255,255,0.08)' : accentGrad,
                  color: '#fff', fontSize: '15px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : `0 8px 24px ${accentGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.3s', marginTop: '4px',
                }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${accentGlow}`; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : `0 8px 24px ${accentGlow}`; }}
                >
                  {loading ? (
                    <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Registering...</>
                  ) : '🚀 Register My Business →'}
                </button>

                {/* Login Link */}
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>
                  Already registered? <Link to="/login" style={{ color: accent, fontWeight: '700', textDecoration: 'none' }}>Login →</Link>
                </p>

                {/* Security badge */}
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(29,191,115,0.08)', border: '1px solid rgba(29,191,115,0.18)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ fontSize: '14px' }}>🔐</span> 256-bit SSL encrypted. Your business data is fully secured on SkillNux Cloud.
                </div>
              </form>
            </div>
          ) : (
            /* ── SUCCESS STATE ── */
            <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 24px', boxShadow: `0 16px 40px ${accentGlow}`, animation: 'popIn 0.5s ease' }}>🎉</div>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>Business Registered!</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', marginBottom: '28px' }}>
                Welcome to SkillNux! Your account has been created successfully.<br />
                Our team will verify your details and activate your account within <strong style={{ color: accent }}>24 hours</strong>.<br />
                You'll receive a <strong style={{ color: '#1dbf73' }}>WhatsApp confirmation</strong>.
              </p>
              <div style={{ padding: '16px', borderRadius: '14px', background: `linear-gradient(135deg,${accentGlow},transparent)`, border: `1px solid ${accentGlow}`, fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                📱 Keep an eye on your WhatsApp at <strong style={{ color: '#fff' }}>{phone}</strong> — we'll notify you once your account is active!
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" style={{ padding: '12px 24px', borderRadius: '12px', background: accentGrad, color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '700', boxShadow: `0 8px 24px ${accentGlow}` }}>Login Now →</Link>
                <Link to="/" style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Global Keyframes ── */}
      <style>{`
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:0.12;} 50%{opacity:0.2;} 100%{transform:translateY(-100vh) scale(0.4);opacity:0;} }
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-30px) scale(1.05);} }
        @keyframes slideInCard { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0;} 80%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
        select option { background: #1a1a2e; color: #fff; }
        @media(max-width:860px) {
          main { flex-direction: column !important; }
          main > div:last-child { flex: none !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; width: 100% !important; padding: 40px 6% !important; }
        }
      `}</style>
    </PageEntrance>
  );
}
