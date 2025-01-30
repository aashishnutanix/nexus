"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Logo, LogoMotion } from "@/components/ui/logo";
import BgImage from "@/public/assets/bg.png";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      router.push("/signin");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <LogoMotion />
        </div>
        <div className="text-3xl">
          <p>Collab Like a Pro</p>
          <p>Work Like a Legend</p>
        </div>
        <br />
        <br />
        <h2 className="text-3xl font-bold">Create an account</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="space-y-4">
          <Input name="name" type="text" placeholder="Full name" required />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary hover:text-primary/90 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
