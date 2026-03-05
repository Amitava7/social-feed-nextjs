"use client";

import { useState, useCallback, FormEvent } from "react";
import { Comment } from "@/lib/types";
import Avatar from "@/components/Avatar";

export default function CommentSection({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(initialCount);

  const loadComments = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  }, [postId, loading]);

  function toggle() {
    if (!open) loadComments();
    setOpen((o) => !o);
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setCount((c) => c + 1);
        setText("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{count}</span>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-white/5">
          {loading ? (
            <p className="text-white/30 text-xs text-center py-2">Loading...</p>
          ) : (
            <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-1">
              {comments.length === 0 && (
                <p className="text-white/20 text-xs text-center py-2">
                  No comments yet. Be the first.
                </p>
              )}
              {comments.map((c) => (
                <div key={c._id} className="flex gap-2.5 items-start">
                  <Avatar user={c.user} size={26} />
                  <div className="bg-white/5 rounded-xl px-3 py-2 flex-1 min-w-0">
                    <span className="text-white/70 text-xs font-medium mr-2">
                      {c.user.displayName}
                    </span>
                    <span className="text-white/60 text-xs">{c.content}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-xl transition-colors disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
