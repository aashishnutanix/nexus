import { NextRequest, NextResponse } from "next/server";

const dummyRewards = [
  { id: 1, name: "Amazon Gift Card", description: "Get a $50 Amazon gift card", points: 500, icon: "FaAmazon", category: "Shopping" },
  { id: 2, name: "Spotify Subscription", description: "1 year Spotify subscription", points: 1000, icon: "FaSpotify", category: "Entertainment" },
  { id: 3, name: "Netflix Subscription", description: "1 year Netflix subscription", points: 1200, icon: "FaNetflix", category: "Entertainment" },
  { id: 4, name: "Apple Gift Card", description: "Get a $50 Apple gift card", points: 500, icon: "FaApple", category: "Shopping" },
  { id: 5, name: "Google Play Gift Card", description: "Get a $50 Google Play gift card", points: 500, icon: "FaGooglePlay", category: "Shopping" },
  { id: 8, name: "Zara Gift Card", description: "Get a $50 Zara gift card", points: 700, icon: "FaTshirt", category: "Apparel" },
  { id: 9, name: "Agoda Voucher", description: "Get a $100 Agoda voucher", points: 1500, icon: "FaPlane", category: "Travel" },
  { id: 10, name: "Airbnb Voucher", description: "Get a $100 Airbnb voucher", points: 1500, icon: "FaPlane", category: "Travel" },
  { id: 11, name: "Uber Gift Card", description: "Get a $50 Uber gift card", points: 500, icon: "FaCar", category: "Travel" },
  { id: 12, name: "H&M Gift Card", description: "Get a $50 H&M gift card", points: 700, icon: "FaTshirt", category: "Apparel" },
  { id: 6, name: "Travel Voucher", description: "Get a $100 travel voucher", points: 1500, icon: "FaPlane", category: "Travel" },
  { id: 7, name: "Apparel Gift Card", description: "Get a $50 apparel gift card", points: 700, icon: "FaTshirt", category: "Apparel" },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ rewards: dummyRewards });
}
