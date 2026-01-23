// File: src/components/ReloadToTop.tsx
"use client";

import { useLayoutEffect } from "react";

export default function ReloadToTop() {
  useLayoutEffect(() => {
    // evita o browser restaurar scroll automaticamente
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // remove hash pra não voltar pra âncora
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }

    // força topo (duas vezes pra pegar Safari/Chrome)
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return null;
}