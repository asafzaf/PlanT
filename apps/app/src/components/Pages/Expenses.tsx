import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import type { IExpense } from "@shared/types"; // adjust if needed
import type { Dictionary } from "../../i18n/i18n";
import { useExpenses } from "../../hooks/expenseHook";

type Props = { t: Dictionary };

export default function ExpensesPage({ t }: Props) {
  const navigate = useNavigate();
  const { data: expenses = [] } = useExpenses();

  const [search, setSearch] = useState("");

  // simple format (you can later replace with i18n locale formatting)
  const formatDate = (value: Date) => {
    if (!value) return "-";
    const d = new Date(value as Date);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    const n = Number(amount);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString();
  };

  const filteredExpenses = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return expenses;

    return expenses.filter((e) =>
      (e.description ?? "").toLowerCase().includes(s)
    );
  }, [expenses, search]);

  // Split into: project-associated vs other
  const { projectGroups, otherExpenses } = useMemo(() => {
    const groups: Record<string, IExpense[]> = {};
    const other: IExpense[] = [];

    for (const e of filteredExpenses) {
      const allocs = e.projectAllocations ?? [];

      // "Other" = no project association
      if (allocs.length === 0) {
        other.push(e);
        continue;
      }

      // Group by projectId(s)
      // - if single allocation => group by that projectId
      // - if multiple allocations => place under "multiple"
      if (allocs.length === 1) {
        const pid = allocs[0].projectId || "unknown";
        (groups[pid] ??= []).push(e);
      } else {
        const pid = "__multiple__";
        (groups[pid] ??= []).push(e);
      }
    }

    return { projectGroups: groups, otherExpenses: other };
  }, [filteredExpenses]);

  const projectGroupEntries = useMemo(() => {
    const entries = Object.entries(projectGroups);

    // Sort so "multiple" goes last, and projectIds alphabetically
    return entries.sort(([a], [b]) => {
      if (a === "__multiple__") return 1;
      if (b === "__multiple__") return -1;
      return a.localeCompare(b);
    });
  }, [projectGroups]);

  const projectsCount = useMemo(() => {
    return projectGroupEntries.reduce((sum, [, arr]) => sum + arr.length, 0);
  }, [projectGroupEntries]);

  return (
    <div className="main_container">
      <div className="project_container">
        {/* Filters (same style as projects page) */}
        <div className="projects_toolbar">
          <input
            className="projects_search"
            placeholder={t.expensesPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="projects_clear" onClick={() => setSearch("")}>
            {t.expensesPage.clear}
          </button>

          <button
            className="btn icon-btn"
            onClick={() => navigate("/expenses/new")}
            aria-label={t.expensesPage.newExpense}
            title={t.expensesPage.newExpense}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <div className="projects_count">
            {filteredExpenses.length} {t.expensesPage.expenses}
          </div>
        </div>

        {/* =========================
            SECTION: Projects
           ========================= */}
        <div className="projects_header">
          <div className="col name">
            {t.expensesPage.sections.projects} ({projectsCount})
          </div>
          <div className="col status">{t.expensesPage.columns.amount}</div>
          <div className="col customer">
            {t.expensesPage.columns.description}
          </div>
          <div className="col address">{t.expensesPage.columns.date}</div>
        </div>

        <div className="projects_container">
          {projectGroupEntries.length === 0 ? (
            <div className="project_row">
              <div className="cell name">-</div>
              <div className="cell status">-</div>
              <div className="cell customer">-</div>
              <div className="cell address">-</div>
              <div className="row_details">{t.expensesPage.empty.projects}</div>
            </div>
          ) : (
            projectGroupEntries.map(([projectId, list]) => {
              const title =
                projectId === "__multiple__"
                  ? t.expensesPage.projectGroup.multiple
                  : `${t.expensesPage.projectGroup.projectPrefix} ${projectId}`;

              return (
                <div key={projectId}>
                  {/* group title (uses row_details styling vibe) */}
                  <div className="project_row" style={{ cursor: "default" }}>
                    <div className="cell name">{title}</div>
                    <div className="cell status"> </div>
                    <div className="cell customer"> </div>
                    <div className="cell address"> </div>
                    <div className="row_details">
                      {list.length} {t.expensesPage.expenses}
                    </div>
                  </div>

                  {/* group rows */}
                  {list.map((expense) => (
                    <div
                      className="project_row"
                      key={expense.internalId}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate(`/expenses/${expense.internalId}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          navigate(`/expenses/${expense.internalId}`);
                      }}
                    >
                      <div className="cell name">
                        {formatAmount(expense.amount)}
                      </div>

                      {/* keep same class names, just repurpose columns */}
                      <div className="cell status">
                        {expense.description ?? "-"}
                      </div>
                      <div className="cell customer">
                        {formatDate(expense.expenseDate as Date)}
                      </div>
                      <div className="cell address"> </div>

                      {/* optional: show category/deductible on second line */}
                      {/* <div className="row_details">
                        {t.expensesPage.meta.category}: {expense.category ?? "-"} •
                        {t.expensesPage.meta.deductible}: {expense.isDeductible ? t.common.yes : t.common.no}
                      </div> */}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* =========================
            SECTION: Other
           ========================= */}
        <div className="projects_header" style={{ marginTop: 12 }}>
          <div className="col name">
            {t.expensesPage.sections.other} ({otherExpenses.length})
          </div>
          <div className="col status">{t.expensesPage.columns.amount}</div>
          <div className="col customer">
            {t.expensesPage.columns.description}
          </div>
          <div className="col address">{t.expensesPage.columns.date}</div>
        </div>

        <div className="projects_container">
          {otherExpenses.length === 0 ? (
            <div className="project_row">
              <div className="cell name">-</div>
              <div className="cell status">-</div>
              <div className="cell customer">-</div>
              <div className="cell address">-</div>
              <div className="row_details">{t.expensesPage.empty.other}</div>
            </div>
          ) : (
            otherExpenses.map((expense) => (
              <div
                className="project_row"
                key={expense.internalId}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/expenses/${expense.internalId}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate(`/expenses/${expense.internalId}`);
                }}
              >
                <div className="cell name">
                  {formatAmount(expense.amount)} {expense.currency ?? ""}
                </div>
                <div className="cell status">{expense.description ?? "-"}</div>
                <div className="cell customer">
                  {formatDate(expense.expenseDate as Date)}
                </div>
                <div className="cell address"> </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
