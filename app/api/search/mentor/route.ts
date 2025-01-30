import { collections } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import clientPromise from "@/lib/db/client";
import { ObjectId } from "mongodb";
import { User, Skill, Location } from "@/lib/db/schema";

interface RecommendationScore {
  mentor: User;
  score: number;
}

class MentorRecommendationEngine {
  private mentors: User[];

  constructor(mentors: User[]) {
    this.mentors = mentors;
  }

  private cosineSimilarity(set1: Set<string>, set2: Set<string>): number {
    if (set1.size === 0 || set2.size === 0) return 0;
    const intersection = new Set([...set1].filter(skill => set2.has(skill)));
    return intersection.size / Math.sqrt(set1.size * set2.size);
  }

  private locationScore(mentee: Location, mentor: Location): number {
    let score = 0;

    if (mentee.city === mentor.city) {
      score += 15; // Strong preference for same city
    }
    if (mentee.region === mentor.region) {
      score += 10; // Prefer same region
    }
    if (mentee.timezone === mentor.timezone) {
      score += 8; // Prefer same timezone
    }

    return score;
  }

  private calculateScore(mentee: User, mentor: User, skillsMap: Map<ObjectId, string>): number {
    let score = 0;

    // Convert interest IDs to interest names
    const menteeInterests = new Set(mentee.interests?.map(interestId => skillsMap.get(interestId)) || []);
    const mentorSkills = new Set(mentor.skills?.map(skillId => skillsMap.get(skillId)) || []);

    console.log('menteeInterests:', menteeInterests);
    console.log('mentorSkills:', mentorSkills);

    // 1. **Interest Match (Cosine Similarity)**
    const interestSimilarity = this.cosineSimilarity(menteeInterests, mentorSkills);
    score += interestSimilarity * 50; // Max 50 points

    // 2. **Designation Consideration**
    if (mentee.designation && mentor.designation) {
      if (mentee.designation.type === "Engineering") {
        if (mentor.designation.type === "Engineering" && mentor.designation.level > mentee.designation.level) {
          score += 20; // Prefer higher-level engineers
        }
      } else {
        if (mentor.designation.type !== "Engineering" || mentor.designation.level >= mentee.designation.level) {
          score += 15; // Prefer mentors from other fields but avoid downgrades
        }
      }
    }

    // 3. **Mentorship Experience**
    if (mentor.mentoring) {
      const mentorshipCount = mentor.mentoring.length;
      if (mentorshipCount > 5) {
        score += 20; // Experienced mentors get a boost
      } else if (mentorshipCount > 0) {
        score += 10; // Moderate boost for some experience
      } else {
        score += 5; // Fairness: Don't penalize new mentors
      }
    }

    // 4. **Availability Factor**
    if (mentor.isAvailable) {
      score += 10;
    }

    // 5. **Location Proximity (New)**
    if (mentee.location && mentor.location) {
      score += this.locationScore(mentee.location, mentor.location);
    }

    return score;
  }

  recommendMentors(mentee: User, skillsMap: Map<ObjectId, string>, topN: number = 10): RecommendationScore[] {
    const rankedMentors = this.mentors
      .filter(mentor => mentor._id !== mentee._id && mentor.isAvailable)
      .map(mentor => ({
        mentor,
        score: this.calculateScore(mentee, mentor, skillsMap),
      }))
      .sort((a, b) => b.score - a.score);

    return rankedMentors.slice(0, topN);
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const limit = parseInt(url.searchParams.get('limit') || '6', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const currentUserId = new ObjectId(url.searchParams.get('currentUserId') || '');

    console.log('query:', query);
    console.log('limit:', limit);
    console.log('page:', page);
    console.log('currentUserId:', currentUserId);

    const client = await clientPromise;
    const db = client.db();

    const skip = (page - 1) * limit;

    const mentee = await db.collection<User>("users").findOne({ _id: currentUserId }) as User;

    let mentors: User[] = [];
    if (query) {
      const regex = new RegExp(query, 'i'); // Case-insensitive partial match
      const skills = await db.collection<Skill>("skills").find({ name: { $regex: regex } }).toArray();
      const skillIds = skills.map(skill => new ObjectId(skill._id));

      console.log('skills:', skills);
      console.log('skillIds:', skillIds);

      if (skillIds.length > 0) {
        mentors = await db.collection<User>("users")
          .aggregate([
            { $match: { skills: { $in: skillIds }, isAvailable: true, _id: { $ne: currentUserId } } },
            {
              $lookup: {
                from: 'skills',
                localField: 'skills',
                foreignField: '_id',
                as: 'skillsDetails'
              }
            },
            {
              $lookup: {
                from: 'skills',
                localField: 'interests',
                foreignField: '_id',
                as: 'interestsDetails'
              }
            },
            { $skip: skip },
            { $limit: limit }
          ])
          .toArray() as User[];
      }

      // If no mentors found by skill, search by name
      if (mentors.length === 0) {
        console.log('No mentors found by skill, searching by name');
        mentors = await db.collection<User>("users")
          .aggregate([
            { $match: { name: { $regex: regex }, isAvailable: true, _id: { $ne: currentUserId } } },
            {
              $lookup: {
                from: 'skills',
                localField: 'skills',
                foreignField: '_id',
                as: 'skillsDetails'
              }
            },
            {
              $lookup: {
                from: 'skills',
                localField: 'interests',
                foreignField: '_id',
                as: 'interestsDetails'
              }
            },
            { $skip: skip },
            { $limit: limit }
          ])
          .toArray() as User[];
      }
    } else {
      mentors = await db.collection<User>("users")
        .aggregate([
          { $match: { isAvailable: true, _id: { $ne: currentUserId } } },
          {
            $lookup: {
              from: 'skills',
              localField: 'skills',
              foreignField: '_id',
              as: 'skillsDetails'
            }
          },
          {
            $lookup: {
              from: 'skills',
              localField: 'interests',
              foreignField: '_id',
              as: 'interestsDetails'
            }
          },
          { $skip: skip },
          { $limit: limit }
        ])
        .toArray() as User[];
    }

    console.log('mentors:', mentors);

    // Fetch all skills and create a map of skill IDs to skill names
    const skills = await db.collection<Skill>("skills").find().toArray();
    const skillsMap = new Map(skills.map(skill => [skill._id, skill.name]));

    const recommendationEngine = new MentorRecommendationEngine(mentors);
    const rankedMentors = recommendationEngine.recommendMentors(mentee, skillsMap, limit);

    console.log('rankedMentors:', rankedMentors);

    return NextResponse.json({
      success: true,
      results: rankedMentors.map(r => ({
        ...r.mentor,
        skills: r.mentor.skillsDetails?.map(skill => skill.name) || [],
        interests: r.mentor.interestsDetails?.map(interest => interest.name) || []
      })),
    });
  } catch (error) {
    console.error("GET /api/search/mentors error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", details: (error as Error).message },
      { status: 500 }
    );
  }
}
