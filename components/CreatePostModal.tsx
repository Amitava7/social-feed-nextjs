"use client";

import { useState, useRef, FormEvent } from "react";
import { Post } from "@/lib/types";

export default function CreatePostModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (post: Post) => void;
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      if (image) fd.append("image", image);

      const res = await fetch("/api/posts", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to create post");
        return;
      }
      const data = await res.json();
      onCreated(data.post);
      onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-white text-sm font-medium tracking-wide">New Post</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
            {preview ? (
              <div
                className="relative rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">Change image</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-white/25 hover:border-teal-500/40 hover:text-white/40 transition-all"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Add a photo (optional)</span>
              </button>
            )}
          </div>

          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all resize-none"
          />

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-xl font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
