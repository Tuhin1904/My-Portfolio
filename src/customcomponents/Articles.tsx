import { articles } from '@/const/article';
import Image from 'next/image';
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa';

const Articles = () => {
    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-800 py-10 px-6 pb-20">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Articles</h1>

                <div className="flex flex-col gap-10">
                    {articles.map((article, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col md:flex-row ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                } border rounded-2xl shadow-md bg-white dark:bg-gray-900 hover:shadow-lg transition overflow-hidden`}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2 h-120 bg-gray-200 relative">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">{article.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-3">{article.description}</p>
                                <p className="text-sm text-gray-400 mt-4">Last Updated: {article.updatedDate}</p>
                                <a
                                    href={article.readMoreLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-semibold"
                                >
                                    Read More <FaExternalLinkAlt size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Articles