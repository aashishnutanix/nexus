import { Home, Users, GitPullRequest, Trophy, Blocks, Gem } from "lucide-react";

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
    label: "Redeem",
    icon: Gem,
    subRoutes: [
      { label: "Rewards", href: "/redeem/rewards" },
      { label: "Certifications", href: "/redeem/certifications" },
    ],
  },
  {
    label: "Leaderboard",
    icon: Trophy,
    href: "/leaderboard",
  },
];
