import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Terminal } from 'lucide-react';

const Skills = () => {
    const skillCategories = [
        {
            title: "Technical Stack",
            icon: Layers,
            skills: ["MERN Stack", "REST API Integration", "MongoDB Atlas", "Cloudflare R2", "Backend Integration", "Real-time Systems"]
        },
        {
            title: "Programming Languages",
            icon: Code,
            skills: ["JavaScript", "Java", "Python", "C", "PHP", "React JS", "React Native", "Node JS", "Flutter", "MySQL"]
        },
        {
            title: "Tools",
            icon: Terminal,
            skills: ["Git & GitHub", "Postman", "VS Code", "Firebase (Basic)"]
        }
    ];

    return (
        <section id="skills" className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4"><span className="text-cyan-400">02.</span> Technical Arsenal</h2>
                    <div className="h-1 w-20 bg-cyan-500 rounded"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-2 group h-full"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                    <category.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{category.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-slate-700/50 border border-white/5 rounded-full text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/20 transition-all duration-200 cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
