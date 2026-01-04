import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/projectHook.ts";
import type { IProject } from "@shared/types";
import type { Dictionary } from "../../i18n/i18n";
import { Plus } from "lucide-react";

type ProjectsProps = {
  t: Dictionary;
};

export default function Projects({ t }: ProjectsProps) {
  const navigate = useNavigate();
  const { data: projects, error, isLoading } = useProjects();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "" | "planning" | "active" | "on-hold" | "completed" | "cancelled"
  >("");

  const filteredProjects = useMemo(() => {
    const s = search.trim().toLowerCase();

    return (projects ?? []).filter((p) => {
      const matchesStatus = status ? p.status === status : true;

      const matchesSearch = s
        ? [
            p.name,
            p.description,
            p.customerName,
            p.customerAddress,
            p.customerPhone,
            p.customerEmail,
          ]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(s))
        : true;

      return matchesStatus && matchesSearch;
    });
  }, [projects, search, status]);

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="main_container">
      <div className="project_container">
        {/* Filters */}
        <div className="projects_toolbar">
          <input
            className="projects_search"
            placeholder={t.projectsPage.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="projects_select"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as IProject["status"] | "")
            }
          >
            <option value="">{t.projectsPage.allStatuses}</option>
            <option value="planning">{t.projectsPage.statuses.planning}</option>
            <option value="active">{t.projectsPage.statuses.active}</option>
            <option value="on-hold">
              {t.projectsPage.statuses["on-hold"]}
            </option>
            <option value="completed">
              {t.projectsPage.statuses.completed}
            </option>
            <option value="cancelled">
              {t.projectsPage.statuses.cancelled}
            </option>
          </select>

          <button
            className="projects_clear"
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
          >
            {t.projectsPage.clear}
          </button>

          <button
            className="btn icon-btn"
            onClick={() => navigate("/projects/new")}
            aria-label={t.projectsPage.newProject}
            title={t.projectsPage.newProject}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

          <div className="projects_count">
            {filteredProjects.length} {t.projectsPage.projects}
          </div>
        </div>

        {/* Header titles */}
        <div className="projects_header">
          <div className="col name">שם פרויקט</div>
          <div className="col status">{t.projectsPage.status}</div>
          <div className="col customer">{t.projectsPage.customer}</div>
          <div className="col address">{t.projectsPage.address}</div>
        </div>

        {/* Rows */}
        <div className="projects_container">
          {filteredProjects.map((project) => (
            <div
              className="project_row"
              key={project.internalId}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/projects/${project.internalId}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/projects/${project.internalId}`);
              }}
            >
              <div className="cell name">{project.name ?? "-"}</div>
              <div className="cell status">{project.status ?? "-"}</div>
              <div className="cell customer">{project.customerName ?? "-"}</div>
              <div className="cell address">
                {project.customerAddress ?? "-"}
              </div>

              {project.description ? (
                <div className="row_details">{project.description}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
