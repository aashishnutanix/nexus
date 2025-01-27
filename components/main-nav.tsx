"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, FolderGit2, UserCircle } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/dashboard/profile">
        <Button
          variant={pathname === "/dashboard/profile" ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </Link>
      <div className="space-y-1">
        <Link href="/dashboard/mentorship">
          <Button
            variant={pathname.startsWith("/dashboard/mentorship") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            Mentorship
          </Button>
        </Link>
        <div className="pl-6 space-y-1">
          <Link href="/dashboard/mentorship/dashboard">
            <Button
              variant={pathname === "/dashboard/mentorship/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              size="sm"
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/mentorship/find-mentor">
            <Button
              variant={pathname === "/dashboard/mentorship/find-mentor" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              size="sm"
            >
              Find Mentor
            </Button>
          </Link>
        </div>
      </div>
      <div className="space-y-1">
        <Link href="/dashboard/projects">
          <Button
            variant={pathname.startsWith("/dashboard/projects") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <FolderGit2 className="mr-2 h-4 w-4" />
            Projects
          </Button>
        </Link>
        <div className="pl-6 space-y-1">
          <Link href="/dashboard/projects/my-projects">
            <Button
              variant={pathname === "/dashboard/projects/my-projects" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              size="sm"
            >
              My Projects
            </Button>
          </Link>
          <Link href="/dashboard/projects/view-projects">
            <Button
              variant={pathname === "/dashboard/projects/view-projects" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm"
              size="sm"
            >
              View Projects
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}