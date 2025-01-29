import { NextRequest, NextResponse } from "next/server";
import { collections } from "@/lib/db/schema";
import clientPromise from "@/lib/db/client";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    console.log("GET Request recieved");

    const client = await clientPromise;
    const db = client.db();

    var projects = [];
    try { 
         projects = await db.collection(collections.projects).find().sort({createdAt: -1}).limit(3).toArray();

         console.log("Recent Projects from DB->", projects);
    } catch (error) {
        console.log("GET /api/projects/recent error:", error);
        return NextResponse.json(
          { error: "Failed to fetch locations", details: (error as Error).message },
          { status: 500 }
        );
    }

    if (!projects.length) {
        return NextResponse.json({ success: true, projects: [], message: "No projects found" });
    }

    return NextResponse.json({success: true, projects});
}