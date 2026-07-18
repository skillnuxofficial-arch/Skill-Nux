import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 199,
    color: '#00c896',
    icon: '🚀',
    features: ['5 Project Bids/month', 'Basic Profile', 'Community Access', 'Email Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    color: '#00f0c8',
    icon: '⚡',
    popular: true,
    features: ['Unlimited Bids', 'Verified Badge', 'Priority Listing', 'AI Assistant', 'Analytics Dashboard'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 999,
    color: '#a78bfa',
    icon: '👑',
    features: ['Everything in Pro', 'Dedicated Manager', 'Featured Profile', 'Early Access Features', '1-on-1 Mentorship'],
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePayment = (plan) => {
    setLoading(plan.id);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: 'INR',
      name: 'SkillNux',
      description: `SkillNux ${plan.name} Plan`,
      image: '/favicon.svg',
      handler: function (response) {
        setLoading(null);
        setSuccess({ plan, paymentId: response.razorpay_payment_id });
      },
      modal: {
        ondismiss: () => setLoading(null),
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        plan: plan.name,
      },
      theme: {
        color: '#00f0c8',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => setLoading(null));
    rzp.open();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

      {/* Header */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #00f0c8, #00c896)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000' }}>SN</div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Skill<em style={{ fontStyle: 'normal', color: '#00f0c8' }}>Nux</em></span>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
          ← Back to Home
        </button>
      </div>

      {/* Success Screen */}
      {success && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'pop 0.5s ease' }}>🎉</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00f0c8', marginBottom: '10px' }}>Payment Successful!</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '8px' }}>You are now on the <strong style={{ color: '#fff' }}>{success.plan.name}</strong> plan!</p>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '32px' }}>Payment ID: <code style={{ color: '#00f0c8' }}>{success.paymentId}</code></p>
          <button
            onClick={() => navigate('/dashboard/student')}
            style={{ background: 'linear-gradient(135deg, #00f0c8, #00c896)', border: 'none', color: '#000', padding: '14px 36px', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            Go to Dashboard →
          </button>
        </div>
      )}

      {/* Plans */}
      {!success && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ background: 'rgba(0,240,200,0.1)', border: '1px solid rgba(0,240,200,0.25)', color: '#00f0c8', padding: '6px 18px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, letterSpacing: 1 }}>PRICING</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginTop: '20px', marginBottom: '12px' }}>
              Choose Your <span style={{ color: '#00f0c8' }}>SkillNux</span> Plan
            </h1>
            <p style={{ color: '#888', fontSize: '1.05rem' }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                position: 'relative',
                background: plan.popular ? 'linear-gradient(135deg, rgba(0,240,200,0.08), rgba(0,200,150,0.04))' : 'rgba(255,255,255,0.03)',
                border: plan.popular ? '1px solid rgba(0,240,200,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px 28px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: plan.popular ? 'scale(1.04)' : 'scale(1)',
                boxShadow: plan.popular ? '0 0 40px rgba(0,240,200,0.12)' : 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,240,200,0.15)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = plan.popular ? 'scale(1.04)' : 'scale(1)'; e.currentTarget.style.boxShadow = plan.popular ? '0 0 40px rgba(0,240,200,0.12)' : 'none'; }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00f0c8, #00c896)', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '5px 18px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}

                {/* Icon & Name */}
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{plan.icon}</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px', color: plan.color }}>{plan.name}</h2>

                {/* Price */}
                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.2rem', color: '#aaa' }}>₹</span>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff' }}>{plan.price}</span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>/month</span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${plan.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: plan.color, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Pay Button */}
                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loading === plan.id}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: 'none',
                    background: loading === plan.id ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)`,
                    color: loading === plan.id ? '#666' : '#000',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: loading === plan.id ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}>
                  {loading === plan.id ? (
                    <>
                      <span style={{ width: 16, height: 16, border: '2px solid #444', borderTop: '2px solid #00f0c8', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${plan.price} →`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ textAlign: 'center', marginTop: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap', color: '#555', fontSize: '0.85rem' }}>
            <span>🔒 Secured by Razorpay</span>
            <span>🏦 UPI / Cards / NetBanking</span>
            <span>✅ Cancel anytime</span>
            <span>💳 256-bit SSL Encrypted</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}
