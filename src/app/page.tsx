import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            Task Management & Subcontracting
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl leading-[1.1]">
            Get work done,
            <br />
            beautifully.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create tasks, submit results, review work, and manage payouts.
            A streamlined platform for teams that value clarity.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-sm">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-sm"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t" />

      {/* Features */}
      <section className="w-full py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-16 md:grid-cols-3">
            {[
              {
                title: "Tasks",
                description:
                  "Create and manage tasks with datasets, scores, and rewards. Workers discover and claim open assignments.",
              },
              {
                title: "Review",
                description:
                  "Reviewers score submissions with detailed feedback. Approve quality work or request revisions seamlessly.",
              },
              {
                title: "Payouts",
                description:
                  "Track earnings with transparent payout management. Expected dates, payment status — all in one view.",
              },
            ].map((feature, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
