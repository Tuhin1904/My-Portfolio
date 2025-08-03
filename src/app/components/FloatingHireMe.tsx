import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { FaQuestionCircle, FaWhatsapp } from "react-icons/fa";

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
    const [showPopup, setShowPopup] = useState(false);

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
        <>
            {showPopup && (
                <motion.div
                    initial={{ opacity: 0, y: screenSize === "big" ? 100 : -100, scale: 0.5, rotate: -15 }}
                    animate={{ opacity: 1, y: screenSize === "big" ? -120 : 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: screenSize === "big" ? 100 : -100, scale: 0.5, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`absolute ${screenSize == 'big' ? "left-1/2" : "left-18"}  transform -translate-x-1/2 bg-gray-800 text-white rounded-xl shadow-xl p-4 flex gap-6 ${screenSize === "small" ? "top-full mt-4" : ""
                        }`}   >
                    {/* WhatsApp Icon */}
                    <motion.a
                        href="https://wa.me/8240171142"  // Replace with your WhatsApp number
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <div className="bg-green-500 p-3 rounded-full shadow-lg">
                            <FaWhatsapp size={28} />
                        </div>
                        <p className="text-sm mt-1">WhatsApp</p>
                    </motion.a>

                    {/* Question Icon */}
                    {/* <motion.div
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        animate={{ y: [0, -5, 0], rotate: [0, -5, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <div className="bg-blue-500 p-3 rounded-full shadow-lg">
                            <FaQuestionCircle size={28} />
                        </div>
                        <p className="text-sm mt-1">Query</p>
                    </motion.div> */}

                </motion.div>
            )}


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
                    <div className="bg-white hover:bg-gray-700 hover:text-white text-black font-bold text-lg rounded-full w-24 md:w-24 h-24  md:h-24 flex items-center justify-center shadow-lg"
                        onClick={() => setShowPopup((prev) => !prev)}>
                        Connect with me
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default FloatingHireMe;
