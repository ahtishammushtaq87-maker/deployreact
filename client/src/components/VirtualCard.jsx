import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Fingerprint, ShieldCheck } from 'lucide-react';

const VirtualCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardColors = {
    Visa: 'bg-gradient-to-br from-[#1a1c1e] to-[#2d3436]',
    Mastercard: 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]',
    Default: 'bg-gradient-to-br from-[#1c559b] to-[#0f3d78]',
  };

  return (
    <div 
      className="relative w-full h-[220px] perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-full h-full preserve-3d shadow-2xl rounded-2xl"
      >
        {/* Front Face */}
        <div className={`absolute w-full h-full backface-hidden p-8 rounded-2xl flex flex-col justify-between text-white overflow-hidden ${cardColors[card?.cardType] || cardColors.Default}`}>
          {/* Holographic effect overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/5" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
               <Landmark size={32} strokeWidth={1.5} className="text-[#65e5d5] mb-1" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Digital Vault</span>
            </div>
            <div className="text-right">
               <span className="text-xl font-black italic tracking-tighter block">{card?.cardType || 'Novapay'}</span>
               <span className="text-[8px] font-bold uppercase tracking-widest text-[#65e5d5]">Premium Credit</span>
            </div>
          </div>

          <div className="mb-6 relative z-10">
            <div className="w-12 h-9 bg-gradient-to-br from-amber-400 to-amber-200 rounded-lg mb-4 opacity-80 shadow-inner overflow-hidden relative">
               <div className="absolute inset-0 border border-black/10 rounded-lg" />
               <div className="flex flex-col gap-1.5 p-1.5 h-full opacity-30">
                  <div className="h-px bg-black w-full" />
                  <div className="h-px bg-black w-full" />
                  <div className="h-px bg-black w-full" />
               </div>
            </div>
            <p className="text-2xl font-mono tracking-[0.25em] drop-shadow-lg">
              •••• •••• •••• {card?.lastFour || '0000'}
            </p>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[9px] text-white/40 font-bold uppercase mb-1 tracking-widest">Card Holder</p>
              <p className="text-sm font-bold tracking-wider uppercase text-white/90">{card?.cardHolderName || 'VERIFIED USER'}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/40 font-bold uppercase mb-1 tracking-widest">Expires</p>
              <p className="text-sm font-bold font-mono text-[#65e5d5]">{card?.expiryDate || '12/28'}</p>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute w-full h-full backface-hidden p-8 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col justify-between rotate-y-180"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-8 left-0 w-full h-12 bg-slate-900 shadow-md"></div>
          
          <div className="mt-16">
            <div className="flex items-center justify-between mb-4">
               <div className="bg-slate-200 h-8 flex-grow mr-4 rounded flex items-center px-3">
                  <div className="w-full h-px bg-slate-300" />
               </div>
               <div className="bg-white px-4 py-1.5 text-slate-900 font-mono italic font-black shadow-inner border border-slate-200 rounded">
                 {card?.cvv || '888'}
               </div>
            </div>
            
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-emerald-500" size={20} />
               </div>
               <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                 Secure digital asset. Issued for demonstration purposes. 
                 By using this card, you agree to the NovaPay university sandbox terms.
               </p>
            </div>
          </div>

          <div className="flex justify-between items-center opacity-40">
             <Landmark size={16} className="text-slate-400" />
             <span className="text-[8px] font-black uppercase text-slate-400">NP Virtual Assets Inc.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualCard;
