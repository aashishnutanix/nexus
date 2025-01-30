"use client";

import * as React from "react";
import { FolderKey, Handshake, SearchIcon, User, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchResultType } from "@/lib/types";
import { LoadingSpinner } from "./loading-spinner";
import { useRouter, redirect } from "next/navigation";

interface CustomSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  results: SearchResultType | null;
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
}

export function CustomSearchDialog({
  isOpen,
  onOpenChange,
  results,
  query,
  setQuery,
  isLoading,
}: CustomSearchDialogProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
            style={{ boxShadow: "none" }}
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 mr-2"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px] p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : results &&
            Object.values(results).some((arr) => arr.length > 0) ? (
            <>
              {results.users && results.users.length > 0 && (
                <SearchGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>Users</span>
                    </div>
                  }
                  items={results.users}
                  renderItem={(user) => (
                    <SearchItem
                      onClick={() => {
                        router.push(`/`);
                        router.push(`/profile/${user._id}`);
                        onOpenChange(false);
                      }}
                      key={user._id}
                      title={user.name}
                      subtitle={user.email}
                    />
                  )}
                />
              )}
              {results.projects && results.projects.length > 0 && (
                <SearchGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <FolderKey size={14} />
                      <span>Projects</span>
                    </div>
                  }
                  items={results.projects}
                  renderItem={(project) => (
                    <SearchItem
                      onClick={() => {
                        router.push(`/`);
                        router.push(`/projects/${project._id}`);
                        onOpenChange(false);
                      }}
                      key={project._id}
                      title={project.name}
                      subtitle={project.description}
                    />
                  )}
                />
              )}
              {results.mentorships && results.mentorships.length > 0 && (
                <SearchGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <Handshake size={14} />
                      <span>Mentorships</span>
                    </div>
                  }
                  items={results.mentorships}
                  renderItem={(mentorship) => (
                    <SearchItem
                      onClick={() => {
                        router.push(`/`);
                        router.push(`/mentorship/${mentorship._id}`);
                        onOpenChange(false);
                      }}
                      key={mentorship._id}
                      title={mentorship.name}
                      subtitle={mentorship.description}
                    />
                  )}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No results found.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface SearchGroupProps<T> {
  heading: React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function SearchGroup<T>({ heading, items, renderItem }: SearchGroupProps<T>) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm font-semibold">{heading}</div>
      {items.map(renderItem)}
    </div>
  );
}

interface SearchItemProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

function SearchItem({ title, subtitle, onClick }: SearchItemProps) {
  return (
    <div
      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent cursor-pointer"
      onClick={onClick}
    >
      <span>{title}</span>
      <span className="text-sm text-muted-foreground">{subtitle}</span>
    </div>
  );
}
