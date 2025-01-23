"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectSchema } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddProjectFormProps {
  onSuccess: () => void
}

export function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")

  const form = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      techStack: [],
      status: "Idea",
      startDate: new Date(),
      businessCritical: false,
      feedbacks: []
    }
  })

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault()
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()])
        form.setValue("techStack", [...techStack, techInput.trim()])
      }
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    const newTechStack = techStack.filter(t => t !== tech)
    setTechStack(newTechStack)
    form.setValue("techStack", newTechStack)
  }

  async function onSubmit(data: any) {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  )
}