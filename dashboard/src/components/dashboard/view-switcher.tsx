"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewType } from "@/lib/date-utils";

export function ViewSwitcher({
  view,
  onChange,
}: {
  view: ViewType;
  onChange: (view: ViewType) => void;
}) {
  return (
    <Tabs
      value={view}
      onValueChange={(v) => onChange(v as ViewType)}
      orientation="vertical"
    >
      <TabsList className="w-full">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
