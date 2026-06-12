import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder } from 'lucide-react';

const ProjectCard = ({ title, techs, description, links, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-2 flex flex-col h-full"
    >
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <Folder size={24} />
                </div>
                <div className="flex gap-4 z-10">
                    {links.github && (
                        <a href={links.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Github size={20} />
                        </a>
                    )}
                    {links.demo && (
                        <a href={links.demo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <ExternalLink size={20} />
                        </a>
                    )}
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-4">
                {description}
            </p>

            <ul className="flex flex-wrap gap-2 mt-auto">
                {techs.map((tech) => (
                    <li key={tech} className="text-xs font-mono text-cyan-400 px-2 py-1 bg-cyan-900/10 rounded">
                        {tech}
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
);

const Projects = () => {
    const projects = [
        {
            title: "ZONO - Geofencing Attendance",
            techs: ["React Native", "MERN Stack", "Google Maps API", "Socket.io"],
            description: "A GPS-based attendance system with real-time validation. Features time-bound sessions, live notifications, and a secure MongoDB backend for immutable records.",
            links: { github: "#", demo: "#" }
        },
        {
            title: "SCAN-IN STEP-IN",
            techs: ["Flutter", "MERN Dashboard", "QR Code"],
            description: "Campus tracking system using QR codes. Implements odd-even scan logic for entry/exit validation and a real-time monitoring dashboard for administration.",
            links: { github: "#", demo: "#" }
        },
        {
            title: "ACCESS-ACE Security",
            techs: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
            description: "Barcode-based security system ensuring secure validation. Includes role-based access panels, immutable entry logs, and automated email/OTP notifications.",
            links: { github: "#", demo: "#" }
        },
        {
            title: "Influencer Management System",
            techs: ["MongoDB", "Express", "EJS", "Node.js"],
            description: "Comprehensive platform for managing influencer campaigns. Features include campaign assignment workflows, progress tracking, and a modular backend architecture.",
            links: { github: "#", demo: "#" }
        }
    ];

    return (
        <section id="projects" className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4"><span className="text-cyan-400">04.</span> Featured Projects</h2>
                    <div className="h-1 w-20 bg-cyan-500 rounded"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
