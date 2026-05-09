import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          You don&apos;t have permission to view this page.
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
