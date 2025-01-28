import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('Fetching designations...');
    const designations = await db.collection(collections.designations).find({}).toArray();
    console.log('Designations fetched successfully');

    return NextResponse.json({ success: true, designations });
  } catch (error) {
    console.error("GET /api/designations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch designations", details: (error as Error).message },
      { status: 500 }
    );
  }
}
