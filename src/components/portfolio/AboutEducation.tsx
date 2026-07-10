import Image from 'next/image'
import React from 'react'

const aboutData = [
    {
        "id": 1,
        "title": "Master of Science (M.Sc)",
        "institution": "West Bengal State University",
        "description": "Developed strong analytical and programming skills that laid the foundation for my professional career. This was where my love for problem-solving through code truly began.",
        "date": "2021 – 2023",
        "image": "/images/me-university.jpg",
        "icon": "🎓"
    },
    {
        "id": 2,
        "title": "Bachelor of Science (B.Sc)",
        "institution": "Barrackpore Rastraguru Surendranath College",
        "description": "Discovered the actual potential of a personal computer during my B.Sc years. Before this, I had no idea about what a developer's job is — this was where my journey began.",
        "date": "2018 – 2021",
        "image": "/images/chair.jpg",
        "icon": "🏫"
    },
]

const AboutEducation = () => {
    return (
        <section className="relative bg-gray-900 text-white py-24 border-t border-white/5 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-6">
                {/* Section Heading */}
                <div className="text-center mb-20">
                    <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Background</p>
                    <h2 className="text-4xl md:text-6xl font-semibold">
                        My <span className="gradient-text">Education</span>
                    </h2>
                </div>

                {/* Vertical Timeline */}
                <div className="relative">
                    {/* Central line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 timeline-line" />

                    <div className="flex flex-col gap-16">
                        {aboutData.map((item, idx) => (
                            <div key={item.id} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                {/* Timeline dot */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 w-5 h-5 rounded-full border-2 border-indigo-400 bg-gray-900 z-10"
                                    style={{ boxShadow: '0 0 12px rgba(99,102,241,0.7)' }} />

                                {/* Text card */}
                                <div className={`ml-12 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-10' : 'md:pl-10'}`}>
                                    <div className="glass-card glow-card rounded-2xl p-6">
                                        <div className={`flex items-center gap-3 mb-3 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
                                                {item.date}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-indigo-400 font-medium mb-3">{item.institution}</p>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for the other side */}
                                <div className="hidden md:block md:w-5/12" />

                                {/* Image */}
                                <div className={`ml-12 md:ml-0 w-full md:hidden`}>
                                    <div className="relative h-48 rounded-xl overflow-hidden border border-indigo-500/20">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutEducation
