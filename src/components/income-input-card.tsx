import * as React from "react";
import { NumericFormat, type NumberFormatValues } from "react-number-format";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CurrencyCode,
  CURRENCIES,
  CurrencyUtils,
} from "@/lib/currency";
import { IncomePeriod, INCOME_PERIODS } from "@/lib/income-period";

export const DEFAULT_INCOME_AMOUNT = 10_00_000;

const incomePeriodItems = Object.values(IncomePeriod).map((value) => ({
  value,
  label: INCOME_PERIODS[value].label,
}));

export function IncomeInputCard({
  currencyCode,
  income,
  onIncomeChange,
  incomePeriod,
  onIncomePeriodChange,
}: {
  currencyCode: CurrencyCode;
  income: number;
  onIncomeChange: (value: number) => void;
  incomePeriod: IncomePeriod;
  onIncomePeriodChange: (value: IncomePeriod) => void;
}) {
  const currency = CURRENCIES[currencyCode];

  const onValueChange = React.useCallback(
    ({ floatValue }: NumberFormatValues) => {
      if (!floatValue) {
        return;
      }
      onIncomeChange(floatValue);
    },
    [onIncomeChange],
  );

  return (
    <Card className="row-start-1 min-[701px]:col-start-1">
      <div className="section-heading flex min-h-8 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Wallet
            className="section-icon shrink-0 text-pop"
            size={17}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <h2 className="text-[13px] font-[550] tracking-[-0.15px]">
            Your income
          </h2>
        </div>
        <Select
          items={incomePeriodItems}
          value={incomePeriod}
          onValueChange={(value) => {
            if (value !== null) onIncomePeriodChange(value);
          }}
        >
          <SelectTrigger
            id="income-period"
            aria-label="Income period"
            className="income-period-select w-28 shrink-0 cursor-pointer bg-field px-3 text-xs dark:bg-field dark:hover:bg-field"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" alignItemWithTrigger={false}>
            {incomePeriodItems.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="min-h-10 cursor-pointer pl-3"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="input-fields mt-6.75 min-[701px]:mt-4">
        <div className="field-group flex min-w-0 flex-col gap-2.5">
          <div className="label-row flex min-h-4.5 items-center justify-between">
            <Label htmlFor="amount" className="text-[12px] font-[550]">
              Income amount
            </Label>
            <span className="currency-label text-[10px] tracking-[0.5px] text-muted-foreground">
              {currencyCode}
            </span>
          </div>
          <div className="amount-field relative">
            <span
              className="currency-symbol pointer-events-none absolute top-1/2 left-3.75 z-1 -translate-y-1/2 text-[21px] text-muted-foreground"
              aria-hidden="true"
            >
              {currency.symbol}
            </span>
            <NumericFormat
              {...CurrencyUtils.getCurrencyNumberFormat(currencyCode)}
              customInput={Input}
              value={income}
              valueIsNumericString
              onValueChange={onValueChange}
              id="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              aria-describedby="amount-feedback"
              placeholder="0.00"
              className="money-input h-14.25 rounded-[10px] bg-field pr-3 pl-9 text-[24px] font-medium tracking-[-0.5px] tabular-nums shadow-none md:text-[24px] dark:bg-field"
            />
          </div>
          <p
            id="amount-feedback"
            className="field-feedback min-h-0 text-[10px] leading-[1.55] text-muted-foreground"
          >
            Your income for the selected period
          </p>
        </div>
      </div>
    </Card>
  );
}
