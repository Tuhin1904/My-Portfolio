"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface OrbitingCirclesProps {
  children: ReactNode;
  radius?: number;
  iconSize?: number;
  speed?: number;
  reverse?: boolean;
}

export function OrbitingCircles({
  children,
  radius = 120,
  iconSize = 40,
  speed = 10,
  reverse = false,
}: OrbitingCirclesProps) {
  const items = Array.isArray(children) ? children : [children];
  const angleStep = 360 / items.length;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {items.map((child, index) => {
        const angle = angleStep * index;

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ width: iconSize, height: iconSize }}
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
          >
            <div
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              {child}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
