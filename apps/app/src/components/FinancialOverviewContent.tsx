export type FinancialOverviewProps = {
  finance: {
    income: number;
    incomeTitle: string;
    expensesTitle: string;
    profitTitle: string;
    profitProgressLabel: string;
    expenses: number;
    profit: number;
    profitProgress: number; // 0-1
  };
};

export function FinancialOverviewContent({ finance }: FinancialOverviewProps) {
  const progressPercent = Math.round(finance.profitProgress * 100);

  return (
    <div className="financial_overview" dir="rtl">
      {/* income */}
      <div className="financial_row">
        <span className="financial_label">{finance.incomeTitle}</span>
        <span className="financial_amount positive">
          ₪{finance.income.toLocaleString()}
        </span>
      </div>
      {/* expenses */}
      <div className="financial_row">
        <span className="financial_label">{finance.expensesTitle}</span>
        <span className="financial_amount negative">
          ₪{finance.expenses.toLocaleString()}
        </span>
      </div>
      <hr className="financial_divider" />
      {/* profit */}
      <div className="financial_row profit_row">
        <span className="financial_label profit_title">
          {finance.profitTitle}
        </span>
        <span className="financial_amount positive">
          ₪{finance.profit.toLocaleString()}
        </span>
      </div>
      {/* progress */}
      <div className="financial_progress_card">
        <div className="financial_progress_top">
          <span className="financial_progress_label">
            {finance.profitProgressLabel}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="financial_progress_bar">
          <div
            className="financial_progress_bar_fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
