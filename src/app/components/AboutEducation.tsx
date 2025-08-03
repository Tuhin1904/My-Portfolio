import Image from 'next/image'
import React from 'react'

const aboutData = [
    {
        "id": 1,
        "title": "My Master's Journey",
        "description": "Completed my Master of Science (M.Sc) at West Bengal State University, where I developed strong analytical and programming skills that laid the foundation for my professional career.",
        "date": "03-08-2025",
        "image": "/images/me-university.jpg",
        "layout": "text-left"
    },
    {
        "id": 2,
        "title": "My Bachelor's Degree",
        "description": "Graduated with a Bachelor of Science (B.Sc) from Barrackpore Rastraguru Surendranath College, where I had learned what is the actual potential of a personal computer! Before that I had no idea about what a developers job is and also I was not positive about what I was doing.",
        "date": "03-08-2025",
        "image": "/images/chair.jpg",
        "layout": "text-right"
    },
    // {
    //     "id": 3,
    //     "title": "My Schooling",
    //     "description": "Completed my schooling from Krishnanagar Academy, which provided the academic foundation.",
    //     "date": "03-08-2025",
    //     "image": "/images/school-placeholder.jpg",
    //     "layout": "text-left"
    // }
]


const AboutEducation = () => {
    return (
        <section className="bg-gray-900 text-white pb-16 pt-24">
            <div className="max-w-6xl mx-auto px-6 space-y-16">
                {aboutData.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`flex flex-col md:flex-row items-center gap-8 ${item.layout === "text-right" ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* Text Section */}
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                            <p className="text-gray-300 mb-4">{item.description}</p>
                            <p className="text-sm text-gray-500">Updated on {item.date}</p>
                        </div>

                        {/* Image Section */}
                        <div className={`md:w-1/2 ${idx % 2 == 0 ? "border-l-8 border-t-6  rounded-tr-2xl rounded-bl-2xl border-gray-300" : "border-r-8 border-b-6 rounded-t-2xl  rounded-bl-2xl border-gray-300"}`}>
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={500}
                                height={350}
                                className="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AboutEducation