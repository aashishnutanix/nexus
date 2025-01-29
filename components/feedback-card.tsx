import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface Feedback {
  date: Date;
  message: string;
  rating: number;
  provider: any;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(feedback.date);

  // Get the day of the week
  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(feedback.date);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-semibold tracking-tight">
              {formattedDate}
            </h2>
            <p className="text-muted-foreground">{dayOfWeek}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">
                {feedback.provider.name}
              </p>
              <p className="text-sm text-muted-foreground leading-tight">
                {feedback.provider.role}
              </p>
            </div>
            <Avatar className="h-10 w-10">
              {feedback.provider.avatar && (
                <AvatarImage
                  src={feedback.provider.avatar}
                  alt={feedback.provider.name}
                />
              )}
              <AvatarFallback>
                {feedback.provider.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight">FEEDBACK</h3>
          <p className="text-muted-foreground">{feedback.message}</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight">RATING</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= feedback.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
