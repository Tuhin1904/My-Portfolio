"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import FloatingHireMe from "./FloatingHireMe";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { FaGithub, FaLinkedin, FaInstagram, FaChevronDown } from "react-icons/fa";

gsap.registerPlugin(ScrambleTextPlugin);

export default function AboutPage() {
    const rotatingTextRef = useRef<HTMLDivElement | null>(null);
    const h1Ref1 = useRef(null);

    // Rotate text infinitely
    useEffect(() => {
        let angle = 0;
        const interval = setInterval(() => {
            if (rotatingTextRef.current) {
                rotatingTextRef.current.style.transform = `rotate(${angle}deg)`;
            }
            angle = (angle + 1) % 360;
        }, 20);
        return () => clearInterval(interval);
    }, []);

    // Scramble effect on text load
    useEffect(() => {
        gsap.fromTo(
            h1Ref1.current,
            { scrambleText: { text: "", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.4 } },
            {
                duration: 1.8,
                scrambleText: { text: "Hello I'm Tuhin,", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.4 },
                ease: "none",
            }
        );
    }, []);

    return (
        <section className="relative min-h-[90vh] bg-gray-900 text-white flex items-center justify-center px-6 pt-12 overflow-hidden">

            {/* Dot-grid background */}
            <div className="absolute inset-0 dot-grid-bg opacity-60 pointer-events-none" />

            {/* Radial glow blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Hire Me */}
            <div className="fixed hidden md:block md:bottom-8 md:left-8 z-50">
                <FloatingHireMe
                    screenSize="big"
                    text="Web Developer • UI Developer • "
                    spinDuration={20}
                    onHover="speedUp"
                    className="fill-dark dark:fill-light"
                />
            </div>
            <div className="fixed block md:hidden bottom-1 right-1 z-50">
                <FloatingHireMe
                    screenSize="small"
                    text="Web Developer • UI Developer • "
                    spinDuration={20}
                    onHover="speedUp"
                    className="fill-dark dark:fill-light"
                />
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl w-full">

                {/* Left — Hero Image */}
                <div className="flex items-center justify-center order-2 md:order-1">
                    <div className="relative w-full max-w-md">
                        {/* Outer glow ring */}
                        <div className="absolute -inset-1 rounded-2xl opacity-70 blur-sm"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                        {/* Inner image container */}
                        <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden border border-indigo-500/30">
                            <Image fill alt="Tuhin Ghosh" src="/images/generated-image.png" className="object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -right-4 glass-card rounded-xl px-4 py-2 flex items-center gap-2 float-anim">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-medium text-gray-200">Available for work</span>
                        </div>
                    </div>
                </div>

                {/* Right — Text Content */}
                <div className="flex flex-col justify-center order-1 md:order-2">
                    {/* Gradient greeting */}
                    <h1
                        className="text-4xl md:text-5xl font-medium mb-3 gradient-text"
                        ref={h1Ref1}
                    >
                        Hello I'm Tuhin,
                    </h1>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                        Transforming Ideas Into{" "}
                        <span className="gradient-text">Digital Experiences</span>{" "}
                        With Code And Design.
                    </h2>

                    <p className="text-base text-gray-400 mb-8 leading-relaxed max-w-lg">
                        As a skilled frontend developer, I am dedicated to turning ideas into innovative web applications.
                        Explore my latest projects, showcasing my expertise in React.js and web development.
                    </p>

                    {/* CTA Row */}
                    <div className="flex items-center gap-4 mb-8 flex-wrap">
                        <a
                            href="https://drive.google.com/file/d/1RV3XbvU_JwKFE96n1-jcZt3tj2wh64TI/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shimmer-btn text-white px-7 py-3 rounded-lg font-semibold text-sm tracking-wide shadow-lg"
                        >
                            View Resume
                        </a>
                        <a
                            href="#contact"
                            className="border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 px-7 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200"
                        >
                            Contact Me
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">Find me on</span>
                        <div className="flex gap-3">
                            <a href="https://github.com/Tuhin1904" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 text-lg">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/tuhinghosh19/" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 text-lg">
                                <FaLinkedin />
                            </a>
                            <a href="https://www.instagram.com/tuhingh19/" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 text-lg">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll down chevron */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500">
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <FaChevronDown className="bounce-down text-indigo-400" />
            </div>
        </section>
    );
}
