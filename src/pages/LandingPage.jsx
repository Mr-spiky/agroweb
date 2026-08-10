import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Layout from "../components/common/Layout"

// ── Icons (SVG) ─────────────────────────────────────────────────────────────
const BrainIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/></svg>
const MicroscopeIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>
const CloudSunIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/><path d="M17 18H9.5a5.5 5.5 0 0 1-2.22-10.53 4 4 0 0 1 7.15-2.07A4.5 4.5 0 0 1 17 18z"/></svg>
const StoreIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>


// ── Animated counter hook ───────────────────────────────────────────────────
const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) setTriggered(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [triggered])

  useEffect(() => {
    if (!triggered) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [triggered, end, start, duration])

  return [count, ref]
}

// ── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }) => (
  <div className="relative p-6 rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-default bg-white border border-gray-100 shadow-sm hover:shadow-md">
    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
)

// ── Step card ────────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
      {num}
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
)

const LandingPage = () => {
  const [farmers, farmersRef] = useCounter(5200, 2000)
  const [products, productsRef] = useCounter(28000, 2200)
  const [orders, ordersRef] = useCounter(103000, 2400) // Formatted to 1,03,000 below
  const [gmv, gmvRef] = useCounter(240, 1800)

  return (
    <Layout>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative min-h-screen overflow-hidden flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Smart farming background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">India's Farm-to-Market Intelligence Platform</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Smart Farming.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Direct Sales.
              </span>
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed mb-10 max-w-xl">
              AgroWeb connects Indian farmers directly with buyers — eliminating middlemen, boosting farmer income by up to{" "}
              <span className="text-emerald-400 font-semibold">40%</span>, and delivering the freshest produce at fair prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-105"
              >
                🌱 Join as Farmer / Buyer
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                🛒 Browse Marketplace
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-4">
              {["NPOP Certified Farms", "MSP-Linked Pricing", "Direct Farm Delivery", "AI Crop Advisory"].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Floating product cards */}
          <div className="hidden lg:flex flex-col gap-4 pl-12">
            {[
              { name: "Alphonso Mangoes", farmer: "Priya Sharma, Nashik", price: "₹280/kg", tag: "Organic ✓", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop" },
              { name: "Basmati Rice", farmer: "Anita Verma, Karnal", price: "₹95/kg", tag: "Premium Grade", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop" },
              { name: "Guntur Red Chilli", farmer: "Kavitha Reddy, Guntur", price: "₹220/kg", tag: "GI Tagged", image: "https://images.unsplash.com/photo-1588015509772-e1d8825c00e1?w=100&h=100&fit=crop" },
            ].map((card) => (
              <div key={card.name} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center space-x-4 hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/20">
                <img src={card.image} alt={card.name} className="w-14 h-14 rounded-xl object-cover shadow-inner" />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{card.name}</p>
                  <p className="text-white/60 text-xs">{card.farmer}</p>
                </div>
                <div className="text-right bg-black/20 px-3 py-1.5 rounded-lg">
                  <p className="text-emerald-300 font-bold text-sm">{card.price}</p>
                  <span className="text-[10px] uppercase font-bold text-white/50">{card.tag}</span>
                </div>
              </div>
            ))}
            
            {/* AI Advisory preview card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mt-2 shadow-xl shadow-black/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                      <BrainIcon />
                    </div>
                    <span className="text-white font-medium text-xs">AgroScan AI Advisory</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded text-[10px] font-bold text-emerald-300 uppercase">Live</span>
                </div>
                <p className="text-white text-sm font-semibold mb-1">Recommended: Wheat</p>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-white/60 text-xs">Clay soil · North · Winter · MSP: ₹2,275/qtl</p>
                  <span className="text-emerald-400 font-bold text-sm">96% Match</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="rgb(249 250 251)" />
          </svg>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { ref: farmersRef, value: farmers, suffix: "+", label: "Registered Farmers", icon: "👨‍🌾" },
              { ref: productsRef, value: products, suffix: "+", label: "Products Listed", icon: "🥦" },
              { ref: ordersRef, value: orders, suffix: "+", label: "Orders Completed", icon: "📦" },
              { ref: gmvRef, value: gmv, prefix: "₹", suffix: " Cr+", label: "Total GMV", icon: "💰" },
            ].map(({ ref, value, label, icon, prefix = "", suffix = "" }) => (
              <div key={label} ref={ref} className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3 grayscale opacity-80">{icon}</div>
                <div className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {prefix}{(value).toLocaleString("en-IN")}{suffix}
                </div>
                <p className="text-gray-500 text-sm mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Platform Capabilities</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">Everything a farmer needs.<br />Everything a buyer wants.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<BrainIcon />} title="AI Crop Advisor" desc="Get data-driven crop recommendations based on soil type, season, region and water availability — with MSP and profit projections." />
            <FeatureCard icon={<MicroscopeIcon />} title="Pest Detection" desc="Upload a crop photo and our AgroScan model identifies diseases, severity and provides step-by-step organic + chemical treatment plans." />
            <FeatureCard icon={<CloudSunIcon />} title="Hyper-Local Weather" desc="City-specific 5-day forecasts with soil moisture, UV index and dynamic farming tips tailored to current conditions." />
            <FeatureCard icon={<StoreIcon />} title="Direct Marketplace" desc="List produce and sell directly to verified buyers. No commission agents, no cold-storage losses. Better margin, fresher produce." />
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <div className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Simple Process</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 leading-tight">From field to table<br />in 3 steps</h2>
              <div className="space-y-10">
                <StepCard num="1" title="Farmer registers and lists produce" desc="Set your price, quantity and delivery area. AI suggests optimal pricing based on market trends." />
                <StepCard num="2" title="Buyer discovers and orders" desc="Browse by crop, region or season. View farmer profiles and order with one click." />
                <StepCard num="3" title="Direct delivery, no middlemen" desc="Farmer ships directly to buyer. Both get real-time tracking and auto payment confirmation." />
              </div>
            </div>
            {/* Testimonials */}
            <div className="space-y-6">
              {[
                { name: "Gurpreet Singh", role: "Wheat Farmer, Ludhiana", quote: "Earlier I sold at ₹18/kg to the mandi. On AgroWeb I sell directly at ₹28/kg. This extra ₹10 makes a huge difference on 40 acres.", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face" },
                { name: "Deepa Iyer", role: "Home Baker, Chennai", quote: "I get fresh organic flour directly from Punjab farms. No more supermarket markup — and I know exactly which field it came from.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
                { name: "Kavitha Reddy", role: "Spice Farmer, Guntur", quote: "The pest detection feature saved my chilli crop from a whitefly outbreak. The treatment plan worked in under a week.", avatar: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=100&h=100&fit=crop&crop=face" },
              ].map((t) => (
                <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                  <div className="absolute top-6 right-6 text-gray-200">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L16.096 14.281L16.014 14.242C15.176 13.882 14.544 13.064 14.544 12.049C14.544 10.518 15.772 9.278 17.29 9.278C18.808 9.278 20.035 10.518 20.035 12.049C20.035 15.006 17.653 19.349 14.869 21H14.017ZM6.16 21L8.239 14.281L8.157 14.242C7.319 13.882 6.687 13.064 6.687 12.049C6.687 10.518 7.915 9.278 9.433 9.278C10.951 9.278 12.178 10.518 12.178 12.049C12.178 15.006 9.796 19.349 7.012 21H6.16Z"/></svg>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 pr-8">"{t.quote}"</p>
                  <div className="flex items-center space-x-3 border-t border-gray-50 pt-4">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to transform Indian agriculture?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Join 5,200+ farmers and buyers already using AgroWeb to trade smarter, grow better, and earn more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors duration-200 shadow-lg"
            >
              🌱 Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200"
            >
              Sign In →
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-8 font-medium">Demo: <span className="text-gray-300">farmer@demo.com</span> / <span className="text-gray-300">buyer@demo.com</span> · Pass: <span className="text-gray-300">demo123</span></p>
        </div>
      </div>
    </Layout>
  )
}

export default LandingPage
