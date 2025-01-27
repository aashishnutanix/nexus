"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function BreadcrumbCustom() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        return (
          <BreadcrumbItem key={index}>
            {isLast ? (
              <span>{segment}</span>
            ) : (
              <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
