"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/app/(services)/users";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  const users = data?.users || [];

  // Sort users by designation level and availability
  const sortedUsers = [...users].sort((a, b) => {
    if (a.designation?.level === b.designation?.level) {
      return a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1;
    }
    return b.designation?.level - a.designation?.level;
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentorship Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Mentorship Offering</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${user.email}`}
                        />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user?.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.designation?.name} (L{user.designation?.level})
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.skills?.map((skill) => (
                        <Badge key={skill.toString()} variant="secondary">
                          {skill.toString().slice(-4)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isAvailable ? "default" : "secondary"}>
                      {user.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {user.offering?.freq} {user.offering?.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.offering?.duration} hrs/session
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
