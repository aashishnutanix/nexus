"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { FaAmazon } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
// import { FaNetflix } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";

const iconMap: { [key: string]: JSX.Element } = {
  FaAmazon: <FaAmazon />,
  FaSpotify: <FaSpotify />,
  FaNetflix: <></>,
  FaApple: <FaApple />,
  FaGooglePlay: <FaGooglePlay />,
};

export default function RewardsPage() {
  const { data: fetchedRewards = {}, isLoading } = useQuery<any>({
    queryKey: ["fetch-rewards"],
    queryFn: async () => {
      const res = await fetch("/api/rewards");
      return res.json();
    },
  });

  const rewards = get(fetchedRewards, "rewards", []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rewards</h2>
          <p className="text-muted-foreground">Redeem your points for rewards</p>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward: any) => (
          <div key={reward.id} className="p-4 border rounded-lg flex flex-col items-center text-center">
            <div className="text-4xl mb-4">
              {iconMap[reward.icon]}
            </div>
            <h3 className="text-xl font-semibold">{reward.name}</h3>
            <p className="text-muted-foreground">{reward.description}</p>
            <p className="text-muted-foreground">Points: {reward.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
