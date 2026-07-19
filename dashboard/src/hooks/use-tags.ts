"use client";

import useSWR from "swr";
import type { TagDTO } from "@/types";

type ApiResponse<T> =
  { data: T } | { error: { message: string; code?: string } };

async function fetcher(url: string): Promise<TagDTO[]> {
  const res = await fetch(url);
  const json = (await res.json()) as ApiResponse<TagDTO[]>;
  if (!res.ok || "error" in json) {
    throw new Error(
      "error" in json ? json.error.message : "Failed to load tags",
    );
  }
  return json.data;
}

export function useTags() {
  const { data, error, isLoading, mutate } = useSWR("/api/tags", fetcher);
  return { tags: data ?? [], isLoading, error, mutate };
}
