import React from 'react'
import { FadeInOnScroll } from '@/components/common/AOSInitializer'
import Counter from './Counter'
import Image from 'next/image'

const DescriptionAbout = () => {
    return (
        <section className="relative bg-gray-900 border-t border-white/5 text-white py-24 overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative container mx-auto px-6">
                {/* Section heading */}
                <FadeInOnScroll>
                    <h2 className="text-center text-4xl md:text-6xl font-semibold mb-6">
                        Designing and developing{" "}
                        <span className="gradient-text">with purpose.</span>
                    </h2>
                    <p className="text-center text-gray-500 max-w-xl mx-auto mb-20">
                        Crafting digital experiences that blend technical excellence with thoughtful design.
                    </p>
                </FadeInOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                    {/* Left — Biography */}
                    <FadeInOnScroll direction="left">
                        <div className="glass-card rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-1 h-10 rounded-full" style={{ background: 'linear-gradient(to bottom, #6366f1, #a855f7)' }} />
                                <h3 className="text-gray-300 font-bold text-xl uppercase tracking-widest">Biography</h3>
                            </div>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                Hi, I'm <span className="font-bold text-white">Tuhin</span>, a frontend developer with more than <span className="text-indigo-400 font-semibold">2+ years</span> of hands-on experience in developing interactive, responsive, scalable, and user-centric web applications.
                            </p>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                                I believe great design goes beyond aesthetics — it's about solving real problems and delivering seamless, enjoyable experiences for users.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Whether I'm creating a website, mobile app, or digital solution, I focus on design excellence and user-first thinking in every project.
                            </p>
                        </div>
                    </FadeInOnScroll>

                    {/* Center — Profile Image */}
                    <FadeInOnScroll>
                        <div className="flex justify-center">
                            <div className="relative w-64 h-80">
                                {/* Outer gradient ring */}
                                <div className="absolute -inset-2 rounded-2xl opacity-80 blur-sm"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                                {/* Middle ring */}
                                <div className="absolute -inset-0.5 rounded-2xl"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                                {/* Image */}
                                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-800">
                                    <Image
                                        src="/images/myDP.jpg"
                                        fill
                                        alt="Tuhin Ghosh"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeInOnScroll>

                    {/* Right — Stats */}
                    <FadeInOnScroll direction="right">
                        <div className="flex flex-col gap-6">
                            {/* Projects stat */}
                            <div className="glass-card glow-card rounded-2xl p-8 flex flex-col items-center text-center">
                                <h3 className="text-6xl font-bold gradient-text mb-2">
                                    <Counter target={7} />
                                </h3>
                                <div className="w-12 h-0.5 rounded-full mb-3" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)' }} />
                                <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Projects Completed</p>
                            </div>
                            {/* Experience stat */}
                            <div className="glass-card glow-card rounded-2xl p-8 flex flex-col items-center text-center">
                                <h3 className="text-6xl font-bold gradient-text mb-2">
                                    <Counter target={2.5} plus="+" />
                                </h3>
                                <div className="w-12 h-0.5 rounded-full mb-3" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)' }} />
                                <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Years Of Experience</p>
                            </div>
                        </div>
                    </FadeInOnScroll>
                </div>
            </div>
        </section>
    )
}

export default DescriptionAbout
