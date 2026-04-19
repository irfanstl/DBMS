import { useState } from 'react';
import { X, Phone, ShieldCheck, ArrowRight, ArrowLeft, Mail } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Please enter a valid mobile number");
    setIsLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      setStep('otp');
    } catch (err) {
      console.error("Failed to send OTP:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return alert("Please enter the full OTP");
    
    setIsLoading(true);
    try {
      // If phone is 0000000000, login as Admin
      const isAdmin = phone === '0000000000';
      
      const mockUser = {
        name: isAdmin ? 'System Admin' : (mode === 'signup' ? 'New Member' : 'Irfan'),
        email: isAdmin ? 'admin@mangobite.com' : 'user@example.com',
        phone: phone,
        role: isAdmin ? 'admin' : 'user'
      };
      
      setTimeout(() => {
        onLogin(mockUser);
        setPhone('');
        setOtp('');
        setStep('phone');
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white dark:bg-[#121212] rounded-xl w-full max-w-[400px] relative shadow-2xl overflow-hidden transform transition-all border border-gray-100 dark:border-white/5 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-mango-500"></div>

        {/* Content Section */}
        <div className="p-6 pt-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-mango-50 dark:bg-mango-950/30 rounded-lg flex items-center justify-center border border-mango-100 dark:border-mango-900/50">
                <img src="/icon.png" alt="" className="w-5 h-5 object-contain" />
              </div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none">MangoBite</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Tab Selection */}
          {step === 'phone' && (
            <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-lg mb-8 border border-gray-100 dark:border-white/5">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-300 ${mode === 'login' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-500'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-300 ${mode === 'signup' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-500'}`}
              >
                Join Now
              </button>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1.5">
              {step === 'phone' ? (mode === 'login' ? 'Welcome back' : 'Create account') : 'Verify identity'}
            </h2>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
              {step === 'phone' 
                ? 'Enter your mobile number to securely access your account.' 
                : `We've sent a 6-digit code to your mobile device.`}
            </p>
          </div>

          <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-5">
            
            {step === 'phone' ? (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-900 dark:text-gray-400 font-bold text-xs border-r border-gray-200 dark:border-white/10 pr-3">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-14 pr-4 py-3.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-transparent focus:outline-none focus:border-mango-500 transition-all text-base font-bold text-gray-900 dark:text-white tracking-widest"
                      placeholder="00000 00000"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 dark:bg-mango-600 hover:bg-black dark:hover:bg-mango-500 text-white font-black py-4 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 group text-sm"
                >
                  {isLoading ? 'Processing...' : 'Request Code'}
                  {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/5"></div></div>
                  <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.2em] text-gray-400"><span className="bg-white dark:bg-[#121212] px-4">Social Login</span></div>
                </div>

                <button 
                  type="button"
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-xs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-5">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center py-4 rounded-lg border-2 border-mango-50 dark:border-mango-900/20 bg-mango-50/10 dark:bg-mango-500/5 focus:outline-none focus:border-mango-500 transition-all text-2xl font-black tracking-[0.5rem] text-mango-600"
                    placeholder="••••••"
                    required
                  />
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-mango-600 hover:text-mango-700 transition-colors">Resend Code</button>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setStep('phone')}
                    className="flex-1 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold py-4 rounded-lg transition-all flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-[4] bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black py-4 rounded-lg transition-all active:scale-[0.98] text-sm"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <footer className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 text-center">
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] leading-relaxed">
              By proceeding, you agree to our <br />
              <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-mango-500 underline underline-offset-4">Legal Policy</a> & <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-mango-500 underline underline-offset-4">Terms</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}


