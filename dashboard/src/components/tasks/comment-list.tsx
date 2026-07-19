import { format } from "date-fns";
import type { CommentDTO } from "@/types";

export function CommentList({ comments }: { comments: CommentDTO[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {comments.map((c) => (
        <li
          key={c.id}
          className="rounded-md border bg-muted/40 px-3 py-2 text-sm"
        >
          <p className="whitespace-pre-wrap">{c.body}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {format(new Date(c.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </li>
      ))}
    </ul>
  );
}
