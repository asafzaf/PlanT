export type Project = {
  id: number;
  title: string;
  client: string;
  status: string;
  statusLabel: string;
};

type RecentProjectsProps = {
  projects: Project[];
};

export function RecentProjectsContent({ projects }: RecentProjectsProps) {
  return (
    <div className="recent_projects">
      {projects.map((project) => (
        <div key={project.id} className="project_item">
          <div className="project_main_row">
            <span className="project_title">{project.title}</span>
            <span className={`project_status project_status_${project.status}`}>
              {project.statusLabel}
            </span>
          </div>
          <div className="project_client">{project.client}</div>
        </div>
      ))}
    </div>
  );
}
