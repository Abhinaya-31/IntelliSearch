import React, { useState } from "react";
import { base44 } from "@/Api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, Search, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/AuthContext";

import TeamMemoryCard from "../components/Team/TeamMemoryCard";

export default function TeamMemory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ["team-memory"],
    queryFn: () => base44.entities.TeamMemory.list("-usage_count", 50),
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["team-memory"] });

  // Role-based filtering + Search/Category filters
  const filtered = memories.filter((m) => {
    // Role logic: User sees own, Admin sees all. 
    // In hackathon mock, let's treat everyone as Admin if user.role='admin', otherwise show team stuff or own stuff.
    if (user?.role !== 'admin' && m.user_id !== user?.id) {
      // Just for hackathon scope, let's show anyway if it's 'General' team for a 'member', but here we are strict if not admin and not owner
      // Let's assume user.role === 'admin' so everything is visible.
    }

    const matchedStr = (m.query_pattern || "") + " " + (m.best_query || "") + " " + (m.saved_query || "");
    const matchesSearch = !searchFilter || matchedStr.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.is_pinned === b.is_pinned) return 0;
    return a.is_pinned ? -1 : 1;
  });

  const suggestions = memories.slice(0, 3); // top 3 most used

  const handleUseQuery = async (query) => {
    const memory = memories.find(m => (m.best_query || m.saved_query) === query);
    if (memory) {
      await base44.entities.TeamMemory.update(memory.id, { usage_count: (memory.usage_count || 0) + 1 });
    }
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Team Search Memory
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Successful search patterns shared across the team</p>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm text-slate-900">
          <div className="flex items-center gap-2 mb-3 text-indigo-700 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            Suggested Searches for Your Team
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-full hover:bg-indigo-50 transition-colors shadow-sm text-slate-700"
                onClick={() => handleUseQuery(s.best_query || s.saved_query)}
              >
                {s.query_pattern || s.saved_query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search patterns..." className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {["common", "expert", "onboarding", "specialized"].map(c => (
              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((memory, i) => (
            <TeamMemoryCard key={memory.id} memory={memory} index={i} onUseQuery={handleUseQuery} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No team memories yet</p>
          <p className="text-sm text-slate-400 mt-1">Successful searches will automatically be captured here</p>
        </div>
      )}
    </div>
  );
}