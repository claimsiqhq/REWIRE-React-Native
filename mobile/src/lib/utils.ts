import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format?: string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options);
}

export function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    great: "#4A7C59",
    good: "#8FBC8B",
    okay: "#F5DEB3",
    low: "#DAA520",
    rough: "#CD5C5C",
  };
  return colors[mood] || "#A0A0A0";
}

export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    great: "😄",
    good: "🙂",
    okay: "😐",
    low: "😔",
    rough: "😢",
  };
  return emojis[mood] || "🤔";
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}
