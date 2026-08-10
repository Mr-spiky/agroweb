"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"

// ── SVG Icons (inline, no extra dependency) ──────────────────────────────────
const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ── NavLink with active indicator ─────────────────────────────────────────────
const NavLink = ({ to, children, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/")
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative inline-flex items-center px-1 py-1 text-sm font-medium transition-colors duration-150 group ${
        isActive ? "text-emerald-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-500 transition-transform duration-200 origin-left ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`} />
    </Link>
  )
}

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = () => setIsProfileOpen(false)
    if (isProfileOpen) document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [isProfileOpen])

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const cartCount = getItemCount()

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-b border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:shadow-emerald-200 transition-shadow">
                <LeafIcon />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Agro<span className="text-emerald-600">Web</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden sm:flex items-center gap-7">
              <NavLink to="/marketplace">Marketplace</NavLink>
              {currentUser?.role === "farmer" && (
                <>
                  <NavLink to="/farmer/dashboard">Dashboard</NavLink>
                  <NavLink to="/farmer/manage-listings">Products</NavLink>
                  <NavLink to="/farmer/orders">Orders</NavLink>
                </>
              )}
              {currentUser?.role === "buyer" && (
                <>
                  <NavLink to="/buyer/dashboard">Dashboard</NavLink>
                  <NavLink to="/buyer/orders">My Orders</NavLink>
                </>
              )}
            </div>

            {/* ── Right Side ── */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Cart (buyer only) */}
              {currentUser?.role === "buyer" && (
                <Link to="/buyer/cart" className="relative p-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {currentUser ? (
                /* Profile dropdown */
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen) }}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-150"
                  >
                    <img
                      className="h-7 w-7 rounded-full ring-2 ring-emerald-100 object-cover"
                      src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=059669&color=fff`}
                      alt={currentUser.name}
                    />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-900 leading-none">{currentUser.name?.split(" ")[0]}</p>
                      <p className="text-[10px] text-gray-400 capitalize leading-none mt-0.5">{currentUser.role}</p>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-lg bg-white border border-gray-100 overflow-hidden z-50 animate-scale-in">
                      {/* Profile header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 text-sm">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-150 shadow-sm hover:shadow-emerald-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div className={`sm:hidden transition-all duration-200 overflow-hidden ${isMenuOpen ? "max-h-screen border-t border-gray-100" : "max-h-0"}`}>
          <div className="px-4 py-3 space-y-1 bg-white">
            {[
              { to: "/marketplace", label: "Marketplace" },
              ...(currentUser?.role === "farmer" ? [
                { to: "/farmer/dashboard", label: "Dashboard" },
                { to: "/farmer/manage-listings", label: "My Products" },
                { to: "/farmer/orders", label: "Orders" },
              ] : []),
              ...(currentUser?.role === "buyer" ? [
                { to: "/buyer/dashboard", label: "Dashboard" },
                { to: "/buyer/orders", label: "My Orders" },
                { to: "/buyer/cart", label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
              ] : []),
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100 mt-2">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <img
                      className="h-9 w-9 rounded-full"
                      src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=059669&color=fff`}
                      alt={currentUser.name}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Sign in</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 text-center">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default Navbar
