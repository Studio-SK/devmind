import type { TagDTO, TaskDTO } from "@/types";

type ApiResponse<T> =
  { data: T } | { error: { message: string; code?: string } };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || "error" in json) {
    throw new Error("error" in json ? json.error.message : "Request failed");
  }
  return json.data;
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskDTO["status"];
  scope?: TaskDTO["scope"];
  date: string;
  tagIds?: string[];
};

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "scope">>;

export const api = {
  createTask: (input: CreateTaskInput) =>
    request<TaskDTO>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateTask: (id: string, input: UpdateTaskInput) =>
    request<TaskDTO>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteTask: (id: string) =>
    request<{ id: string }>(`/api/tasks/${id}`, { method: "DELETE" }),
  addComment: (taskId: string, body: string) =>
    request<TaskDTO["comments"][number]>(`/api/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
  createTag: (input: { name: string; color?: string }) =>
    request<TagDTO>("/api/tags", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteTag: (id: string) =>
    request<{ id: string }>(`/api/tags/${id}`, { method: "DELETE" }),
};
