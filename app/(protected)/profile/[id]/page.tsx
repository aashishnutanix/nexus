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
import {
  getProfile,
  getProfileById,
  updateProfile,
} from "@/app/(services)/profile";
import { SkillsMultiSelect } from "@/components/skill-multiselect";
import {
  UserType,
  DesignationType,
  OfferingType,
  OfferingSchema,
} from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { get } from "lodash";
import { SkillDisplays } from "@/components/skillDisplay";
import { LocationCombobox } from "@/components/location-combobox";
import { DesignationsCombobox } from "@/components/designations-combobox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { LocationType } from "@/lib/types";
import Tile from "@/components/tile";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
}

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id || "1";

  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["profileById"],
    queryFn: async () => await getProfileById(userId),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const { data } = useQuery<{ success: boolean; skills: Skill[] }>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      return res.json();
    },
  });

  // get skills array from options, skills array is type Skill[]
  const savedSkills: Skill[] = get(data, "skills", []);
  const skillsIdMap: { [key: string]: Skill } = {};
  savedSkills.forEach((skill) => {
    skillsIdMap[skill._id] = skill;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [designation, setDesignation] = useState<DesignationType | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [offering, setOffering] = useState<OfferingType | undefined>();

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      setLocation(profile.location || null);
      setDesignation(profile.designation || null);
      setIsAvailable(profile.isAvailable || false);
      setOffering(profile.offering || undefined);
    }
  }, [profile]);

  const handleSave = () => {
    if (profileData && location && designation) {
      updateProfileMutation.mutate({
        ...profileData,
        location,
        designation,
        isAvailable,
        offering,
      });
      setIsEditing(false);
    } else if (profileData) {
      updateProfileMutation.mutate({ ...profileData, isAvailable, offering });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    handleSave();
  }, [offering, isAvailable]);

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

  const mentorshipPreferences = () => (
    <Card className="space-y-1">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Mentorship Preferences
          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={isAvailable}
              onCheckedChange={(e) => setIsAvailable(e)}
              disabled
            />
            <Label htmlFor="availability">Available to Mentor</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 flex-1">
            <Label>Frequency</Label>
            <Select
              disabled
              value={offering?.freq || ""}
              onValueChange={(value) =>
                setOffering((prev) =>
                  prev
                    ? {
                        ...prev,
                        freq: value as OfferingType["freq"],
                      }
                    : prev
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select freq..." />
              </SelectTrigger>
              <SelectContent>
                {OfferingSchema.shape.freq.options.map((freq: string) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Mode</Label>
            <Select
              disabled
              value={offering?.type || ""}
              onValueChange={(value) =>
                setOffering((prev) =>
                  prev
                    ? {
                        ...prev,
                        type: value as OfferingType["type"],
                      }
                    : prev
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {OfferingSchema.shape.type.options.map((type: string) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Hours</Label>
            <Input
              disabled
              type="number"
              //@ts-ignore
              value={offering?.duration || null}
              onChange={(e) =>
                setOffering((prev) =>
                  prev ? { ...prev, duration: Number(e.target.value) } : prev
                )
              }
              className="w-full p-2 border rounded"
              placeholder="Duration (hours)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-start gap-6">
            <div className="">
              {/* Avatar with Image Upload */}
              <Avatar className="h-24 w-24 text-5xl border-primary border-2">
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
            <div className="flex flex-col items-start gap-1 flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  {/* Editable Profile Fields */}
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="text-2xl font-bold"
                  />
                  <DesignationsCombobox
                    value={designation}
                    onSelect={setDesignation}
                  />
                  <Input
                    value={profileData.dept}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, dept: e.target.value } : prev
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
                  <LocationCombobox value={location} onSelect={setLocation} />
                </div>
              ) : (
                <>
                  {/* Display Profile Fields */}
                  <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                  <CardDescription className="ml-0">
                    {profileData?.bio}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    {profileData.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location
                      ? `${location.city}, ${location.country}, ${location.region}`
                      : ""}
                  </p>
                  <div className="flex gap-2">
                    <Tile value={designation?.code} visible={!!designation} />
                    <Tile
                      value={profileData?.dept}
                      visible={!!profileData?.dept}
                      bgColor="#DBEAFE"
                      textColor="#1E3A8A"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4 flex-1">
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
                {!isEditing && (
                  <SkillDisplays skillIds={profileData.skills || []} />
                )}
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
                {!isEditing && (
                  <SkillDisplays skillIds={profileData.interests || []} />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      {mentorshipPreferences()}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mentoring Section */}
        <Card>
          <CardHeader>
            <CardTitle>Mentoring</CardTitle>
            <CardDescription>
              People you are currently mentoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.mentoring?.length ? (
              profileData.mentoring.map((mentee, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="border-primary border-2">
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
                    {mentee.skills?.map((skill, j) => (
                      <Badge key={j} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No mentees yet? Time to share your wisdom!
              </p>
            )}
          </CardContent>
        </Card>

        {/* My Mentors Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Mentors</CardTitle>
            <CardDescription>People who are mentoring you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.mentors?.length ? (
              profileData.mentors.map((mentor, i) => (
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
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No mentors yet? Looks like you&apos;re the master of your own
                destiny!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Current and past projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profileData.projects?.length ? (
              profileData.projects.map((project, i) => (
                <div key={i} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge
                        variant={
                          project.status === "Completed"
                            ? "secondary"
                            : "outline"
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
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, j) => (
                      <Badge key={j} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects yet? Time to get those creative juices flowing!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
