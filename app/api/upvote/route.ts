import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UpVoteSchema } from "@/lib/types";
export const dynamic = 'force-dynamic';
import { RequestContextEnum } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
       console.log("got data --. upvote " , body);
        const validatedData = UpVoteSchema.parse(body.data);
        console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.upvotes).insertOne({
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/upvotes error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}

export async function getUpVoteMapByContext(context: string){

  const client = await clientPromise;
  const db = client.db();

  const upvotesData = await db
    .collection(collections.upvotes)
    .find({ context})
    .toArray();

  const upvotesMapByReferenceIdId : { [key: string]: any } = {};
  upvotesData.forEach((upvote) => {
    upvotesMapByReferenceIdId[upvote.refreferenceId] = [
      ...(upvotesMapByReferenceIdId[upvote.refreferenceId] || []),
      upvote,
    ];
  });

  return upvotesMapByReferenceIdId;
}

export async function getUpVoteMapByContextAndRefreferenceId(context: string, refreferenceId: string){

  const client = await clientPromise;
  const db = client.db();

  const upvotesData = await db
    .collection(collections.upvotes)
    .find({ refreferenceId, context})
    .toArray();

  const upvotesMapByReferenceIdId : { [key: string]: any } = {};
  upvotesData.forEach((upvote) => {
    upvotesMapByReferenceIdId[upvote.refreferenceId] = [
      ...(upvotesMapByReferenceIdId[upvote.refreferenceId] || []),
      upvote,
    ];
  });

  return upvotesMapByReferenceIdId;
}