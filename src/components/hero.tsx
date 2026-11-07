"use client";

import { MotionConfig, motion, type Variants } from "motion/react";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(10px)" },
  shown: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOutExpo, delay },
  }),
};

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto w-full max-w-6xl px-5 pt-8 pb-10 sm:px-8 sm:pt-14 sm:pb-12">
        <h1 className="mt-5 max-w-4xl text-[3.25rem] leading-[0.92] font-extrabold tracking-tight text-neutral-950 font-stretch-80% sm:text-7xl lg:text-[6.5rem]">
          {["Things", "worth"].map((word, i) => (
            <motion.span
              key={word}
              variants={rise}
              initial="hidden"
              animate="shown"
              custom={0.08 + i * 0.08}
              className="mr-[0.22em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{
              opacity: 0,
              y: "0.3em",
              rotate: -4,
              filter: "blur(12px)",
            }}
            animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 16,
              delay: 0.3,
            }}
            className="inline-block origin-bottom-left pr-[0.1em] font-serif font-normal tracking-normal text-orange-600 italic font-stretch-normal"
          >
            repeating.
          </motion.span>
        </h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="shown"
          custom={0.35}
          className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          A wall of quotes I found around the internet and keep coming back to,
          for a little push or just a reminder. Click any strip to read it
          properly.
        </motion.p>
      </section>
    </MotionConfig>
  );
}
