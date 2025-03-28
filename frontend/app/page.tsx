import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Real-Time Translation Platform
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        Experience seamless real-time translation for your meetings,
        conferences, and events.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/admin">
          <Button size="lg">Admin Dashboard</Button>
        </Link>
        <Link href="/live/demo-session">
          <Button size="lg" variant="outline">
            View Demo Session
          </Button>
        </Link>
      </div>
    </div>
  );
}
