import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { features } from "node:process";
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

    const featureData = {
      _id: new ObjectId(),
      ...body,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection(collections.projects).updateOne(
      { _id: new ObjectId(body.projectId) },
      { $push: { features: featureData } }
    );

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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received body for update fedature:", body);

    const client = await clientPromise;
    const db = client.db();

    const { projectId, featureId, ...updateData } = body;

    console.log("projectId:", projectId);

    console.log("updateData:", updateData);

    await db.collection(collections.projects).updateOne(
      { _id: new ObjectId(projectId), "features._id": new ObjectId(featureId) },
      { $set: { "features.$": { ...updateData, _id: new ObjectId(featureId), updatedAt: new Date().toISOString() } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}
