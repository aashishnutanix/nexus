import { NextRequest, NextResponse } from "next/server";

const dummyCertifications = [
  { id: 1, name: "Java Mentorship", description: "Provided Mentorship for Java", points: 1500, mentoredStudents: 5 },
  { id: 2, name: "Machine Learning Mentorship", description: "Provided Mentorship for Machine Learning", points: 1800, mentoredStudents: 3 },
  { id: 3, name: "Product Management Mentorship", description: "Provided Mentorship for Product Managament", points: 2000, mentoredStudents: 7 },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ certifications: dummyCertifications });
}
