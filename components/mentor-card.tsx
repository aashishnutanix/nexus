import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";

interface MentorCardProps {
  userData: {
    _id: string;
    name: string;
    image?: string;
    bio: string;
    designation: {
      name: string;
    };
    skills: string[];
    interests: string[];
  };
  onContactClick: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  userData,
  onContactClick,
}) => {
  const { name, bio, image, designation } = userData;
  return (
    <Card className="max-w-[375px]">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-14 w-14 border-2 border-=[#CFFAFE]">
            <AvatarFallback>{name[0]}</AvatarFallback>
            <AvatarImage src={image} alt={name} />
          </Avatar>
          <div className="flex flex-col items-start justify-start gap-2 h-full">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{bio}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-start flex-wrap">
          {designation && (
            <Button size="sm" className="bg-[#CFFAFE] text-[#164E63]">
              {designation?.name}
            </Button>
          )}
          <Button size="sm" className="bg-[#DBEAFE] text-[#1E3A8A]">
            R&D SaaS Engineering
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Label className="mb-2">SKILLS</Label>
        <div className="flex flex-wrap gap-2">
          {["React", "Java", "Node", "Next"].map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
        {/* <br />
        <Label className="mb-2">INTERESTS</Label>
        <div className="flex flex-wrap gap-2">
          {["Machine Learning", "Management"].map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button className="w-full" variant="outline" onClick={onContactClick}>
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
