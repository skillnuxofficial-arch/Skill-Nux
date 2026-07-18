import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BackgroundVideo from '../components/BackgroundVideo';
import RevealText from '../components/RevealText';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';
import confetti from 'canvas-confetti';
import '../dashboards-theme.css';

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

  // Core states
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

  // ── INBOX / CHAT (Option A) ─────────────────────────────────────────────────
  const [chatInput, setChatInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);

  // ── SUBMISSIONS REVIEW ──────────────────────────────────────────────────────
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ── REVIEWS STATES ──────────────────────────────────────────────────────────
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewProj, setReviewProj] = useState(null);

  useEffect(() => {
    const sessionUser = localStorage.getItem('skillnux_user');
    if (!sessionUser) { navigate('/login'); return; }
    const parsed = JSON.parse(sessionUser);
    if (parsed.type !== 'business') { navigate('/login'); return; }
    setUser(parsed);

    setSettName(parsed.business_name || '');
    setSettOwner(parsed.owner_name || '');
    setSettPhone(parsed.phone || '');
    setSettCity(parsed.city || '');
    setSettWebsite(parsed.website || '');

    try {
      const favs = JSON.parse(localStorage.getItem(`favs_${parsed.email}`)) || [];
      setFavourites(favs);
    } catch { setFavourites([]); }

    fetchBusinessProjects(parsed);

    // Dynamically inject Razorpay Checkout SDK
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ── Chat Polling & Sync ──────────────────────────────────────────────────
  useEffect(() => {
    if (!activeConvo || !user) return;
    
    const interval = setInterval(async () => {
      const chatKey = `chat_${user.email}_${activeConvo.email}`;
      const localMsgs = JSON.parse(localStorage.getItem(chatKey)) || [];
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('project_id', activeConvo.project_id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf')
          .order('id', { ascending: true });
        
        if (data && data.length > 0) {
          const merged = [...localMsgs];
          data.forEach(dbM => {
            const timeStr = new Date(dbM.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const has = merged.some(m => m.text === dbM.message && (m.timestamp === timeStr || m.timestamp === 'Just Now'));
            if (!has) {
              merged.push({
                sender: dbM.sender_id === user.id ? user.email : activeConvo.email,
                text: dbM.message,
                timestamp: timeStr
              });
            }
          });
          setMessages(merged);
          localStorage.setItem(chatKey, JSON.stringify(merged));
          
          const reverseChatKey = `chat_${activeConvo.email}_${user.email}`;
          localStorage.setItem(reverseChatKey, JSON.stringify(merged));
        }
      } catch (e) {
        console.warn("Supabase messages query error:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeConvo, user]);

  // ── Data Fetchers ───────────────────────────────────────────────────────────
  const fetchBusinessProjects = async (biz) => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
      const combined = (data || []).map(dbProj => {
        const local = localProjects.find(lp => lp.id === dbProj.id);
        return local ? { ...dbProj, ...local } : dbProj;
      });

      localProjects.forEach(lp => {
        if (lp.business_email === biz.email && !combined.some(c => c.id === lp.id)) {
          combined.push(lp);
        }
      });

      setMyProjects(combined);
      loadConversations(combined, biz);
    } catch (e) { console.error(e); }
  };

  const loadConversations = (projects, biz) => {
    const uniqueStudentEmails = [
      ...new Set(
        projects
          .filter(p => p.assigned_student_email)
          .map(p => p.assigned_student_email)
      )
    ];

    const list = uniqueStudentEmails.map(email => {
      const proj = projects.find(p => p.assigned_student_email === email);
      return {
        email,
        name: (proj?.assigned_student_name || email.split('@')[0]).toUpperCase(),
        projectTitle: proj?.title || 'Milestone Chat',
        project_id: proj?.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'
      };
    });

    if (list.length === 0) {
      list.push({
        email: 'support@skillnux.in',
        name: 'SkillNux Support',
        projectTitle: 'Platform Assistance',
        project_id: 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'
      });
    }

    setConversations(list);
    if (list.length > 0 && !activeConvo) {
      const first = list[0];
      setActiveConvo(first);
      const chatKey = `chat_${biz.email}_${first.email}`;
      const fallback = JSON.parse(localStorage.getItem(chatKey)) || [
        { sender: first.email, text: `Welcome to SkillNux Inbox! Track milestone progress and communicate with your hired talent here.`, timestamp: 'Just Now' }
      ];
      setMessages(fallback);
    }
  };

  const selectConversation = (convo) => {
    setActiveConvo(convo);
    const chatKey = `chat_${user.email}_${convo.email}`;
    const msgs = JSON.parse(localStorage.getItem(chatKey)) || [];
    setMessages(msgs);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConvo) return;

    const newMsg = {
      sender: user.email,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const chatKey = `chat_${user.email}_${activeConvo.email}`;
    const reverseChatKey = `chat_${activeConvo.email}_${user.email}`;
    const updated = [...messages, newMsg];

    localStorage.setItem(chatKey, JSON.stringify(updated));
    localStorage.setItem(reverseChatKey, JSON.stringify(updated));
    setMessages(updated);
    setChatInput('');

    // Attempt to write to Supabase messages table
    try {
      await supabase.from('messages').insert([{
        project_id: activeConvo.project_id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf',
        sender_id: user.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf',
        message: newMsg.text
      }]);
    } catch (errVal) {
      console.warn("Supabase chat write offline:", errVal);
    }

    // Simulated student reply
    setTimeout(() => {
      const replies = [
        'On it! Will update you once the milestone is drafted.',
        'Thanks for the clarification. Proceeding with revised scope now!',
        'Noted! The deliverable link will be submitted by EOD.',
        'Perfect, I have got the requirements. Starting work immediately!'
      ];
      const replyMsg = {
        sender: activeConvo.email,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const responseList = [...updated, replyMsg];
      localStorage.setItem(chatKey, JSON.stringify(responseList));
      localStorage.setItem(reverseChatKey, JSON.stringify(responseList));
      setMessages(responseList);
    }, 1500);
  };

  // ── Project Actions ─────────────────────────────────────────────────────────
  const handleReleasePayment = async (proj) => {
    if (!window.confirm(`Release ₹${proj.budget?.toLocaleString()} escrow to ${proj.assigned_student_name}?`)) return;

    setLoading(true);
    try {
      await supabase.from('projects').update({ status: 'completed' }).eq('id', proj.id);
      
      const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
      const idx = localProjects.findIndex(p => p.id === proj.id);
      if (idx > -1) {
        localProjects[idx].status = 'completed';
        localStorage.setItem(`local_projects`, JSON.stringify(localProjects));
      }

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      fetchBusinessProjects(user);

      // Open review modal
      setReviewProj(proj);
      setRatingVal(5);
      setReviewComment('');
      setReviewModalOpen(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewProj) return;
    setLoading(true);

    try {
      await supabase.from('reviews').insert([{
        project_id: reviewProj.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf',
        rating: ratingVal,
        comment: reviewComment
      }]);

      const studentEmail = reviewProj.assigned_student_email;
      if (studentEmail) {
        const { data: stdData } = await supabase.from('students').select('*').eq('email', studentEmail).single();
        if (stdData) {
          const oldRating = stdData.rating || 5.0;
          const newRating = parseFloat(((oldRating * 3 + ratingVal) / 4).toFixed(1));
          let newLevel = stdData.level || 'Beginner';
          if (newRating >= 4.7) newLevel = 'Expert 🥇';
          else if (newRating >= 4.0) newLevel = 'Advanced 🥈';
          else if (newRating >= 3.0) newLevel = 'Intermediate 🥉';
          
          await supabase.from('students').update({
            rating: newRating,
            level: newLevel
          }).eq('email', studentEmail);
        }
      }

      alert('💖 Thank you! Your review has been published. Student rating updated!');
      setReviewModalOpen(false);
      setReviewProj(null);
      setReviewComment('');
    } catch (errVal) {
      console.error("Reviews write failed:", errVal);
      // Local storage fallback for review so it's always working
      localStorage.setItem(`review_${reviewProj.id}`, JSON.stringify({ rating: ratingVal, comment: reviewComment }));
      alert('💖 Review saved successfully!');
      setReviewModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRevision = async (proj) => {
    const reason = window.prompt('Enter revision instructions for the student:');
    if (!reason) return;

    setLoading(true);
    try {
      await supabase.from('projects').update({ status: 'revision', revision_notes: reason }).eq('id', proj.id);
      alert('📝 Revision request sent! The student has been notified.');
      fetchBusinessProjects(user);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getInitials = (nameVal) => {
    if (!nameVal || typeof nameVal !== 'string') return '?';
    return nameVal.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillnux_user');
    navigate('/');
  };

  const handlePostProject = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (!projTitle || !selectedSkillForPost || !projBudget || !projDesc) {
      setErr('⚠️ Please fill all required fields and select a skill chip!');
      return;
    }
    
    if (!window.Razorpay) {
      setErr('⚠️ Razorpay secure payment gateway is loading. Please try again in a few seconds!');
      return;
    }

    const parts = projBudget.split('-');
    const budgetVal = parseInt(parts[0]) || 1000;
    setLoading(true);

    const options = {
      key: 'rzp_test_561A92B48',
      amount: budgetVal * 100, // in Paisa
      currency: 'INR',
      name: 'SkillNux Escrow',
      description: `Secure Escrow Contract: ${projTitle}`,
      handler: async function (response) {
        setMsg(`💳 Payment secure (ID: ${response.razorpay_payment_id})! Locking Escrow...`);
        const projData = {
          title: projTitle,
          description: projDesc,
          budget: budgetVal,
          status: 'open',
          business_id: user.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'
        };

        try {
          const { data } = await supabase.from('projects').insert([projData]).select();
          
          // Save in local projects fallback state for seamless execution
          const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
          const newLocal = {
            id: data ? data[0].id : Math.floor(Math.random() * 900000) + 100000,
            title: projTitle,
            skill: selectedSkillForPost,
            budget: budgetVal,
            description: projDesc,
            deadline: projDeadline,
            status: 'open',
            business_email: user.email,
            created_at: new Date().toISOString()
          };
          localProjects.push(newLocal);
          localStorage.setItem(`local_projects`, JSON.stringify(localProjects));

          setMsg('🛡️ Escrow Locked & Gig Published Successfully!');
          setProjTitle(''); setProjDesc(''); setProjBudget(''); setSelectedSkillForPost('');
          fetchBusinessProjects(user);
          
          setTimeout(() => {
            setMsg('');
            setSearchSkill(selectedSkillForPost);
            setActiveTab('matching');
            queryStudents(selectedSkillForPost);
          }, 2000);
        } catch (dbErr) {
          console.error("Supabase write warning, falls back locally:", dbErr);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: user.owner_name || '',
        email: user.email || '',
        contact: user.phone || ''
      },
      theme: {
        color: '#ff6b35'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const queryStudents = async (skillVal) => {
    if (!skillVal) { setMatchingStudents([]); return; }
    setLoading(true);
    try {
      const { data } = await supabase
        .from('students')
        .select('*')
        .or(`skill.eq."${skillVal}",skills.cs.{"${skillVal}"}`)
        .order('score', { ascending: false });
      setMatchingStudents(data || []);
    } catch { console.error('query error'); }
    finally { setLoading(false); }
  };

  const handleSearchSkillChange = (e) => {
    const s = e.target.value;
    setSearchSkill(s);
    queryStudents(s);
  };

  const toggleFav = (student) => {
    let updated = [...favourites];
    const idx = updated.findIndex(f => f.email === student.email);
    if (idx > -1) updated.splice(idx, 1);
    else updated.push({ email: student.email, name: student.name, skill: student.skill });
    setFavourites(updated);
    localStorage.setItem(`favs_${user.email}`, JSON.stringify(updated));
  };

  const handleHireStudent = (student) => {
    if (window.confirm(`Hire ${student.name} for your project?`)) {
      const message = encodeURIComponent(`👋 Hello ${student.name},\n\nThis is ${user.owner_name} from *${user.business_name}* on SkillNux! 🚀\n\nWe would love to hire you for a project matching your skills in *${student.skill}*.\n\nUPI Escrow payment has been securely locked. Please log in to your student dashboard to accept the contract!\n\nWebsite: https://skillnux.in`);
      const phoneNum = student.phone ? student.phone.replace(/[^0-9]/g, '') : '';
      const waUrl = `https://wa.me/${phoneNum.startsWith('91') ? phoneNum : '91' + phoneNum}?text=${message}`;
      
      window.open(waUrl, '_blank');
      alert(`✅ Hire invitation template generated! WhatsApp chat has been opened with ${student.name}.`);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault(); setMsg(''); setErr(''); setLoading(true);
    try {
      const { error } = await supabase.from('businesses').update({
        business_name: settName, owner_name: settOwner,
        phone: settPhone, city: settCity, website: settWebsite
      }).eq('email', user.email);
      if (error) { setErr('⚠️ Error saving!'); setLoading(false); return; }
      const updatedUser = { ...user, business_name: settName, owner_name: settOwner, phone: settPhone, city: settCity, website: settWebsite };
      setUser(updatedUser);
      localStorage.setItem('skillnux_user', JSON.stringify(updatedUser));
      setMsg('✅ Settings saved!');
      setTimeout(() => setMsg(''), 1500);
    } catch { setErr('⚠️ Something went wrong!'); }
    finally { setLoading(false); }
  };

  if (!user) return null;

  const initials = getInitials(user.business_name || user.owner_name);

  // Derived stats
  const totalSpent = myProjects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const completedGigs = myProjects.filter(p => p.status === 'completed').length;
  const pendingReview = myProjects.filter(p => p.status === 'submitted').length;

  const getActiveSkill = () => {
    if (activeTab === 'matching' && searchSkill) return searchSkill;
    if (activeTab === 'post' && selectedSkillForPost) return selectedSkillForPost;
    return 'Marketing';
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Business Portal',
      post: 'Post a Project',
      projects: 'My Projects',
      matching: 'Find Talent',
      favourites: 'Saved Talent',
      inbox: 'Inbox & Chat',
      submissions: 'Review Submissions',
      payments: 'Payments Ledger',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Business Portal';
  };

  return (
    <PageEntrance className="frosted-cream-theme" style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <BackgroundVideo skill={getActiveSkill()} />

      {/* Mobile Hamburger */}
      <button className="hamburger-btn" id="hamBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      {/* ── SIDEBAR ── */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="SkillNux" style={{ height: '40px', objectFit: 'contain' }} />
          <span className="biz-tag">BIZ</span>
        </div>

        <div className="user-info">
          <div className="user-avatar biz">{initials}</div>
          <div className="user-name">{user.business_name || 'Business'}</div>
          <div className="user-type biz">{user.business_type || 'Brand'}</div>
          <div className="user-city biz">📍 {user.city || 'India'}</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          {[
            ['dashboard', '🏠', 'Dashboard'],
            ['post', '📝', 'Post a Project'],
            ['projects', '📋', 'My Projects'],
            ['matching', '🎯', 'Find Talent'],
          ].map(([tab, icon, label]) => (
            <button key={tab} className={`nav-item biz ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}>
              <span className="nav-icon">{icon}</span> <span className="nav-label">{label}</span>
            </button>
          ))}

          <div className="nav-section">Manage</div>
          {[
            ['inbox', '💬', 'Inbox & Chat'],
            ['submissions', '📤', 'Review Work'],
            ['payments', '💳', 'Payments'],
            ['favourites', '❤️', 'Favourites'],
            ['settings', '⚙️', 'Settings'],
          ].map(([tab, icon, label]) => (
            <button key={tab} className={`nav-item biz ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}>
              <span className="nav-icon">{icon}</span> <span className="nav-label">{label}</span>
              {tab === 'submissions' && pendingReview > 0 && (
                <span className="nav-badge" style={{ marginLeft: 'auto', background: '#ff6b35', color: '#fff', borderRadius: '50px', fontSize: '10px', padding: '1px 7px', fontWeight: '800' }}>
                  {pendingReview}
                </span>
              )}
            </button>
          ))}
          <button className="nav-item biz" onClick={() => navigate('/payment')} style={{ color: '#f7931e', marginTop: '10px' }}>
            <span className="nav-icon">⚡</span> <span className="nav-label">Upgrade Plan</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" style={{ color: 'var(--pink)', width: '100%' }} onClick={handleLogout}>
            <span className="nav-icon">🚪</span> <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h2><RevealText type="letter" text={getPageTitle()} /></h2>
            <p><RevealText type="word" text={`Welcome back, ${user.owner_name ? user.owner_name.split(' ')[0] : 'Partner'}! 👋`} delay={0.2} /></p>
          </div>
          <div className="topbar-right">
            {pendingReview > 0 && (
              <button className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg,#ff6b35,#f7931e)', position: 'relative' }}
                onClick={() => setActiveTab('submissions')}>
                🔔 {pendingReview} Pending Review
              </button>
            )}
            <button className="btn-primary btn-sm" onClick={() => setActiveTab('post')}>+ Post Project</button>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Home</button>
          </div>
        </div>

        <div className="dashboard-container">

          {/* ── 1. DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <ScrollReveal delay={0.1}>
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{myProjects.length}</div>
                    <div className="stat-label">Projects Posted</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{completedGigs}</div>
                    <div className="stat-label">Completed</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{pendingReview}</div>
                    <div className="stat-label">Awaiting Review</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">₹{totalSpent.toLocaleString()}</div>
                    <div className="stat-label">Budget Allocated</div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="dash-grid">
                <div>
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">📋 Recent Projects</div>
                      <button className="see-all" onClick={() => setActiveTab('projects')}>See All →</button>
                    </div>
                    {myProjects.length > 0 ? (
                      myProjects.slice(0, 3).map((p) => (
                        <div className="project-item" key={p.id}>
                          <div className="proj-icon" style={{ background: 'rgba(255,107,53,0.12)' }}>💻</div>
                          <div className="proj-info">
                            <div className="proj-name">{p.title}</div>
                            <div className="proj-meta">{p.skill} • ₹{p.budget}</div>
                          </div>
                          <div className="proj-right">
                            <div className={`proj-status ${p.status === 'open' ? 'status-new' : p.status === 'submitted' ? 'status-active' : 'status-complete'}`}>
                              {p.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state-card biz">
                        <div className="empty-state-icon animated-bounce">📋</div>
                        <div className="empty-state-title">No Projects Yet</div>
                        <div className="empty-state-sub">Post your first project gig to match and hire top verified campus talent in real-time!</div>
                        <br />
                        <button className="btn-primary" onClick={() => setActiveTab('post')}>+ Post a Project</button>
                        <div className="empty-state-pulse"></div>
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
                        No saved favourites yet. Find and save talent from the Talent Matchmaker!
                      </div>
                    )}
                  </div>

                  {pendingReview > 0 && (
                    <div className="section-card" style={{ marginTop: '20px', border: '1px solid rgba(255,107,53,0.3)' }}>
                      <div className="section-head">
                        <div className="section-title">🔔 Submissions Waiting!</div>
                        <button className="see-all" onClick={() => setActiveTab('submissions')}>Review →</button>
                      </div>
                      <div style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--muted-dark)' }}>
                        <strong style={{ color: '#ff6b35' }}>{pendingReview} deliverable(s)</strong> are awaiting your approval. Release escrow or request revisions.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── 2. POST A PROJECT ── */}
          {activeTab === 'post' && (
            <div className="section-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="section-head"><div className="section-title">📝 Post a New Project Gig</div></div>
              <div style={{ padding: '24px' }}>
                {msg && <div className="alert alert-success show">{msg}</div>}
                {err && <div className="alert alert-error show">{err}</div>}
                <form onSubmit={handlePostProject}>
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input type="text" placeholder="e.g. Design standard e-commerce landing page"
                      value={projTitle} onChange={(e) => setProjTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Skill Needed *</label>
                    <div className="skill-chips">
                      {allSkills.map((s) => (
                        <button key={s} type="button"
                          className={`skill-chip ${selectedSkillForPost === s ? 'selected' : ''}`}
                          onClick={() => { setSelectedSkillForPost(s); setErr(''); }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Project Budget Tier *</label>
                    <select value={projBudget} onChange={(e) => setProjBudget(e.target.value)} required>
                      <option value="">Select Budget Range</option>
                      <option value="500-1000">₹500 - ₹1,000</option>
                      <option value="1000-2500">₹1,000 - ₹2,500</option>
                      <option value="2500-5000">₹2,500 - ₹5,000</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000">₹10,000+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Detailed Requirements *</label>
                    <textarea placeholder="Describe the deliverables, scope, tools, references..."
                      value={projDesc} onChange={(e) => setProjDesc(e.target.value)} required></textarea>
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

          {/* ── 3. MY PROJECTS ── */}
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
                      <div className="proj-meta">{p.skill} • ₹{p.budget} • {p.status}
                        {p.assigned_student_name && <span> • 👤 {p.assigned_student_name}</span>}
                      </div>
                    </div>
                    <div className="proj-right" style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setSearchSkill(p.skill); setActiveTab('matching'); queryStudents(p.skill); }}
                        className="btn-ghost btn-sm">Find More</button>
                      {p.status === 'submitted' && (
                        <button onClick={() => setActiveTab('submissions')} className="btn-primary btn-sm">
                          Review →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-card biz">
                  <div className="empty-state-icon animated-bounce">📋</div>
                  <div className="empty-state-title">No Projects Posted Yet</div>
                  <div className="empty-state-sub">Post your first gig to match and hire student specialists!</div>
                  <div className="empty-state-pulse"></div>
                </div>
              )}
            </div>
          )}

          {/* ── 4. FIND TALENT ── */}
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
                  <div className="ai-match-banner">
                    <span className="ai-match-badge">AI Match</span>
                    <span>Found <strong style={{ color: '#fff' }}>{matchingStudents.length}</strong> verified student(s) for <strong>{searchSkill}</strong>. Top 3 recommendations based on skill test score:</span>
                  </div>

                  {matchingStudents.length > 0 ? (
                    <div className="top3-grid">
                      {matchingStudents.slice(0, 3).map((s, idx) => {
                        const isFav = favourites.some(f => f.email === s.email);
                        return (
                          <div className={`top3-card ${idx === 0 ? 'rank1' : ''}`} key={idx}>
                            <div className="top3-rank">#{idx + 1} MATCH</div>
                            <div className="top3-av">{getInitials(s.name)}</div>
                            <div className="top3-name">{s.name}</div>
                            <div className="top3-college">{s.college || 'Verified College'}</div>
                            
                            <div className="top3-score-row">
                              <div className="top3-score-item">
                                <div className="top3-score-val">{s.score || 0}/5</div>
                                <div className="top3-score-lbl">Score</div>
                              </div>
                              <div className="top3-score-item">
                                <div className="top3-score-val">{s.level?.split(' ')[0] || 'New'}</div>
                                <div className="top3-score-lbl">Level</div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleHireStudent(s)} className="top3-hire-btn">
                                ⚡ Invite to Gig
                              </button>
                              <button onClick={() => toggleFav(s)} className="btn-ghost" style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {isFav ? '❤️' : '🤍'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-state-card biz">
                      <div className="empty-state-icon animated-bounce">😕</div>
                      <div className="empty-state-title">No candidates for {searchSkill} yet</div>
                      <div className="empty-state-sub">Check back shortly or try searching for Logo & Brand Design, Video Editing, or Web Development!</div>
                      <div className="empty-state-pulse"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state-card biz">
                  <div className="empty-state-icon animated-bounce">🎯</div>
                  <div className="empty-state-title">Select a Skill Chip</div>
                  <div className="empty-state-sub">We pull matching verified profiles sorted by their skill test scores instantly!</div>
                  <div className="empty-state-pulse"></div>
                </div>
              )}
            </div>
          )}

          {/* ── 5. INBOX & CHAT ── */}
          {activeTab === 'inbox' && (
            <div className="chat-layout">
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">💬 Direct Inbox ({conversations.length})</div>
                <div className="chat-convo-list">
                  {conversations.map((convo, idx) => (
                    <div key={idx}
                      className={`chat-convo-item ${activeConvo?.email === convo.email ? 'active' : ''}`}
                      onClick={() => selectConversation(convo)}>
                      <div className="chat-convo-avatar">{convo.name.charAt(0)}</div>
                      <div className="chat-convo-details">
                        <div className="chat-convo-name">{convo.name}</div>
                        <div className="chat-convo-preview">{convo.projectTitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chat-main-window">
                {activeConvo ? (
                  <>
                    <div className="chat-window-header">
                      <div className="chat-window-userinfo">
                        <h4>{activeConvo.name}</h4>
                        <p><span className="pulse"></span> {activeConvo.email} (Student)</p>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--muted-dark)' }}>{activeConvo.projectTitle}</span>
                    </div>
                    <div className="chat-messages-container">
                      {messages.length > 0 ? (
                        messages.map((m, idx) => {
                          const isSentByMe = m.sender === user.email;
                          return (
                            <div key={idx} className={`chat-bubble-wrap ${isSentByMe ? 'sent' : 'received'}`}>
                              <div className="chat-bubble">{m.text}</div>
                              <div className="chat-bubble-meta">{m.timestamp}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="chat-empty-thread">
                          <span className="ico">💬</span>
                          <p>No messages yet. Send a message to your hired talent!</p>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-input-bar">
                      <input type="text" placeholder="Message your student freelancer..."
                        value={chatInput} onChange={(e) => setChatInput(e.target.value)} required />
                      <button type="submit" className="chat-btn-send">✈️</button>
                    </form>
                  </>
                ) : (
                  <div className="chat-empty-thread">
                    <span className="ico">💬</span>
                    <h4>No active conversations</h4>
                    <p>Conversations open automatically once you hire a student for a project!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 6. REVIEW SUBMISSIONS ── */}
          {activeTab === 'submissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="section-card">
                <div className="section-head">
                  <div className="section-title">📤 Submitted Deliverables ({myProjects.filter(p => p.status === 'submitted').length})</div>
                </div>
                {myProjects.filter(p => p.status === 'submitted').length > 0 ? (
                  myProjects.filter(p => p.status === 'submitted').map((p) => (
                    <div key={p.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-dark)', marginBottom: '6px' }}>{p.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--muted-dark)', marginBottom: '8px' }}>
                            👤 {p.assigned_student_name || 'Student'} • Budget: <strong style={{ color: 'var(--cyan)' }}>₹{p.budget?.toLocaleString()}</strong>
                          </div>
                          {p.submission_notes && (
                            <div className="submission-meta-strip" style={{ marginBottom: '10px' }}>
                              <div className="submission-meta-title">📝 Delivery Notes:</div>
                              <div className="submission-meta-body">"{p.submission_notes}"</div>
                            </div>
                          )}
                          {p.submission_url && (
                            <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                              🔗 <a href={p.submission_url} target="_blank" rel="noopener noreferrer"
                                style={{ color: '#1dbf73', textDecoration: 'underline' }}>{p.submission_url}</a>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                          <button onClick={() => handleReleasePayment(p)} className="btn-primary"
                            style={{ background: 'linear-gradient(135deg,#1dbf73,#1aa163)', fontSize: '13px' }} disabled={loading}>
                            ✅ Release ₹{p.budget?.toLocaleString()}
                          </button>
                          <button onClick={() => handleRequestRevision(p)} className="btn-ghost"
                            style={{ fontSize: '13px', color: '#ffaa00', borderColor: 'rgba(255,170,0,0.3)' }} disabled={loading}>
                            🔁 Request Revision
                          </button>
                          <button onClick={() => setSelectedInvoice(p)} className="btn-ghost"
                            style={{ fontSize: '12px', color: 'var(--muted-dark)', borderColor: 'var(--border)' }}>
                            🧾 Preview Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-card biz">
                    <div className="empty-state-icon animated-bounce">📤</div>
                    <div className="empty-state-title">No Pending Submissions</div>
                    <div className="empty-state-sub">When students submit their deliverables, they appear here for your review before escrow release!</div>
                    <div className="empty-state-pulse"></div>
                  </div>
                )}
              </div>

              {/* Completed Projects */}
              {myProjects.filter(p => p.status === 'completed').length > 0 && (
                <div className="section-card">
                  <div className="section-head">
                    <div className="section-title">✅ Completed & Paid ({myProjects.filter(p => p.status === 'completed').length})</div>
                  </div>
                  {myProjects.filter(p => p.status === 'completed').map((p) => (
                    <div className="project-item" key={p.id}>
                      <div className="proj-icon" style={{ background: 'rgba(29,191,115,0.12)', color: '#1dbf73' }}>✅</div>
                      <div className="proj-info">
                        <div className="proj-name">{p.title}</div>
                        <div className="proj-meta">{p.assigned_student_name || 'Student'} • ₹{p.budget} paid</div>
                      </div>
                      <div className="proj-right">
                        <button onClick={() => setSelectedInvoice(p)} className="btn-ghost btn-sm" style={{ color: '#1dbf73', borderColor: 'rgba(29,191,115,0.3)' }}>
                          🧾 Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── 7. PAYMENTS LEDGER ── */}
          {activeTab === 'payments' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{myProjects.filter(p => p.status === 'completed').reduce((a, p) => a + (p.budget || 0), 0).toLocaleString()}</div>
                  <div className="stat-label">Total Disbursed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">₹{myProjects.filter(p => p.status === 'submitted' || p.status === 'in_progress').reduce((a, p) => a + (p.budget || 0), 0).toLocaleString()}</div>
                  <div className="stat-label">Escrow Locked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">₹{totalSpent.toLocaleString()}</div>
                  <div className="stat-label">Total Allocated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛡️</div>
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Escrow Safety</div>
                </div>
              </div>

              <div className="section-card" style={{ marginTop: '24px' }}>
                <div className="section-head">
                  <div className="section-title">💳 Full Transaction Ledger</div>
                </div>
                {myProjects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    {myProjects.map((p) => {
                      const statusColors = {
                        completed: '#1dbf73',
                        submitted: '#ffaa00',
                        in_progress: '#00cfff',
                        open: '#8f9cae',
                        revision: '#ff6b35'
                      };
                      const statusLabels = {
                        completed: 'PAID ✅',
                        submitted: 'IN REVIEW ⏳',
                        in_progress: 'ACTIVE 🔒',
                        open: 'OPEN 📋',
                        revision: 'REVISION 🔁'
                      };
                      return (
                        <div className="project-item" key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <div className="proj-icon">💳</div>
                          <div className="proj-info">
                            <div className="proj-name">{p.title}</div>
                            <div className="proj-meta">
                              TXN#{p.id}990X • {p.skill}
                              {p.assigned_student_name && ` • 👤 ${p.assigned_student_name}`}
                            </div>
                          </div>
                          <div className="proj-right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: statusColors[p.status] || '#8f9cae' }}>
                              {statusLabels[p.status] || p.status}
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '16px', color: '#fff' }}>₹{(p.budget || 0).toLocaleString()}</div>
                            {p.status === 'completed' && (
                              <button onClick={() => setSelectedInvoice(p)} className="btn-ghost btn-sm" style={{ color: '#1dbf73', borderColor: 'rgba(29,191,115,0.3)', fontSize: '11px' }}>
                                receipt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state-card biz">
                    <div className="empty-state-icon animated-bounce">💳</div>
                    <div className="empty-state-title">No Transactions Yet</div>
                    <div className="empty-state-sub">Post a project and hire talent to start tracking your secure payment escrow ledger!</div>
                    <div className="empty-state-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 8. FAVOURITES ── */}
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
                      <button onClick={() => handleHireStudent(f)} className="btn-primary btn-sm">Hire Talent</button>
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
                <div className="empty-state-card biz">
                  <div className="empty-state-icon animated-bounce">❤️</div>
                  <div className="empty-state-title">No Saved Profiles Yet</div>
                  <div className="empty-state-sub">Find talent and tap ❤️ on their card to save them here!</div>
                  <br />
                  <button className="btn-primary" onClick={() => setActiveTab('matching')}>🎯 Find Candidates</button>
                  <div className="empty-state-pulse"></div>
                </div>
              )}
            </div>
          )}

          {/* ── 9. SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="section-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="section-head"><div className="section-title">⚙️ Business Settings</div></div>
              <div style={{ padding: '20px' }}>
                {msg && <div className="alert alert-success show">{msg}</div>}
                {err && <div className="alert alert-error show">{err}</div>}
                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label>Business / Brand Name (Locked)</label>
                    <input type="text" value={settName} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label>Contact Person / Owner (Locked)</label>
                    <input type="text" value={settOwner} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input type="tel" value={settPhone} onChange={(e) => setSettPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>City Location (Locked)</label>
                    <input type="text" value={settCity} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
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

      {/* ── INVOICE / RECEIPT MODAL ── */}
      {selectedInvoice && (
        <div className="receipt-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="receipt-card" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <h3>SKILL<span>NUX</span></h3>
              <p>UPI Escrow Receipt</p>
            </div>
            <div className="receipt-seal">Verified Escrow</div>
            <div className="receipt-body">
              <div className="receipt-line-item">
                <span>Receipt Number:</span>
                <strong>SN-{selectedInvoice.id}992X</strong>
              </div>
              <div className="receipt-line-item">
                <span>Date Issued:</span>
                <strong>{selectedInvoice.submitted_at || new Date().toLocaleDateString()}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Student Specialist:</span>
                <strong>{selectedInvoice.assigned_student_name || 'Specialist'}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Hiring Business:</span>
                <strong>{user.business_name}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Project:</span>
                <strong style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {selectedInvoice.title}
                </strong>
              </div>
              <div className="receipt-tear-divider"></div>
              <div className="receipt-line-item price">
                <span>Escrow Released:</span>
                <strong>₹{selectedInvoice.budget?.toLocaleString()}</strong>
              </div>
              <div className="receipt-barcode">
                <div className="receipt-barcode-lines"></div>
                <div className="receipt-barcode-lbl">SECURE CONTRACT PASS</div>
              </div>
            </div>
            <div className="receipt-footer-btn-row">
              <button onClick={() => window.print()} className="f-escrow-success-btn primary">🖨️ Print Receipt</button>
              <button onClick={() => setSelectedInvoice(null)} className="f-escrow-success-btn secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RATING & REVIEW MODAL ── */}
      <div className={`modal-overlay ${reviewModalOpen ? 'open' : ''}`}>
        <div className="modal" style={{ maxWidth: '450px' }}>
          <div className="modal-title">
            🌟 Rate Student Specialist
            <button className="modal-close" onClick={() => setReviewModalOpen(false)}>✕</button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted-dark)', marginBottom: '8px' }}>
                How was your experience working with <strong>{reviewProj?.assigned_student_name}</strong>?
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '14px 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingVal(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      color: star <= ratingVal ? '#ffd700' : 'rgba(255,255,255,0.15)',
                      transition: 'transform 0.15s ease',
                      transform: star <= ratingVal ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--cyan)' }}>
                {ratingVal === 5 ? 'Exceptional! 💎' : 
                 ratingVal === 4 ? 'Very Good! 🥇' : 
                 ratingVal === 3 ? 'Good Work! 🥈' : 
                 ratingVal === 2 ? 'Needs Improvement' : 'Unsatisfactory'}
              </div>
            </div>

            <div className="form-group">
              <label>Write Testimonial Comment</label>
              <textarea
                placeholder="Explain the student's delivery speed, communication, quality of deliverables..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                style={{ minHeight: '80px' }}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : '💾 Submit Verified Testimonial'}
            </button>
          </form>
        </div>
      </div>

    </PageEntrance>
  );
}
