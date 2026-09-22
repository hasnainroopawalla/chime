import * as React from "react";
import { ChartNoAxesCombined, RotateCcw } from "lucide-react";
import { LiveAmount } from "@/components/live-amount";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { CurrencyCode } from "@/lib/currency";
import { EarningMilestones } from "@/components/earnings-milestones";

const UPDATE_RATE_MS = 200;

export function LiveEarningsCard({
  incomePerSecond,
  currencyCode,
}: {
  incomePerSecond: number;
  currencyCode: CurrencyCode;
}) {
  const { elapsedSeconds, resetElapsedTime } = useElapsedTime();

  const elapsedTime = [Math.floor(elapsedSeconds / 60), elapsedSeconds % 60]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  const { amount, resetAmount } = useAccumulatedEarnings(incomePerSecond);
  const animatedAmount = useAnimatedNumber(amount);

  const resetLiveCounter = React.useCallback(() => {
    resetElapsedTime();
    resetAmount();
  }, [resetElapsedTime, resetAmount]);

  return (
    <Card className="@container min-[1001px]:px-8 min-[1001px]:pb-5.25 row-start-2 min-[701px]:col-span-2 min-[701px]:col-start-1">
      <div className="grid flex-1 items-stretch gap-5 min-[701px]:grid-cols-[minmax(0,1fr)_minmax(300px,0.65fr)] min-[701px]:gap-8">
        <div className="flex min-w-0 flex-col">
          <div className="summary-heading flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="section-heading flex min-h-8 items-center gap-2.5">
              <ChartNoAxesCombined
                className="section-icon shrink-0 text-pop"
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <h2 className="text-[13px] font-[550] tracking-[-0.15px]">
                Live Earnings
              </h2>
              <span
                className="live-indicator size-2 shrink-0 rounded-full bg-emerald-500 motion-safe:animate-pulse motion-safe:animation-duration-[1.4s]"
                aria-hidden="true"
                title="Live preview"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="amount-reset size-8 shrink-0 cursor-pointer text-muted-foreground hover:bg-pop-soft hover:text-pop dark:hover:bg-pop-soft"
                onClick={resetLiveCounter}
                aria-label="Reset elapsed time"
                title="Reset elapsed time"
              >
                <RotateCcw aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-1 flex-col justify-center">
            <div className="annual-section flex items-center py-3">
              <LiveAmount amount={animatedAmount} currencyCode={currencyCode} />
            </div>
            <p className="elapsed-time mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Elapsed</span>
              <span aria-hidden="true">&middot;</span>
              <time
                className="tabular-nums"
                dateTime={`PT${elapsedSeconds}S`}
                aria-live="off"
              >
                {elapsedTime}
              </time>
            </p>
          </div>
        </div>
        <EarningMilestones
          currencyCode={currencyCode}
          incomePerSecond={incomePerSecond}
          currentAmount={amount}
        />
      </div>
    </Card>
  );
}

function useAccumulatedEarnings(incomePerSecond: number) {
  const [amount, setAmount] = React.useState(0);
  const startedAt = React.useRef(0);

  const updateAmount = React.useCallback(() => {
    const elapsedMilliseconds = Math.max(0, Date.now() - startedAt.current);
    setAmount(incomePerSecond * (elapsedMilliseconds / 1_000));
  }, [incomePerSecond]);

  const resetAmount = React.useCallback(() => {
    startedAt.current = Date.now();
    setAmount(0);
  }, []);

  React.useEffect(() => {
    if (startedAt.current === 0) startedAt.current = Date.now();

    const intervalId = window.setInterval(updateAmount, UPDATE_RATE_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") updateAmount();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateAmount]);

  return { amount, resetAmount };
}
