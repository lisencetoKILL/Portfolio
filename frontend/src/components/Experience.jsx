import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

const Experience = () => {
    const experiences = [
        {
            company: "Fyre Gig",
            role: "Full Stack Developer Intern",
            period: "July 2025 – Present",
            points: [
                "Developed and deployed core features using React.js, Express.js",
                "Integrated Cloudflare R2 for secure file storage",
                "Automated CI/CD pipelines",
                "Built scalable modules for production systems",
                "Improved release cycle efficiency"
            ]
        },
        {
            company: "SMA Pvt Ltd",
            role: "Full Stack Developer Intern",
            period: "June 2025 – July 2025",
            points: [
                "Digitized manual workflows",
                "Built barcode generation and scanning system",
                "Developed REST APIs for real-time inventory management",
                "Designed scalable backend logic"
            ]
        },
        {
            company: "TCE Global Influencer Agency",
            role: "SDE Intern",
            period: "June 2022 – August 2022",
            points: [
                "Built Influencer Management System (MongoDB, Express, EJS, Node)",
                "Implemented role-based campaign workflows",
                "Developed Admin dashboard",
                "Engineered real-time coordination system"
            ]
        }
    ];

    return (
        <section id="experience" className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4"><span className="text-cyan-400">03.</span> Experience</h2>
                    <div className="h-1 w-20 bg-cyan-500 rounded"></div>
                </motion.div>

                <div className="relative border-l border-slate-700 ml-3 md:ml-6 space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Dot on timeline */}
                            <div className="absolute -left-[5px] top-2 w-3 h-3 bg-cyan-500 rounded-full ring-4 ring-slate-900"></div>

                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white text-cyan-400">{exp.role}</h3>
                                        <h4 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                                            <Briefcase size={16} className="text-cyan-500" /> {exp.company}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-2 md:mt-0 font-mono">
                                        <Calendar size={14} />
                                        {exp.period}
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {exp.points.map((point, i) => (
                                        <li key={i} className="flex items-start text-slate-300 text-sm md:text-base">
                                            <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
