import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feature } from "@/lib/db/schema";

interface FeaturesListProps {
  features: Feature[];
  skillsIdMap: any;
}

export default function FeaturesList({ features, skillsIdMap }: FeaturesListProps) {
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
                <Badge variant={feature.priority === "high" ? "destructive" : "secondary"}>
                  {feature.priority} Priority
                </Badge>
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
                    {/* {feature.techStack.map((tech: any) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {skillsIdMap[tech]?.name || tech}
                      </Badge>
                    ))} */}
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
          </Card>
        ))}
      </div>
    </div>
  );
}
