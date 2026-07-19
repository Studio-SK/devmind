"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { StatusSelect } from "@/components/tasks/status-select";
import { useTags } from "@/hooks/use-tags";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { TaskDTO, TaskScope, TaskStatus } from "@/types";

const periodLabelFormat: Record<TaskScope, string | null> = {
  DAY: null,
  WEEK: "'Week of' MMM d, yyyy",
  MONTH: "MMMM yyyy",
  YEAR: "yyyy",
};

export function TaskFormDialog({
  open,
  onOpenChange,
  defaultDate,
  scope = "DAY",
  task,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: Date;
  scope?: TaskScope;
  task?: TaskDTO;
  onSaved: () => void;
}) {
  const effectiveScope = task ? task.scope : scope;
  const { tags, mutate: mutateTags } = useTags();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [date, setDate] = useState<Date>(defaultDate);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setDate(new Date(task.date));
      setTagIds(task.tags.map((t) => t.id));
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDate(defaultDate);
      setTagIds([]);
    }
  }, [open, task, defaultDate]);

  function toggleTag(id: string) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleAddTag() {
    const name = newTagName.trim();
    if (!name) return;
    try {
      const tag = await api.createTag({ name });
      await mutateTags();
      setTagIds((prev) => [...prev, tag.id]);
      setNewTagName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create tag");
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const input = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        date: date.toISOString(),
        tagIds,
      };
      if (task) {
        await api.updateTask(task.id, input);
        toast.success("Task updated");
      } else {
        await api.createTask({ ...input, scope });
        toast.success("Task created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {task ? "Edit task" : "New task"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="title"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="h-9 text-base"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional details…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {effectiveScope === "DAY" ? "Date" : "Period"}
              </Label>
              {effectiveScope === "DAY" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 justify-start font-normal"
                    >
                      <CalendarIcon className="mr-1 size-4" />
                      {format(date, "MMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Badge variant="outline" className="h-9 w-fit px-3 font-normal">
                  {format(date, periodLabelFormat[effectiveScope]!)}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </Label>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tags
            </Label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={tagIds.includes(tag.id) ? "default" : "outline"}
                    className="h-7 cursor-pointer px-3 py-1.5 text-sm select-none"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag"
                className="h-8"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={handleAddTag}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 p-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(saving && "pointer-events-none opacity-50")}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {task ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
