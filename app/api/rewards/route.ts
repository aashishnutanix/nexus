import { NextRequest, NextResponse } from "next/server";

const dummyRewards = [
  { id: 1, name: "Amazon Gift Card", description: "Get a $50 Amazon gift card", points: 500, icon: "FaAmazon" },
  { id: 2, name: "Spotify Subscription", description: "1 year Spotify subscription", points: 1000, icon: "FaSpotify" },
  { id: 3, name: "Netflix Subscription", description: "1 year Netflix subscription", points: 1200, icon: "FaNetflix" },
  { id: 4, name: "Apple Gift Card", description: "Get a $50 Apple gift card", points: 500, icon: "FaApple" },
  { id: 5, name: "Google Play Gift Card", description: "Get a $50 Google Play gift card", points: 500, icon: "FaGooglePlay" },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ rewards: dummyRewards });
}
