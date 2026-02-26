import React, { useState } from 'react';
import { base44 } from '@/Api/base44Client';
import { Sparkles, Mail, Lock, ArrowRight, User as UserIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // base44.auth.login expects (email, password)
                await base44.auth.loginViaEmailPassword(formData.email, formData.password);
            } else {
                // Register using email, password, and optionally additional data
                await base44.auth.register(formData.email, formData.password, {
                    full_name: formData.fullName
                });
                // Auto-login after registration is typically handled by base44.auth.register or requires a separate login call
                // we'll attempt login just to be sure
                await base44.auth.loginViaEmailPassword(formData.email, formData.password);
            }

            // Successfully authenticated. Reload to remount the app completely.
            window.location.href = "/";
        } catch (err) {
            console.error("Authentication error:", err);
            setError(err?.message || "Invalid credentials or email already registered.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)]">
                        <Sparkles className="w-7 h-7 text-[#050b14]" />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white mb-2">
                    IntelliSearch
                </h2>
                <p className="text-center text-sm text-slate-400">
                    {isLogin ? "Welcome back to your semantic engine" : "Join the future of intelligent discovery"}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10"
            >
                {/* The highlighted transparent glowing card matching the requested aesthetic */}
                <div className="bg-[#050b14]/60 backdrop-blur-xl py-10 px-4 shadow-[0_0_50px_-5px_rgba(34,211,238,0.3)] sm:rounded-2xl sm:px-12 border border-cyan-400/40 relative overflow-hidden">
                    {/* Inner glowing accent frame */}
                    <div className="absolute inset-0 border-[2px] border-cyan-400/20 rounded-2xl pointer-events-none mix-blend-overlay"></div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mb-6"
                            >
                                <p className="text-sm text-rose-400 text-center">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="space-y-1"
                                >
                                    <label className="block text-sm font-medium text-cyan-50">
                                        Full Name
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-cyan-600/60 group-focus-within:text-cyan-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-cyan-900/50 bg-[#02060d]/80 rounded-xl text-white placeholder-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all"
                                            placeholder="Jane Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm font-medium text-cyan-50">
                                Email address
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-cyan-600/60 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-cyan-900/50 bg-[#02060d]/80 rounded-xl text-white placeholder-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cyan-50">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-cyan-600/60 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-cyan-900/50 bg-[#02060d]/80 rounded-xl text-white placeholder-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all font-mono"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] text-sm font-bold text-[#050b14] bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign in' : 'Create account'}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-cyan-900/40" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-[#0a111a] text-cyan-600 font-medium">
                                {isLogin ? "New to IntelliSearch?" : "Already have an account?"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                                setFormData({ email: '', password: '', fullName: '' });
                            }}
                            className="w-full flex justify-center py-3 px-4 border border-cyan-800/60 rounded-xl shadow-sm bg-[#050b14]/50 text-sm font-bold text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
                        >
                            {isLogin ? 'Create an account' : 'Sign in instead'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
