import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";

const currencyItems = Object.values(CurrencyCode).map((code) => ({
  label: code,
  value: code,
  icon: CURRENCIES[code].icon,
}));

export function PageHeader({
  currencyCode,
  onCurrencyChange,
}: {
  currencyCode: CurrencyCode;
  onCurrencyChange: (value: CurrencyCode) => void;
}) {
  const CurrencyIcon = CURRENCIES[currencyCode].icon;

  return (
    <section
      className="intro flex items-center justify-between gap-4 pt-8 pb-6 min-[701px]:gap-6 min-[701px]:pt-12 min-[701px]:pb-8"
      aria-labelledby="page-heading"
    >
      <h1
        id="page-heading"
        className="m-0 min-w-0 text-[22px] leading-[1.3] font-[550] tracking-[-0.6px] min-[701px]:text-[clamp(24px,2.6vw,34px)] min-[701px]:tracking-[-1px]"
      >
        See what your <span className="heading-accent text-pop">money</span>{" "}
        looks like over <span className="heading-accent text-pop">time</span>.
      </h1>
      <Select
        items={currencyItems}
        value={currencyCode}
        onValueChange={(value) => {
          if (value !== null) onCurrencyChange(value);
        }}
      >
        <SelectTrigger
          className="currency-select h-10.5! w-23 shrink-0 cursor-pointer bg-card px-2 dark:bg-card dark:hover:bg-card"
          aria-label="Currency"
        >
          <SelectValue>
            <CurrencyIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            {currencyCode}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="min-w-28"
          align="end"
          alignItemWithTrigger={false}
        >
          {currencyItems.map(({ label, value, icon: Icon }) => (
            <SelectItem
              key={value}
              value={value}
              className="currency-option min-h-10 cursor-pointer pl-3"
            >
              <Icon
                className="size-4 self-center text-muted-foreground"
                aria-hidden="true"
              />
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
