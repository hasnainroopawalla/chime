import { Fragment } from "react";
import { NumericFormat } from "react-number-format";
import {
  CURRENCIES,
  CurrencyCode,
  CurrencyUtils,
} from "@/lib/currency";

type LiveAmountProps = {
  amount: number;
  currencyCode: CurrencyCode;
};

const exactFormatters = {
  lakh: new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 21 }),
  thousand: new Intl.NumberFormat("en-US", { maximumSignificantDigits: 21 }),
};

export function LiveAmount({ amount, currencyCode }: LiveAmountProps) {
  if (!Number.isFinite(amount)) {
    throw new RangeError("Live amount must be a finite number.");
  }
  const currency = CURRENCIES[currencyCode];
  const exactAmount = `${exactFormatters[currency.thousandsGroupStyle].format(amount)} ${currency.name}`;

  return (
    <NumericFormat
      {...CurrencyUtils.getCurrencyNumberFormat(currencyCode)}
      value={amount}
      displayType="text"
      decimalScale={3}
      fixedDecimalScale
      renderText={(value) => {
        const formatted = value.replace(/(\.\d{2})0$/, "$1");
        const [integer, fraction] = formatted.split(".");
        const groups = integer.split(",");

        return (
          <p
            className="annual-number m-0 w-full text-[32px] leading-[1.2] tracking-[-0.045em] tabular-nums @min-[260px]:text-[40px] @min-[360px]:text-[56px] @min-[520px]:text-[80px]"
            role="group"
            aria-label={exactAmount}
            title={exactAmount}
          >
            {groups.map((group, index) => (
              <Fragment key={index}>
                {index > 0 && <wbr />}
                <span
                  className="annual-group inline-block align-top whitespace-nowrap"
                  aria-hidden="true"
                >
                  {index === 0 && (
                    <span className="annual-currency mr-[0.12em] text-[0.55em] font-normal tracking-[-0.03em] text-muted-foreground">
                      {currency.symbol}
                    </span>
                  )}
                  <span className="annual-integer font-semibold">
                    {group}
                    {index < groups.length - 1 ? "," : ""}
                  </span>
                  {index === groups.length - 1 && (
                    <span className="annual-fraction text-[0.55em] font-normal tracking-[-0.03em] text-muted-foreground">
                      .{fraction}
                    </span>
                  )}
                </span>
              </Fragment>
            ))}
          </p>
        );
      }}
    />
  );
}
