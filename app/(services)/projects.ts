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

export const createProject = async (
  data: ProjectData
): Promise<CreateProjectResponse> => {
  try {
    console.log("first response 1");
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("first response - ", response);
    if (response.ok) {
      return response.json();
    } else {
      return { success: false, id: "" };
    }
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, id: "" };
  }
};
