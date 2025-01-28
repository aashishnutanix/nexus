import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";


export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const client = await clientPromise;
        const db = client.db();
    
        const result = await db.collection(collections.contributorMentorshipMappings).find({}).toArray();
    
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/contributorMentorshipMappings error:", error);
        return NextResponse.json(
        {
            error: "Invalid request",
            details: error instanceof Error ? error.message : String(error),
        },
        { status: 400 }
        );
    }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received POST request:", body);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.contributorMentorshipMappings).insertOne({
      ...body,
      userFromId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("Inserted request:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/contributorMentorshipMappings error:", error);
    return NextResponse.json(
      {
        error: "Invalid request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}