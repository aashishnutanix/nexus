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

    const createRequestObj = {
      ...validatedData,
      userFromId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("createRequestObj", createRequestObj)

    const result = await db.collection(collections.requests).insertOne(createRequestObj);

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
    .find({ userFromId: session.user.id, context})
    .toArray();


    console.log("projectRequests ", projectRequests);

  const requestsMapByProjectId: { [key: string]: any } = {};
  projectRequests.forEach((request) => {
    requestsMapByProjectId[request.referenceId] = [
      ...(requestsMapByProjectId[request.referenceId] || []),
      request,
    ]
  });

  return requestsMapByProjectId;
}


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const requests = await db
      .collection(collections.requests)
      .find({ userToId: new ObjectId(session.user.id), status: "Pending" })
      .toArray();

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("GET /api/request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.requests).updateOne(
      { _id: new ObjectId(id as string) },
      {
        $set: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/request error:", error);
    return NextResponse.json(
      { error: "Invalid request", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function GET_COUNT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const count = await db
      .collection(collections.requests)
      .countDocuments({ userToId: new ObjectId(session.user.id), status: "Pending" });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("GET_COUNT /api/request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch request count", details: (error as Error).message },
      { status: 500 }
    );
  }
}
