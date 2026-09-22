export enum IncomePeriod {
  Yearly = "yearly",
  Monthly = "monthly",
  Weekly = "weekly",
  Daily = "daily",
}

export const INCOME_PERIODS: Record<
  IncomePeriod,
  { label: string; secondsToPeriod: number }
> = {
  [IncomePeriod.Yearly]: {
    label: "Yearly",
    secondsToPeriod: 60 * 60 * 24 * 365,
  },
  [IncomePeriod.Monthly]: {
    label: "Monthly",
    secondsToPeriod: 60 * 60 * 24 * 30,
  },
  [IncomePeriod.Weekly]: {
    label: "Weekly",
    secondsToPeriod: 60 * 60 * 24 * 7,
  },
  [IncomePeriod.Daily]: {
    label: "Daily",
    secondsToPeriod: 60 * 60 * 24,
  },
};

function getIncomePerSecond(
  income: number,
  incomePeriod: IncomePeriod,
): number {
  return income / INCOME_PERIODS[incomePeriod].secondsToPeriod;
}

export const IncomePeriodUtils = {
  getIncomePerSecond,
};
