import React from "react";
import { Users, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const categoryStyles = {
  common: "bg-blue-100 text-blue-700",
  expert: "bg-purple-100 text-purple-700",
  onboarding: "bg-emerald-100 text-emerald-700",
  specialized: "bg-amber-100 text-amber-700",
};

export default function TeamMemoryCard({ memory, index = 0, onUseQuery }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm text-slate-900"
      onClick={() => onUseQuery?.(memory.best_query)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900">{memory.query_pattern}</p>
          <p className="text-sm text-indigo-600 mt-1 truncate">→ {memory.best_query}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <Badge className={`${categoryStyles[memory.category] || categoryStyles.common} text-xs border-0`}>
          {memory.category}
        </Badge>
        {memory.team && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="w-3 h-3" />{memory.team}
          </span>
        )}
        {memory.success_rate != null && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <TrendingUp className="w-3 h-3" />{memory.success_rate}% success
          </span>
        )}
        <span className="text-xs text-slate-400">{memory.usage_count || 0} uses</span>
      </div>

      {memory.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {memory.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{tag}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}