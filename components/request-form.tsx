"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestSchema } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createRequest } from "@/app/(services)/requests";

interface RequestFormProps {
  onSuccess: () => void;
  context: string;
  referenceId: any;
  userToId: any;
}


// Define a type for the response of createProject
interface CreateRequestResponse {
  success: boolean;
  id: string; // Adjust this based on your actual response structure
}

export function AddRequestForm({ onSuccess, context, userToId, referenceId }: RequestFormProps) {

  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<any>({
    defaultValues: {
      message: "",
      context: context,
      userToId: userToId,
      referenceId:referenceId
    },
  });

  const mutation = useMutation<CreateRequestResponse, Error, any>({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["fetch-all-projects"] });
      form.reset();
      onSuccess();
    },
  });

  const handleButtonClick = (data: any) => {
    console.log("submitting data", data);
    const requestData = {
      ...data,
      skillId:'6797282a2fed8a5461afd2a6' // selectedSkillId
    }
    mutation.mutate(requestData);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="space-y-6"
        onSubmit={form.handleSubmit(handleButtonClick)}
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Type here" {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            onClick={handleButtonClick}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
