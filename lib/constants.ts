import {
  Home,
  Users,
  GitPullRequest,
  Trophy,
  UserCircle,
  Blocks,
  LogOut,
  ChevronRight,
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
    subRoutes: [
      { label: "Dashboard", href: "/mentorship/dashboard" },
      { label: "Find Mentor", href: "/mentorship/find-mentor" },
    ],
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
    label: "Redeem",
    icon: ChevronRight,
    subRoutes: [
      { label: "Rewards", href: "/redeem/rewards" },
      { label: "Certifications", href: "/redeem/certifications" },
    ],
  },
  {
    label: "Logout",
    icon: LogOut,
    onClick: () => signOut({ callbackUrl: "/signin" }),
  },
];
