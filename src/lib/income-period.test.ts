import { describe, expect, it } from "vitest";
import { IncomePeriod, IncomePeriodUtils, INCOME_PERIODS } from "./income-period";

const periods: Record<IncomePeriod, { label: string; seconds: number }> = {
  [IncomePeriod.Yearly]: { label: "Yearly", seconds: 31_536_000 },
  [IncomePeriod.Monthly]: { label: "Monthly", seconds: 2_592_000 },
  [IncomePeriod.Weekly]: { label: "Weekly", seconds: 604_800 },
  [IncomePeriod.Daily]: { label: "Daily", seconds: 86_400 },
};

describe.each(Object.values(IncomePeriod))("IncomePeriodUtils (%s)", (period) => {
  const { label, seconds } = periods[period];

  it("uses the documented fixed period duration", () => {
    expect(INCOME_PERIODS[period]).toEqual({ label, secondsToPeriod: seconds });
    expect(IncomePeriodUtils.getIncomePerSecond(seconds, period)).toBe(1);
    expect(IncomePeriodUtils.getIncomePerSecond(seconds * 2, period)).toBe(2);
  });

  it("handles zero, negative, and fractional income without rounding", () => {
    expect(IncomePeriodUtils.getIncomePerSecond(0, period)).toBe(0);
    expect(IncomePeriodUtils.getIncomePerSecond(-seconds, period)).toBe(-1);
    expect(IncomePeriodUtils.getIncomePerSecond(seconds / 4, period)).toBe(0.25);
    expect(IncomePeriodUtils.getIncomePerSecond(0.01, period)).toBe(0.01 / seconds);
  });

  it("preserves precision for decimal and large income amounts", () => {
    const income = 1_234_567.89;
    expect(IncomePeriodUtils.getIncomePerSecond(income, period) * seconds)
      .toBeCloseTo(income, 8);
    expect(IncomePeriodUtils.getIncomePerSecond(Number.MAX_VALUE, period))
      .toBe(Number.MAX_VALUE / seconds);
  });
});

describe("IncomePeriodUtils", () => {
  it("produces the same rate for equivalent incomes across periods", () => {
    const rates = Object.values(IncomePeriod).map((period) =>
      IncomePeriodUtils.getIncomePerSecond(periods[period].seconds * 1.25, period),
    );
    expect(rates).toEqual([1.25, 1.25, 1.25, 1.25]);
  });

  it("uses the supplied income and period on every call", () => {
    expect(IncomePeriodUtils.getIncomePerSecond(2_592_000, IncomePeriod.Monthly)).toBe(1);
    expect(IncomePeriodUtils.getIncomePerSecond(2_592_000, IncomePeriod.Daily)).toBe(30);
    expect(IncomePeriodUtils.getIncomePerSecond(1_296_000, IncomePeriod.Monthly)).toBe(0.5);
  });
});
