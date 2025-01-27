"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function FindMentorPage() {
  const [query, setQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [numSessions, setNumSessions] = useState(1);
  const [sessionDuration, setSessionDuration] = useState("30mins");

  const mentors = [
    {
      _id: "1",
      name: "John Doe",
      bio: "Experienced frontend developer with a passion for teaching.",
      designation: "Senior Developer",
      skills: ["React", "JavaScript", "CSS"],
      interests: ["UI/UX Design", "Web Development"],
    },
    {
      _id: "2",
      name: "Alice Johnson",
      bio: "Backend developer specializing in Node.js and databases.",
      designation: "Lead Developer",
      skills: ["Node.js", "MongoDB", "SQL"],
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

  const handleSubmit = () => {
    const request = {
      _id: new ObjectId(),
      userToId: selectedMentor._id,
      userFromId: "currentUserId", // Replace with actual user ID
      context: "MENTORSHIP",
      referenceId: selectedMentor._id,
      message,
      skills: selectedSkills,
      numSessions,
      sessionDuration,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Save request logic here
    setIsModalOpen(false);
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
                <label className="block text-sm font-medium">Skills</label>
                <Select
                  multiple
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(Array.from(e.target.selectedOptions, option => option.value))}
                  className="border rounded px-4 py-2 w-full"
                >
                  <SelectTrigger />
                  <SelectContent>
                    {mentors.flatMap(mentor => mentor.skills).map((skill, index) => (
                      <SelectItem key={index} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Number of Sessions</label>
                <input
                  type="number"
                  value={numSessions}
                  onChange={(e) => setNumSessions(e.target.value)}
                  min="1"
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Session Duration</label>
                <Select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                >
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem value="30mins">30 mins</SelectItem>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="2hr">2 hours</SelectItem>
                  </SelectContent>
                </Select>
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
