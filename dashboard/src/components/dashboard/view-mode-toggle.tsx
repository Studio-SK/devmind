"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ViewMode = "goals" | "breakdown";

export function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as ViewMode)}>
      <TabsList>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
