import { Clock3 } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { Card } from "@/components/ui/card";
import { RateAmount } from "@/components/rate-amount";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { CurrencyCode, CurrencyUtils } from "@/lib/currency";

const RATES = [
  { label: "Per second", rate: 1 },
  { label: "Per minute", rate: 60 },
  { label: "Per hour", rate: 60 * 60 },
  { label: "Per day", rate: 60 * 60 * 24 },
];

export function IncomeRatesCard({
  currencyCode,
  incomePerSecond,
}: {
  currencyCode: CurrencyCode;
  incomePerSecond: number;
}) {
  const numberFormat = CurrencyUtils.getCurrencyNumberFormat(currencyCode);

  const animatedIncomePerSecond = useAnimatedNumber(incomePerSecond);

  return (
    <Card className="row-start-3 min-[701px]:col-start-2 min-[701px]:row-start-1">
      <div className="section-heading flex min-h-8 items-center gap-2.5">
        <Clock3
          className="section-icon shrink-0 text-pop"
          size={17}
          strokeWidth={1.7}
          aria-hidden="true"
        />
        <h2 className="text-[13px] font-[550] tracking-[-0.15px]">Breakdown</h2>
      </div>
      <dl className="rate-grid mt-6.75 grid grid-cols-2 gap-2.5 min-[701px]:mt-4 min-[1001px]:grid-cols-4">
        {RATES.map(({ label, rate }) => (
          <div
            className="rate-card min-w-0 rounded-[10px] border border-border bg-rate p-3 min-[371px]:p-4 min-[1001px]:px-3"
            key={label}
          >
            <dt className="text-xs font-medium whitespace-nowrap text-pop">
              {label}
            </dt>
            <dd className="mt-3.5 text-lg font-[550] tracking-normal tabular-nums text-foreground">
              <NumericFormat
                {...numberFormat}
                value={animatedIncomePerSecond * rate}
                displayType="text"
                decimalScale={2}
                renderText={(value) => (
                  <RateAmount
                    amount={animatedIncomePerSecond * rate}
                    formattedValue={value}
                    currencyCode={currencyCode}
                  />
                )}
              />
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
