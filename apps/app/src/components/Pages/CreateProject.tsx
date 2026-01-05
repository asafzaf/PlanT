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
      //   startDate: new Date(),
    };
    // console.log("Creating project with payload:", payload);
    const created = await createMutation.mutateAsync(payload);
    console.log("Created project:", created);
    navigate(`/projects/`);
  };

  return (
    <div className="main_container">
      <div className="project_details_container">
        <div className="details_topbar">
          <div className="details_title">{t.projectsPage.newProject}</div>
        </div>
        {/* Name */}
        <div className="details_form">
          <div className="form_row">
            <label>{t.projectsPage.name}</label>
            <input
              required
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          {/* Status */}
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
          {/* Customer Name */}
          <div className="form_row">
            <label>{t.projectsPage.customer}</label>
            <input
              value={form.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
            />
          </div>
          {/* Customer Phone */}
          <div className="form_row">
            <label>{t.common?.phone ?? "Phone"}</label>
            <input
              value={form.customerPhone}
              onChange={(e) => onChange("customerPhone", e.target.value)}
            />
          </div>
          {/* Customer Email */}
          <div className="form_row">
            <label>{t.common?.email ?? "Email"}</label>
            <input
              value={form.customerEmail}
              onChange={(e) => onChange("customerEmail", e.target.value)}
            />
          </div>
          {/* Customer Address */}
          <div className="form_row">
            <label>{t.projectsPage.address}</label>
            <input
              value={form.customerAddress}
              onChange={(e) => onChange("customerAddress", e.target.value)}
            />
          </div>
          {/* Budget */}
          <div className="form_row">
            <label>{t.common?.budget ?? "Budget"}</label>
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) => onChange("totalAmount", e.target.value)}
              placeholder="0"
            />
          </div>
          {/* Currency */}
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
          {/* Description */}
          <div className="form_row full">
            <label>{t.common?.description ?? "Description"}</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          {/* Error Message */}
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
