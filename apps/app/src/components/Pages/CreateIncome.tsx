import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IIncome, IIncomeCreateDTO, IProject } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";
import { useProjects } from "../../hooks/projectHook";
import { useCreateIncome } from "../../hooks/incomeHook";

type Props = { t: Dictionary };

type FormState = {
  amount: string;
  currency: string;
  description: string;
  receivedDate: string; // input datetime-local => string
  projectId: string; // internalId of project when association === "project"
  userId: string; // Who received the income (auto-filled from auth)
  association: "project" | "other";
  category: IIncome["category"] | "";
};

type TouchedState = Partial<Record<keyof FormState, boolean>>;

const CATEGORIES: Array<IIncome["category"]> = [
  "payment",
  "deposit",
  "bonus",
  "refund",
  "other",
];

export default function CreateIncome({ t }: Props) {
  const navigate = useNavigate();
  const createMutation = useCreateIncome();
  const { data: projects = [], isLoading, error } = useProjects();

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const [form, setForm] = useState<FormState>({
    amount: "",
    currency: "LSD",
    description: "",
    receivedDate: today,
    userId: "",
    projectId: "",
    association: "project",
    category: "other",
  });

  const [touched, setTouched] = useState<TouchedState>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredKeys: (keyof FormState)[] = [
    "amount",
    "currency",
    "description",
    "receivedDate",
    "association",
    "category",
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
      form.receivedDate.trim() !== "" &&
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

    const payload: IIncomeCreateDTO = {
      amount: amountNum,
      currency: form.currency,
      userId: ownerId,
      description: form.description,
      receivedDate: new Date(form.receivedDate),
      category: form.category as IIncome["category"],
      projectId: form.association === "project" ? form.projectId : undefined!,
    };

    const created = await createMutation.mutateAsync(payload);
    console.log("Created income:", created);
    navigate("/incomes");
  };

  const requiredMsg = t.common?.required ?? "Required";

  if (isLoading) return <div>Loading projects...</div>;
  if (error)
    return <div>Error loading projects: {(error as Error).message}</div>;

  return (
    <div className="main_container">
      <div className="project_details_container">
        <div className="details_topbar">
          <div className="details_title">{t.incomesPage.newIncome}</div>
        </div>

        <div className="details_form">
          {/* Association: Project / Other */}
          <div className="form_row">
            <label>
              {t.incomesPage.form.association} <span className="req">*</span>
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
              <option value="project">{t.incomesPage.sections.project}</option>
              <option value="other">{t.incomesPage.sections.other}</option>
            </select>
          </div>

          {/* Project select (only when association === project) */}
          {form.association === "project" ? (
            <div className="form_row">
              <label>
                {t.incomesPage.form.project} <span className="req">*</span>
              </label>
              <select
                value={form.projectId}
                onChange={(e) => onChange("projectId", e.target.value)}
                onBlur={() => markTouched("projectId")}
                className={
                  isFieldInvalid("projectId") ? "input_invalid" : undefined
                }
              >
                <option value="">{t.incomesPage.form.selectProject}</option>
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
              {t.incomesPage.columns.amount} <span className="req">*</span>
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
              {t.incomesPage.form.category} <span className="req">*</span>
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
              <option value="">{t.incomesPage.form.selectCategory}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.incomesPage.categories[c]}
                </option>
              ))}
            </select>

            {isFieldInvalid("category") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Received Date (required) */}
          <div className="form_row">
            <label>
              {t.incomesPage.columns.date} <span className="req">*</span>
            </label>
            <input
              type="date"
              value={form.receivedDate}
              onChange={(e) => onChange("receivedDate", e.target.value)}
              onBlur={() => markTouched("receivedDate")}
              className={
                isFieldInvalid("receivedDate") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("receivedDate") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Description (required) */}
          <div className="form_row full">
            <label>
              {t.incomesPage.columns.description} <span className="req">*</span>
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
          <button className="btn" onClick={() => navigate("/incomes")}>
            ← {t.common?.back ?? "Back"}
          </button>

          <button
            className="btn primary"
            onClick={onSubmit}
            disabled={!canCreate || createMutation.isPending}
          >
            {createMutation.isPending
              ? (t.common?.saving ?? "Saving...")
              : (t.common?.create ?? "Create")}
          </button>
        </div>
      </div>
    </div>
  );
}
