import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received body:", body);

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.projects).updateOne({ _id: new ObjectId(body.projectId) }, { $inc: { upvote: 1 } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}