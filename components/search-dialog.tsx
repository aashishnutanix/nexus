"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSearchDialog } from "./custom-command-dialog";
import type { SearchResultType } from "@/lib/types";

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
        className="relative h-9 w-full items-center justify-start rounded-[0.5rem] text-sm text-muted-foreground gap-2 sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon size={16} className="text-muted-foreground" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CustomSearchDialog
        isOpen={open}
        onOpenChange={setOpen}
        results={results}
        query={query}
        setQuery={setQuery}
        isLoading={isLoading}
      />
    </>
  );
}
