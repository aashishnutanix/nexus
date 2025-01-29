import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    console.log("Received GET request");

    const client = await clientPromise;
    const db = client.db();

    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get("groupBy");
    const sortBy = searchParams.get("sortBy");
    const limit = searchParams.get("limit");
    const period = searchParams.get("period");

    let pipeline = [];

    // Construct a generic filter object
    let filter: any = {};

    searchParams.forEach((value, key) => {
      if (
        key !== "groupBy" &&
        key !== "sortBy" &&
        key !== "limit" &&
        key !== "period"
      ) {
        filter[key] = value;
      }
    });

    if (Object.keys(filter).length > 0) {
      pipeline.push({
        $match: filter,
      });
    }

    if (period) {
      const days = parseInt(period, 10);
      const date = new Date();
      date.setDate(date.getDate() - days);
      pipeline.push({
        $match: {
          createdAt: { $gte: date.toISOString() },
        },
      });
    }

    if (groupBy) {
      pipeline.push({
        $group: {
          _id: `$${groupBy}`,
          count: { $sum: 1 },
        },
      });
    }

    if (sortBy) {
      pipeline.push({
        $sort: {
          count: sortBy === "MaxCount" ? -1 : 1,
        },
      });
    }

    if (limit) {
      pipeline.push({
        $limit: parseInt(limit, 10),
      });
    }

    const requests = await db
      .collection(collections.requests)
      .aggregate(pipeline)
      .toArray();

    console.log("Fetched requests:", requests);

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("GET /api/requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // const validatedData = RequestSchema.parse(body);
    const validatedData = body;
    console.log("Validated data -->>:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const createRequestObj = {
      ...validatedData,
      status: "Pending",
      userFromId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("createRequestObj", createRequestObj)

    const result = await db.collection(collections.requests).insertOne(createRequestObj);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/requests error:", error);
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
    console.error("PUT /api/requests error:", error);
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
    console.error("GET_COUNT /api/requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch request count", details: (error as Error).message },
      { status: 500 }
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

export async function getProjectRequestsMapByReferenceId(context: string, referenceId: string){
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const projectRequests = await db
    .collection(collections.requests)
    .find({ referenceId, context})
    .toArray();


    console.log("projectRequests based on reference ", projectRequests);

  const requestsMapByProjectId: { [key: string]: any } = {};
  projectRequests.forEach((request) => {
    requestsMapByProjectId[request.referenceId] = [
      ...(requestsMapByProjectId[request.referenceId] || []),
      request,
    ]
  });

  return requestsMapByProjectId;
}