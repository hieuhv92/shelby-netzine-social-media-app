import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds == 0) {
    return "Just now"
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return d.toLocaleDateString()
}

export function formatJoinDate(dateString: string | Date): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Create a formatter for "Month Year" pattern
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return `Joined ${formatter.format(date)}`;
};

export function truncateAddress(address: string, length: number = 6): string {
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}
