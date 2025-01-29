import { NextRequest, NextResponse } from 'next/server';
// import { MentorshipRequestSchema } from '@/lib/types';
import clientPromise from '@/lib/db/client';
import { collections } from '@/lib/db/schema';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


// export async function PUT(request: Request) {
//   try {
//     const { id, status, progress } = await request.json();
    
//     const client = await clientPromise;
//     const db = client.db();
    
//     await db.collection(collections.mentorshipRequests).updateOne(
//       { _id: id },
//       { 
//         $set: { 
//           status,
//           progress,
//           updatedAt: new Date()
//         } 
//       }
//     );
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
//   }
// }

export async function GET(request: Request) {
  try {
    console.log('GET /api/mentorships');
    const { searchParams } = new URL(request.url);
    console.log('searchParams:', searchParams);
    const menteeId = searchParams.get('mentee');
    const mentorId = searchParams.get('mentor');

    const client = await clientPromise;
    const db = client.db();

    if (menteeId) {
      const mentorships = await db
      .collection(collections.mentorships ).find({ 'mentee': menteeId }).toArray();
      console.log('mentorships:', mentorships);
      return NextResponse.json(mentorships);
    } else if (mentorId) {
      const mentorships = await db
      .collection(collections.mentorships ).find({ 'mentor': mentorId }).toArray();      
      console.log('mentorships:', mentorships);
      return NextResponse.json(mentorships);
    } else {
      return NextResponse.json({ error: 'Mentee ID or Mentor ID is required' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mentorships' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // to implement the POST request
    const body = await request.json();
    
    const validatedData = body;
    console.log("Validated data:", validatedData);

    const client = await clientPromise;
    const db = client.db();


    const result = await db.collection(collections.mentorships).insertOne(validatedData);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("POST /api/mentorships error:", error);
    return NextResponse.json(
      { 
        error: "Invalid request", 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 400 }
    );
  }
}
