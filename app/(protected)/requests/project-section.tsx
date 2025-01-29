import { RequestCard } from "./request-card";
import { UserType, ProjectType } from "@/lib/types";
import { ArrowUpCircle } from "lucide-react"


interface ProjectSectionProps {
  project: ProjectType;
  onAcceptProfile: (profileId: string) => void;
}

export function ProjectSection({
  project,
  onAcceptProfile,
}: ProjectSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ArrowUpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">
          Project {project.name}
          <span className="ml-2 text-sm bg-slate-100 px-2 py-0.5 rounded-full">
            {project.count}
          </span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {project.profiles.map((profile) => (
          <RequestCard
            key={profile.initials}
            profile={profile}
            onAccept={() => onAcceptProfile(profile.initials)}
          />
        ))}
      </div>
    </section>
  );
}
