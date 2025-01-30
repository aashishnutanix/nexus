"use client";

import { useState, useEffect } from "react";
import { debounce } from "lodash"; // Install lodash: `npm install lodash`
import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, Tab, TabList, TabPanel } from "@/components/ui/tabs";
import { search } from "@/app/(services)/search";
import { Input } from "@/components/ui/input";
import { LogOut, Search as SearchIcon } from "lucide-react";
import BreadcrumbCustom from "../breadcrumb-custom";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { SearchDialog } from "../search-dialog";
import { SearchResultType } from "@/lib/types";

export function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  // Debounced Search Function
  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null); // Clear results for empty query
      return;
    }

    setIsLoading(true);
    try {
      const response = await search(searchQuery);
      const data: SearchResultType = response.results;
      setResults(data);

      // Set the first tab as active if results exist
      if (Object.keys(data).length > 0) {
        setActiveTab(Object.keys(data)[0]);
      } else {
        setActiveTab(""); // No results
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300); // Wait 300ms after typing stops before searching

  // Handle Input Change
  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Header Content */}
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="mr-auto">
          <BreadcrumbCustom />
        </div>
        <div className="flex items-center gap-x-4">
          {/* <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mentors, projects..."
              className="w-full pl-8"
            />
          </div> */}
          <SearchDialog
            results={results}
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <LogOut
              className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              onClick={() => signOut({ callbackUrl: "/signin" })}
            />
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {results && (
        <></>
        // <div className="w-full px-6 py-4 bg-muted/10">
        //   <Tabs>
        //     <TabList className="flex border-b border-muted-foreground">
        //       {Object.keys(results).map((key) => (
        //         <Tab
        //           key={key}
        //           title={capitalize(key)}
        //           value={key}
        //           onClick={() => handleTabChange(key)}
        //           className={`px-4 py-2 text-sm font-medium cursor-pointer ${
        //             activeTab === key
        //               ? "text-primary border-b-2 border-primary"
        //               : "text-muted-foreground hover:text-foreground"
        //           }`}
        //         />
        //       ))}
        //     </TabList>

        //     {/* Tabs Content */}
        //     <div className="mt-4 max-h-64 overflow-y-auto">
        //       {Object.entries(results).map(([key, value]) => (
        //         <TabPanel
        //           key={key}
        //           value={key}
        //           isActive={activeTab === key}
        //           className={activeTab === key ? "block" : "hidden"}
        //         >
        //           <ul className="space-y-2">
        //             {value.map((item) => (
        //               <li
        //                 key={item._id}
        //                 className="flex items-center gap-x-2 p-2 bg-background rounded-md shadow-sm hover:shadow-md transition"
        //               >
        //                 <div>
        //                   <p className="font-semibold text-foreground">
        //                     {item.name || item.description || item.email}
        //                   </p>
        //                   {item.description && (
        //                     <p className="text-sm text-muted-foreground">
        //                       {item.description}
        //                     </p>
        //                   )}
        //                 </div>
        //               </li>
        //             ))}
        //           </ul>
        //         </TabPanel>
        //       ))}
        //     </div>
        //   </Tabs>
        // </div>
      )}
    </header>
  );
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
