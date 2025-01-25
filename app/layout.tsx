import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/lib/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus",
  description: "A platform for project rotation and mentorship",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main>
            <div className="flex h-screen">
              {session && <Sidebar />}
              <div className="flex-1 flex flex-col min-h-screen">
                {session && <Header />}
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
