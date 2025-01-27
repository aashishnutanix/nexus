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

import { Location } from "@/lib/types";

interface LocationComboboxProps {
  value: Location | null;
  onSelect: (value: Location) => void;
}

export function LocationCombobox({ value, onSelect }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const { data: locationsData, isLoading, isError } = useQuery<{
    success: boolean;
    locations: Location[];
  }>({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      return res.json();
    },
  });

  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("locationsData:", locationsData);

  const locations = locationsData?.locations || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? `${value.city}, ${value.country}, ${value.region}`
            : "Select location..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[] p-0">
        <Command>
          <CommandInput placeholder="Search location..." className="h-9" />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={`${location.city}, ${location.country}, ${location.region}`}
                  value={`${location.city}, ${location.country}, ${location.region}`}
                  onSelect={() => {
                    onSelect(location);
                    setOpen(false);
                  }}
                >
                  {`${location.city}, ${location.country}, ${location.region}`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value?.city === location.city &&
                        value?.country === location.country &&
                        value?.region === location.region
                        ? "opacity-100"
                        : "opacity-0"
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

export function RenderLocation({ location }: { location: Location }) {
  return (
    <p className="text-sm mt-2">
      {location
        ? `${location.city}, ${location.country}, ${location.region}`
        : ""}
    </p>
  );
}
