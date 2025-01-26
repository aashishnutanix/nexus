"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/app/(services)/profile";
import { SkillsMultiSelect } from "@/components/skill-multiselect";
import { User } from "@/lib/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  const handleSave = () => {
    if (profileData) {
      updateProfileMutation.mutate(profileData);
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) =>
          prev ? { ...prev, image: data.filePath } : prev
        );
      } else {
        console.error("Failed to upload image");
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6 ">
              <div className="relative">
                <Avatar className="h-24 w-24 text-5xl relative">
                  <AvatarImage
                    src={profileData.image || ""}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  <AvatarFallback>{profileData.name[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute rounded-full bottom-[-8px] right-[-8px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) =>
                          prev ? { ...prev, name: e.target.value } : prev
                        )
                      }
                      className="text-2xl font-bold"
                    />
                    <Input
                      value={profileData.role || ""}
                      onChange={(e) =>
                        setProfileData((prev) =>
                          prev ? { ...prev, role: e.target.value } : prev
                        )
                      }
                    />
                    <Input
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                      }
                      type="email"
                    />
                    <Textarea
                      value={profileData.bio || ""}
                      onChange={(e) =>
                        setProfileData((prev) =>
                          prev ? { ...prev, bio: e.target.value } : prev
                        )
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">
                      {profileData.name}
                    </CardTitle>
                    <CardDescription>{profileData.role}</CardDescription>
                    <p className="text-sm text-muted-foreground">
                      {profileData.email}
                    </p>
                    <p className="text-sm mt-2">{profileData.bio}</p>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Skills</h3>
              </div>
              {isEditing && (
                <SkillsMultiSelect
                  selected={profileData.skills || []}
                  onSelectionChange={(skills) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, skills } : prev
                    )
                  }
                />
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.skills?.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Learning Interests</h3>
              </div>
              {isEditing && (
                <SkillsMultiSelect
                  selected={profileData.interests || []}
                  onSelectionChange={(interests) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, interests } : prev
                    )
                  }
                />
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.interests?.map((interest, i) => (
                  <Badge key={i} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentoring</CardTitle>
            <CardDescription>
              People you are currently mentoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.mentoring?.map((mentee, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentee.image} />
                    <AvatarFallback>{mentee.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mentee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mentee.focus}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentee.skills.map((skill, j) => (
                    <Badge key={j} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Mentors</CardTitle>
            <CardDescription>People who are mentoring you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.mentors?.map((mentor, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={mentor.image} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mentor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mentor.focus}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill, j) => (
                    <Badge key={j} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Current and past projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profileData.projects?.map((project, i) => (
              <div key={i} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge
                      variant={
                        project.status === "Completed" ? "secondary" : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.role}
                  </p>
                </div>
                {project.status === "In Progress" && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                )}
                <div className="flex flex-wrap gap-2"></div>
                {project.techStack.map((tech, j) => (
                  <Badge key={j} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
