import { NextRequest, NextResponse } from "next/server";
import { UserSchema } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const validatedData = UserSchema.parse(body);
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.users).insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      {
        error: "Invalid request",
        details: error instanceof Error ? error.message : String(error),
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

    await db.collection(collections.users).updateOne(
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

export async function GET(request: NextRequest) {
  console.log("GET /api/users");
  const { searchParams } = new URL(request.url);
  console.log("searchParams:", searchParams);
  const id = searchParams.get("id");

  if (id) {
    try {
      const client = await clientPromise;
      const db = client.db();

      //To handle comma seperated list of ids
      const ids = id.split(",").map((id) => new ObjectId(id));

      const user = await db
        .collection(collections.users)
        .find({ _id: { $in: ids } })
        .toArray();

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, user });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch user", details: (error as Error).message },
        { status: 500 }
      );
    }
  } else {
    try {
      console.log("Received GET request");

      const client = await clientPromise;
      const db = client.db();

      const users = await db.collection(collections.users).find({}).toArray();
      console.log("Fetched users:", users);

      return NextResponse.json({ success: true, users });
    } catch (error) {
      console.error("GET /api/users error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users", details: (error as Error).message },
        { status: 500 }
      );
    }
  }
}
