// import { useProjects } from "../../hooks/projectHook.ts";
import { useProjects } from "../../hooks/projectHook.ts";

export default function Projects() {
  console.log("Projects component rendered");
  const { data: projects, error, isLoading } = useProjects();
  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;
  return (
    <div className="main_container">
      <div className="projects_container">
        {projects?.map((project) => (
          <div className="project_card" key={project.internalId}>
            {project.name ? <p>{project.name}</p> : null}
            {project.description ? <p>{project.description}</p> : null}
            {project.status ? <p>Status: {project.status}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
