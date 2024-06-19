export default function timeAgo(postDate: string): string {
    const now = new Date();
    const original = new Date(postDate);

    const differenceInSeconds = Math.floor(
      (now.getTime() - original.getTime()) / 1000
    );

    const minutes = Math.floor(differenceInSeconds / 60);
    const hours = Math.floor(differenceInSeconds / 3600);
    const days = Math.floor(differenceInSeconds / 86400);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${differenceInSeconds} second${
        differenceInSeconds !== 1 ? "s" : ""
      } ago`;
    }
  }