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
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.locations).insertOne({
      ...body,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/locations error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // add console logs 
    console.log("GET /api/locations");
    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const location = await db.collection(collections.locations).findOne({ _id: new ObjectId(id) });
      if (!location) {
        return NextResponse.json({ error: "Location not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, location });
    } else {
      const locations = await db.collection(collections.locations).find().toArray();
      return NextResponse.json({ success: true, locations });
    }
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations", details: (error as Error).message },
      { status: 500 }
    );
  }
}
