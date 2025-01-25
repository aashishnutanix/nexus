"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createProject } from "@/app/(services)/projects";

interface AddProjectFormProps {
  onSuccess: () => void;
}

// Define a type for project data
interface ProjectData {
  name: string;
  description: string;
  techStack: string[];
  status:
    | "Idea"
    | "In Review"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Rejected";
  startDate: Date;
  businessCritical: boolean;
  feedbacks: any[];
}

// Define a type for the response of createProject
interface CreateProjectResponse {
  success: boolean;
  id: string; // Adjust this based on your actual response structure
}

export function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useMutation<CreateProjectResponse, Error, ProjectData>({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // form.reset(); // Reset form after successful submission
      // setTechStack([]); // Clear tech stack
      // onSuccess(); // Call the onSuccess callback
    },
    // onError: (error) => {
    //   console.error("Project creation failed:", error);
    // },
  });

  const form = useForm<ProjectData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      techStack: [],
      status: "Idea",
      startDate: new Date(),
      businessCritical: false,
      feedbacks: [],
    },
    mode: "onSubmit",
  });

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
        form.setValue("techStack", [...techStack, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    const newTechStack = techStack.filter((t) => t !== tech);
    setTechStack(newTechStack);
    form.setValue("techStack", newTechStack);
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        techStack: techStack,
        status: formData.get('status') as ProjectData['status'] || 'Idea',
        startDate: new Date(),
        businessCritical: Boolean(formData.get('businessCritical')),
        feedbacks: []
      };
      console.log("Form data:", data);
      mutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techStack"
          render={() => (
            <FormItem>
              <FormLabel>Tech Stack</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Add technology (press Enter)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                  />
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessCritical"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Business Critical</FormLabel>
                <FormDescription>
                  Mark if this project is critical for business operations
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90"
            onClick={handleButtonClick}
          >
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
