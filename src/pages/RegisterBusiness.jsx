import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Form states
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr('');

    // Validation
    if (!businessName || !ownerName || !email || !phone || !businessType || !city || !workNeeded || !password || !confirmPassword) {
      setErr('⚠️ Please fill all required fields!');
      return;
    }
    if (!email.includes('@')) {
      setErr('⚠️ Please enter a valid email!');
      return;
    }
    if (phone.length < 10) {
      setErr('⚠️ Please enter a valid 10-digit WhatsApp number!');
      return;
    }
    if (password.length < 8) {
      setErr('⚠️ Password must be at least 8 characters!');
      return;
    }
    if (password !== confirmPassword) {
      setErr('⚠️ Passwords do not match!');
      return;
    }

    setLoading(true);

    const data = {
      business_name: businessName,
      owner_name: ownerName,
      email: email.trim(),
      phone: phone.trim(),
      business_type: businessType,
      city: city.trim(),
      gst: gst ? gst.trim() : null,
      website: website ? website.trim() : null,
      work_needed: workNeeded,
      password: password
    };

    try {
      const { error } = await supabase.from('businesses').insert([data]);
      if (error) {
        setErr(error.message.includes('duplicate') ? '⚠️ This email is already registered!' : '⚠️ ' + error.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr('⚠️ Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        <Link className="logo" to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div className="logo-circle"><span>SN</span></div>
          <span className="logo-name">Skill<em>Nux</em></span>
        </Link>
        <Link className="btn-ghost" to="/">← Back to Home</Link>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '100px 6% 60px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        {!success ? (
          <div className="card">
            <div className="card-title">🏢 Register Your Business</div>
            <div className="card-sub">Join SkillNux and get access to verified, skilled students ready to work for you. Pay only when satisfied.</div>

            <div className="trust-badge">
              <span>🔒</span>
              <div>Your information is secure. We verify all businesses before activation.</div>
            </div>

            {err && <div className="alert alert-error show">{err}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-grid">
                <div className="section-title">📋 Business Information</div>

                <div className="form-group full">
                  <label>Business / Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Enterprises, TechCo India"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Owner / Contact Person Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business Email *</label>
                  <input
                    type="email"
                    placeholder="business@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <div className="form-hint">📱 Project updates will be sent here</div>
                </div>

                <div className="form-group">
                  <label>Business Type *</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                  >
                    <option value="">Select Type</option>
                    <option>D2C Brand</option>
                    <option>Local Shop / Store</option>
                    <option>Startup</option>
                    <option>Agency</option>
                    <option>Freelancer / Solopreneur</option>
                    <option>Restaurant / Food Business</option>
                    <option>Education / Coaching</option>
                    <option>Healthcare / Clinic</option>
                    <option>E-commerce Store</option>
                    <option>Real Estate</option>
                    <option>Manufacturing</option>
                    <option>Service Business</option>
                    <option>NGO / Non-profit</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi, Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>GST Number <span className="optional-tag">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="22AAAAA0000A1Z5"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                  />
                  <div className="form-hint">Required for tax invoice</div>
                </div>

                <div className="form-group">
                  <label>Website / Social Link <span className="optional-tag">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="instagram.com/yourbrand"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="divider"></div>
                <div className="section-title">💼 Work Requirements</div>

                <div className="form-group full">
                  <label>What kind of work do you need? *</label>
                  <select
                    value={workNeeded}
                    onChange={(e) => setWorkNeeded(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option>Digital Marketing (SEO, Social Media, Ads)</option>
                    <option>Design & Creative (Logo, UI/UX, Video)</option>
                    <option>Tech & Development (Website, App, Automation)</option>
                    <option>Business & Finance (Research, Excel, PPT)</option>
                    <option>AI & Automation (ChatGPT, AI Tools)</option>
                    <option>Content Writing (Hindi, English, Regional)</option>
                    <option>Multiple Services</option>
                    <option>Not Sure Yet</option>
                  </select>
                </div>

                <div className="divider"></div>
                <div className="section-title">🔐 Create Your Account</div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full">
                  <div className="form-hint" style={{ fontSize: '12px', color: 'var(--muted-dark)', lineHeight: '1.6', marginTop: '12px' }}>
                    ✅ By registering, you agree to our Terms & Conditions and Privacy Policy. Your account will be reviewed and activated within 24 hours.
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading"></span> Registering...
                  </>
                ) : (
                  '🚀 Register My Business'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <div className="card-title" style={{ marginBottom: '12px' }}>Business Registered!</div>
            <p style={{ color: 'var(--muted-dark)', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
              Welcome to SkillNux! Your business account has been created successfully.<br /><br />
              Our team will verify your details and activate your account within <strong style={{ color: 'var(--cyan)' }}>24 hours</strong>. You will receive a WhatsApp confirmation.
            </p>
            <div style={{ background: 'rgba(0,201,200,0.08)', border: '1px solid rgba(0,201,200,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: 'var(--muted-dark)' }}>
              📱 Keep an eye on your WhatsApp — we'll notify you once your account is active!
            </div>
            <Link to="/" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>← Back to Home</Link>
          </div>
        )}
      </main>
    </div>
  );
}
