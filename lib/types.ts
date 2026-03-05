export interface User {
  _id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Post {
  _id: string;
  user: User;
  title: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: string;
}

export function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
