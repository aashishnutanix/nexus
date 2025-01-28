"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { createRequest } from "@/app/(services)/requests";
import { useSession } from "next-auth/react";

function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export default function FindMentorPage() {
  const [query, setQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState([]);
  const [numSessions, setNumSessions] = useState(1);
  const [sessionDuration, setSessionDuration] = useState("30mins");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const mentors = [
    {
      _id: "1",
      name: "John Doe",
      bio: "Experienced frontend developer with a passion for teaching.",
      designation: "Senior Developer",
      skills: ["6797282a2fed8a5461afd2a6", "67987b2721d1575b4d9dae3c"],
      interests: ["UI/UX Design", "Web Development"],
    },
    {
      _id: "2",
      name: "Alice Johnson",
      bio: "Backend developer specializing in Node.js and databases.",
      designation: "Lead Developer",
      skills: ["6797816eb085ca24650c8e59", "67978de98ac9f153d508b3a2"],
      interests: ["API Development", "Database Design"],
    },
  ];

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleApply = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const request = {
      userToId: selectedMentor._id,
      userFromId: currentUserId,
      context: "MENTORSHIP",
      message,
      skillId: selectedSkillId,
      numSessions,
      sessionDuration,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await createRequest(request);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  const handleSkillChange = (event) => {
    setSelectedSkillId(event.target.value);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Find a Mentor</h2>
          <p className="text-muted-foreground">Search and connect with mentors</p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mentors..."
          className="border rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      <div className="grid gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor._id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mentor.name}</CardTitle>
                  <CardDescription>{mentor.bio}</CardDescription>
                </div>
                <Badge variant="outline">{mentor.designation}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleApply(mentor)}>Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader>Apply for Mentorship</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Skill</label>
                <select
                  value={selectedSkillId || ""}
                  onChange={handleSkillChange}
                  className="border rounded px-4 py-2 w-full"
                >
                  <option value="" disabled>Select a skill</option>
                  {mentors.flatMap(mentor => mentor.skills).map((skill, index) => (
                    <option key={index} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Number of Sessions</label>
                <input
                  type="number"
                  value={numSessions}
                  onChange={(e) => setNumSessions(Number(e.currentTarget.value))}
                  min="1"
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Session Duration</label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                >
                  <option value="30mins">30 mins</option>
                  <option value="1hr">1 hour</option>
                  <option value="2hr">2 hours</option>
                </select>
              </div>
              <div className="mt-4"></div> {/* Add space after session duration */}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-between w-full">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
