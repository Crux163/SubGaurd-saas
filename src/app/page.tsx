"use client";
import Link from "next/link";
import { useState } from "react";
import { ShieldAlert, TrendingUp, Download, Users, Check, ArrowRight, Sparkles } from "lucide-react";

const DEMO_PREVIEW = [
  { name: "StreamFlix 4K", oldPrice: 17.99, newPrice: 22.99, cycle: "Monthly" },
  { name: "CloudVault 2TB", oldPrice: 9.99, newPrice: 9.99, cycle: "Monthly" },
  { name: "FitClub Pro", oldPrice: 39.0, newPrice: 49.0, cycle: "Monthly" },
];

export default function LandingPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = DEMO_PREVIEW[selectedIdx];
  const annualImpact = ((active.newPrice - active.oldPrice) * 12).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
            </span>
            SubGuard
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#preview" className="hover:text-white">Live Preview</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-4 py-2 transition"
          >
            Launch App Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Zero-friction start — no credit card or signup required
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Paying for <span className="text-emerald-400">Silent Price Hikes</span> &amp; Forgotten Bills.
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
            SubGuard tracks your recurring subscriptions, flags stealth price increases automatically, and exports clean audit reports—without linking your bank login.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3.5 text-base transition"
            >
              Try Live Dashboard Free
            </Link>
            <a
              href="#pricing"
              className="rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 font-medium px-6 py-3.5 text-base transition"
            >
              View Pricing ($7/mo or $49 Lifetime)
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Trusted by 2,400+ households saving an average of $384/year • Placeholder social proof
          </p>
        </section>

        <section id="preview" className="max-w-4xl mx-auto px-4 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Interactive Price-Hike Radar</h2>
                <p className="text-xs text-slate-400">Click any sample bill to inspect its hidden annual impact</p>
              </div>
              <Link href="/app" className="text-xs font-medium text-emerald-400 hover:underline">
                Open Full Workspace →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2.5">
                {DEMO_PREVIEW.map((item, idx) => {
                  const hiked = item.newPrice > item.oldPrice;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedIdx(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        selectedIdx === idx
                          ? "border-emerald-500/60 bg-slate-800/90"
                          : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.cycle}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white text-sm">${item.newPrice.toFixed(2)}</div>
                        {hiked ? (
                          <span className="text-[11px] font-semibold text-rose-400">
                            +${(item.newPrice - item.oldPrice).toFixed(2)} hike
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-400">Price stable</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Selected Audit</div>
                <div className="text-xl font-bold text-white mt-1">{active.name}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">Previous</div>
                    <div className="font-semibold text-slate-200">${active.oldPrice.toFixed(2)}/mo</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400">Current</div>
                    <div className="font-semibold text-white">${active.newPrice.toFixed(2)}/mo</div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {Number(annualImpact) > 0
                    ? `Alert: This silent hike costs an extra $${annualImpact}/year.`
                    : "No price hike detected on this recurring charge."}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="max-w-5xl mx-auto px-4 py-14">
          <h2 className="text-3xl font-bold text-center text-white">Simple, Honest Pricing</h2>
          <p className="text-center text-slate-400 text-sm mt-2">Start free in your browser. Upgrade only when you need unlimited tracking.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col">
              <h3 className="font-semibold text-lg text-white">Free</h3>
              <div className="text-3xl font-bold text-white mt-2">$0</div>
              <p className="text-xs text-slate-400 mt-1">Test immediately with local storage</p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300 flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 3 tracked subscriptions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic renewal countdown</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Instant browser persistence</li>
              </ul>
              <Link href="/app" className="mt-6 block text-center rounded-xl border border-slate-700 py-2.5 text-sm font-semibold hover:bg-slate-800">
                Start Free
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500 bg-slate-900 p-6 flex flex-col relative">
              <span className="absolute -top-3 right-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-0.5">
                MOST POPULAR
              </span>
              <h3 className="font-semibold text-lg text-white">Pro Monthly</h3>
              <div className="text-3xl font-bold text-white mt-2">$7<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-400 mt-1">Cancel anytime in one click</p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300 flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited subscriptions &amp; bills</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Automated Price-Hike Radar</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> CSV &amp; Print-PDF Audit Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Household Partner Sync</li>
              </ul>
              <Link href="/app?upgrade=monthly" className="mt-6 block text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-sm font-semibold">
                Upgrade to Pro
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col">
              <h3 className="font-semibold text-lg text-white">Lifetime Deal</h3>
              <div className="text-3xl font-bold text-white mt-2">$49<span className="text-sm font-normal text-slate-400"> once</span></div>
              <p className="text-xs text-slate-400 mt-1">Pay once, own Pro forever</p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300 flex-1">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Pro Monthly</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Zero recurring subscription</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Priority household invites</li>
              </ul>
              <Link href="/app?upgrade=lifetime" className="mt-6 block text-center rounded-xl border border-emerald-500/50 text-emerald-300 py-2.5 text-sm font-semibold hover:bg-emerald-500/10">
                Get Lifetime Access
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="max-w-3xl mx-auto px-4 py-12 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-white">Do I need to connect my bank account?</div>
              <p className="text-slate-400 mt-1">No. SubGuard never asks for bank credentials. Add bills manually or import via CSV in seconds.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-white">Can I share bills with my partner or roommate?</div>
              <p className="text-slate-400 mt-1">Yes! Use the built-in Household Invite link to split shared utilities, streaming, and rent.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
