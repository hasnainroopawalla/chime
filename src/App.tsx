import * as React from "react";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/page-header";
import { CurrencyCode } from "@/lib/currency";
import { Footer } from "@/components/footer";
import { IncomePeriod, IncomePeriodUtils } from "@/lib/income-period";
import {
  DEFAULT_INCOME_AMOUNT,
  IncomeInputCard,
} from "@/components/income-input-card";
import { LiveEarningsCard } from "@/components/live-earnings-card";
import { IncomeRatesCard } from "@/components/income-rates-card";

function App() {
  const [currencyCode, setCurrencyCode] = React.useState(CurrencyCode.INR);

  const [income, setIncome] = React.useState(DEFAULT_INCOME_AMOUNT);
  const [incomePeriod, setIncomePeriod] = React.useState(IncomePeriod.Monthly);

  const incomePerSecond = React.useMemo(
    () => IncomePeriodUtils.getIncomePerSecond(income, incomePeriod),
    [income, incomePeriod],
  );

  return (
    <div className="app-shell mx-auto w-[calc(100%-28px)] max-w-300 min-[371px]:w-[calc(100%-40px)] min-[701px]:w-[calc(100%-56px)] min-[1001px]:w-[calc(100%-96px)]">
      <header className="site-header border-b border-border">
        <Navbar />
      </header>
      <main>
        <PageHeader
          currencyCode={currencyCode}
          onCurrencyChange={setCurrencyCode}
        />
        <div className="dashboard-grid grid grid-cols-1 gap-4 min-[701px]:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)] min-[1001px]:gap-5.5">
          <IncomeInputCard
            currencyCode={currencyCode}
            income={income}
            onIncomeChange={setIncome}
            incomePeriod={incomePeriod}
            onIncomePeriodChange={setIncomePeriod}
          />
          <LiveEarningsCard
            key={`${income}:${incomePeriod}`}
            incomePerSecond={incomePerSecond}
            currencyCode={currencyCode}
          />
          <IncomeRatesCard
            incomePerSecond={incomePerSecond}
            currencyCode={currencyCode}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
