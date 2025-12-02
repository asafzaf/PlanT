export type FinancialOverviewProps = {
  income: number;
  expenses: number;
  profit: number;
  profitProgress: number; // 0-1
};

export function FinancialOverviewContent({
  income,
  expenses,
  profit,
  profitProgress,
}: FinancialOverviewProps) {
  const progressPercent = Math.round(profitProgress * 100);

  return (
    <div className="financial_overview" dir="rtl">
      {/* income */}
      <div className="financial_row">
        <span className="financial_label">הכנסות החודש</span>
        <span className="financial_amount positive">
          ₪{income.toLocaleString()}
        </span>
      </div>
      {/* expenses */}
      <div className="financial_row">
        <span className="financial_label">הוצאות החודש</span>
        <span className="financial_amount negative">
          ₪{expenses.toLocaleString()}
        </span>
      </div>
      <hr className="financial_divider" />
      {/* profit */}
      <div className="financial_row profit_row">
        <span className="financial_label profit_title">רווח החודש</span>
        <span className="financial_amount positive">
          ₪{profit.toLocaleString()}
        </span>
      </div>
      {/* progress */}
      <div className="financial_progress_card">
        <div className="financial_progress_top">
          <span className="financial_progress_label">התקדמות יעד חודשי</span>
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
