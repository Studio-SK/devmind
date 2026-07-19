"use client";

import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPeriodLabel, type ViewType } from "@/lib/date-utils";

function shift(view: ViewType, date: Date, direction: 1 | -1) {
  switch (view) {
    case "day":
      return addDays(date, direction);
    case "week":
      return addWeeks(date, direction);
    case "month":
      return addMonths(date, direction);
    case "year":
      return addYears(date, direction);
  }
}

export function DateNav({
  view,
  date,
  onChange,
}: {
  view: ViewType;
  date: Date;
  onChange: (date: Date) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold tabular-nums">
        {formatPeriodLabel(view, date)}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(shift(view, date, -1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onChange(new Date())}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(shift(view, date, 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
