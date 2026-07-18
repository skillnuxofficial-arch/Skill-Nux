import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BackgroundVideo from '../components/BackgroundVideo';
import RevealText from '../components/RevealText';
import confetti from 'canvas-confetti';
import '../dashboards-theme.css';
import SupportChatBox from '../components/SupportChatBox';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';

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
  const [editSkills, setEditSkills] = useState([]);

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  // Advanced Freelancing States (Option A)
  const [chatInput, setChatInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [submitModalProject, setSubmitModalProject] = useState(null);
  const [subNotes, setSubNotes] = useState('');
  const [subUrl, setSubUrl] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ── NEW FEATURE STATES ─────────────────────────────────────────────────────
  const [showCertModal, setShowCertModal] = useState(false);
  const [certType, setCertType] = useState(''); // 'projects' | 'earnings'
  const [referralCopied, setReferralCopied] = useState(false);
  const [milestoneToast, setMilestoneToast] = useState(null);
  const [xpAnimated, setXpAnimated] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  // Derived stats for earnings / badges
  const completedGigs = liveProjects.filter(p => p.assigned_student_email === user?.email && p.status === 'completed');
  const totalEarned = completedGigs.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalPending = liveProjects.filter(p => p.assigned_student_email === user?.email && p.status === 'submitted').reduce((acc, p) => acc + (p.budget || 0), 0);

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
    setEditSkills(parsed.skills || (parsed.skill ? [parsed.skill] : []));

    // Fetch projects and leaderboard
    fetchSupabaseData(parsed);

    // ── Streak Tracker ─────────────────────────────────────────────────────
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem(`streak_last_${parsed.email}`);
    const streakCount = parseInt(localStorage.getItem(`streak_count_${parsed.email}`)) || 0;
    if (lastLogin === today) {
      setStreakDays(streakCount);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastLogin === yesterday.toDateString() ? streakCount + 1 : 1;
      localStorage.setItem(`streak_last_${parsed.email}`, today);
      localStorage.setItem(`streak_count_${parsed.email}`, newStreak);
      setStreakDays(newStreak);
      if (newStreak > 1) {
        setTimeout(() => setMilestoneToast({ icon: '🔥', text: `${newStreak}-day login streak! Keep earning!` }), 2000);
        setTimeout(() => setMilestoneToast(null), 7000);
      }
    }

    // ── XP Animation trigger ───────────────────────────────────────────────
    setTimeout(() => setXpAnimated(true), 400);
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
          
          // Sync reverse key as well
          const reverseChatKey = `chat_${activeConvo.email}_${user.email}`;
          localStorage.setItem(reverseChatKey, JSON.stringify(merged));
        }
      } catch (e) {
        console.warn("Supabase messages query error:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeConvo, user]);

  const fetchSupabaseData = async (student) => {
    try {
      // 1. Fetch matching projects
      const studentSkills = student.skills && student.skills.length > 0 
        ? student.skills 
        : (student.skill ? [student.skill] : []);
      
      const { data: dbData } = await supabase
        .from('projects')
        .select('*')
        .in('skill', studentSkills)
        .order('id', { ascending: false });

      // Merge with local projects to ensure instant state sync
      const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
      const combined = (dbData || []).map(dbProj => {
        const local = localProjects.find(lp => lp.id === dbProj.id);
        return local ? { ...dbProj, ...local } : dbProj;
      });

      // Also append any local-only projects just in case
      localProjects.forEach(lp => {
        if (!combined.some(c => c.id === lp.id)) {
          combined.push(lp);
        }
      });

      setLiveProjects(combined);
      loadConversations(combined, student);

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

  const loadConversations = (projectsList, studentUser) => {
    if (!studentUser) return;
    
    // Extract unique business emails
    const uniqueBizEmails = [...new Set(projectsList.map(p => p.business_email))].filter(Boolean);
    
    const list = uniqueBizEmails.map(email => {
      const proj = projectsList.find(p => p.business_email === email);
      return {
        email: email,
        name: email.split('@')[0].toUpperCase(),
        projectTitle: proj?.title || 'Matching Milestone',
        project_id: proj?.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'
      };
    });

    // Add a default onboarding chat if empty
    if (list.length === 0) {
      list.push({
        email: 'sourcing@skillnux.in',
        name: 'Siddharth Sen (SkillNux Pro)',
        projectTitle: 'Escrow Onboarding Assistance',
        project_id: 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf'
      });
    }

    setConversations(list);
    if (list.length > 0 && !activeConvo) {
      setActiveConvo(list[0]);
      // Fetch messages for default convo
      const chatKey = `chat_${studentUser.email}_${list[0].email}`;
      const fallbackMsgs = JSON.parse(localStorage.getItem(chatKey)) || [
        { sender: list[0].email, text: `Welcome to SkillNux Inbox! Connect with clients, submit milestones, and check UPI escrow statuses in real-time.`, timestamp: 'Just Now' }
      ];
      setMessages(fallbackMsgs);
    }
  };

  const selectConversation = (convo) => {
    setActiveConvo(convo);
    const chatKey = `chat_${user.email}_${convo.email}`;
    const fallbackMsgs = JSON.parse(localStorage.getItem(chatKey)) || [];
    setMessages(fallbackMsgs);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConvo) return;

    const newMessage = {
      sender: user.email,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const chatKey = `chat_${user.email}_${activeConvo.email}`;
    const reverseChatKey = `chat_${activeConvo.email}_${user.email}`;
    const updated = [...messages, newMessage];
    
    localStorage.setItem(chatKey, JSON.stringify(updated));
    localStorage.setItem(reverseChatKey, JSON.stringify(updated));
    
    setMessages(updated);
    setChatInput('');

    // Try to sync with Supabase messages table (gracefully catches RLS errors)
    try {
      await supabase.from('messages').insert([{
        project_id: activeConvo.project_id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf',
        sender_id: user.id || 'b302a0d7-7672-4c74-8a3c-d60cb81a94bf',
        message: newMessage.text
      }]);
    } catch (errVal) {
      console.warn("Supabase chat write offline:", errVal);
    }

    // Smart Q&A Bot — reads message and replies contextually
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      const q = chatInput.toLowerCase();

      const getBotReply = (msg) => {
        // Payment / Escrow
        if (/payment|escrow|paise|money|rupee|₹|upi|paid|release|transfer|withdraw/.test(msg))
          return `💳 Your escrow payment is safely locked and will be released via UPI to your registered ID (${user.upi_id || 'not set'}) immediately after we approve your deliverables. No delays guaranteed!`;

        // Deadline / Time
        if (/deadline|kab|when|time|date|due|submit|last date/.test(msg))
          return `📅 The project deadline is as per the milestone agreement. Please submit your deliverables from the "My Projects" tab before the due date. Need an extension? Message us here!`;

        // Status / Progress
        if (/status|progress|update|work|done|complete|finish|kya hua/.test(msg))
          return `📊 Current milestone status: ${liveProjects.find(p => p.assigned_student_email === user.email)?.status?.replace('_', ' ').toUpperCase() || 'IN PROGRESS'}. Keep going — you're doing great! 🚀`;

        // How to submit
        if (/submit|deliver|upload|link|figma|github|kaise bhejun|kaise submit/.test(msg))
          return `🚀 To submit your work: Go to "My Projects" tab → find your active milestone → click "Submit Work" → paste your Figma/GitHub/Drive link + notes. Easy!`;

        // Skills / Certificates
        if (/skill|certificate|cert|badge|verified|level|quiz|score/.test(msg))
          return `🏅 Your skill score is ${user.score || 0}/5 and your level is "${user.level || 'Beginner'}". Complete more gigs to unlock Expert badges and a verified certificate!`;

        // Help / Support
        if (/help|support|problem|issue|error|nahi chal raha|stuck|confused/.test(msg))
          return `🛠️ No worries! For platform issues contact: support@skillnux.in. For project queries, describe your problem here and we'll resolve it within 2 hours. We're always here for you!`;

        // Hello / Greet
        if (/hello|hi|hey|namaste|hii|good morning|good evening|sup|wassup/.test(msg))
          return `👋 Hey ${user.name?.split(' ')[0] || 'there'}! Great to hear from you. How can we assist you with your milestone today?`;

        // Earning / Salary
        if (/earn|salary|income|kitna mila|profit|income|kamai/.test(msg))
          return `💰 You've earned ₹${(totalEarned + (user.earnings || 0)).toLocaleString()} so far on SkillNux! Keep completing milestones to grow your income. Every gig adds to your portfolio too!`;

        // Revision / Change
        if (/revision|change|edit|modify|redo|update work|changes karo/.test(msg))
          return `✏️ Need revisions? No problem! Update your submission or re-submit from the "My Projects" tab. We'll review within 24 hours and provide detailed feedback.`;

        // Review / Feedback
        if (/review|feedback|rating|star|opinion|thoughts/.test(msg))
          return `⭐ We're reviewing your submission carefully! Once approved, you'll get a 5-star rating on your profile and your escrow payment releases instantly. Stay tuned!`;

        // Project details
        if (/project|gig|task|milestone|work|assignment/.test(msg))
          return `📋 Your active milestone details are in the "My Projects" tab. Budget is secured in UPI escrow and releases upon approval. Any specific project query?`;

        // Thank you
        if (/thank|thanks|shukriya|dhanyawad|appreciated/.test(msg))
          return `🙏 You're most welcome! That's what we're here for. Best of luck with your milestone — you've got this! 💪`;

        // Leaderboard / Rank
        if (/rank|leaderboard|position|top|first|college rank/.test(msg))
          return `🏆 Your current campus rank is among the top performers at ${user.college || 'your college'}! Check the "Leaderboard" tab for your exact position and points needed to rank up.`;

        // Default intelligent fallback
        const fallbacks = [
          `✅ Got your message! Our team will get back to you within 2 hours. Meanwhile, check your milestone status in "My Projects".`,
          `💬 Thanks for reaching out! For urgent queries email: support@skillnux.in or WhatsApp us. We're happy to help!`,
          `📌 Noted! We're on it. Is there anything specific about your current milestone you'd like us to clarify?`,
          `🚀 Roger that! Your message has been received. Check the Inbox & Chat tab regularly for updates from our team.`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
      };

      const responseMsg = {
        sender: activeConvo.email,
        text: getBotReply(q),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const responseList = [...updated, responseMsg];
      localStorage.setItem(chatKey, JSON.stringify(responseList));
      localStorage.setItem(reverseChatKey, JSON.stringify(responseList));
      setMessages(responseList);
    }, 1200);
  };

  const handleAcceptProject = async (proj) => {
    setLoading(true);
    try {
      // Update Supabase
      await supabase
        .from('projects')
        .update({
          status: 'in_progress',
          assigned_student_email: user.email,
          assigned_student_name: user.name
        })
        .eq('id', proj.id);

      // Client-side fallback updates
      const updatedProj = {
        ...proj,
        status: 'in_progress',
        assigned_student_email: user.email,
        assigned_student_name: user.name
      };
      
      const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
      const idx = localProjects.findIndex(p => p.id === proj.id);
      if (idx > -1) {
        localProjects[idx] = updatedProj;
      } else {
        localProjects.push(updatedProj);
      }
      localStorage.setItem(`local_projects`, JSON.stringify(localProjects));

      alert(`🎉 Milestone accepted! Lock contract generated. Let's start work on "${proj.title}"!`);
      fetchSupabaseData(user);
    } catch (errVal) {
      console.error(errVal);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDeliverable = (e) => {
    e.preventDefault();
    if (!subNotes || !subUrl) {
      alert("⚠️ Please enter a delivery note and submission URL.");
      return;
    }

    const updatedProj = {
      ...submitModalProject,
      status: 'submitted',
      submission_notes: subNotes,
      submission_url: subUrl,
      submitted_at: new Date().toLocaleDateString()
    };

    const localProjects = JSON.parse(localStorage.getItem(`local_projects`)) || [];
    const idx = localProjects.findIndex(p => p.id === submitModalProject.id);
    if (idx > -1) {
      localProjects[idx] = updatedProj;
    } else {
      localProjects.push(updatedProj);
    }
    localStorage.setItem(`local_projects`, JSON.stringify(localProjects));

    // Update Supabase
    supabase
      .from('projects')
      .update({
        status: 'submitted',
        submission_notes: subNotes,
        submission_url: subUrl
      })
      .eq('id', submitModalProject.id)
      .then(() => {
        alert(`🚀 Success! Project deliverables submitted. Review notification sent to ${submitModalProject.business_email}.`);
        setModalOpen(null);
        setSubmitModalProject(null);
        setSubNotes('');
        setSubUrl('');
        fetchSupabaseData(user);
      });
  };

  const getInitials = (nameVal) => {
    if (!nameVal || typeof nameVal !== 'string') return '?';
    return nameVal.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillnux_user');
    navigate('/');
  };

  // ── NEW FEATURE HELPERS ────────────────────────────────────────────────────

  // XP Calculation
  const calcXP = () => {
    const base = Number(user?.score || 0) * 20;
    const projXP = (completedGigs?.length || 0) * 50;
    const streakXP = Number(streakDays || 0) * 5;
    const total = base + projXP + streakXP;
    return isNaN(total) ? 0 : total;
  };
  const xpLevel = () => {
    const xp = calcXP();
    if (xp >= 500) return { level: 'Legend', next: 1000, color: '#ffd700' };
    if (xp >= 200) return { level: 'Pro', next: 500, color: '#06b6d4' };
    if (xp >= 80) return { level: 'Rising Star', next: 200, color: '#7c3aed' };
    return { level: 'Newbie', next: 80, color: '#60a5fa' };
  };

  // Escrow step helper
  const getEscrowStep = (status) => {
    const steps = ['open', 'in_progress', 'submitted', 'completed'];
    return steps.indexOf(status);
  };

  // Milestone checker
  const checkMilestone = () => {
    if (completedGigs.length >= 5 || totalEarned >= 10000) return true;
    return false;
  };

  // Referral copy
  const copyReferral = () => {
    navigator.clipboard.writeText(user?.refer_code || '');
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  // Certificate open
  const openCertificate = (type) => {
    setCertType(type);
    setShowCertModal(true);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  };

  // LinkedIn share
  const shareLinkedIn = () => {
    const txt = encodeURIComponent(`🎓 I just earned my SkillNux Certificate in ${user?.skill}!\n\nCompleted ${completedGigs.length} projects and earned ₹${totalEarned.toLocaleString()} as a student freelancer.\n\nJoin me → skillnux.in #SkillNux #StudentFreelancer #Earning`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://skillnux.in&summary=${txt}`, '_blank');
  };

  // WhatsApp share cert
  const shareWhatsApp = () => {
    const txt = encodeURIComponent(`🎓 Main SkillNux par *${user?.skill}* skill se *₹${totalEarned.toLocaleString()}* kama chuka hoon!\n\nTum bhi join karo: skillnux.in\nMera refer code: *${user?.refer_code}* use karo — FREE registration!`);
    window.open(`https://wa.me/?text=${txt}`, '_blank');
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
      const primarySkill = editSkills[0] || user.skill || '';
      const { error } = await supabase
        .from('students')
        .update({
          name: editName,
          phone: editPhone,
          college: editCollege,
          course: editCourse,
          upi_id: editUpi,
          about: editAbout,
          skill: primarySkill,
          skills: editSkills
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
        about: editAbout,
        skill: primarySkill,
        skills: editSkills
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
      earnings: 'Earnings & Ledgers',
      chat: 'Inbox & Chat Hub',
      badges: 'Badges',
      leaderboard: 'Leaderboard',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Dashboard';
  };

  if (!user) return null;

  const initials = getInitials(user.name);
  const studentSkills = user.skills && user.skills.length > 0 
    ? user.skills 
    : (user.skill ? [user.skill] : []);
    
  const userRankIndex = leaderboard.findIndex(l => l.email === user.email);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : '-';
  const targetUser = userRankIndex > 0 ? leaderboard[userRankIndex - 1] : null;

  return (
    <PageEntrance className="frosted-cream-theme" style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      <BackgroundVideo skill={user.skill} />
      
      {/* Mobile Hamburger Button */}
      <button className="hamburger-btn" id="hamBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="SkillNux" style={{ height: '40px', objectFit: 'contain' }} />
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
            <span className="nav-icon">🏠</span> <span className="nav-label">Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}>
            <span className="nav-icon">📋</span> <span className="nav-label">My Projects</span>
          </button>
          <button className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => { setActiveTab('portfolio'); setSidebarOpen(false); }}>
            <span className="nav-icon">💼</span> <span className="nav-label">Portfolio</span>
          </button>
          <button className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('earnings'); setSidebarOpen(false); }}>
            <span className="nav-icon">💰</span> <span className="nav-label">Earnings</span>
          </button>
          <button className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }}>
            <span className="nav-icon">💬</span> <span className="nav-label">Inbox & Chat</span>
          </button>

          <div className="nav-section">Profile</div>
          <button className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => { setActiveTab('badges'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏅</span> <span className="nav-label">Badges</span>
          </button>
          <button className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setActiveTab('leaderboard'); setSidebarOpen(false); }}>
            <span className="nav-icon">🏆</span> <span className="nav-label">Leaderboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/payment')} style={{ color: 'var(--cyan)' }}>
            <span className="nav-icon">⚡</span> <span className="nav-label">Get Pro</span>
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <span className="nav-icon">⚙️</span> <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" style={{ color: 'var(--pink)', width: '100%' }} onClick={handleLogout}>
            <span className="nav-icon">🚪</span> <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN MAIN MAIN */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h2><RevealText type="letter" text={getPageTitle()} /></h2>
            <p><RevealText type="word" text={`Welcome back, ${user.name ? user.name.split(' ')[0] : 'Student'}! 👋`} delay={0.2} /></p>
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
                <ScrollReveal delay={0.1}>
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{liveProjects.length}</div>
                    <div className="stat-label">Matching Projects</div>
                    <div className="stat-change">↑ Live feed</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">₹{user.earnings || 0}</div>
                    <div className="stat-label">Total Earned</div>
                    <div className="stat-change">Keep going!</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{user.score || 0}/5</div>
                    <div className="stat-label">Skill Quiz Score</div>
                    <div className="stat-change">Verified!</div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{user.streak || 0}</div>
                    <div className="stat-label">Day Streak</div>
                    <div className="stat-change">Keep it up!</div>
                  </div>
                </ScrollReveal>
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
                      <div className="empty-state-card">
                        <div className="empty-state-icon animated-bounce">🎯</div>
                        <div className="empty-state-title">No Matching Projects Yet</div>
                        <div className="empty-state-sub">We will update your feed automatically as soon as a brand locks a new milestone contract for <strong>{studentSkills.join(', ')}</strong>!</div>
                        <div className="empty-state-pulse"></div>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Rank Badge & Progress */}
                  <div className="rank-hero-card">
                    <div className="rank-trophy">
                      {userRankIndex === 0 ? '🥇' : 
                       userRankIndex === 1 ? '🥈' : 
                       userRankIndex === 2 ? '🥉' : '🏆'}
                    </div>
                    <div className="rank-info">
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Your Rank</div>
                      <div className="rank-position">
                        #{userRank}
                      </div>
                      <div className="rank-college-name">at {user.college}</div>
                      
                      {userRankIndex > 0 && targetUser && (
                        <div className="rank-progress-wrap">
                          <div className="rank-progress-label">
                            <span>Points to next rank</span>
                            <span>{Math.max(0, (targetUser.score || 0) - (user.score || 0))} pts</span>
                          </div>
                          <div className="rank-progress-bar">
                            <div className="rank-progress-fill" style={{ width: `${Math.min(100, ((user.score || 0) / (targetUser.score || 1)) * 100)}%` }}></div>
                          </div>
                          <div className="rank-next-text">Beat {targetUser.name?.split(' ')[0] || 'Challenger'} to rank up!</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* XP & Gamification */}
                  <div className="xp-bar-wrap">
                    <div className="xp-header">
                      <div className="xp-level">{xpLevel().level} Level</div>
                      <div className="xp-points">{calcXP()} XP</div>
                    </div>
                    <div className="xp-bar-bg">
                      <div className="xp-bar-fill" style={{ width: xpAnimated ? `${Math.min(100, (calcXP() / xpLevel().next) * 100)}%` : '0%' }}></div>
                    </div>
                    <div className="xp-next">{xpLevel().next - calcXP()} XP to next level</div>
                  </div>

                  {/* Milestone Cert Unlocker */}
                  <div className="cert-unlock-card" onClick={() => checkMilestone() ? openCertificate('projects') : alert(`Earn ₹10,000 or complete 5 projects to unlock your cert! Current: ${completedGigs.length}/5 projects, ₹${totalEarned}/₹10,000.`)}>
                    <div className="cert-unlock-icon">{checkMilestone() ? '🎓' : '🔒'}</div>
                    <div className="cert-unlock-title">{checkMilestone() ? 'View Verified Certificate' : 'Milestone Certificate'}</div>
                    <div className="cert-unlock-sub">{checkMilestone() ? 'Tap to view, print & share your verified credential on LinkedIn!' : `Complete ${5 - completedGigs.length} more gigs or earn ₹${10000 - totalEarned} to unlock.`}</div>
                  </div>

                  {/* Referral Viral Loop */}
                  <div className="referral-card">
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '1px' }}>🎁 Invite & Earn Extra XP</div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px', lineHeight: '1.5' }}>
                      Share your code. When a friend completes their first gig, you both get +200 XP and a priority badge!
                    </p>
                    <div className="referral-code-box">
                      <div className="referral-code-text">{user.refer_code || 'SN7492A'}</div>
                      <button className={`referral-copy-btn ${referralCopied ? 'copied' : ''}`} onClick={copyReferral}>
                        {referralCopied ? 'Copied! ✓' : 'Copy'}
                      </button>
                    </div>
                    <button className="referral-wa-btn" onClick={shareWhatsApp}>
                      <span style={{ fontSize: '16px' }}>📱</span> Share on WhatsApp
                    </button>
                  </div>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Explore Gigs */}
              <div className="section-card">
                <div className="section-head">
                  <div className="section-title">🎯 Explore Open Campus Gigs ({liveProjects.filter(p => p.status === 'open').length})</div>
                </div>
                {liveProjects.filter(p => p.status === 'open').length > 0 ? (
                  liveProjects.filter(p => p.status === 'open').map((p) => (
                    <div className="project-item" key={p.id}>
                      <div className="proj-icon" style={{ background: 'rgba(29, 191, 115, 0.12)', color: '#1dbf73' }}>⚡</div>
                      <div className="proj-info">
                        <div className="proj-name">{p.title}</div>
                        <div className="proj-meta">{p.skill} • Budget: <strong>₹{p.budget}</strong> • Secured Escrow: <strong>Yes 🛡️</strong></div>
                      </div>
                      <div className="proj-right">
                        <button onClick={() => handleAcceptProject(p)} className="btn-primary btn-sm">
                          ⚡ Accept & Start
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-card">
                    <div className="empty-state-icon animated-bounce">🎯</div>
                    <div className="empty-state-title">All Gigs Assigned</div>
                    <div className="empty-state-sub">No open campus projects match your tags: <strong>{studentSkills.join(', ')}</strong>. We notify you once new milestones lock!</div>
                    <div className="empty-state-pulse"></div>
                  </div>
                )}
              </div>

              {/* Active Student Gigs */}
              <div className="section-card">
                <div className="section-head">
                  <div className="section-title">💼 My Active Milestones ({liveProjects.filter(p => p.assigned_student_email === user.email).length})</div>
                </div>
                {liveProjects.filter(p => p.assigned_student_email === user.email).length > 0 ? (
                  liveProjects.filter(p => p.assigned_student_email === user.email).map((p) => {
                    const statusClass = p.status === 'in_progress' ? 'status-new' : (p.status === 'submitted' ? 'status-active' : 'status-complete');
                    return (
                      <div className="project-item" key={p.id}>
                        <div className="proj-icon" style={{ background: 'rgba(255, 170, 0, 0.12)', color: '#ffaa00' }}>📋</div>
                        <div className="proj-info">
                          <div className="proj-name">{p.title}</div>
                          <div className="proj-meta">Budget: ₹{p.budget} • UPI Escrow: Locked 🔒 • Client: {p.business_email}</div>
                          
                          {p.status === 'submitted' && (
                            <div className="submission-meta-strip">
                              <div className="submission-meta-title">Submitted notes:</div>
                              <div className="submission-meta-body">"{p.submission_notes}" (Link: <a href={p.submission_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1dbf73', textDecoration: 'underline' }}>{p.submission_url}</a>)</div>
                            </div>
                          )}

                          {/* Escrow Pipeline Tracker */}
                          <div className="escrow-pipeline">
                            {['open', 'in_progress', 'submitted', 'completed'].map((step, idx) => {
                              const labels = ['Escrow Locked', 'Active Work', 'In Review', 'UPI Released'];
                              const isDone = getEscrowStep(p.status) >= idx;
                              const isActive = getEscrowStep(p.status) === idx;
                              return (
                                <div className={`escrow-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} key={step}>
                                  <div className={`escrow-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                                    {isDone ? '✓' : (idx + 1)}
                                  </div>
                                  <div className={`escrow-label ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                                    {labels[idx]}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="proj-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`proj-status ${statusClass}`} style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {p.status === 'in_progress' ? 'Active Work' : p.status}
                          </span>
                          
                          {p.status === 'in_progress' && (
                            <button onClick={() => { setSubmitModalProject(p); setModalOpen('submitWork'); }} className="btn-primary btn-sm">
                              🚀 Submit Work
                            </button>
                          )}
                          {p.status === 'completed' && (
                            <button onClick={() => setSelectedInvoice(p)} className="btn-ghost btn-sm" style={{ borderColor: 'rgba(29,191,115,0.4)', color: '#1dbf73' }}>
                              🧾 Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state-card">
                    <div className="empty-state-icon animated-bounce">💼</div>
                    <div className="empty-state-title">No Active Milestones Yet</div>
                    <div className="empty-state-sub">Explore matching gigs above and click "Accept" to start your first milestone contract!</div>
                    <div className="empty-state-pulse"></div>
                  </div>
                )}
              </div>

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
                  <div className="stat-value">₹{(totalEarned + (user.earnings || 12000)).toLocaleString()}</div>
                  <div className="stat-label">Total Balance</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">₹{totalPending.toLocaleString()}</div>
                  <div className="stat-label">Pending Escrow</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{completedGigs.length}</div>
                  <div className="stat-label">Gigs Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛡️</div>
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Safety Rating</div>
                </div>
              </div>

              <div className="section-card" style={{ marginTop: '24px' }}>
                <div className="section-head">
                  <div className="section-title">💸 Milestone Escrow Ledger</div>
                </div>
                {liveProjects.filter(p => p.assigned_student_email === user.email).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {liveProjects.filter(p => p.assigned_student_email === user.email).map((p) => {
                      const ledgerStatus = p.status === 'completed' ? 'RELEASED ✅' : (p.status === 'submitted' ? 'IN REVIEW ⏳' : 'LOCKED 🔒');
                      return (
                        <div className="project-item" key={p.id}>
                          <div className="proj-icon">💳</div>
                          <div className="proj-info">
                            <div className="proj-name">{p.title}</div>
                            <div className="proj-meta">UPI ID: {user.upi_id || 'not set'} • Ledger Hash: TXN-{p.id}9982X</div>
                          </div>
                          <div className="proj-right" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: p.status === 'completed' ? '#1dbf73' : (p.status === 'submitted' ? '#ffaa00' : '#8f9cae') }}>
                              {ledgerStatus}
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '16px', color: '#fff' }}>
                              ₹{p.budget.toLocaleString()}
                            </div>
                            {p.status === 'completed' && (
                              <button onClick={() => setSelectedInvoice(p)} className="btn-ghost btn-sm" style={{ color: '#1dbf73', borderColor: 'rgba(29,191,115,0.3)' }}>
                                receipt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state-card">
                    <div className="empty-state-icon animated-bounce">💸</div>
                    <div className="empty-state-title">No Transactions Recorded</div>
                    <div className="empty-state-sub">Earned payouts will populate this ledger feed automatically!</div>
                    <div className="empty-state-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. INBOX & CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="chat-layout">
              
              {/* Chat Sidebar: Active Convos */}
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                  💬 Direct Inbox ({conversations.length})
                </div>
                <div className="chat-convo-list">
                  {conversations.map((convo, idx) => (
                    <div
                      key={idx}
                      className={`chat-convo-item ${activeConvo?.email === convo.email ? 'active' : ''}`}
                      onClick={() => selectConversation(convo)}
                    >
                      <div className="chat-convo-avatar">
                        {convo.name.charAt(0)}
                      </div>
                      <div className="chat-convo-details">
                        <div className="chat-convo-name">{convo.name}</div>
                        <div className="chat-convo-preview">{convo.projectTitle}</div>
                      </div>
                      <div className="chat-convo-badge"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Thread Panel */}
              <div className="chat-main-window">
                {activeConvo ? (
                  <>
                    {/* Header */}
                    <div className="chat-window-header">
                      <div className="chat-window-userinfo">
                        <h4>{activeConvo.name}</h4>
                        <p><span className="pulse"></span> {activeConvo.email} (Online)</p>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--muted-dark)' }}>{activeConvo.projectTitle}</span>
                    </div>

                    {/* Messages Body */}
                    <div className="chat-messages-container">
                      {messages.length > 0 ? (
                        <>
                          {messages.map((m, idx) => {
                            const isSentByMe = m.sender === user.email;
                            return (
                              <div key={idx} className={`chat-bubble-wrap ${isSentByMe ? 'sent' : 'received'}`}>
                                <div className="chat-bubble">
                                  {m.text}
                                </div>
                                <div className="chat-bubble-meta">
                                  {m.timestamp}
                                </div>
                              </div>
                            );
                          })}
                          {botTyping && (
                            <div className="chat-bubble-wrap received">
                              <div className="chat-bubble" style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '12px 16px' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'typingDot 1.2s 0s infinite' }} />
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'typingDot 1.2s 0.2s infinite' }} />
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'typingDot 1.2s 0.4s infinite' }} />
                              </div>
                              <div className="chat-bubble-meta">typing...</div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="chat-empty-thread">
                          <span className="ico">🤖</span>
                          <p>Ask anything! Payment queries, project status, submission help — our AI assistant answers instantly.</p>
                        </div>
                      )}
                    </div>

                    {/* Footer Input Bar */}
                    <form onSubmit={handleSendMessage} className="chat-input-bar">
                      <input
                        type="text"
                        placeholder="Ask anything — payment, deadline, submission, rank... (AI replies instantly!)"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="chat-btn-send">
                        ✈️
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="chat-empty-thread">
                    <span className="ico">💬</span>
                    <h4>No active conversations</h4>
                    <p>Conversations automatically open once a client milestone budget is locked!</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 6. BADGES PAGE */}
          {activeTab === 'badges' && (
            <div>
              <div className="section-card">
                <div className="section-head"><div className="section-title">🏅 My Verified Badges</div></div>
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
                      {completedGigs.length}/5
                    </div>
                  </div>
                  <div className="project-item" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="proj-icon">💎</div>
                    <div className="proj-info">
                      <div className="proj-name">Verified Pro</div>
                      <div className="proj-meta">Complete 10 client projects</div>
                    </div>
                    <div className="proj-status" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-dark)' }}>
                      {completedGigs.length}/10
                    </div>
                  </div>
                  <div className="project-item" style={{ padding: '12px 0' }}>
                    <div className="proj-icon">💰</div>
                    <div className="proj-info">
                      <div className="proj-name">Top Earner Badge</div>
                      <div className="proj-meta">Cross ₹10,000 in total dashboard earnings</div>
                    </div>
                    <div className="proj-status" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-dark)' }}>
                      ₹{totalEarned}/₹10K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. LEADERBOARD PAGE */}
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

          {/* 8. SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="settings-page-layout fadeUp">
              {msg && <div className="alert alert-success show" style={{ marginBottom: '20px' }}>{msg}</div>}
              {err && <div className="alert alert-error show" style={{ marginBottom: '20px' }}>{err}</div>}
              
              <div className="dash-grid">
                
                {/* Profile Edit Card */}
                <div className="section-card">
                  <div className="section-head">
                    <div className="section-title">✏️ Edit Profile Details</div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <form onSubmit={handleSaveProfile}>
                      <div className="form-group">
                        <label>Registered Email (Locked)</label>
                        <input type="text" value={user.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                      <div className="form-group">
                        <label>Full Name (Locked)</label>
                        <input type="text" value={editName} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                      <div className="form-group">
                        <label>WhatsApp Number</label>
                        <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>College Name (Locked)</label>
                        <input type="text" value={editCollege} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                      </div>
                      <div className="form-group">
                        <label>Course (Locked)</label>
                        <select value={editCourse} disabled style={{ width: '100%', padding: '10px', background: 'var(--card-dark2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', opacity: 0.6, cursor: 'not-allowed' }}>
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
                      <div className="form-group" style={{ marginTop: '16px' }}>
                        <label>UPI ID (For Secure Payouts)</label>
                        <input type="text" value={editUpi} onChange={(e) => setEditUpi(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>About Me (Bio)</label>
                        <textarea value={editAbout} onChange={(e) => setEditAbout(e.target.value)} placeholder="Introduce yourself to brands..."></textarea>
                      </div>
                      
                      <div className="form-group">
                        <label>My Verified Skills (Select up to 3)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          {editSkills.map(sk => (
                            <span key={sk} style={{ padding: '4px 10px', borderRadius: '50px', background: 'var(--cyan)', color: '#070910', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              {sk}
                              <button type="button" onClick={() => setEditSkills(prev => prev.filter(s => s !== sk))} style={{ background: 'none', border: 'none', color: '#070910', cursor: 'pointer', padding: 0, fontWeight: '900', fontSize: '10px' }}>✕</button>
                            </span>
                          ))}
                        </div>
                        {editSkills.length < 3 ? (
                          <select onChange={(e) => {
                            const val = e.target.value;
                            if (val && !editSkills.includes(val)) {
                              setEditSkills(prev => [...prev, val]);
                            }
                            e.target.value = '';
                          }} style={{ width: '100%', padding: '10px', background: 'var(--card-dark2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}>
                            <option value="">-- Add a Skill --</option>
                            {allSkills.filter(s => !editSkills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <div style={{ fontSize: '11px', color: 'var(--orange)' }}>⚠️ Max 3 skills reached. Remove a skill to add another.</div>
                        )}
                      </div>
                      
                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                        {loading ? 'Saving...' : '💾 Save Profile Details'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Stack: Security & Payouts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Password Card */}
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">🔑 Change Password Security</div>
                    </div>
                    <div style={{ padding: '24px' }}>
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
                          <input type="password" placeholder="Re-enter new password" value={confPass} onChange={(e) => setConfPass(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                          {loading ? 'Updating...' : '🔑 Update Password'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Actions / Session */}
                  <div className="section-card">
                    <div className="section-head">
                      <div className="section-title">🛡️ Account Actions</div>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '13px', color: 'var(--muted-dark)' }}>Disburse Escrow Account UPI:</p>
                      <div style={{ padding: '12px 16px', background: 'var(--card-dark2)', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--cyan)', fontWeight: 'bold' }}>
                        {user.upi_id || 'Not Set'}
                      </div>
                      <button className="btn-ghost" style={{ width: '100%', color: 'var(--pink)', borderColor: 'rgba(255,45,120,0.3)', marginTop: '10px' }} onClick={handleLogout}>
                        🚪 Logout Session
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* SUBMIT DELIVERABLE MODAL */}
      <div className={`modal-overlay ${modalOpen === 'submitWork' ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-title">
            🚀 Submit Gig Deliverables
            <button className="modal-close" onClick={() => setModalOpen(null)}>✕</button>
          </div>
          
          <form onSubmit={handleSubmitDeliverable}>
            <div style={{ fontSize: '13px', color: 'var(--muted-dark)', marginBottom: '16px' }}>
              Locked UPI Escrow milestone funds: <strong>₹{submitModalProject?.budget.toLocaleString()}</strong>
            </div>

            <div className="form-group">
              <label>Delivery Description Note</label>
              <textarea
                placeholder="Explain the changes, improvements, or features implemented..."
                value={subNotes}
                onChange={(e) => setSubNotes(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Figma, GitHub, or Shared Folder URL</label>
              <input
                type="url"
                placeholder="https://figma.com/file/... or https://github.com/..."
                value={subUrl}
                onChange={(e) => setSubUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              🚀 Send Deliverables for Review
            </button>
          </form>
        </div>
      </div>

      {/* PRINTABLE RECEIPT / INVOICE MODAL OVERLAY */}
      {selectedInvoice && (
        <div className="receipt-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="receipt-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="receipt-header">
              <h3>SKILL<span>NUX</span></h3>
              <p>UPI Escrow Receipt</p>
            </div>

            <div className="receipt-seal">
              Verified Escrow
            </div>

            <div className="receipt-body">
              <div className="receipt-line-item">
                <span>Receipt Number:</span>
                <strong>SN-{selectedInvoice.id}992X</strong>
              </div>
              <div className="receipt-line-item">
                <span>Date Released:</span>
                <strong>{selectedInvoice.submitted_at || new Date().toLocaleDateString()}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Vetted Specialist:</span>
                <strong>{user.name}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Disbursement UPI ID:</span>
                <strong>{user.upi_id || 'lillian@okaxis'}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Hiring Client Email:</span>
                <strong>{selectedInvoice.business_email}</strong>
              </div>
              <div className="receipt-line-item">
                <span>Project Description:</span>
                <strong style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {selectedInvoice.title}
                </strong>
              </div>

              <div className="receipt-tear-divider"></div>

              <div className="receipt-line-item price">
                <span>Released Earnings:</span>
                <strong>₹{selectedInvoice.budget.toLocaleString()}</strong>
              </div>

              <div className="receipt-barcode">
                <div className="receipt-barcode-lines"></div>
                <div className="receipt-barcode-lbl">SECURE CONTRACT PASS</div>
              </div>
            </div>

            <div className="receipt-footer-btn-row">
              <button onClick={() => window.print()} className="f-escrow-success-btn primary">
                🖨️ Print Receipt
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="f-escrow-success-btn secondary">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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
              <label>Full Name (Locked)</label>
              <input type="text" value={editName} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>College Name (Locked)</label>
              <input type="text" value={editCollege} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label>Course (Locked)</label>
              <select value={editCourse} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
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
            <div className="form-group">
              <label>My Skills (Select up to 3)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {editSkills.map(sk => (
                  <span key={sk} style={{ padding: '4px 10px', borderRadius: '50px', background: 'var(--cyan)', color: '#070910', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {sk}
                    <button type="button" onClick={() => setEditSkills(prev => prev.filter(s => s !== sk))} style={{ background: 'none', border: 'none', color: '#070910', cursor: 'pointer', padding: 0, fontWeight: '900', fontSize: '10px' }}>✕</button>
                  </span>
                ))}
              </div>
              {editSkills.length < 3 ? (
                <select onChange={(e) => {
                  const val = e.target.value;
                  if (val && !editSkills.includes(val)) {
                    setEditSkills(prev => [...prev, val]);
                  }
                  e.target.value = '';
                }} style={{ width: '100%', padding: '10px', background: 'var(--card-dark2)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}>
                  <option value="">-- Add a Skill --</option>
                  {allSkills.filter(s => !editSkills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--orange)' }}>⚠️ Max 3 skills reached. Remove a skill to add another.</div>
              )}
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

      {/* 🎓 MILESTONE CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="cert-overlay" onClick={() => setShowCertModal(false)}>
          <div className="cert-card" onClick={e => e.stopPropagation()}>
            <div className="cert-top-bar"></div>
            <div className="cert-header">
              <div className="cert-logo">🎓</div>
              <div className="cert-issuer">SkillNux Verified Credential</div>
              <div className="cert-main-title">Certificate of Achievement</div>
            </div>
            
            <div className="cert-body">
              <div className="cert-presents">This is proudly presented to</div>
              <div className="cert-student-name">{user.name}</div>
              <div className="cert-for">for successfully completing the verification and reaching milestones in</div>
              <div className="cert-skill">{user.skill}</div>
              
              <div className="cert-badge-strip">
                <div className="cert-badge-item">
                  <div className="cert-badge-val">{completedGigs.length}</div>
                  <div className="cert-badge-lbl">Projects Done</div>
                </div>
                <div className="cert-badge-item">
                  <div className="cert-badge-val">₹{totalEarned.toLocaleString()}</div>
                  <div className="cert-badge-lbl">Escrow Earnings</div>
                </div>
                <div className="cert-badge-item">
                  <div className="cert-badge-val">{user.badge?.split(' ')[0] || '🏅'}</div>
                  <div className="cert-badge-lbl">Badge Level</div>
                </div>
              </div>
              
              <div className="cert-seal">🏆</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="cert-date">Issued: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="cert-id">ID: SN-{user.email.substring(0, 4).toUpperCase()}-{totalEarned}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ width: '80px', height: '2px', background: 'rgba(255,255,255,0.4)', margin: '0 0 4px auto' }}></div>
                  <div className="cert-id">SkillNux Escrow Authority</div>
                </div>
              </div>
            </div>
            
            <div className="cert-actions">
              <button className="cert-btn-linkedin" onClick={shareLinkedIn}>
                <span style={{ fontSize: '16px' }}>in</span> Share on LinkedIn
              </button>
              <button className="cert-btn-wa" onClick={shareWhatsApp}>
                <span style={{ fontSize: '16px' }}>📱</span> WhatsApp
              </button>
              <button className="cert-btn-print" onClick={() => window.print()}>
                🖨️ Print / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 MILESTONE TOAST */}
      {milestoneToast && (
        <div className="milestone-toast">
          <div className="milestone-toast-icon">{milestoneToast.icon}</div>
          <div className="milestone-toast-text">{milestoneToast.text}</div>
        </div>
      )}

    </PageEntrance>
  );
}
