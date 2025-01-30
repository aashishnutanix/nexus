import { NextRequest, NextResponse } from "next/server";
import { collections } from "@/lib/db/schema";
import clientPromise from "@/lib/db/client";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest, route: { params: { id: string } }) {
    console.log("GET Request recieved");

    const { id } = route.params; 
    console.log("UserId ---->", id)

    const client = await clientPromise;
    const db = client.db();
    var activeProjectCount = 0;
    try { 
        activeProjectCount = await db.collection(collections.contributorProjectMappings).countDocuments({ contributorId: id });
    } catch (error) {
        console.log("GET /api/projects/recent error:", error);
        return NextResponse.json(
          { error: "Failed to fetch locations", details: (error as Error).message },
          { status: 500 }
        );
    }
    return NextResponse.json({success: true, activeProjectCount});
}