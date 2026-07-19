"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StatusSelect } from "@/components/tasks/status-select";
import { CommentList } from "@/components/tasks/comment-list";
import { TagBadge } from "@/components/tags/tag-badge";
import { api } from "@/lib/api-client";
import type { TaskDTO, TaskStatus } from "@/types";

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onChanged,
  onEdit,
}: {
  task: TaskDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
  onEdit: () => void;
}) {
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  if (!task) return null;

  async function handleStatusChange(status: TaskStatus) {
    try {
      await api.updateTask(task!.id, { status });
      onChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update status",
      );
    }
  }

  async function handleAddComment() {
    const body = newComment.trim();
    if (!body) return;
    setPosting(true);
    try {
      await api.addComment(task!.id, body);
      setNewComment("");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add comment");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteTask(task!.id);
      toast.success("Task deleted");
      onChanged();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete task");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6 text-lg leading-snug">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {task.description && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {task.description}
            </p>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Status
            </span>
            <StatusSelect value={task.status} onChange={handleStatusChange} />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Comments
            </h4>
            <CommentList comments={task.comments} />
            <div className="flex flex-col gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={posting}
                className="self-end"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 justify-between p-6 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
