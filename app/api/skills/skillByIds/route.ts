import { NextRequest, NextResponse } from "next/server";
// import { SkillSchema } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
const { ObjectId } = require("mongodb");

export const dynamic = "force-dynamic";

// write a get request to fetch skills for which skill ids is provided
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // split skillIds by comma
    const skillIds = (url.searchParams.get("skillIds") || "").split(",");
    console.log("Received GET_SKILLS request with skillIds:", skillIds);

    const skills = await fetchSkillByIds(skillIds);

    return NextResponse.json({ success: true, skills });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function fetchSkillByIds(skillIds: string[]) {
  const client = await clientPromise;
  const db = client.db();

  console.log("skillIds ->> ", skillIds);

  const objectIdArray = skillIds.map((id) => new ObjectId(id));
  const skills = await db
    .collection(collections.skills)
    .find({ _id: { $in: objectIdArray } })
    .toArray();
  console.log("Fetched skills:", skills);

  return skills;
}
