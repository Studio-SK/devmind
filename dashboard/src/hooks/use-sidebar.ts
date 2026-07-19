"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dashboard-sidebar-open";

export function useSidebar() {
  const [open, setOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setOpen(stored === "true");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, String(open));
  }, [open, hydrated]);

  return { open, toggle: () => setOpen((v) => !v), setOpen };
}
