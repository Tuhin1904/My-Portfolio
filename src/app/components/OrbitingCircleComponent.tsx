import { div } from "framer-motion/client";
import { OrbitingCircles } from "./OrbitingCircles";
import { FaGithub, FaReact, FaNodeJs, FaCss3Alt, FaBootstrap, FaVuejs, FaJira, FaGlobe } from "react-icons/fa";
import { SiNextdotjs, SiTypescript } from "react-icons/si";

export default function OrbitingCirclesDemo() {
    return (
        <div className=" bg-gray-900 text-white">
            <h1 className="text-4xl md:text-7xl font-medium text-center pt-12">Skills</h1>
            <div className="relative flex h-[550px] w-full flex-col items-center justify-center overflow-hidden mt-12">

                {/* Orbit Lines */}
                <div className="absolute w-[480px] h-[480px] rounded-full border-2 border-gray-700"></div>
                <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-gray-700"></div>
                <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-gray-700"></div>

                {/* Outer Circle */}
                <OrbitingCircles iconSize={50} radius={240} speed={28}>
                    <FaGithub size={50} />
                    <FaReact size={50} />
                    <FaBootstrap size={50} />
                    <FaVuejs size={50} />
                    <FaGlobe size={50} />
                </OrbitingCircles>

                <OrbitingCircles iconSize={50} radius={180} speed={18}>
                    <FaNodeJs size={50} />
                    <SiNextdotjs size={50} />
                    <FaJira size={50} />
                </OrbitingCircles>

                {/* Inner Circle */}
                <OrbitingCircles iconSize={40} radius={120} reverse speed={10}>
                    <FaCss3Alt size={50} />
                    <SiTypescript size={50} />
                </OrbitingCircles>

                {/* Center Logo */}
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white text-gray-900 font-bold">
                    WEB
                </div>
            </div>
        </div>
    );
}
