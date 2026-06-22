"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TypewriterRolesProps = {
  roles: readonly string[];
  className?: string;
};

const TYPE_SPEED = 55;
const DELETE_SPEED = 32;
const HOLD_TIME = 1500;

export function TypewriterRoles({ roles, className }: TypewriterRolesProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing"
  );

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_SPEED
        );
      } else {
        timeout = setTimeout(() => setPhase("holding"), HOLD_TIME);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 200);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          DELETE_SPEED
        );
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, roleIndex, roles]);

  return (
    <span className={className}>
      <span>{text}</span>
      <motion.span
        className="ml-1 inline-block h-[0.85em] w-[2px] translate-y-[2px] bg-signal-cyan align-middle"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </span>
  );
}
