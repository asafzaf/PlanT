import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

import type { Dictionary } from "../../i18n/i18n";
import type { IIncome } from "@shared/types";

import {
  useIncomeByInternalId,
  useUpdateIncome,
  useDeleteIncome,
} from "../../hooks/incomeHook";

type Props = { t: Dictionary };

type FormState = {
  amount: string;
  currency: string;
  description: string;
  receivedDate: string; // "YYYY-MM-DD"
  category: IIncome["category"] | "";
};

export default function IncomeDetails({ t }: Props) {
  const navigate = useNavigate();
  const { internalId } = useParams<{ internalId: string }>();

  const deleteMutation = useDeleteIncome();
  const updateMutation = useUpdateIncome();

  const {
    data: income,
    isLoading,
    error,
    refetch,
  } = useIncomeByInternalId(internalId);

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

  const categories = useMemo(() => {
    const map = t.incomesPage?.categories;
    if (!map) return [] as IIncome["category"][];
    return Object.keys(map) as IIncome["category"][];
  }, [t]);

  // ---- mapping ----
  const toForm = (e: IIncome): FormState => ({
    amount: String(e.amount ?? ""),
    currency: e.currency ?? "LSD",
    description: e.description ?? "",
    receivedDate: e.receivedDate ? toDateInputValue(e.receivedDate) : "",
    category: e.category ?? "",
  });

  const toUpdatedIncome = (e: IIncome, f: FormState): IIncome => ({
    ...e,
    amount: Number(f.amount),
    currency: f.currency,
    description: f.description,
    receivedDate: dateInputToDate(f.receivedDate),
    category: f.category as IIncome["category"], // you may keep string if your IIncome.category is string
  });

  // ---- state/flags ----
  const isDirty = useMemo(() => {
    if (!income || !form) return false;

    const original = {
      amount: String(income.amount ?? ""),
      currency: income.currency ?? "LSD",
      description: income.description ?? "",
      receivedDate: income.receivedDate
        ? (() => {
            const d = new Date(income.receivedDate);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          })()
        : "",
      category: income.category ?? "",
    };

    return JSON.stringify(original) !== JSON.stringify(form);
  }, [income, form]);
  const canSave = useMemo(() => {
    if (!form) return false;

    const amountOk =
      form.amount.trim() !== "" && !Number.isNaN(Number(form.amount));

    return (
      amountOk &&
      form.currency.trim() !== "" &&
      form.description.trim() !== "" &&
      form.receivedDate.trim() !== "" &&
      form.category.trim() !== ""
    );
  }, [form]);

  const startEdit = () => {
    if (!income) return;
    setForm(toForm(income));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm(null);
  };

  const saveEdit = async () => {
    if (!income || !form) return;

    try {
      const updated = toUpdatedIncome(income, form);
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
      t.incomesDetails?.deleteConfirm ??
        "Are you sure you want to delete this income?",
    );
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(internalId);
      navigate("/incomes");
    } catch {
      // shown via deleteMutation.error
    }
  };

  // ---- loading/error states ----
  if (isLoading) return <div>Loading income...</div>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Failed to load income</h2>
        <p>{(error as Error).message}</p>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => refetch()}>
            Try again
          </button>
          <button className="btn" onClick={() => navigate("/incomes")}>
            Back to incomes
          </button>
        </div>
      </div>
    );
  }

  if (!income) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Income not found</h2>
        <button className="btn" onClick={() => navigate("/incomes")}>
          Back to incomes
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
          <div className="details_title">
            {t.incomesDetails?.description ?? "-"}
          </div>
          <div className="details_subtitle">
            {t.incomesDetails?.incomeIdLabel ?? "Income ID"}:{" "}
            {income.internalId}
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
                ? (t.common?.saving ?? "Saving...")
                : (t.common?.save ?? "Save")}
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
              {t.incomesDetails?.amount ?? "Amount"}
            </div>

            {!isEditing ? (
              <div className="details_value">
                {formatMoney(income.amount, income.currency)}
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
              {t.incomesDetails?.currency ?? t.common?.currency ?? "Currency"}
            </div>

            {!isEditing ? (
              <div className="details_value">{income.currency ?? "-"}</div>
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
              {t.incomesDetails?.category ?? "Category"}
            </div>

            {!isEditing ? (
              <div className="details_value">{income.category ?? "-"}</div>
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
                      : s,
                  )
                }
              >
                <option value="">
                  {t.incomesDetails?.selectCategory ?? "Select category"}
                </option>

                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t.incomesPage.categories[c]}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date */}
          <div className="details_item">
            <div className="details_label">
              {t.incomesDetails?.date ?? "Date"}
            </div>

            {!isEditing ? (
              <div className="details_value">
                {new Date(income.receivedDate).toLocaleDateString()}
              </div>
            ) : (
              <input
                className="input"
                type="date"
                value={form?.receivedDate ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, receivedDate: e.target.value } : s,
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="details_section">
          <div className="details_label">
            {t.incomesDetails?.description ?? "Description"}
          </div>

          {!isEditing ? (
            <div className="details_value">{income.description ?? "-"}</div>
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

        {/* Delete error */}
        {deleteMutation.error ? (
          <div style={{ padding: 12, color: "crimson" }}>
            {deleteMutation.error.message}
          </div>
        ) : null}
      </div>

      <div className="details_bottombar">
        <button className="btn" onClick={() => navigate("/incomes")}>
          ← {t.common?.back ?? "Back"}
        </button>
      </div>
    </div>
  );
}
