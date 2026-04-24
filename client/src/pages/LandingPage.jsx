import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Phone, Lock, User, CheckCircle2, Eye, EyeOff, Hash, Sparkles, ShieldCheck, Zap, Globe, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '', name: '', transactionPin: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [networkUrl, setNetworkUrl] = useState(localStorage.getItem('novapay_api_url') || import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.154:5002/api');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const cleanPhone = formData.phone.replace(/\D/g, '');
    try {
      if (isLogin) {
        await login(cleanPhone, formData.password);
      } else {
        await register({ ...formData, phone: cleanPhone });
      }
    } catch (err) {
      console.error('FULL ERROR:', err);
      const attemptedUrl = localStorage.getItem('novapay_api_url') || import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.154:5002/api';
      const errCode = err.code || 'NO_CODE';
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      const errStatus = err.response?.status ? ` [HTTP ${err.response.status}]` : ' [No Response]';
      setError(`${errMsg}${errStatus}\nCode: ${errCode}\nURL: ${attemptedUrl}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ phone: '', password: '', name: '', transactionPin: '' });
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">

      {/* Left Branding Panel: The "Wow" Factor */}
      <div className="hidden lg:flex w-1/2 min-h-screen premium-gradient flex-col items-center justify-center p-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#65e5d5] rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-white rounded-full blur-[100px] pointer-events-none" 
        />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-xl text-white">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-4 mb-20"
          >
            <div className="bg-[#65e5d5] p-3.5 rounded-[1.5rem] shadow-2xl mint-glow">
              <Wallet className="text-[#1c559b]" size={36} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic">NOVAPAY</h1>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              <h2 className="text-6xl sm:text-7xl font-black leading-[0.9] tracking-tighter mb-8 italic">
                REDESIGNING <br />
                <span className="text-[#65e5d5] mint-glow text-shadow">LIQUIDITY.</span>
              </h2>
              <p className="text-xl text-white/70 font-medium leading-relaxed max-w-lg italic">
                Experience the next evolution in digital finance. Instant, secure, and borderless banking for the modern era.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }} 
              className="grid grid-cols-2 gap-6 pt-10"
            >
              {[
                { icon: ShieldCheck, text: 'Vault-Grade Security' },
                { icon: Zap, text: 'Instant Settlement' },
                { icon: Globe, text: 'Multi-Asset Matrix' },
                { icon: Sparkles, text: 'Premium Experience' }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl transition-all hover:bg-white/20">
                  <feat.icon className="text-[#65e5d5]" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">{feat.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.6 }}
            className="mt-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#65e5d5]/20 flex items-center justify-center flex-shrink-0 animate-pulse">
               <span className="text-3xl">🎓</span>
            </div>
            <div>
              <p className="text-[#65e5d5] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Academy Sandbox</p>
              <p className="text-white/80 text-sm font-medium italic">
                Get <strong className="text-white">50K PKR + Multi-CCY Assets</strong> credited instantly for your university demonstration.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Panel: Pure & Premium */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-slate-50 min-h-screen relative">
        <button 
          onClick={() => setShowNetworkModal(true)}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 p-3 bg-white text-slate-400 hover:text-[#1c559b] hover:shadow-lg rounded-2xl transition-all border border-slate-100"
          title="Network Configuration"
        >
          <Server size={22} />
        </button>

        <div className="w-full max-w-lg">
          {/* Mobile Identity */}

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden flex items-center gap-3 mb-10 justify-center"
          >
            <div className="bg-[#1c559b] p-2.5 rounded-2xl shadow-xl">
              <Wallet className="text-[#65e5d5]" size={28} />
            </div>
            <span className="text-3xl font-black text-[#1c559b] tracking-tighter italic">NOVAPAY</span>
          </motion.div>

          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-10 sm:p-14 border border-slate-100 border-b-8 border-b-slate-200"
          >
            <div className="mb-12">
              <span className="text-[#1c559b] text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block px-3 py-1 bg-blue-50 rounded-full">Secure Gateway</span>
              <h2 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tight">
                {isLogin ? 'Access Portal' : 'Initialize Account'}
              </h2>
              <p className="text-slate-400 font-medium italic">
                {isLogin ? 'Log in to manage your digital assets' : 'Join the elite network in seconds'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1c559b] transition-colors" size={20} />
                      <input
                        type="text" name="name" required={!isLogin}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold placeholder:text-slate-200 text-slate-800"
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Terminal Identity (Phone)</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1c559b] transition-colors" size={20} />
                  <input
                    type="text" name="phone" required
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="username"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-black placeholder:text-slate-200 text-slate-800"
                    placeholder="03001234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Cipher</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1c559b] transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" required
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-black placeholder:text-slate-200 text-slate-800 tracking-widest"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="pin"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Transaction Authorization PIN</label>
                    <div className="relative group">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1c559b] transition-colors" size={20} />
                      <input
                        type="text" name="transactionPin"
                        maxLength="4" pattern="\d{4}" required={!isLogin}
                        value={formData.transactionPin}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-center tracking-[0.8em] font-black text-2xl text-blue-600"
                        placeholder="0000"
                        autoComplete="off"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 bg-red-50 border border-red-100 text-red-600 p-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest"
                >
                  <AlertCircle size={20} className="flex-shrink-0" /> 
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1c559b] text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-blue-500/20 hover:bg-[#16447c] transition-all disabled:opacity-60 mt-8 italic"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    AUTHORIZING...
                  </div>
                ) : (
                  isLogin ? 'SUBMIT LOGIN' : 'RESERVE IDENTITY'
                )}
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                {isLogin ? "Digital footprint missing?" : 'Identity already reserved?'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={switchMode}
                className="text-[#1c559b] font-black text-sm uppercase tracking-widest border-b-2 border-slate-100 hover:border-[#1c559b] transition-all pb-1"
              >
                {isLogin ? 'Execute Registration' : 'Return to Portal'}
              </motion.button>
            </div>
          </motion.div>
          
          <div className="mt-10 text-center flex flex-col items-center">
             <div className="flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                <ShieldCheck size={14} /> Encrypted Session Active
             </div>
             <p className="text-[8px] text-slate-300 font-bold max-w-xs leading-relaxed uppercase tracking-widest">
               Your session is protected by 256-bit AES encryption. 
               Novapay strictly adheres to university sandbox policies.
             </p>
          </div>
        </div>
      </div>

      {/* Network Configuration Modal */}
      <AnimatePresence>
        {showNetworkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNetworkModal(false)}
              className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-8 rounded-3xl shadow-2xl relative z-10 w-full max-w-md border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Server size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-[#0f172a]">API Configuration</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Local LAN Target</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-sm text-slate-500 font-medium">
                  Update the backend API address if it has changed on your local network.
                </p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Web Server URL</label>
                  <input 
                    type="url" 
                    value={networkUrl} 
                    onChange={(e) => setNetworkUrl(e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-sm font-bold text-slate-700"
                    placeholder="http://192.168.1.154:5002/api"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowNetworkModal(false)} 
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const cleanUrl = networkUrl.trim().toLowerCase();
                    localStorage.setItem('novapay_api_url', cleanUrl);
                    window.location.reload();
                  }} 
                  className="flex-1 py-4 bg-[#1c559b] text-white rounded-2xl font-black text-xs hover:bg-[#16447c] shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest"
                >
                  Save & Reload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default LandingPage;

const AlertCircle = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2." 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
