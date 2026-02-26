import React, { useState, useEffect } from "react";
import { base44 } from "@/Api/base44Client";
import { Sparkles, Search, Zap, Shield, TrendingUp, Mail, HelpCircle, Users, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const RANDOM_PROFILES = [
  { name: "John Doe", role: "Software Engineer", bio: "Passionate about semantic search and AI infrastructure.", avatar: "JD" },
  { name: "Sarah Chen", role: "Data Scientist", bio: "Expert in vector embeddings and natural language processing.", avatar: "SC" },
  { name: "Alex Rivera", role: "Product Manager", bio: "Building intuitive tools for information discovery.", avatar: "AR" },
  { name: "Emma Wilson", role: "Research Lead", bio: "Exploring the boundaries of knowledge graphs and search.", avatar: "EW" }
];

export default function Home() {
  const { navigateToLogin, isAppLaunched, setIsAppLaunched } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("features");
  const [featuredProfile, setFeaturedProfile] = useState(RANDOM_PROFILES[0]);

  useEffect(() => {
    setFeaturedProfile(RANDOM_PROFILES[Math.floor(Math.random() * RANDOM_PROFILES.length)]);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSocialLogin = (provider) => {
    alert(`${provider} login will be available once OAuth is configured in your app settings.`);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not launched, show landing page
  if (!isAppLaunched) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">IntelliSearch</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Semantic Search
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Search by <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Meaning</span>,<br />Not Just Keywords
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover information using natural language. Our intelligent semantic engine understands context, intent, and relationships.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsAppLaunched(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-10 h-14 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border-0 transition-all hover:scale-105"
              >
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 sm:px-6 bg-card/30 border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Powerful Features</h2>
              <p className="text-lg text-muted-foreground">Everything you need for intelligent document discovery</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Search, title: "Semantic Search", desc: "Find documents based on meaning and context. Powered by AI vector search." },
                { icon: Zap, title: "Lightning Fast", desc: "Get results in milliseconds with our optimized vector search engine." },
                { icon: Shield, title: "Smart Ranking", desc: "Self-learning algorithms improve results based on team feedback and usage patterns." },
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-8 rounded-3xl bg-card/50 border border-border hover:border-primary/60 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Footer with links */}
        <footer className="py-12 px-4 sm:px-6 bg-card text-foreground" >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">IntelliSearch</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered semantic search for modern teams</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button onClick={() => setActiveSection("features")} className="block hover:text-primary">Features</button>
                <button onClick={() => navigateToLogin()} className="block hover:text-primary">Get Started</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button onClick={() => setActiveSection("about")} className="block hover:text-primary">About Us</button>
                <button onClick={() => setActiveSection("contact")} className="block hover:text-primary">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button onClick={() => setActiveSection("help")} className="block hover:text-primary">Help Center</button>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 IntelliSearch. All rights reserved.
          </div>
        </footer>
      </div >
    );
  }

  // If logged in, show home dashboard with sections
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Welcome Section with Featured Profile */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Welcome back, {user?.full_name || "User"}!</h1>
          <p className="text-lg text-slate-500">Discover insights with intelligent semantic search engine.</p>
        </div>

        {/* Featured Profile Card (Random Person) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:w-80 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2">
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 bg-cyan-500/5 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">Featured Profile</Badge>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-xl font-bold text-[#050b14] shadow-lg shadow-cyan-500/30">
              {featuredProfile.avatar}
            </div>
            <div>
              <h3 className="font-bold text-white">{featuredProfile.name}</h3>
              <p className="text-xs text-cyan-400 font-medium tracking-wide uppercase">{featuredProfile.role}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed italic">"{featuredProfile.bio}"</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Search, label: "New Search", page: "Search", color: "bg-cyan-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] text-[#050b14] font-bold" },
          { icon: TrendingUp, label: "Dashboard", page: "Dashboard", color: "bg-teal-600 shadow-[0_0_15px_rgba(20,184,166,0.3)] text-white font-bold" },
          { icon: Users, label: "Team Memory", page: "TeamMemory", color: "bg-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.3)] text-white font-bold" },
          { icon: MessageSquare, label: "Feedback", page: "Feedback", color: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-[#050b14] font-bold" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            {item.page ? (
              <Link to={createPageUrl(item.page)} className={`flex items-center gap-3 p-4 rounded-xl ${item.color} hover:opacity-90 transition-opacity text-white`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ) : (
              <button onClick={item.action} className={`w-full flex items-center gap-3 p-4 rounded-xl ${item.color} hover:opacity-90 transition-opacity text-white`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tabbed Content */}
      <div className="mb-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
          {[
            { id: "features", label: "Features", icon: Zap },
            { id: "about", label: "About Us", icon: Users },
            { id: "help", label: "Help", icon: HelpCircle },
            { id: "contact", label: "Contact", icon: Mail },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium ${activeSection === tab.id ? "border-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] bg-cyan-500/5" : "border-transparent text-slate-500 hover:text-cyan-300"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === "features" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Context-Aware Search", desc: "Our AI understands the meaning behind your queries, not just keywords. Find what you need using natural language.", stats: "95% accuracy" },
            { icon: Shield, title: "Self-Learning Engine", desc: "The system learns from team feedback to improve rankings automatically. Better results over time, zero manual tuning.", stats: "24/7 learning" },
            { icon: Zap, title: "Lightning Performance", desc: "Powered by MongoDB Atlas Vector Search with HNSW indexing. Get semantic results in under 500ms.", stats: "<500ms avg" },
          ].map((f, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{f.desc}</p>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  {f.stats}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "about" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              About IntelliSearch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              IntelliSearch is an intelligent semantic search engine built on MongoDB that enables users to discover data based on meaning and intent rather than exact keywords. We leverage cutting-edge AI technology to understand context, relationships, and user intent.
            </p>
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">500ms</p>
                <p className="text-xs text-slate-500">Avg Response Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">95%</p>
                <p className="text-xs text-slate-500">Search Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-400 drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]">24/7</p>
                <p className="text-xs text-slate-500">Self-Learning</p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Our mission is to make information discovery effortless and intuitive. By combining semantic understanding with user feedback, we create a search experience that gets smarter every day.
            </p>
          </CardContent>
        </Card>
      )}

      {activeSection === "help" && (
        <div className="space-y-4">
          {[
            { q: "How does semantic search work?", a: "Semantic search uses AI to understand the meaning and context of your query, not just matching keywords. It analyzes relationships between concepts to find the most relevant documents." },
            { q: "What are the different search modes?", a: "We offer three modes: Semantic (AI-powered meaning-based), Keyword (traditional exact match), and Hybrid (combines both for maximum precision)." },
            { q: "How does the self-learning engine work?", a: "Our system collects user feedback (thumbs up/down, engagement metrics) and automatically generates ranking policies that improve future search results." },
            { q: "Can I see my search history?", a: "Yes! Visit the History page to replay past searches, analyze patterns, and learn from successful queries." },
            { q: "How do I upload documents?", a: "Go to the Documents page and click 'Add Document'. You can upload files or paste content directly. The system will automatically index and generate embeddings." },
          ].map((faq, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                  {faq.q}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Email Support</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Get help from our support team</p>
                <a href="mailto:support@intellisearch.ai" className="text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] text-sm font-medium transition-colors">
                  support@intellisearch.ai
                </a>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Sales Inquiries</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Interested in enterprise plans?</p>
                <a href="mailto:sales@intellisearch.ai" className="text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] text-sm font-medium transition-colors">
                  sales@intellisearch.ai
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Office Location</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                123 Tech Street, Suite 400<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
