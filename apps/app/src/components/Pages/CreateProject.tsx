import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IProject, IProjectCreateDTO } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";
import { useCreateProject } from "../../hooks/projectHook";

type Props = { t: Dictionary };

type FormState = {
  name: string;
  description: string;
  status: NonNullable<IProject["status"]> | "";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  currency: string;
  totalAmount: string;
};

type TouchedState = Partial<Record<keyof FormState, boolean>>;

export default function CreateProject({ t }: Props) {
  const navigate = useNavigate();
  const createMutation = useCreateProject();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    status: "planning",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    currency: "ILS",
    totalAmount: "",
  });

  // ✅ track which fields user already touched (for UI errors)
  const [touched, setTouched] = useState<TouchedState>({});
  const [submitted, setSubmitted] = useState(false);

  // ✅ Required fields in this form (based on schema)
  const requiredKeys: (keyof FormState)[] = [
    "name",
    "customerName",
    "customerPhone",
    "customerAddress",
  ];

  const canCreate = useMemo(() => {
    return (
      form.name.trim() &&
      form.customerName.trim() &&
      form.customerPhone.trim() &&
      form.customerAddress.trim()
    );
  }, [form]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const isRequired = (key: keyof FormState) => requiredKeys.includes(key);

  const isFieldInvalid = (key: keyof FormState) => {
    if (!isRequired(key)) return false;

    const showError = submitted || touched[key];
    if (!showError) return false;

    return form[key].trim?.() === ""; // works for string fields
  };

  const getAuthUserId = (): string | undefined => {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return undefined;

    try {
      const parsed = JSON.parse(authUser);
      return parsed._id;
    } catch {
      return undefined;
    }
  };

  const onSubmit = async () => {
    setSubmitted(true);

    if (!canCreate) return; // ✅ prevents submit until required filled

    const budgetAmount =
      form.totalAmount.trim() === "" ? undefined : Number(form.totalAmount);

    const ownerId = getAuthUserId();
    if (!ownerId) {
      throw new Error("User not authenticated");
    }

    const payload: IProjectCreateDTO = {
      name: form.name,
      description: form.description || undefined,
      status: form.status || "planning",
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || undefined,
      customerAddress: form.customerAddress,
      budget:
        budgetAmount !== undefined
          ? { totalAmount: budgetAmount, currency: form.currency }
          : undefined,
      ownerId,
    };

    const created = await createMutation.mutateAsync(payload);
    console.log("Created project:", created);
    navigate(`/projects/`);
  };

  const requiredMsg = t.common?.required ?? "Required";

  return (
    <div className="main_container">
      <div className="project_details_container">
        <div className="details_topbar">
          <div className="details_title">{t.projectsPage.newProject}</div>
        </div>

        <div className="details_form">
          {/* Name (required) */}
          <div className="form_row">
            <label>
              {t.projectsPage.name} <span className="req">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              onBlur={() => markTouched("name")}
              className={isFieldInvalid("name") ? "input_invalid" : undefined}
            />
            {isFieldInvalid("name") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Status (not required - always has a value anyway) */}
          <div className="form_row">
            <label>{t.projectsPage.status}</label>
            <select
              value={form.status}
              onChange={(e) =>
                onChange("status", e.target.value as FormState["status"])
              }
            >
              <option value="planning">
                {t.projectsPage.statuses.planning}
              </option>
              <option value="active">{t.projectsPage.statuses.active}</option>
              <option value="on-hold">
                {t.projectsPage.statuses["on-hold"]}
              </option>
              <option value="completed">
                {t.projectsPage.statuses.completed ?? "Completed"}
              </option>
              <option value="cancelled">
                {t.projectsPage.statuses.cancelled ?? "Cancelled"}
              </option>
            </select>
          </div>

          {/* Customer Name (required) */}
          <div className="form_row">
            <label>
              {t.projectsPage.customer} <span className="req">*</span>
            </label>
            <input
              value={form.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
              onBlur={() => markTouched("customerName")}
              className={
                isFieldInvalid("customerName") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("customerName") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Customer Phone (required) */}
          <div className="form_row">
            <label>
              {t.common?.phone ?? "Phone"} <span className="req">*</span>
            </label>
            <input
              value={form.customerPhone}
              onChange={(e) => onChange("customerPhone", e.target.value)}
              onBlur={() => markTouched("customerPhone")}
              className={
                isFieldInvalid("customerPhone") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("customerPhone") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Customer Email (optional) */}
          <div className="form_row">
            <label>{t.common?.email ?? "Email"}</label>
            <input
              value={form.customerEmail}
              onChange={(e) => onChange("customerEmail", e.target.value)}
              onBlur={() => markTouched("customerEmail")}
            />
          </div>

          {/* Customer Address (required) */}
          <div className="form_row">
            <label>
              {t.projectsPage.address} <span className="req">*</span>
            </label>
            <input
              value={form.customerAddress}
              onChange={(e) => onChange("customerAddress", e.target.value)}
              onBlur={() => markTouched("customerAddress")}
              className={
                isFieldInvalid("customerAddress") ? "input_invalid" : undefined
              }
            />
            {isFieldInvalid("customerAddress") ? (
              <div className="field_error">{requiredMsg}</div>
            ) : null}
          </div>

          {/* Budget (optional) */}
          <div className="form_row">
            <label>{t.common?.budget ?? "Budget"}</label>
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) => onChange("totalAmount", e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Currency (optional) */}
          <div className="form_row">
            <label>{t.common?.currency ?? "Currency"}</label>
            <select
              value={form.currency}
              onChange={(e) => onChange("currency", e.target.value)}
            >
              <option value="ILS">ILS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Description (optional) */}
          <div className="form_row full">
            <label>{t.common?.description ?? "Description"}</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

          {createMutation.error ? (
            <div className="form_error">{createMutation.error.message}</div>
          ) : null}
        </div>

        <div className="details_bottombar">
          <button className="btn" onClick={() => navigate("/projects")}>
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
