import { NextResponse } from 'next/server';
// import { MentorshipRequestSchema } from '@/lib/types';
import clientPromise from '@/lib/db/client';
import { collections } from '@/lib/db/schema';
import { ObjectId } from 'mongodb';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const validatedData = MentorshipRequestSchema.parse(body);
    
//     const client = await clientPromise;
//     const db = client.db();
    
//     const result = await db.collection(collections.mentorshipRequests).insertOne({
//       ...validatedData,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });
    
//     return NextResponse.json({ success: true, id: result.insertedId });
//   } catch (error) {
//     return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
//   }
// }

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
    console.log('GET /api/mentorship');
    const { searchParams } = new URL(request.url);
    console.log('searchParams:', searchParams);
    const menteeId = searchParams.get('mentee');
    const mentorId = searchParams.get('mentor');

    const client = await clientPromise;
    const db = client.db();

    if (menteeId) {
      const mentorships = await db.collection(collections.mentorships).find({ mentee: new ObjectId(menteeId) }).toArray();
      console.log('mentorships:', mentorships);
      return NextResponse.json(mentorships);
    } else if (mentorId) {
      const mentorships = await db.collection(collections.mentorships).find({ mentor: new ObjectId(mentorId) }).toArray();
      console.log('mentorships:', mentorships);
      return NextResponse.json(mentorships);
    } else {
      return NextResponse.json({ error: 'Mentee ID or Mentor ID is required' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mentorships' }, { status: 500 });
  }
}