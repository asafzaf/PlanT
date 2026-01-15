import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { IExpense, IExpenseCreateDTO, IProject } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";

import { useProjects } from "../../hooks/projectHook";
import { useCreateExpense } from "../../hooks/expenseHook";

type Props = { t: Dictionary };

type FormState = {
  amount: string;
  currency: string;
  description: string;
  expenseDate: string; // input datetime-local => string
  category: IExpense["category"] | "";

  // association
  association: "project" | "other";
  projectId: string; // internalId of project when association === "project"
};

type TouchedState = Partial<Record<keyof FormState, boolean>>;

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

export default function CreateExpense({ t }: Props) {
  const navigate = useNavigate();
  const createMutation = useCreateExpense();
  const { data: projects = [], isLoading, error } = useProjects();

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const [form, setForm] = useState<FormState>({
    amount: "",
    currency: "USD",
    description: "",
    expenseDate: today,
    category: "other",
    association: "project",
    projectId: "",
  });

  const [touched, setTouched] = useState<TouchedState>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredKeys: (keyof FormState)[] = [
    "amount",
    "currency",
    "description",
    "expenseDate",
    "category",
    "association",
    // projectId is conditionally required when association === "project"
  ];

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const isRequired = (key: keyof FormState) => requiredKeys.includes(key);

  const isFieldInvalid = (key: keyof FormState) => {
    const showError = submitted || touched[key];
    if (!showError) return false;

    if (key === "projectId") {
      if (form.association !== "project") return false;
      return form.projectId.trim() === "";
    }

    if (!isRequired(key)) return false;

    const value = form[key];
    if (typeof value === "string") return value.trim() === "";
    return false;
  };

  const canCreate = useMemo(() => {
    const amountOk =
      form.amount.trim() !== "" && !Number.isNaN(Number(form.amount));

    const baseOk =
      amountOk &&
      form.currency.trim() !== "" &&
      form.description.trim() !== "" &&
      form.expenseDate.trim() !== "" &&
      form.category !== "";

    const projectOk =
      form.association === "other" ? true : form.projectId.trim() !== "";

    return baseOk && projectOk;
  }, [form]);

  const getAuthUserId = (): string | undefined => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return undefined;

    try {
      const parsed = JSON.parse(authUser) as { _id?: string };
      return parsed._id;
    } catch {
      return undefined;
    }
  };

  const onSubmit = async () => {
    setSubmitted(true);
    if (!canCreate) return;

    const ownerId = getAuthUserId();
    if (!ownerId) throw new Error("User not authenticated");

    const amountNum = Number(form.amount);

    const payload: IExpenseCreateDTO = {
      amount: amountNum,
      currency: form.currency,
      userId: ownerId,
      description: form.description,
      expenseDate: new Date(form.expenseDate),
      category: form.category as IExpense["category"],
      projectAllocations:
        form.association === "project"
          ? [
              {
                projectId: form.projectId,
                percentage: 100,
                amount: amountNum,
              },
            ]
          : [],
    };

    const created = await createMutation.mutateAsync(payload);
    console.log("Created expense:", created);
    navigate("/expenses");
  };

  const requiredMsg = t.common?.required ?? "Required";

  if (isLoading) return <div>Loading projects...</div>;
  if (error)
    return <div>Error loading projects: {(error as Error).message}</div>;

  return (
    <div className="main_container">
      <div className="project_details_container">
        <div className="details_topbar">
          <div className="details_title">{t.expensesPage.newExpense}</div>
        </div>

        <div className="details_form">
          {/* Association: Project / Other */}
          <div className="form_row">
            <label>
              {t.expensesPage.form.association} <span className="req">*</span>
            </label>
            <select
              value={form.association}
              onChange={(e) => {
                const v = e.target.value as FormState["association"];
                onChange("association", v);
                // if switched to other, clear projectId
                if (v === "other") onChange("projectId", "");
              }}
              onBlur={() => markTouched("association")}
              className={
                isFieldInvalid("association") ? "input_invalid" : undefined
              }
            >
              <option value="project">{t.expensesPage.sections.project}</option>
              <option value="other">{t.expensesPage.sections.other}</option>
            </select>
          </div>

          {/* Project select (only when association === project) */}
          {form.association === "project" ? (
            <div className="form_row">
              <label>
                {t.expensesPage.form.project} <span className="req">*</span>
              </label>
              <select
                value={form.projectId}
                onChange={(e) => onChange("projectId", e.target.value)}
                onBlur={() => markTouched("projectId")}
                className={
                  isFieldInvalid("projectId") ? "input_invalid" : undefined
                }
              >
                <option value="">{t.expensesPage.form.selectProject}</option>
                {projects.map((p: IProject) => {
                  return (
                    <option key={p.internalId} value={p.internalId}>
                      {p.name} | {p.customerAddress} | {p.customerName}
                    </option>
                  );
                })}
              </select>

              {isFieldInvalid("projectId") ? (
                <div className="field_error">{requiredMsg}</div>
              ) : null}
            </div>
          ) : null}

          {/* Amount (required) */}
          <div className="form_row">
            <label>
              {t.expensesPage.columns.amount} <span className="req">*</span>
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              onBlur={() => markTouched("amount")}
              className={isFieldInvalid("amount") ? "input_invalid" : undefined}
              placeholder="0"
            />
            {isFieldInvalid("amount") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Currency (required) */}
          <div className="form_row">
            <label>
              {t.common?.currency ?? "Currency"} <span className="req">*</span>
            </label>
            <select
              value={form.currency}
              onChange={(e) => onChange("currency", e.target.value)}
              onBlur={() => markTouched("currency")}
              className={
                isFieldInvalid("currency") ? "input_invalid" : undefined
              }
            >
              <option value="ILS">ILS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {isFieldInvalid("currency") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Category (required) */}
          <div className="form_row">
            <label>
              {t.expensesPage.form.category} <span className="req">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                onChange("category", e.target.value as FormState["category"])
              }
              onBlur={() => markTouched("category")}
              className={
                isFieldInvalid("category") ? "input_invalid" : undefined
              }
            >
              <option value="">{t.expensesPage.form.selectCategory}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.expensesPage.categories[c]}
                </option>
              ))}
            </select>

            {isFieldInvalid("category") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Expense Date (required) */}
          <div className="form_row">
            <label>
              {t.expensesPage.columns.date} <span className="req">*</span>
            </label>
            <input
              type="date"
              value={form.expenseDate}
              onChange={(e) => onChange("expenseDate", e.target.value)}
              onBlur={() => markTouched("expenseDate")}
              className={
                isFieldInvalid("expenseDate") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("expenseDate") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Description (required) */}
          <div className="form_row full">
            <label>
              {t.expensesPage.columns.description}{" "}
              <span className="req">*</span>
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              onBlur={() => markTouched("description")}
              className={
                isFieldInvalid("description") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("description") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {createMutation.error ? (
            <div className="form_error">{createMutation.error.message}</div>
          ) : null}
        </div>

        <div className="details_bottombar">
          <button className="btn" onClick={() => navigate("/expenses")}>
            ← {t.common?.back ?? "Back"}
          </button>

          <button
            className="btn primary"
            onClick={onSubmit}
            disabled={!canCreate || createMutation.isPending}
          >
            {createMutation.isPending
              ? t.common?.saving ?? "Saving..."
              : t.common?.create ?? "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
