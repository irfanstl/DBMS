import { useState } from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-[2rem] w-full max-w-md mx-4 p-8 sm:p-10 relative shadow-2xl overflow-hidden transform transition-all my-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center mt-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {mode === 'login' 
              ? 'Sign in to continue enjoying your favorite food.' 
              : 'Sign up to start ordering delicious food to your door.'}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-4">Full Name</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 rounded-full border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mango-500/50 focus:border-mango-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-4">Email Address</label>
            <input 
              type="email" 
              className="w-full px-6 py-4 rounded-full border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mango-500/50 focus:border-mango-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
              placeholder="name@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-4">Password</label>
            <input 
              type="password" 
              className="w-full px-6 py-4 rounded-full border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mango-500/50 focus:border-mango-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-between items-center px-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-mango-500 focus:ring-mango-500 border-gray-300 accent-mango-500 cursor-pointer" required={mode === 'signup'} />
              <span className="text-sm text-gray-600 font-medium select-none">
                {mode === 'login' ? 'Remember me' : 'I accept the terms'}
              </span>
            </label>
            {mode === 'login' && (
              <button type="button" className="text-sm font-bold text-gray-900 hover:text-mango-600 transition-colors">Forgot?</button>
            )}
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-full transition-transform active:scale-[0.98] shadow-lg shadow-gray-900/20"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm font-semibold text-gray-500 mt-8">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button 
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-mango-600 hover:text-mango-700 underline underline-offset-2"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
}
