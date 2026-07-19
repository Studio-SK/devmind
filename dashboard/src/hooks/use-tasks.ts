"use client";

import useSWR from "swr";
import type { TaskDTO } from "@/types";

type ApiResponse<T> =
  { data: T } | { error: { message: string; code?: string } };

async function fetcher(url: string): Promise<TaskDTO[]> {
  const res = await fetch(url);
  const json = (await res.json()) as ApiResponse<TaskDTO[]>;
  if (!res.ok || "error" in json) {
    throw new Error(
      "error" in json ? json.error.message : "Failed to load tasks",
    );
  }
  return json.data;
}

export function useTasks(params: {
  from: Date;
  to: Date;
  tagId?: string | null;
  scope?: TaskDTO["scope"];
}) {
  const search = new URLSearchParams({
    from: params.from.toISOString(),
    to: params.to.toISOString(),
  });
  if (params.tagId) search.set("tagId", params.tagId);
  if (params.scope) search.set("scope", params.scope);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/tasks?${search.toString()}`,
    fetcher,
  );

  return {
    tasks: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
