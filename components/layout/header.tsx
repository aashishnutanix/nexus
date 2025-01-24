'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center gap-x-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentors, projects..."
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}