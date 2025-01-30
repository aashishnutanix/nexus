import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BgImage from "@/public/assets/bg.png";
import Collab from "@/public/assets/collab.png";
import { cn } from "@/lib/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const showBg = true;

  const bgStyle = showBg
    ? {
        backgroundImage: `url(${BgImage.src})`,
        backgroundSize: "cover",
      }
    : { backgroundSize: "cover" };

  if (session) {
    return redirect("/");
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-between ",
        showBg ? "px-48" : " px-36"
      )}
      style={bgStyle}
    >
      {children}
      {!showBg && (
        <div className="">
          <img className="max-h-[700px]" src={Collab.src} alt="Collab" />
        </div>
      )}
    </div>
  );
  // return <>{children}</>;
}
