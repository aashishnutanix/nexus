"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";

export default function CertificationsPage() {
  const { data: fetchedCertifications = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-certifications"],
    queryFn: async () => {
      const res = await fetch("/api/certifications");
      return res.json();
    },
  });

  const certifications = get(fetchedCertifications, "certifications", []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
          <p className="text-muted-foreground">Certifications for mentoring students in various skills</p>
        </div>
      </div>
      <div className="grid gap-6">
        {certifications.map((certification: any) => (
          <div key={certification.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{certification.name}</h3>
              <p className="text-muted-foreground">{certification.description}</p>
              <p className="text-muted-foreground">Mentored Students: {certification.mentoredStudents}</p>
            </div>
            <a
              href={certification.downloadUrl}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              download
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
