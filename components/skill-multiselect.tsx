"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { get, isEmpty } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillsMultiSelectProps {
  placeholder?: string;
  selected: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}

interface Skill {
  _id: string;
  name: string;
  type: string; // Add type field to Skill interface
}

export function SkillsMultiSelect({
  placeholder = "Select skills...",
  selected,
  onSelectionChange,
}: SkillsMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [skillType, setSkillType] = React.useState(""); // Add state for skill type
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ success: boolean; skills: Skill[] }>({
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

  const createSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: skillType }), // Include type in the request body
      });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const handleSelect = (item: Skill) => {
    onSelectionChange(
      selected.includes(item._id)
        ? selected.filter((i) => i !== item._id)
        : [...selected, item._id]
    );
  };

  const handleAddNewOption = async () => {
    if (
      inputValue &&
      skillType &&
      !savedSkills.some((option) => option.name === inputValue)
    ) {
      const newSkill: Skill = await createSkillMutation.mutateAsync(inputValue);
      handleSelect(newSkill);
      setInputValue("");
      setSkillType(""); // Reset skill type
    }
  };

  const skillTypeOptions = ["Soft", "Technical", "Niche"]; // Define skill type options

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-fit"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((itemId) => (
                <Badge key={itemId} variant="secondary">
                  {skillsIdMap[itemId]?.name}
                  <X
                    className="ml-1 h-4 w-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(skillsIdMap[itemId]);
                    }}
                  />
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search skills..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                "Loading skills..."
              ) : (
                <>
                  No skill found. Please add a new skill. Select a type for the skill.
                  <div className="flex gap-2 p-2 w-full items-center justify-center">
                    <Select
                      value={skillType}
                      onValueChange={setSkillType}
                    >
                      <SelectTrigger className="max-w-lg">
                        <SelectValue placeholder="Select skill type" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="ml-2"
                      onClick={handleAddNewOption}
                      disabled={isEmpty(inputValue) || isEmpty(skillType)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add &quot;{inputValue}&quot;
                    </Button>
                  </div>
                </>
              )}
            </CommandEmpty>
            <CommandGroup>
              {savedSkills.map((item) => (
                <CommandItem key={item._id} onSelect={() => handleSelect(item)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(item._id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
