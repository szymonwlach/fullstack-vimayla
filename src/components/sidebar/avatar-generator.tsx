import React from "react";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function GeneratedAvatar({
  name,
  size = 40,
  className = "",
}: AvatarProps) {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "U";

  const getColorFromLetter = (letter: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-fuchsia-500",
      "bg-rose-500",
      "bg-sky-500",
      "bg-amber-500",
      "bg-gray-500",
    ];

    const charCode = letter.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const backgroundColor = getColorFromLetter(firstLetter);

  return (
    <div
      className={`
        ${backgroundColor} 
        text-white 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-semibold
        select-none
        ${className}
      `}
      style={{
        width: size,
        height: size,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {firstLetter}
    </div>
  );
}

// Funkcja pomocnicza do generowania URL avatara
export function generateAvatarUrl(name: string): string {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "U";

  // Lista kolorów hex
  const colors = [
    "ef4444",
    "3b82f6",
    "10b981",
    "f59e0b",
    "8b5cf6",
    "ec4899",
    "6366f1",
    "14b8a6",
    "f97316",
    "06b6d4",
    "84cc16",
    "10b981",
    "8b5cf6",
    "d946ef",
    "f43f5e",
    "0ea5e9",
    "f59e0b",
    "6b7280",
  ];

  const charCode = firstLetter.charCodeAt(0);
  const bgColor = colors[charCode % colors.length];

  return `https://ui-avatars.com/api/?name=${firstLetter}&background=${bgColor}&color=ffffff&size=128&bold=true`;
}
