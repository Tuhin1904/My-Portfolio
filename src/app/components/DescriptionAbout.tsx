import React from 'react'
import { FadeInOnScroll } from './AOSInitializer'
import Counter from './Counter'
import Image from 'next/image'

const DescriptionAbout = () => {
    return (
        <section className="bg-gray-900/90 border-t-2 text-white py-16">
            <FadeInOnScroll>
                <h1 className='text-center text-4xl md:text-6xl mt-6 mb-20 font-semibold'>Where Vision Becomes Experience</h1>
            </FadeInOnScroll>
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-gray-300">
                {/* Left Side - Biography */}
                <FadeInOnScroll>
                    <div>
                        <h3 className="text-gray-400 font-bold text-2xl uppercase mb-4">Biography</h3>
                        <p className="text-lg mb-4">
                            Hi, I'm <span className="font-bold">Tuhin</span>, frontend Developer with more than 1.5+ years of hands-on experience in developing interactive, responsive, scalable, and user-centric web applications.
                        </p>
                        <p className="mb-4 text-lg">
                            I believe great design goes beyond aesthetics — it’s about solving real problems and delivering seamless, enjoyable
                            experiences for users.
                        </p>
                        <p className="mb-4 text-lg">
                            Whether I’m creating a website, mobile app, or digital solution, I focus on design excellence and user-first thinking in
                            every project. I’m excited about the chance to apply my expertise and creativity to your next idea.
                        </p>

                    </div>
                </FadeInOnScroll>

                {/* Middle - Image Placeholder */}
                <div className="relative flex justify-center">
                    <div className="relative w-72 h-92">
                        <div className="absolute -inset-1 bg-white rounded-xl shadow-lg shadow-white/10 left-1 top-1"></div>
                        <div className="relative w-full h-full bg-gray-800 rounded-xl p-1 overflow-hidden">
                            <Image
                                src="/images/myDP.jpg"
                                fill
                                alt="Styled Image"
                                className="w-full h-full object-cover rounded-lg hover:scale-108 transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>


                {/* Right Side - Stats */}
                <div className="flex md:flex-col justify-center items-center md:items-start gap-8">
                    <div>
                        <h3 className="text-4xl font-bold"> <Counter target={6} /></h3>
                        <p className="text-gray-400">Projects Completed</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold"><Counter target={1.5} /></h3>
                        <p className="text-gray-400">Years Of Experience</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DescriptionAbout