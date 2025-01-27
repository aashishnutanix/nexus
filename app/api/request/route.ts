import { NextRequest, NextResponse } from "next/server";
import { RequestSchema } from "@/lib/types";
import { ProjectSchema, RequestContextEnum, RequestStatusEnum } from "@/lib/types";

import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchSkillByIds } from "../skills/skillByIds/route";
import { fetchUserByIds } from "../profile/byIds/route";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // const validatedData = RequestSchema.parse(body);
    const validatedData = body;
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.requests).insertOne({
      ...validatedData,
      userFromId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/request error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}

export async function getProjectRequestsMapByUserId(context: string){
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const projectRequests = await db
    .collection(collections.requests)
    .find({ userFromId: session.user.id, context: RequestContextEnum.Enum.PROJECT})
    .toArray();

  const requestsMapByProjectId: { [key: string]: any } = {};
  projectRequests.forEach((request) => {
    requestsMapByProjectId[request.referenceId] = [
      ...(requestsMapByProjectId[request.referenceId] || []),
      request,
    ]
  });

  return requestsMapByProjectId;
}
