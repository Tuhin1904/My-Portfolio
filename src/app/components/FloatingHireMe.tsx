import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface CircularTextProps {
    screenSize: string;
    text: string;
    spinDuration?: number;
    onHover?: "speedUp" | "slowDown" | "pause" | "goBonkers" | "";
    className?: string;
}

const getRotationTransition = (duration: number, from: number, loop = true) => ({
    from,
    to: from + 360,
    ease: "linear" as const,
    duration,
    type: "tween" as const,
    repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
    rotate: getRotationTransition(duration, from),
    scale: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300,
    },
});

const FloatingHireMe: React.FC<CircularTextProps> = ({
    screenSize,
    text,
    spinDuration = 20,
    onHover = "speedUp",
    className = "",
}) => {
    const letters = Array.from(text);
    const controls = useAnimation();
    const rotation = useMotionValue(0);

    useEffect(() => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start),
        });
    }, [spinDuration, text, onHover, controls, rotation]);

    const handleHoverStart = () => {
        const start = rotation.get();
        if (!onHover) return;

        let transitionConfig: any;
        let scaleVal = 1;

        switch (onHover) {
            case "slowDown":
                transitionConfig = getTransition(spinDuration * 2, start);
                break;
            case "speedUp":
                transitionConfig = getTransition(spinDuration / 4, start);
                break;
            case "pause":
                transitionConfig = {
                    rotate: { type: "spring", damping: 20, stiffness: 300 },
                    scale: { type: "spring", damping: 20, stiffness: 300 },
                };
                scaleVal = 1;
                break;
            case "goBonkers":
                transitionConfig = getTransition(spinDuration / 20, start);
                scaleVal = 0.8;
                break;
            default:
                transitionConfig = getTransition(spinDuration, start);
        }

        controls.start({
            rotate: start + 360,
            scale: scaleVal,
            transition: transitionConfig,
        });
    };

    const handleHoverEnd = () => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start),
        });
    };

    return (
        <motion.div
            className={`m-0 mx-auto rounded-full w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative text-white font-black text-center cursor-pointer origin-center ${className}`}
            style={{ rotate: rotation }}
            initial={{ rotate: 0 }}
            animate={controls}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
        >
            {letters.map((letter, i) => {
                const rotationDeg = (360 / letters.length) * i;
                const factor = Math.PI / letters.length;
                const x = factor * i;
                const y = factor * i;
                const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

                return (
                    <span
                        key={i}
                        className={`absolute inline-block inset-0 ${screenSize == "big" ? "text-2xl" : "xl"} transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]`}
                        style={{ transform, WebkitTransform: transform }}
                    >
                        {letter}
                    </span>
                );
            })}
            {/* ✅ Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white hover:bg-gray-700 hover:text-white text-black font-bold text-lg rounded-full w-20 md:w-24 h-20  md:h-24 flex items-center justify-center shadow-lg">
                    Hire Me
                </div>
            </div>

        </motion.div>
    );
};

export default FloatingHireMe;
