import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── GLOBAL CSS injected once ─── */
const GLOBAL_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#06060e;--bg2:#0d0d1c;
    --pink:#ff1f6b;--pink2:#ff6b9d;--pink-glow:rgba(255,31,107,0.25);
    --gold:#ffd600;--purple:#9b4dff;
    --white:#f2f2f2;--muted:#888;--muted2:#aaa;
    --card:rgba(255,255,255,0.04);
    --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  }
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--white);font-family:'Outfit',sans-serif;overflow-x:hidden}
  input,button,select{font-family:'Outfit',sans-serif}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:var(--bg)}
  ::-webkit-scrollbar-thumb{background:var(--pink);border-radius:2px}

  @keyframes pulse    {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
  @keyframes bounce   {0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
  @keyframes marquee  {from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes spin     {to{transform:rotate(360deg)}}
  @keyframes slideUp  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatUp  {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes confetti {0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(150px) rotate(720deg);opacity:0}}

  /* hero text — visible by default, GSAP overrides for animation */
  .hero-anim{opacity:1;transform:translateY(0)}

  .fade-up{opacity:0;transform:translateY(48px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .fade-up.visible{opacity:1;transform:translateY(0)}
`

/* ═══════════════════════════ DATA ═══════════════════════════ */
const BADDIES = [
  { id: 1, name: 'Priya Sharma', vibe: 'Gym Queen 💪', tags: ['Fitness', 'Travel', 'Foodie'], emoji: '🔥', color: '#ff1f6b', bg: 'rgba(255,31,107,0.12)', desc: 'BCom grad, gym addict. Loves beaches & mango ice cream. Looking for gym buddy who matches energy.', photo: null },
  { id: 2, name: 'Kavya Nair', vibe: 'Artsy Soul 🎨', tags: ['Art', 'Music', 'Coffee'], emoji: '✨', color: '#9b4dff', bg: 'rgba(155,77,255,0.12)', desc: 'Graphic designer from Kochi. Paints on weekends, indie playlists, rooftop dates obsessed.', photo: null },
  { id: 3, name: 'Meera Patel', vibe: 'Corporate Baddie 💼', tags: ['Finance', 'Hiking', 'Books'], emoji: '👑', color: '#ffd600', bg: 'rgba(255,214,0,0.12)', desc: 'MBA, finance girl. Sharp AF but lowkey romantic. Loves sunset hikes and good conversation.', photo: null },
  { id: 4, name: 'Aisha Khan', vibe: 'Chef Vibes 🍜', tags: ['Cooking', 'Travel', 'Yoga'], emoji: '🌸', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', desc: 'Self-taught chef who travels for food. Will cook on 3rd date if you pass the vibe check.', photo: null },
  { id: 5, name: 'Riya Desai', vibe: 'Tech Girl 💻', tags: ['Coding', 'Gaming', 'Netflix'], emoji: '⚡', color: '#ff6b9d', bg: 'rgba(255,107,157,0.12)', desc: 'Frontend dev by day, gamer by night. Will roast your code and your fashion simultaneously.', photo: null },
  { id: 6, name: 'Sneha Reddy', vibe: 'Wanderlust Queen ✈️', tags: ['Travel', 'Photography', 'Chai'], emoji: '🌍', color: '#ffb300', bg: 'rgba(255,179,0,0.12)', desc: "Visited 22 states. Travel photographer. Next destination: you — if you're interesting enough.", photo: null },
  { id: 7, name: 'Divya Menon', vibe: 'Bollywood Energy 🎬', tags: ['Dance', 'Cinema', 'Biryani'], emoji: '💃', color: '#7b2fff', bg: 'rgba(123,47,255,0.12)', desc: 'Kathak dancer, film buff, biryani fanatic. Laughs loudly, loves deeply, zero time for mediocrity.', photo: null },
  { id: 8, name: 'Tara Singh', vibe: 'Chill Philosopher 🧘', tags: ['Yoga', 'Books', 'Stargazing'], emoji: '🌙', color: '#4dd0e1', bg: 'rgba(77,208,225,0.12)', desc: 'Philosophy grad who stargazes and journals. Someone who talks existence at 2am.', photo: null },
]
const FILTERS = ['All', 'Fitness', 'Art', 'Finance', 'Travel', 'Tech', 'Dance', 'Yoga', 'Cooking']
const FEATURES = [
  { icon: '🔥', color: '#ff1f6b', title: 'Rizz Coach AI', desc: 'Tera 24/7 AI wingman jo tujhe sikhayega kaise baat shuru karein, impress karein, aur chemistry build karein.' },
  { icon: '💪', color: '#ffd600', title: 'Glow Up Tracker', desc: 'Gym, skincare, hairstyle, posture — sab ek dashboard mein. Apna 30-day transformation track kar.' },
  { icon: '📍', color: '#9b4dff', title: 'Baddie Radar™', desc: 'Nearby events, trending cafes, aur weekend spots jahan real-world game khela jaata hai.' },
  { icon: '✨', color: '#00d4aa', title: 'Drip Calculator', desc: 'Outfit color combos, style suggestions jo tujhe automatically 10x better dikhayein. Swag science-backed.' },
]
const STEPS = [
  { num: '01', emoji: '📝', title: 'Join the Yojana', desc: "Free sign up kar. 'Main akela hoon yaar' wala 3-minute form bharo. Koi judgment nahi." },
  { num: '02', emoji: '⚡', title: 'Follow the Plan', desc: 'Daily Rizz tasks, weekly Glow-Up goals, aur 30-day Sigma Challenge. Consistency is the cheat code.' },
  { num: '03', emoji: '🎯', title: 'Get the Baddie', desc: '90 din baad teri baddie khud notice karegi. Mission accomplished. BPY successful.' },
]
const TESTIMONIALS = [
  { emoji: '😎', stars: 5, text: 'Bhai 3 mahine pehle main gym nahi jaata tha, ek bhi match nahi aata tha. BPY ne literally sab kuch badal diya. Ab 4 dates pending hain!', name: 'Rahul Sharma', loc: 'Delhi · Rizz Pro' },
  { emoji: '🧔', stars: 5, text: 'Pehle toh sirf Netflix aur khana. Ab? Khud hi sab log mujhse advice maangte hain. Rizz Coach AI meri zindagi ka best investment tha.', name: 'Karan Mehra', loc: 'Mumbai · Sigma Mode' },
  { emoji: '🏋️', stars: 5, text: 'Sigma Mode subscribe kiya, ek mahine mein 3 ladkiyon ne mujhe text kiya. ROI is insane bhai. 100% recommend. 🔥', name: 'Arjun Singh', loc: 'Pune · Sigma Mode' },
]
const PLANS = [
  { name: 'Bhai Plan', emoji: '😐', tag: null, featured: false, price: 'FREE', period: 'Forever, no catch', desc: 'Naya jaagna hua hai toh start yahan se', features: ['Rizz 101 Starter Guide', '3 Style Tips / Week', 'Basic Glow Up Tracker', 'Community Forum Access', '2 AI Coach Messages / Day'], cta: 'Start Free 👋' },
  { name: 'Rizz Pro', emoji: '😏', tag: '🔥 Most Popular', featured: true, price: '₹499', period: 'Per Month', desc: 'Serious bhai ke liye jo sach mein change chahta hai', features: ['Everything in Bhai Plan', 'Unlimited Rizz Coach AI', 'Baddie Radar™ Access', 'Drip Calculator Premium', 'Weekly 1:1 AI Coach Review'], cta: 'Go Pro 🚀' },
  { name: 'Sigma Mode', emoji: '🔱', tag: null, featured: false, price: '₹999', period: 'Per Month', desc: 'Total transformation ke liye top-tier plan', features: ['Everything in Rizz Pro', 'VIP 30-Day Glow-Up System', 'Priority Support 24/7', 'Monthly Strategy Call', 'Sigma Certificate 🏆'], cta: 'Go Sigma 🔱' },
]
const STATS = [
  { num: '12K+', label: 'Bhai Log Joined' },
  { num: '87%', label: 'Success Rate (90 Days)' },
  { num: '4.9★', label: 'Average App Rating' },
]

/* ═══════════════════════════ SHARED ═══════════════════════════ */
function PrimaryBtn({ children, onClick, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 50px rgba(255,31,107,0.55)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = disabled ? 'none' : '0 0 36px var(--pink-glow)' }}
      style={{ padding: '16px 44px', background: disabled ? 'rgba(255,31,107,0.3)' : 'linear-gradient(135deg,var(--pink),var(--pink2))', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing: '0.3px', boxShadow: disabled ? 'none' : '0 0 36px var(--pink-glow)', transition: 'all 0.3s', opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  )
}
function SecondaryBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'none' }}
      style={{ padding: '16px 44px', background: 'transparent', color: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.3px', transition: 'all 0.3s', ...style }}>
      {children}
    </button>
  )
}
function FormInput({ label, type = 'text', placeholder, value, onChange, icon, maxLength, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted2)', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none' }}>{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: icon ? '12px 12px 12px 38px' : '12px 14px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(255,31,107,0.7)' : focused ? 'rgba(255,31,107,0.55)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '9px', color: 'var(--white)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxShadow: focused ? '0 0 0 3px rgba(255,31,107,0.1)' : 'none' }} />
      </div>
      {error && <div style={{ color: '#ff6b9d', fontSize: '11px', marginTop: '4px' }}>⚠ {error}</div>}
    </div>
  )
}
function SectionLabel({ tag, title, sub, center = false }) {
  return (
    <div style={{ marginBottom: '64px', textAlign: center ? 'center' : 'left' }}>
      <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--pink)', marginBottom: '14px' }}>{tag}</div>
      <h2 className="fade-up" dangerouslySetInnerHTML={{ __html: title }} style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(44px,6vw,76px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '18px' }} />
      {sub && <p className="fade-up" style={{ fontSize: '16px', color: 'var(--muted2)', maxWidth: '480px', lineHeight: 1.75, margin: center ? '0 auto' : '0' }}>{sub}</p>}
    </div>
  )
}

/* ═══════════════════════════ NAVBAR ═══════════════════════════ */
function Navbar({ onBaddieClick, onJoin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '68px', background: scrolled ? 'rgba(6,6,14,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent', transition: 'all 0.4s ease' }}>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: '26px', letterSpacing: '2px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>BPY™</div>
      <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center' }}>
        {['Features', 'How It Works', 'Pricing', 'Reviews'].map(l => (
          <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, '')}`} onMouseEnter={e => (e.target.style.color = 'var(--white)')} onMouseLeave={e => (e.target.style.color = 'var(--muted2)')} style={{ color: 'var(--muted2)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>{l}</a></li>
        ))}
        <li>
          <a href="#" onClick={e => { e.preventDefault(); onBaddieClick() }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,31,107,0.2)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,31,107,0.08)')} style={{ color: 'var(--pink)', fontSize: '14px', fontWeight: 700, textDecoration: 'none', padding: '6px 16px', border: '1px solid rgba(255,31,107,0.35)', borderRadius: '8px', background: 'rgba(255,31,107,0.08)', transition: 'all 0.2s' }}>💘 Baddies</a>
        </li>
      </ul>
      <button onClick={onJoin} onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 36px rgba(255,31,107,0.55)' }} onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 0 24px var(--pink-glow)' }} style={{ padding: '10px 26px', background: 'var(--pink)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px var(--pink-glow)', transition: 'all 0.25s' }}>Join Free ✨</button>
    </nav>
  )
}

/* ═══════════════════════════ HERO ═══════════════════════════ */
function HeroParticles() {
  const ref = useRef()
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      color: Math.random() > .6 ? 'rgba(255,31,107,' : 'rgba(255,214,0,', opacity: Math.random() * .4 + .1,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

function Hero({ onJoin, onBaddie }) {
  useEffect(() => {
    // ✅ FIX: gsap.fromTo with EXPLICIT opacity:1 end state
    // This guarantees content shows even if animation misfires
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.fromTo('#hero-badge',
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .fromTo('#hero-l1',
          { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.25')
        .fromTo('#hero-l2',
          { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.65')
        .fromTo('#hero-l3',
          { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.65')
        .fromTo('#hero-sub',
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35')
        .fromTo('#hero-btns',
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .fromTo('#hero-scroll',
          { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1')
    })
    return () => ctx.revert()
  }, [])

  const big = { fontFamily: 'Bebas Neue', fontSize: 'clamp(72px,13vw,170px)', lineHeight: 0.9, letterSpacing: '3px' }

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 100px', position: 'relative', overflow: 'hidden' }}>
      <HeroParticles />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% -10%,rgba(255,31,107,0.18) 0%,transparent 65%),radial-gradient(ellipse 40% 30% at 85% 60%,rgba(155,77,255,0.1) 0%,transparent 55%)', pointerEvents: 'none' }} />

      {/* All hero elements start visible (opacity:1). GSAP overrides briefly to 0 then animates up */}
      <div id="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'rgba(255,31,107,0.1)', border: '1px solid rgba(255,31,107,0.3)', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: 'var(--pink)', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
        <span style={{ width: '6px', height: '6px', background: 'var(--pink)', borderRadius: '50%', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
        🇮🇳 India's #1 Glow-Up Platform — Now Live
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div id="hero-l1" style={{ ...big, color: 'var(--white)' }}>Baddie</div>
        <div id="hero-l2" style={{ ...big, background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>Patao</div>
        <div id="hero-l3" style={{ ...big, color: 'var(--white)' }}>Yojana™</div>
      </div>

      <p id="hero-sub" style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'var(--muted2)', maxWidth: '540px', margin: '28px auto 44px', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
        Ab <span style={{ color: 'var(--pink)', fontWeight: 700 }}>single rehna</span> koi option nahi. AI-powered, science-backed,{' '}
        <span style={{ color: 'var(--gold)', fontWeight: 600 }}>desi-flavored</span> glow-up.
      </p>

      <div id="hero-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <PrimaryBtn onClick={onJoin} style={{ padding: '18px 48px', fontSize: '17px' }}>🚀 Plan Shuru Karo</PrimaryBtn>
        <SecondaryBtn onClick={onBaddie}>💘 Choose Baddie</SecondaryBtn>
      </div>

      <div id="hero-scroll" style={{ position: 'absolute', bottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '12px', letterSpacing: '1px', animation: 'bounce 2s infinite', zIndex: 1 }}>
        <span>SCROLL</span><span style={{ fontSize: '16px' }}>↓</span>
      </div>
    </section>
  )
}

/* ═══════════════════════════ MARQUEE ═══════════════════════════ */
function Marquee() {
  const items = ['RIZZ UP', 'GLOW UP', 'LEVEL UP', 'SHOW UP', 'SIGMA GRINDSET', 'BADDIE MODE', 'PATCH APPLY', 'SINGLE NO MORE', 'CONFIDENCE MAX']
  const all = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '14px 0' }}>
      <div style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', animation: 'marquee 25s linear infinite' }}>
        {all.map((t, i) => (
          <span key={i} style={{ fontFamily: 'Bebas Neue', fontSize: '18px', letterSpacing: '3px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '48px' }}>
            {t}<span style={{ color: 'var(--pink)', fontSize: '7px' }}>●</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════ STATS ═══════════════════════════ */
function Stats() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('.stat-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={ref} style={{ padding: '0 48px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px' }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '52px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : '0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,var(--pink),transparent)' }} />
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '68px', lineHeight: 1, background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
            <div style={{ fontSize: '14px', color: 'var(--muted2)', marginTop: '8px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════ FEATURES ═══════════════════════════ */
function Features() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('.feat-card').forEach((c, i) => {
        gsap.fromTo(c, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } })
      })
      ref.current.querySelectorAll('.fade-up').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') }))
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="features" ref={ref} style={{ padding: '100px 56px', maxWidth: '1200px', margin: '0 auto' }}>
      <SectionLabel tag="⚡ Features" title="Yojana Mein<br/>Kya Milega?" sub="Sirf motivation nahi, actual tools aur AI systems jo teri life change karein." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="feat-card"
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '55'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            style={{ padding: '44px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', cursor: 'default', transition: 'all 0.35s' }}>
            <div style={{ fontSize: '40px', marginBottom: '22px' }}>{f.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{f.title}</div>
            <div style={{ fontSize: '15px', color: 'var(--muted2)', lineHeight: 1.75 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */
function HowItWorks() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('.step-card').forEach((c, i) => {
        gsap.fromTo(c, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.18, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } })
      })
      ref.current.querySelectorAll('.fade-up').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') }))
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="howItWorks" ref={ref} style={{ padding: '100px 56px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionLabel tag="🗺️ Process" title="Teen Simple<br/>Steps Bhai" sub="Complicated nahi hai. Bas teen steps follow kar aur dekh magic." center />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '36px', left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg,transparent,var(--pink),transparent)' }} />
          {STEPS.map((s, i) => (
            <div key={i} className="step-card fade-up"
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,31,107,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
              style={{ textAlign: 'center', padding: '48px 28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', transition: 'all 0.35s' }}>
              <div style={{ width: '68px', height: '68px', background: 'linear-gradient(135deg,var(--pink),var(--purple))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 36px var(--pink-glow)' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '26px' }}>{s.num}</span>
              </div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{s.emoji}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>{s.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.75 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */
function Testimonials() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('.testi-card').forEach((c, i) => {
        gsap.fromTo(c, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 90%' } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="reviews" ref={ref} style={{ padding: '100px 56px', maxWidth: '1200px', margin: '0 auto' }}>
      <SectionLabel tag="💬 Reviews" title="Bhai Log Bol<br/>Rahe Hain" sub="Fake testimonials nahi hain. Real bhai, real stories, real results." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testi-card"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,214,0,0.2)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            style={{ padding: '36px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', transition: 'all 0.35s' }}>
            <div style={{ color: 'var(--gold)', fontSize: '15px', letterSpacing: '3px', marginBottom: '18px' }}>{'★'.repeat(t.stars)}</div>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(255,255,255,0.82)', marginBottom: '28px', fontStyle: 'italic' }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--pink),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{t.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)' }}>{t.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ PRICING ═══════════════════════════ */
function Pricing({ onSelectPlan }) {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('.price-card').forEach((c, i) => {
        gsap.fromTo(c, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 90%' } })
      })
      ref.current.querySelectorAll('.fade-up').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') }))
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="pricing" ref={ref} style={{ padding: '100px 56px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionLabel tag="💰 Pricing" title="Plan Choose<br/>Karo Bhai" sub="Free se start karo ya seedha Sigma mein jump karo." center />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', alignItems: 'center' }}>
          {PLANS.map((p, i) => (
            <div key={i} className="price-card"
              onMouseEnter={e => { if (!p.featured) { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
              onMouseLeave={e => { if (!p.featured) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
              style={{ padding: '44px 36px', borderRadius: '22px', transition: 'all 0.35s', position: 'relative', background: p.featured ? 'linear-gradient(160deg,rgba(255,31,107,0.1),rgba(155,77,255,0.12))' : 'var(--card)', border: p.featured ? '1px solid rgba(255,31,107,0.45)' : '1px solid var(--border)', transform: p.featured ? 'scale(1.04)' : 'scale(1)', boxShadow: p.featured ? '0 0 80px rgba(255,31,107,0.12)' : 'none' }}>
              {p.featured && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', borderRadius: '100px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap', color: '#06060e' }}>{p.tag}</div>}
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>{p.emoji} {p.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '32px', lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '52px', lineHeight: 1, marginBottom: '4px', background: p.featured ? 'linear-gradient(135deg,var(--pink),var(--gold))' : 'transparent', WebkitBackgroundClip: p.featured ? 'text' : 'unset', WebkitTextFillColor: p.featured ? 'transparent' : 'var(--white)' }}>{p.price}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '36px' }}>{p.period}</div>
              <ul style={{ listStyle: 'none', marginBottom: '40px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '9px 0', borderBottom: '1px solid var(--border)', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: 'var(--pink)', fontSize: '12px', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {p.featured
                ? <PrimaryBtn onClick={() => onSelectPlan(p)} style={{ width: '100%', padding: '15px', fontSize: '15px' }}>{p.cta}</PrimaryBtn>
                : <SecondaryBtn onClick={() => onSelectPlan(p)} style={{ width: '100%', padding: '15px', fontSize: '15px' }}>{p.cta}</SecondaryBtn>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ CTA + FOOTER ═══════════════════════════ */
function CTASection({ onJoin, onBaddie }) {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
    })
    return () => ctx.revert()
  }, [])
  return (
    <div ref={ref} style={{ margin: '80px 56px', padding: '100px 56px', background: 'linear-gradient(135deg,rgba(255,31,107,0.08),rgba(155,77,255,0.08))', border: '1px solid rgba(255,31,107,0.2)', borderRadius: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%,rgba(255,31,107,0.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(52px,8vw,110px)', lineHeight: 0.95, letterSpacing: '2px', marginBottom: '20px' }}>
          Ab Aur{' '}
          <span style={{ background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wait Mat Kar</span>
        </div>
        <p style={{ fontSize: '18px', color: 'var(--muted2)', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7 }}>Ek click mein badal sakti hai teri story. India ke sabse bade glow-up movement mein aaj hi join kar.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={onJoin} style={{ padding: '18px 52px', fontSize: '17px' }}>🚀 Free Mein Join Karo</PrimaryBtn>
          <SecondaryBtn onClick={onBaddie}>💘 Choose Baddie →</SecondaryBtn>
        </div>
      </div>
    </div>
  )
}
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '2px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BPY™</div>
      <div style={{ fontSize: '13px', color: 'var(--muted)' }}>© 2025 Baddie Patao Yojana™ · Made with ❤️ in India 🇮🇳</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <a key={l} href="#" onMouseEnter={e => (e.target.style.color = 'var(--white)')} onMouseLeave={e => (e.target.style.color = 'var(--muted)')} style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>{l}</a>
        ))}
      </div>
    </footer>
  )
}

/* ═══════════════════════════ PAYMENT MODAL ═══════════════════════════ */
function PaymentModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' })
  const [card, setCard] = useState({ num: '', exp: '', cvv: '', holder: '' })
  const [errs, setErrs] = useState({})
  const ref = useRef()
  const isFree = plan.price === 'FREE'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(ref.current, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.3)' })
    return () => { document.body.style.overflow = '' }
  }, [])

  const v1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Naam daalna toh banta hai'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email daalo'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = '10-digit Indian number'
    if (!form.address.trim()) e.address = 'Address likho'
    if (!form.city.trim()) e.city = 'City?'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode'
    setErrs(e); return Object.keys(e).length === 0
  }
  const v2 = () => {
    const e = {}
    if (card.num.replace(/\s/g, '').length < 16) e.num = '16-digit number daalo'
    if (!card.exp.match(/^\d{2}\/\d{2}$/)) e.exp = 'MM/YY format'
    if (card.cvv.length < 3) e.cvv = '3-digit CVV'
    if (!card.holder.trim()) e.holder = 'Name on card'
    setErrs(e); return Object.keys(e).length === 0
  }
  const fmtCard = v => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
  const fmtExp = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }
  const next = () => {
    if (step === 1 && !v1()) return
    if (step === 2) {
      if (!isFree && !v2()) return
      setProcessing(true); setTimeout(() => { setProcessing(false); setStep(3) }, 2000); return
    }
    setErrs({}); setStep(s => s + 1)
  }
  const SLABELS = ['Details', 'Payment', 'Done!']

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', padding: '20px', overflowY: 'auto' }}>
      <div ref={ref} style={{ width: '100%', maxWidth: '480px', background: '#0d0d1c', border: '1px solid rgba(255,31,107,0.28)', borderRadius: '22px', boxShadow: '0 0 100px rgba(255,31,107,0.12)', overflow: 'hidden', margin: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,rgba(255,31,107,0.07),rgba(155,77,255,0.07))' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '21px', letterSpacing: '1px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{plan.emoji} {plan.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{isFree ? 'Free forever · No card needed' : `${plan.price}/month · Prototype — no real charge`}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--muted2)', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {/* Steps */}
        <div style={{ display: 'flex', padding: '18px 26px', borderBottom: '1px solid var(--border)' }}>
          {SLABELS.map((l, i) => {
            const n = i + 1, done = step > n, active = step === n
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: done ? 'var(--pink)' : active ? 'rgba(255,31,107,0.18)' : 'rgba(255,255,255,0.05)', border: `2px solid ${done || active ? 'var(--pink)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: done ? 'white' : active ? 'var(--pink)' : 'var(--muted)', transition: 'all 0.3s' }}>{done ? '✓' : n}</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: active ? 'var(--white)' : 'var(--muted)' }}>{l}</span>
                </div>
                {i < 2 && <div style={{ height: '2px', flex: 1, background: step > n ? 'var(--pink)' : 'rgba(255,255,255,0.08)', transition: 'background 0.5s', marginBottom: '18px' }} />}
              </div>
            )
          })}
        </div>
        {/* Body */}
        <div style={{ padding: '26px', minHeight: '300px' }}>
          {step === 1 && (
            <div style={{ animation: 'slideUp 0.3s ease' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>Apni Details Bharo 📝</div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>Ye info sirf BPY ke paas rahegi. Promise — spam nahi karenge.</p>
              <FormInput label="Full Name" placeholder="Tera poora naam" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} icon="👤" error={errs.name} />
              <FormInput label="Email Address" type="email" placeholder="bhai@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} icon="📧" error={errs.email} />
              <FormInput label="Phone Number" type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} maxLength={10} icon="📱" error={errs.phone} />
              <FormInput label="Street Address" placeholder="Gali no. 4, Colony..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} icon="🏠" error={errs.address} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <FormInput label="City" placeholder="Delhi" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} error={errs.city} />
                <FormInput label="Pincode" placeholder="110001" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} maxLength={6} error={errs.pincode} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ animation: 'slideUp 0.3s ease' }}>
              {isFree ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px', animation: 'floatUp 2s ease-in-out infinite' }}>🎉</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Free Plan — No Payment!</div>
                  <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: 1.7 }}>Tera Bhai Plan free hai. Activate karein aur journey shuru karein!</p>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>Payment Details 💳</div>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '18px' }}>🔒 Prototype only — koi real transaction nahi hogi.</p>
                  <div style={{ height: '130px', background: 'linear-gradient(135deg,#1a1a3e,#2d1b54)', borderRadius: '12px', padding: '18px 22px', marginBottom: '18px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(155,77,255,0.3)' }}>
                    <div style={{ position: 'absolute', top: '-25px', right: '-25px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(155,77,255,0.15)' }} />
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>BPY™ CARD</div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '18px', letterSpacing: '3px', marginBottom: '14px', color: card.num ? 'white' : 'rgba(255,255,255,0.2)' }}>{card.num || '•••• •••• •••• ••••'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Name</div><div style={{ fontSize: '12px', fontWeight: 600, color: card.holder ? 'white' : 'rgba(255,255,255,0.2)' }}>{card.holder || 'YOUR NAME'}</div></div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Expires</div><div style={{ fontSize: '12px', fontWeight: 600, color: card.exp ? 'white' : 'rgba(255,255,255,0.2)' }}>{card.exp || 'MM/YY'}</div></div>
                    </div>
                  </div>
                  <FormInput label="Card Number" placeholder="1234 5678 9012 3456" value={card.num} onChange={e => setCard({ ...card, num: fmtCard(e.target.value) })} icon="💳" maxLength={19} error={errs.num} />
                  <FormInput label="Name on Card" placeholder="Naam jaise card pe hai" value={card.holder} onChange={e => setCard({ ...card, holder: e.target.value })} icon="👤" error={errs.holder} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <FormInput label="Expiry (MM/YY)" placeholder="08/27" value={card.exp} onChange={e => setCard({ ...card, exp: fmtExp(e.target.value) })} maxLength={5} error={errs.exp} />
                    <FormInput label="CVV" type="password" placeholder="•••" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} maxLength={3} error={errs.cvv} />
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '8px', fontSize: '11px', color: 'rgba(0,212,170,0.8)' }}>🔒 Prototype — koi real payment nahi hogi.</div>
                </>
              )}
            </div>
          )}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '16px 0', animation: 'slideUp 0.4s ease', position: 'relative' }}>
              {['🎉', '🔥', '✨', '💪', '🚀', '⚡', '👑', '💃'].map((e, i) => (
                <span key={i} style={{ position: 'absolute', left: `${8 + i * 12}%`, top: '-10px', animation: `confetti ${1.4 + i * 0.2}s ease ${i * 0.1}s forwards`, fontSize: '16px', pointerEvents: 'none' }}>{e}</span>
              ))}
              <div style={{ fontSize: '64px', marginBottom: '12px', animation: 'floatUp 2s ease-in-out infinite' }}>🎯</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '38px', letterSpacing: '2px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>BPY Mein Swagat!</div>
              <div style={{ padding: '14px', background: 'rgba(255,31,107,0.07)', border: '1px solid rgba(255,31,107,0.18)', borderRadius: '10px', fontSize: '13px', color: 'var(--muted2)', marginBottom: '18px', textAlign: 'left', lineHeight: 1.9 }}>
                <div>📧 Email: <span style={{ color: 'var(--white)' }}>{form.email}</span></div>
                <div>📱 Phone: <span style={{ color: 'var(--white)' }}>+91 {form.phone}</span></div>
                <div>📦 Plan: <span style={{ color: 'var(--pink)', fontWeight: 700 }}>{plan.name} — {plan.price}</span></div>
                <div>📍 City: <span style={{ color: 'var(--white)' }}>{form.city}</span></div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '22px' }}>Ab apni <span style={{ color: 'var(--pink)', fontWeight: 700 }}>Dream Baddie</span> choose karo! 🔥</p>
              <PrimaryBtn onClick={onSuccess} style={{ width: '100%', padding: '15px', fontSize: '16px' }}>Choose My Baddie 💘</PrimaryBtn>
            </div>
          )}
        </div>
        {/* Footer btns */}
        {step < 3 && (
          <div style={{ padding: '0 26px 26px', display: 'flex', gap: '10px' }}>
            {step > 1 && <SecondaryBtn onClick={() => { setErrs({}); setStep(s => s - 1) }} style={{ padding: '12px 24px', fontSize: '14px' }}>← Back</SecondaryBtn>}
            <PrimaryBtn onClick={next} disabled={processing} style={{ padding: '13px 0', fontSize: '14px', flex: 1 }}>
              {processing
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><span style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Processing...</span>
                : step === 1 ? 'Continue →' : isFree ? 'Activate Free Plan 🚀' : `Pay ${plan.price} 🔒`}
            </PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════ CHOOSE BADDIE PAGE ═══════════════════════════ */
function ChooseBaddiePage({ onClose, onSelect }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const ref = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(ref.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' })
    return () => { document.body.style.overflow = '' }
  }, [])

  const filtered = filter === 'All' ? BADDIES : BADDIES.filter(b => b.tags.includes(filter))
  const lockIn = () => { if (!selected || locked) return; setLocked(true); setTimeout(() => onSelect(selected), 1600) }

  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 900, background: '#06060e', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,6,14,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', color: 'var(--muted2)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '2px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Choose Your Baddie 💘</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{selected ? `✓ ${selected.name} selected — Lock In karo!` : 'Vibe check karo, phir choose karo bhai'}</div>
          </div>
        </div>
        {selected && !locked && <PrimaryBtn onClick={lockIn} style={{ padding: '10px 28px', fontSize: '14px' }}>🔒 Lock In {selected.name.split(' ')[0]}!</PrimaryBtn>}
        {locked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '14px', fontWeight: 600 }}>
            <span style={{ width: '16px', height: '16px', border: '2px solid var(--gold)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Connecting to {selected?.name.split(' ')[0]}...
          </div>
        )}
      </div>

      <div style={{ padding: '36px 48px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(44px,7vw,84px)', lineHeight: 0.92, letterSpacing: '2px', marginBottom: '14px' }}>
            Apni{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Baddie</span>
            {' '}Select Karo
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--muted2)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>Photos baad mein add hongi — abhi vibe aur personality dekho. Match the energy! ✨</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {FILTERS.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: '7px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid', background: filter === t ? 'var(--pink)' : 'transparent', borderColor: filter === t ? 'var(--pink)' : 'rgba(255,255,255,0.12)', color: filter === t ? 'white' : 'var(--muted2)', boxShadow: filter === t ? '0 0 18px rgba(255,31,107,0.3)' : 'none' }}>{t}</button>
          ))}
        </div>

        {/* Baddie grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '18px', maxWidth: '1200px', margin: '0 auto' }}>
          {filtered.map(b => {
            const isSel = selected?.id === b.id
            return (
              <div key={b.id} onClick={() => setSelected(isSel ? null : b)}
                style={{ borderRadius: '18px', cursor: 'pointer', transition: 'all 0.32s', overflow: 'hidden', border: `2px solid ${isSel ? b.color : 'rgba(255,255,255,0.07)'}`, background: isSel ? b.bg : 'var(--card)', transform: isSel ? 'scale(1.03)' : 'scale(1)', boxShadow: isSel ? `0 0 40px ${b.color}44` : 'none' }}>
                <div style={{ height: '190px', position: 'relative', background: `linear-gradient(135deg,${b.bg},rgba(0,0,0,0.2))`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', background: `${b.color}15`, top: '-25px', right: '-25px' }} />
                  {b.photo
                    ? <img src={b.photo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    : <>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg,${b.color}44,${b.color}18)`, border: `2px dashed ${b.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>{b.emoji}</div>
                      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.45)', padding: '3px 10px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', border: '1px dashed rgba(255,255,255,0.12)', letterSpacing: '1px', textTransform: 'uppercase' }}>📸 Photo Coming Soon</div>
                    </>
                  }
                  {isSel && <div style={{ position: 'absolute', top: '10px', right: '10px', background: b.color, color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, boxShadow: `0 0 14px ${b.color}88`, zIndex: 2 }}>✓</div>}
                </div>
                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: 800 }}>{b.name}</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: b.color, padding: '2px 8px', borderRadius: '100px', background: `${b.color}15`, border: `1px solid ${b.color}30` }}>{b.vibe.split(' ').slice(-1)[0]}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: b.color, fontWeight: 600, marginBottom: '8px' }}>{b.vibe}</div>
                  <p style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.65, marginBottom: '12px' }}>{b.desc}</p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {b.tags.map(t => (
                      <span key={t} style={{ fontSize: '10px', padding: '2px 9px', borderRadius: '100px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selected && (
          <div style={{ maxWidth: '1200px', margin: '28px auto 0', padding: '18px 24px', background: 'linear-gradient(135deg,rgba(255,31,107,0.1),rgba(155,77,255,0.1))', border: '1px solid rgba(255,31,107,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,${selected.color}44,${selected.color}18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{selected.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{selected.name} ✅</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{selected.vibe}</div>
              </div>
            </div>
            <PrimaryBtn onClick={lockIn} disabled={locked} style={{ padding: '12px 32px', fontSize: '14px' }}>{locked ? 'Locking...' : `Lock In ${selected.name.split(' ')[0]}! 🔒`}</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════ MATCH SUCCESS ═══════════════════════════ */
function MatchSuccess({ baddie, plan, onDone }) {
  const ref = useRef()
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(ref.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' })
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ position: 'fixed', left: `${(i * 15 + 5) % 95}%`, top: '-20px', animation: `confetti ${1.8 + i * 0.18}s ease ${i * 0.11}s forwards`, fontSize: `${13 + i % 7}px`, pointerEvents: 'none', zIndex: 2001 }}>
          {['🎉', '🔥', '✨', '💘', '💪', '🚀', '👑', '💃', '🎊', '⚡', '🌸', '🏆'][i % 12]}
        </span>
      ))}
      <div ref={ref} style={{ maxWidth: '420px', width: '100%', textAlign: 'center', background: '#0d0d1c', border: '1px solid rgba(255,31,107,0.3)', borderRadius: '22px', padding: '48px 32px', boxShadow: '0 0 120px rgba(255,31,107,0.15)' }}>
        <div style={{ fontSize: '72px', marginBottom: '14px', animation: 'floatUp 2s ease-in-out infinite' }}>{baddie.emoji}</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '13px', letterSpacing: '4px', color: 'var(--muted)', marginBottom: '6px' }}>🎯 VIBE CHECK PASSED</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '48px', lineHeight: 0.95, letterSpacing: '2px', marginBottom: '6px', background: 'linear-gradient(135deg,var(--pink),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{baddie.name}</div>
        <div style={{ fontSize: '14px', color: baddie.color, fontWeight: 600, marginBottom: '18px' }}>{baddie.vibe}</div>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--muted2)', marginBottom: '22px', textAlign: 'left', lineHeight: 1.9 }}>
          <div>🎫 Plan: <span style={{ color: 'var(--pink)', fontWeight: 700 }}>{plan.name} — {plan.price}</span></div>
          <div>💘 Baddie: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{baddie.name}</span></div>
          <div>🚀 Status: <span style={{ color: '#00d4aa', fontWeight: 700 }}>Mission Started ✓</span></div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '22px', lineHeight: 1.7 }}>Congratulations bhai! 90 din mein results guarantee. Ab Rizz Coach se milao! 🔥</p>
        <PrimaryBtn onClick={onDone} style={{ width: '100%', padding: '15px', fontSize: '15px' }}>🚀 BPY Dashboard Open Karo</PrimaryBtn>
      </div>
    </div>
  )
}

/* ═══════════════════════════ ROOT APP ═══════════════════════════ */
export default function App() {
  const [paymentPlan, setPaymentPlan] = useState(null)
  const [showBaddie, setShowBaddie] = useState(false)
  const [activePlan, setActivePlan] = useState(null)
  const [matchedBaddie, setMatchedBaddie] = useState(null)

  /* Inject global CSS once */
  useEffect(() => {
    const tag = document.createElement('style')
    tag.id = 'bpy-global-css'
    if (!document.getElementById('bpy-global-css')) {
      tag.innerHTML = GLOBAL_CSS
      document.head.appendChild(tag)
    }
  }, [])

  /* Fade-up scroll observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })

  const openPayment = p => { setPaymentPlan(p); setShowBaddie(false) }
  const handlePaySuccess = () => { setActivePlan(paymentPlan); setPaymentPlan(null); setShowBaddie(true) }
  const handleBaddie = b => { setMatchedBaddie(b); setShowBaddie(false) }
  const handleDone = () => { setMatchedBaddie(null); setActivePlan(null) }

  return (
    <>
      <Navbar onBaddieClick={() => setShowBaddie(true)} onJoin={() => openPayment(PLANS[0])} />
      <Hero onJoin={() => openPayment(PLANS[0])} onBaddie={() => setShowBaddie(true)} />
      <Marquee />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing onSelectPlan={openPayment} />
      <CTASection onJoin={() => openPayment(PLANS[0])} onBaddie={() => setShowBaddie(true)} />
      <Footer />

      {paymentPlan && !showBaddie && (
        <PaymentModal plan={paymentPlan} onClose={() => setPaymentPlan(null)} onSuccess={handlePaySuccess} />
      )}
      {showBaddie && (
        <ChooseBaddiePage onClose={() => setShowBaddie(false)} onSelect={handleBaddie} />
      )}
      {matchedBaddie && activePlan && (
        <MatchSuccess baddie={matchedBaddie} plan={activePlan} onDone={handleDone} />
      )}
    </>
  )
}
