import React, { useState, useEffect, useRef } from 'react';
import './SupportChatBox.css';

const faqs = [
  {
    keywords: ['register', 'sign up', 'join', 'account', 'create'],
    answer: "Q: How do I register?\nA: Click \"I'm a Student\", fill your details, select your skill, give 5 MCQ test, and you're in! (Businesses can also sign up from the dashboard)."
  },
  {
    keywords: ['free', 'cost', 'price', 'fee to join'],
    answer: "Q: Is it free to join?\nA: Yes, completely free for students!"
  },
  {
    keywords: ['get project', 'hired', 'find work', 'get work', 'when will i'],
    answer: "Q: How do I get projects? / When will I get hired?\nA: After registration, businesses will match you based on your skill. Businesses search by skill, so make sure your skill test score is good and your profile is complete!"
  },
  {
    keywords: ['receive payment', 'get paid', 'withdraw', 'my money'],
    answer: "Q: How do I receive payment?\nA: Add your UPI ID during registration. Payment comes directly to your UPI after project completion."
  },
  {
    keywords: ['multiple skill', 'add skill', 'another skill', 'more skill'],
    answer: "Q: Can I add multiple skills?\nA: Yes! Go to Dashboard → Badges → Add Skill button."
  },
  {
    keywords: ['skill score', 'test result', 'score', 'marks'],
    answer: "Q: What is skill score?\nA: It's your MCQ test result out of 5. Higher score = better matches!"
  },
  {
    keywords: ['commission', 'platform fee', 'charge', 'platform cut'],
    answer: "Q: What is the platform commission?\nA: SkillNux takes 15% platform fee on completed projects. Students keep 85% of their earnings."
  },
  {
    keywords: ['retake', 'fail test', 'test again', 'retest'],
    answer: "Q: Can I retake skill test?\nA: Yes, after 7 days if you scored below 3."
  },
  {
    keywords: ['earn', 'income', 'money make', 'how much money'],
    answer: "Q: How much can I earn?\nA: Depends on skill and project. Range is ₹500 to ₹10,000+ per project."
  },
  {
    keywords: ['post project', 'create project', 'hire student'],
    answer: "Q: How do I post a project?\nA: Login → Dashboard → Post a Project → Fill skill, budget, description → Submit."
  },
  {
    keywords: ['match', 'how student match', 'matched'],
    answer: "Q: How are students matched?\nA: We show students who have verified skill badge for your required skill, sorted by score."
  },
  {
    keywords: ['how to pay', 'make payment', 'paying'],
    answer: "Q: How do I pay?\nA: Payment via Razorpay. Money is held in escrow until you approve the work."
  },
  {
    keywords: ['escrow', 'safe payment', 'what is escrow'],
    answer: "Q: What is escrow?\nA: Your money is safe with us until project is done. Released only after your approval."
  },
  {
    keywords: ['hire again', 'same student', 'rehire'],
    answer: "Q: Can I hire same student again?\nA: Yes! Save them in Favourites and rehire anytime."
  },
  {
    keywords: ['bad work', 'quality bad', 'dispute', 'revision', 'refund', 'not good'],
    answer: "Q: What if work quality is bad?\nA: Raise a dispute within 48 hours. Our team reviews and arranges revision or refund."
  },
  {
    keywords: ['verified', 'verify student', 'fake'],
    answer: "Q: Are students verified?\nA: Yes! Every student passes a skill test before appearing in search results."
  },
  {
    keywords: ['delivery', 'how long', 'time taken', 'deadline'],
    answer: "Q: How long does delivery take?\nA: Depends on deadline you set — 1 day to 1 month."
  },
  {
    keywords: ['cancel project', 'stop project', 'delete project'],
    answer: "Q: Can I cancel a project?\nA: Yes, before work starts. Full refund in 5-7 days."
  },
  {
    keywords: ['what is skillnux', 'about skillnux'],
    answer: "Q: What is SkillNux?\nA: India's student skill marketplace connecting talented students with businesses."
  },
  {
    keywords: ['safe', 'secure', 'trust', 'scam'],
    answer: "Q: Is SkillNux safe?\nA: Yes! All students are college verified. Secure escrow payments. Report button available."
  },
  {
    keywords: ['support', 'contact', 'help', 'email', 'whatsapp', 'customer care'],
    answer: "Q: How to contact support?\nA: Email: skillnux.official@gmail.com or WhatsApp us directly."
  },
  {
    keywords: ['which skill', 'skills available', 'category', 'categories'],
    answer: "Q: Which skills are available?\nA: 42 skills across Digital Marketing, Design, Tech, Business, and AI categories."
  },
  {
    keywords: ['where available', 'across india', 'location', 'cities'],
    answer: "Q: Is SkillNux available across India?\nA: Yes! Students and businesses from all over India can join."
  }
];

export default function SupportChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the SkillNux AI Assistant. Ask me a question and I will help you out!' }
  ]);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let foundAnswer = null;
      const lowerInput = userText.toLowerCase();

      // Simple keyword matching algorithm
      for (const faq of faqs) {
        if (faq.keywords.some(kw => lowerInput.includes(kw))) {
          foundAnswer = faq.answer;
          break;
        }
      }

      if (foundAnswer) {
        setMessages(prev => [...prev, { sender: 'bot', text: foundAnswer }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: "I'm sorry, I don't have the answer to that. Could you try rephrasing your question or keeping it simple? You can also email us at skillnux.official@gmail.com." 
          }
        ]);
      }
    }, 600);
  };

  return (
    <div className="support-chat-wrapper">
      {isOpen && (
        <div className="support-chat-window">
          <div className="support-chat-header">
            <span>🤖 SkillNux AI</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="support-chat-body" ref={chatBodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender}`}>
                {m.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx !== m.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <form className="support-chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              className="support-chat-input" 
              placeholder="Type your question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="support-chat-send">➤</button>
          </form>
        </div>
      )}
      
      {!isOpen && (
        <button className="support-chat-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
}
