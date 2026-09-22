import { describe, expect, it } from "vitest";
import { numericFormatter } from "react-number-format";
import { CURRENCIES, CurrencyCode, CurrencyUtils } from "./currency";

const cases: Record<
  CurrencyCode,
  {
    locale: string;
    symbol: string;
    name: string;
    groupStyle: "lakh" | "thousand";
    grouped: string;
    compact: string;
  }
> = {
  [CurrencyCode.INR]: {
    locale: "en-IN",
    symbol: "\u20b9",
    name: "Indian rupees",
    groupStyle: "lakh",
    grouped: "12,34,567.8901",
    compact: "\u20b912.35L",
  },
  [CurrencyCode.USD]: {
    locale: "en-US",
    symbol: "$",
    name: "US dollars",
    groupStyle: "thousand",
    grouped: "1,234,567.8901",
    compact: "$1.23M",
  },
  [CurrencyCode.EUR]: {
    locale: "en-US",
    symbol: "\u20ac",
    name: "euros",
    groupStyle: "thousand",
    grouped: "1,234,567.8901",
    compact: "\u20ac1.23M",
  },
  [CurrencyCode.GBP]: {
    locale: "en-US",
    symbol: "\u00a3",
    name: "British pounds",
    groupStyle: "thousand",
    grouped: "1,234,567.8901",
    compact: "\u00a31.23M",
  },
};

describe.each(Object.values(CurrencyCode))("CurrencyUtils (%s)", (currency) => {
  const { locale, symbol, name, groupStyle, grouped, compact } = cases[currency];

  it("provides the matching metadata and numeric format options", () => {
    expect(CURRENCIES[currency]).toMatchObject({
      symbol,
      name,
      thousandsGroupStyle: groupStyle,
    });
    expect(CurrencyUtils.getCurrencyNumberFormat(currency)).toEqual({
      thousandSeparator: ",",
      decimalSeparator: ".",
      thousandsGroupStyle: groupStyle,
    });
  });

  it("groups numbers without rounding or discarding fractional precision", () => {
    const format = CurrencyUtils.getCurrencyNumberFormat(currency);
    expect(numericFormatter("1234567.8901", format)).toBe(grouped);
    expect(numericFormatter("-1234567.8901", format)).toBe(`-${grouped}`);
    expect(numericFormatter("0", format)).toBe("0");
    expect(numericFormatter("0.000476", format)).toBe("0.000476");
    expect(numericFormatter("41.10", format)).toBe("41.10");
    expect(numericFormatter("9007199254740993.0000001", format)).toBe(
      currency === CurrencyCode.INR
        ? "9,00,71,99,25,47,40,993.0000001"
        : "9,007,199,254,740,993.0000001",
    );
  });

  it("creates a currency-specific compact formatter with two-digit precision", () => {
    const formatter = CurrencyUtils.getCompactCurrencyFormatter(currency);
    expect(formatter.resolvedOptions()).toMatchObject({
      locale,
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    expect(formatter.format(1_234_567)).toBe(compact);
    expect(formatter.format(-1_234_567)).toBe(`-${compact}`);
    expect(formatter.format(0)).toBe(`${symbol}0`);
    expect(formatter.format(12.345)).toBe(`${symbol}12.35`);
    expect(formatter.format(12)).toBe(`${symbol}12`);
  });
});

describe("CurrencyUtils", () => {
  it.each([
    [CurrencyCode.INR, 100_000, "\u20b91L"],
    [CurrencyCode.INR, 10_000_000, "\u20b91Cr"],
    [CurrencyCode.INR, 15_000_000, "\u20b91.5Cr"],
    [CurrencyCode.USD, 1_000, "$1K"],
    [CurrencyCode.USD, 1_000_000, "$1M"],
    [CurrencyCode.USD, 1_000_000_000, "$1B"],
    [CurrencyCode.USD, 1_000_000_000_000, "$1T"],
  ] as const)("uses the correct compact units for %s %s", (currency, amount, expected) => {
    expect(CurrencyUtils.getCompactCurrencyFormatter(currency).format(amount))
      .toBe(expected);
  });

  it.each([
    [0, "$1M"],
    [1, "$1.2M"],
    [2, "$1.23M"],
    [3, "$1.235M"],
  ] as const)("supports %s compact fraction digits", (digits, expected) => {
    const formatter = CurrencyUtils.getCompactCurrencyFormatter(CurrencyCode.USD, digits);
    expect(formatter.format(1_234_567)).toBe(expected);
    expect(formatter.resolvedOptions().maximumFractionDigits).toBe(digits);
  });

  it("surfaces invalid precision instead of silently using a default", () => {
    for (const digits of [-1, 101, NaN, Infinity]) {
      expect(() =>
        CurrencyUtils.getCompactCurrencyFormatter(CurrencyCode.USD, digits),
      ).toThrow(RangeError);
    }
  });

  it("returns independent numeric format options", () => {
    const format = CurrencyUtils.getCurrencyNumberFormat(CurrencyCode.INR);
    format.thousandSeparator = "_";
    expect(
      CurrencyUtils.getCurrencyNumberFormat(CurrencyCode.INR).thousandSeparator,
    ).toBe(",");
  });
});
