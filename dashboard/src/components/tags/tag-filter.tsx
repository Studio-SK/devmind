"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useTags } from "@/hooks/use-tags";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export function TagFilter({
  tagId,
  onChange,
}: {
  tagId: string | null;
  onChange: (tagId: string | null) => void;
}) {
  const { tags, mutate } = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAddTag() {
    const name = newTagName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await api.createTag({ name });
      await mutate();
      setNewTagName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create tag");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteTag(id: string, name: string) {
    if (!confirm(`Delete tag "${name}"? It will be removed from all tasks.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteTag(id);
      if (tagId === id) onChange(null);
      await mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete tag");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={tagId === null ? "default" : "outline"}
            className="h-7 cursor-pointer px-3 py-1.5 text-sm select-none"
            onClick={() => onChange(null)}
          >
            All
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={tagId === tag.id ? "default" : "outline"}
              className="group h-7 cursor-pointer gap-1 px-3 py-1.5 pr-2 text-sm select-none"
              onClick={() => onChange(tag.id)}
            >
              {tag.name}
              <button
                type="button"
                aria-label={`Delete tag ${tag.name}`}
                className="rounded-full opacity-0 hover:bg-black/10 group-hover:opacity-60 hover:!opacity-100 disabled:opacity-30"
                disabled={deletingId === tag.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTag(tag.id, tag.name);
                }}
              >
                <X className="size-3.5" />
              </button>
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
          disabled={adding}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
