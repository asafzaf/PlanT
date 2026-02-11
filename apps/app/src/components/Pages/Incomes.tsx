import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ChevronDown, ChevronLeft } from "lucide-react";

import type { Dictionary } from "../../i18n/i18n";
import type { IIncome } from "@shared/types";

import { useIncomes } from "../../hooks/incomeHook";
import { useProjects } from "../../hooks/projectHook";

type Props = { t: Dictionary };

const INCOME_CATEGORIES = [
  "payment",
  "deposit",
  "bonus",
  "refund",
  "other",
] as const;
type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

function isIncomeCategory(value: string): value is IncomeCategory {
  return (INCOME_CATEGORIES as readonly string[]).includes(value);
}

type UnknownRec = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRec {
  return typeof v === "object" && v !== null;
}
function getStringField(obj: UnknownRec, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value: unknown) {
  const d = toDate(value);
  if (!d) return "-";
  return d.toLocaleDateString();
}

function formatAmount(amount: number) {
  const n = Number(amount);
  if (Number.isNaN(n)) return "-";
  return n.toLocaleString();
}

export default function IncomesPage({ t }: Props) {
  const navigate = useNavigate();

  const { data: incomesData } = useIncomes();
  const { data: projectsData = [], error, isLoading } = useProjects();

  // stable refs to satisfy exhaustive-deps and prevent re-renders
  const incomes = useMemo<IIncome[]>(() => incomesData ?? [], [incomesData]);
  const projects = useMemo<unknown[]>(() => projectsData ?? [], [projectsData]);

  // projectId -> projectName mapping (supports internalId/id/_id)
  const projectNameByAnyId = useMemo(() => {
    const map = new Map<string, string>();

    for (const p of projects) {
      if (!isRecord(p)) continue;

      const name = getStringField(p, "name");
      if (!name) continue;

      const internalId = getStringField(p, "internalId");
      const id = getStringField(p, "id");
      const mongoId = getStringField(p, "_id");

      if (internalId) map.set(internalId, name);
      if (id) map.set(id, name);
      if (mongoId) map.set(mongoId, name);
    }

    return map;
  }, [projects]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"" | IncomeCategory>("");
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  // helper: default open = true if not set yet
  const isProjectOpen = (projectId: string) => openProjects[projectId] ?? true;

  const toggleProjectOpen = (projectId: string) => {
    setOpenProjects((prev) => ({
      ...prev,
      [projectId]: !(prev[projectId] ?? true),
    }));
  };

  const filteredIncomes = useMemo(() => {
    const s = search.trim().toLowerCase();

    return incomes.filter((inc) => {
      if (category && inc.category !== category) return false;

      if (!s) return true;

      const projectName = projectNameByAnyId.get(String(inc.projectId)) ?? "";
      const hay = [
        inc.description ?? "",
        inc.currency ?? "",
        inc.category ?? "",
        inc.invoiceNumber ?? "",
        inc.transactionId ?? "",
        projectName,
        String(inc.amount ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(s);
    });
  }, [incomes, search, category, projectNameByAnyId]);

  // Group by projectId (no "other" in Income interface, so we treat missing/empty projectId as "unknown")
  const { projectGroups } = useMemo(() => {
    const groups: Record<string, IIncome[]> = {};

    for (const inc of filteredIncomes) {
      const pid = (inc.projectId ?? "").trim() || "unknown";
      (groups[pid] ??= []).push(inc);
    }

    return { projectGroups: groups };
  }, [filteredIncomes]);

  const projectGroupEntries = useMemo(() => {
    const entries = Object.entries(projectGroups);
    return entries.sort(([a], [b]) => a.localeCompare(b));
  }, [projectGroups]);

  const incomesCount = useMemo(() => {
    return projectGroupEntries.reduce((sum, [, arr]) => sum + arr.length, 0);
  }, [projectGroupEntries]);

  // totals text helper (per currency)
  const totalsTextForList = (list: IIncome[]) => {
    const totalsByCurrency = list.reduce<Record<string, number>>((acc, inc) => {
      const cur = (inc.currency ?? "").trim() || "—";
      const amt = Number(inc.amount) || 0;
      acc[cur] = (acc[cur] ?? 0) + amt;
      return acc;
    }, {});

    return Object.entries(totalsByCurrency)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cur, sum]) => `${formatAmount(sum)} ${cur}`)
      .join("  |  ");
  };

  const categoryLabel = (c: IIncome["category"]) => {
    switch (c) {
      case "payment":
        return t.incomesPage.categories.payment;
      case "deposit":
        return t.incomesPage.categories.deposit;
      case "bonus":
        return t.incomesPage.categories.bonus;
      case "refund":
        return t.incomesPage.categories.refund;
      default:
        return t.incomesPage.categories.other;
    }
  };

  if (isLoading) return <div>{t.incomesPage.loadingProjects}</div>;
  if (error)
    return (
      <div>{t.incomesPage.errorProjects.replace("{msg}", error.message)}</div>
    );

  return (
    <div className="main_container">
      <div className="project_container">
        {/* =========================
            TOOLBAR 
           ========================= */}
        <div className="projects_toolbar">
          <input
            className="projects_search"
            placeholder={t.incomesPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="projects_clear" onClick={() => setSearch("")}>
            {t.incomesPage.clear}
          </button>

          <select
            className="projects_search"
            value={category}
            onChange={(e) => {
              const v = e.target.value;
              setCategory(v === "" ? "" : isIncomeCategory(v) ? v : "");
            }}
            aria-label={t.incomesPage.categoryLabel}
            title={t.incomesPage.categoryLabel}
          >
            <option value="">{t.incomesPage.categoryAll}</option>
            <option value="payment">{t.incomesPage.categories.payment}</option>
            <option value="deposit">{t.incomesPage.categories.deposit}</option>
            <option value="bonus">{t.incomesPage.categories.bonus}</option>
            <option value="refund">{t.incomesPage.categories.refund}</option>
            <option value="other">{t.incomesPage.categories.other}</option>
          </select>

          <button
            className="btn icon-btn"
            onClick={() => navigate("/incomes/new")}
            aria-label={t.incomesPage.newIncome}
            title={t.incomesPage.newIncome}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <div className="projects_count">
            {filteredIncomes.length} {t.incomesPage.incomes}
          </div>
        </div>

        {/* =========================
            SECTION: Projects
           ========================= */}
        <div className="expenses_header">
          <div className="col name">
            {t.incomesPage.sections.projects} ({incomesCount})
          </div>
        </div>

        <div className="projects_container">
          {projectGroupEntries.length === 0 ? (
            <div className="project_row_expenses">
              <div className="cell name">-</div>
            </div>
          ) : (
            projectGroupEntries.map(([projectId, list]) => {
              const totalsText = totalsTextForList(list);

              const title =
                projectId === "unknown"
                  ? t.incomesPage.projectGroup.unknown
                  : (projectNameByAnyId.get(String(projectId)) ??
                    `${t.incomesPage.projectGroup.projectPrefix} ${projectId}`);

              const open = isProjectOpen(projectId);

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

                  {/* Incomes under this project */}
                  {open && (
                    <>
                      {/* columns labels */}
                      <div className="expenses_header">
                        <div className="col status">
                          {t.incomesPage.columns.amount}
                        </div>
                        <div className="col customer">
                          {t.incomesPage.columns.description}
                        </div>
                        <div className="col address">
                          {t.incomesPage.columns.date}
                        </div>
                      </div>

                      {/* incomes list */}
                      {list.map((inc) => (
                        <div
                          className="project_row expense_row"
                          key={inc.internalId}
                          role="button"
                          tabIndex={0}
                          onClick={() => navigate(`/incomes/${inc.internalId}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              navigate(`/incomes/${inc.internalId}`);
                          }}
                        >
                          <div className="cell name">
                            {formatAmount(inc.amount)} {inc.currency ?? ""}
                          </div>

                          <div className="cell description">
                            {(inc.description?.trim() ||
                              t.incomesPage.noDescription) +
                              " • " +
                              categoryLabel(inc.category)}
                            {inc.invoiceNumber
                              ? ` • ${t.incomesPage.invoiceShort} ${inc.invoiceNumber}`
                              : ""}
                            {inc.transactionId
                              ? ` • ${t.incomesPage.txShort} ${inc.transactionId}`
                              : ""}
                            {inc.isTaxable
                              ? inc.taxAmount != null
                                ? ` • ${t.incomesPage.taxable}: ${formatAmount(inc.taxAmount)}`
                                : ` • ${t.incomesPage.taxable}`
                              : ` • ${t.incomesPage.notTaxable}`}
                          </div>

                          <div className="cell date">
                            {formatDate(inc.receivedDate)}
                          </div>
                        </div>
                      ))}

                      {/* subtotal row */}
                      <div className="total-amount-container">
                        <div className="total_title">
                          {t.incomesPage.totalLabel}
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
      </div>
    </div>
  );
}
