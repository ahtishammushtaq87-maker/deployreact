import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ExchangePage from './pages/ExchangePage';
import ProfilePage from './pages/ProfilePage';
import TransferPage from './pages/TransferPage';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-[#1c559b] rounded-full animate-spin" />
        <span className="text-[10px] font-black text-[#1c559b] uppercase tracking-[0.3em] animate-pulse">Syncing Vault...</span>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/" />;
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-[#65e5d5] selection:text-[#1c559b]">
      {user && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper>
              {user ? <Navigate to="/dashboard" /> : <LandingPage />}
            </PageWrapper>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/exchange" element={
            <PrivateRoute>
              <PageWrapper><ExchangePage /></PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/transfer" element={
            <PrivateRoute>
              <PageWrapper><TransferPage /></PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <PageWrapper><ProfilePage /></PageWrapper>
            </PrivateRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
