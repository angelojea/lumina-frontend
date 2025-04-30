import { Project } from "../schemas/Project";

export async function createProject(proj: Project) {
  return fetch("http://localhost:4000/projects", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify(proj),
  });
}

export async function listProjects(): Promise<Project[]> {
  const response = await fetch("http://localhost:4000/projects", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  return data as Project[];
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`http://localhost:4000/projects/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  return data as Project;
}
