"use client";

import { useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import { search } from "@/app/(services)/search";

type SearchResult = {
  [key: string]: Array<{
    _id: string;
    name?: string;
    description?: string;
    email?: string;
  }>;
};

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null); // Use the SearchResult type
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const handleSearch = async () => {
    if (!query.trim()) return; // Don't search for empty queries
    setIsLoading(true);
    try {
      const response = await search(query);
      const data: SearchResult = await response.results; // Ensure the data matches SearchResult type
      setResults(data);
      if (Object.keys(data).length > 0) {
        setActiveTab(Object.keys(data)[0]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Header />
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mentors, mentees, or projects..."
            className="border rounded px-4 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}

      {results && (
        <div className="mt-4">
          <Tabs>
            <TabList>
              {Object.keys(results).map((key) => (
                <Tab
                  key={key}
                  title={capitalize(key)}
                  value={key}
                  onClick={() => handleTabChange(key)}
                />
              ))}
            </TabList>

            {Object.entries(results).map(([key, value]) => (
              <TabPanel key={key} value={key} isActive={activeTab === key}>
                <ul>
                  {value.map((item) => (
                    <li key={item._id}>
                      {item.name || item.description || item.email}
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default GlobalSearch;
