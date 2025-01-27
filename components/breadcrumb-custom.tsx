"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

// export default function BreadcrumbCustom() {
//   const pathname = usePathname();
//   const pathSegments = pathname.split("/").filter((segment) => segment);

//   return (
//     <Breadcrumb>
//       <BreadcrumbItem>
//         <BreadcrumbLink href="/">Home</BreadcrumbLink>
//       </BreadcrumbItem>
//       {pathSegments.map((segment, index) => {
//         const isLast = index === pathSegments.length - 1;
//         const href = "/" + pathSegments.slice(0, index + 1).join("/");

//         return (
//           <BreadcrumbItem key={index}>
//             {isLast ? (
//               <span>{segment}</span>
//             ) : (
//               <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
//             )}
//           </BreadcrumbItem>
//         );
//       })}
//     </Breadcrumb>
//   );
// }


import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BreadcrumbCustom() {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

