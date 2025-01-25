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
import { SkillsMultiSelect } from "@/components/skill-multiselect";

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
  startDate: string;
  businessCritical: boolean;
  department?: string;
  upVotes?: number;
  contributors?: string[];
  open?: boolean;
}

// Define a type for the response of createProject
interface CreateProjectResponse {
  success: boolean;
  id: string; // Adjust this based on your actual response structure
}

export function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ProjectData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Idea",
      startDate: new Date().toISOString(),
      businessCritical: false,
      department: "",
      open: true,
    },
  });

  const mutation = useMutation<CreateProjectResponse, Error, ProjectData>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      setSelectedTechStack([]);
      onSuccess();
    },
  });

  const handleButtonClick = () => {
    const values = form.getValues();
    mutation.mutate({
      ...values,
      techStack: selectedTechStack,
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-6">
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

        <FormItem>
          <FormLabel>Tech Stack</FormLabel>
          <FormControl>
            <SkillsMultiSelect
              selected={selectedTechStack}
              onSelectionChange={setSelectedTechStack}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

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
