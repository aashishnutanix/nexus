"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProjectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/projects/view-projects");
  }, [router]);

  return null;
};

export default ProjectPage;
