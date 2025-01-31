"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createRequest } from "@/app/(services)/requests";
import { useSession } from "next-auth/react";
import { searchMentors } from "@/app/(services)/searchMentors";
import { ObjectId } from "mongodb";
import MentorCard from "@/components/mentor-card";
import { isEmpty } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export default function FindMentorPage() {
  const [query, setQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string>();
  const [numSessions, setNumSessions] = useState(1);
  const [sessionDuration, setSessionDuration] = useState("30mins");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [mentors, setMentors] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-all-mentors"],
    queryFn: async () => await searchMentors(query, 50, 1, currentUserId),
  });

  console.log("mentors data from api - ", data);

  const handleSearch = async () => {
    try {
      const result = await searchMentors(query, 50, 1, currentUserId);
      setMentors(result.results);
    } catch (error) {
      console.error("Failed to search mentors:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

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
      skillId: "6797282a2fed8a5461afd2a6", // selectedSkillId,
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

  const handleSkillChange = (value: string) => {
    setSelectedSkillId(value);
  };

  if (isEmpty(mentors) && isLoading) {
    return <LoadingSpinner />;
  }

  if (isEmpty(mentors)) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Recommended Mentors
            </h2>
            <p className="text-muted-foreground">
              Search and connect with mentors
            </p>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mentors..."
            className="border rounded px-4 py-2 w-full max-w-md"
          />
        </div>
        <p className="text-2xl font-bold text-center">No mentors found</p>
      </div>
    );
  }

  console.log("first mentor - ", mentors);

  const skillsHard = {
    skills: ["Javascript", "Story telling", "Product Management"],
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Find a Mentor</h2>
          <p className="text-muted-foreground">
            Search and connect with mentors
          </p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mentors..."
          className="border rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 justify-items-center">
        {mentors.map((mentor, i) => (
          <MentorCard
            key={mentor?._id || i}
            userData={mentor}
            onContactClick={() => handleApply(mentor)}
          />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Fill out the form below to request mentorship.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skill">Skill</Label>
              <Select value={selectedSkillId} onValueChange={handleSkillChange}>
                <SelectTrigger id="skill">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {skillsHard.skills.map((skill, index) => (
                    <SelectItem key={index} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numSessions">Number of Sessions</Label>
              <Input
                id="numSessions"
                type="number"
                value={numSessions}
                onChange={(e) => setNumSessions(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sessionDuration">Session Duration</Label>
              <Select
                value={sessionDuration}
                onValueChange={setSessionDuration}
              >
                <SelectTrigger id="sessionDuration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30mins">30 mins</SelectItem>
                  <SelectItem value="1hr">1 hour</SelectItem>
                  <SelectItem value="2hr">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
