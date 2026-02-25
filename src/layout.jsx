import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
  Search,
  LayoutDashboard,
  FileText,
  Clock,
  Shield,
  Users,
  ScrollText,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { name: "Home", icon: Sparkles, page: "Home" },
  { name: "Search", icon: Search, page: "Search" },
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Documents", icon: FileText, page: "Documents" },
  { name: "Feedback", icon: MessageSquare, page: "Feedback" },
  { name: "History", icon: Clock, page: "History" },
  { name: "Policies", icon: Shield, page: "Policies" },
  { name: "Team Memory", icon: Users, page: "TeamMemory" },
  { name: "Audit Logs", icon: ScrollText, page: "AuditLogs" },
  { name: "Profile", icon: UserIcon, page: "Profile" },
];

export default function Layout({ children, currentPageName }) {
  const { isAppLaunched } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => { });
  }, []);

  // Don't show layout for Home page when not launched (landing page mode)
  if (currentPageName === "Home" && !isAppLaunched) {
    return children;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">IntelliSearch</span>
          </div>
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-tight">IntelliSearch</span>
                <p className="text-[10px] text-slate-400 -mt-0.5">Semantic Engine</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                >
                  <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-border">
            {user && (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{user.full_name || "User"}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link to={createPageUrl("Profile")} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                    <UserIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}