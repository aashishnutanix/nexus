import { NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";

export async function GET() {
  try {
    const client = await clientPromise;
    const skills = await client.db().collection('skills').find().toArray();
    
    return NextResponse.json(skills.map(skill => ({
      id: skill._id.toString(),
      name: skill.name
    })));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const client = await clientPromise;
    const skills = client.db().collection('skills');

    const existing = await skills.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: "Skill already exists" }, { status: 400 });
    }

    const result = await skills.insertOne({
      name,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      name
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
} 