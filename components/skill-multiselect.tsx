"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface SkillsMultiSelectProps {
  placeholder?: string;
  selected: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}

interface Skill {
  id: string;
  name: string;
}

export function SkillsMultiSelect({
  placeholder = "Select skills...",
  selected,
  onSelectionChange,
}: SkillsMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{success: boolean, skills:Skill[]}>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      return res.json();
    },
  });

  const options = data?.skills || []

  console.log("data ->", data);
  console.log("options ->", options);


  const createSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const handleSelect = (item: string) => {
    onSelectionChange(
      selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item]
    );
  };

  const handleAddNewOption = async () => {
    if (inputValue && !options.some((option) => option.name === inputValue)) {
      await createSkillMutation.mutateAsync(inputValue);
      handleSelect(inputValue);
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                  <X
                    className="ml-1 h-4 w-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item);
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
                  No skill found.
                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={handleAddNewOption}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add &quot;{inputValue}&quot;
                  </Button>
                </>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => handleSelect(item.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(item.name) ? "opacity-100" : "opacity-0"
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
