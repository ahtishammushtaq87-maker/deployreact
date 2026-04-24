import React from 'react';
import { CURRENCIES } from '../../../shared/constants';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Smartphone, CreditCard, ShoppingBag, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionList = ({ transactions }) => {
  const getIcon = (type, desc) => {
    const d = (desc || '').toLowerCase();
    
    if (d.includes('card')) return { icon: <CreditCard size={18} />, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    if (d.includes('top up')) return { icon: <Landmark size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' };
    if (d.includes('shop') || d.includes('amazon')) return { icon: <ShoppingBag size={18} />, color: 'text-pink-500', bg: 'bg-pink-50' };

    switch(type) {
      case 'Transfer': return { icon: <ArrowUpRight size={18} />, color: 'text-red-500', bg: 'bg-red-50' };
      case 'Deposit': return { icon: <ArrowDownLeft size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'Exchange': return { icon: <RefreshCw size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' };
      default: return { icon: <Smartphone size={18} />, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const formatAmount = (tx) => {
    const symbol = CURRENCIES[tx.currency]?.symbol || tx.currency;
    const amount = parseFloat(tx.amount?.$numberDecimal || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    const isPositive = tx.type === 'Deposit';
    return (
      <span className={`font-black ${isPositive ? 'text-emerald-600' : 'text-[#0f172a]'}`}>
        {isPositive ? '+' : '-'}{symbol} {amount}
      </span>
    );
  };

  return (
    <div className="divide-y divide-slate-50">
      {transactions?.map((tx, idx) => {
        const style = getIcon(tx.type, tx.description);
        return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 ${style.bg} ${style.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {style.icon}
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">
                  {tx.description || tx.type}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>{new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className={`${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</span>
                </p>
              </div>
            </div>
            
            <div className="text-right space-y-0.5">
              <div className="text-sm">
                {formatAmount(tx)}
              </div>
              <p className="text-[9px] font-mono text-slate-300 group-hover:text-slate-400 transition-colors uppercase">
                Ref: {tx.referenceId?.slice(-8)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TransactionList;
