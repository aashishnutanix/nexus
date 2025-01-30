"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackCard } from "@/components/feedback-card";
import { SessionsView } from "@/components/sessions-view";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Dummy data
const DUMMY_DATA = {
  mentor: {
    name: "Daniel",
    role: "Senior Staff Engineer",
  },
  stats: {
    current: {
      sessionsCompleted: 8,
      totalHours: 6.5,
      sessionsMissed: 2,
    },
    quarter: {
      sessionsCompleted: 3,
      totalHours: 2.5,
      sessionsMissed: 1,
    },
  },
  feedbacks: Array(6).fill({
    date: new Date("2024-01-14"),
    message:
      "I believe I would be able to extend my expertise in Generative AI for this project. This aligns with my aspirations.",
    rating: 4,
    provider: {
      name: "Daniel Smith",
      role: "Senior Staff Engineer",
    },
  }),
  sessions: [
    {
      id: "1",
      date: new Date("2024-01-10"),
      duration: 1,
      status: "completed",
      topic: "Career Growth Discussion",
    },
    {
      id: "2",
      date: new Date("2024-01-17"),
      duration: 1.5,
      status: "scheduled",
      topic: "Technical Architecture Review",
    },
    {
      id: "3",
      date: new Date("2024-01-03"),
      duration: 1,
      status: "completed",
      topic: "Goal Setting for Q1",
    },
  ],
  activityData: Array.from({ length: 30 }, (_, i) => ({
    date: `2024-01-${i + 1}`,
    count: Math.floor(Math.random() * 3),
  })),
};

const generateDummyData = () => {
  const data = [];
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    });
  }

  return data.reverse();
};

export default function MentorshipPage() {
  const [timeframe, setTimeframe] = useState<"total" | "quarter">("total");
  const activityData = generateDummyData();
  const statsCurrent = DUMMY_DATA.stats.current;
  const statsQuarter = DUMMY_DATA.stats.quarter;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Mentorship with {DUMMY_DATA.mentor.name}
        </h1>
        <p className="text-muted-foreground">Track your mentorship progress</p>
      </div>

      <Tabs defaultValue="total" className="space-y-4">
        <TabsList>
          <TabsTrigger value="total">Total</TabsTrigger>
          <TabsTrigger value="quarter">This Quarter</TabsTrigger>
        </TabsList>
        <TabsContent value="total">
          <StatsCards stats={statsCurrent} />
        </TabsContent>
        <TabsContent value="quarter">
          <StatsCards stats={statsQuarter} />
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="feedback" className="grid gap-4 md:grid-cols-2">
          {DUMMY_DATA.feedbacks?.map((feedback, i) => (
            <FeedbackCard key={i} feedback={feedback} />
          ))}
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsView
            sessions={DUMMY_DATA.sessions}
            activityData={activityData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
