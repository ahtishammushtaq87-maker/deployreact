import React, { useState } from 'react';
import { Eye, EyeOff, Zap, TrendingUp, RefreshCw, Wallet, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const BalanceCard = ({ wallet, showBalance, setShowBalance, onRefresh }) => {
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const primaryBalance = wallet?.balances?.find(b => b.currency === 'PKR') || wallet?.balances?.[0];
  const primaryAmount = parseFloat(primaryBalance?.amount?.$numberDecimal || 0);

  const handleTopUp = async () => {
    setToppingUp(true);
    try {
      await api.post('/wallet/demo-topup');
      setTopUpSuccess(true);
      if (onRefresh) onRefresh();
      setTimeout(() => setTopUpSuccess(false), 3000);
    } catch (err) {
      console.error('Top up failed:', err);
    } finally {
      setToppingUp(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl text-white premium-gradient shadow-2xl mint-glow/10"
    >
      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#65e5d5]/10 rounded-full pointer-events-none blur-2xl" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 p-8 sm:p-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#65e5d5] animate-pulse" />
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Live Assets Account</span>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tighter">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={showBalance ? 'visible' : 'hidden'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="inline-block"
                  >
                    {showBalance
                      ? primaryAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '••••••'
                    }
                  </motion.span>
                </AnimatePresence>
                <span className="text-2xl text-[#65e5d5] ml-2 font-bold">{primaryBalance?.currency || 'PKR'}</span>
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5"
              >
                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3 self-end sm:self-auto"
          >
            <div className="bg-[#65e5d5] p-1.5 rounded-lg shadow-lg">
              <TrendingUp size={14} className="text-[#1c559b]" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase">Status</p>
              <p className="text-xs font-black text-[#65e5d5] tracking-wide">UNIVERSITY DEMO</p>
            </div>
          </motion.div>
        </div>

        {/* Currency Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-0 pt-6 border-t border-white/10 mt-10">
          {(wallet?.balances || []).filter(b => b.currency !== 'PKR').map((bal, idx) => {
            const meta = { 
              USD: { flag: '🇺🇸', name: 'Dollars' }, 
              EUR: { flag: '🇪🇺', name: 'Euro' }, 
              GBP: { flag: '🇬🇧', name: 'Pounds' } 
            };
            const m = meta[bal.currency] || { flag: '💰', name: 'Assets' };
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">{m.flag}</span>
                  <ArrowUpRight size={14} className="text-white/20 group-hover:text-[#65e5d5] transition-colors" />
                </div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{bal.currency}</p>
                <p className="text-lg font-black font-mono tracking-tight mt-1">
                  {showBalance ? parseFloat(bal.amount?.$numberDecimal || 0).toLocaleString() : '•••'}
                </p>
              </motion.div>
            );
          })}
          
          {/* Static info placeholder if fewer than 3 extra currencies */}
          {(wallet?.balances || []).length < 4 && (
             <div className="hidden sm:flex bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 items-center justify-center text-center">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">More Assets Coming</p>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-2xl">
               <Wallet size={20} className="text-[#65e5d5]" />
             </div>
             <div>
               <p className="text-[10px] text-white/50 font-bold uppercase">Instant Credit</p>
               <p className="text-sm font-bold text-white/90 italic">Top up your demo account instantly.</p>
             </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(101, 229, 213, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleTopUp}
            disabled={toppingUp}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#65e5d5] text-[#1c559b] px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all disabled:opacity-50"
          >
            {toppingUp ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Zap size={18} fill="currentColor" />
            )}
            <span className="uppercase tracking-[0.1em]">
              {topUpSuccess ? '✓ Demo Funds Added' : toppingUp ? 'Processing...' : 'Get Demo Funds'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
