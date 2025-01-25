import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/app/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)",
  ],
}; 