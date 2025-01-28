import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddRequestForm } from "@/components/request-form"
import { RequestContextEnum, UpVoteType } from "@/lib/types"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upVote } from "@/app/(services)/upvotes";

interface Project {
  name: string;
  description: string;
  status: string;
  progress: number;
  team: string[];
  priority: string;
  techStack: string[];
}

interface ProjectsPageProps {
  projects: Project[];
  skillsIdMap: any;
  usersIdMap: any;
  requestsMapByProjectId: any;
  upVoteMapByProjectId: any;
}

export default function ProjectsPage({ projects, skillsIdMap, usersIdMap, requestsMapByProjectId, upVoteMapByProjectId }: ProjectsPageProps) {

  const { data: session } = useSession();
  const { user: loggedInUser } = session || {};
  const [requestModal, setRequestModal] = useState(false)
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, UpVoteType>({
    mutationFn: upVote,
    onSettled: () => {
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
    return project.open && loggedInUser && loggedInUser.id !== project.createdBy;
  }

  const canUpvote = (project: any) => {
    const projectUpvotes = upVoteMapByProjectId[project._id];
    return projectUpvotes && loggedInUser && projectUpvotes.find((upvote: any) => upvote.userId === loggedInUser.id);
  }

  const canRequestForContribution = (project: any) => {
    const projectRequests = requestsMapByProjectId[project._id];
    return projectRequests && loggedInUser && projectRequests.find((request: any) => request.userFromId === loggedInUser.id);
  }

  return (
    <div className="grid gap-6">
      {projects.map((project: any, i: number) => (
        <Card key={project._id} className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle 
                  onClick={() => handleCardClick(project._id)}
                  className="cursor-pointer hover:underline"
                >
                  {project.name} - {project.department}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <Badge
                variant={
                  project.businessCritical ? "destructive" : "secondary"
                }
              >
                {project.businessCritical ? "Business Critical" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Created By: {usersIdMap[project.createdBy]?.name}
                </p>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              {project.status === "In Progress" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Progress
                    </p>
                    <p className="text-sm font-medium">
                      {project.progress}%
                    </p>
                  </div>
                  <Progress
                    value={project.progress}
                    className="bg-secondary"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium mb-2">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: any) => (
                    <Badge
                      key={skillsIdMap[tech]?._id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                    >
                      {skillsIdMap[tech]?.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {canContribute(project) ? (
                <Dialog open={requestModal} onOpenChange={setRequestModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" disabled={canRequestForContribution(project)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Contribute
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Apply for contribution In {project.name} </DialogTitle>
                      <DialogDescription>
                        Request will go to project owner <b>{usersIdMap[project.createdBy].name}</b>
                      </DialogDescription>
                    </DialogHeader>
                    <AddRequestForm onSuccess={() => setRequestModal(false)} context={RequestContextEnum.enum.PROJECT} referenceId={project._id} userToId={project.createdBy} />
                  </DialogContent>
                </Dialog>
              ) : null}
              <Button className="bg-primary hover:bg-primary/90" onClick={() => handleUpvote({ refreferenceId: project._id, context: RequestContextEnum.enum.PROJECT })} disabled={canUpvote(project)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Upvote - {upVoteMapByProjectId[project._id]?.length}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}