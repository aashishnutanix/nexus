import { collections } from '@/lib/db/schema';
import { Db } from 'mongodb';
import { NextResponse } from 'next/server'; // Assuming you're using Next.js
import clientPromise from "@/lib/db/client";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || ''; // Get query parameter from URL
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    console.log("Received GET request for search with query:", query);

    const client = await clientPromise; // Assuming clientPromise is defined
    const db = client.db();

    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Run parallel queries for different collections using regex search
    const [userResults, projectResults, mentorshipResults] = await Promise.all([
      db.collection(collections.users).find({ $or: [{ name: regex }, { email: regex }] }).skip(skip).limit(limit).toArray(),
      db.collection(collections.projects).find({ $or: [{ name: regex }, { description: regex }] }).skip(skip).limit(limit).toArray(),
      db.collection(collections.mentorships).find({ name: regex }).skip(skip).limit(limit).toArray(),
    ]);

    console.log("Search results:", { users: userResults, projects: projectResults, mentorships: mentorshipResults });

    return NextResponse.json({
      success: true,
      results: {
        users: userResults,
        projects: projectResults,
        mentorships: mentorshipResults,
      },
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", details: (error as Error).message },
      { status: 500 }
    );
  }
}



// db.collection(collections.users).createIndex({ name: 'text', email: 'text' });
// db.collection(collections.projects).createIndex({ name: 'text', description: 'text' });
// db.collection(collections.mentorships).createIndex({ name: 'text' });

// Modify the find queries to leverage the text index:

// db.collection(collections.users).find({ $text: { $search: query } }).limit(limit).toArray();
