"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Post, User } from "@/lib/types";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function FeedPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setCurrentUser(d.user ?? null))
      .catch(() => setCurrentUser(null));
  }, []);

  const loadPosts = useCallback(async (cursor?: string) => {
    const url = cursor ? `/api/posts?cursor=${encodeURIComponent(cursor)}` : "/api/posts";
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    return data as { posts: Post[]; hasMore: boolean; nextCursor: string | null };
  }, []);

  useEffect(() => {
    setLoading(true);
    loadPosts()
      .then((data) => {
        if (data) {
          setPosts(data.posts);
          setHasMore(data.hasMore);
          setNextCursor(data.nextCursor);
        }
      })
      .finally(() => setLoading(false));
  }, [loadPosts]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && nextCursor) {
          setLoadingMore(true);
          try {
            const data = await loadPosts(nextCursor);
            if (data) {
              setPosts((prev) => [...prev, ...data.posts]);
              setHasMore(data.hasMore);
              setNextCursor(data.nextCursor);
            }
          } finally {
            setLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, nextCursor, loadPosts]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function handlePostCreated(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.05] h-14 flex items-center px-4">
        <div>
          {currentUser ? (
            <ProfileDropdown user={currentUser} onLogout={handleLogout} />
          ) : (
            <div className="w-28 h-8 bg-white/5 rounded-xl animate-pulse" />
          )}
        </div>
        <div className="max-w-[560px] mx-auto w-full flex items-center justify-between">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-white/80 text-sm font-light tracking-[0.4em] uppercase">
            Pulse
          </h1>
          <div className="w-14" />
        </div>
      </header>

      <main className="pt-14 pb-24">
        <div className="max-w-[560px] mx-auto px-4 py-6 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-4 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                    <div className="h-2 bg-white/5 rounded w-1/5" />
                  </div>
                </div>
                <div className="h-48 bg-white/5 rounded-xl" />
                <div className="h-3 bg-white/10 rounded w-3/4" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm">No posts yet.</p>
              <p className="text-white/10 text-xs mt-1">Be the first to share something.</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}

          <div ref={sentinelRef} className="h-4" />

          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-white/15 text-xs py-4">
              You&apos;ve reached the end
            </p>
          )}
        </div>
      </main>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-13 h-13 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-full shadow-lg shadow-teal-900/40 flex items-center justify-center transition-colors z-40"
        style={{ width: 52, height: 52 }}
        aria-label="Create new post"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={handlePostCreated}
        />
      )}
    </div>
  );
}
