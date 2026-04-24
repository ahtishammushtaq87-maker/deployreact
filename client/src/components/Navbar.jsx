import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, RefreshCcw, User, Wallet, Send, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/exchange', icon: RefreshCcw, label: 'Exchange' },
    { to: '/transfer', icon: Send, label: 'Send' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav py-2 shadow-lg' : 'bg-[#1c559b] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-[#65e5d5] p-2 rounded-xl shadow-lg shadow-mint-glow/20"
            >
              <Wallet className="text-[#1c559b]" size={22} />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Nova<span className="text-[#65e5d5]">pay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/5">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(to)
                    ? 'bg-white text-[#1c559b] shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-[#65e5d5] to-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-[#1c559b] font-extrabold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">{user?.name?.split(' ')[0]}</span>
                <span className="text-[10px] text-[#65e5d5] font-medium">Verified</span>
              </div>
              <ChevronDown size={14} className="text-white/50" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2.5 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                    isActive(to) 
                      ? 'bg-white text-[#1c559b]' 
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} />
                  Logout Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
