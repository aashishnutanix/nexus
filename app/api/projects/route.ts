import { NextRequest, NextResponse } from "next/server";
import { ProjectSchema, RequestContextEnum, RequestStatusEnum } from "@/lib/types";
import clientPromise from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchSkillByIds } from "../skills/skillByIds/route";
import { fetchUserByIds } from "../profile/byIds/route";
import { getProjectRequestsMapByUserId, getProjectRequestsMapByReferenceId } from "../requests/route";
import { getUpVoteMapByContext, getUpVoteMapByContextAndRefreferenceId } from "../upvote/route";
export const dynamic = 'force-dynamic';

const dummyProjects = [
  {
    _id: new ObjectId(),
    name: "E-commerce Platform Redesign",
    description: "Modernizing the user interface and improving user experience",
    status: "In Progress",
    progress: 65,
    team: ["Frontend", "UX Design", "Backend"],
    priority: "High",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS"],
  },
  {
    _id: new ObjectId(),
    name: "API Gateway Implementation",
    description: "Setting up a centralized API gateway for microservices",
    status: "Planning",
    progress: 25,
    team: ["Backend", "DevOps"],
    priority: "Medium",
    techStack: ["Java", "Spring Boot", "Docker", "Kubernetes", "Redis"],
  },
  {
    _id: new ObjectId(),
    name: "Mobile App Development",
    description: "Creating a cross-platform mobile application",
    status: "Starting",
    progress: 10,
    team: ["Mobile", "Backend", "QA"],
    priority: "High",
    techStack: ["React Native", "TypeScript", "Node.js", "MongoDB", "Firebase"],
  },
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received body:", body);
    
    const validatedData = ProjectSchema.parse(body);
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(collections.projects).insertOne({
      ...validatedData,
      members: [
        {
          userId: session.user.id,
          role: "Owner",
          joinedAt: new Date().toISOString(),
        },
      ],
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/projects error:", error);
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

    const { id, ...updateData } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.projects).updateOne(
      { _id: new ObjectId(id as string) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json(
      { error: "Invalid request", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

async function getSkillMapByIds(skillIds: ObjectId[]) {
  const skills = await fetchSkillByIds(skillIds.map(id => id.toString()));
  const skillsIdMap: { [key: string]: any } = {};
  skills.forEach((skill) => {
    skillsIdMap[skill._id.toString()] = skill;
  });
  return skillsIdMap;
}

async function getUserMapByIds(userIds: ObjectId[]) {
  const users = await fetchUserByIds(userIds.map(id => id.toString()));
  const usersIdMap: { [key: string]: any } = {};
  users.forEach((user) => {
    usersIdMap[user._id.toString()] = user;
  });
  return usersIdMap;
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const session = await getServerSession(authOptions);

    console.log("id  id", id);

    if (id) {
      const project = await db.collection(collections.projects).findOne({ _id: new ObjectId(id) });
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const techStackIds = project.techStack || [];
            const skillsIdMap = await getSkillMapByIds(techStackIds);

      const userIds = project.members.map((member: any) => member.userId);
      const usersIdMap = await getUserMapByIds(userIds);

      const requestsMapByProjectId = await getProjectRequestsMapByReferenceId(RequestContextEnum.Enum.PROJECT, project._id.toString());
      const upVoteMapByProjectId = await getUpVoteMapByContextAndRefreferenceId(RequestContextEnum.Enum.PROJECT, project._id.toString());



      return NextResponse.json({ success: true, project, skillsIdMap, usersIdMap, requestsMapByProjectId, upVoteMapByProjectId });
    } else {
      const onlyMyProjects = searchParams.get("onlyMyProjects") === "true";
      let query = {};



      if (session) {
        const projectContributions = await db
        .collection(collections.contributorProjectMappings ).find({ 'contributorId': session.user.id }).toArray();
        const projectIds = projectContributions.map((projectContribution) => new ObjectId( projectContribution.projectId));

        console.log("projectIds", projectIds);
  
        if (onlyMyProjects) {
          query = { $or: [{ "members.userId": session.user.id }, { createdBy: session.user.id }, { _id: { $in: projectIds } }] };
        } else {
          query = { $and: [{ "members.userId": { $ne: session.user.id } }, { createdBy: { $ne: session.user.id } }] };
        }
      }

      let projects = await db
        .collection(collections.projects)
        .find(query)
        .toArray();

      const techStackIds = projects.flatMap(project => project.techStack || []);
      const userIds = projects.flatMap(project => project.members.map((member: any) => member.userId));

      const skillsIdMap = await getSkillMapByIds(techStackIds);
      const usersIdMap = await getUserMapByIds(userIds);

      const requestsMapByProjectId = await getProjectRequestsMapByUserId(RequestContextEnum.Enum.PROJECT);
      const upVoteMapByProjectId = await getUpVoteMapByContext(RequestContextEnum.Enum.PROJECT);

      if (projects.length === 0) {
        return NextResponse.json({ success: true, projects: dummyProjects, skillsIdMap, usersIdMap, requestsMapByProjectId, upVoteMapByProjectId });
      }
      return NextResponse.json({ success: true, projects, skillsIdMap, usersIdMap, requestsMapByProjectId, upVoteMapByProjectId });
    }
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection(collections.projects).deleteOne({ _id: new ObjectId(id as string) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json(
      { error: "Invalid request", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
