import { useNavigate, useParams } from "react-router-dom";
import { useProjectByInternalId } from "../../hooks/projectHook";
import type { Dictionary } from "../../i18n/i18n";

type Props = {
  t: Dictionary;
};

export default function ProjectDetails({ t }: Props) {
  const navigate = useNavigate();
  const { internalId } = useParams<{ internalId: string }>();

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useProjectByInternalId(internalId);

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
        <button className="btn" onClick={() => navigate("/projects")}>
          ← {t.common?.back ?? "Back"}
        </button>

        <div style={{ flex: 1 }}>
          <div className="details_title">{project.name ?? "-"}</div>
          <div className="details_subtitle">
            {t.projectsDetails?.projectIdLabel ?? "Project ID"}:{" "}
            {project.internalId}
          </div>
        </div>

        {/* Optional buttons */}
        <button
          className="btn"
          onClick={() => navigate(`/projects/${project.internalId}/edit`)}
        >
          {t.common?.edit ?? "Edit"}
        </button>
      </div>

      {/* Main content */}
      <div className="details_card">
        <div className="details_grid">
          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.status ?? "Status"}
            </div>
            <div className="details_value">{project.status ?? "-"}</div>
          </div>

          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.customer ?? "Customer"}
            </div>
            <div className="details_value">{project.customerName ?? "-"}</div>
          </div>

          <div className="details_item">
            <div className="details_label">
              {t.projectsPage?.address ?? "Address"}
            </div>
            <div className="details_value">
              {project.customerAddress ?? "-"}
            </div>
          </div>

          <div className="details_item">
            <div className="details_label">
              {t.projectsDetails?.phone ?? "Phone"}
            </div>
            <div className="details_value">{project.customerPhone ?? "-"}</div>
          </div>

          <div className="details_item">
            <div className="details_label">
              {t.projectsDetails?.email ?? "Email"}
            </div>
            <div className="details_value">{project.customerEmail ?? "-"}</div>
          </div>
        </div>

        {project.description ? (
          <div className="details_section">
            <div className="details_label">
              {t.projectsDetails?.description ?? "Description"}
            </div>
            <div className="details_value">{project.description}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
