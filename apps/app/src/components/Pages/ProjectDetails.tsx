import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useProjectByInternalId,
  useUpdateProject,
} from "../../hooks/projectHook";
import type { Dictionary } from "../../i18n/i18n";
import type { IProject } from "@shared/types";
import { Trash2 } from "lucide-react";
import { useDeleteProject } from "../../hooks/projectHook";

type Props = { t: Dictionary };

// local editable form (you can add/remove fields)
type FormState = {
  name: string;
  description: string;
  status: NonNullable<IProject["status"]> | "";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
};

export default function ProjectDetails({ t }: Props) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteProject();
  const { internalId } = useParams<{ internalId: string }>();

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useProjectByInternalId(internalId);
  const updateMutation = useUpdateProject();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);

  // map project -> form shape
  const toForm = (p: IProject): FormState => ({
    name: p.name ?? "",
    description: p.description ?? "",
    status: (p.status ?? "") as FormState["status"],
    customerName: p.customerName ?? "",
    customerPhone: p.customerPhone ?? "",
    customerEmail: p.customerEmail ?? "",
    customerAddress: p.customerAddress ?? "",
  });

  // map form -> project update (you currently update full IProject)
  const toUpdatedProject = (p: IProject, f: FormState): IProject => ({
    ...p,
    name: f.name,
    description: f.description,
    status: (f.status || undefined) as IProject["status"],
    customerName: f.customerName,
    customerPhone: f.customerPhone,
    customerEmail: f.customerEmail,
    customerAddress: f.customerAddress,
  });

  const isDirty = useMemo(() => {
    if (!project || !form) return false;
    const original = toForm(project);
    return JSON.stringify(original) !== JSON.stringify(form);
  }, [project, form]);

  const startEdit = () => {
    if (!project) return;
    setForm(toForm(project));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm(null);
  };

  const saveEdit = async () => {
    if (!project || !form) return;
    const updatedProject = toUpdatedProject(project, form);

    try {
      await updateMutation.mutateAsync(updatedProject);
      setIsEditing(false);
      setForm(null);
      // optional: refetch to ensure UI shows server state (usually invalidate is enough)
      // refetch();
    } catch {
      // error shown below
    }
  };

  const onDelete = async () => {
    if (!internalId) return;

    const confirmed = window.confirm(
      t.projectsDetails?.deleteConfirm ??
        "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(internalId);
      navigate("/projects"); // חזרה לרשימה אחרי מחיקה
    } catch {
      // השגיאה תופיע דרך deleteMutation.error
    }
  };

  if (isLoading) return <div>Loading project...</div>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Failed to load project</h2>
        <p>{error.message}</p>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => refetch()}>
            Try again
          </button>
          <button className="btn" onClick={() => navigate("/projects")}>
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Project not found</h2>
        <button className="btn" onClick={() => navigate("/projects")}>
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="project_details_container">
      {/* Top bar */}
      <div className="details_topbar">
        <div style={{ flex: 1 }}>
          <div className="details_title">{project.name ?? "-"}</div>
          <div className="details_subtitle">
            {t.projectsDetails?.projectIdLabel ?? "Project ID"}:{" "}
            {project.internalId}
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
              disabled={!isDirty || updateMutation.isPending}
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
          {/* Status */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.status ?? "Status"}
            </div>

            {!isEditing ? (
              <div className="details_value">{project.status ?? "-"}</div>
            ) : (
              <select
                className="input"
                value={form?.status ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s
                      ? { ...s, status: e.target.value as FormState["status"] }
                      : s
                  )
                }
              >
                <option value="">
                  {t.projectsPage?.allStatuses ?? "Select status"}
                </option>
                <option value="planning">
                  {t.projectsPage?.statuses?.planning ?? "planning"}
                </option>
                <option value="active">
                  {t.projectsPage?.statuses?.active ?? "active"}
                </option>
                <option value="on-hold">
                  {t.projectsPage?.statuses?.["on-hold"] ?? "on-hold"}
                </option>
                <option value="completed">
                  {t.projectsPage?.statuses?.completed ?? "completed"}
                </option>
                <option value="cancelled">
                  {t.projectsPage?.statuses?.cancelled ?? "cancelled"}
                </option>
              </select>
            )}
          </div>

          {/* Customer */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.customer ?? "Customer"}
            </div>
            {!isEditing ? (
              <div className="details_value">{project.customerName ?? "-"}</div>
            ) : (
              <input
                className="input"
                value={form?.customerName ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, customerName: e.target.value } : s
                  )
                }
              />
            )}
          </div>

          {/* Address */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.address ?? "Address"}
            </div>
            {!isEditing ? (
              <div className="details_value">
                {project.customerAddress ?? "-"}
              </div>
            ) : (
              <input
                className="input"
                value={form?.customerAddress ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, customerAddress: e.target.value } : s
                  )
                }
              />
            )}
          </div>

          {/* Phone */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsDetails?.phone ?? "Phone"}
            </div>
            {!isEditing ? (
              <div className="details_value">
                {project.customerPhone ?? "-"}
              </div>
            ) : (
              <input
                className="input"
                value={form?.customerPhone ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, customerPhone: e.target.value } : s
                  )
                }
              />
            )}
          </div>

          {/* Email */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsDetails?.email ?? "Email"}
            </div>
            {!isEditing ? (
              <div className="details_value">
                {project.customerEmail ?? "-"}
              </div>
            ) : (
              <input
                className="input"
                value={form?.customerEmail ?? ""}
                onChange={(e) =>
                  setForm((s) =>
                    s ? { ...s, customerEmail: e.target.value } : s
                  )
                }
              />
            )}
          </div>

          {/* Name (optional to show in grid) */}
          <div className="details_item">
            <div className="details_label">
              {t.projectsDetails?.name ?? "Name"}
            </div>
            {!isEditing ? (
              <div className="details_value">{project.name ?? "-"}</div>
            ) : (
              <input
                className="input"
                value={form?.name ?? ""}
                onChange={(e) =>
                  setForm((s) => (s ? { ...s, name: e.target.value } : s))
                }
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="details_section">
          <div className="details_label">
            {t.projectsDetails?.description ?? "Description"}
          </div>

          {!isEditing ? (
            <div className="details_value">{project.description ?? "-"}</div>
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
      </div>
      <div className="details_bottombar">
        <button className="btn" onClick={() => navigate("/projects")}>
          ← {t.common?.back ?? "Back"}
        </button>
      </div>
    </div>
  );
}
