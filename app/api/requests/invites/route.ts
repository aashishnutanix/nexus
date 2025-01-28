import { NextResponse } from 'next/server';
import { ProjectInviteSchema } from '@/lib/types';
import clientPromise from '@/lib/db/client';
import { collections } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ProjectInviteSchema.parse(body);
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection(collections.projectInvites).insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection(collections.projectInvites).updateOne(
      { _id: id },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}