import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

const experienceData = [
    {
        "company": "Fortmindz Pvt LTD (Present)",
        "title": "ReactJs Developer",
        "description": "Developing and maintaining modern web applications using React, Next.js, and Tailwind CSS. Collaborating with cross-functional teams for scalable solutions.",
        "updatedDate": "Aug 2025",
        "website": "https://fortmindz.com/",
        "image": "/images/Fortmindz.png"
    },
    {
        "company": "DynamicPro Technology Solutions",
        "title": "Frontend Developer",
        "description": "Worked on custom dashboards and web platforms using React and Redux. Focused on performance optimization and responsive UI design.",
        "updatedDate": "Aug 2025",
        "website": "https://dynamicprotechnologysolutions.com",
        "image": "/images/dts.png"
    },
    {
        "company": "Grambahar.com",
        "title": "Frontend Developer (Project under guidance of my university senior)",
        "description": "Developed a rural e-commerce and community platform as part of the final semester project under the guidance of my senior. Built using MERN stack and integrated payment system.",
        "updatedDate": "Aug 2025",
        "website": "https://grambahar.com",
        "image": "/images/grambahar.png",
        "mentorPortfolio": "https://www.linkedin.com/in/meghoshpritam/"
    }
]


const Experience = () => {
    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-800 pt-10 pb-16 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Experience</h1>

                <div className="grid gap-8 sm:grid-cols-1">
                    {experienceData.map((exp, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center border p-6 rounded-2xl shadow-md bg-white dark:bg-gray-900 hover:shadow-lg transition"
                        >
                            {/* Image on top */}
                            <div className="w-full mb-4 relative h-80 rounded-xl overflow-hidden">
                                <Image
                                    src={exp.image}
                                    alt={`${exp.company} logo`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                />
                            </div>
                            {exp.mentorPortfolio && (
                                <p className="text-sm mt-2">
                                    Guided by:{" "}
                                    <a href={exp.mentorPortfolio} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:underline">
                                        View Mentor's Portfolio
                                    </a>
                                </p>
                            )}

                            {/* Text below */}
                            <div className="w-full text-center">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{exp.title}</h2>
                                    <a
                                        href={exp.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-500"
                                    >
                                        <FaExternalLinkAlt size={18} />
                                    </a>
                                </div>
                                <h3 className="text-lg text-gray-500 dark:text-gray-400 text-left md:text-center">{exp.company}</h3>
                                <p className="text-gray-700 dark:text-gray-300 mt-3 text-left">{exp.description}</p>
                                <p className="text-sm text-gray-400 mt-4 text-left">Last Updated: {exp.updatedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience