import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feature } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil, CircleCheckBig } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFeatureForm } from "@/components/add-feature-form";
import { AddRequestForm } from "@/components/request-form";
import { cn } from "@/lib/utils";

interface FeaturesListProps {
  features: Feature[];
  skillsIdMap: any;
  projectId: string;
}

export default function FeaturesList({ features, skillsIdMap, projectId }: FeaturesListProps) {
  const [editFeature, setEditFeature] = useState<Feature | null>(null);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const canContribute = (feature: Feature) => {
    // Add your logic to determine if the user can contribute to the feature
    return true; // Placeholder
  };

  const canRequestForContribution = (feature: Feature) => {
    // Add your logic to determine if the user can request for contribution to the feature
    return false; // Placeholder
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Features:</p>
      <div className="space-y-4">
        {features?.map((feature: Feature) => (
          <Card key={feature._id.toString()} className="border-l-4 border-l-secondary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={feature.priority === "high" ? "destructive" : "secondary"}>
                    {feature.priority} Priority
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditFeature(feature)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Edit Feature</DialogTitle>
                        <DialogDescription>
                          Update the feature details below.
                        </DialogDescription>
                      </DialogHeader>
                      <AddFeatureForm
                        projectId={projectId}
                        feature={feature}
                        onSuccess={() => setEditFeature(null)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Status: {feature.status}</p>
                  <p className="text-sm font-medium">Start Date: {new Date(feature.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Timeline: {feature.timeline.value} {feature.timeline.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Tech Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {feature?.techStack?.map((tech: any) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {skillsIdMap[tech]?.name || tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                {feature.links && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Links:</p>
                    <ul className="list-disc list-inside">
                      {feature.links.map((link, index) => (
                        <li key={index}>
                          <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            {canContribute(feature) && (
              <CardFooter className="flex justify-between w-full">
                <Dialog open={requestModal} onOpenChange={setRequestModal}>
                  <DialogTrigger asChild>
                    <Button
                      className={cn(
                        "w-full gap-2",
                        canRequestForContribution(feature) &&
                          "bg-[#BBF7D0] text=[#166534] opacity-100"
                      )}
                      variant="outline"
                      disabled={canRequestForContribution(feature)}
                      onClick={() => {
                        setSelectedFeature(feature);
                        setRequestModal(true);
                      }}
                    >
                      {canRequestForContribution(feature) && <CircleCheckBig size={16} />}
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Apply for contribution In {feature.name}</DialogTitle>
                      <DialogDescription>
                        Request will go to project owner
                      </DialogDescription>
                    </DialogHeader>
                    <AddRequestForm
                      onSuccess={() => setRequestModal(false)}
                      context="FEATURE"
                      referenceId={feature._id}
                      userToId={feature.projectId}
                    />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
      {editFeature && (
        <Dialog open={!!editFeature} onOpenChange={() => setEditFeature(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Feature</DialogTitle>
              <DialogDescription>
                Update the feature details below.
              </DialogDescription>
            </DialogHeader>
            <AddFeatureForm
              projectId={projectId}
              feature={editFeature}
              onSuccess={() => setEditFeature(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
