import { RequestContextEnum, UpVoteType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upVote } from "@/app/(services)/upvotes";
import ProjectCard from "@/components/project-card";

interface Project {
  name: string;
  description: string;
  status: string;
  progress: number;
  team: string[];
  priority: string;
  techStack: string[];
  bandwidthRequiredForContribution: number;
}

interface ProjectsPageProps {
  projects: Project[];
  skillsIdMap: any;
  usersIdMap: any;
  requestsMapByProjectId: any;
  upVoteMapByProjectId: any;
}

export default function ProjectsPage({
  projects,
  skillsIdMap,
  usersIdMap,
  requestsMapByProjectId,
  upVoteMapByProjectId,
}: ProjectsPageProps) {
  const { data: session } = useSession();
  const { user: loggedInUser } = session || {};
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, UpVoteType>({
    mutationFn: upVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-all-projects"] });
    },
  });

  const handleUpvote = (upvoteData: UpVoteType) => {
    mutation.mutate(upvoteData);
  };

  const handleCardClick = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const canContribute = (project: any) => {
    return (
      project.open && loggedInUser && loggedInUser.id !== project.createdBy
    );
  };

  const canUpvote = (project: any) => {
    const projectUpvotes = upVoteMapByProjectId[project._id];
    return (
      projectUpvotes &&
      loggedInUser &&
      projectUpvotes.find((upvote: any) => upvote.userId === loggedInUser.id)
    );
  };

  const canRequestForContribution = (project: any) => {
    const projectRequests = requestsMapByProjectId[project._id];
    return (
      projectRequests &&
      loggedInUser &&
      projectRequests.find(
        (request: any) => request.userFromId === loggedInUser.id
      )
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project: any, i: number) => (
        <>
          <ProjectCard
            key={project._id}
            canUpvote={canUpvote(project)}
            upvotes={Object.keys(upVoteMapByProjectId).length}
            projectData={project}
            bandwidthRequiredForContribution={project.bandwidthRequiredForContribution}
            handleUpvote={handleUpvote}
            context={RequestContextEnum.options.values().toArray()[0]}
            canContribute={canContribute(project)}
            canRequestForContribution={canRequestForContribution(project)}
            handleCardClick={handleCardClick}
            usersIdMap={usersIdMap}
            skillsIdMap={skillsIdMap}
          />
        </>
      ))}
    </div>
  );
}
