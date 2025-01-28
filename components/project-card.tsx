import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { CircleArrowUp } from "lucide-react";
import { Progress } from "./ui/progress";

interface ProjectCardProps {
  projectData?: {
    _id: string;
    name: string;
    description: string;
    status: string;
    techStack: string[];
    businessCritical: boolean;
    upvotes: number;
  };
  onContactClick?: () => void;
}

const projectDataDummy = {
  _id: "60d5ec49f8d2b320d8e4f8b5",
  name: "Project Nexus",
  description: "A platform for project rotation and mentorship.",
  status: "In Progress",
  progress: 60,
  techStack: ["React", "TypeScript", "Node.js", "MongoDB"],
  businessCritical: true,
  upvotes: ["user1", "user2", "user3"],
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectData = projectDataDummy,
  onContactClick,
}) => {
  const { name, description, status, techStack, businessCritical, upvotes } =
    projectData;
  return (
    <Card className="max-w-[375px]">
      <CardHeader className="gap-2 relative">
        {upvotes && (
          <Button
            size={"sm"}
            variant="outline"
            className="absolute right-6 gap-2 font-medium"
          >
            <CircleArrowUp size={16} /> {`(${upvotes.length})`}
          </Button>
        )}
        {/* <div className="flex items-center gap-2"> */}
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {/* </div> */}
        <div className="flex items-center gap-2 justify-start flex-wrap">
          <Button
            size="sm"
            className="bg-[#FEF9C3] text-[#713F12] hover:bg-[#FEF9C3] cursor-default"
          >
            {status}
          </Button>
          {businessCritical && (
            <Button
              size="sm"
              className="bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] cursor-default"
            >
              Business Critical
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center text-xs text-slate-500">
          <Progress value={60} max={100} /> {`60%`}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Label className="mb-2">TECH STACK</Label>
        <div className="flex flex-wrap gap-2">
          {["React", "Java", "Node", "Next"].map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button className="w-full" variant="outline" onClick={onContactClick}>
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
