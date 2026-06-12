import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap } from 'lucide-react';

const Achievements = () => {
    const achievements = [
        {
            title: "Innovate-X Hackathon",
            desc: "Smart India Hackathon prototype - Innovative solution for real-world problems.",
            highlight: "Finalist"
        },
        {
            title: "Coherence 1.0 Hackathon",
            desc: "Developed a YouTube analytics prototype for content creators.",
            highlight: "Runner Up"
        },
        {
            title: "GeeksforGeeks AURA HackFest",
            desc: "Built 'HireWave' - An AI-powered recruitment platform.",
            highlight: "Winner"
        }
    ];

    return (
        <section id="achievements" className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4"><span className="text-cyan-400">05.</span> Achievements</h2>
                    <div className="h-1 w-20 bg-cyan-500 rounded"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/5 overflow-hidden group hover:border-cyan-500/50 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Award size={64} className="text-cyan-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    <Zap size={12} className="mr-1" /> {achievement.highlight}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{achievement.title}</h3>
                                <p className="text-slate-400 text-sm">{achievement.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
