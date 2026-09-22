import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  CurrencyCode,
  CurrencyUtils,
} from "@/lib/currency";

function RateAmountText({ value, symbol }: { value: string; symbol: string }) {
  const [number, suffix] = value.split(" ");
  const [integer, fraction] = number.split(".");

  return (
    <>
      <span className="mr-0.5 text-[0.85em] font-normal text-muted-foreground">
        {symbol}
      </span>
      <span>{integer}</span>
      {fraction && (
        <span className="text-[0.85em] font-normal text-muted-foreground">
          .{fraction}
        </span>
      )}
      {suffix && (
        <span className="ml-1 text-[0.85em] font-medium">{suffix}</span>
      )}
    </>
  );
}

export function RateAmount({
  amount,
  formattedValue,
  currencyCode,
}: {
  amount: number;
  formattedValue: string;
  currencyCode: CurrencyCode;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measurementsRef = useRef<HTMLSpanElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currency = CURRENCIES[currencyCode];
  const formatters = useMemo(
    () =>
      [2, 1, 0].map((digits) =>
        CurrencyUtils.getCompactCurrencyFormatter(currencyCode, digits),
      ),
    [currencyCode],
  );
  const candidates = useMemo(
    () => [
      formattedValue,
      ...formatters.map((formatter) =>
        formatter
          .formatToParts(amount)
          .filter(({ type }) => type !== "currency" && type !== "literal")
          .map(({ type, value }) => (type === "compact" ? ` ${value}` : value))
          .join(""),
      ),
    ],
    [amount, formattedValue, formatters],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measurements = measurementsRef.current;
    if (!container || !measurements) return;

    const measure = () => {
      const width = container.getBoundingClientRect().width;
      const index = Array.from(measurements.children).findIndex(
        (candidate) => candidate.getBoundingClientRect().width <= width,
      );
      setSelectedIndex(index);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const candidate of measurements.children) observer.observe(candidate);
    return () => observer.disconnect();
  }, [candidates]);

  const displayedValue =
    candidates[selectedIndex === -1 ? candidates.length - 1 : selectedIndex];

  return (
    <span
      ref={containerRef}
      className="rate-amount relative block"
      title={`${currency.symbol}${formattedValue}`}
    >
      <span className="sr-only">
        {formattedValue} {currency.name}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "rate-amount-value",
          selectedIndex === -1
            ? "block whitespace-normal wrap-anywhere"
            : "inline-block whitespace-nowrap",
        )}
      >
        <RateAmountText
          value={displayedValue}
          symbol={currency.symbol}
        />
      </span>
      <span
        ref={measurementsRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 top-0 h-0 overflow-hidden"
      >
        {candidates.map((value, index) => (
          <span
            key={index}
            className="absolute top-0 left-0 inline-block whitespace-nowrap"
          >
            <RateAmountText value={value} symbol={currency.symbol} />
          </span>
        ))}
      </span>
    </span>
  );
}
