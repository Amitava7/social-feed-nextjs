"use client";

import Image from "next/image";
import { useState } from "react";
import { Post, timeAgo } from "@/lib/types";
import Avatar from "@/components/Avatar";
import CommentSection from "@/components/CommentSection";

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [liking, setLiking] = useState(false);

  async function toggleLike() {
    if (liking) return;
    setLiking(true);
    setLiked((l) => !l);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      } else {
        setLiked((l) => !l);
        setLikesCount((c) => (liked ? c + 1 : c - 1));
      }
    } catch {
      setLiked((l) => !l);
      setLikesCount((c) => (liked ? c + 1 : c - 1));
    } finally {
      setLiking(false);
    }
  }

  return (
    <article className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar user={post.user} size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-tight truncate">
            {post.user.displayName}
          </p>
          <p className="text-white/25 text-[11px] mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {post.mediaUrl && (
        <div className="relative w-full bg-[#1a1a1a]" style={{ aspectRatio: "4/3" }}>
          <Image
            src={post.mediaUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 100vw, 560px"
          />
        </div>
      )}

      <div className="px-4 pt-3 pb-1">
        <p className="text-white/80 text-sm leading-relaxed">{post.title}</p>
      </div>

      <div className="flex items-center gap-5 px-4 py-3">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-teal-400" : "text-white/40 hover:text-white/70"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likesCount}</span>
        </button>
        <CommentSection postId={post._id} initialCount={post.commentsCount} />
      </div>
    </article>
  );
}
