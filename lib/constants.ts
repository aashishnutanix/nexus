import {
  Home,
  Users,
  GitPullRequest,
  Trophy,
  UserCircle,
  Blocks,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Projects",
    icon: Blocks,
    subRoutes: [
      { label: "My Projects", href: "/projects/my-projects" },
      { label: "View Projects", href: "/projects/view-projects" },
    ],
  },
  {
    label: "Mentorship",
    icon: Users,
    href: "/mentorship",
  },
  {
    label: "Requests",
    icon: GitPullRequest,
    href: "/requests",
  },
  {
    label: "Leaderboard",
    icon: Trophy,
    href: "/leaderboard",
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
  },
  {
    label: "Logout",
    icon: LogOut,
    onClick: () => signOut({ callbackUrl: "/signin" }),
  },
];
