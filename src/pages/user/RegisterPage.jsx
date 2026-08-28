import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuMail, LuLock, LuUser, LuUserPlus, LuFilm, LuArrowRight } from 'react-icons/lu';
import { useAuth } from '../../hooks/useAuth';
import PageTransition from '../../components/shared/PageTransition';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-16 bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent-red/15 border border-accent-red/30 flex items-center justify-center mb-4 shadow-lg shadow-accent-red/15">
              <LuFilm className="w-8 h-8 text-accent-red-neon" />
            </div>
            <h1 className="text-4xl font-extrabold font-[var(--font-display)] text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-base text-text-muted mt-2">
              Join CineVerse for the best cinema experience
            </p>
          </div>

          {/* Card */}
          <div className="w-full bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-2xl shadow-black/70">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">

              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="register-name" className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <LuUser className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="John Doe"
                    required
                    id="register-name"
                    className="w-full h-14 bg-bg-card border border-border-subtle hover:border-border-light rounded-xl pl-12 pr-4 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red-neon focus:ring-2 focus:ring-accent-red-neon/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="register-email" className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <LuMail className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="you@example.com"
                    required
                    id="register-email"
                    className="w-full h-14 bg-bg-card border border-border-subtle hover:border-border-light rounded-xl pl-12 pr-4 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red-neon focus:ring-2 focus:ring-accent-red-neon/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="register-password" className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Password
                </label>
                <div className="relative flex items-center">
                  <LuLock className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    id="register-password"
                    className="w-full h-14 bg-bg-card border border-border-subtle hover:border-border-light rounded-xl pl-12 pr-4 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red-neon focus:ring-2 focus:ring-accent-red-neon/20 transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="register-confirm-password" className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <LuLock className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    id="register-confirm-password"
                    className="w-full h-14 bg-bg-card border border-border-subtle hover:border-border-light rounded-xl pl-12 pr-4 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red-neon focus:ring-2 focus:ring-accent-red-neon/20 transition-all"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  id="register-submit"
                  className="w-full h-12 rounded-xl bg-accent-red hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-accent-red/30 transition-all duration-200 hover:shadow-accent-red/50"
                >
                  <LuUserPlus className="w-5 h-5 flex-shrink-0" />
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="my-6 border-t border-border-subtle" />

            <div className="text-center">
              <span className="text-sm text-text-muted">Already have an account?&nbsp;</span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-red-neon hover:text-white transition-colors"
                id="login-link"
              >
                Sign In
                <LuArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
