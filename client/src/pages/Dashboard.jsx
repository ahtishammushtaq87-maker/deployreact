import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import VirtualCard from '../components/VirtualCard';
import { Send, RefreshCcw, CreditCard, TrendingUp, Users, ArrowUpRight, ShieldCheck, Plus, Landmark, Bell, Search, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [walletRes, transRes, cardsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/transactions'),
        api.get('/cards'),
      ]);
      setWallet(walletRes.data);
      setTransactions(transRes.data);
      setCards(cardsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const quickActions = [
    { icon: Send,       label: 'Send Money',  sub: 'Instant transfer',    color: 'bg-blue-500', path: '/transfer' },
    { icon: RefreshCcw, label: 'Exchange',    sub: 'Swap currencies',     color: 'bg-purple-500', path: '/exchange' },
    { icon: CreditCard, label: 'My Cards',   sub: 'Card vault',          color: 'bg-emerald-500', path: '/profile' },
    { icon: Plus,       label: 'Top Up',     sub: 'Add demo funds',      color: 'bg-amber-500', path: '/profile' },
  ];

  const stats = [
    { icon: TrendingUp,  label: 'Monthly Growth',  value: '+12.4%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Users,       label: 'Transfers Made',   value: transactions.filter(t => t.type === 'Transfer').length, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: RefreshCcw,  label: 'Exchanges Done',   value: transactions.filter(t => t.type === 'Exchange').length, color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: ShieldCheck, label: 'Security Score',   value: '98/100',  color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
      />
      <p className="text-slate-500 font-bold animate-pulse">Initializing your secure workspace...</p>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ── Header ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">
            Welcome back, <span className="text-[#1c559b]">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here's your real-time financial overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all w-64 text-sm font-medium"
            />
          </div>
          <button className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
            <Bell size={20} />
          </button>
          <button className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
      >
        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Balance Section */}
          <motion.div variants={itemVariants}>
            <BalanceCard
              wallet={wallet}
              showBalance={showBalance}
              setShowBalance={setShowBalance}
              onRefresh={fetchData}
            />
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              Quick Actions
              <span className="h-px bg-slate-200 flex-grow ml-2"></span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(a.path)}
                  className="glass-card p-5 rounded-3xl flex flex-col items-center text-center group transition-all hover:bg-white active:bg-slate-50"
                >
                  <div className={`w-14 h-14 rounded-2xl ${a.color} flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300`}>
                    <a.icon size={26} className="text-white" />
                  </div>
                  <span className="font-bold text-[#0f172a] text-sm">{a.label}</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1">{a.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <div className="text-2xl font-black text-[#0f172a] leading-tight">{s.value}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Recent Activity Table */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-[#0f172a]">Recent Activity</h2>
              <button 
                onClick={() => navigate('/history')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-all"
              >
                View Analytics <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              {transactions.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Landmark size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No activity yet</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Start your journey by making your first transfer or currency swap!</p>
                  <button
                    onClick={() => navigate('/transfer')}
                    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Send Money Now
                  </button>
                </div>
              ) : (
                <TransactionList transactions={transactions.slice(0, 5)} />
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Linked Cards Section */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-[#0f172a]">My Vault</h2>
              <button 
                onClick={() => navigate('/profile')} 
                className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
              >
                + New Card
              </button>
            </div>

            <div className="space-y-4">
              {cards.length > 0 ? (
                cards.slice(0, 2).map((c, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <VirtualCard card={c} />
                  </motion.div>
                ))
              ) : (
                <div className="glass-card p-10 rounded-3xl text-center border-2 border-dashed border-slate-200">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={24} className="text-blue-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No cards issued</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">Instantly issue a virtual card for international payments.</p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="mt-6 w-full py-3 border border-blue-600 text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-50 transition-all"
                  >
                    Issue Virtual Card
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Multi-Currency Balances */}
          <motion.div variants={itemVariants}>
             <h2 className="text-lg font-bold text-[#0f172a] mb-5">Portfolio</h2>
             <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                {(wallet?.balances || []).map((bal, i) => {
                  const meta = {
                    PKR: { flag:'🇵🇰', color:'text-emerald-600', bg:'bg-emerald-50', name: 'Pakistani Rupee' },
                    USD: { flag:'🇺🇸', color:'text-blue-600', bg:'bg-blue-50', name: 'US Dollar' },
                    EUR: { flag:'🇪🇺', color:'text-indigo-600', bg:'bg-indigo-50', name: 'Euro' },
                    GBP: { flag:'🇬🇧', color:'text-amber-600', bg:'bg-amber-50', name: 'British Pound' },
                  };
                  const m = meta[bal.currency] || { flag:'💰', color:'text-slate-600', bg:'bg-slate-50', name: 'Digital Asset' };
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl leading-none">{m.flag}</span>
                        <div>
                          <p className="font-bold text-[#0f172a] text-sm">{bal.currency}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{m.name}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-[#0f172a]">
                        {showBalance
                          ? parseFloat(bal.amount?.$numberDecimal || 0).toLocaleString(undefined, { 
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
                          : '••••••'}
                      </div>
                    </motion.div>
                  );
                })}
             </div>
          </motion.div>

          {/* Verification / Security Widget */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-[#1c559b] to-[#0f3d78] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#65e5d5]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-[#65e5d5] rounded-lg">
                    <ShieldCheck size={16} className="text-[#1c559b]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65e5d5]">Trusted Identity</span>
                </div>
                <h4 className="text-xl font-black mb-2 italic">Student Demo Mode</h4>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  You're exploring our premium banking interface. All funds are simulated for testing.
                </p>
                <button className="w-full py-3 bg-[#65e5d5] text-[#1c559b] rounded-2xl font-black text-xs hover:bg-white transition-all shadow-lg shadow-[#65e5d5]/20 uppercase">
                  View Security Guide
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
