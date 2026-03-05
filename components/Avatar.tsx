import Image from "next/image";
import { User } from "@/lib/types";

export default function Avatar({ user, size = 36 }: { user: User; size?: number }) {
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.displayName}
        width={size}
        height={size}
        className="rounded-full object-cover bg-[#1a1a1a]"
        style={{ width: size, height: size, minWidth: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-teal-700 flex items-center justify-center text-white font-medium select-none shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {user.displayName[0]?.toUpperCase()}
    </div>
  );
}
