"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureType } from "@/lib/types";
import { SkillsMultiSelect } from "@/components/skill-multiselect";
import { Feature } from "@/lib/db/schema";
import { Pencil, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  FormLabel
} from "@/components/ui/form";
interface AddFeatureFormProps {
  projectId: string;
  feature?: Feature;
  onSuccess: () => void;
}

export function AddFeatureForm({ projectId, feature, onSuccess }: AddFeatureFormProps) {
  const [name, setName] = useState(feature?.name || "");
  const [description, setDescription] = useState(feature?.description || "");
  const [timelineValue, setTimelineValue] = useState(feature?.timeline.value || 0);
  const [timelineType, setTimelineType] = useState<"days" | "weeks" | "months">(feature?.timeline.type || "days");
  const [status, setStatus] = useState<"ideation" | "in_progress" | "under_review" | "completed">(feature?.status || "ideation");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(feature?.priority || "low");
  const [startDate, setStartDate] = useState(feature?.startDate || "");
  const [techStack, setTechStack] = useState<string[]>(feature?.techStack || []);
  const [links, setLinks] = useState<{ label: string; link: string }[]>(feature?.links || []);
  const [bandwidthRequiredForContribution, setBandwidthRequiredForContribution] = useState<number>(feature?.bandwidthRequiredForContribution || 0);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newFeature: FeatureType) => {
      const res = await fetch("/api/projects/features", {
        method: feature ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFeature),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-project-by-id", projectId] });
      onSuccess();
    },
  });

  const handleAddFeature = () => {
    const newFeature: FeatureType = {
      name,
      projectId: projectId,
      timeline: { value: timelineValue, type: timelineType },
      description,
      status,
      startDate,
      techStack,
      priority,
      links,
      bandwidthRequiredForContribution,
    };

    if (feature) {
      newFeature.featureId = feature._id?.toString();
    }

    mutation.mutate(newFeature);
  };

  const handleAddLink = () => {
    if (isValidUrl(linkUrl)) {
      setLinks([...links, { label: linkLabel, link: linkUrl }]);
      setLinkLabel("");
      setLinkUrl("");
      setLinkError("");
    } else {
      setLinkError("Invalid URL");
    }
  };

  const handleEditLink = (index: number) => {
    const link = links[index];
    setLinkLabel(link.label);
    setLinkUrl(link.link);
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleDeleteLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Feature Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex space-x-4">
        <Input type="number" placeholder="Timeline Value" value={timelineValue} onChange={(e) => setTimelineValue(Number(e.target.value))} />
        <Select value={timelineType} onValueChange={(value) => setTimelineType(value as "days" | "weeks" | "months")}>
          <SelectTrigger>
            <SelectValue placeholder="Timeline Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="weeks">Weeks</SelectItem>
            <SelectItem value="months">Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-4">
        <Select value={status} onValueChange={(value) => setStatus(value as "ideation" | "in_progress" | "under_review" | "completed")}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ideation">Ideation</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <SkillsMultiSelect selected={techStack} onSelectionChange={setTechStack} />
      <div className="space-y-2">
        <label>Bandwidth Required (%)</label>
        <Slider
          value={[bandwidthRequiredForContribution]}
          onValueChange={(value) => setBandwidthRequiredForContribution(value[0])}
          max={100}
          step={1}
        />
        <div>{bandwidthRequiredForContribution}%</div>
      </div>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input placeholder="Link Label" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
          <Input placeholder="Link URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          <Button onClick={handleAddLink}>Add Link</Button>
        </div>
        {linkError && <p className="text-red-500">{linkError}</p>}
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
              <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {link.label}
              </a>
              <Button variant="ghost" size="icon" onClick={() => handleEditLink(index)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => { handleAddFeature(); onSuccess(); }}>{feature ? "Update Feature" : "Add Feature"}</Button>
    </div>
  );
}
