import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

    // Floating particles
    const container = document.getElementById('particles');
    if (container) {
      container.innerHTML = '';
      for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = p.style.height = Math.random() * 6 + 2 + 'px';
        p.style.background = Math.random() > 0.5 ? 'var(--cyan)' : 'var(--purple)';
        p.style.animationDuration = Math.random() * 8 + 6 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
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

  return (
    <>
      {/* Particles Floating Backdrop */}
      <div id="particles"></div>

      {/* Navigation */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a className="nav-logo" href="#hero">
          <div className="logo-circle"><span>SN</span></div>
          <span className="logo-name">Skill<em>Nux</em></span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#leaderboard">Leaderboard</a></li>
          <li><a href="#audience">For You</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-btns">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/register/student')}>Join Free →</button>
        </div>
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#how" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
        <a href="#leaderboard" onClick={() => setMobileMenuOpen(false)}>Leaderboard</a>
        <a href="#audience" onClick={() => setMobileMenuOpen(false)}>For You</a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
        <a href="#signin" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</a>
      </div>

      {/* Hero Section */}
      <section id="hero">
        <div className="hero-inner">
          <div className="mesh-bg">
            <div className="blob b1"></div>
            <div className="blob b2"></div>
            <div className="blob b3"></div>
            <div className="blob b4"></div>
          </div>
          <div className="grid-ov"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="bdot"></span> India's Student Skill Marketplace
            </div>
            <h1>Turn Your Skills Into<br /><span className="grad">Real Opportunities</span></h1>
            <p className="hero-sub">SkillNux connects talented students with businesses that need real work done. No experience needed — just your skill. Learn, earn, and grow.</p>
            
            <div className="hero-btns">
              <button onClick={() => navigate('/register/student')} className="btn-h btn-hm">🎓 I'm a Student — Join Free</button>
              <button onClick={() => navigate('/register/business')} className="btn-h btn-hs" style={{ borderColor: 'var(--purple2)', color: 'var(--purple2)' }}>🏢 I'm a Business — Post a Project</button>
              <a href="#how" className="btn-h btn-hs">See How It Works ↓</a>
            </div>

            <div className="hero-stats" ref={statsSectionRef}>
              <div className="hs">
                <div className="hs-n">{stats.students}+</div>
                <div className="hs-l">Students Ready</div>
              </div>
              <div className="hs">
                <div className="hs-n">{stats.businesses}+</div>
                <div className="hs-l">Businesses</div>
              </div>
              <div className="hs">
                <div className="hs-n">{stats.colleges}+</div>
                <div className="hs-l">Colleges</div>
              </div>
              <div className="hs">
                <div className="hs-n">Free</div>
                <div className="hs-l">To Join</div>
              </div>
            </div>
          </div>

          <div className="phone-outer" style={{ position: 'relative', zIndex: 1, animation: 'fadeUp .6s .5s ease both', marginTop: '50px' }}>
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-nav">
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--white)' }}>Skill<span style={{ color: 'var(--cyan)' }}>Nux</span></span>
                  <span style={{ fontSize: '14px' }}>🔔</span>
                </div>
                <div className="phone-welcome">Welcome back 👋</div>
                <div className="phone-uname">Your Dashboard</div>
                <div className="phone-cards">
                  <div className="phone-card">
                    <div className="pc-label">Active Projects</div>
                    <div className="pc-value">12</div>
                    <div className="pc-change">↑ 3 this week</div>
                  </div>
                  <div className="phone-card" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(124,58,237,0.15))' }}>
                    <div className="pc-label">Total Earned</div>
                    <div className="pc-value" style={{ color: 'var(--orange)' }}>₹24K</div>
                    <div className="pc-change">↑ ₹4K this month</div>
                  </div>
                </div>
                <div className="phone-sec-title">Recent Projects</div>
                <div className="phone-project">
                  <div className="pp-icon">🎨</div>
                  <div className="pp-info">
                    <div className="pp-name">Logo Design — TechCo</div>
                    <div className="pp-tag">Design • ₹3,500</div>
                  </div>
                  <div className="pp-status pnew">New</div>
                </div>
                <div className="phone-project">
                  <div className="pp-icon">📣</div>
                  <div className="pp-info">
                    <div className="pp-name">SEO — BakeBloom</div>
                    <div className="pp-tag">Marketing • ₹5,000</div>
                  </div>
                  <div className="pp-status pactive">Active</div>
                </div>
                <div className="phone-project">
                  <div className="pp-icon">💻</div>
                  <div className="pp-info">
                    <div className="pp-name">Landing Page — StartupX</div>
                    <div className="pp-tag">Web Dev • ₹8,000</div>
                  </div>
                  <div className="pp-status preview">Review</div>
                </div>
                <div className="phone-bottom-nav">
                  <span>🏠</span><span>📋</span>
                  <span style={{ background: 'linear-gradient(135deg, var(--orange), var(--purple))', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>+</span>
                  <span>💬</span><span>⚙️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how">
        <div className="tc reveal">
          <span className="stag">How It Works</span>
          <h2 className="sec-title">Simple. Fast. Effective.</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--muted-dark)' }}>From posting a project to delivering results — smooth, verified, and transparent.</p>
        </div>
        <div className="steps">
          <div className="step reveal" style={{ transitionDelay: '.1s' }}>
            <div className="sn">01</div>
            <h3>Business Posts a Project</h3>
            <p>Register your business, describe what you need — design, marketing, development — and submit in minutes.</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: '.2s' }}>
            <div className="sn">02</div>
            <h3>We Match the Best Talent</h3>
            <p>Our smart ranking system picks the top student based on skill score, ratings, completion rate, and response time. No guesswork.</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: '.3s' }}>
            <div className="sn">03</div>
            <h3>Work Happens, Both Grow</h3>
            <p>Students deliver quality work and earn real income. Businesses get results without agency-level pricing.</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: '.4s' }}>
            <div className="sn">04</div>
            <h3>Review & Repeat</h3>
            <p>Both sides review each other. Students climb the college leaderboard. Businesses can favourite and rehire their best matches.</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ background: 'var(--light-bg)' }}>
        <div className="tc reveal">
          <span className="stag stag-p">What We Offer</span>
          <h2 className="sec-title" style={{ color: 'var(--text-light)' }}>42 Skills. Every Industry.</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--muted-light)' }}>Our marketplace covers in-demand skills across every industry. Tap a category to explore.</p>
        </div>
        <div className="acc">
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
            <div className={`ai reveal ${openAccordion === idx ? 'open' : ''}`} key={idx} style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="ah" onClick={() => toggleAccordion(idx)}>
                <div className="al">
                  <div className="aico">{item.icon}</div>
                  <div>
                    <div className="at">{item.cat}</div>
                    <div className="ac">{item.count}</div>
                  </div>
                </div>
                <div className="arr">▼</div>
              </div>
              <div className="ab" style={{ maxHeight: openAccordion === idx ? '400px' : '0', paddingBottom: openAccordion === idx ? '20px' : '0', transition: 'all 0.4s ease' }}>
                <div className="abi">
                  {item.skills.map((skill, sIdx) => (
                    <span className="chip" key={sIdx}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section id="leaderboard">
        <div className="lb-grid">
          <div className="lb-preview reveal-left">
            <div className="lb-head">
              <h4>🏆 College Leaderboard — Live</h4>
              <div className="lb-live"><div className="lb-live-dot"></div> Live</div>
            </div>
            <div className="lb-rows">
              <div className="lb-row">
                <div className="lb-rank rank-1">🥇</div>
                <div className="lb-av av1">RS</div>
                <div className="lb-info"><div className="lb-name">Rohan Sharma</div><div className="lb-skill">UI/UX Design</div></div>
                <div><div className="lb-score">9.8</div><div className="lb-badge badge-gold">Top</div></div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-2">🥈</div>
                <div className="lb-av av2">PK</div>
                <div className="lb-info"><div className="lb-name">Priya Kapoor</div><div className="lb-skill">Content Writing</div></div>
                <div><div className="lb-score">9.4</div><div className="lb-badge badge-silver">Pro</div></div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-3">🥉</div>
                <div className="lb-av av3">AM</div>
                <div className="lb-info"><div className="lb-name">Arjun Mehta</div><div className="lb-skill">Web Development</div></div>
                <div><div className="lb-score">9.1</div></div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-other">4</div>
                <div className="lb-av" style={{ background: 'linear-gradient(135deg, var(--orange), var(--pink))' }}>SV</div>
                <div className="lb-info"><div className="lb-name">Sneha Verma</div><div className="lb-skill">Digital Marketing</div></div>
                <div><div className="lb-score">8.7</div></div>
              </div>
              <div className="lb-row">
                <div className="lb-rank rank-other">5</div>
                <div className="lb-av" style={{ background: 'linear-gradient(135deg, #00b4d8, #0077b6)' }}>RJ</div>
                <div className="lb-info"><div className="lb-name">Rahul Joshi</div><div className="lb-skill">Video Editing</div></div>
                <div><div className="lb-score">8.5</div></div>
              </div>
            </div>
          </div>

          <div className="lb-right reveal-right">
            <span className="stag">College Leaderboard</span>
            <h3 className="sec-title">Be the First to Top Your <span className="grad">College Leaderboard</span></h3>
            <p style={{ color: 'var(--muted-dark)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>Every college has its own leaderboard. Compete with your peers, rise to the top, and become the go-to student in your campus.</p>
            <div className="lb-perks">
              <div className="lb-perk"><div className="lb-perk-icon">🏅</div>Earn exclusive "Campus Champion" certificate</div>
              <div className="lb-perk"><div className="lb-perk-icon">🔥</div>Get featured on SkillNux homepage</div>
              <div className="lb-perk"><div className="lb-perk-icon">💼</div>Businesses prefer top-ranked students</div>
              <div className="lb-perk"><div className="lb-perk-icon">⚡</div>Higher rank = more project invites</div>
            </div>
            <button onClick={() => navigate('/register/student')} className="btn-h btn-hm">Join the Leaderboard →</button>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section id="audience" style={{ background: 'var(--light-bg)' }}>
        <div className="tc reveal">
          <span className="stag stag-p">Who Is It For</span>
          <h2 className="sec-title" style={{ color: 'var(--text-light)' }}>Built For Both Sides</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--muted-light)' }}>Whether you're a student with skills or a business with needs — SkillNux is your platform.</p>
        </div>
        <div className="aug">
          <div className="auc auc-s reveal-left">
            <div className="aue">👨‍🎓</div>
            <h3>For Students & Freelancers</h3>
            <p>Turn your college years into a launchpad. Work on real projects, build your portfolio, and earn while you learn.</p>
            <ul className="aul">
              <li>No experience needed — just pass our skill test</li>
              <li>Secure escrow payments directly to your UPI ID</li>
              <li>Build real portfolio assets, not abstract syllabus exercises</li>
              <li>Earn ₹3,000 to ₹15,000 per project while studying</li>
            </ul>
            <button onClick={() => navigate('/register/student')} className="btn-primary" style={{ marginTop: '28px' }}>Register as Student →</button>
          </div>
          <div className="auc auc-b reveal-right">
            <div className="aue">🏢</div>
            <h3>For Brands & Local Businesses</h3>
            <p>Stop paying agency rates or guessing on generic freelance sites. Hire pre-verified student specialists on demand.</p>
            <ul className="aul">
              <li>Get verified student list matching your required skill in 2 mins</li>
              <li>Escrow money protection — only release when 100% satisfied</li>
              <li>Transparent skill testing score — see live badges</li>
              <li>Save up to 70% compared to typical creative agency bills</li>
            </ul>
            <button onClick={() => navigate('/register/business')} className="btn-primary" style={{ marginTop: '28px', background: 'linear-gradient(135deg, var(--orange), var(--purple))' }}>Register Your Business →</button>
          </div>
        </div>
      </section>

      {/* College Tie ups Marquee */}
      <section id="colleges">
        <span className="stag stag-o">Partners & Network</span>
        <h2 className="sec-title">Students from Premier Colleges</h2>
        <div className="college-marquee">
          <div className="college-track">
            {['Delhi University', 'Mumbai University', 'IIT Bombay', 'BITS Pilani', 'VIT Vellore', 'SRM University', 'Amity University', 'LPU', 'Christ University', 'Delhi University', 'Mumbai University', 'IIT Bombay', 'BITS Pilani', 'VIT Vellore', 'SRM University'].map((c, i) => (
              <span className="college-pill" key={i}>{c}</span>
            ))}
          </div>
        </div>
        <div className="college-coming">Official partnerships coming to <span>50+ campuses</span> this year!</div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background: 'var(--light-bg)' }}>
        <div className="tc reveal">
          <span className="stag">Testimonials</span>
          <h2 className="sec-title" style={{ color: 'var(--text-light)' }}>What People Are Saying</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--muted-light)' }}>Hear directly from successful students and businesses in our community.</p>
        </div>
        <div className="tg">
          <div className="tc-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="ts">★★★★★</div>
            <p className="tt">"I joined SkillNux as a 2nd-year BCA student. I cleared the Web Development test and got matched with a local startup. In just 3 months, I have built 4 landing pages and earned over ₹25,000! My UPI receives payments instantly. It's awesome!"</p>
            <div className="ta">
              <div className="tav av1">RS</div>
              <div><div className="tn">Rohan Sharma</div><div className="tr">BCA Student, XYZ College</div></div>
            </div>
          </div>
          <div className="tc-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="ts">★★★★★</div>
            <p className="tt">"We needed a logo and Instagram social posts designed quickly for our brand launch. Finding designers on older sites is a headache. On SkillNux, we posted the project and hired Priya KAPOOR, an Intermediate student. The results were fantastic, and we paid 1/3 of agency cost!"</p>
            <div className="ta">
              <div className="tav av2">SS</div>
              <div><div className="tn">Siddharth Sen</div><div className="tr">Co-founder, BakeBloom</div></div>
            </div>
          </div>
          <div className="tc-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="ts">★★★★★</div>
            <p className="tt">"The skill test is very well structured. Passing it gave me immediate confidence to talk to businesses. The college leaderboard is highly addictive; it keeps me motivated to complete assignments and earn reviews to climb high!"</p>
            <div className="ta">
              <div className="tav av3">AM</div>
              <div><div className="tn">Arjun Mehta</div><div className="tr">B.Tech Student, DU</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section id="smartfeatures">
        <div className="tc reveal">
          <span className="stag stag-p">Platform Features</span>
          <h2 className="sec-title">Engineered for Frictionless Trust</h2>
        </div>
        <div className="sf-grid">
          <div className="sf-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="sf-icon">🛡️</div>
            <h3>UPI Escrow Protection</h3>
            <p>Funds are held securely by SkillNux once the contract starts, and released directly to student UPI ID only when the work is checked and approved.</p>
          </div>
          <div className="sf-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="sf-icon">⚡</div>
            <h3>Automatic Skill Scoring</h3>
            <p>No fake resumes allowed. Students take an automated quiz based on selected skills. Verified badges are displayed publicly on cards.</p>
          </div>
          <div className="sf-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="sf-icon">💬</div>
            <h3>WhatsApp Integration</h3>
            <p>Get instant updates on your mobile. Project matches, hire requests, milestone deadlines, and payment notices are pushed automatically to WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Unified Login Callbox */}
      <section id="signin">
        <div className="si-wrap reveal">
          <span className="stag">Get Started</span>
          <h2>Access Your Portal</h2>
          <p style={{ color: 'var(--muted-dark)', marginTop: '8px' }}>Log in to post projects or view your dashboard assignments</p>
          <div className="si-box">
            <h3>Unified Sign-In Portal</h3>
            <p>Redirecting to secure login dashboard...</p>
            <div className="sibs">
              <button onClick={() => navigate('/login')} className="sbtn se">🔑 Enter Secure Portal →</button>
              <div className="sdiv">or create new account</div>
              <button onClick={() => navigate('/register/student')} className="sbtn sa">🎓 Join as Student</button>
              <button onClick={() => navigate('/register/business')} className="sbtn sg">🏢 Join as Business</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <div className="abg">
          <div className="reveal-left">
            <span className="stag">Our Mission</span>
            <h2 className="sec-title" style={{ color: 'var(--text-light)' }}>Bridging the Gap Between Classroom & Commerce</h2>
            <div className="abt">
              <p>In India, millions of college students possess immense digital skills — design, copywriting, coding, video editing — yet lack structural avenues to monetize their talent due to "experience requirements".</p>
              <p>At the same time, thousands of local MSMEs and startups struggle with high agency charges. We created SkillNux to build a transparent, verification-first marketplace bridging this gap permanently.</p>
            </div>
            <div className="abv">
              <div className="vc">
                <div className="vi">🛡️</div>
                <div className="vt">100% Trusted</div>
                <div className="vd">Verified student marks</div>
              </div>
              <div className="vc">
                <div className="vi">🚀</div>
                <div className="vt">Instant Matching</div>
                <div className="vd">No tedious bidding rounds</div>
              </div>
            </div>
          </div>

          <div className="abvis reveal-right">
            <div className="mi">
              <div className="mico">💡</div>
              <div className="mt">
                <h4 style={{ color: 'var(--text-light)' }}>Practical Portfolios</h4>
                <p style={{ color: 'var(--muted-light)' }}>Students display real-world tasks, giving brands clear proofs instead of dry, abstract grades.</p>
              </div>
            </div>
            <div className="mi">
              <div className="mico">🤝</div>
              <div className="mt">
                <h4 style={{ color: 'var(--text-light)' }}>Fair Compensation</h4>
                <p style={{ color: 'var(--muted-light)' }}>We uphold strict minimum wages per project category to protect student efforts against exploitation.</p>
              </div>
            </div>
            <div className="mi">
              <div className="mico">🏆</div>
              <div className="mt">
                <h4 style={{ color: 'var(--text-light)' }}>Campus Leaderboard</h4>
                <p style={{ color: 'var(--muted-light)' }}>Creates micro-competition in colleges. Rising to top triggers direct enterprise project invites.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta">
        <div className="ctac reveal">
          <h2>Ready to Unlock Your Potential?</h2>
          <p>Join India's fastest-growing student-to-brand marketplace today. Setup takes under 5 minutes.</p>
          <form className="ctaf" onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              className="ctai"
              placeholder="Enter your email address"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ height: '50px' }}>Join Waitlist →</button>
          </form>
          <div className="cta-note">🚀 Over <span>700+</span> matches made this month!</div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="tc reveal">
          <span className="stag stag-o">Get In Touch</span>
          <h2 className="sec-title" style={{ color: 'var(--text-light)' }}>Have Questions? We're Here</h2>
          <p className="sec-sub mxa" style={{ color: 'var(--muted-light)' }}>Send us a message or contact our team directly. We respond within 2 hours.</p>
        </div>
        <div className="cog">
          <div className="coi reveal-left">
            <div className="cit">
              <div className="cion">📍</div>
              <div><div className="cl">Headquarters</div><div className="cv">WeWork, Outer Ring Road, Bangalore, India</div></div>
            </div>
            <div className="cit">
              <div className="cion">📧</div>
              <div><div className="cl">Email Address</div><div className="cv">support@skillnux.in</div></div>
            </div>
            <div className="cit">
              <div className="cion">📞</div>
              <div><div className="cl">WhatsApp Helpline</div><div className="cv">+91 88922 41108</div></div>
            </div>
          </div>

          <form className="cof reveal-right" onSubmit={handleContactSubmit}>
            <input
              type="text"
              className="cfi"
              placeholder="Your Full Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <input
              type="email"
              className="cfi"
              placeholder="Email Address"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <textarea
              className="cfi"
              placeholder="Your Message..."
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="bsub">✉ Send Message</button>
          </form>
        </div>
      </section>

      {/* Legal Info */}
      <section id="legal">
        <div className="ltabs">
          <button className={`ltab ${activeLegalTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveLegalTab('terms')}>Terms & Conditions</button>
          <button className={`ltab ${activeLegalTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveLegalTab('privacy')}>Privacy Policy</button>
          <button className={`ltab ${activeLegalTab === 'escrow' ? 'active' : ''}`} onClick={() => setActiveLegalTab('escrow')}>Escrow Rules</button>
        </div>

        {activeLegalTab === 'terms' && (
          <div className="lc active">
            <div className="lbox">
              <h3>1. General Agreement</h3>
              <p>By registering on SkillNux, students and businesses agree to uphold professional integrity and maintain transparent communications. Payments are strictly milestone-based.</p>
              <h3>2. Student Conduct</h3>
              <p>Plagiarism or generative AI outputs without client consent will result in immediate profile suspension and forfeiture of escrow payments.</p>
            </div>
          </div>
        )}

        {activeLegalTab === 'privacy' && (
          <div className="lc active">
            <div className="lbox">
              <h3>1. Personal Information</h3>
              <p>We store name, email, WhatsApp, college name, and UPI ID securely. UPI details are encrypted and strictly used for outward transfers of approved earnings.</p>
              <h3>2. Data Sharing</h3>
              <p>Student statistics (quiz scores, leaderboard status) are public. Student phone numbers are only shared with a business once a hiring contract starts.</p>
            </div>
          </div>
        )}

        {activeLegalTab === 'escrow' && (
          <div className="lc active">
            <div className="lbox">
              <h3>1. Escrow Policy</h3>
              <p>All projects exceeding ₹2,000 must utilize our secure escrow system. The business deposits budget up-front. Money is held securely during contract duration.</p>
              <h3>2. Milestone Release</h3>
              <p>Upon submission of deliverables, the business has 72 hours to review and approve, or request modifications. If no action is taken within 72 hours, funds are auto-released.</p>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer>
        <div className="fg">
          <div className="fb">
            <span className="logo-name" style={{ fontSize: '20px', display: 'block', marginBottom: '10px' }}>Skill<em>Nux</em></span>
            <p>India's first dedicated student micro-gigs marketplace. Turn your passion into professional portfolio assets.</p>
            <div className="tgbadge"><span className="td">✓</span> Secured by Razorpay Escrow</div>
          </div>
          <div className="fc">
            <h4>For Students</h4>
            <ul>
              <li><button onClick={() => navigate('/register/student')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-dark)' }}>Join Leaderboard</button></li>
              <li><a href="#skills">Explore Skills</a></li>
              <li><button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-dark)' }}>Portal Login</button></li>
            </ul>
          </div>
          <div className="fc">
            <h4>For Brands</h4>
            <ul>
              <li><button onClick={() => navigate('/register/business')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-dark)' }}>Post Project</button></li>
              <li><a href="#about">Our Network</a></li>
              <li><a href="#contact">MSME Helpline</a></li>
            </ul>
          </div>
          <div className="fc">
            <h4>Legal</h4>
            <ul>
              <li><a href="#legal">Escrow T&C</a></li>
              <li><a href="#legal">Privacy Rules</a></li>
              <li><a href="#legal">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <p>© 2026 SkillNux Technologies Private Limited. All rights reserved.</p>
          <div className="socials">
            <a href="https://wa.me/918892241108" target="_blank" rel="noopener noreferrer" className="socbtn wa">💬</a>
            <a href="https://instagram.com/skillnux" target="_blank" rel="noopener noreferrer" className="socbtn ig">📸</a>
            <a href="https://linkedin.com/company/skillnux" target="_blank" rel="noopener noreferrer" className="socbtn li">💼</a>
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
    </>
  );
}
