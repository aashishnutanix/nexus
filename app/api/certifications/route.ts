import { NextRequest, NextResponse } from "next/server";

const dummyCertifications = [
  { id: 1, name: "Java Mentorship", description: "Provided Mentorship for Java", points: 1500, mentoredStudents: 5, icon: "☕" },
  { id: 2, name: "Machine Learning Mentorship", description: "Provided Mentorship for Machine Learning", points: 1800, mentoredStudents: 3, icon: "🤖" },
  { id: 3, name: "Product Management Mentorship", description: "Provided Mentorship for Product Management", points: 2000, mentoredStudents: 7, icon: "📈" },
  { id: 4, name: "Node.js Mentorship", description: "Provided Mentorship for Node.js", points: 1700, mentoredStudents: 4, icon: "🟢" },
  { id: 5, name: "Python Mentorship", description: "Provided Mentorship for Python", points: 1600, mentoredStudents: 6, icon: "🐍" },
  { id: 6, name: "React Mentorship", description: "Provided Mentorship for React", points: 1900, mentoredStudents: 5, icon: "⚛️" },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ certifications: dummyCertifications });
}
