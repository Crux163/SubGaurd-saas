"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Plus, Download, Share2, Users, Trash2, Sparkles, Lock } from "lucide-react";
import { SubscriptionItem, toMonthlyEquivalent, detectPriceHike, generateCsvExport } from "@/lib/insights";

const FREE_LIMIT = 3;
const STORAGE_KEY = "subguard_items_v1";

const DEFAULT_DEMO: SubscriptionItem[] = [
  { id: "1", name: "StreamFlix 4K", category: "Entertainment", amount: 22.99, previousAmount: 17.99, billingCycle: "MONTHLY", nextRenewal: "2026-12-02", sharedWithHousehold: true, status: "ACTIVE" },
  { id: "2", name: "CloudVault 2TB", category: "Cloud", amount: 9.99, previousAmount: 9.99, billingCycle: "MONTHLY", nextRenewal: "2026-11-24", sharedWithHousehold: false, status: "ACTIVE" },
  { id: "3", name: "FitClub Pro", category: "Health", amount: 49.0, previousAmount: 39.0, billingCycle: "MONTHLY", nextRenewal: "2026-11-28", sharedWithHousehold: false, status: "FLAGGED_CANCEL" },
];

export default function DashboardPage() {
  const [items, setItems] = useState<SubscriptionItem[]>(DEFAULT_DEMO);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [prevAmount, setPrevAmount] = useState("");
  const [category, setCategory] = useState("Software");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore storage errors
    }
  }, []);

  const persist = (next: SubscriptionItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro && items.length >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }
    if (!name.trim() || !amount) return;
    const newItem: SubscriptionItem = {
      id: String(Date.now()),
      name: name.trim(),
      category,
      amount: parseFloat(amount),
      previousAmount: prevAmount ? parseFloat(prevAmount) : null,
      billingCycle: "MONTHLY",
      nextRenewal: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: "ACTIVE",
    };
    persist([newItem, ...items]);
    setName("");
    setAmount("");
    setPrevAmount("");
    notify(`Added ${newItem.name}`);
  };

  const handleCheckout = async (tier: "MONTHLY" | "LIFETIME") => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setIsPro(true);
        setShowPaywall(false);
        notify(`Pro (${tier}) unlocked in demo mode!`);
      }
    } catch {
      setIsPro(true);
      setShowPaywall(false);
      notify(`Pro (${tier}) unlocked in demo mode!`);
    }
  };

  const handleExportCsv = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    const csv = generateCsvExport(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subguard-audit.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const monthlyBurn = items.reduce((sum, i) => sum + toMonthlyEquivalent(i.amount, i.billingCycle), 0);
  const hikeSavings = items.reduce((sum, i) => sum + detectPriceHike(i).deltaAnnual, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <ShieldAlert className="w-5 h-5 text-emerald-400" /> SubGuard
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {isPro ? "PRO" : `FREE (${items.length}/${FREE_LIMIT})`}
          </span>
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`I'm tracking $${(monthlyBurn * 12).toFixed(0)}/yr in subscriptions with SubGuard and caught $${hikeSavings.toFixed(0)}/yr in price hikes!`);
              notify("Savings Snapshot copied to clipboard!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-xs font-medium hover:bg-slate-800"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Snapshot
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/app?invite=household-demo`);
              notify("Household partner invite link copied!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-xs font-medium hover:bg-slate-800"
          >
            <Users className="w-3.5 h-3.5" /> Invite Partner
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV {!isPro && <Lock className="w-3 h-3 text-amber-400" />}
          </button>
          {!isPro && (
            <button
              onClick={() => setShowPaywall(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upgrade Pro
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Monthly Recurring Burn</div>
          <div className="text-2xl font-bold text-white mt-1">${monthlyBurn.toFixed(2)}</div>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Annualized Spend</div>
          <div className="text-2xl font-bold text-white mt-1">${(monthlyBurn * 12).toFixed(2)}</div>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-rose-500/30">
          <div className="text-xs text-rose-300">Price-Hike Radar Flagged</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">+${hikeSavings.toFixed(2)}/yr</div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name (e.g. Spotify)" className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm" required />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="Current $/mo" className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm" required />
        <input value={prevAmount} onChange={(e) => setPrevAmount(e.target.value)} type="number" step="0.01" placeholder="Previous $/mo (opt)" className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm">
          <option>Software</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Health</option>
          <option>Cloud</option>
        </select>
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm py-2">
          <Plus className="w-4 h-4" /> Add Bill
        </button>
      </form>

      <div className="space-y-2.5">
        {items.map((item) => {
          const hike = detectPriceHike(item);
          return (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-xs text-slate-400">{item.category} • Renews {item.nextRenewal}</div>
              </div>
              <div className="flex items-center gap-4">
                {hike.hasHike && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-semibold">
                    +{hike.pct}% hike (+${hike.deltaAnnual}/yr)
                  </span>
                )}
                <div className="font-bold text-white">${item.amount.toFixed(2)}</div>
                <button onClick={() => persist(items.filter((x) => x.id !== item.id))} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white">Unlock SubGuard Pro</h3>
            <p className="text-sm text-slate-400 mt-1">
              Free accounts include up to {FREE_LIMIT} tracked subscriptions. Upgrade for unlimited bills, CSV/PDF exports, and household sync.
            </p>
            <div className="mt-5 space-y-3">
              <button onClick={() => handleCheckout("MONTHLY")} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm">
                Start Pro Monthly — $7/mo
              </button>
              <button onClick={() => handleCheckout("LIFETIME")} className="w-full py-3 rounded-xl border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 font-bold text-sm">
                Get Lifetime Deal — $49 once
              </button>
              <button onClick={() => setShowPaywall(false)} className="w-full py-2 text-xs text-slate-400 hover:text-white">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-emerald-500 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
