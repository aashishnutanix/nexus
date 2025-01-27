import { UpVoteType } from "@/lib/types";


export async function upVote(data: UpVoteType) {
  console.log("upVote data", data);
  const res = await fetch("/api/upvote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({data}),
  });

  if (!res.ok) {
    throw new Error("Failed to upvote");
  }

  return res.json();
}
