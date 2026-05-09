import Link from "next/link";
import { ArrowRight, Zap, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Hero */}
      <section className="w-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-[0.03]" style={{ background: "radial-gradient(circle, white, transparent)" }} />

        <div className="mx-auto max-w-3xl px-6 py-32 text-center relative">
          <p className="text-sm font-medium text-muted-foreground mb-4 animate-fade-in-up">
            Task Management & Subcontracting
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl leading-[1.05] animate-fade-in-up animation-delay-100">
            Get work done,
            <br />
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              beautifully.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Create tasks, submit results, review work, and manage payouts.
            A streamlined platform for teams that value clarity.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-sm group">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-sm hover:bg-white/5 transition-colors">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-24 border-t">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-3 animate-fade-in-up animation-delay-100">
            Everything you need
          </p>
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-16 animate-fade-in-up animation-delay-200">
            Built for productivity.
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Tasks",
                description: "Create challenges with datasets, baseline scores, and deadlines. Workers discover and claim open tasks in real-time.",
                gradient: "from-amber-500/20 to-orange-500/20",
                delay: "animation-delay-100",
              },
              {
                icon: Shield,
                title: "Review",
                description: "Reviewers evaluate submissions with scores and detailed feedback. Approve, reject, or request revisions seamlessly.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                delay: "animation-delay-200",
              },
              {
                icon: CreditCard,
                title: "Payouts",
                description: "Transparent payout management. Admin creates payouts, workers track earnings — all in one clean interface.",
                gradient: "from-emerald-500/20 to-green-500/20",
                delay: "animation-delay-300",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`animate-fade-in-up ${feature.delay} group rounded-2xl border bg-card p-8 transition-all duration-500 hover:border-foreground/20 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1`}
              >
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-5`}>
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-24 border-t">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-3">
            Simple workflow
          </p>
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-16">
            How it works.
          </h2>

          <div className="grid gap-0 md:grid-cols-4 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {[
              { step: "01", title: "Create", desc: "Admin posts a task with dataset and deadline" },
              { step: "02", title: "Claim", desc: "Workers browse and claim tasks they want" },
              { step: "03", title: "Submit", desc: "Upload solution.py and submission.csv" },
              { step: "04", title: "Pay", desc: "Admin reviews and creates payout" },
            ].map((item, i) => (
              <div key={i} className="text-center px-4 py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-foreground/10 bg-card mb-4 transition-colors relative z-10">
                  <span className="text-sm font-bold text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 border-t">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to start?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join our community and start completing tasks today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 text-sm group">
                Create Account
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://discord.gg/hHJGM8qFx" target="_blank" rel="noopener">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-sm gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
                Discord
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 TaskFlow</span>
          <a href="https://discord.gg/hHJGM8qFx" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">
            Discord Community
          </a>
        </div>
      </footer>
    </div>
  );
}
