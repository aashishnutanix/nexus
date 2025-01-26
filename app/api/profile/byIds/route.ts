import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/db/client";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { collections } from "@/lib/db/schema";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // split skillIds by comma
    const userIds = (url.searchParams.get("userIds") || "").split(",");

    const users = await fetchUserByIds(userIds);

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function fetchUserByIds(userids: string[]) {
  const client = await clientPromise;
  const db = client.db();

  const objectIdArray = userids.map((id) => new ObjectId(id));
  const usersData = await db
    .collection(collections.users)
    .find({ _id: { $in: objectIdArray } }, { projection: { _id: 1, name: 1, email: 1 } })
    .toArray();

  return usersData;
}



