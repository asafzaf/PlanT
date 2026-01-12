import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import type { IExpense } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";

import { useExpenses } from "../../hooks/expenseHook";

type Props = { t: Dictionary };

const CATEGORIES: Array<IExpense["category"]> = [
  "software",
  "hardware",
  "contractor",
  "marketing",
  "travel",
  "office",
  "utilities",
  "general",
  "other",
];

const ALLOCATION_TYPES: Array<IExpense["allocationType"]> = [
  "general",
  "single",
  "multiple",
];

export default function ExpensesPage({ t }: Props) {
  const navigate = useNavigate();

  // same vibe as projects page: fetch -> filter -> render
  const { data: expenses = [] } = useExpenses();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<IExpense["category"] | "">("");
  const [allocationType, setAllocationType] = useState<
    IExpense["allocationType"] | ""
  >("");

  const filteredExpenses = useMemo(() => {
    const s = search.trim().toLowerCase();

    return expenses.filter((e) => {
      if (s && !(e.description ?? "").toLowerCase().includes(s)) return false;
      if (category && e.category !== category) return false;
      if (allocationType && e.allocationType !== allocationType) return false;
      return true;
    });
  }, [expenses, search, category, allocationType]);

  const formatAmount = (amount: number) => {
    const n = Number(amount);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString();
  };

  const allocationLabel = (e: IExpense) => {
    const alloc = e.projectAllocations ?? [];
    if (!alloc.length) return t.expensesPage.allocation.general;
    if (alloc.length === 1) return alloc[0].projectId; // later: map id -> project name
    return `${t.expensesPage.allocation.multiple} (${alloc.length})`;
  };

  return (
    <div className="main_container">
      <div className="project_container">
        {/* Filters */}
        <div className="projects_toolbar">
          <input
            className="projects_search"
            placeholder={t.expensesPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="projects_select"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as IExpense["category"] | "")
            }
          >
            <option value="">{t.expensesPage.allCategories}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.expensesPage.categories[c]}
              </option>
            ))}
          </select>

          <select
            className="projects_select"
            value={allocationType}
            onChange={(e) =>
              setAllocationType(
                e.target.value as IExpense["allocationType"] | ""
              )
            }
          >
            <option value="">{t.expensesPage.allAllocationTypes}</option>
            {ALLOCATION_TYPES.map((a) => (
              <option key={a} value={a}>
                {t.expensesPage.allocationTypes[a]}
              </option>
            ))}
          </select>

          <button
            className="projects_clear"
            onClick={() => {
              setSearch("");
              setCategory("");
              setAllocationType("");
            }}
          >
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

        {/* Header titles (reuse same classes) */}
        <div className="projects_header">
          <div className="col name">{t.expensesPage.columns.description}</div>
          <div className="col status">{t.expensesPage.columns.amount}</div>
          <div className="col customer">{t.expensesPage.columns.category}</div>
          <div className="col address">{t.expensesPage.columns.allocation}</div>
        </div>

        {/* Rows */}
        <div className="projects_container">
          {filteredExpenses.map((expense) => (
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
              <div className="cell name">{expense.description ?? "-"}</div>

              <div className="cell status">
                {formatAmount(expense.amount)} {expense.currency ?? ""}
              </div>

              <div className="cell customer">
                {expense.category
                  ? t.expensesPage.categories[expense.category]
                  : "-"}
              </div>

              <div className="cell address">{allocationLabel(expense)}</div>

              {/* Second line (like project.description) */}
              <div className="row_details">
                {t.expensesPage.columns.deductible}:{" "}
                {expense.isDeductible
                  ? t.expensesPage.deductible.yes
                  : t.expensesPage.deductible.no}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
