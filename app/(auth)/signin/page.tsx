"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Logo, LogoMotion } from "@/components/ui/logo";
import BgImage from "@/public/assets/bg.png";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("Something went wrong");
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
        <h2 className="text-3xl font-bold">Sign in to your account</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="space-y-4">
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
          Sign in
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/90 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
