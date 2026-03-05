"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/lib/types";
import Avatar from "@/components/Avatar";

export default function ProfileDropdown({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
      >
        <Avatar user={user} size={30} />
        <span className="text-white/70 text-sm hidden sm:block">{user.displayName}</span>
        <svg
          className={`w-3.5 h-3.5 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
