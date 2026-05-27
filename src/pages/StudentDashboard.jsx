import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BackgroundVideo from '../components/BackgroundVideo';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Modals
  const [modalOpen, setModalOpen] = useState(null); // 'editProfile', 'addWork', 'changePassword'

  // Portfolio items
  const [portfolio, setPortfolio] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('🎨');
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [workCat, setWorkCat] = useState('Design');

  // Supabase states
  const [liveProjects, setLiveProjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Settings states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editCourse, setEditCourse] = useState('B.Tech');
  const [editUpi, setEditUpi] = useState('');
  const [editAbout, setEditAbout] = useState('');

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  useEffect(() => {
    // Check session
    const sessionUser = localStorage.getItem('skillnux_user');
    if (!sessionUser) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(sessionUser);
    if (parsed.type !== 'student') {
      navigate('/login');
      return;
    }
    setUser(parsed);

    // Load portfolio
    try {
      const port = JSON.parse(localStorage.getItem(`portfolio_${parsed.email}`)) || [];
      setPortfolio(port);
    } catch (e) {
      setPortfolio([]);
    }

    // Prefill settings
    setEditName(parsed.name || '');
    setEditPhone(parsed.phone || '');
    setEditCollege(parsed.college || '');
    setEditCourse(parsed.course || 'B.Tech');
    setEditUpi(parsed.upi_id || '');
    setEditAbout(parsed.about || '');

    // Fetch projects and leaderboard
    fetchSupabaseData(parsed);
  }, []);

  const fetchSupabaseData = async (student) => {
    try {
      // 1. Fetch matching open projects
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('skill', student.skill)
        .order('id', { ascending: false });
      
      setLiveProjects(projData || []);

      // 2. Fetch college leaderboard (students with matching college sorted by score)
      const { data: lbData } = await supabase
        .from('students')
        .select('*')
        .eq('college', student.college)
        .order('score', { ascending: false });

      setLeaderboard(lbData || []);
    } catch (e) {
      console.error(e);
    }
  };

  const getInitials = (nameVal) => {
    if (!nameVal) return '?';
    return nameVal.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillnux_user');
    navigate('/');
  };

  // Portfolio actions
  const handleAddWork = (e) => {
    e.preventDefault();
    if (!workTitle) {
      setMsg('⚠️ Please enter a title!');
      return;
    }

    const newItem = {
      emoji: selectedEmoji,
      title: workTitle,
      desc: workDesc,
      cat: workCat
    };

    const updated = [...portfolio, newItem];
    setPortfolio(updated);
    localStorage.setItem(`portfolio_${user.email}`, JSON.stringify(updated));

    setMsg('✅ Added to portfolio!');
    setWorkTitle('');
    setWorkDesc('');
    setTimeout(() => {
      setModalOpen(null);
      setMsg('');
    }, 1200);
  };

  const handleRemoveWork = (idx) => {
    const updated = [...portfolio];
    updated.splice(idx, 1);
    setPortfolio(updated);
    localStorage.setItem(`portfolio_${user.email}`, JSON.stringify(updated));
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: editName,
          phone: editPhone,
          college: editCollege,
          course: editCourse,
          upi_id: editUpi,
          about: editAbout
        })
        .eq('email', user.email);

      if (error) {
        setErr('⚠️ Error updating profile!');
        setLoading(false);
        return;
      }

      // Update session
      const updatedUser = {
        ...user,
        name: editName,
        phone: editPhone,
        college: editCollege,
        course: editCourse,
        upi_id: editUpi,
        about: editAbout
      };
      setUser(updatedUser);
      localStorage.setItem('skillnux_user', JSON.stringify(updatedUser));

      setMsg('✅ Profile updated successfully!');
      setTimeout(() => {
        setModalOpen(null);
        setMsg('');
      }, 1200);
    } catch (e) {
      setErr('⚠️ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (currPass !== user.password) {
      setErr('⚠️ Current password is wrong!');
      return;
    }
    if (newPass.length < 8) {
      setErr('⚠️ Password must be 8+ characters!');
      return;
    }
    if (newPass !== confPass) {
      setErr('⚠️ Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({ password: newPass })
        .eq('email', user.email);

      if (error) {
        setErr('⚠️ Error updating password!');
        setLoading(false);
        return;
      }

      const updatedUser = { ...user, password: newPass };
      setUser(updatedUser);
      localStorage.setItem('skillnux_user', JSON.stringify(updatedUser));

      setMsg('✅ Password updated successfully!');
      setCurrPass('');
      setNewPass('');
      setConfPass('');
      setTimeout(() => {
        setModalOpen(null);
        setMsg('');
      }, 1200);
    } catch (e) {
      setErr('⚠️ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      projects: 'My Projects',
      portfolio: 'Portfolio',
      earnings: 'Earnings',
      badges: 'Badges',
      leaderboard: 'Leaderboard',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Dashboard';
  };

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <BackgroundVideo skill={user.skill} />
      
      {/* Mobile Hamburger Button */}
      <button className="hamburger-btn" id="hamBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-c"><span>SN</span></div>
          <span className="logo-n">Skill<em>Nux</em></span>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div className="user-name">{user.name}</div>
          <div className="user-skill">{user.skill}</div>
          <div className="user-badge">{user.badge || '🏅 Beginner'}</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏠</span> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}>
            <span className="nav-icon">📋</span> My Projects
          </button>
          <button className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => { setActiveTab('portfolio'); setSidebarOpen(false); }}>
            <span className="nav-icon">💼</span> Portfolio
          </button>
          <button className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('earnings'); setSidebarOpen(false); }}>
            <span className="nav-icon">💰</span> Earnings
          </button>

          <div className="nav-section">Profile</div>
          <button className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => { setActiveTab('badges'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏅</span> Badges
          </button>
          <button className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setActiveTab('leaderboard'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏆</span> Leaderboard
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <span className="nav-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" style={{ color: 'var(--pink)', width: '100%' }} onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* MAIN MAIN MAIN */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>{getPageTitle()}</h2>
            <p>Welcome back, {user.name ? user.name.split(' ')[0] : 'Student'}! 👋</p>
          </div>
          <div className="topbar-right">
            <div className="notif-btn">🔔<div className="notif-dot"></div></div>
            <button className="btn-primary" onClick={() => navigate('/')}>← Home</button>
          </div>
        </div>

        {/* Dashboard Pages */}
        <div className="dashboard-container">
          
          {/* 1. DASHBOARD PAGE */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-value">{liveProjects.length}</div>
                  <div className="stat-label">Matching Projects</div>
                  <div className="stat-change">↑ Live feed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{user.earnings || 0}</div>
                  <div className="stat-label">Total Earned</div>
                  <div className="stat-change">Keep going!</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{user.score || 0}/5</div>
                  <div className="stat-label">Skill Quiz Score</div>
                  <div className="stat-change">Verified!</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{user.streak || 0}</div>
                  <div className="stat-label">Day Streak</div>
                  <div className="stat-change">Keep it up!</div>
                </div>
              </div>

              {/* Main Dash Grid */}
              <div className="dash-grid">
                <div>
                  {/* Matching Projects */}
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">📋 Live Projects For You</div>
                      <button className="see-all" onClick={() => setActiveTab('projects')}>See all ({liveProjects.length}) →</button>
                    </div>
                    {liveProjects.length > 0 ? (
                      liveProjects.slice(0, 3).map((p) => (
                        <div className="project-item" key={p.id}>
                          <div className="proj-icon">💻</div>
                          <div className="proj-info">
                            <div className="proj-name">{p.title}</div>
                            <div className="proj-meta">{p.skill} • Budget: ₹{p.budget || 'Open'}</div>
                          </div>
                          <div className="proj-right">
                            <div className={`proj-status ${p.status === 'open' ? 'status-new' : 'status-active'}`}>
                              {p.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="project-item">
                        <div className="proj-icon">📋</div>
                        <div className="proj-info">
                          <div className="proj-name">No open projects for {user.skill} yet</div>
                          <div className="proj-meta">We notify you automatically once a matching gig drops!</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Portfolio */}
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">💼 Portfolio Preview</div>
                      <button className="see-all" onClick={() => setActiveTab('portfolio')}>Manage →</button>
                    </div>
                    <div className="portfolio-grid">
                      {portfolio.slice(0, 5).map((item, idx) => (
                        <div className="port-item" key={idx} title={item.title}>
                          <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                          <span>{item.title.substring(0, 10)}</span>
                        </div>
                      ))}
                      <div className="port-item port-add" onClick={() => setModalOpen('addWork')}>
                        +<span style={{ fontSize: '10px' }}>Add</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Profile Showcase Card */}
                  <div className="profile-card">
                    <div className="profile-banner"></div>
                    <div className="profile-body">
                      <div className="profile-av">{initials}</div>
                      <div className="profile-name">{user.name}</div>
                      <div className="profile-skill">{user.skill}</div>
                      <div className="profile-stats">
                        <div className="ps-item">
                          <div className="ps-val">{user.score || 0}/5</div>
                          <div className="ps-lab">Quiz Score</div>
                        </div>
                        <div className="ps-item">
                          <div className="ps-val">{user.level || 'Beginner'}</div>
                          <div className="ps-lab">Level</div>
                        </div>
                      </div>
                      <button className="btn-primary" style={{ width: '100%', fontSize: '12px' }} onClick={() => setModalOpen('editProfile')}>
                        ✏️ Edit Profile Details
                      </button>
                    </div>
                  </div>

                  {/* Leaderboard Preview */}
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">🏆 Leaderboard</div>
                      <button className="see-all" onClick={() => setActiveTab('leaderboard')}>Full →</button>
                    </div>
                    <div style={{ padding: '12px 0' }}>
                      {leaderboard.slice(0, 3).map((item, idx) => (
                        <div className={`lb-item ${item.email === user.email ? 'lb-me' : ''}`} key={idx}>
                          <div className="lb-rank">{idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : idx + 1))}</div>
                          <div className="lb-av" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}>
                            {getInitials(item.name)}
                          </div>
                          <div className="lb-info">
                            <div className="lb-name">{item.name}</div>
                            <div className="lb-skill">{item.skill}</div>
                          </div>
                          <div className="lb-score">{item.score || 0}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MY PROJECTS PAGE */}
          {activeTab === 'projects' && (
            <div className="section-card">
              <div className="section-head">
                <div className="section-title">📋 Matching Open Projects ({liveProjects.length})</div>
              </div>
              {liveProjects.length > 0 ? (
                liveProjects.map((p) => (
                  <div className="project-item" key={p.id}>
                    <div className="proj-icon">💻</div>
                    <div className="proj-info">
                      <div className="proj-name">{p.title}</div>
                      <div className="proj-meta">{p.skill} • Budget: ₹{p.budget} • Status: {p.status}</div>
                    </div>
                    <div className="proj-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => alert(`🎉 Great choice! Direct application notifications sent to hiring manager.`)} className="btn-primary btn-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">No projects yet</div>
                  <div className="empty-sub">We will update this list automatically when a business posts a project for {user.skill}!</div>
                </div>
              )}
            </div>
          )}

          {/* 3. PORTFOLIO PAGE */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="section-card">
                <div className="section-head">
                  <div className="section-title">💼 My Active Portfolio ({portfolio.length})</div>
                  <button className="btn-primary btn-sm" onClick={() => setModalOpen('addWork')}>+ Add Work</button>
                </div>
                <div className="portfolio-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {portfolio.map((item, idx) => (
                    <div className="port-item" key={idx} style={{ flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-dark)' }}>{item.title}</span>
                      <span style={{ fontSize: '10px', color: 'var(--muted-dark)' }}>{item.cat}</span>
                      <button className="see-all" style={{ color: 'var(--pink)', marginTop: '4px' }} onClick={() => handleRemoveWork(idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="port-item port-add" onClick={() => setModalOpen('addWork')}>
                    +<span>Add Work</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. EARNINGS PAGE */}
          {activeTab === 'earnings' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{user.earnings || 0}</div>
                  <div className="stat-label">Total Earned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-value">₹0</div>
                  <div className="stat-label">This Month</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">₹0</div>
                  <div className="stat-label">Pending Escrow</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">0</div>
                  <div className="stat-label">Gigs Completed</div>
                </div>
              </div>

              <div className="section-card">
                <div className="section-head">
                  <div className="section-title">💰 Earnings & Payout History</div>
                </div>
                <div className="empty-state">
                  <div className="empty-icon">💸</div>
                  <div className="empty-title">No earnings yet</div>
                  <div className="empty-sub">Deliver your first gig matching your skills and receive direct payouts securely!</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. BADGES PAGE */}
          {activeTab === 'badges' && (
            <div>
              <div className="section-card">
                <div className="section-head"><div class="section-title">🏅 My Verified Badges</div></div>
                <div style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div className="badge-item badge-verified">✅ Skill Verified</div>
                  {user.badge && user.badge.includes('Expert') && <div className="badge-item badge-expert">🥇 Expert</div>}
                  {user.badge && user.badge.includes('Advanced') && <div className="badge-item badge-verified">🥈 Advanced</div>}
                  {user.badge && user.badge.includes('Intermediate') && <div className="badge-item badge-verified">🥉 Intermediate</div>}
                  <div className="badge-item badge-rising">🔥 New Member</div>
                </div>
              </div>

              <div className="section-card" style={{ marginTop: '20px' }}>
                <div className="section-head"><div className="section-title">🎯 Future Milestones</div></div>
                <div style={{ padding: '16px 20px' }}>
                  <div className="project-item" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="proj-icon">⭐</div>
                    <div className="proj-info">
                      <div className="proj-name">Rising Star</div>
                      <div className="proj-meta">Complete 5 client projects</div>
                    </div>
                    <div className="proj-status" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-dark)' }}>
                      0/5
                    </div>
                  </div>
                  <div className="project-item" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="proj-icon">💎</div>
                    <div className="proj-info">
                      <div className="proj-name">Verified Pro</div>
                      <div className="proj-meta">Complete 10 client projects</div>
                    </div>
                    <div className="proj-status" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-dark)' }}>
                      0/10
                    </div>
                  </div>
                  <div className="project-item" style={{ padding: '12px 0' }}>
                    <div className="proj-icon">💰</div>
                    <div className="proj-info">
                      <div className="proj-name">Top Earner Badge</div>
                      <div className="proj-meta">Cross ₹10,000 in total dashboard earnings</div>
                    </div>
                    <div className="proj-status" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-dark)' }}>
                      ₹0/₹10K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. LEADERBOARD PAGE */}
          {activeTab === 'leaderboard' && (
            <div className="section-card">
              <div className="section-head">
                <div className="section-title">🏆 Campus Champion Leaderboard — {user.college || 'My College'}</div>
              </div>
              <div style={{ padding: '12px 0' }}>
                {leaderboard.map((item, idx) => (
                  <div className={`lb-item ${item.email === user.email ? 'lb-me' : ''}`} key={idx}>
                    <div className="lb-rank">{idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : idx + 1))}</div>
                    <div className="lb-av" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}>
                      {getInitials(item.name)}
                    </div>
                    <div className="lb-info">
                      <div className="lb-name">{item.name}</div>
                      <div className="lb-skill">{item.skill}</div>
                    </div>
                    <div className="lb-score">{item.score || 0} points</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div>
              <div className="section-card">
                <div className="section-head"><div className="section-title">⚙️ Manage Account</div></div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => setModalOpen('editProfile')}>
                    ✏️ Edit Profile Profile Details
                  </button>
                  <button className="btn-ghost" style={{ width: 'fit-content' }} onClick={() => setModalOpen('changePassword')}>
                    🔑 Change Password Security
                  </button>
                  <button className="btn-ghost" style={{ width: 'fit-content', color: 'var(--pink)', borderColor: 'rgba(255,45,120,0.3)' }} onClick={handleLogout}>
                    🚪 Logout Session
                  </button>
                </div>
              </div>

              <div className="section-card" style={{ marginTop: '20px' }}>
                <div className="section-head"><div className="section-title">💰 UPI Payment Details</div></div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '14px', color: 'var(--muted-dark)', marginBottom: '12px' }}>This is where approved project earnings are disbursed:</p>
                  <div style={{ padding: '12px 16px', background: 'var(--card-dark2)', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--cyan)' }}>
                    {user.upi_id || 'Not Set'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <div className={`modal-overlay ${modalOpen === 'editProfile' ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-title">
            ✏️ Edit Profile Details
            <button className="modal-close" onClick={() => setModalOpen(null)}>✕</button>
          </div>
          {msg && <div className="alert alert-success show">{msg}</div>}
          {err && <div className="alert alert-error show">{err}</div>}
          
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>College Name</label>
              <input type="text" value={editCollege} onChange={(e) => setEditCollege(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Course</label>
              <select value={editCourse} onChange={(e) => setEditCourse(e.target.value)} required>
                <option>B.Tech</option>
                <option>BCA</option>
                <option>BBA</option>
                <option>B.Com</option>
                <option>B.Sc</option>
                <option>MBA</option>
                <option>MCA</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" value={editUpi} onChange={(e) => setEditUpi(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>About Me</label>
              <textarea value={editAbout} onChange={(e) => setEditAbout(e.target.value)} placeholder="Introduce yourself to brands..."></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* ADD WORK MODAL */}
      <div className={`modal-overlay ${modalOpen === 'addWork' ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-title">
            💼 Add Portfolio Work
            <button className="modal-close" onClick={() => setModalOpen(null)}>✕</button>
          </div>
          {msg && <div className="alert alert-success show">{msg}</div>}
          
          <form onSubmit={handleAddWork}>
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" placeholder="e.g. Redesigned Landing Page" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your design decisions, tools, and outcomes..." value={workDesc} onChange={(e) => setWorkDesc(e.target.value)}></textarea>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={workCat} onChange={(e) => setWorkCat(e.target.value)}>
                <option>Design</option>
                <option>Marketing</option>
                <option>Development</option>
                <option>Writing</option>
                <option>Video</option>
                <option>AI</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Choose Showcase Icon</label>
              <div className="port-emoji-grid">
                {['🎨', '📱', '🎬', '📊', '✍️', '🤖', '💻', '📣', '🎯', '🖼️', '📝', '🔧'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`emoji-btn ${selectedEmoji === emoji ? 'selected' : ''}`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              + Add to Portfolio
            </button>
          </form>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <div className={`modal-overlay ${modalOpen === 'changePassword' ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-title">
            🔑 Change Password Security
            <button className="modal-close" onClick={() => setModalOpen(null)}>✕</button>
          </div>
          {msg && <div className="alert alert-success show">{msg}</div>}
          {err && <div className="alert alert-error show">{err}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={currPass} onChange={(e) => setCurrPass(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Min 8 characters" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Re-enter password" value={confPass} onChange={(e) => setConfPass(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Updating...' : '🔑 Update Password'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
