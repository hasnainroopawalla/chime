import { Check } from "lucide-react";
import { CurrencyCode, CurrencyUtils } from "@/lib/currency";
import { cn, formatCompactDuration } from "@/lib/utils";

export function EarningMilestones({
  currencyCode,
  incomePerSecond,
  currentAmount,
}: {
  currencyCode: CurrencyCode;
  incomePerSecond: number;
  currentAmount: number;
}) {
  const targets = CurrencyUtils.getEarningMilestoneTargets(currencyCode);
  const formatter = CurrencyUtils.getCompactCurrencyFormatter(currencyCode, 0);

  return (
    <div className="h-full rounded-xl border border-border bg-rate p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Time to earn
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {targets.map((target) => {
          const isCompleted = currentAmount >= target;
          const remainingTime =
            !isCompleted &&
            formatCompactDuration((target - currentAmount) / incomePerSecond);

          return (
            <div
              key={target}
              className={cn(
                "min-w-0 rounded-lg border px-3 py-2.5 transition-colors",
                isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-border bg-card",
              )}
            >
              {isCompleted ? (
                <div className="flex min-h-9 items-center justify-between gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
                  <p className="truncate text-lg font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
                    {formatter.format(target)}
                  </p>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-pop tabular-nums">
                    {formatter.format(target)}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground tabular-nums">
                    {remainingTime}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
