"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CounterProps {
    target: number;
    duration?: number;
}

export default function Counter({ target, duration = 3000 }: CounterProps) {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const frameRate = 30; // 30 updates per second
            const totalSteps = Math.round(duration / frameRate);
            const increment = target / totalSteps;

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, frameRate);
        }
    }, [inView, target, duration]);

    return (
        <span ref={ref}>
            {count}
            {target > 1 ? "" : ""}
        </span>
    );
}
