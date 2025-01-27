"use client";

import * as React from "react";
import { get } from "lodash";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SkillDisplayProps {
  skillIds: string[];
}

interface Skill {
  _id: string;
  name: string;
}

export function SkillDisplays({ skillIds }: SkillDisplayProps) {

  const { data, isLoading } = useQuery<{ success: boolean; skills: Skill[] }>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      return res.json();
    },
  });

  console.log("data ->>> ", data);

  const savedSkills: Skill[] = get(data, "skills", []);
  const skillsIdMap: { [key: string]: Skill } = {};
  savedSkills.forEach((skill) => {
    skillsIdMap[skill._id] = skill;
  });

  return (
    <div>
      {skillIds?.map((skill, i) => (
        <Badge key={i} variant="secondary">
          {skillsIdMap[skill]?.name}
        </Badge>
      ))}
    </div>
  );
}
