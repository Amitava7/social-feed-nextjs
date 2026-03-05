"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupSuccessToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
      </svg>
      <span>Account created! You can now log in.</span>
      <button onClick={() => setVisible(false)} className="ml-2 text-white/70 hover:text-white">✕</button>
    </div>
  );
}
