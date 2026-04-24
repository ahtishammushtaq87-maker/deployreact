import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Send, Search, Smartphone, AlertCircle, CheckCircle2, ArrowRight, Wallet, History, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRENCIES } from '../../../shared/constants';

const TransferPage = () => {
  const [wallet, setWallet] = useState(null);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchWallet(); }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (error) {
      console.error('Wallet fetch error:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/wallet/transfer', {
        recipientPhone: recipientPhone.replace(/\D/g, ''),
        amount: parseFloat(amount),
        currency,
        description
      });
      setSuccess(res.data);
      setWallet(res.data.wallet);
      setRecipientPhone('');
      setAmount('');
      setDescription('');
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      console.error('Transfer API Error:', serverMessage);
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentBalance = wallet?.balances?.find(b => b.currency === currency)?.amount?.$numberDecimal || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span className="text-[#65e5d5] bg-[#1c559b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-blue-500/20 italic">Instant P2P Network</span>
        <h2 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight">Send Assets</h2>
        <p className="text-slate-500 font-medium">Transfer funds securely to any Novapay user by phone number.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Transfer Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-50 relative overflow-hidden"
        >
          {/* Background Branding */}
          <div className="absolute top-10 right-10 opacity-[0.03] rotate-12 pointer-events-none">
            <Send size={240} className="text-[#1c559b]" />
          </div>

          <form onSubmit={handleTransfer} className="space-y-6 relative z-10 max-w-2xl">
            
            {/* Recipient Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Identity</label>
                 <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">
                    <UserCheck size={12} />
                    Verified Destination
                 </div>
              </div>
              <div className="relative group">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg font-black tracking-tight"
                  required
                />
              </div>
              
              {/* Demo Directory Helper */}
              <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-[1.5rem]">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Demo Contacts (Registered)
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => setRecipientPhone('03276633317')}
                    className="text-[11px] font-bold bg-white border border-blue-200 hover:border-blue-500 text-blue-700 px-4 py-2 rounded-xl transition-all hover:shadow-md active:scale-95"
                  >
                    Ali (03276633317)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRecipientPhone('03096633317')}
                    className="text-[11px] font-bold bg-white border border-blue-200 hover:border-blue-500 text-blue-700 px-4 py-2 rounded-xl transition-all hover:shadow-md active:scale-95"
                  >
                    Haris (03096633317)
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Logic Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Amount</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl group-focus-within:text-blue-600 transition-colors">{CURRENCIES[currency]?.symbol || currency}</div>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xl font-black"
                    required
                  />
                </div>
                <div className="flex justify-between items-center px-2">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Available Funds</p>
                   <p className="text-[9px] text-slate-900 font-black">{currency} {parseFloat(currentBalance).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Asset</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xl font-black cursor-pointer appearance-none shadow-sm"
                >
                  {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Note</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this transfer for? (Optional)"
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none h-32 font-medium"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !amount || amount <= 0 || !recipientPhone}
              className="w-full bg-[#1c559b] text-white py-4 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/20 hover:bg-[#16447c] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group italic"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  Authorizing...
                </>
              ) : (
                <>
                  Submit Transfer
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-10 p-5 bg-red-50 text-red-600 rounded-3xl flex items-center gap-4 font-bold border border-red-100 overflow-hidden shadow-sm"
              >
                <div className="bg-red-500 text-white p-2 rounded-xl">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 leading-none">Security Alert</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 p-10 bg-emerald-50 text-emerald-800 rounded-3xl border border-emerald-100 relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                
                <div className="flex items-center gap-5 mb-6 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight">Transmission Complete</h4>
                    <p className="text-sm font-medium opacity-60 italic">Funds have been routed successfully.</p>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest">Reference ID</span>
                    <span className="font-mono font-black text-slate-900 tracking-wider">#{success.referenceId?.toUpperCase()}</span>
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex justify-between items-center">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-100 hover:border-blue-600 transition-colors">Generate PDF</button>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-100 hover:border-blue-600 transition-colors">Recall Receipt</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-[#1c559b] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden italic"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#65e5d5]/10 rounded-full blur-3xl opacity-50" />
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-[#65e5d5] rounded-xl">
                   <ShieldCheck size={18} className="text-[#1c559b]" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Security</span>
              </div>
              <h4 className="text-xl font-black mb-4 tracking-tight leading-snug">Bank-Grade P2P Routing</h4>
              <p className="text-sm text-white/70 leading-relaxed mb-6 font-medium">
                Our encrypted transmission network ensures your assets reach their destination in sub-second timeframes with zero interception risk.
              </p>
              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                 <div className="flex justify-between items-center group cursor-pointer">
                    <span className="text-xs font-bold text-white/50">Trusted Contacts</span>
                    <History size={16} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
           >
              <h4 className="font-black text-[#0f172a] mb-6 tracking-tight uppercase tracking-widest text-xs opacity-40">Transfer Intelligence</h4>
              <div className="space-y-6">
                 {[
                   { icon: Wallet, title: 'No Fee Routing', color: 'text-emerald-500' },
                   { icon: Smartphone, title: 'Identity Locked', color: 'text-blue-500' },
                   { icon: History, title: 'Immutably Logged', color: 'text-purple-500' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-5 group cursor-default">
                      <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:shadow-lg transition-all`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-black text-sm text-slate-700">{item.title}</span>
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
};

export default TransferPage;
