export interface SubscriptionItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  previousAmount?: number | null;
  billingCycle: "MONTHLY" | "ANNUAL" | "WEEKLY";
  nextRenewal: string;
  sharedWithHousehold?: boolean;
  status: "ACTIVE" | "PAUSED" | "FLAGGED_CANCEL";
}

export function toMonthlyEquivalent(amount: number, cycle: SubscriptionItem["billingCycle"]): number {
  if (cycle === "ANNUAL") return amount / 12;
  if (cycle === "WEEKLY") return (amount * 52) / 12;
  return amount;
}

export function detectPriceHike(item: SubscriptionItem): { hasHike: boolean; pct: number; deltaAnnual: number } {
  if (!item.previousAmount || item.amount <= item.previousAmount) {
    return { hasHike: false, pct: 0, deltaAnnual: 0 };
  }
  const pct = Math.round(((item.amount - item.previousAmount) / item.previousAmount) * 100);
  const deltaMonthly = toMonthlyEquivalent(item.amount - item.previousAmount, item.billingCycle);
  return { hasHike: true, pct, deltaAnnual: Math.round(deltaMonthly * 12 * 100) / 100 };
}

export function generateCsvExport(items: SubscriptionItem[]): string {
  const headers = ["Name", "Category", "Amount", "Cycle", "Monthly Equivalent", "Previous Amount", "Price Hike %", "Next Renewal", "Status"];
  const rows = items.map((item) => {
    const hike = detectPriceHike(item);
    return [
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.amount.toFixed(2),
      item.billingCycle,
      toMonthlyEquivalent(item.amount, item.billingCycle).toFixed(2),
      item.previousAmount ? item.previousAmount.toFixed(2) : "",
      hike.hasHike ? `+${hike.pct}%` : "0%",
      item.nextRenewal,
      item.status,
    ].join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}
