"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, ProjectType } from "@/lib/types";
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
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "./ui/scroll-area";

interface AddProjectFormProps {
  onSuccess: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  techStack: string[];
  status: string;
  startDate: string;
  businessCritical: boolean;
  department?: string;
  upVotes?: number;
  contributors?: string[];
  open?: boolean;
  bandwidthRequiredForContribution: number;
}

interface CreateProjectResponse {
  success: boolean;
  id: string;
}

export function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ProjectType>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Idea",
      startDate: new Date().toISOString(),
      businessCritical: false,
      department: "",
      open: true,
      techStack: [],
      bandwidthRequiredForContribution: 0,
    },
  });

  const mutation = useMutation<CreateProjectResponse, Error, ProjectType>({
    mutationFn: async (data) => {
      // Add missing fields with default values
      const completeData = {
        ...data,
        upVotes: 0,
        contributors: [],
        status: "Idea",
        startDate: new Date().toISOString(),
      };
      return await createProject(completeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-my-projects"] });
      form.reset();
      onSuccess();
    },
  });

  const handleSubmit = () => {
    const formData = form.getValues();
    console.log("first form data", formData);
    // Trigger form validation
    form.trigger().then((isValid) => {
      console.log("isValid - ", isValid);
      if (isValid) {
        const formData = form.getValues();
        mutation.mutate(formData);
      } else {
        console.log("Validation errors:", form.formState.errors);
      }
    });
  };

  return (
    <ScrollArea className="h-[400px]">
      <Form {...form}>
        <div className="space-y-6 px-4">
          {/* Keep all your existing FormField components */}
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Enter department name" {...field} />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                  <SkillsMultiSelect
                    selected={field.value || []}
                    onSelectionChange={field.onChange}
                  />
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

          <FormField
            control={form.control}
            name="open"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Open Contribution</FormLabel>
                  <FormDescription>
                    Is this project open for contributions by others?
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

          <FormField
            control={form.control}
            name="bandwidthRequiredForContribution"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={100}
                      step={1}
                    />
                    <p></p>
                    <FormLabel>Bandwidth Required {field.value}%</FormLabel>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => handleSubmit()}
              className="bg-primary hover:bg-primary/90"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      </Form>
    </ScrollArea>
  );
}
