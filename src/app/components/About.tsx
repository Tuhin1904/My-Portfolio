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
        <section className="min-h-[80vh] bg-gray-900 text-white flex items-center justify-center px-6 pt-12">
            <div className="fixed hidden md:block md:bottom-8 md:left-8 z-50">
                <FloatingHireMe
                    screenSize="big"
                    text="Web Developer • UI Developer • "
                    spinDuration={20}
                    onHover="speedUp"
                    className="fill-dark dark:fill-light"
                />
            </div>

            <div className="fixed block md:hidden top-1 right-1 z-50">
                <FloatingHireMe
                    screenSize="small"
                    text="Web Developer • UI Developer • "
                    spinDuration={20}
                    onHover="speedUp"
                    className="fill-dark dark:fill-light"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">

                {/* Left Section (Image Placeholder) */}
                <div className="flex items-center justify-center">
                    <div className="w-full h-84 md:h-96 bg-gray-700 rounded-lg relative overflow-hidden">
                        {/* <span className="text-gray-400 text-lg">Image Placeholder</span> */}
                        <Image fill alt="hero" src="/images/codeing_me.webp" className="object-cover" />
                    </div>
                </div>

                {/* Right Section (Text Content) */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-6xl font-medium  mb-6 ">Hello I'm Tuhin,</h1>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Transforming Ideas Into Digital Experiences With Code And Design.
                    </h1>
                    <p className="text-lg text-gray-300 mb-6">
                        As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications.
                        Explore my latest projects, showcasing my expertise in React.js and web development.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://drive.google.com/file/d/1H5DpA0JzzDTIvZJQZNQpmajTsM5ikaCy/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
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
