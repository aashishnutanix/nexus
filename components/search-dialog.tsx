"use client";

import * as React from "react";
import { FolderKey, Handshake, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Mock data - replace with real data in production
const USERS = [
  { id: 1, name: "John Doe", role: "Developer" },
  { id: 2, name: "Jane Smith", role: "Designer" },
  { id: 3, name: "Mike Johnson", role: "Product Manager" },
];

const PROJECTS = [
  { id: 1, name: "Website Redesign", status: "In Progress" },
  { id: 2, name: "Mobile App", status: "Completed" },
  { id: 3, name: "API Integration", status: "Planning" },
];

const MENTORSHIPS = [
  { id: 1, mentor: "Alice Brown", expertise: "React" },
  { id: 2, mentor: "Bob Wilson", expertise: "Node.js" },
  { id: 3, mentor: "Carol White", expertise: "UI/UX" },
];

interface SearchDialogProps {
  results: SearchResultType | null;
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
}

export function SearchDialog({
  results,
  query,
  setQuery,
  isLoading,
}: SearchDialogProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Users, Projects, Mentorships"
          value={query}
          onValueChange={setQuery}
        />
        {isLoading ? (
          <CommandEmpty>
            <div className="h-[250px] flex w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          </CommandEmpty>
        ) : (
          <CommandList>
            {isLoading && (
              <CommandEmpty>
                {/* <div className="h-[250px] flex w-full items-center justify-center"> */}
                  <LoadingSpinner />
                {/* </div> */}
              </CommandEmpty>
            )}
            {results && Object.keys(results).length > 0 && <CommandEmpty>No results found.</CommandEmpty>}
            {results && results.users && results.users.length > 0 && (
              <CommandGroup
                heading={
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>Users</span>
                  </div>
                }
              >
                {results.users.map((user) => (
                  <CommandItem
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <span>{user.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results && results.projects && results.projects.length > 0 && (
              <CommandGroup
                heading={
                  <div className="flex items-center gap-2">
                    <FolderKey size={14} />
                    <span>Projects</span>
                  </div>
                }
              >
                {results.projects.map((project) => (
                  <CommandItem
                    key={project._id}
                    className="flex items-center justify-between"
                  >
                    <span>{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.description}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results &&
              results.mentorships &&
              results.mentorships.length > 0 && (
                <CommandGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <Handshake size={14} />
                      <span>Mentorships</span>
                    </div>
                  }
                >
                  {results.mentorships.map((mentorship) => (
                    <CommandItem
                      key={mentorship._id}
                      className="flex items-center justify-between"
                    >
                      <span>{mentorship.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {mentorship.description}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
}

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import { CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { LoadingSpinner } from "./loading-spinner";
import type { SearchResultType } from "@/lib/types";

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
