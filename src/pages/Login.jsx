import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import client from '../api/client';
import { ButtonLoader } from '../components/Loader'; // IMPORT LOADER

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'player' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // START LOADING
    try {
      const url = `/auth/${isLogin ? 'login' : 'register'}`;
      const res = await client.post(url, formData);
      if (isLogin) {
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === 'organizer' ? '/admin' : '/player');
      } else {
        alert('Account created! Please login.');
        setIsLogin(true);
      }
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setLoading(false); // END LOADING
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-emerald-700 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>
        <div className="relative z-10 text-center px-10">
          <div className="flex justify-center mb-6">
             <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <Trophy size={64} className="text-emerald-700" />
             </div>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter bg-slate-50 py-2 px-0 rounded-lg"><span className="font-black text-gray-900 tracking-tighter">
                TURF<span className="text-emerald-600">WAR</span>
              </span></h1>
          <p className="text-emerald-100 text-xl font-light">The ultimate platform for sports communities.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop')] bg-cover bg-center lg:bg-none lg:bg-gray-50 relative">
        <div className="absolute inset-0 bg-emerald-900/40 lg:hidden"></div>
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm lg:bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter your credentials to access the field.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input className="input-field" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <select className="input-field bg-white" onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="player">I am a Player</option>
                    <option value="organizer">I am an Organizer</option>
                  </select>
                </div>
              </div>
            )}
            
            <input className="input-field" type="email" placeholder="name@example.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input className="input-field" type="password" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} required />
            
            <button disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
              {loading ? (
                // BUTTON LOADER
                <>
                  <ButtonLoader /> Processing...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Get Started'
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}