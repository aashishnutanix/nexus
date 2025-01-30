import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/db/client";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the session to verify if the user is authenticated
    const session = await getServerSession(authOptions);

    // If no session is found, return an unauthorized error
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams?.get("id");

    // Get the user ID from the session
    const userId = id || session.user.id;
    const client = await clientPromise;
    const db = client.db();

    // Fetch the user details from the database
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the mentors of the user from the mentorships collection
    const mentors = await db
      .collection("mentorships")
      .aggregate([
        { $match: { mentee: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "mentor",
            foreignField: "_id",
            as: "mentorDetails",
          },
        },
        { $unwind: "$mentorDetails" },
        { $replaceRoot: { newRoot: "$mentorDetails" } },
      ])
      .toArray();

    // Fetch the mentees of the user from the mentorships collection
    const mentees = await db
      .collection("mentorships")
      .aggregate([
        { $match: { mentor: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "mentee",
            foreignField: "_id",
            as: "menteeDetails",
          },
        },
        { $unwind: "$menteeDetails" },
        { $replaceRoot: { newRoot: "$menteeDetails" } },
      ])
      .toArray();

    // Fetch the projects the user is a contributor to from the contributorProjectMappings collection
    const contributorProjects = await db
      .collection("contributorProjectMappings")
      .find({ contributorId: new ObjectId(userId) })
      .toArray();
    const projectIds = contributorProjects.map((mapping) => mapping.projectId);

    // Fetch the project details based on the project IDs
    const projects = await db
      .collection("projects")
      .find({ _id: { $in: projectIds } })
      .toArray();

    // Construct the profile data to be returned
    const profileData = {
      name: user.name,
      role: user.role,
      email: user.email,
      image: user.image,
      skills: user.skills,
      interests: user.interests,
      bio: user.bio,
      location: user.location, // Add the location details to the profile data
      offering: user.offering,
      isAvailable: user.isAvailable,
      dept: user.dept,
      designation: user.designation,
      mentoring: mentees.map((mentee) => ({
        name: mentee.name,
        image: mentee.image,
        focus: mentee.focus,
        progress: mentee.progress,
        skills: mentee.skills,
      })),
      mentors: mentors.map((mentor) => ({
        name: mentor.name,
        image: mentor.image,
        focus: mentor.focus,
        skills: mentor.skills,
      })),
      projects: projects.map((project) => ({
        name: project.name,
        role: project.role,
        status: project.status,
        progress: project.progress,
        techStack: project.techStack,
      })),
    };

    // Return the profile data as a JSON response
    return NextResponse.json(profileData);
  } catch (error) {
    // Return an internal server error if something goes wrong
    return NextResponse.json(
      { error: `Internal Server Error - ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the session to verify if the user is authenticated
    const session = await getServerSession(authOptions);

    // If no session is found, return an unauthorized error
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user ID from the session
    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db();

    // Parse the request body to get the updated user details
    const updatedUserData = await request.json();

    // Update the user details in the database
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updatedUserData,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Return an internal server error if something goes wrong
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
