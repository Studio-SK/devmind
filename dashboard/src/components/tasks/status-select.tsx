import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskStatus } from "@/types";

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  ARCHIVED: "Archived",
};

export const statusDotClass: Record<TaskStatus, string> = {
  TODO: "bg-slate-400 dark:bg-slate-400",
  IN_PROGRESS: "bg-sky-500 dark:bg-sky-400",
  DONE: "bg-emerald-500 dark:bg-emerald-400",
  ARCHIVED: "bg-zinc-400/60 dark:bg-zinc-500/60",
};

export const statusBadgeClass: Record<TaskStatus, string> = {
  TODO: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
  IN_PROGRESS: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  DONE: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  ARCHIVED: "bg-zinc-400/10 text-muted-foreground",
};

export function StatusSelect({
  value,
  onChange,
}: {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(statusLabels) as TaskStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            <span
              className={`mr-1 inline-block size-2 rounded-full ${statusDotClass[s]}`}
            />
            {statusLabels[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
