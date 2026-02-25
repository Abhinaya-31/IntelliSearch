import React, { useState, useCallback } from "react";
import { base44, logUserAction } from "@/Api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, FileText, Clock } from "lucide-react";

import SearchBar from "../components/Search/SearchBar";
import SearchResultCard from "../components/Search/SearchResultCard";
import QueryWarning from "../components/Search/QueryWarning";
import DocumentDetailPanel from "../components/documents/DocumentDetailPanel";

export default function Search() {
  const [searchMode, setSearchMode] = useState("semantic");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [warning, setWarning] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const queryClient = useQueryClient();

  const { data: pastQueries = [] } = useQuery({
    queryKey: ["past-queries"],
    queryFn: () => base44.entities.SearchQuery.list("-created_date", 20),
  });

  const handleSearch = useCallback(async (query) => {
    setIsSearching(true);
    setWarning(null);
    setSuggestions([]);
    setCurrentQuery(query);

    // Check for historically failed queries (Module 6: Consequence-Aware Warning)
    const failedQueries = pastQueries.filter(
      (q) => !q.was_successful && q.query_text.toLowerCase().includes(query.toLowerCase().split(" ")[0])
    );
    if (failedQueries.length >= 2) {
      setWarning(`Similar queries have returned poor results ${failedQueries.length} times before.`);
      const successfulAlt = pastQueries.filter((q) => q.was_successful).slice(0, 3).map((q) => q.query_text);
      setSuggestions(successfulAlt);
    }

    // Module 2 & 3: Semantic search via LLM
    const startTime = Date.now();
    const docs = await base44.entities.SearchDocument.list("-created_date", 50);

    const llmResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a semantic search engine. Given the user query and a list of documents, rank the documents by relevance.

User Query: "${query}"
Search Mode: ${searchMode}

Documents:
${docs.map((d, i) => `[${i}] Title: ${d.title} | Category: ${d.category} | Content: ${d.content?.substring(0, 300)}`).join("\n")}

Return the ranked results with similarity scores and explanations. Only include documents with score >= 0.3.`,
      response_json_schema: {
        type: "object",
        properties: {
          intent: { type: "string", enum: ["lookup", "comparison", "exploration", "analysis", "troubleshooting", "unknown"] },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                document_index: { type: "number" },
                similarity_score: { type: "number" },
                explanation: { type: "string" },
              },
            },
          },
        },
      },
    });

    const responseTime = Date.now() - startTime;

    const rankedResults = (llmResult.results || []).map((r) => ({
      document: docs[r.document_index],
      similarityScore: r.similarity_score,
      explanation: r.explanation,
    })).filter((r) => r.document);

    setResults(rankedResults);
    setIsSearching(false);

    // Module 4: Save search history
    await base44.entities.SearchQuery.create({
      query_text: query,
      intent: llmResult.intent || "unknown",
      result_count: rankedResults.length,
      search_mode: searchMode,
      response_time_ms: responseTime,
      was_successful: rankedResults.length > 0,
      session_id: sessionStorage.getItem("session_id") || "default",
    });

    await logUserAction("search", `Performed semantic search for '${query}'`, { query, result_count: rankedResults.length });

    queryClient.invalidateQueries({ queryKey: ["past-queries"] });
  }, [searchMode, pastQueries, queryClient]);

  const handleFeedback = async (docId, type) => {
    // Find the query and update feedback
    const recentQuery = pastQueries.find((q) => q.query_text === currentQuery);
    if (recentQuery) {
      await base44.entities.SearchQuery.update(recentQuery.id, {
        feedback_rating: type === "up" ? 5 : 1,
        was_successful: type === "up",
      });
    }
  };

  const handleSuggestionSearch = (suggestion) => {
    setWarning(null);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero search area */}
      <div className={`transition-all duration-500 ${results.length > 0 ? "pt-8 pb-6" : "pt-24 pb-16"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {results.length === 0 && !isSearching && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 text-indigo-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Semantic Search Engine
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Find what you <span className="text-indigo-400">mean</span>,<br />not just what you type.
              </h1>
              <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
                Search your documents using natural language. Our AI understands context, intent, and meaning.
              </p>
            </motion.div>
          )}

          <SearchBar
            onSearch={handleSearch}
            isLoading={isSearching}
            pastQueries={pastQueries.map((q) => q.query_text)}
            searchMode={searchMode}
            onModeChange={setSearchMode}
          />

          <AnimatePresence>
            {warning && (
              <QueryWarning
                warning={warning}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionSearch}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        {isSearching && (
          <div className="flex flex-col items-center py-16">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-900" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
            </div>
            <p className="text-sm text-slate-400 mt-4">Analyzing query semantics...</p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-white">{results.length}</span> results found
              </p>
            </div>
            <div className="space-y-3">
              {results.map((r, i) => (
                <SearchResultCard
                  key={r.document?.id || i}
                  document={r.document}
                  rank={i + 1}
                  similarityScore={r.similarityScore}
                  explanation={r.explanation}
                  currentQuery={currentQuery}
                  onFeedback={handleFeedback}
                  onView={(doc) => {
                    setSelectedDoc(doc);
                    logUserAction("document_view", `Viewed document: ${doc.title}`, { resource_id: doc.id });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!isSearching && results.length === 0 && currentQuery && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No matching documents found</p>
            <p className="text-sm text-slate-500 mt-1">Try rephrasing your query or use different keywords</p>
          </div>
        )}

        {!isSearching && !currentQuery && pastQueries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {pastQueries.slice(0, 6).map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSearch(q.query_text)}
                  className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  {q.query_text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document detail panel */}
      {selectedDoc && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedDoc(null)} />
          <DocumentDetailPanel document={selectedDoc} onClose={() => setSelectedDoc(null)} />
        </>
      )}
    </div>
  );
}