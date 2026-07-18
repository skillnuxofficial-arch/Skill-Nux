import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import RevealText from '../components/RevealText';
import PageEntrance from '../components/PageEntrance';
import ScrollReveal from '../components/ScrollReveal';
import VideoSlideshow from '../components/VideoSlideshow';
const CATEGORY_SKILLS = {
  'Digital Marketing': ['SEO & SEM', 'Social Media Management', 'Content Writing', 'Email Marketing', 'YouTube & Blog', 'Paid Ads (Meta/Google)', 'WhatsApp Marketing', 'Influencer Outreach', 'Online Reputation Management'],
  'Design & Creative': ['Logo & Brand Design', 'UI/UX Design', 'Video Editing', 'Thumbnail Design', 'Poster & Flyer', 'Motion Graphics', 'Reels & Short Video Editing', 'Product Photography Editing', 'Packaging Design', 'Pitch Deck Design', 'Canva Design'],
  'Tech & Development': ['Web Development', 'No-Code & Automation', 'Database Management', 'API Integration', 'Landing Pages', 'Shopify Store Setup', 'WordPress Website', 'App UI Design', 'Chatbot Setup'],
  'Business & Finance': ['Market Research', 'Data Entry & Analysis', 'Excel/Google Sheets', 'Presentations (PPT)', 'Business Writing', 'Customer Support', 'Amazon/Flipkart Listing', 'Hindi Content Writing', 'Regional Language Content'],
  'AI & Automation': ['ChatGPT Prompting', 'AI Image Generation', 'AI Video Creation', 'Notion/Zapier Automation'],
  'Trending 🔥': ['Web Development', 'UI/UX Design', 'Video Editing', 'ChatGPT Prompting', 'Logo & Brand Design', 'Reels & Short Video Editing']
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('terms');
  const [openAccordion, setOpenAccordion] = useState(null);

  // Form states
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Stats refs for entry counter animation
  const statsSectionRef = useRef(null);
  const [stats, setStats] = useState({ students: 0, businesses: 0, colleges: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Custom fiverr states
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0); // 0 or 1 for carousel shifts
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Matchmaker states
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchedCategory, setSearchedCategory] = useState('');
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Razorpay Escrow drawer states
  const [hiringTitle, setHiringTitle] = useState('');
  const [hiringDesc, setHiringDesc] = useState('');
  const [hiringBudget, setHiringBudget] = useState('5000');
  const [hiringEmail, setHiringEmail] = useState('');
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowStatusText, setEscrowStatusText] = useState('Initiating secure escrow handshake...');
  const [escrowStep, setEscrowStep] = useState(0); // 0: Form Inputs, 1: Loading simulator, 2: Success

  useEffect(() => {
    // Scroll listener for nav
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Floating particles (running quietly in backdrop overlay)
    const container = document.getElementById('particles');
    if (container) {
      container.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = p.style.height = Math.random() * 4 + 2 + 'px';
        p.style.background = Math.random() > 0.5 ? 'var(--f-green)' : 'rgba(255,255,255,0.4)';
        p.style.animationDuration = Math.random() * 8 + 6 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        p.style.opacity = '0.3';
        container.appendChild(p);
      }
    }

    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // Stats counter animation observer
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        setStatsAnimated(true);
        animateValue('students', 0, 500, 1500);
        animateValue('businesses', 0, 200, 1500);
        animateValue('colleges', 0, 50, 1500);
      }
    }, { threshold: 0.2 });

    const currentStatsRef = statsSectionRef.current;
    if (currentStatsRef) {
      statsObserver.observe(currentStatsRef);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (currentStatsRef) {
        statsObserver.unobserve(currentStatsRef);
      }
    };
  }, [statsAnimated]);

  const animateValue = (key, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setStats(prev => ({
        ...prev,
        [key]: Math.floor(progress * (end - start) + start)
      }));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const scrollToAccordion = (index) => {
    setOpenAccordion(index);
    const el = document.getElementById('skills');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    alert(`🎉 Success! ${waitlistEmail} has been added to the early access waitlist!`);
    setWaitlistEmail('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    alert(`✅ Message sent! Thank you ${contactName}, we will get back to you shortly.`);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const triggerSearchMatchmaker = async (queryText) => {
    if (!queryText) return;
    setSearchQuery(queryText);
    setSearchLoading(true);
    setShowSearchPanel(true);
    setSearchedCategory(queryText);
    setSelectedCandidate(null);
    setEscrowStep(0);

    // Keyword mapping for mock lists
    const q = queryText.toLowerCase();
    let targetSkill = '';
    let isMatchFound = false;

    if (q.includes('market') || q.includes('seo') || q.includes('content') || q.includes('write')) {
      targetSkill = (q.includes('write') || q.includes('content')) ? 'Content Writing' : 'Digital Marketing';
      isMatchFound = true;
    } else if (q.includes('design') || q.includes('logo') || q.includes('ui') || q.includes('ux') || q.includes('edit')) {
      targetSkill = (q.includes('edit') || q.includes('video')) ? 'Video Editing' : 'UI/UX Design';
      isMatchFound = true;
    } else if (q.includes('web') || q.includes('dev') || q.includes('code') || q.includes('store') || q.includes('app')) {
      targetSkill = 'Web Development';
      isMatchFound = true;
    } else if (q.includes('excel') || q.includes('data') || q.includes('research') || q.includes('sheet')) {
      targetSkill = 'Excel & Google Sheets';
      isMatchFound = true;
    } else if (q.includes('ai') || q.includes('prompt') || q.includes('autom')) {
      targetSkill = 'ChatGPT Prompting';
      isMatchFound = true;
    } else {
      // Direct exact match fallback just in case
      targetSkill = queryText;
      // We will check if it matches exactly below, but let's assume no mock match for now.
    }

    try {
      // 1. Fetch live students from Supabase
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('skill', `%${targetSkill}%`)
        .order('score', { ascending: false });

      // 2. High-fidelity backup mock candidates
      const mockPool = {
        'Web Development': [
          { name: 'Lillian', college: 'Delhi University', course: 'BCA', score: 5, level: 'Expert', rating: '5.0', reviews: 42, upi: 'lillian@okaxis', email: 'lillian@skillnux.in' },
          { name: 'Arjun Mehta', college: 'BITS Pilani', course: 'M.Tech', score: 4, level: 'Advanced', rating: '4.8', reviews: 8, upi: 'arjun@okaxis', email: 'arjun@skillnux.in' }
        ],
        'UI/UX Design': [
          { name: 'Rohan Sharma', college: 'XYZ College', course: 'BCA', score: 5, level: 'Expert', rating: '5.0', reviews: 12, upi: 'rohan@upi', email: 'rohan@skillnux.in' },
          { name: 'Lillian', college: 'Delhi University', course: 'BCA', score: 5, level: 'Expert', rating: '5.0', reviews: 42, upi: 'lillian@okaxis', email: 'lillian@skillnux.in' }
        ],
        'Video Editing': [
          { name: 'Sneha', college: 'Christ University', course: 'BBA', score: 5, level: 'Expert', rating: '5.0', reviews: 54, upi: 'sneha@okaxis', email: 'sneha@skillnux.in' },
          { name: 'Rahul Joshi', college: 'Mumbai University', course: 'B.Sc', score: 4, level: 'Advanced', rating: '4.8', reviews: 15, upi: 'rahul@okicici', email: 'rahul@skillnux.in' }
        ],
        'Digital Marketing': [
          { name: 'Dan', college: 'IIT Bombay', course: 'B.Tech', score: 4, level: 'Advanced', rating: '4.9', reviews: 29, upi: 'dan@okicici', email: 'dan@skillnux.in' },
          { name: 'Sneha Verma', college: 'SRM University', course: 'B.Sc', score: 4, level: 'Advanced', rating: '4.7', reviews: 11, upi: 'snehav@okaxis', email: 'snehav@skillnux.in' }
        ],
        'Content Writing': [
          { name: 'Priya Kapoor', college: 'DU', course: 'B.Sc', score: 4, level: 'Advanced', rating: '4.9', reviews: 18, upi: 'priya@okaxis', email: 'priya@skillnux.in' }
        ],
        'ChatGPT Prompting': [
          { name: 'Dan', college: 'IIT Bombay', course: 'B.Tech', score: 5, level: 'Expert', rating: '4.9', reviews: 29, upi: 'dan@okicici', email: 'dan@skillnux.in' },
          { name: 'Lillian', college: 'Delhi University', course: 'BCA', score: 5, level: 'Expert', rating: '5.0', reviews: 42, upi: 'lillian@okaxis', email: 'lillian@skillnux.in' }
        ]
      };

      const finalMock = isMatchFound ? (mockPool[targetSkill] || []) : [];

      // Merge real students and mock pools safely
      const realList = data || [];
      const combined = [...realList];
      
      finalMock.forEach(mockObj => {
        if (!combined.some(c => c.email === mockObj.email)) {
          combined.push({
            name: mockObj.name,
            college: mockObj.college,
            course: mockObj.course,
            skill: targetSkill,
            score: mockObj.score,
            level: mockObj.level,
            badge: `${mockObj.level} — ${targetSkill}`,
            rating: mockObj.rating,
            reviews: mockObj.reviews,
            upi_id: mockObj.upi,
            email: mockObj.email,
            phone: '+91 88922 41108'
          });
        }
      });

      setMatchedCandidates(combined);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerSearchMatchmaker(searchQuery);
  };

  const handleLockEscrow = async (e) => {
    e.preventDefault();
    if (!hiringTitle || !hiringDesc || !hiringEmail) {
      alert("⚠️ Please fill in all required fields to initiate escrow matching!");
      return;
    }

    // Redirect the user to the business registration/login page to continue
    navigate('/register/business');
  };

  const selectCandidateForEscrow = (candidate) => {
    setSelectedCandidate(candidate);
    setEscrowStep(0);
    setHiringTitle(`Matching Project for ${candidate.name}`);
    setHiringDesc(`We need standard deliveries in ${candidate.skill} matching student's verified score.`);
  };

  return (
    <PageEntrance className="fiverr-landing">
      {/* Floating Particles over backdrop */}
      <div id="particles"></div>

      {/* Fiverr Premium Sticky Header */}
      <header className={`f-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="f-header-top">
          <div className="f-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="SkillNux" style={{ height: '48px', objectFit: 'contain' }} />
          </div>

          {/* Search bar inside header */}
          <form className="f-header-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Nav links */}
          <div className="f-nav-actions">
            <span className="f-nav-link pro" onClick={() => navigate('/payment')}>
              SkillNux Pro ⚡
            </span>
            <span className="f-nav-link" onClick={() => scrollToAccordion(1)}>
              Explore <span style={{ fontSize: '9px', marginLeft: '2px' }}>▼</span>
            </span>
            <span className="f-nav-link" onClick={() => navigate('/register/business')}>
              Become a Partner
            </span>
            <span className="f-nav-link btn-login" onClick={() => navigate('/login')}>
              Sign In
            </span>
            <button className="f-nav-btn-join" onClick={() => navigate('/register/student')}>
              Join
            </button>
          </div>
        </div>

        {/* Bottom Category bar row */}
        <div className="f-categories-row">
          
          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('trending')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">Trending 🔥</span>
            {hoveredCategory === 'trending' && (
              <div className="f-cat-dropdown">
                {['Web Development', 'UI/UX Design', 'Video Editing', 'ChatGPT Prompting', 'Logo & Brand Design', 'Reels & Short Video Editing'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('marketing')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">Digital Marketing</span>
            {hoveredCategory === 'marketing' && (
              <div className="f-cat-dropdown">
                {['SEO & SEM', 'Social Media Management', 'Content Writing', 'Email Marketing', 'YouTube & Blog', 'Paid Ads (Meta/Google)', 'WhatsApp Marketing', 'Influencer Outreach', 'Online Reputation Management'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('design')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">Design & Creative</span>
            {hoveredCategory === 'design' && (
              <div className="f-cat-dropdown">
                {['Logo & Brand Design', 'UI/UX Design', 'Video Editing', 'Thumbnail Design', 'Poster & Flyer', 'Motion Graphics', 'Reels & Short Video Editing', 'Product Photography Editing', 'Packaging Design', 'Pitch Deck Design', 'Canva Design'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('tech')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">Tech & Development</span>
            {hoveredCategory === 'tech' && (
              <div className="f-cat-dropdown">
                {['Web Development', 'No-Code & Automation', 'Database Management', 'API Integration', 'Landing Pages', 'Shopify Store Setup', 'WordPress Website', 'App UI Design', 'Chatbot Setup'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('business')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">Business & Finance</span>
            {hoveredCategory === 'business' && (
              <div className="f-cat-dropdown">
                {['Market Research', 'Data Entry & Analysis', 'Excel/Google Sheets', 'Presentations (PPT)', 'Business Writing', 'Customer Support', 'Amazon/Flipkart Listing', 'Hindi Content Writing', 'Regional Language Content'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="f-cat-item-wrap" 
               onMouseEnter={() => setHoveredCategory('ai')} 
               onMouseLeave={() => setHoveredCategory(null)}>
            <span onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })} className="f-cat-link">AI & Automation</span>
            {hoveredCategory === 'ai' && (
              <div className="f-cat-dropdown">
                {['ChatGPT Prompting', 'AI Image Generation', 'AI Video Creation', 'Notion/Zapier Automation'].map((skill, index) => (
                  <div key={index} className="f-cat-dropdown-item" onClick={() => triggerSearchMatchmaker(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Fiverr Premium Video-Backed Hero Section */}
      <section id="hero" className="f-hero" style={{ background: '#030712' }}>
        <div className="f-hero-video-wrap">
          {/* Video Slideshow Layer */}
          <VideoSlideshow />
        </div>
        <div className="f-hero-overlay" style={{ background: 'radial-gradient(circle at center, rgba(3,7,18,0.05) 0%, rgba(3,7,18,0.5) 100%)', pointerEvents: 'none' }}></div>
        <div className="f-hero-content">
          <h1>
            <RevealText type="letter" text="Our student experts" />
            <br />
            <span className="highlight">
              <RevealText type="letter" text="will take it from here" delay={0.4} />
            </span>
          </h1>
          <p className="sub">
            <RevealText type="word" text="SkillNux connects India's top college specialists with businesses needing reliable, on-demand project deliveries. Pre-vetted, verified ratings, instant escrow trust." delay={0.8} />
          </p>
          
          <form className="f-hero-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for any service (e.g. Website development, Video editing...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ verticalAlign: 'middle' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Quick Skill Tags */}
          <div className="f-quick-tags">
            <span className="label">Popular:</span>
            <span onClick={() => triggerSearchMatchmaker('Web Development')} className="f-tag-pill">Website Development</span>
            <span onClick={() => triggerSearchMatchmaker('UI/UX Design')} className="f-tag-pill">UI/UX Design</span>
            <span onClick={() => triggerSearchMatchmaker('Video Editing')} className="f-tag-pill">Video Editing</span>
            <span onClick={() => triggerSearchMatchmaker('Book Publishing')} className="f-tag-pill">Book Publishing</span>
          </div>

          {/* Trusted Brand Stripe */}
          <ScrollReveal delay={0.2}>
            <div className="f-trusted-by">
              <span className="title">Trusted by:</span>
              <span className="f-brand-logo">Meta</span>
              <span className="f-brand-logo">Google</span>
              <span className="f-brand-logo">NETFLIX</span>
              <span className="f-brand-logo">P&G</span>
              <span className="f-brand-logo">PayPal</span>
              <span className="f-brand-logo">Payoneer</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Popular Services Carousel Section */}
      <section className="f-popular-carousel">
        <div className="f-section-inner">
          <h2 className="f-section-title">Popular services</h2>

          <ScrollReveal delay={0.1} className="f-popular-carousel-wrap">
            {/* Sliding Container */}
            <div className="f-popular-cards" style={{ transform: `translateX(-${carouselIndex * 50}px)`, transition: 'all 0.4s ease-out' }}>
              
              {/* Card 1: Vibe Coding */}
              <div className="f-pop-card vibe-coding" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                <div className="f-pop-card-header">
                  <span className="label">Code with AI</span>
                  <span className="title">Vibe Coding</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/vibe_coding.png" alt="Vibe Coding" className="f-pop-image" />
                </div>
              </div>

              {/* Card 2: Website Development */}
              <div className="f-pop-card web-dev" onClick={() => triggerSearchMatchmaker('Web Development')}>
                <div className="f-pop-card-header">
                  <span className="label">Build Your Presence</span>
                  <span className="title">Website Development</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/web_dev.png" alt="Website Development" className="f-pop-image" />
                </div>
              </div>

              {/* Card 3: Video Editing */}
              <div className="f-pop-card video-editing" onClick={() => triggerSearchMatchmaker('Video Editing')}>
                <div className="f-pop-card-header">
                  <span className="label">Engage Audience</span>
                  <span className="title">Video Editing</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/video_editing.png" alt="Video Editing" className="f-pop-image" />
                </div>
              </div>

              {/* Card 4: Software Development */}
              <div className="f-pop-card software-dev" onClick={() => triggerSearchMatchmaker('Web Development')}>
                <div className="f-pop-card-header">
                  <span className="label">Scale Architecture</span>
                  <span className="title">Software Development</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/software_dev.png" alt="Software Development" className="f-pop-image" />
                </div>
              </div>

              {/* Card 5: Book Publishing */}
              <div className="f-pop-card book-pub" onClick={() => triggerSearchMatchmaker('Content Writing')}>
                <div className="f-pop-card-header">
                  <span className="label">Write & Publish</span>
                  <span className="title">Book Publishing</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/book_publishing.png" alt="Book Publishing" className="f-pop-image" />
                </div>
              </div>

              {/* Card 6: Interior Design */}
              <div className="f-pop-card interior-design" onClick={() => triggerSearchMatchmaker('UI/UX Design')}>
                <div className="f-pop-card-header">
                  <span className="label">Model Spaces</span>
                  <span className="title">Interior Design</span>
                </div>
                <div className="f-pop-card-body">
                  <img src="/interior_design.png" alt="Interior Design" className="f-pop-image" />
                </div>
              </div>

            </div>

            {/* Carousel Navigation Arrows */}
            <button className="carousel-arrow prev" onClick={() => setCarouselIndex(0)}>&lt;</button>
            <button className="carousel-arrow next" onClick={() => setCarouselIndex(1)}>&gt;</button>
          </ScrollReveal>
        </div>
      </section>

      {/* Fiverr Style Mid-stripe: "Make it all happen with student experts" */}
      <section className="f-mid-stripe">
        <h2>Make it all happen with student specialists</h2>
        <button onClick={() => navigate('/register/student')}>Join now</button>

        <div className="f-icon-stripe">
          <ScrollReveal delay={0.1}>
            <div className="f-stripe-item" onClick={() => triggerSearchMatchmaker('Web Development')} style={{ cursor: 'pointer' }}>
              <span className="ico">🗂️</span>
              <h4>Over 42+ Skills</h4>
              <p>From Vibe Coding to reels editing, we offer specialists in every digital bracket.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="f-stripe-item" onClick={() => triggerSearchMatchmaker('UI/UX Design')} style={{ cursor: 'pointer' }}>
              <span className="ico">⚡</span>
              <h4>Verified Scores</h4>
              <p>No fake resumes. Every student takes standard test scores verified on-ledger.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="f-stripe-item" onClick={() => triggerSearchMatchmaker('Video Editing')} style={{ cursor: 'pointer' }}>
              <span className="ico">🛡️</span>
              <h4>UPI Escrow Shield</h4>
              <p>Funds are secured instantly and released only when deliverables are approved.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="f-stripe-item" onClick={() => triggerSearchMatchmaker('Digital Marketing')} style={{ cursor: 'pointer' }}>
              <span className="ico">💬</span>
              <h4>WhatsApp Sync</h4>
              <p>Instant milestones, updates, and chat syncing straight to your phone.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SkillNux Pro Forest Green Overlapping Banner */}
      <section className="f-pro-banner-section">
        <div className="f-section-inner" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <ScrollReveal delay={0.2} type="zoom-in" className="f-pro-banner">
            
            {/* Left Info Column */}
            <div className="f-pro-left">
              <div className="f-pro-logo">
                skillnux pro<span className="dot">.</span>
              </div>
              <h2>Let experts find the right student for you</h2>
              <div className="f-pro-bullets">
                <div className="f-pro-bullet">
                  <span className="check-circle">✓</span>
                  <span>Work with college experts who source, verify, and vet specialists for your project parameters</span>
                </div>
                <div className="f-pro-bullet">
                  <span className="check-circle">✓</span>
                  <span>Receive a structured matching ledger with pre-tested scorecard recommendations</span>
                </div>
                <div className="f-pro-bullet">
                  <span className="check-circle">✓</span>
                  <span>Hire vetted student talent with zero agency commissions and complete confidence</span>
                </div>
              </div>
              <button className="f-pro-btn" onClick={() => triggerSearchMatchmaker('Web Development')}>
                Discover expert sourcing
              </button>
              <div className="f-pro-badge-stripe">
                <span>🛡️</span> 100% money-back escrow guarantee
              </div>
            </div>

            {/* Right Stacked profiles Column */}
            <div className="f-pro-right">
              {/* Profile Card 1 */}
              <div className="f-pro-card c1" onClick={() => navigate('/register/student')}>
                <div className="f-pro-card-header">
                  <div className="f-pro-card-avatar" style={{ background: 'linear-gradient(135deg, #1dbf73 0%, #003912 100%)' }}>L</div>
                  <div>
                    <div className="f-pro-card-name">Lillian</div>
                    <div className="f-pro-card-title">Website Developer</div>
                  </div>
                </div>
                <div className="f-pro-card-body">
                  <div className="f-pro-rating">★ 5.0 <span className="count">(42 reviews)</span></div>
                  <div className="f-pro-score">Score: 9.8/10 • Verified</div>
                  <div className="f-pro-college">Delhi University • BCA</div>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="f-pro-card c2" onClick={() => navigate('/register/student')}>
                <div className="f-pro-card-header">
                  <div className="f-pro-card-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ff6b35 100%)' }}>D</div>
                  <div>
                    <div className="f-pro-card-name">Dan</div>
                    <div className="f-pro-card-title">SEO Specialist</div>
                  </div>
                </div>
                <div className="f-pro-card-body">
                  <div className="f-pro-rating">★ 4.9 <span className="count">(29 reviews)</span></div>
                  <div className="f-pro-score">Score: 9.4/10 • Verified</div>
                  <div className="f-pro-college">IIT Bombay • B.Tech</div>
                </div>
              </div>

              {/* Profile Card 3 */}
              <div className="f-pro-card c3" onClick={() => navigate('/register/student')}>
                <div className="f-pro-card-header">
                  <div className="f-pro-card-avatar" style={{ background: 'linear-gradient(135deg, #ff2d78 0%, #7c3aed 100%)' }}>S</div>
                  <div>
                    <div className="f-pro-card-name">Sneha</div>
                    <div className="f-pro-card-title">Video Editor</div>
                  </div>
                </div>
                <div className="f-pro-card-body">
                  <div className="f-pro-rating">★ 5.0 <span className="count">(54 reviews)</span></div>
                  <div className="f-pro-score">Score: 9.5/10 • Verified</div>
                  <div className="f-pro-college">Christ University • BBA</div>
                </div>
              </div>

            </div>

          </ScrollReveal>
        </div>
      </section>

      {/* AI Era Sleek Black card banner */}
      <section className="f-ai-era-section">
        <div className="f-section-inner" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <div className="f-ai-banner">
            
            {/* Left Info Column */}
            <div className="f-ai-left">
              <span className="label">AI Integration</span>
              <h2>The AI Director era<br />has arrived</h2>
              <p>From vision to final frame, work with pre-vetted AI specialists and prompt engineering experts to build scroll-stopping digital content, custom tools, and campaigns driving high conversions.</p>
              <button className="f-ai-btn" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                Find your AI Specialist
              </button>
            </div>

            {/* Right stacked cards Column */}
            <div className="f-ai-right">
              {/* Creator Card 1 */}
              <div className="f-ai-card" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                <div className="f-ai-card-img">
                  <div className="f-ai-card-name">Billy Boman</div>
                  <div className="f-ai-card-title">AI Art</div>
                </div>
              </div>

              {/* Creator Card 2 */}
              <div className="f-ai-card" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                <div className="f-ai-card-img">
                  <div className="f-ai-card-name">Alon Seifert</div>
                  <div className="f-ai-card-title">AI Films</div>
                </div>
              </div>

              {/* Creator Card 3 */}
              <div className="f-ai-card" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                <div className="f-ai-card-img">
                  <div className="f-ai-card-name">Haggar Shoval</div>
                  <div className="f-ai-card-title">AI Copy</div>
                </div>
              </div>

              {/* Creator Card 4 */}
              <div className="f-ai-card" onClick={() => triggerSearchMatchmaker('ChatGPT Prompting')}>
                <div className="f-ai-card-img">
                  <div className="f-ai-card-name">Julien Nicaud</div>
                  <div className="f-ai-card-title">AI Developer</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Success Stories section */}
      <section className="f-success-section">
        <div className="f-section-inner">
          <h2 className="f-section-title">What success on SkillNux looks like</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)', textAlign: 'center', marginBottom: '30px' }}>
            BakeBloom and local brands turn to SkillNux student experts to bring their vision to life.
          </p>

          <div className="f-success-showcase">
            <div className="f-success-video-container" style={{ cursor: 'default', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
              <video
                src="/bg2.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '16px' }}
              />
              <div className="f-success-subtitle" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', textAlign: 'center', color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '12px 20px', borderRadius: '10px', fontSize: '1rem', backdropFilter: 'blur(6px)' }}>
                "SkillNux connected us with a fantastic student team. We saved 70% creative fees and scaled online sales in 2 weeks!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard">
        <div className="lb-grid f-section-inner">
          <div className="lb-preview reveal-left">
            <div className="lb-head">
              <h4>🏆 College Leaderboard — Live</h4>
              <div className="lb-live"><div className="lb-live-dot"></div> Live</div>
            </div>
            <div className="lb-rows">
              <div className="lb-row" onClick={() => navigate('/register/student')} style={{ cursor: 'pointer' }}>
                <div className="lb-rank rank-1">🥇</div>
                <div className="lb-av av1">RS</div>
                <div className="lb-info"><div className="lb-name">Rohan Sharma</div><div className="lb-skill">UI/UX Design</div></div>
                <div><div className="lb-score">9.8</div><div className="lb-badge badge-gold">Top</div></div>
              </div>
              <div className="lb-row" onClick={() => navigate('/register/student')} style={{ cursor: 'pointer' }}>
                <div className="lb-rank rank-2">🥈</div>
                <div className="lb-av av2">PK</div>
                <div className="lb-info"><div className="lb-name">Priya Kapoor</div><div className="lb-skill">Content Writing</div></div>
                <div><div className="lb-score">9.4</div><div className="lb-badge badge-silver">Pro</div></div>
              </div>
              <div className="lb-row" onClick={() => navigate('/register/student')} style={{ cursor: 'pointer' }}>
                <div className="lb-rank rank-3">🥉</div>
                <div className="lb-av av3">AM</div>
                <div className="lb-info"><div className="lb-name">Arjun Mehta</div><div className="lb-skill">Web Development</div></div>
                <div><div className="lb-score">9.1</div></div>
              </div>
              <div className="lb-row" onClick={() => navigate('/register/student')} style={{ cursor: 'pointer' }}>
                <div className="lb-rank rank-other">4</div>
                <div className="lb-av" style={{ background: 'linear-gradient(135deg, var(--orange), var(--pink))' }}>SV</div>
                <div className="lb-info"><div className="lb-name">Sneha Verma</div><div className="lb-skill">Digital Marketing</div></div>
                <div><div className="lb-score">8.7</div></div>
              </div>
              <div className="lb-row" onClick={() => navigate('/register/student')} style={{ cursor: 'pointer' }}>
                <div className="lb-rank rank-other">5</div>
                <div className="lb-av" style={{ background: 'linear-gradient(135deg, #00b4d8, #0077b6)' }}>RJ</div>
                <div className="lb-info"><div className="lb-name">Rahul Joshi</div><div className="lb-skill">Video Editing</div></div>
                <div><div className="lb-score">8.5</div></div>
              </div>
            </div>
          </div>

          <div className="lb-right reveal-right">
            <span className="stag">College Leaderboard</span>
            <h3 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)', marginBottom: '16px' }}>
              Be the First to Top Your <span style={{ color: 'var(--f-green)' }}>College Leaderboard</span>
            </h3>
            <p style={{ color: 'var(--f-light-grey)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              Every college in our net has its own campus leaderboard. Compete with peers, submit verified project work, rise to the top, and get direct brand contracts!
            </p>
            <div className="lb-perks">
              <div className="lb-perk"><div className="lb-perk-icon">🏅</div>Earn exclusive "Campus Champion" badge</div>
              <div className="lb-perk"><div className="lb-perk-icon">🔥</div>Get featured on SkillNux Pro listing</div>
              <div className="lb-perk"><div className="lb-perk-icon">💼</div>Businesses select top matches directly</div>
              <div className="lb-perk"><div className="lb-perk-icon">⚡</div>Zero bids needed — matches auto-trigger</div>
            </div>
            <button onClick={() => navigate('/register/student')} className="f-nav-btn-join" style={{ background: 'var(--f-green)', color: '#fff', fontSize: '16px', padding: '12px 28px' }}>
              Join the Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how">
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>How It Works</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>Simple. Fast. Effective.</h2>
            <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)' }}>From listing parameters to approved payment ledger — pre-scored student matchmaking is automated.</p>
          </div>
          <div className="steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
            <div className="step reveal" style={{ transitionDelay: '.1s', background: '#fff', border: '1px solid #eee', padding: '24px', borderRadius: '10px' }}>
              <div className="sn" style={{ color: 'rgba(29, 191, 115, 0.15)', fontSize: '48px', fontWeight: '800' }}>01</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', margin: '12px 0' }}>Business Posts project</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Post your requirements — parameters, budget bracket, timeline. Instantly match available pools.</p>
            </div>
            <div className="step reveal" style={{ transitionDelay: '.2s', background: '#fff', border: '1px solid #eee', padding: '24px', borderRadius: '10px' }}>
              <div className="sn" style={{ color: 'rgba(29, 191, 115, 0.15)', fontSize: '48px', fontWeight: '800' }}>02</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', margin: '12px 0' }}>Automated Matchmaker</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Our engine assigns the top pre-tested student based on verified quiz score, ratings, and feedback.</p>
            </div>
            <div className="step reveal" style={{ transitionDelay: '.3s', background: '#fff', border: '1px solid #eee', padding: '24px', borderRadius: '10px' }}>
              <div className="sn" style={{ color: 'rgba(29, 191, 115, 0.15)', fontSize: '48px', fontWeight: '800' }}>03</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', margin: '12px 0' }}>Milestones & Escrow</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Funds are locked safely in Razorpay escrow ledger. Release only when deliverables pass checks.</p>
            </div>
            <div className="step reveal" style={{ transitionDelay: '.4s', background: '#fff', border: '1px solid #eee', padding: '24px', borderRadius: '10px' }}>
              <div className="sn" style={{ color: 'rgba(29, 191, 115, 0.15)', fontSize: '48px', fontWeight: '800' }}>04</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', margin: '12px 0' }}>Review & Rise</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Deliveries successfully update student ratings. High ratings trigger placement invites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Accordion Section */}
      <section id="skills" style={{ background: 'var(--f-light-bg)' }}>
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag stag-p" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Our Skill Domains</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>42 Student Skills. Pre-tested.</h2>
            <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)' }}>Discover specialists tested on advanced digital structures. Tap headers below to inspect skills.</p>
          </div>
          <div className="acc" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                cat: 'Digital Marketing',
                icon: '📣',
                count: '9 skills',
                skills: ['SEO & SEM', 'Social Media Management', 'Content Writing', 'Email Marketing', 'YouTube & Blog', 'Paid Ads (Meta/Google)', 'WhatsApp Marketing', 'Influencer Outreach', 'Online Reputation Management']
              },
              {
                cat: 'Design & Creative',
                icon: '🎨',
                count: '11 skills',
                skills: ['Logo & Brand Design', 'UI/UX Design', 'Video Editing', 'Thumbnail Design', 'Poster & Flyer', 'Motion Graphics', 'Reels & Short Video Editing', 'Product Photography Editing', 'Packaging Design', 'Pitch Deck Design', 'Canva Design']
              },
              {
                cat: 'Tech & Development',
                icon: '💻',
                count: '9 skills',
                skills: ['Web Development', 'No-Code & Automation', 'Database Management', 'API Integration', 'Landing Pages', 'Shopify Store Setup', 'WordPress Website', 'App UI Design', 'Chatbot Setup']
              },
              {
                cat: 'Business & Finance',
                icon: '📊',
                count: '9 skills',
                skills: ['Market Research', 'Data Entry & Analysis', 'Excel/Google Sheets', 'Presentations (PPT)', 'Business Writing', 'Customer Support', 'Amazon/Flipkart Listing', 'Hindi Content Writing', 'Regional Language Content']
              },
              {
                cat: 'AI & Automation',
                icon: '🤖',
                count: '4 skills — NEW 🔥',
                skills: ['ChatGPT Prompting', 'AI Image Generation', 'AI Video Creation', 'Notion/Zapier Automation']
              }
            ].map((item, idx) => (
              <div className="skill-domain-card reveal" key={idx} style={{ background: 'var(--card-dark)', border: '1px solid var(--border-dark)', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="skill-domain-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'var(--card-dark)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '24px' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-dark)' }}>{item.cat}</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted-dark)' }}>{item.count}</div>
                    </div>
                  </div>
                </div>
                
                <div className="skill-domain-body" style={{ padding: '0 24px 24px', background: 'var(--card-dark2)', borderTop: '1px solid var(--border-dark)' }}>
                  <div style={{ paddingTop: '16px' }}>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {item.skills.map((skill, sIdx) => (
                        <li 
                          key={sIdx} 
                          onClick={() => triggerSearchMatchmaker(skill)}
                          style={{ 
                            background: 'rgba(29, 191, 115, 0.1)',
                            border: '1px solid rgba(29, 191, 115, 0.2)',
                            color: 'var(--f-green)', 
                            fontSize: '13px',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { 
                            e.currentTarget.style.background = 'var(--f-green)'; 
                            e.currentTarget.style.color = '#fff'; 
                          }}
                          onMouseOut={(e) => { 
                            e.currentTarget.style.background = 'rgba(29, 191, 115, 0.1)'; 
                            e.currentTarget.style.color = 'var(--f-green)'; 
                          }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section id="audience">
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag stag-p" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Who Is It For</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>Built For Both Sides</h2>
            <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)' }}>Whether you're looking for pre-vetted specialists or standard student contracts.</p>
          </div>
          <div className="aug" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div className="auc auc-s reveal-left" style={{ background: '#fff', border: '1px solid #eee', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="aue" style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍🎓</div>
              <h3 style={{ fontSize: '24px', color: 'var(--f-black)', marginBottom: '16px', fontWeight: '700' }}>For Students & Freelancers</h3>
              <p style={{ color: 'var(--f-light-grey)', lineHeight: '1.6', fontSize: '15px', marginBottom: '20px' }}>
                Monetize your skill portfolio on your own campus bounds. Pass tests, work on matching contracts, secure payments instantly.
              </p>
              <ul className="aul" style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Complete test and boot your scorecard in 5 mins</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Secure escrow payments straight to your UPI ID</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Build verifiable commercial portfolio credentials</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Earn average ₹3,000 to ₹15,000 per project delivery</li>
              </ul>
              <button onClick={() => navigate('/register/student')} className="f-pro-btn" style={{ background: 'var(--f-green)', color: '#fff', marginTop: '30px' }}>
                Register as Student →
              </button>
            </div>
            <div className="auc auc-b reveal-right" style={{ background: '#fff', border: '1px solid #eee', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="aue" style={{ fontSize: '48px', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ fontSize: '24px', color: 'var(--f-black)', marginBottom: '16px', fontWeight: '700' }}>For Brands & Local Businesses</h3>
              <p style={{ color: 'var(--f-light-grey)', lineHeight: '1.6', fontSize: '15px', marginBottom: '20px' }}>
                Access verified campus specialists on demand. No tedious manual bidding pools or commission fees. Match and hire.
              </p>
              <ul className="aul" style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> View pre-screened matching scorecards in 2 mins</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Funds held safely in Razorpay escrow shield</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Direct WhatsApp milestone notifications & tracking</li>
                <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '8px' }}><span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>✓</span> Save up to 70% compared to typical design agency rates</li>
              </ul>
              <button onClick={() => navigate('/register/business')} className="f-pro-btn" style={{ background: 'var(--f-black)', color: '#fff', marginTop: '30px' }}>
                Register Your Business →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* College Tie ups Marquee */}
      <section id="colleges" style={{ background: '#fff' }}>
        <div className="f-section-inner" style={{ textAlign: 'center' }}>
          <span className="stag stag-o" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Partners & Network</span>
          <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)', marginBottom: '10px' }}>Students from Premier Colleges</h2>
          <div className="college-marquee" style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '20px 0', position: 'relative' }}>
            <div className="college-track" style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
              {['Delhi University', 'Mumbai University', 'IIT Bombay', 'BITS Pilani', 'VIT Vellore', 'SRM University', 'Amity University', 'LPU', 'Christ University', 'Delhi University', 'Mumbai University', 'IIT Bombay', 'BITS Pilani', 'VIT Vellore', 'SRM University'].map((c, i) => (
                <span className="college-pill" key={i} style={{ display: 'inline-block', background: '#f5f5f5', padding: '10px 24px', borderRadius: '50px', margin: '0 10px', fontSize: '15px', fontWeight: '600', color: '#555', border: '1px solid #eef' }}>{c}</span>
              ))}
            </div>
          </div>
          <div className="college-coming" style={{ fontSize: '14px', color: 'var(--f-light-grey)', marginTop: '20px' }}>Official college listings live in <span>50+ campuses</span> this year!</div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background: 'var(--f-light-bg)' }}>
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Testimonials</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>What People Are Saying</h2>
            <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)' }}>Direct feedback from pre-tested student experts and hiring MSMEs.</p>
          </div>
          <div className="tg" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="tc-card reveal" style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="ts" style={{ color: '#ffb300', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
              <p className="tt" style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "I joined SkillNux in my 2nd BCA semester. Cleared the web development test, and matched with a Bangalore brand. Handled 4 portal projects and earned ₹25,000! Escrow payments hit my UPI instantly."
              </p>
              <div className="ta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="tav av1" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>RS</div>
                <div><div className="tn" style={{ fontWeight: '700', fontSize: '14px', color: '#222' }}>Rohan Sharma</div><div className="tr" style={{ fontSize: '11px', color: 'var(--f-light-grey)' }}>Student, XYZ College</div></div>
              </div>
            </div>
            <div className="tc-card reveal" style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="ts" style={{ color: '#ffb300', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
              <p className="tt" style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "We needed a logo and Instagram social layout quickly. MSME agencies quoted astronomical rates. Matchmaker matched us with Priya, who delivered gorgeous designs on a fraction of the cost."
              </p>
              <div className="ta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="tav av2" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SS</div>
                <div><div className="tn" style={{ fontWeight: '700', fontSize: '14px', color: '#222' }}>Siddharth Sen</div><div className="tr" style={{ fontSize: '11px', color: 'var(--f-light-grey)' }}>Co-founder, BakeBloom</div></div>
              </div>
            </div>
            <div className="tc-card reveal" style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="ts" style={{ color: '#ffb300', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
              <p className="tt" style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "The scoring quiz has excellent quality coding blocks. Earning a verified score gave me complete confidence when matching with real projects. Leaderboards keep all our college peers highly competitive!"
              </p>
              <div className="ta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="tav av3" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AM</div>
                <div><div className="tn" style={{ fontWeight: '700', fontSize: '14px', color: '#222' }}>Arjun Mehta</div><div className="tr" style={{ fontSize: '11px', color: 'var(--f-light-grey)' }}>B.Tech Student, DU</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section id="smartfeatures">
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag stag-p" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Platform Features</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>Engineered for Frictionless Trust</h2>
          </div>
          <div className="sf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            <div className="sf-card reveal" style={{ transitionDelay: '.1s', background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px' }}>
              <div className="sf-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>UPI Escrow Protection</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Funds locked securely on-contract trigger, released instantly to student UPI only when deliverables are verified by client.</p>
            </div>
            <div className="sf-card reveal" style={{ transitionDelay: '.2s', background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px' }}>
              <div className="sf-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>Automatic Skill Scoring</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Zero resume resume inflation. Student registers, completes a timed skill quiz, scorecard updates verified ledger badges.</p>
            </div>
            <div className="sf-card reveal" style={{ transitionDelay: '.3s', background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '12px' }}>
              <div className="sf-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>WhatsApp Integration</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.5' }}>Get matching nodes, milestones, escrow confirmations, and chat transitions pushed straight to WhatsApp numbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Login Callbox */}
      <section id="signin" style={{ background: 'var(--f-light-bg)' }}>
        <div className="f-section-inner" style={{ maxWidth: '800px' }}>
          <div className="si-wrap reveal" style={{ textAlign: 'center' }}>
            <span className="stag" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Get Started</span>
            <h2 style={{ fontSize: '32px', color: 'var(--f-black)', margin: '10px 0' }}>Access Your Portal</h2>
            <p style={{ color: 'var(--f-light-grey)', marginBottom: '30px' }}>Log in to post projects or view your dashboard assignments</p>
            <div className="si-box" style={{ background: '#fff', border: '1px solid #eee', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--f-black)', fontWeight: '700', marginBottom: '12px' }}>Unified Sign-In Portal</h3>
              <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', marginBottom: '30px' }}>Redirecting to secure login dashboard...</p>
              <div className="sibs" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px', margin: '0 auto' }}>
                <button onClick={() => navigate('/login')} className="sbtn se" style={{ background: 'var(--f-green)', color: '#fff', border: 'none', outline: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>🔑 Enter Secure Portal →</button>
                <div className="sdiv" style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>or create new account</div>
                <button onClick={() => navigate('/register/student')} className="sbtn sa" style={{ background: '#fff', color: '#111', border: '1px solid #ddd', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🎓 Join as Student</button>
                <button onClick={() => navigate('/register/business')} className="sbtn sg" style={{ background: '#fff', color: '#111', border: '1px solid #ddd', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🏢 Join as Business</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <div className="f-section-inner abg" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px' }}>
          <div className="reveal-left">
            <span className="stag" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Our Mission</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)', margin: '12px 0' }}>Bridging the Gap Between Classroom & Commerce</h2>
            <div className="abt" style={{ fontSize: '15px', color: 'var(--f-light-grey)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p>In India, millions of college students possess immense digital skills — design, copywriting, coding, video editing — yet lack structural avenues to monetize their talent due to traditional "experience barriers".</p>
              <p>At the same time, thousands of local MSMEs and startups struggle with high agency charges. We created SkillNux to build a transparent, verification-first marketplace bridging this gap permanently.</p>
            </div>
            <div className="abv" style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
              <div className="vc">
                <div className="vi" style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
                <div className="vt" style={{ fontWeight: '700', fontSize: '15px', color: '#222' }}>100% Trusted</div>
                <div className="vd" style={{ fontSize: '12px', color: 'var(--f-light-grey)' }}>Verified student scorecard</div>
              </div>
              <div className="vc">
                <div className="vi" style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
                <div className="vt" style={{ fontWeight: '700', fontSize: '15px', color: '#222' }}>Instant Match</div>
                <div className="vd" style={{ fontSize: '12px', color: 'var(--f-light-grey)' }}>No manual bid lists</div>
              </div>
            </div>
          </div>

          <div className="abvis reveal-right" style={{ background: 'var(--f-light-bg)', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="mi" style={{ display: 'flex', gap: '16px' }}>
              <div className="mico" style={{ fontSize: '24px' }}>💡</div>
              <div className="mt">
                <h4 style={{ color: 'var(--f-black)', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Practical Portfolios</h4>
                <p style={{ color: 'var(--f-light-grey)', fontSize: '13px', lineHeight: '1.4' }}>Students display real-world tasks, giving brands clear proofs instead of dry grades.</p>
              </div>
            </div>
            <div className="mi" style={{ display: 'flex', gap: '16px' }}>
              <div className="mico" style={{ fontSize: '24px' }}>🤝</div>
              <div className="mt">
                <h4 style={{ color: 'var(--f-black)', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Fair Compensation</h4>
                <p style={{ color: 'var(--f-light-grey)', fontSize: '13px', lineHeight: '1.4' }}>Upholding strict parameters per gig category to protect student efforts against under-cutting.</p>
              </div>
            </div>
            <div className="mi" style={{ display: 'flex', gap: '16px' }}>
              <div className="mico" style={{ fontSize: '24px' }}>🏆</div>
              <div className="mt">
                <h4 style={{ color: 'var(--f-black)', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Campus Leaderboard</h4>
                <p style={{ color: 'var(--f-light-grey)', fontSize: '13px', lineHeight: '1.4' }}>Creates micro-competition in college nodes. Rising to top triggers matching nodes instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={{ background: 'var(--f-dark-green)', color: '#fff' }}>
        <div className="f-section-inner ctac reveal" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>Ready to Unlock Your Potential?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '16px' }}>Join India's fastest-growing student-to-brand marketplace. Setup takes under 5 minutes.</p>
          <form className="ctaf" onSubmit={handleWaitlistSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto 20px' }}>
            <input
              type="email"
              className="ctai"
              placeholder="Enter your email address"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              required
              style={{ flex: '1', border: 'none', outline: 'none', padding: '14px 20px', borderRadius: '6px', fontSize: '15px' }}
            />
            <button type="submit" className="f-nav-btn-join" style={{ background: 'var(--f-green)', color: '#fff', border: 'none', padding: '0 28px', fontSize: '15px', height: '48px' }}>Join Waitlist</button>
          </form>
          <div className="cta-note" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>🚀 Over <span>700+</span> matches made this month!</div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="f-section-inner">
          <div className="tc reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="stag stag-o" style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>Get In Touch</span>
            <h2 className="sec-title" style={{ fontSize: '32px', color: 'var(--f-black)' }}>Have Questions? We're Here</h2>
            <p className="sec-sub mxa" style={{ color: 'var(--f-light-grey)' }}>Send us a message or contact our team directly. We respond within 2 hours.</p>
          </div>
          <div className="cog" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '60px' }}>
            <div className="coi reveal-left" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="cit" style={{ display: 'flex', gap: '16px' }}>
                <div className="cion" style={{ fontSize: '24px' }}>📍</div>
                <div><div className="cl" style={{ fontWeight: '700', color: 'var(--f-black)', marginBottom: '4px' }}>Headquarters</div><div className="cv" style={{ fontSize: '14px', color: 'var(--f-light-grey)' }}>WeWork, ORR, Bangalore, India</div></div>
              </div>
              <div className="cit" style={{ display: 'flex', gap: '16px' }}>
                <div className="cion" style={{ fontSize: '24px' }}>📧</div>
                <div><div className="cl" style={{ fontWeight: '700', color: 'var(--f-black)', marginBottom: '4px' }}>Email Address</div><div className="cv" style={{ fontSize: '14px', color: 'var(--f-light-grey)' }}>support@skillnux.in</div></div>
              </div>
              <div className="cit" style={{ display: 'flex', gap: '16px' }}>
                <div className="cion" style={{ fontSize: '24px' }}>📞</div>
                <div><div className="cl" style={{ fontWeight: '700', color: 'var(--f-black)', marginBottom: '4px' }}>WhatsApp Helpline</div><div className="cv" style={{ fontSize: '14px', color: 'var(--f-light-grey)' }}>+91 88922 41108</div></div>
              </div>
            </div>

            <form className="cof reveal-right" onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                className="cfi"
                placeholder="Your Full Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
              <input
                type="email"
                className="cfi"
                placeholder="Email Address"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              />
              <textarea
                className="cfi"
                placeholder="Your Message..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', height: '120px', resize: 'none' }}
              ></textarea>
              <button type="submit" className="bsub" style={{ background: 'var(--f-green)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start' }}>✉ Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section id="legal" style={{ background: 'var(--f-light-bg)' }}>
        <div className="f-section-inner" style={{ maxWidth: '900px' }}>
          <div className="ltabs" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
            <button className={`ltab ${activeLegalTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveLegalTab('terms')} style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', color: activeLegalTab === 'terms' ? 'var(--f-green)' : '#666', borderBottom: activeLegalTab === 'terms' ? '2px solid var(--f-green)' : 'none' }}>Terms & Conditions</button>
            <button className={`ltab ${activeLegalTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveLegalTab('privacy')} style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', color: activeLegalTab === 'privacy' ? 'var(--f-green)' : '#666', borderBottom: activeLegalTab === 'privacy' ? '2px solid var(--f-green)' : 'none' }}>Privacy Policy</button>
            <button className={`ltab ${activeLegalTab === 'escrow' ? 'active' : ''}`} onClick={() => setActiveLegalTab('escrow')} style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', color: activeLegalTab === 'escrow' ? 'var(--f-green)' : '#666', borderBottom: activeLegalTab === 'escrow' ? '2px solid var(--f-green)' : 'none' }}>Escrow Rules</button>
          </div>

          {activeLegalTab === 'terms' && (
            <div className="lc active">
              <div className="lbox" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>1. General Agreement</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6', marginBottom: '20px' }}>By registering on SkillNux, students and businesses agree to uphold professional integrity and maintain transparent communications. Payments are strictly milestone-based.</p>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>2. Student Conduct</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6' }}>Plagiarism or generative AI outputs without client consent will result in immediate profile suspension and forfeiture of escrow payments.</p>
              </div>
            </div>
          )}

          {activeLegalTab === 'privacy' && (
            <div className="lc active">
              <div className="lbox" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>1. Personal Information</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6', marginBottom: '20px' }}>We store name, email, WhatsApp, college name, and UPI ID securely. UPI details are encrypted and strictly used for outward transfers of approved earnings.</p>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>2. Data Sharing</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6' }}>Student statistics (quiz scores, leaderboard status) are public. Student phone numbers are only shared with a business once a hiring contract starts.</p>
              </div>
            </div>
          )}

          {activeLegalTab === 'escrow' && (
            <div className="lc active">
              <div className="lbox" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>1. Escrow Policy</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6', marginBottom: '20px' }}>All projects exceeding ₹2,000 must utilize our secure escrow system. The business deposits budget up-front. Money is held securely during contract duration.</p>
                <h3 style={{ fontSize: '18px', color: 'var(--f-black)', marginBottom: '10px', fontWeight: '700' }}>2. Milestone Release</h3>
                <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6' }}>Upon submission of deliverables, the business has 72 hours to review and approve, or request modifications. If no action is taken within 72 hours, funds are auto-released.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--f-grey-border)', padding: '60px 0' }}>
        <div className="fg f-section-inner" style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '40px' }}>
          <div className="fb">
            <span className="logo-name" style={{ fontSize: '24px', fontWeight: '800', display: 'block', marginBottom: '12px', color: 'var(--f-black)' }}>SkillNux<span style={{ color: 'var(--f-green)' }}>.</span></span>
            <p style={{ fontSize: '14px', color: 'var(--f-light-grey)', lineHeight: '1.6', marginBottom: '16px' }}>India's first dedicated student micro-gigs marketplace. Turn your passion into professional portfolio assets.</p>
            <div className="tgbadge" style={{ fontSize: '12px', color: 'var(--f-green)', fontWeight: 'bold' }}><span className="td">✓</span> Secured by Razorpay Escrow</div>
          </div>
          <div className="fc">
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--f-black)', marginBottom: '16px' }}>For Students</h4>
            <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><button onClick={() => navigate('/register/student')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Join Leaderboard</button></li>
              <li><span onClick={() => scrollToAccordion(1)} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Explore Skills</span></li>
              <li><button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Portal Login</button></li>
            </ul>
          </div>
          <div className="fc">
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--f-black)', marginBottom: '16px' }}>For Brands</h4>
            <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><button onClick={() => navigate('/register/business')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Post Project</button></li>
              <li><span onClick={() => scrollToId('about')} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Our Network</span></li>
              <li><span onClick={() => scrollToId('contact')} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Helpline</span></li>
            </ul>
          </div>
          <div className="fc">
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--f-black)', marginBottom: '16px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><span onClick={() => { setActiveLegalTab('escrow'); scrollToId('legal'); }} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Escrow T&C</span></li>
              <li><span onClick={() => { setActiveLegalTab('privacy'); scrollToId('legal'); }} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Privacy Rules</span></li>
              <li><span onClick={() => scrollToId('contact')} style={{ cursor: 'pointer', color: 'var(--f-light-grey)', fontSize: '14px' }}>Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="fbot f-section-inner" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--f-grey-border)', paddingTop: '24px', marginTop: '40px', fontSize: '13px', color: 'var(--f-light-grey)' }}>
          <p>© 2026 SkillNux Technologies Private Limited. All rights reserved.</p>
          <div className="socials" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://wa.me/918892241108" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#555', fontSize: '16px' }}>💬</a>
            <a href="https://instagram.com/skillnux" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#555', fontSize: '16px' }}>📸</a>
            <a href="https://linkedin.com/company/skillnux" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#555', fontSize: '16px' }}>💼</a>
          </div>
        </div>
      </footer>

      {/* Float Actions */}
      <div className="floats">
        <a href="https://wa.me/918892241108" target="_blank" rel="noopener noreferrer" className="fwa" title="WhatsApp Support">
          <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.016 14.11 1 11.999 1c-5.439 0-9.862 4.373-9.866 9.801-.002 1.706.46 3.376 1.338 4.832L2.456 20.35l4.191-1.196zm12.106-5.076c-.328-.163-1.924-.949-2.216-1.055-.293-.106-.507-.16-.721.162-.213.322-.83.1.045-.213.753-.292.099-.585-.079-.162-.648-.262-.313-.42-.162-.16-.312.001-.465-.327-.163-.327.327-.927 1.554-1.895 1.228-.968-.328-.216-.48-.48-.153-.262-.162-.686.071-.789.262-.103.191-.103.328-.051.46.051.13.213.328.328.46.103.13.882 1.344 2.138 1.886.299.129.533.206.716.264.3.095.572.081.789.049.24-.036.721-.295.823-.58.101-.285.101-.527.071-.58-.03-.053-.102-.085-.43-.248z"/></svg>
        </a>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ftop" title="Back to Top">▲</button>
      </div>

      {/* Smart Search Matchmaker Overlay Modal */}
      {showSearchPanel && (
        <div className="f-search-modal-backdrop" onClick={() => setShowSearchPanel(false)}>
          <div className="f-search-modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="f-search-modal-header">
              <h3>
                <span className="pulse-dot"></span>
                SkillNux Pro Talent Matchmaker — "{searchedCategory}"
              </h3>
              <button className="f-search-modal-close-btn" onClick={() => setShowSearchPanel(false)}>×</button>
            </div>

            {/* Modal Split Body */}
            <div className="f-search-modal-body">
              
              {/* Left Column: Candidates List */}
              <div className="f-candidates-column">
                {searchLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--f-light-grey)' }}>
                    <div className="f-escrow-spinner"></div>
                    <p style={{ marginTop: '12px', fontWeight: '600' }}>Scanning college talent databases...</p>
                  </div>
                ) : matchedCandidates.length === 0 ? (
                  <div className="f-candidate-list-empty" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted-dark)' }}>
                    <h3>No talent match is found on this website.</h3>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try searching for Web Development, Digital Marketing, Video Editing, or Design.</p>
                  </div>
                ) : (
                  matchedCandidates.map((candidate, index) => (
                    <div
                      key={index}
                      className={`f-candidate-list-card ${selectedCandidate?.email === candidate?.email ? 'active' : ''}`}
                      onClick={() => navigate('/register/student')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="f-candidate-list-card-avatar" style={{ background: index % 2 === 0 ? 'linear-gradient(135deg, #1dbf73 0%, #003912 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #ff6b35 100%)' }}>
                        {String(candidate?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="f-candidate-list-card-info">
                        <div className="f-candidate-list-card-header">
                          <div className="f-candidate-list-card-name">{candidate?.name || 'Anonymous Student'}</div>
                          <div className="f-candidate-list-card-rating">
                            ★ {candidate?.rating || '5.0'} <span className="count">({candidate?.reviews || 0} reviews)</span>
                          </div>
                        </div>
                        <div className="f-candidate-list-card-college">
                          {candidate?.college || 'Verified Campus'} • {candidate?.course || 'Student'}
                        </div>
                        <span className="f-candidate-list-card-skill-badge">
                          {candidate?.skill || searchedCategory}
                        </span>
                        
                        {/* Score progress bar */}
                        <div className="f-candidate-list-card-score-wrap">
                          <span className="f-candidate-list-card-score-lbl">Test Score:</span>
                          <div className="f-candidate-list-card-progress">
                            <div
                              className="f-candidate-list-card-progress-bar"
                              style={{ width: `${(candidate?.score || 4) * 20}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="f-candidate-list-card-action-column">
                        <div className="f-candidate-list-card-score-val">
                          {((candidate?.score || 4) * 2).toFixed(1)}/10
                        </div>
                        <button
                          className="f-candidate-list-card-hire-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCandidateForEscrow(candidate);
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Escrow Checkout Drawer */}
              <div className="f-escrow-column">
                {!selectedCandidate ? (
                  <div className="f-escrow-placeholder">
                    <div className="ico">🛡️</div>
                    <h4 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--f-black)', marginBottom: '8px' }}>UPI Escrow Protection</h4>
                    <p style={{ fontSize: '13px', lineHeight: '1.5' }}>Select a verified student specialist from the left panel to lock milestone budget, generate secure matching contract, and send invitation.</p>
                  </div>
                ) : (
                  <div className="f-escrow-form-container">
                    
                    {escrowStep === 0 && (
                      <form onSubmit={handleLockEscrow} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                        <div className="f-escrow-header-strip">
                          <h4>Hire {selectedCandidate.name}</h4>
                          <p>Secured by <strong>Razorpay Escrow Shield</strong></p>
                        </div>

                        <div className="f-escrow-input-group">
                          <label>Project Title / Milestone Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Design BakeBloom Instagram Layout"
                            value={hiringTitle}
                            onChange={(e) => setHiringTitle(e.target.value)}
                            required
                          />
                        </div>

                        <div className="f-escrow-input-group">
                          <label>Brief Project Description</label>
                          <textarea
                            placeholder="State clear deliverables, file formats, and project standard parameters..."
                            value={hiringDesc}
                            onChange={(e) => setHiringDesc(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        <div className="f-escrow-input-group">
                          <label>Lock Milestone Budget (INR)</label>
                          <select
                            value={hiringBudget}
                            onChange={(e) => setHiringBudget(e.target.value)}
                          >
                            <option value="2000">₹2,000 (Basic Assets Gigs)</option>
                            <option value="5000">₹5,000 (Standard Delivery)</option>
                            <option value="10000">₹10,000 (Pro Campaign Package)</option>
                            <option value="15000">₹15,000 (Full-Scale System)</option>
                          </select>
                        </div>

                        <div className="f-escrow-input-group">
                          <label>Your Corporate / Business Email</label>
                          <input
                            type="email"
                            placeholder="e.g. founder@mybrand.com"
                            value={hiringEmail}
                            onChange={(e) => setHiringEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Razorpay fees calculations */}
                        <div className="f-razorpay-stripe">
                          <div className="f-razorpay-stripe-row">
                            <span>Milestone Budget:</span>
                            <span>₹{parseInt(hiringBudget).toLocaleString()}</span>
                          </div>
                          <div className="f-razorpay-stripe-row">
                            <span>UPI Escrow setup fee:</span>
                            <span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>₹0 (FREE GIGS)</span>
                          </div>
                          <div className="f-razorpay-stripe-row total">
                            <span>Total to Escrow:</span>
                            <span>₹{parseInt(hiringBudget).toLocaleString()}</span>
                          </div>
                        </div>

                        <button type="submit" className="f-escrow-confirm-btn">
                          🔒 Lock Milestone Escrow
                        </button>
                      </form>
                    )}

                    {escrowStep === 1 && (
                      <div className="f-escrow-loading-screen">
                        <div className="f-escrow-spinner"></div>
                        <div className="f-escrow-loading-status">UPI ESCROW SYNC ACTIVE</div>
                        <p className="f-escrow-loading-sub" style={{ minHeight: '40px' }}>{escrowStatusText}</p>
                      </div>
                    )}

                    {escrowStep === 2 && (
                      <div className="f-escrow-success-screen">
                        <div className="f-escrow-success-seal">🏆</div>
                        <h4>Escrow Handshake Complete!</h4>
                        <p>UPI Milestone budget of <strong>₹{parseInt(hiringBudget).toLocaleString()}</strong> is securely locked in trust ledger.</p>

                        <div className="f-escrow-success-details">
                          <div className="f-escrow-success-details-row">
                            <span>Vetted Student:</span>
                            <span>{selectedCandidate.name}</span>
                          </div>
                          <div className="f-escrow-success-details-row">
                            <span>Project:</span>
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }}>{hiringTitle}</span>
                          </div>
                          <div className="f-escrow-success-details-row">
                            <span>Escrow Locked:</span>
                            <span style={{ color: 'var(--f-green)', fontWeight: 'bold' }}>₹{parseInt(hiringBudget).toLocaleString()}</span>
                          </div>
                          <div className="f-escrow-success-details-row">
                            <span>WhatsApp notification:</span>
                            <span style={{ color: 'var(--f-green)' }}>Sent ✅</span>
                          </div>
                        </div>

                        <div className="f-escrow-success-actions">
                          <button
                            className="f-escrow-success-btn primary"
                            onClick={() => {
                              setShowSearchPanel(false);
                              navigate('/login');
                            }}
                          >
                            Enter Dashboard
                          </button>
                          <button
                            className="f-escrow-success-btn secondary"
                            onClick={() => {
                              window.open(`https://wa.me/918892241108?text=Hello!%20I%20have%20locked%20an%20escrow%20milestone%20contract%20for%20student%20${selectedCandidate.name}%20budget%20Rs%20${hiringBudget}%20on%20SkillNux.`, '_blank');
                            }}
                          >
                            WhatsApp Support
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Video Success Testimonial Modal Popup */}
      {showVideoModal && (
        <div className="f-video-modal-backdrop" onClick={() => setShowVideoModal(false)}>
          <div className="f-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="f-video-modal-close" onClick={() => setShowVideoModal(false)}>×</button>
            <iframe
              className="f-video-modal-iframe"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="SkillNux Student Success Stories Case Study Testimonial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </PageEntrance>
  );
}
