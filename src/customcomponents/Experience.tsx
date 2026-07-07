import { experienceData } from '@/const/experience'
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt, FaBriefcase } from 'react-icons/fa'

const Experience = () => {
    return (
        <section className="relative bg-gray-900 pt-24 pb-24 px-6 border-t border-white/5 overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto">
                {/* Section Heading */}
                <div className="mb-16">
                    <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Career</p>
                    <h2 className="text-4xl text-white md:text-6xl font-semibold flex items-center gap-3 flex-wrap">
                        My Work{" "}
                        <span className="gradient-text">
                            Exper
                            <span className="flip-letter inline-block font-mono" style={{ WebkitTextFillColor: 'var(--th-text)', color: 'var(--th-text)' }}>i</span>
                            ence
                        </span>
                    </h2>
                </div>

                <div className="grid gap-8">
                    {experienceData.map((exp, idx) => (
                        <div
                            key={idx}
                            className="glass-card glow-card rounded-2xl overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Left — Company image */}
                                <div className="md:w-72 flex-shrink-0 bg-gray-800/60 flex items-center justify-center p-6">
                                    <div className="relative w-full h-40 md:h-52">
                                        <Image
                                            src={exp.image}
                                            alt={`${exp.company} logo`}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 288px"
                                        />
                                    </div>
                                </div>

                                {/* Right — Content */}
                                <div className="flex-1 p-8">
                                    {/* Status badge + role */}
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${exp.employment_status === 'Currently working' ? 'badge-active' : 'badge-past'}`}>
                                            {exp.employment_status === 'Currently working' ? '● Currently Working' : '○ Previously Worked'}
                                        </span>
                                    </div>

                                    {/* Title & link */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                        <a
                                            href={exp.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0 text-gray-500 hover:text-indigo-400 transition-colors duration-200 mt-1"
                                        >
                                            <FaExternalLinkAlt size={15} />
                                        </a>
                                    </div>

                                    {/* Company name */}
                                    <p className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                                        <FaBriefcase size={13} className="text-indigo-500" />
                                        {exp.company}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-400 leading-relaxed mb-4 text-sm">{exp.description}</p>

                                    {/* Footer */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                                        {exp.mentorPortfolio && (
                                            <p className="text-sm text-gray-500">
                                                Guided by:{" "}
                                                <a href={exp.mentorPortfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                                    View Mentor's Portfolio
                                                </a>
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-600 ml-auto">Updated: {exp.updatedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience