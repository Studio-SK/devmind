import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

export type ViewType = "day" | "week" | "month" | "year";

export const viewLabel: Record<ViewType, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const periodFormat: Record<ViewType, string> = {
  day: "EEEE, MMM d, yyyy",
  week: "'Week of' MMM d, yyyy",
  month: "MMMM yyyy",
  year: "yyyy",
};

export function formatPeriodLabel(view: ViewType, date: Date): string {
  return format(date, periodFormat[view]);
}

export function anchorForScope(scope: ViewType, date: Date): Date {
  switch (scope) {
    case "day":
      return startOfDay(date);
    case "week":
      return startOfWeek(date, { weekStartsOn: 1 });
    case "month":
      return startOfMonth(date);
    case "year":
      return startOfYear(date);
  }
}

export function rangeForView(
  view: ViewType,
  date: Date,
): { from: Date; to: Date } {
  switch (view) {
    case "day":
      return { from: startOfDay(date), to: endOfDay(date) };
    case "week":
      return {
        from: startOfWeek(date, { weekStartsOn: 1 }),
        to: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case "month":
      return { from: startOfMonth(date), to: endOfMonth(date) };
    case "year":
      return { from: startOfYear(date), to: endOfYear(date) };
  }
}
