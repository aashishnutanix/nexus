import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const users = client.db().collection('users');

        const user = await users.findOne({ email: credentials.email });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          team: user.team,
          dept: user.dept,
          skillset: user.skillset,
          manager: user.manager,
          interests: user.interests,
          offering: user.offering,
          availability: user.availability,
          designation: user.designation,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.team = user.team;
        token.image = user.image;
        token.dept = user.dept;
        token.skillset = user.skillset;
        token.manager = user.manager;
        token.interests = user.interests;
        token.offering = user.offering;
        token.availability = user.availability;
        token.designation = user.designation;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.team = token.team as string;
        session.user.dept = token.dept as string;
        session.user.skillset = token.skillset as string[];
        session.user.manager = token.manager as string;
        session.user.interests = token.interests as string[];
        session.user.offering = token.offering as {
          freq: 'days' | 'weeks' | 'biweekly' | 'monthly';
          type: 'online' | 'offline' | 'both';
          time: number;
        };
        session.user.availability = token.availability as boolean;
        session.user.designation = token.designation as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };