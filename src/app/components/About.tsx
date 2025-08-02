"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import FloatingHireMe from "./FloatingHireMe";

export default function AboutPage() {
    const rotatingTextRef = useRef<HTMLDivElement | null>(null);

    // Rotate text infinitely
    useEffect(() => {
        let angle = 0;
        const interval = setInterval(() => {
            if (rotatingTextRef.current) {
                rotatingTextRef.current.style.transform = `rotate(${angle}deg)`;
            }
            angle = (angle + 1) % 360;
        }, 20); // rotation speed
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-[90vh] bg-gray-900 text-white flex items-center justify-center px-6 pt-12">
            <div className="fixed bottom-8 left-8 z-50">
                <FloatingHireMe
                    text="Web Developer • UI Developer • "
                    spinDuration={20}
                    onHover="speedUp"
                    className="fill-dark dark:fill-light"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">

                {/* Left Section (Image Placeholder) */}
                <div className="flex items-center justify-center">
                    <div className="w-full h-80 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-lg">Image Placeholder</span>
                    </div>
                </div>

                {/* Right Section (Text Content) */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Transforming Ideas Into Digital Experiences With Code And Design.
                    </h1>
                    <p className="text-lg text-gray-300 mb-6">
                        As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications.
                        Explore my latest projects and articles, showcasing my expertise in React.js and web development.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="bg-white text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
                        >
                            Resume
                        </a>
                        {/* <a href="#" className="text-blue-400 hover:underline">
                            Contact
                        </a> */}
                    </div>
                </div>

            </div>
        </section>

    );
}
