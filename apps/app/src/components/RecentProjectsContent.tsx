type ProjectStatus = "active" | "in_progress" | "paid";

export type Project = {
  id: number;
  title: string;
  client: string;
  status: ProjectStatus;
};

type RecentProjectsProps = {
  projects: Project[];
};

function getStatusLabel(status: ProjectStatus) {
  switch (status) {
    case "active":
      return "פעיל";
    case "in_progress":
      return "בתהליך";
    case "paid":
      return "הושלם";
  }
}

export function RecentProjectsContent({ projects }: RecentProjectsProps) {
  return (
    <div className="recent_projects" dir="rtl">
      {projects.map((project) => (
        <div key={project.id} className="project_item">
          <div className="project_main_row">
            <span className="project_title">{project.title}</span>
            <span className={`project_status project_status_${project.status}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>
          <div className="project_client">לקוח: {project.client}</div>
        </div>
      ))}
    </div>
  );
}
