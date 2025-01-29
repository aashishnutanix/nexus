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
import { UserType } from "@/lib/types";
import Tile from "./tile";

interface MentorCardProps {
  userData: UserType;
  onContactClick: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  userData,
  onContactClick,
}) => {
  const { name, bio, image, designation } = userData;
  return (
    <Card className="w-full max-w-[375px] flex flex-col justify-between border border-black">
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
          <Tile value={designation?.name} visible={!!designation} />
          <Tile
            value={userData?.dept}
            visible={!!userData?.dept}
            bgColor="#DBEAFE"
            textColor="#1E3A8A"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col mt-auto">
        <Label className="mb-2">SKILLS</Label>
        <div className="flex flex-wrap gap-2">
          {["React", "Java", "Node", "Next"].map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button
          className="w-full bg-purple-500 text-white"
          onClick={onContactClick}
        >
          Request Mentorship
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
