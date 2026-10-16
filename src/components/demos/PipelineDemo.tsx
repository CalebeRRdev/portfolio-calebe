// File: src/components/demos/PipelineDemo.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./PipelineDemo.module.css";

type Deal = { id: number; stage: number };

const INITIAL: Deal[] = [
  { id: 0, stage: 0 },
  { id: 1, stage: 1 },
  { id: 2, stage: 0 },
];

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

export function PipelineDemo({ dict }: { dict: Dictionary["experience"]["crm"] }) {
  const [deals, setDeals] = useState<Deal[]>(INITIAL);
  const [cursor, setCursor] = useState(0);

  const advance = () => {
    if (deals.every((d) => d.stage === 3)) {
      setDeals(INITIAL);
      setCursor(0);
      return;
    }
    // Round-robin over deals that aren't won yet
    let i = cursor;
    while (deals[i % deals.length].stage === 3) i++;
    const target = deals[i % deals.length].id;
    setDeals((prev) => prev.map((d) => (d.id === target ? { ...d, stage: d.stage + 1 } : d)));
    setCursor((i + 1) % deals.length);
  };

  return (
    <div className={styles.demo}>
      <LayoutGroup>
        <div className={styles.board} aria-hidden="true">
          {dict.stages.map((stage, s) => {
            const inStage = deals.filter((d) => d.stage === s);
            return (
              <div key={stage} className={`${styles.column} ${s === 3 ? styles.won : ""}`}>
                <div className={styles.columnHead}>
                  <span className={styles.stageName}>{stage}</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={inStage.length}
                      className={styles.count}
                      initial={{ y: -10, opacity: 0, scale: 0.6 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 10, opacity: 0, scale: 0.6 }}
                      transition={spring}
                    >
                      {inStage.length}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className={styles.cards}>
                  {inStage.map((d) => (
                    <motion.div
                      key={d.id}
                      layoutId={`deal-${d.id}`}
                      className={styles.card}
                      transition={spring}
                    >
                      <span className={styles.avatar} data-deal={d.id} />
                      <span className={styles.dealName}>{dict.deals[d.id]}</span>
                      <span className={styles.progress}>
                        {[0, 1, 2, 3].map((p) => (
                          <span key={p} className={p <= d.stage ? styles.stepOn : styles.step} />
                        ))}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <div className={styles.bar}>
        <button type="button" className={styles.action} onClick={advance}>
          {dict.advance}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
