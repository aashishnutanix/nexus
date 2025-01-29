import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,  } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { searchAllUsers } from "@/app/(services)/searchMentors"; // Import searchAllUsers method
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "@/lib/types";
import { get } from "lodash";

interface InviteUsersProps {
  projectId: string;
  projectName: string;
  usersIdMap: any;
  onInviteSubmit: (selectedUsers: string[], inviteMessage: string) => void;
}

const InviteUsers: React.FC<InviteUsersProps> = ({ projectId, projectName, usersIdMap, onInviteSubmit }) => {
  const [inviteModal, setInviteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);


  const { data, isLoading } = useQuery<any>({
    queryKey: ["users-fetch"],
    queryFn: async () => {
      const res = await fetch("/api/search/users");
      return res.json();
    },
  });





  const users = get(data, "users", []);

  const updateSearchResult = () => {
    setSearchResults(users);
  }

  const userIdMap: { [key: string]: UserType } = {};
users.forEach((userItem: UserType) => {
    userIdMap[userItem._id.toString()] = userItem;
});

//   console.log(" users data from api - ", data);

  const handleInviteSubmit = () => {
    console.log("selectedUsers handleInviteSubmit", selectedUsers);
    onInviteSubmit(selectedUsers, inviteMessage);
    setInviteModal(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = users.filter((user: any) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelect = (userId: string) => {
    setSelectedUsers(
      selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : [...selectedUsers, userId]
    );
  };

//   console.log("selectedUsers", selectedUsers);

  return (
    <Dialog open={inviteModal} onOpenChange={setInviteModal}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invite Users to Contribute to {projectName}</DialogTitle>
          <DialogDescription>
            Select users to invite and write a common message.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {searchResults.map((user: any) => (
                <CommandItem
                  key={user._id}
                  onSelect={() => handleSelect(user._id)}
                >
                <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUsers.includes(user._id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Textarea
          value={inviteMessage}
          onChange={(e) => setInviteMessage(e.target.value)}
          placeholder="Write a message"
          className="mt-4"
        />
        <Button onClick={() => {
            handleInviteSubmit();
        }} className="mt-4">
          Send Invites
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsers;
