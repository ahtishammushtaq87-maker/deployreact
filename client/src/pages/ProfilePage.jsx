import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VirtualCard from '../components/VirtualCard';
import { User, ShieldCheck, CreditCard, Trash2, Plus, X, Settings, Bell, Lock, Smartphone, LogOut, ChevronRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectCardType } from '../../../shared/utils';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cardType: 'Visa',
  });
  const [loading, setLoading] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get('/cards');
      setCards(res.data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/cards', newCard);
      await fetchCards();
      setShowAddCard(false);
      setNewCard({ cardNumber: '', cardHolderName: '', expiryDate: '', cardType: 'Visa' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm('Are you sure you want to remove this card?')) {
      try {
        await api.delete(`/cards/${id}`);
        await fetchCards();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span className="text-[#65e5d5] bg-[#1c559b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-blue-500/20 italic">Account Matrix</span>
        <h2 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight">Personal Profile</h2>
        <p className="text-slate-500 font-medium">Manage your security, linked assets, and global preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Identity & Security */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-50 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#1c559b] to-[#65e5d5]" />
            <div className="relative z-10">
              <div className="w-28 h-28 bg-[#1c559b] rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-2xl shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
                {user?.name?.charAt(0)}
              </div>
              <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">{user?.name}</h3>
              <p className="text-slate-400 font-bold text-sm mb-6 pb-6 border-b border-slate-50">{user?.phone}</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} />
                    KYC Verified
                  </div>
                  <ChevronRight size={14} />
                </div>
                <div className="flex items-center justify-between px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100/50 cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    Tier 2 Limit
                  </div>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1c559b] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <h4 className="font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] text-[#65e5d5]">
               <Lock size={16} />
               Security Matrix
            </h4>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Cloud Biometrics', active: true },
                { label: 'Two-Factor (SMS)', active: false },
                { label: 'Whitelisted IPs', active: true }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{item.label}</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${item.active ? 'bg-[#65e5d5]' : 'bg-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">
               Audit Access Logs
            </button>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full py-5 bg-red-50 text-red-600 rounded-3xl font-black group flex items-center justify-center gap-3 border border-red-100 hover:bg-red-100 transition-all shadow-sm shadow-red-500/10"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            SIGN OUT FROM ALL DEVICES
          </motion.button>
        </div>

        {/* Right Column: Cards & Assets */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-1">Global Wallet Cards</h3>
                <p className="text-sm text-slate-400 font-medium">Link physical cards for high-speed liquidity.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCard(true)}
                className="bg-[#1c559b] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_10px_30px_rgba(28,85,155,0.3)] hover:bg-[#16447c] transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                Expand Vault
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {cards.map((card) => (
                 <motion.div 
                   key={card._id} 
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative group h-[220px]"
                 >
                   <VirtualCard card={card} />
                   <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleDeleteCard(card._id)}
                     className="absolute -top-4 -right-4 bg-white text-red-500 p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-50 border border-red-50"
                   >
                     <Trash2 size={18} />
                   </motion.button>
                 </motion.div>
               ))}
               
               {cards.length === 0 && (
                 <div className="col-span-full bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl py-24 text-center">
                   <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
                     <CreditCard size={36} />
                   </div>
                   <h4 className="text-lg font-black text-slate-400">Inventory Empty</h4>
                   <p className="text-sm text-slate-300 font-medium mt-1">No secure assets linked to this profile.</p>
                 </div>
               )}
            </div>
          </motion.div>

          {/* Preferences Sub-grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 flex items-center gap-6 group cursor-pointer hover:border-blue-200 transition-colors"
             >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <Bell size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#0f172a]">Smart Alerts</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Push & Email Active</p>
                </div>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 flex items-center gap-6 group cursor-pointer hover:border-emerald-200 transition-colors"
             >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <Settings size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#0f172a]">Engine Config</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Optimization Enabled</p>
                </div>
             </motion.div>
          </div>
      </div>
    </div>

    {/* Mobile Experience Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 premium-gradient p-8 sm:p-10 rounded-3xl shadow-2xl overflow-hidden relative border border-white/5"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full pointer-events-none blur-2xl" />
        
        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65e5d5]">Next-Gen Sync</span>
               </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white tracking-tight">NovaPay Mobile</h3>
              <p className="text-white/60 font-medium max-w-xl text-lg leading-relaxed">
                Experience full-node security on your mobile device. Instant P2P assets, 
                biometric signing, and global currency liquidity in your pocket.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
               <a 
                 href="/novapay.apk"
                 download="novapay.apk"
                 className="px-8 py-4 bg-[#65e5d5] text-[#1c559b] rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
               >
                  <Smartphone size={18} />
                  Download Android App
               </a>
               <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10 active:scale-95">
                  iOS Coming Soon
               </button>
            </div>

            <div className="mt-6 flex items-center gap-4 py-3 px-5 bg-white/5 rounded-2xl border border-white/5 w-fit">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Ready for Secure Link: <span className="text-white/80">192.168.97.251:5002</span>
               </p>
            </div>
          </div>

          <div className="w-full lg:w-48 aspect-square bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-[#65e5d5] transition-all overflow-hidden relative">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
             
             <div className="w-24 h-24 bg-[#65e5d5]/10 border border-[#65e5d5]/20 rounded-2xl mb-4 flex items-center justify-center text-[#65e5d5] group-hover:scale-110 transition-transform">
                <RefreshCcw size={40} className="animate-spin-slow" />
             </div>
             <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                Scan for Device Pair
             </p>
             
             {/* Scanner Line Animation */}
             <motion.div 
               animate={{ y: [0, 80, 0] }}
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               className="absolute top-10 left-6 right-6 h-px bg-[#65e5d5]/30 shadow-[0_0_10px_#65e5d5]"
             />
          </div>
        </div>
      </motion.div>

      {/* Modern Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCard(false)}
              className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-10 sm:p-14">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Vault Entry</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">PCI-DSS Encrypted</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddCard} className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Holder Identity</label>
                      <input 
                        type="text" required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold placeholder:text-slate-300 transition-all uppercase"
                        placeholder="FULL LEGAL NAME"
                        value={newCard.cardHolderName}
                        onChange={(e) => setNewCard({...newCard, cardHolderName: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Account Number</label>
                      <input 
                        type="text" required maxLength="16"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black placeholder:text-slate-300 transition-all tracking-[0.2em]"
                        placeholder="0000 0000 0000 0000"
                        value={newCard.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNewCard({
                            ...newCard, 
                            cardNumber: val,
                            cardType: detectCardType(val)
                          });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiration</label>
                        <input 
                          type="text" required maxLength="5"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black placeholder:text-slate-300 transition-all"
                          placeholder="MM/YY"
                          value={newCard.expiryDate}
                          onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Network</label>
                        <select 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black transition-all cursor-pointer appearance-none"
                          value={newCard.cardType}
                          onChange={(e) => setNewCard({...newCard, cardType: e.target.value})}
                        >
                          <option value="Visa">VISA</option>
                          <option value="Mastercard">MASTERCARD</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full bg-[#1c559b] text-white py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/30 hover:bg-[#16447c] transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                      {loading ? 'TOKENIZING...' : 'AUTHORIZE VAULT'}
                    </button>
                  </form>
                </div>
                
                {/* Visual Preview Side */}
                <div className="hidden md:flex bg-slate-900 p-14 flex-col justify-center items-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                   
                   <div className="relative z-10 w-full">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-10 text-center">Live Tokenization Preview</p>
                      <VirtualCard card={{
                        ...newCard,
                        lastFour: newCard.cardNumber.slice(-4) || '0000'
                      }} />
                      
                      <div className="mt-12 space-y-4">
                         <div className="flex items-center gap-3 text-white/30">
                            <ShieldCheck size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">AES-256 Symmetric Locking</span>
                         </div>
                         <div className="flex items-center gap-3 text-white/30">
                            <Lock size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">TLS 1.3 Secure Pipeline</span>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setShowAddCard(false)}
                     className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                   >
                     <X size={24} />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Setup Guide Modal */}
      <AnimatePresence>
        {showMobileGuide && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileGuide(false)}
              className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/10"
            >
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Mobile Build Guide</h3>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Version 1.0.4 • Developer Mode</p>
                  </div>
                  <button 
                    onClick={() => setShowMobileGuide(false)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Step 1: Firewall */}
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">01</div>
                    <div className="space-y-3 flex-1">
                      <p className="font-black text-[#0f172a] uppercase tracking-widest text-[10px]">Step 1: Open Port 5002</p>
                      <p className="text-sm text-slate-500 font-medium">Run this in your terminal (Admin) to allow mobile sync:</p>
                      <div className="bg-slate-900 p-4 rounded-xl relative">
                        <code className="text-[#65e5d5] text-[10px] font-mono leading-relaxed block break-all">
                          netsh advfirewall firewall add rule name="Novapay Mobile Sync" dir=in action=allow protocol=TCP localport=5002
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Build App */}
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">02</div>
                    <div className="space-y-3 flex-1">
                      <p className="font-black text-[#0f172a] uppercase tracking-widest text-[10px]">Step 2: Run Mobile Source</p>
                      <p className="text-sm text-slate-500 font-medium">Navigate to the mobile directory and launch the app:</p>
                      <div className="bg-slate-900 p-5 rounded-xl space-y-2">
                        <code className="text-white/60 text-[11px] block">$ cd mobile</code>
                        <code className="text-white/60 text-[11px] block">$ npm install</code>
                        <code className="text-[#65e5d5] text-[11px] block">$ npm run android</code>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: IP Check */}
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-all">03</div>
                    <div className="space-y-3 flex-1">
                      <p className="font-black text-[#0f172a] uppercase tracking-widest text-[10px]">Step 3: LAN Connectivity</p>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Ensure your phone is on the same Wi-Fi as your machine: <span className="text-[#1c559b] font-black underline">192.168.1.154</span></p>
                    </div>
                  </div>

                  {/* Step 4: Download APK */}
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 font-black shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all">04</div>
                    <div className="space-y-3 flex-1">
                      <p className="font-black text-[#0f172a] uppercase tracking-widest text-[10px]">Step 4: Install Application</p>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Download and install the APK on your Android device.</p>
                      <a 
                        href="/novapay.apk" 
                        download="novapay.apk"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
                      >
                        <Smartphone size={14} />
                        Download novapay.apk
                      </a>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowMobileGuide(false)}
                  className="w-full mt-10 py-5 bg-[#1c559b] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20"
                >
                  I'm Ready to Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
