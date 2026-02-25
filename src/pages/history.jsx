import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPageUrl } from "@/utils";

import SearchTimeline from "../components/History/SearchTimeLine";

export default function History() {
  const [intentFilter, setIntentFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  const { data: queries = [], isLoading, refetch } = useQuery({
    queryKey: ["all-history"],
    queryFn: async () => {
      const qs = await base44.entities.SearchQuery.list("-created_date", 100).catch(() => []);
      const ps = await base44.entities.SearchPolicy.list("-created_date", 50).catch(() => []);
      const ds = await base44.entities.SearchDocument.list("-created_date", 50).catch(() => []);

      let fs = [];
      try {
        if (base44.entities.Feedback?.list) fs = await base44.entities.Feedback.list("-created_date", 50);
      } catch (e) { }

      const mappedSearch = qs.map(q => ({ ...q, _type: 'search' }));
      const mappedPolicies = ps.map(p => ({
        id: p.id,
        query_text: "Created Policy: " + p.name,
        intent: "Policy",
        search_mode: p.rule_type,
        was_successful: true, // Show success green dot
        created_date: p.created_date,
        _type: 'policy'
      }));
      const mappedDocs = ds.map(d => ({
        id: d.id,
        query_text: "Added Document: " + d.title,
        intent: "Document",
        search_mode: d.category || "general",
        was_successful: true, // Show success green dot
        created_date: d.created_date,
        _type: 'document'
      }));
      const mappedFeedback = fs.map(f => ({
        id: f.id,
        query_text: "Feedback: " + ((f.message || "").substring(0, 30)) + "...",
        intent: "Feedback",
        search_mode: "User Input",
        was_successful: true, // Show success green dot
        created_date: f.created_date || Date.now(),
        _type: 'feedback'
      }));

      return [...mappedSearch, ...mappedPolicies, ...mappedDocs, ...mappedFeedback]
        .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    },
  });

  const filteredRaw = queries.filter((q) => {
    const matchesIntent = intentFilter === "all" || q.intent === intentFilter;
    const matchesMode = modeFilter === "all" || q.search_mode === modeFilter;
    return matchesIntent && matchesMode;
  });

  const dummyQueries = [
    {
      query_text: "what is semantic search?",
      intent: "exploration",
      search_mode: "hybrid",
      was_successful: true,
      created_date: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      query_text: "MongoDB Atlas Vector Search setup",
      intent: "analysis",
      search_mode: "semantic",
      was_successful: true,
      created_date: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const filtered = filteredRaw.length > 0 ? filteredRaw : dummyQueries;

  const handleReplay = (query) => {
    window.location.href = createPageUrl("Search") + `?q=${encodeURIComponent(query.query_text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            Activity History
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{queries.length} activities recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        <Select value={intentFilter} onValueChange={setIntentFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Intent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intents</SelectItem>
            {["lookup", "comparison", "exploration", "analysis", "troubleshooting", "Policy", "Document", "Feedback"].map(i => (
              <SelectItem key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {["semantic", "keyword", "hybrid"].map(m => (
              <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stats bar */}
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
          <span>Success: <strong className="text-emerald-600">{queries.filter(q => q.was_successful).length}</strong></span>
          <span>Failed: <strong className="text-rose-600">{queries.filter(q => !q.was_successful).length}</strong></span>

          <Button
            variant="outline"
            size="sm"
            className="text-rose-500 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20 h-8"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your entire activity history locally?")) {
                localStorage.removeItem("mock_SearchQuery");
                localStorage.removeItem("mock_SearchPolicy");
                localStorage.removeItem("mock_SearchDocument");
                localStorage.removeItem("mock_Feedback");
                refetch();
              }
            }}
          >
            Clear History
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border p-5 animate-pulse">
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <SearchTimeline queries={filtered} onReplay={handleReplay} />
      )}
    </div>
  );
}