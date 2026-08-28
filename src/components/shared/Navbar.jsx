import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LuFilm, LuMenu, LuX, LuLogIn, LuLogOut, LuUser, LuLayoutDashboard } from 'react-icons/lu';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
      style={{ height: 'var(--navbar-height)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" id="nav-logo">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <LuFilm className="w-8 h-8 text-accent-red-neon" />
          </motion.div>
          <span className="text-xl font-bold font-[var(--font-display)] text-gradient whitespace-nowrap">
            CineVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              id={`nav-${link.label.toLowerCase()}`}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? 'text-accent-red-neon'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-red-neon rounded-full"
                  style={{ boxShadow: '0 0 8px rgba(255,77,77,0.5)' }}
                />
              )}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              id="nav-admin"
              className="flex items-center gap-1.5 text-sm font-medium text-accent-amber hover:text-accent-amber-neon transition-colors"
            >
              <LuLayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border-light flex items-center justify-center flex-shrink-0">
                  <LuUser className="w-4 h-4 text-accent-red-neon" />
                </div>
                <span className="truncate max-w-[130px] lg:max-w-[180px] font-medium">
                  {user?.name || user?.email}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                id="nav-logout"
                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-red transition-colors cursor-pointer flex-shrink-0 ml-1"
              >
                <LuLogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          ) : (
            <Link to="/login" id="nav-login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full bg-accent-red text-white hover:bg-accent-red-neon transition-colors cursor-pointer"
                style={{ boxShadow: 'var(--glow-red)' }}
              >
                <LuLogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-primary p-2 flex-shrink-0"
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border-subtle overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block text-base font-medium py-2 ${
                    location.pathname === link.to
                      ? 'text-accent-red-neon'
                      : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="block text-base font-medium py-2 text-accent-amber"
                >
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-4 border-t border-border-subtle">
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-text-muted hover:text-accent-red"
                  >
                    <LuLogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-accent-red-neon font-semibold"
                  >
                    <LuLogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
