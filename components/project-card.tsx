import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddRequestForm } from "@/components/request-form";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { CircleArrowUp, CircleCheckBig } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import Tile from "./tile";

interface ProjectCardProps {
  projectData?: {
    _id: string;
    name: string;
    description: string;
    status: string;
    techStack: string[];
    businessCritical: boolean;
    createdBy: string;
    bandwidthRequiredForContribution: number;
  };
  upvotes: number;
  handleUpvote: (upvoteData: any) => void;
  context: string;
  canContribute: boolean;
  canUpvote: boolean;
  canRequestForContribution: boolean;
  handleCardClick: (id: string) => void;
  usersIdMap: any;
  skillsIdMap: any;
  bandwidthRequiredForContribution: number;
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
  createdBy: "60d5ec49f8d2b320d8e4f8b5",
  bandwidthRequiredForContribution: 2,
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectData = projectDataDummy,
  handleUpvote,
  context,
  canContribute,
  canRequestForContribution,
  handleCardClick,
  usersIdMap,
  skillsIdMap,
  canUpvote,
  upvotes,
}) => {
  const [requestModal, setRequestModal] = useState(false);

  const {
    _id,
    name,
    description,
    status,
    techStack,
    businessCritical,
    createdBy,
    bandwidthRequiredForContribution,
  } = projectData;

  return (
    <Card className="w-full sm:w-[375px] flex flex-col justify-between border-gray-300 border">
      <CardHeader className="gap-2 relative">
        {upvotes && (
          <Button
            size={"sm"}
            disabled={canUpvote}
            onClick={() => handleUpvote({ context, referenceId: _id })}
            variant="outline"
            className="absolute right-6 gap-2 font-medium"
          >
            <CircleArrowUp size={16} /> {`(${upvotes})`}
          </Button>
        )}
        <CardTitle
          className="cursor-pointer hover:underline"
          onClick={() => handleCardClick(_id)}
        >
          {name}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex items-center gap-2 justify-start flex-wrap">
          <Tile
            value={status}
            visible={!!status}
            bgColor="#E9D5FF"
            textColor="#4C1D95"
          />
          <Tile
            value={"Business Critical"}
            visible={businessCritical}
            bgColor="#FEE2E2"
            textColor="#7F1D1D"
          />
        </div>
        <div className="flex gap-2 items-center text-xs text-slate-500">
          <Progress value={60} max={100} className="bg-[#E9D5FF]" /> {`60%`}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col mt-auto">
        <Label className="mb-2">TECH STACK</Label>
        <div className="flex flex-wrap gap-2">
          {techStack.map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skillsIdMap[skill]?.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      {canContribute && (
        <CardFooter className="flex justify-between w-full">
          <Dialog open={requestModal} onOpenChange={setRequestModal}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "w-full gap-2",
                  canRequestForContribution &&
                    "bg-[#C4B5FD] text-[#4C1D95] opacity-100"
                )}
                variant="outline"
                disabled={canRequestForContribution}
              >
                {canRequestForContribution && <CircleCheckBig size={16} />}
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Apply for contribution In {name} </DialogTitle>
                <DialogDescription>
                  Request will go to project owner{" "}
                  <b>{usersIdMap[createdBy]?.name}</b>
                  <p></p>
                  <p>
                    {bandwidthRequiredForContribution
                      ? `You need to have ${bandwidthRequiredForContribution}% bandwidth per week`
                      : null}
                  </p>
                </DialogDescription>
              </DialogHeader>
              <AddRequestForm
                onSuccess={() => setRequestModal(false)}
                context={context}
                referenceId={_id}
                userToId={createdBy}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectCard;
