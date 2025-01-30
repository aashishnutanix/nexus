"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/loading-spinner";

const dummyData = {
  mentors: ["Mentor 1", "Mentor 2", "Mentor 3"],
  projects: ["Project 1", "Project 2", "Project 3"],
  features: ["Feature 1", "Feature 2", "Feature 3"],
  recommendations: ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
};

export default function SearchResultsPage() {
  const params = useParams<{ query: string }>();
  const query = params?.query || "";
  const [data, setData] = useState(dummyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      // Simulate fetching data
      setTimeout(() => {
        setData(dummyData);
        setIsLoading(false);
      }, 1000);
    }
  }, [query]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Search Results for "{query}"</h1>
      <Tabs defaultValue="mentors">
        <TabsList>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="mentors">
          <div className="space-y-4">
            {data.mentors.map((mentor, index) => (
              <div key={index} className="p-4 border rounded-md">
                {mentor}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-md">
                {project}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="features">
          <div className="space-y-4">
            {data.features?.map((feature, index) => (
              <div key={index} className="p-4 border rounded-md">
                {feature}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recommendations">
          <div className="space-y-4">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 border rounded-md">
                {recommendation}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
