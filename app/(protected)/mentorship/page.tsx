"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MentorshipPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/mentorship/dashboard");
  }, [router]);

  return null;
};

export default MentorshipPage;
