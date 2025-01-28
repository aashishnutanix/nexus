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


