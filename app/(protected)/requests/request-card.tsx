import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserType } from "@/lib/types";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

interface RequestCardProps {
  profile: UserType;
  request: any;
  acceptVisible: boolean;
  onAccept: (profile: UserType) => void;
  onReject: (profile: UserType) => void;
}

export function RequestCard({
  profile,
  request,
  onAccept,
  onReject,
  acceptVisible,
}: RequestCardProps) {
  const router = useRouter();
  return (
    <Card className="w-[380px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div
            className="flex items-start gap-4"
            onClick={() => router.push(`/profile/${profile._id}`)}
          >
            <Avatar className="h-16 w-16 bg-slate-100">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-lg text-muted-foreground">{profile.role}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {profile.dept && (
              <span className="px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-700">
                {profile.dept}
              </span>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Message</h3>
            <p className="text-muted-foreground text-ellipsis h-8">
              {request.message}
            </p>
          </div>
        </div>
      </CardContent>

      {acceptVisible && (
        <CardFooter className="flex justify-evenly pt-4">
          <Button
            className="w-full mr-2 text-base py-6"
            onClick={() => onAccept(profile)}
          >
            Accept
          </Button>
          <Button
            className="w-full text-base py-6 bg-black hover:bg-gray-800"
            onClick={() => onReject(profile)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
