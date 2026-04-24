import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CURRENCIES } from '../../../shared/constants';
import { RefreshCw, ArrowRightLeft, TrendingUp, AlertCircle, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExchangePage = () => {
  const [wallet, setWallet] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('PKR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchWallet(); }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchRate();
    }
  }, [fromCurrency, toCurrency]);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRate = async () => {
    setLoading(true);
    try {
      const mockRates = {
        'PKR_USD': 0.0036, 'USD_PKR': 278.50,
        'PKR_EUR': 0.0033, 'EUR_PKR': 301.20,
        'USD_EUR': 0.92,   'EUR_USD': 1.09
      };
      const pair = `${fromCurrency}_${toCurrency}`;
      setRate(mockRates[pair] || 1.0);
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = async (e) => {
    e.preventDefault();
    setExchanging(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/wallet/exchange', {
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount)
      });
      setSuccess(res.data);
      setWallet(res.data.wallet);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Exchange failed');
    } finally {
      setExchanging(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span className="text-[#65e5d5] bg-[#1c559b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-blue-500/20">Market Exchange</span>
        <h2 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight">Currency Conversion</h2>
        <p className="text-slate-500 font-medium">Swap between multiple currencies instantly with the best market rates.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Exchange Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-xl border border-slate-50"
        >
          <form onSubmit={handleExchange} className="space-y-6">
            <div className="space-y-3">
              {/* From */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You Sell</label>
                   <span className="text-[10px] font-bold text-slate-400">Balance: <span className="text-slate-900">{fromCurrency} {parseFloat(wallet?.balances?.find(b => b.currency === fromCurrency)?.amount?.$numberDecimal || 0).toFixed(2)}</span></span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-3xl font-black outline-none w-1/2 placeholder:text-slate-200"
                    required
                  />
                  <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-white border border-slate-200 px-4 py-3 rounded-2xl font-black text-sm outline-none shadow-sm focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-6 relative z-10">
                <motion.button 
                  type="button"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={swapCurrencies}
                  className="bg-[#1c559b] text-[#65e5d5] p-4 rounded-full shadow-2xl shadow-blue-500/40 transition-shadow ring-8 ring-white"
                >
                  <ArrowRightLeft size={24} />
                </motion.button>
              </div>

              {/* To */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all opacity-95">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You Buy</label>
                  <span className="text-[10px] font-bold text-slate-400">Estimated Receipt</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className={`text-3xl font-black ${amount ? 'text-emerald-600' : 'text-slate-200'} italic`}>
                    {amount ? (amount * rate).toFixed(2) : '0.00'}
                  </div>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-white border border-slate-200 px-4 py-3 rounded-2xl font-black text-sm outline-none shadow-sm focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                     <Info size={12} /> Conversion Fee: <span className="text-emerald-500">0%</span>
                   </p>
                   <span className="text-[10px] font-bold text-slate-400">Balance: {toCurrency} {parseFloat(wallet?.balances?.find(b => b.currency === toCurrency)?.amount?.$numberDecimal || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 px-6 py-4 rounded-2xl flex items-center justify-between border border-blue-100">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-2">
                 <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                 Guaranteed Exchange Rate
              </span>
              <span className="text-sm font-black text-blue-600">
                {loading ? 'Fetching live rates...' : `1 ${fromCurrency} = ${rate} ${toCurrency}`}
              </span>
            </div>

            <button 
              disabled={exchanging || !amount || amount <= 0}
              className="w-full bg-[#1c559b] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-[#16447c] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {exchanging ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  Executing Swap...
                </>
              ) : (
                'Review & Confirm Exchange'
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 overflow-hidden"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-2">
                   <div className="bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                   <h4 className="font-black">Success!</h4>
                </div>
                <p className="text-sm font-medium pl-9">Transfer of assets was completed successfully. Your wallet balances have been updated.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info / Chart Column */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1c559b] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <h4 className="text-[#65e5d5] font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
              <TrendingUp size={16} />
              Market Dynamics
            </h4>
            <div className="h-40 flex items-end gap-3 mb-6 px-2">
              {[40, 60, 45, 90, 55, 80, 75, 45, 60, 85].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className={`flex-1 ${i === 3 ? 'bg-[#65e5d5]' : 'bg-white/20'} rounded-2xl hover:bg-[#65e5d5]/50 transition-all cursor-crosshair`}
                ></motion.div>
              ))}
            </div>
            <div className="space-y-4 pt-4 border-t border-white/10">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/50">High (24h)</span>
                  <span className="text-xs font-black">{(rate * 1.05).toFixed(4)}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/50">Low (24h)</span>
                  <span className="text-xs font-black">{(rate * 0.98).toFixed(4)}</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl border border-slate-50 shadow-lg"
          >
             <h4 className="font-black text-[#0f172a] mb-6 flex items-center justify-between">
               Nova Benefits
               <ChevronRight size={18} className="text-slate-300" />
             </h4>
             <ul className="space-y-6">
                {[
                  { title: 'Zero Commission', desc: 'No hidden fees on any currency pairs.' },
                  { title: 'Instant Execution', desc: 'Liquidity is guaranteed within seconds.' },
                  { title: 'Bank Grade Security', desc: 'Protected by our industry vault tech.' }
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex gap-5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-black">
                      0{i+1}
                    </div>
                    <div>
                      <p className="font-black text-sm text-[#0f172a]">{item.title}</p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
             </ul>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ExchangePage;
