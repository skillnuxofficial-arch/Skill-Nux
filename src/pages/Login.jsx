import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [succ, setSucc] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    setSucc('');

    if (!email || !password) {
      setErr('⚠️ Please enter email and password!');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'student') {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('email', email.trim())
          .eq('password', password)
          .single();

        if (error || !data) {
          setErr('⚠️ Invalid email or password!');
          setLoading(false);
          return;
        }

        // Save session
        localStorage.setItem('skillnux_user', JSON.stringify({ type: 'student', ...data }));
        setSucc('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard/student');
        }, 1500);

      } else {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('email', email.trim())
          .eq('password', password)
          .single();

        if (error || !data) {
          setErr('⚠️ Invalid email or password!');
          setLoading(false);
          return;
        }

        // Save session
        localStorage.setItem('skillnux_user', JSON.stringify({ type: 'business', ...data }));
        setSucc('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard/business');
        }, 1500);
      }
    } catch (e) {
      setErr('⚠️ Something went wrong. Try again!');
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
        <Link className="btn-ghost" to="/">← Home</Link>
      </nav>

      {/* Main Login Form */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 6% 60px' }}>
        <div className="login-wrap">
          {/* Tabs Toggle */}
          <div className="toggle-wrap">
            <button
              className={`toggle-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => { setActiveTab('student'); setErr(''); setSucc(''); }}
            >
              🎓 Student Login
            </button>
            <button
              className={`toggle-btn ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => { setActiveTab('business'); setErr(''); setSucc(''); }}
            >
              🏢 Business Login
            </button>
          </div>

          {/* Form Card */}
          <div className="card">
            <div className="card-title">
              {activeTab === 'student' ? 'Welcome Back! 👋' : 'Business Login 🏢'}
            </div>
            <div className="card-sub">
              {activeTab === 'student' ? 'Login to your student account' : 'Login to your business account'}
            </div>

            {err && <div className="alert alert-error show">{err}</div>}
            {succ && <div className="alert alert-success show">{succ}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>{activeTab === 'student' ? 'Email' : 'Business Email'}</label>
                <input
                  type="email"
                  placeholder={activeTab === 'student' ? 'your@email.com' : 'business@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading"></span> Logging in...
                  </>
                ) : (
                  activeTab === 'student' ? 'Login as Student →' : 'Login as Business →'
                )}
              </button>
            </form>

            <div className="bottom-link" style={{ marginTop: '20px' }}>
              {activeTab === 'student' ? (
                <>
                  New student? <Link to="/register/student">Register here</Link>
                </>
              ) : (
                <>
                  New business? <Link to="/register/business">Register here</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
