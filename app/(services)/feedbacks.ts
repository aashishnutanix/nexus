import { FeedbackType } from "@/lib/types";

export async function createFeedback(data: FeedbackType) {
  const res = await fetch("/api/feedbacks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create feedback");
  }

  return res.json();
}
