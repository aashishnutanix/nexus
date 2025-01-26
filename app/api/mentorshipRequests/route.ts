import { NextRequest, NextResponse } from "next/server";
import { MentorshipRequestSchema } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);
    
    const validatedData = MentorshipRequestSchema.parse(body);
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.mentorshipRequests).insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/mentorshipRequests error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.mentorshipRequests).updateOne(
      { _id: id },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  try {
    console.log("Received GET request");

    const client = await clientPromise;
    const db = client.db();

    const mentorshipRequests = await db
      .collection(collections.mentorshipRequests)
      .find({})
      .toArray();
    console.log("Fetched mentorshipRequests:", mentorshipRequests);

    return NextResponse.json({ success: true, mentorshipRequests });
  } catch (error) {
    console.error("GET /api/mentorshipRequests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentorshipRequests", details: (error as Error).message },
      { status: 500 }
    );
  }
}
