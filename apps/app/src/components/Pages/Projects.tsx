// import { useProjects } from "../../hooks/projectHook.ts";
import { useProjects } from "../../hooks/projectHook.ts";

export default function Projects() {
  console.log("Projects component rendered");
  const { data: projects, error, isLoading } = useProjects();
  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;
  return (
    <div className="main_container">
      <h2>Projects Page</h2>
      <ul>
        {projects?.map((project) => (
          <li key={project.internalId}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
