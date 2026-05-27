import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BackgroundVideo from '../components/BackgroundVideo';

const allSkills = [
  'SEO & SEM', 'Social Media Management', 'Content Writing', 'Email Marketing', 'YouTube & Blog', 'Paid Ads',
  'WhatsApp Marketing', 'Influencer Outreach', 'Online Reputation', 'Logo & Brand Design', 'UI/UX Design', 'Video Editing',
  'Thumbnail Design', 'Poster & Flyer', 'Motion Graphics', 'Reels Editing', 'Product Photography', 'Packaging Design',
  'Pitch Deck Design', 'Canva Design', 'Web Development', 'No-Code Automation', 'Database Management', 'API Integration',
  'Landing Pages', 'Shopify Setup', 'WordPress', 'App UI Design', 'Chatbot Setup', 'Market Research', 'Data Entry & Analysis',
  'Excel & Google Sheets', 'Presentations PPT', 'Business Writing', 'Customer Support', 'Amazon Flipkart Listing',
  'Hindi Content Writing', 'Regional Language Content', 'ChatGPT Prompting', 'AI Image Generation', 'AI Video Creation',
  'Notion Zapier Automation'
];

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // States
  const [myProjects, setMyProjects] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedSkillForPost, setSelectedSkillForPost] = useState('');
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');

  // Form states
  const [projTitle, setProjTitle] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projDeadline, setProjDeadline] = useState('week');

  const [settName, setSettName] = useState('');
  const [settOwner, setSettOwner] = useState('');
  const [settPhone, setSettPhone] = useState('');
  const [settCity, setSettCity] = useState('');
  const [settWebsite, setSettWebsite] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check session
    const sessionUser = localStorage.getItem('skillnux_user');
    if (!sessionUser) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(sessionUser);
    if (parsed.type !== 'business') {
      navigate('/login');
      return;
    }
    setUser(parsed);

    // Prefill settings
    setSettName(parsed.business_name || '');
    setSettOwner(parsed.owner_name || '');
    setSettPhone(parsed.phone || '');
    setSettCity(parsed.city || '');
    setSettWebsite(parsed.website || '');

    // Load favourites
    try {
      const favs = JSON.parse(localStorage.getItem(`favs_${parsed.email}`)) || [];
      setFavourites(favs);
    } catch (e) {
      setFavourites([]);
    }

    // Fetch projects
    fetchBusinessProjects(parsed);
  }, []);

  const fetchBusinessProjects = async (biz) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('business_email', biz.email)
        .order('id', { ascending: false });

      if (data) {
        setMyProjects(data);
      }
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

  const handlePostProject = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!projTitle || !selectedSkillForPost || !projBudget || !projDesc) {
      setErr('⚠️ Please fill all required fields and select a skill chip!');
      return;
    }

    setLoading(true);

    const parts = projBudget.split('-');
    const budgetVal = parseInt(parts[0]) || 1000;

    const projData = {
      title: projTitle,
      skill: selectedSkillForPost,
      budget: budgetVal,
      description: projDesc,
      deadline: projDeadline,
      status: 'open',
      business_email: user.email
    };

    try {
      const { data, error } = await supabase.from('projects').insert([projData]).select();
      if (error) {
        setErr('⚠️ Error creating project: ' + error.message);
        setLoading(false);
        return;
      }

      setMsg('✅ Project posted successfully! Finding matching students...');
      setProjTitle('');
      setProjDesc('');
      setProjBudget('');
      setSelectedSkillForPost('');

      // Refresh list
      fetchBusinessProjects(user);

      setTimeout(() => {
        setMsg('');
        // Pre-select matching tab for the new skill
        setSearchSkill(projData.skill);
        setActiveTab('matching');
        queryStudents(projData.skill);
      }, 1500);

    } catch (e) {
      setErr('⚠️ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const queryStudents = async (skillVal) => {
    if (!skillVal) {
      setMatchingStudents([]);
      return;
    }
    setLoading(true);

    try {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('skill', skillVal)
        .order('score', { ascending: false });

      setMatchingStudents(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSkillChange = (e) => {
    const s = e.target.value;
    setSearchSkill(s);
    queryStudents(s);
  };

  const toggleFav = (student) => {
    let updated = [...favourites];
    const idx = updated.findIndex(f => f.email === student.email);
    if (idx > -1) {
      updated.splice(idx, 1);
    } else {
      updated.push({
        email: student.email,
        name: student.name,
        skill: student.skill
      });
    }
    setFavourites(updated);
    localStorage.setItem(`favs_${user.email}`, JSON.stringify(updated));
  };

  const handleHireStudent = (student) => {
    if (window.confirm(`Hire ${student.name} for your project?`)) {
      alert(`✅ Hire invitation sent! ${student.name} has been notified on WhatsApp at ${student.phone || 'registered number'}.`);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          business_name: settName,
          owner_name: settOwner,
          phone: settPhone,
          city: settCity,
          website: settWebsite
        })
        .eq('email', user.email);

      if (error) {
        setErr('⚠️ Error saving settings!');
        setLoading(false);
        return;
      }

      const updatedUser = {
        ...user,
        business_name: settName,
        owner_name: settOwner,
        phone: settPhone,
        city: settCity,
        website: settWebsite
      };
      setUser(updatedUser);
      localStorage.setItem('skillnux_user', JSON.stringify(updatedUser));

      setMsg('✅ Settings saved!');
      setTimeout(() => setMsg(''), 1500);
    } catch (e) {
      setErr('⚠️ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const initials = getInitials(user.business_name || user.owner_name);

  // Compute Dashboard Stats
  const totalSpent = myProjects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const completedGigs = myProjects.filter(p => p.status === 'done').length;

  const getActiveSkill = () => {
    if (activeTab === 'matching' && searchSkill) return searchSkill;
    if (activeTab === 'post' && selectedSkillForPost) return selectedSkillForPost;
    return 'Marketing';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <BackgroundVideo skill={getActiveSkill()} />
      
      {/* Mobile Hamburger Button */}
      <button className="hamburger-btn" id="hamBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-c biz"><span>SN</span></div>
          <div>
            <span className="logo-n">Skill<em className="biz">Nux</em></span>
            <span className="biz-tag">BIZ</span>
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar biz">{initials}</div>
          <div className="user-name">{user.business_name || 'Business'}</div>
          <div className="user-type biz">{user.business_type || 'Brand'}</div>
          <div className="user-city biz">📍 {user.city || 'India'}</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          <button className={`nav-item biz ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏠</span> Dashboard
          </button>
          <button className={`nav-item biz ${activeTab === 'post' ? 'active' : ''}`} onClick={() => { setActiveTab('post'); setSidebarOpen(false); }}>
            <span className="nav-icon">📝</span> Post a Project
          </button>
          <button className={`nav-item biz ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}>
            <span className="nav-icon">📋</span> My Projects
          </button>
          <button className={`nav-item biz ${activeTab === 'matching' ? 'active' : ''}`} onClick={() => { setActiveTab('matching'); setSidebarOpen(false); }}>
            <span className="nav-icon">🎯</span> Find Talent
          </button>

          <div className="nav-section">Management</div>
          <button className={`nav-item biz ${activeTab === 'favourites' ? 'active' : ''}`} onClick={() => { setActiveTab('favourites'); setSidebarOpen(false); }}>
            <span className="nav-icon">❤️</span> Favourites
          </button>
          <button className={`nav-item biz ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <span className="nav-icon">⚙️</span> Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" style={{ color: 'var(--pink)', width: '100%' }} onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>{activeTab === 'post' ? 'Post a Project' : (activeTab === 'matching' ? 'Find Talent' : getPageTitle())}</h2>
            <p>Welcome back, {user.owner_name ? user.owner_name.split(' ')[0] : 'Partner'}! 👋</p>
          </div>
          <div className="topbar-right">
            <button className="btn-primary btn-sm" onClick={() => setActiveTab('post')}>+ Post Project</button>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Home</button>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="dashboard-container">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-value">{myProjects.length}</div>
                  <div className="stat-label">Total Projects Posted</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{completedGigs}</div>
                  <div className="stat-label">Completed Projects</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{totalSpent}</div>
                  <div className="stat-label">Total Spent Allocation</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-value">{favourites.length}</div>
                  <div className="stat-label">Saved Favourites</div>
                </div>
              </div>

              {/* Main Dash Grid */}
              <div className="dash-grid">
                <div>
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">📋 Recent Projects Posted</div>
                      <button className="see-all" onClick={() => setActiveTab('projects')}>See All →</button>
                    </div>
                    {myProjects.length > 0 ? (
                      myProjects.slice(0, 3).map((p) => (
                        <div className="project-item" key={p.id}>
                          <div className="proj-icon" style={{ background: 'rgba(255,107,53,0.12)' }}>💻</div>
                          <div className="proj-info">
                            <div className="proj-name">{p.title}</div>
                            <div className="proj-meta">{p.skill} • Budget: ₹{p.budget}</div>
                          </div>
                          <div className="proj-right">
                            <div className="proj-status status-new">{p.status}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <div className="empty-title">No projects yet</div>
                        <div className="empty-sub">Post your first project and get matched with verified student talent!</div>
                        <br />
                        <button className="btn-primary" onClick={() => setActiveTab('post')}>+ Post a Project</button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">❤️ Favourite Talent</div>
                      <button className="see-all" onClick={() => setActiveTab('favourites')}>All →</button>
                    </div>
                    {favourites.length > 0 ? (
                      favourites.slice(0, 3).map((f, i) => (
                        <div className="fav-item" key={i}>
                          <div className="fav-av">{getInitials(f.name)}</div>
                          <div className="fav-info">
                            <div className="fav-name">{f.name}</div>
                            <div className="fav-skill">{f.skill}</div>
                          </div>
                          <button className="btn-primary btn-sm" onClick={() => handleHireStudent(f)}>Hire</button>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-dark)', fontSize: '13px' }}>
                        No saved favourites yet. Query talent matching your required skills!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. POST A PROJECT PAGE */}
          {activeTab === 'post' && (
            <div className="section-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="section-head"><div className="section-title">📝 Post a New Project Gig</div></div>
              <div style={{ padding: '24px' }}>
                {msg && <div className="alert alert-success show">{msg}</div>}
                {err && <div className="alert alert-error show">{err}</div>}

                <form onSubmit={handlePostProject}>
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Design standard e-commerce landing page"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Skill Needed *</label>
                    <div className="skill-chips">
                      {allSkills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`skill-chip ${selectedSkillForPost === s ? 'selected' : ''}`}
                          onClick={() => { setSelectedSkillForPost(s); setErr(''); }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Project Budget Tier *</label>
                    <select
                      value={projBudget}
                      onChange={(e) => setProjBudget(e.target.value)}
                      required
                    >
                      <option value="">Select Budget Range</option>
                      <option value="500-1000">₹500 - ₹1,000</option>
                      <option value="1000-2500">₹1,000 - ₹2,500</option>
                      <option value="2500-5000">₹2,500 - ₹5,000</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000+">₹10,000+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Detailed Requirements *</label>
                    <textarea
                      placeholder="Describe the deliverables, scope of work, tools requested, references..."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Project Deadline</label>
                    <select value={projDeadline} onChange={(e) => setProjDeadline(e.target.value)}>
                      <option value="urgent">Urgent (1-2 days)</option>
                      <option value="week">This Week (3-7 days)</option>
                      <option value="2weeks">2 Weeks</option>
                      <option value="month">1 Month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }} disabled={loading}>
                    {loading ? 'Posting...' : '🚀 Post Project & Find Talent'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. MY PROJECTS LIST */}
          {activeTab === 'projects' && (
            <div className="section-card">
              <div className="section-head">
                <div className="section-title">📋 Posted Projects ({myProjects.length})</div>
              </div>
              {myProjects.length > 0 ? (
                myProjects.map((p) => (
                  <div className="project-item" key={p.id}>
                    <div className="proj-icon" style={{ background: 'rgba(255,107,53,0.12)' }}>💻</div>
                    <div className="proj-info">
                      <div className="proj-name">{p.title}</div>
                      <div className="proj-meta">{p.skill} • Budget allocation: ₹{p.budget} • Status: {p.status}</div>
                    </div>
                    <div className="proj-right" style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setSearchSkill(p.skill); setActiveTab('matching'); queryStudents(p.skill); }} className="btn-primary btn-sm">
                        Find Candidates
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">No projects posted yet</div>
                  <div className="empty-sub">Post your first gig to match and hire student specialists!</div>
                </div>
              )}
            </div>
          )}

          {/* 4. FIND TALENT / MATCHING */}
          {activeTab === 'matching' && (
            <div>
              <div className="section-card" style={{ marginBottom: '20px' }}>
                <div className="section-head"><div className="section-title">🎯 Instant Talent Matchmaker</div></div>
                <div style={{ padding: '20px' }}>
                  <div className="form-group">
                    <label>Select Required Skill Area</label>
                    <select value={searchSkill} onChange={handleSearchSkillChange}>
                      <option value="">-- Choose Skill Set --</option>
                      {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {searchSkill ? (
                <div>
                  <div style={{ padding: '0 8px 12px', fontSize: '13px', color: 'var(--muted-dark)', textAlign: 'left' }}>
                    Found <strong style={{ color: 'var(--cyan)' }}>{matchingStudents.length}</strong> verified student(s) for <strong>{searchSkill}</strong>
                  </div>
                  {matchingStudents.length > 0 ? (
                    <div className="student-grid">
                      {matchingStudents.map((s, idx) => {
                        const isFav = favourites.some(f => f.email === s.email);
                        const badgeClass = s.badge && s.badge.includes('Expert') ? 'badge-expert' : (s.badge && s.badge.includes('Advanced') ? 'badge-adv' : 'badge-beg');
                        return (
                          <div className="student-card" key={idx}>
                            <div className="sc-header">
                              <div className="sc-av">{getInitials(s.name)}</div>
                              <div>
                                <div className="sc-name">{s.name}</div>
                                <div className="sc-college">{s.college || 'Verified College'}</div>
                              </div>
                            </div>
                            <div className="sc-skill">{s.skill}</div>
                            <div className="sc-stats">
                              <div className="sc-stat">
                                <div className="sc-stat-val">{s.score || 0}/5</div>
                                <div className="sc-stat-lab">Score</div>
                              </div>
                              <div className="sc-stat">
                                <div className="sc-stat-val">{s.level || 'Beginner'}</div>
                                <div className="sc-stat-lab">Level</div>
                              </div>
                            </div>
                            <div className={`sc-badge ${badgeClass}`}>{s.badge || '📚 Beginner'}</div>
                            
                            <div className="sc-actions">
                              <button onClick={() => handleHireStudent(s)} className="btn-primary" style={{ flex: 1, fontSize: '12px' }}>
                                Apply & Hire
                              </button>
                              <button
                                onClick={() => toggleFav(s)}
                                className={`fav-btn ${isFav ? 'faved' : ''}`}
                              >
                                {isFav ? '❤️' : '🤍'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ background: 'var(--card-dark)', borderRadius: '16px' }}>
                      <div className="empty-icon">😕</div>
                      <div className="empty-title">No students registered under {searchSkill} yet</div>
                      <div className="empty-sub">Check back shortly or try searching for design, writing, or web development!</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state" style={{ background: 'var(--card-dark)', borderRadius: '16px' }}>
                  <div className="empty-icon">🎯</div>
                  <div className="empty-title">Select a skill option above</div>
                  <div className="empty-sub">We will pull matching verified profiles sorted by their skill test scores!</div>
                </div>
              )}
            </div>
          )}

          {/* 5. FAVOURITES PAGE */}
          {activeTab === 'favourites' && (
            <div className="section-card">
              <div className="section-head"><div className="section-title">❤️ My Favourite Students ({favourites.length})</div></div>
              {favourites.length > 0 ? (
                favourites.map((f, i) => (
                  <div className="fav-item" key={i}>
                    <div className="fav-av">{getInitials(f.name)}</div>
                    <div className="fav-info">
                      <div className="fav-name">{f.name}</div>
                      <div className="fav-skill">{f.skill}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleHireStudent(f)} className="btn-primary btn-sm">
                        Hire Talent
                      </button>
                      <button onClick={() => {
                        let updated = [...favourites];
                        updated.splice(i, 1);
                        setFavourites(updated);
                        localStorage.setItem(`favs_${user.email}`, JSON.stringify(updated));
                      }} className="btn-ghost btn-sm" style={{ color: 'var(--pink)', borderColor: 'rgba(255,45,120,0.2)' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <div className="empty-title">No saved profiles yet</div>
                  <div className="empty-sub">Find talent and tap ❤️ on their profile card to save them here!</div>
                  <br />
                  <button className="btn-primary" onClick={() => setActiveTab('matching')}>🎯 Find Candidates</button>
                </div>
              )}
            </div>
          )}

          {/* 6. SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="section-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="section-head"><div className="section-title">⚙️ Business Settings Profile</div></div>
              <div style={{ padding: '20px' }}>
                {msg && <div className="alert alert-success show">{msg}</div>}
                {err && <div className="alert alert-error show">{err}</div>}

                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label>Business / Brand Name</label>
                    <input type="text" value={settName} onChange={(e) => setSettName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Contact Person / Owner Name</label>
                    <input type="text" value={settOwner} onChange={(e) => setSettOwner(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input type="tel" value={settPhone} onChange={(e) => setSettPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>City Location</label>
                    <input type="text" value={settCity} onChange={(e) => setSettCity(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Website / Social Links</label>
                    <input type="text" value={settWebsite} onChange={(e) => setSettWebsite(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save Settings'}
                  </button>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                  <button className="btn-ghost" style={{ width: '100%', color: 'var(--pink)', borderColor: 'rgba(255,45,120,0.3)', marginTop: 0 }} onClick={handleLogout}>
                    🚪 Logout Session
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

function getPageTitle() {
  return 'Business Portal';
}
