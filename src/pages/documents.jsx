import React, { useState } from "react";
import { base44 } from "@/Api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, FileText, Grid3X3, List, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import DocumentUploadModal from "../components/documents/DocumentUploadModal";
import DocumentDetailPanel from "../components/documents/DocumentDetailPanel";

const categoryColors = {
  technical: "bg-blue-100 text-blue-700",
  business: "bg-emerald-100 text-emerald-700",
  legal: "bg-amber-100 text-amber-700",
  research: "bg-purple-100 text-purple-700",
  operations: "bg-rose-100 text-rose-700",
  general: "bg-slate-100 text-slate-700",
};

export default function Documents() {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => base44.entities.SearchDocument.list("-created_date", 100),
  });

  const filtered = documents.filter((d) => {
    const matchesSearch = !searchFilter || d.title?.toLowerCase().includes(searchFilter.toLowerCase()) || d.content?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (doc) => {
    await base44.entities.SearchDocument.delete(doc.id);
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">{documents.length} documents indexed</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />Add Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Filter documents..." className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {["technical","business","legal","research","operations","general"].map(c => (
              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
            <Grid3X3 className="w-4 h-4 text-slate-500" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
            <List className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Documents grid/list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 animate-pulse">
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-3" />
              <div className="h-3 w-full bg-slate-100 rounded mb-2" />
              <div className="h-3 w-2/3 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          <AnimatePresence>
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedDoc(doc)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">{doc.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{doc.content?.substring(0, 120)}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(doc); }} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {doc.category && <Badge className={`${categoryColors[doc.category] || categoryColors.general} text-[10px] border-0`}>{doc.category}</Badge>}
                  <span className="text-[10px] text-slate-400">{doc.created_date ? format(new Date(doc.created_date), "MMM d, yyyy") : ""}</span>
                  {doc.tags?.slice(0, 2).map((t, j) => <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No documents found</p>
          <Button onClick={() => setShowUpload(true)} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />Add your first document
          </Button>
        </div>
      )}

      <DocumentUploadModal
        open={showUpload}
        onOpenChange={setShowUpload}
        onDocumentCreated={() => queryClient.invalidateQueries({ queryKey: ["documents"] })}
      />

      {selectedDoc && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedDoc(null)} />
          <DocumentDetailPanel document={selectedDoc} onClose={() => setSelectedDoc(null)} />
        </>
      )}
    </div>
  );
}