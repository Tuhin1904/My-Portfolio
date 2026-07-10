import { OrbitingCircles } from "./OrbitingCircles";
import { FaGithub, FaReact, FaNodeJs, FaCss3Alt, FaBootstrap, FaVuejs, FaJira, FaGlobe } from "react-icons/fa";
import { SiNextdotjs, SiTypescript } from "react-icons/si";

export default function OrbitingCirclesDemo() {
    return (
        <section className="relative bg-gray-900 border-t border-white/5 py-24 overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
                {/* Section Heading */}
                <div className="text-center mb-4">
                    <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Technologies</p>
                    <h2 className="text-4xl md:text-6xl font-semibold text-white">
                        My <span className="gradient-text">Skills</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm">
                        Technologies I use to bring ideas to life
                    </p>
                </div>

                <div className="relative flex h-[580px] w-full flex-col items-center justify-center overflow-hidden">
                    {/* Gradient orbit rings */}
                    <div className="absolute w-[460px] h-[460px] rounded-full"
                        style={{ border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 30px rgba(99,102,241,0.08) inset' }} />
                    <div className="absolute w-[340px] h-[340px] rounded-full"
                        style={{ border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 20px rgba(168,85,247,0.06) inset' }} />
                    <div className="absolute w-[220px] h-[220px] rounded-full"
                        style={{ border: '1px solid rgba(99,102,241,0.3)' }} />

                    {/* Outer Circle */}
                    <OrbitingCircles iconSize={46} radius={228} speed={28}>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaGithub size={40} />
                            <span className="text-xs">GitHub</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaReact size={40} />
                            <span className="text-xs">React</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaBootstrap size={40} />
                            <span className="text-xs">Bootstrap</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaVuejs size={40} />
                            <span className="text-xs">Vue.js</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaGlobe size={40} />
                            <span className="text-xs">Web</span>
                        </div>
                    </OrbitingCircles>

                    {/* Middle Circle */}
                    <OrbitingCircles iconSize={42} radius={168} speed={18}>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-violet-400 transition-colors cursor-default">
                            <FaNodeJs size={36} />
                            <span className="text-xs">Node.js</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-violet-400 transition-colors cursor-default">
                            <SiNextdotjs size={36} />
                            <span className="text-xs">Next.js</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-violet-400 transition-colors cursor-default">
                            <FaJira size={36} />
                            <span className="text-xs">Jira</span>
                        </div>
                    </OrbitingCircles>

                    {/* Inner Circle */}
                    <OrbitingCircles iconSize={36} radius={108} reverse speed={8}>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <FaCss3Alt size={32} />
                            <span className="text-xs">CSS3</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors cursor-default">
                            <SiTypescript size={32} />
                            <span className="text-xs">TypeScript</span>
                        </div>
                    </OrbitingCircles>

                    {/* Center — Gradient pulse logo */}
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full pulse-glow"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        <span className="text-white font-bold text-lg">TG</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
