import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function DocumentUploadModal({ open, onOpenChange, onDocumentCreated }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    source: "",
    category: "general",
    access_level: "public",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleFileUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!formData.title) {
      setFormData((prev) => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, ""), source: f.name }));
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    let content = formData.content;

    try {
      if (file && !content) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: "object",
            properties: { text_content: { type: "string" } },
          },
        });
        content = extracted.output?.text_content || formData.content;
      }

      const doc = await base44.entities.SearchDocument.create({
        ...formData,
        content: content || formData.content,
        status: "indexed",
        embedding_status: "generated",
        view_count: 0,
      });

      onDocumentCreated?.(doc);
      onOpenChange(false);
      setFormData({ title: "", content: "", source: "", category: "general", access_level: "public", tags: [] });
      setFile(null);
      toast({ title: "Success", description: "Document created successfully!" });
    } catch (err) {
      console.error("Document creation failed:", err);
      toast({
        variant: "destructive",
        title: "Error saving document",
        description: err.message || JSON.stringify(err)
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-[#050b14] to-cyan-950/40 border-cyan-500/30 text-white shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-50">
            <Upload className="w-5 h-5 text-cyan-400" />
            Add Document
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* File upload */}
          <div>
            <Label>Upload File (optional)</Label>
            <div className="mt-1.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              {file ? (
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-50">{file.name}</span>
                  <button onClick={() => setFile(null)}><X className="w-3 h-3 text-slate-400" /></button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Click to upload a file</p>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.pdf,.csv,.json,.md" />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label className="text-cyan-50">Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Document title" className="mt-1.5 dark:text-white bg-[#02060d]/80 border-cyan-900/50 focus:border-cyan-400 focus:ring-cyan-500" />
          </div>

          <div>
            <Label className="text-cyan-50">Content</Label>
            <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Paste document content or upload a file..." className="mt-1.5 h-28 dark:text-white bg-[#02060d]/80 border-cyan-900/50 focus:border-cyan-400 focus:ring-cyan-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="mt-1.5 dark:text-white bg-[#02060d]/80 border-cyan-900/50 focus:border-cyan-400 focus:ring-cyan-500"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["technical", "business", "legal", "research", "operations", "general"].map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Access Level</Label>
              <Select value={formData.access_level} onValueChange={(v) => setFormData({ ...formData, access_level: v })}>
                <SelectTrigger className="mt-1.5 dark:text-white bg-[#02060d]/80 border-cyan-900/50 focus:border-cyan-400 focus:ring-cyan-500"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["public", "team", "restricted", "confidential"].map(a => (
                    <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-cyan-50">Tags</Label>
            <div className="flex gap-2 mt-1.5">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag..." className="flex-1 dark:text-white bg-[#02060d]/80 border-cyan-900/50 focus:border-cyan-400 focus:ring-cyan-500" />
              <Button type="button" variant="outline" size="icon" onClick={addTag} className="border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300"><Plus className="w-4 h-4" /></Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    {tag}
                    <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-cyan-800/50 text-cyan-200 hover:bg-cyan-900/20">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.title || uploading} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#050b14] font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] border-0">
            {uploading ? "Processing..." : "Add Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}