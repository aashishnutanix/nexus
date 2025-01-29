import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserType } from "@/lib/types";
import { AvatarImage } from "@radix-ui/react-avatar";

interface RequestCardProps {
  profile: UserType;
  request: any;
  acceptVisible: boolean;
  onAccept: (profile: UserType) => void;
  onReject: (profile: UserType) => void;
}

export function RequestCard({ profile, request, onAccept, acceptVisible }: RequestCardProps) {
  return (
    <Card className="w-[580px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 bg-slate-100">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-lg text-muted-foreground">{profile.bio}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {profile.role && (
              <span className="px-3 py-1 text-sm rounded-md bg-cyan-50 text-cyan-700">
                {profile.role}
              </span>
            )}
            {profile.dept && (
              <span className="px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-700">
                {profile.dept}
              </span>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">MESSAGE</h3>
            <p className="text-muted-foreground">{request.message}</p>
          </div>
        </div>
      </CardContent>

      {acceptVisible && <CardFooter className="pt-4">
        <Button
          className="w-full text-base py-6"
          size="lg"
          onClick={() => onAccept(profile)}
         
        >
          Accept
        </Button>
      </CardFooter>}
    </Card>
  );
}
