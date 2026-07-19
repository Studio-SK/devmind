import { Badge } from "@/components/ui/badge";
import type { TagDTO } from "@/types";

export function TagBadge({ tag }: { tag: TagDTO }) {
  return (
    <Badge
      variant="outline"
      style={
        tag.color ? { borderColor: tag.color, color: tag.color } : undefined
      }
    >
      {tag.name}
    </Badge>
  );
}
