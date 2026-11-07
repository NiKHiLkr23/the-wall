"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const bars = [
  { y: 6, from: 4, to: 8 },
  { y: 14, from: 10, to: 6 },
  { y: 22, from: 4, to: 8 },
];

export function Logo() {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href="/"
      aria-label="the-wall home"
      className="group inline-flex items-center gap-2.5"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-orange-600 shadow-sm shadow-orange-600/30 transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
          {bars.map((bar, i) => (
            <motion.rect
              key={bar.y}
              y={bar.y}
              width={18}
              height={4}
              rx={2}
              fill="white"
              initial={{ x: bar.from }}
              animate={
                reduceMotion ? { x: bar.from } : { x: [bar.from, bar.to] }
              }
              transition={{
                duration: 2.4,
                delay: i * 0.15,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          ))}
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-neutral-950">
        the-wall
      </span>
    </Link>
  );
}
