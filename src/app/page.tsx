import Image from "next/image";
import logo from "@/assests/logo.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/notes");
    return null; 
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Next Ai" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight  lg:text-5xl">Next AI</span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent note-taking app with AI integration, built with OpenAI, PineCone, Next.js, Shadcn UI, Clerk, and more. 
      </p>
      <Link href="/notes">
        <Button size="lg" asChild>
          Open
        </Button>
      </Link>
    </main>
  );
}
