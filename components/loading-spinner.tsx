import React from "react";
import { X } from "lucide-react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full m-auto">
      <X className="animate-spin text-primary h-8 w-8" />
    </div>
  );
};


