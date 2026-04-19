'use client'
import React, { useEffect, useRef, useState } from 'react'
interface Star {
    id: number;
    x: number;
    y: number;
}

const CursorTracker = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const newStar: Star = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY
            };

            setStars((prev) => [...prev, newStar]);

            // remove star after animation
            setTimeout(() => {
                setStars((prev) => prev.filter((star) => star.id !== newStar.id));
            }, 800);
        };

        window.addEventListener("mousemove", handleMove);

        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    // if (!visible) return null;

    return (
        <>
            {stars.map((star, index) => (
                <div
                    key={star.id + index}
                    className="cursor-star"
                    style={{
                        left: star.x,
                        top: star.y
                    }}
                />
            ))}
        </>
    )
}

export default CursorTracker