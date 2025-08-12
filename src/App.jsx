import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { CreditCard, ShieldCheck, Infinity, Gift, Sparkles, Star, ArrowRight } from "lucide-react";
import { jsPDF } from "jspdf";
import heroImg from "./assets/nothing-hero.png";


function Boom(){ throw new Error("kaboom"); }


class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err, info){ console.error(err, info); }
  render(){ return this.state.hasError ? <ErrorView/> : this.props.children; }
}

function ErrorView(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-100">
      <h1 className="text-3xl font-bold">500 — Nothing went wrong*</h1>
      <p className="mt-2 text-slate-300">*Something did, but it's probably nothing.</p>
      <a href="/" className="mt-6 inline-block underline">Return to Home</a>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
// FUTURISTIC MINIMAL GLOW THEME
// Palette: near‑black base, neon pastel accents used sparingly
const THEME = {
  bg: "bg-gradient-to-br from-[#0b0d10] via-[#0b1120] to-[#0b0d10]",
  card: "bg-white/3 backdrop-blur-xl border border-white/10",
  accent1: "#5AC8E4", // cyan
  accent2: "#c9a7ff", // violet
  accent3: "#ffa7d7", // magenta‑rose
};

const BRAND = {
  name: "THE NØTHING",
  tagline: "You can't get something for nothing. But you can get NØTHING for something.",
};

// Stripe (replace with real Payment Links)
const STRIPE_ONE_TIME_LINK = "https://buy.stripe.com/test_one_time";
const STRIPE_SUBSCRIPTION_LINK = "https://buy.stripe.com/test_subscription";

// Products
const PRODUCTS = [
  { slug: "nothing-marketing", tld: "nothing.marketing", name: "Nothing Marketing", sub: "Campaign performance guaranteed: nothing.", bullets: ["Funnel stages reduced to zero","Attribution so clean, there isn't any","CPC, CPA, CPM: all perfectly undefined"] },
  { slug: "nothing-productions", tld: "nothing.productions", name: "Nothing Productions", sub: "We’ll circle back with… nothing.", bullets: ["No scripts, no shoots, no edits","Zero reshoots forever","Premiere of absolutely nothing"] },
  { slug: "nothing-reviews", tld: "nothing.reviews", name: "Nothing Reviews", sub: "All five stars. For nothing.", bullets: ["No bias, no bots, no data","100% aggregated silence","Consensus: nothing to see"] },
  { slug: "nothing-today", tld: "nothing.today", name: "Nothing Today", sub: "Daily delivery of nothing.", bullets: ["Arrives every day with nothing","Inbox‑friendly void","Missed it? You didn’t."] },
];

// env vars you added in Vercel (and .env locally)
const ONE = import.meta.env.VITE_STRIPE_ONE_TIME_LINK;
const SUB = import.meta.env.VITE_STRIPE_SUBSCRIPTION_LINK;

// Satirical long‑form copy
function genArticle(name, tld){
  return [
    `${name} is the premium ${tld.split(".")[1]} solution meticulously engineered to deliver exactly what modern consumers crave: nothing. Not less than nothing. Precisely nothing.`,
    `Built on vacuum‑first architecture, ${name} eliminates complexity, features, and outcomes. No onboarding. No learning curve. No roadmaps cluttered with future promises.`,
    `Rollout is instantaneous. Compatibility is universal. Procurement loves it, IT ignores it, and Legal approves it in record time—there is nothing to review.`,
    `Use cases span the enterprise: executive decks with no follow‑ups, marketing plans with no spend, and roadmaps that finally ship on schedule because there is nothing to ship.`,
    `SLA? We guarantee a consistent delivery of nothing, 24/7. If you ever receive something, we’ll investigate immediately and remove it.`,
  ];
}

// ─────────────────────────────────────────────────────────────
// Micro‑components
function NeonButton({ children, onClick, variant = "primary", className = "" }) {
  const isPrimary = variant === "primary";
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${isPrimary ? "text-black font-semibold" : "text-slate-100 bg-white/5 border border-white/10 hover:ring-1 hover:ring-white/20"} ${className}`}
      style={isPrimary ? { background: `linear-gradient(90deg, ${THEME.accent1}, ${THEME.accent2})` } : undefined}
    >
      <span className="relative z-10 antialiased" style={{ transform: "translateZ(0)" }}>{children}</span>
      {/* moving gleam (disabled if prefers-reduced-motion) */}
      {!reduce && (
        <motion.span
          initial={{ x: -260 }}
          animate={{ x: 260 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
        />
      )}
    </button>
  );
}

function GlowLayer() {
  const reduce = useReducedMotion();
  const common = "pointer-events-none fixed blur-3xl";
  const style1 = { background: `radial-gradient(circle at 30% 40%, ${THEME.accent1}22, transparent 60%)` };
  const style2 = { background: `radial-gradient(circle at 60% 50%, ${THEME.accent2}22, transparent 60%)` };
  const style3 = { background: `radial-gradient(circle at 50% 60%, ${THEME.accent3}22, transparent 60%)` };

  if (reduce) {
    // Static, subtler glows (better perf and accessibility)
    return (
      <>
        <div aria-hidden className={`${common} -top-20 -left-24 h-[28rem] w-[28rem] opacity-30`} style={style1} />
        <div aria-hidden className={`${common} top-1/3 -right-24 h-[30rem] w-[30rem] opacity-25`} style={style2} />
        <div aria-hidden className={`${common} bottom-0 left-1/4 h-[24rem] w-[24rem] opacity-20`} style={style3} />
      </>
    );
  }

  // Animated for everyone else
  return (
    <>
      <motion.div aria-hidden initial={{ opacity: 0.25 }} animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className={`${common} -top-20 -left-24 h-[32rem] w-[32rem]`} style={style1} />
      <motion.div aria-hidden initial={{ opacity: 0.25 }} animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className={`${common} top-1/3 -right-24 h-[36rem] w-[36rem]`} style={style2} />
      <motion.div aria-hidden initial={{ opacity: 0.25 }} animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 12, repeat: Infinity }} className={`${common} bottom-0 left-1/4 h-[28rem] w-[28rem]`} style={style3} />
    </>
  );
}


function CardTilt({ children, className="" }){
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useTransform(y, [-50, 50], [8, -8]);
  const ry = useTransform(x, [-50, 50], [-8, 8]);
  return (
    <motion.div
      onMouseMove={(e)=>{ const r=e.currentTarget.getBoundingClientRect(); x.set(e.clientX-r.left-r.width/2); y.set(e.clientY-r.top-r.height/2); }}
      onMouseLeave={()=>{ x.set(0); y.set(0); }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", boxShadow: `0 10px 40px ${THEME.accent2}22` }}
      className={`rounded-2xl ${THEME.card} ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
}

function payOnce(){ window.location.href = STRIPE_ONE_TIME_LINK; }
function subscribe(){ window.location.href = STRIPE_SUBSCRIPTION_LINK; }

function downloadCertificate(name, code){
  const who = name?.trim() || "Recipient";
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  doc.setFillColor(11,13,16); doc.rect(0,0,612,792,"F");
  doc.setDrawColor(160, 170, 255); doc.setLineWidth(2); doc.rect(36,36,612-72,792-72);
  doc.setTextColor(230,235,255);
  doc.setFont("helvetica","bold"); doc.setFontSize(40); doc.text("Certificate of Nothing",306,160,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(14); doc.text("This certifies that the bearer has received absolutely nothing.",306,190,{align:"center"});
  doc.setFont("helvetica","bold"); doc.setFontSize(24); doc.text(who,306,260,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(12); doc.text(`On this day, the above‑named party was gifted precisely nothing.`,306,310,{align:"center", maxWidth:460});
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text(`Redemption Code: ${code}`,306,340,{align:"center"});
  doc.save("certificate-of-nothing.pdf");
}

// ─────────────────────────────────────────────────────────────
// App Checks (basic, non‑wallet "test cases")
function AppChecks(){
  const tests = [
    { name: "Products present", pass: Array.isArray(PRODUCTS) && PRODUCTS.length > 0 },
    { name: "Stripe one‑time link set", pass: typeof STRIPE_ONE_TIME_LINK === "string" && STRIPE_ONE_TIME_LINK.length > 0 },
    { name: "Stripe subscription link set", pass: typeof STRIPE_SUBSCRIPTION_LINK === "string" && STRIPE_SUBSCRIPTION_LINK.length > 0 },
    { name: "Certificate generator available", pass: typeof jsPDF === "function" || typeof jsPDF === "object" },
  ];
  return (
    <details className="mt-6 text-xs text-slate-400">
      <summary className="cursor-pointer">App checks</summary>
      <ul className="mt-2 space-y-1 list-disc list-inside">
        {tests.map((t,i)=> (
          <li key={i}><span className={t.pass ? "text-green-400" : "text-red-400"}>{t.pass ? "PASS" : "FAIL"}</span> — {t.name}</li>
        ))}
      </ul>
    </details>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo Mark - tiny SVG; circle with a slash
function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="23" fill="none" stroke={THEME.accent1} strokeWidth="6" />
      <line x1="16" y1="16" x2="48" y2="48" stroke={THEME.accent1} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}


// ─────────────────────────────────────────────────────────────
function Layout({ children }){
  return (
    <div className={`min-h-screen relative ${THEME.bg}`}>
      <GlowLayer />
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#0b0d10]/70 border-b border-white/10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 grid place-items-center rounded-xl bg-white/5 border border-white/10">
              <LogoMark size={20} />
            </div>
            <span className="font-semibold tracking-tight">{BRAND.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/catalog" className="hover:opacity-80">Catalog</Link>
            <a href="#how" className="hover:opacity-80">How it works</a>
            <a href="#pricing" className="hover:opacity-80">Pricing</a>
            <Link to="/certificate" className="hover:opacity-80">Certificate</Link>
          </nav>
          {/* No wallet code */}
        </div>
      </header>
      {children}
      <footer className="border-t border-white/10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg" style={{ background: THEME.accent2 }} />
            <span>{BRAND.name}</span>
            <span className="text-slate-600">•</span>
            <span>thenothing.site</span>
          </div>
          <div className="flex items-center gap-4">
            <Link className="hover:opacity-80" to="/catalog">Catalog</Link>
            <a className="hover:opacity-80" href="#faq">FAQ</a>
            <a className="hover:opacity-80" href="#">Terms</a>
            <a className="hover:opacity-80" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Home(){
  const reduce = useReducedMotion();
  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-white/10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-36 md:py-44">
          {/* soft spotlight behind heading */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 h-[20rem] w-[40rem] blur-3xl opacity-30" style={{ background: `radial-gradient( ellipse at center, ${THEME.accent1}22, ${THEME.accent2}11 40%, transparent 70%)` }} />

          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              {/* kicker badge */}
              <span className="inline-block text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: THEME.accent1, color: '#0b0d10' }}>Luxury Novelty</span>

              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6 md:mt-8 text-8xl md:text-[12rem] lg:text-[16rem] font-black tracking-[-0.03em] leading-[0.85]">
                Give {reduce ? (
                  <span className="bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(90,200,228,0.25)]" style={{ backgroundImage: `linear-gradient(90deg, ${THEME.accent1}, ${THEME.accent2}, ${THEME.accent3})` }}>Nothing</span>
                ) : (
                  <motion.span
                    className="bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(90,200,228,0.25)]"
                    style={{ backgroundImage: `linear-gradient(90deg, ${THEME.accent1}, ${THEME.accent2}, ${THEME.accent3})`, backgroundSize: '200% 100%' }}
                    initial={{ backgroundPositionX: '0%' }}
                    animate={{ backgroundPositionX: '100%' }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >Nothing</motion.span>
                )}.
              </motion.h1>
              <p className="mt-6 text-xl md:text-2xl text-slate-200 max-w-2xl">{BRAND.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={ONE}
                  className="inline-block rounded-2xl px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
                  style={{ background: "linear-gradient(90deg, #5AC8E4, #ED1C24)" }}>
                  Single Serving of NØTHING
                </a>
                <a href={SUB}
                  className="inline-block rounded-2xl px-5 py-3 text-slate-100 border border-white/10 bg-white/5 transition hover:ring-1 hover:ring-white/20 hover:scale-[1.02]">
                  Join The NØTHING Club
                </a>
                {/*<NeonButton onClick={payOnce} className="group px-7 py-4 text-base"><span className="inline-flex items-center gap-2"><CreditCard className="w-4 h-4 transition-transform group-hover:translate-x-1"/> Buy Nothing (one‑time)</span></NeonButton>*/}
                {/*<NeonButton variant="ghost" onClick={subscribe} className="px-7 py-4 text-base">Subscribe to Nothing (monthly)</NeonButton>*/}
              </div>
              <div className="mt-5 text-xs text-slate-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Secure checkout by Stripe • You will receive… nothing.</div>
              <AppChecks />
            </div>

            <div className="md:justify-self-end">
              <img
                src={heroImg}
                alt="THE NØTHING — premium nothing"
                loading="eager"
                decoding="async"
                className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl"
                style={{ backdropFilter: 'blur(6px)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME / ABOUT */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-slate-100">
        <h2 className="text-2xl font-bold tracking-tight">Welcome to The Nothing 🌀</h2>
        <div className="mt-4 space-y-4 text-slate-300">
          <p>At TheNothing.site, we believe you can’t get something for nothing — but here, you can absolutely get nothing for something.</p>
          <p>And we mean it: a cup of nothing, a jar of nothing, a box of nothing, even pallets of nothing. Why? Because sometimes, nothing is exactly what you’ve been looking for.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <CardTilt className="p-6">
            <h3 className="text-lg font-semibold text-white">Why Nothing?</h3>
            <div className="mt-2 space-y-3 text-slate-300">
              <p>Because nothing compares to the joy of owning… well, nothing.</p>
              <p>We stop at nothing to make sure our nothing is the best nothing you can get.</p>
              <p>Here, you’ll find nothing but the best, nothing but the truth, and definitely nothing to hide.</p>
              <p>And if you’re worried you might be paying next to nothing for nothing at all — relax. That’s the point.</p>
            </div>
          </CardTilt>

          <CardTilt className="p-6">
            <h3 className="text-lg font-semibold text-white">Our Philosophy</h3>
            <div className="mt-2 space-y-3 text-slate-300">
              <p>In a world where everyone’s selling something, we’re selling nothing.</p>
              <p>Not figuratively, but literally nothing.</p>
              <p>Why? Because nothing lasts forever, and that’s a beautiful thing.</p>
              <p>It’s all or nothing — and if you choose us, you’re choosing the purest nothing there is.</p>
              <p>We leave nothing to chance, so you’ll get nothing unusual, nothing out of the ordinary, and nothing serious — every time.</p>
              <p>When it comes to nothing, we offer nothing more, nothing less.</p>
            </div>
          </CardTilt>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <CardTilt className="p-6">
            <h3 className="text-lg font-semibold text-white">What You’ll Get</h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300">
              <li>A big fat nothing (guaranteed)</li>
              <li>Sweet nothings whispered into your email inbox</li>
              <li>The ability to tell your friends you paid nothing down for your nothing down loan</li>
              <li>A receipt for your worth nothing purchase — perfect for framing</li>
            </ul>
          </CardTilt>

          <CardTilt className="p-6">
            <h3 className="text-lg font-semibold text-white">Who’s It For?</h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300">
              <li>The minimalist who wants nothing to lose</li>
              <li>The philosopher pondering nothingness</li>
              <li>The romantic who lives for sweet nothings</li>
              <li>The realist who knows nothing lasts forever</li>
              <li>The dreamer who believes you can make something out of nothing</li>
            </ul>
          </CardTilt>
        </div>

        <CardTilt className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-white">Your Guarantee</h3>
          <div className="mt-2 space-y-3 text-slate-300">
            <p>If you’re not 100% satisfied with your nothing, we promise… nothing will happen.</p>
            <p>No refunds, no returns — just nothing doing.</p>
            <p>Because when you buy nothing, there’s nothing to complain about and nothing to return.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <NeonButton onClick={payOnce}><span className="inline-flex items-center gap-2"><CreditCard className="w-4 h-4"/> Get Nothing Now</span></NeonButton>
            <NeonButton variant="ghost" onClick={subscribe}>Subscribe to Nothing</NeonButton>
          </div>
          <p className="mt-2 text-xs text-slate-500">Ready for Nothing? Click the button below and get nothing at all delivered instantly. No shipping, no delays, nothing to hide. Because at TheNothing.site… nothing else matters.</p>
        </CardTilt>
      </section>

      {/* CATALOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 pb-16 text-slate-100">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-bold tracking-tight">Featured Nothings</h2><Link to="/catalog" className="text-sm inline-flex items-center gap-1 hover:opacity-80">View all <ArrowRight className="w-4 h-4"/></Link></div>
        <div className="mt-6 grid md:grid-cols-4 gap-5">
          {/* Hover gradients on cards */}
          {PRODUCTS.slice(0,4).map(p => (
            <CardTilt key={p.slug} className="p-5">
              <Link to={`/p/${p.slug}`} className="block hover:bg-white/5 rounded-xl transition-colors">
                <div className="text-xs text-slate-400">{p.tld}</div>
                <div className="mt-1 font-semibold text-white">{p.name}</div>
                <div className="text-sm text-slate-300">{p.sub}</div>
              </Link>
            </CardTilt>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-4 py-16 text-slate-100">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-5">
          {["Pick Nothing","Pay for Nothing","Send Nothing","Enjoy Nothing"].map((t,i)=> (
            <CardTilt key={i} className="p-5">
              <div className="text-5xl font-black text-slate-600">{i+1}</div>
              <div className="mt-3 font-semibold text-white">{t}</div>
              <div className="text-sm text-slate-300 mt-1">No shipping, no tracking, no returns. Bliss.</div>
            </CardTilt>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-16 text-slate-100">
        <h2 className="text-2xl font-bold tracking-tight">Pricing</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <CardTilt className="p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200"><Gift className="w-4 h-4"/> Classic Nothing</div>
            <div className="mt-2 text-4xl font-black tracking-tight text-white">$10</div>
            <div className="text-sm text-slate-300">One‑time gag gift • Includes downloadable Certificate of Nothing</div>
            <NeonButton onClick={payOnce} className="mt-6 w-full">Buy Nothing</NeonButton>
          </CardTilt>
          <CardTilt className="p-6 ring-1" style={{ boxShadow: `0 0 0 1px ${THEME.accent2}33 inset, 0 20px 60px ${THEME.accent2}22` }}>
            <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: THEME.accent2, color: "#0b0d10" }}>POPULAR</span>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200 mt-2"><Infinity className="w-4 h-4"/> Nothing Club</div>
            <div className="mt-2 text-4xl font-black tracking-tight text-white">$3<span className="text-base font-semibold text-slate-200">/mo</span></div>
            <ul className="mt-2 text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Monthly email containing nothing</li>
              <li>Access to the Empty Dashboard</li>
              <li>VIP status: proudly show you pay for nothing</li>
            </ul>
            <NeonButton onClick={subscribe} className="mt-6 w-full">Subscribe</NeonButton>
          </CardTilt>
        </div>
        <p className="mt-3 text-xs text-slate-500">By proceeding, you agree that you are purchasing nothing. No physical or digital goods are delivered. Certificates are novelty items.</p>
      </section>
    </>
  );
}

function Catalog(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 text-slate-100">
      <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
      <p className="text-slate-300 mt-2">Explore industry‑specific nothings. Each page reads like a serious launch. Each delivers nothing.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {PRODUCTS.map(p => (
          <CardTilt key={p.slug} className="p-6">
            <Link to={`/p/${p.slug}`} className="block hover:bg-white/5 rounded-xl transition-colors">
              <div className="text-xs text-slate-400">{p.tld}</div>
              <div className="mt-1 text-lg font-semibold text-white">{p.name}</div>
              <div className="text-sm text-slate-300">{p.sub}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-slate-200">View <ArrowRight className="w-4 h-4"/></div>
            </Link>
          </CardTilt>
        ))}
      </div>
    </section>
  );
}

function ProductPage(){
  const { slug } = useParams();
  const nav = useNavigate();
  const product = PRODUCTS.find(p=>p.slug===slug);
  const [name,setName] = useState("");
  const [code] = useState(()=>Math.random().toString(36).slice(2,10).toUpperCase());

  if(!product){
    return (
      <section className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-100">
        <h1 className="text-3xl font-bold">This nothing does not exist.</h1>
        <p className="text-slate-300">Which is on‑brand, honestly.</p>
        <NeonButton onClick={()=>nav('/catalog')} className="mt-6">Back to Catalog</NeonButton>
      </section>
    );
  }

  const article = genArticle(product.name, product.tld);

  return (
    <>
      <section className="border-b border-white/10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-xs text-slate-400">{product.tld}</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">{product.name}</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">{product.sub}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NeonButton onClick={payOnce}><span className="inline-flex items-center gap-2"><CreditCard className="w-4 h-4"/> Buy Nothing</span></NeonButton>
            <NeonButton variant="ghost" onClick={subscribe}>Subscribe to Nothing</NeonButton>
          </div>
          <div className="mt-3 text-xs text-slate-500">Secure checkout by Stripe • You will receive… nothing.</div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 text-slate-100">
        <div className="grid md:grid-cols-3 gap-5">
          {product.bullets.map((b,i)=>(
            <CardTilt key={i} className="p-5">
              <div className="flex items-center gap-2 font-semibold text-white"><Star className="w-4 h-4" style={{ color: THEME.accent1 }} /> {b}</div>
              <div className="text-sm text-slate-300 mt-1">Included by design: nothing else.</div>
            </CardTilt>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8 text-slate-100">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="space-y-4">
          {article.map((para,idx)=>(<p key={idx} className="leading-relaxed text-slate-300">{para}</p>))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 text-slate-100">
        <CardTilt className="p-6">
          <div className="text-sm text-slate-300">Generate a novelty certificate for your recipient</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recipient name" className="mt-2 w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder:text-slate-500" />
          <NeonButton onClick={()=>downloadCertificate(name, code)} className="mt-4 w-full"><span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4"/> Download Certificate (PDF)</span></NeonButton>
          <p className="mt-2 text-xs text-slate-500">Gate this behind a Stripe webhook in production.</p>
        </CardTilt>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 text-slate-100">
        <div className="text-xs text-slate-500">By purchasing, you agree to receive nothing. Refunds, where legally required, will result in the return of nothing.</div>
      </section>
    </>
  );
}

function CertificateLanding(){
  const [name,setName] = useState("");
  const [code] = useState(()=>Math.random().toString(36).slice(2,10).toUpperCase());
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-slate-100">
      <h1 className="text-3xl font-bold tracking-tight">Certificate of Nothing</h1>
      <p className="text-slate-300">Enter a name and download the novelty PDF.</p>
      <CardTilt className="mt-4 p-6">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Recipient name" className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder:text-slate-500" />
        <NeonButton onClick={()=>downloadCertificate(name, code)} className="mt-4 w-full"><span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4"/> Download Certificate (PDF)</span></NeonButton>
        <p className="mt-2 text-xs text-slate-500">Pro tip: unlock after payment with Stripe webhooks.</p>
      </CardTilt>
    </section>
  );
}

function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-100">
      <h1 className="text-3xl font-bold">404 — Nothing here.</h1>
      <p className="mt-2 text-slate-300">The page you’re looking for is… nothing.</p>
      <NeonButton onClick={() => (window.location.href = "/")} className="mt-6">
        Return to Home
      </NeonButton>
    </section>
  );
}


export default function App(){
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/catalog" element={<Catalog/>} />
            <Route path="/p/:slug" element={<ProductPage/>} />
            <Route path="/certificate" element={<CertificateLanding/>} />
            <Route path="/boom" element={<Boom/>} /> {/* REMOVE THIS AFTER TESTING */}
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
