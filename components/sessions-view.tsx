"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge";
import { ChartDemo } from "./chart-demo";
import { ActivityChart } from "./activity-chart";

interface SessionsViewProps {
  sessions: any[];
  activityData: any;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    variant: "success" as const,
    label: "Completed",
  },
  scheduled: {
    icon: CalendarClock,
    variant: "default" as const,
    label: "Scheduled",
  },
  missed: { icon: XCircle, variant: "destructive" as const, label: "Missed" },
};

export function SessionsView({ sessions, activityData }: SessionsViewProps) {
  return (
    <div className="space-y-8">
      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Your mentorship activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ActivityChart
              className="w-full mx-auto"
              data={activityData}
              colors={"#7855FA"}
              theme="light"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Session Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule New Session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Mentorship Session</DialogTitle>
            <DialogDescription>
              Pick a date and time for your next mentorship session
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Calendar mode="single" className="rounded-md border" />
            </div>
            <div className="grid gap-2">
              <Label>Topic</Label>
              <Input placeholder="e.g. Career Growth Discussion" />
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any specific topics you'd like to discuss?" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Schedule Session</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Past Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Past Sessions</h3>
        {sessions.map((session) => {
          const StatusIcon = statusConfig[session.status].icon;
          return (
            <Card key={session.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {format(session.date, "PPP")}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {session.topic}
                    <Badge variant={statusConfig[session.status].variant}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusConfig[session.status].label}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{session.duration}h</span>
                </div>
              </CardHeader>
              {session.status === "completed" && !session.feedback && (
                <CardContent>
                  <Button variant="outline" size="sm">
                    Provide Feedback
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
