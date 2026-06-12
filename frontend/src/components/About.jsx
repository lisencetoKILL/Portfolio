import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="bg-slate-900 py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    {/* Text Content */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6"> <span className="text-cyan-400">01.</span> About Me</h2>
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>
                                I am a highly motivated Computer Engineering student at Mumbai University (graduating July 2026) with <span className="text-cyan-400">hands-on production experience</span> building scalable web and mobile systems.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 marker:text-cyan-400 text-base">
                                <li>Full Stack Developer Intern with proven track record.</li>
                                <li>Expertise in the <span className="font-semibold text-white">MERN stack</span> (MongoDB, Express, React, Node).</li>
                                <li>Specialized in REST APIs, Real-time systems, and CI/CD automation.</li>
                                <li>Integrated production-grade <span className="text-cyan-400">Cloudflare R2</span> storage solutions and scalable backend architectures.</li>
                            </ul>
                            <p>
                                Passionate about solving complex problems and delivering premium user experiences through clean, efficient code.
                            </p>
                        </div>
                    </div>

                    {/* Education Card / Image Placeholder */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-7 py-6 bg-slate-800 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <div className="space-y-2">
                                <p className="text-slate-300">
                                    <span className="text-cyan-400 font-bold block mb-1">Education</span>
                                </p>
                                <div className="border-l-2 border-slate-700 pl-4">
                                    <h4 className="text-white font-semibold">B.E. Computer Engineering</h4>
                                    <span className="text-sm text-slate-400">Mumbai University | CGPA: 7.24</span>
                                    <p className="text-xs text-slate-500 mt-1">Graduating July 2026</p>
                                </div>
                                <div className="border-l-2 border-slate-700 pl-4 mt-4">
                                    <h4 className="text-white font-semibold">Diploma Computer Engineering</h4>
                                    <span className="text-sm text-slate-400">Vidyalankar Polytechnic | 83.71%</span>
                                    <p className="text-xs text-slate-500 mt-1">July 2022</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
