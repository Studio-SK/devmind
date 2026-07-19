"use client";

import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/dashboard/view-switcher";
import { DateNav } from "@/components/dashboard/date-nav";
import {
  ViewModeToggle,
  type ViewMode,
} from "@/components/dashboard/view-mode-toggle";
import { TagFilter } from "@/components/tags/tag-filter";
import { cn } from "@/lib/utils";
import { viewLabel, type ViewType } from "@/lib/date-utils";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

export function Sidebar({
  open,
  onOpenChange,
  view,
  onViewChange,
  date,
  onDateChange,
  mode,
  onModeChange,
  tagId,
  onTagChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  tagId: string | null;
  onTagChange: (tagId: string | null) => void;
}) {
  return (
    <>
      {open && (
        <div
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-background p-4 transition-transform sm:static sm:z-auto",
          open
            ? "translate-x-0"
            : "-translate-x-full sm:hidden sm:w-0 sm:translate-x-0 sm:overflow-hidden sm:border-r-0 sm:p-0",
        )}
      >
        <section className="flex flex-col gap-2">
          <SectionLabel>View</SectionLabel>
          <ViewSwitcher view={view} onChange={onViewChange} />
        </section>

        <Separator />

        <section className="flex flex-col gap-2">
          <SectionLabel>{viewLabel[view]}</SectionLabel>
          <DateNav view={view} date={date} onChange={onDateChange} />
        </section>

        {view !== "day" && (
          <>
            <Separator />
            <section className="flex flex-col gap-2">
              <SectionLabel>Mode</SectionLabel>
              <ViewModeToggle mode={mode} onChange={onModeChange} />
            </section>
          </>
        )}

        <Separator />

        <section className="flex flex-col gap-2">
          <SectionLabel>Tags</SectionLabel>
          <TagFilter tagId={tagId} onChange={onTagChange} />
        </section>
      </aside>
    </>
  );
}
