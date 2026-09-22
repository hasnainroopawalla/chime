import {
  IndianRupee,
  DollarSign,
  Euro,
  PoundSterling,
  type LucideIcon,
} from "lucide-react";

export enum CurrencyCode {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

type Currency = {
  icon: LucideIcon;
  symbol: string;
  name: string;
  thousandsGroupStyle: "lakh" | "thousand";
};

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  [CurrencyCode.INR]: {
    icon: IndianRupee,
    symbol: "₹",
    name: "Indian rupees",
    thousandsGroupStyle: "lakh",
  },
  [CurrencyCode.USD]: {
    icon: DollarSign,
    symbol: "$",
    name: "US dollars",
    thousandsGroupStyle: "thousand",
  },
  [CurrencyCode.EUR]: {
    icon: Euro,
    symbol: "€",
    name: "euros",
    thousandsGroupStyle: "thousand",
  },
  [CurrencyCode.GBP]: {
    icon: PoundSterling,
    symbol: "£",
    name: "British pounds",
    thousandsGroupStyle: "thousand",
  },
};

function getCurrencyNumberFormat(currencyCode: CurrencyCode) {
  return {
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandsGroupStyle: CURRENCIES[currencyCode].thousandsGroupStyle,
  };
}

function getCompactCurrencyFormatter(
  currencyCode: CurrencyCode,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat(
    CURRENCIES[currencyCode].thousandsGroupStyle === "lakh" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits,
    },
  );
}

function getEarningMilestoneTargets(currencyCode: CurrencyCode) {
  return CURRENCIES[currencyCode].thousandsGroupStyle === "lakh"
    ? [1_000, 10_000, 100_000, 10_000_000]
    : [100, 1_000, 100_000, 1_000_000];
}

export const CurrencyUtils = {
  getCurrencyNumberFormat,
  getCompactCurrencyFormatter,
  getEarningMilestoneTargets,
};
