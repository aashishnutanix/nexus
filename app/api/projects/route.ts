import { NextRequest, NextResponse } from "next/server";
import { ProjectSchema } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);
    
    const validatedData = ProjectSchema.parse(body);
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.projects).insertOne({
      ...validatedData,
      members: [
        {
          userId: body.createdBy,
          role: "Owner",
          joinedAt: new Date().toISOString(),
        },
      ],
      createdBy: body.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
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

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.projects).updateOne(
      { _id: new ObjectId(id as string) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json(
      { error: "Invalid request", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    console.log("Received GET request");

    const client = await clientPromise;
    const db = client.db();

    const projects = await db
      .collection(collections.projects)
      .find({})
      .toArray();
    console.log("Fetched projects:", projects);

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.projects).deleteOne({ _id: new ObjectId(id as string) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json(
      { error: "Invalid request", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
