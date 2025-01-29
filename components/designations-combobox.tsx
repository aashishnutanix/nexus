"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

import { DesignationType } from "@/lib/types";
import { getDesignations } from "@/app/(services)/designations";

interface DesignationsComboboxProps {
  value: DesignationType | null;
  onSelect: (value: DesignationType) => void;
}

export function DesignationsCombobox({ value, onSelect }: DesignationsComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const { data: designationsData } = useQuery<{
    success: boolean;
    designations: DesignationType[];
  }>({
    queryKey: ["designations"],
    queryFn: getDesignations,
  });

  const designations = designationsData?.designations || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value.name : "Select designation..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search designation..." className="h-9" />
          <CommandList>
            <CommandEmpty>No designation found.</CommandEmpty>
            <CommandGroup>
              {designations.map((designation) => (
                <CommandItem
                  key={designation.name}
                  value={designation.name}
                  onSelect={() => {
                    onSelect(designation);
                    setOpen(false);
                  }}
                >
                  {designation.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value?.name === designation.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function RenderDesignation({ designation }: { designation: DesignationType }) {
  return (
    <p className="text-sm mt-2">
      {designation ? designation.name : ""}
    </p>
  );
}
