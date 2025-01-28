import { NextRequest, NextResponse } from "next/server";
// import { SkillSchema } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
const { ObjectId } = require('mongodb');

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);
    
    // const validatedData = SkillSchema.parse(body);
    const validatedData = body

    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.skills).insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Inserted skill with id:", result);

    return NextResponse.json({ success: true, _id: result.insertedId, name:validatedData.name });
  } catch (error) {
    console.error("POST /api/skills error:", error);
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

    await db.collection(collections.skills).updateOne(
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

export async function GET( request: NextRequest) {
  try {
    console.log("Received GET request");

    const client = await clientPromise;
    const db = client.db();

    // Add support for general filtering
    const { searchParams } = new URL(request.url);
    let filter: any = {};

    // Construct filter object from query parameters
    searchParams.forEach((value, key) => {
      if (key === '_id') {
        filter[key] = new ObjectId(value);
      } else {
        filter[key] = value;
      }
    });

    const skills = await db
      .collection(collections.skills)
      .find(filter)
      .toArray();
    console.log("Fetched skills:", skills);

    return NextResponse.json({ success: true, skills });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills", details: (error as Error).message },
      { status: 500 }
    );
  }
}
