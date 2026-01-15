import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import type { IExpense } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";
import { useExpenses } from "../../hooks/expenseHook";
import { useProjects } from "../../hooks/projectHook.ts";

type Props = { t: Dictionary };

export default function ExpensesPage({ t }: Props) {
  const navigate = useNavigate();
  const { data: expenses = [] } = useExpenses();
  const { data: projects = [], error, isLoading } = useProjects();

  const projectsById = useMemo(() => {
    const map: Record<string, (typeof projects)[number]> = {};
    for (const p of projects) map[p.internalId] = p;
    return map;
  }, [projects]);

  const [search, setSearch] = useState("");

  // per-project dropdown state: { [projectId]: boolean }
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  // helper: default open = true if not set yet
  const isProjectOpen = (projectId: string) => openProjects[projectId] ?? true;

  const toggleProjectOpen = (projectId: string) => {
    setOpenProjects((prev) => ({
      ...prev,
      [projectId]: !(prev[projectId] ?? true),
    }));
  };

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

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="main_container">
      <div className="project_container">
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
        <div className="expenses_header">
          <div className="col name">
            {t.expensesPage.sections.projects} ({projectsCount})
          </div>
        </div>

        <div className="projects_container">
          {projectGroupEntries.length === 0 ? (
            // case empty
            <div className="project_row_expenses">
              <div className="cell name">-</div>
            </div>
          ) : (
            projectGroupEntries.map(([projectId, list]) => {
              // totals per currency
              const totalsByCurrency = list.reduce<Record<string, number>>(
                (acc, e) => {
                  const cur = (e.currency ?? "").trim() || "—";
                  const amt = Number(e.amount) || 0;
                  acc[cur] = (acc[cur] ?? 0) + amt;
                  return acc;
                },
                {}
              );

              const totalsText = Object.entries(totalsByCurrency)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([cur, sum]) => `${formatAmount(sum)} ${cur}`)
                .join("  |  ");

              // creates the projects title

              const title =
                projectId === "__multiple__"
                  ? t.expensesPage.projectGroup.multiple
                  : (() => {
                      const p = projectsById[projectId];
                      if (!p)
                        return `${t.expensesPage.projectGroup.projectPrefix} ${projectId}`;

                      const name =
                        p.name ??
                        `${t.expensesPage.projectGroup.projectPrefix} ${projectId}`;
                      const address = p.customerAddress ?? "-";

                      return `${name} | ${address}`;
                    })();
              const open = isProjectOpen(projectId);
              //   const chevron = open ? "▾" : "▸";

              return (
                <div key={projectId} className="expenses_section">
                  {/* Project header (click to open/close) */}
                  <div
                    className="project_row_expenses"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleProjectOpen(projectId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        toggleProjectOpen(projectId);
                    }}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    aria-expanded={open}
                  >
                    <div
                      className="cell name"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {open ? (
                        <ChevronDown size={16} strokeWidth={2.5} />
                      ) : (
                        <ChevronLeft size={16} strokeWidth={2.5} />
                      )}
                      {title}
                    </div>
                  </div>

                  {/* Expenses under this project */}
                  {open && (
                    <>
                      {/* columns labels */}
                      <div className="expenses_header">
                        <div className="col status">
                          {t.expensesPage.columns.amount}
                        </div>
                        <div className="col customer">
                          {t.expensesPage.columns.description}
                        </div>
                        <div className="col address">
                          {t.expensesPage.columns.date}
                        </div>
                      </div>
                      {/* expenses list */}
                      {list.map((expense) => (
                        <div
                          className="project_row expense_row"
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
                          <div className="cell description">
                            {expense.description ?? "-"}
                          </div>
                          <div className="cell date">
                            {formatDate(expense.expenseDate as Date)}
                          </div>
                        </div>
                      ))}
                      {/* subtotal row */}
                      <div className="total-amount-container">
                        <div className="total_title">
                          {t.expensesPage.totalLabel}
                        </div>
                        <div
                          style={{ cursor: "default", paddingTop: "10px" }}
                          onClick={(e) => e.stopPropagation()}
                          role="presentation"
                        >
                          <div className="cell name totalText">
                            {totalsText}
                          </div>
                          <div className="cell date" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* =========================
            SECTION: Other
           ========================= */}
        <div className="expenses_header" style={{ marginTop: 12 }}>
          <div className="col name">
            {t.expensesPage.sections.other} ({otherExpenses.length})
          </div>
        </div>
        <div className="expenses_header" style={{ marginTop: 12 }}>
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
