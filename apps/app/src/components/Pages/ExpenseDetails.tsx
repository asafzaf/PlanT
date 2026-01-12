import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

import type { Dictionary } from "../../i18n/i18n";
import type { IExpense } from "@shared/types";

import {
  useExpenseByInternalId,
  useUpdateExpense,
  useDeleteExpense,
} from "../../hooks/expenseHook";

type Props = { t: Dictionary };

type FormState = {
  amount: string;
  currency: string;
  description: string;
  expenseDate: string; // "YYYY-MM-DD"
  category: IExpense["category"] | "";
};

export default function ExpenseDetails({ t }: Props) {
  const navigate = useNavigate();
  const { internalId } = useParams<{ internalId: string }>();

  const deleteMutation = useDeleteExpense();
  const updateMutation = useUpdateExpense();

  const {
    data: expense,
    isLoading,
    error,
    refetch,
  } = useExpenseByInternalId(internalId);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);

  // ---- helpers ----
  const toDateInputValue = (value: Date): string => {
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const dateInputToDate = (yyyyMmDd: string): Date =>
    new Date(`${yyyyMmDd}T00:00:00`);

  const formatMoney = (amount: number, currency: string) =>
    `${Number(amount).toLocaleString()} ${currency ?? ""}`;

  const associationLabel = (e: IExpense): string => {
    const allocs = e.projectAllocations ?? [];
    if (!allocs.length) return t.expensesDetails?.associationOther ?? "Other";
    if (allocs.length === 1)
      return `${t.expensesDetails?.associationProject ?? "Project"}: ${
        allocs[0].projectId
      }`;
    return (
      t.expensesDetails?.associationMultiple ??
      `Multiple projects (${allocs.length})`
    );
  };

  const categories = useMemo(() => {
    const map = t.expensesPage?.categories;
    if (!map) return [] as IExpense["category"][];

    return Object.keys(map) as IExpense["category"][];
  }, [t]);

  // ---- mapping ----
  const toForm = (e: IExpense): FormState => ({
    amount: String(e.amount ?? ""),
    currency: e.currency ?? "USD",
    description: e.description ?? "",
    expenseDate: e.expenseDate ? toDateInputValue(e.expenseDate) : "",
    category: e.category ?? "",
  });

  const toUpdatedExpense = (e: IExpense, f: FormState): IExpense => ({
    ...e,
    amount: Number(f.amount),
    currency: f.currency,
    description: f.description,
    expenseDate: dateInputToDate(f.expenseDate),
    category: f.category as IExpense["category"], // you may keep string if your IExpense.category is string
  });

  // ---- state/flags ----
  const isDirty = useMemo(() => {
    if (!expense || !form) return false;

    const original = {
      amount: String(expense.amount ?? ""),
      currency: expense.currency ?? "USD",
      description: expense.description ?? "",
      expenseDate: expense.expenseDate
        ? (() => {
            const d = new Date(expense.expenseDate);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          })()
        : "",
      category: expense.category ?? "",
    };

    return JSON.stringify(original) !== JSON.stringify(form);
  }, [expense, form]);

  const canSave = useMemo(() => {
    if (!form) return false;

    const amountOk =
      form.amount.trim() !== "" && !Number.isNaN(Number(form.amount));

    return (
      amountOk &&
      form.currency.trim() !== "" &&
      form.description.trim() !== "" &&
      form.expenseDate.trim() !== "" &&
      form.category.trim() !== ""
    );
  }, [form]);

  const startEdit = () => {
    if (!expense) return;
    setForm(toForm(expense));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm(null);
  };

  const saveEdit = async () => {
    if (!expense || !form) return;

    try {
      const updated = toUpdatedExpense(expense, form);
      await updateMutation.mutateAsync(updated); // ✅ matches your hook
      setIsEditing(false);
      setForm(null);
    } catch {
      // shown below
    }
  };

  const onDelete = async () => {
    if (!internalId) return;

    const confirmed = window.confirm(
      t.expensesDetails?.deleteConfirm ??
        "Are you sure you want to delete this expense?"
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(internalId);
      navigate("/expenses");
    } catch {
      // shown via deleteMutation.error
    }
  };

  // ---- loading/error states ----
  if (isLoading) return <div>Loading expense...</div>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Failed to load expense</h2>
        <p>{(error as Error).message}</p>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => refetch()}>
            Try again
          </button>
          <button className="btn" onClick={() => navigate("/expenses")}>
            Back to expenses
          </button>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Expense not found</h2>
        <button className="btn" onClick={() => navigate("/expenses")}>
          Back to expenses
        </button>
      </div>
    );
  }

  // ---- UI ----
  return (
    <div className="project_details_container">
      {/* Top bar */}
      <div className="details_topbar">
        <div style={{ flex: 1 }}>
          <div className="details_title">{expense.description ?? "-"}</div>
          <div className="details_subtitle">
            {t.expensesDetails?.expenseIdLabel ?? "Expense ID"}:{" "}
            {expense.internalId}
          </div>
        </div>

        {!isEditing ? (
          <button className="btn" onClick={startEdit}>
            {t.common?.edit ?? "Edit"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              onClick={cancelEdit}
              disabled={updateMutation.isPending}
            >
              {t.common?.cancel ?? "Cancel"}
            </button>
            <button
              className="btn"
              onClick={saveEdit}
              disabled={!isDirty || !canSave || updateMutation.isPending}
              title={!isDirty ? "No changes" : ""}
            >
              {updateMutation.isPending
                ? t.common?.saving ?? "Saving..."
                : t.common?.save ?? "Save"}
            </button>
          </div>
        )}

        {!isEditing && (
          <button
            className="trash-icon-btn danger"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
            title={t.common?.delete ?? "Delete"}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Save error */}
      {updateMutation.error ? (
        <div style={{ padding: 12, color: "crimson" }}>
          {updateMutation.error.message}
        </div>
      ) : null}

      {/* Main content */}
      <div className="details_card">
        <div className="details_grid">
          {/* Amount */}
          <div className="details_item">
            <div className="details_label">
              {t.expensesDetails?.amount ?? "Amount"}
            </div>

            {!isEditing ? (
              <div className="details_value">
                {formatMoney(expense.amount, expense.currency)}
              </div>
            ) : (
              <input
                className="input"
                type="number"
                value={form?.amount ?? ""}
                onChange={(e) =>
                  setForm((s) => (s ? { ...s, amount: e.target.value } : s))
                }
              />
            )}
          </div>

          {/* Currency */}
          <div className="details_item">
            <div className="details_label">
              {t.expensesDetails?.currency ?? t.common?.currency ?? "Currency"}
            </div>

            {!isEditing ? (
              <div className="details_value">{expense.currency ?? "-"}</div>
            ) : (
              <select
                className="input"
                value={form?.currency ?? "USD"}
                onChange={(e) =>
                  setForm((s) => (s ? { ...s, currency: e.target.value } : s))
                }
              >
                <option value="ILS">ILS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            )}
          </div>

          {/* Category */}
          <div className="details_item">
            <div className="details_label">
              {t.expensesDetails?.category ?? "Category"}
            </div>

            {!isEditing ? (
              <div className="details_value">{expense.category ?? "-"}</div>
            ) : (
              <select
                className="input"
                value={form?.category ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s
                      ? {
                          ...s,
                          category: e.target.value as FormState["category"],
                        }
                      : s
                  )
                }
              >
                <option value="">
                  {t.expensesDetails?.selectCategory ?? "Select category"}
                </option>

                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t.expensesPage.categories[c]}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date */}
          <div className="details_item">
            <div className="details_label">
              {t.expensesDetails?.date ?? "Date"}
            </div>

            {!isEditing ? (
              <div className="details_value">
                {new Date(expense.expenseDate).toLocaleDateString()}
              </div>
            ) : (
              <input
                className="input"
                type="date"
                value={form?.expenseDate ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, expenseDate: e.target.value } : s
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="details_section">
          <div className="details_label">
            {t.expensesDetails?.description ?? "Description"}
          </div>

          {!isEditing ? (
            <div className="details_value">{expense.description ?? "-"}</div>
          ) : (
            <textarea
              className="input"
              rows={4}
              value={form?.description ?? ""}
              onChange={(e) =>
                setForm((s) => (s ? { ...s, description: e.target.value } : s))
              }
            />
          )}
        </div>

        {/* Association (read-only, from expense itself) */}
        <div className="details_section">
          <div className="details_label">
            {t.expensesDetails?.association ?? "Association"}
          </div>
          <div className="details_value">{associationLabel(expense)}</div>
        </div>

        {/* Delete error */}
        {deleteMutation.error ? (
          <div style={{ padding: 12, color: "crimson" }}>
            {deleteMutation.error.message}
          </div>
        ) : null}
      </div>

      <div className="details_bottombar">
        <button className="btn" onClick={() => navigate("/expenses")}>
          ← {t.common?.back ?? "Back"}
        </button>
      </div>
    </div>
  );
}
