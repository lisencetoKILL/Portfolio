import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' }
];

const Navbar = ({ visible = true }) => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            let current = '';
            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    current = section.id;
                }
            }
            if (window.scrollY < 100) current = 'hero';
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 50,
                behavior: 'smooth'
            });
        }
    };

    if (!visible) return null;

    return (
        <nav className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 hidden md:flex">
            <div className="absolute top-0 bottom-0 right-[5px] w-[1px] bg-slate-800/50 rounded-full overflow-hidden">
                <motion.div
                    className="absolute w-full bg-cyan-500/30 blur-[1px]"
                    animate={{
                        top: ['0%', '100%'],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ height: '30%' }}
                />
            </div>

            {navItems.map((item) => {
                const isActive = activeSection === item.id;

                return (
                    <div
                        key={item.id}
                        className="relative group flex items-center justify-end"
                    >
                        <div className="absolute right-8 pointer-events-none">
                            <AnimatePresence>
                                {(isActive || true) && (
                                    <span
                                        className={`block text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-500 transform
                                            ${isActive ? 'text-cyan-200 opacity-100 translate-x-0' : 'text-slate-500 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
                                        `}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            onClick={() => scrollToSection(item.id)}
                            className={`relative w-3 h-3 rounded-full flex items-center justify-center transition-all duration-500
                                ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800 hover:bg-slate-600'}
                            `}
                            whileHover={{ scale: 1.2 }}
                            animate={{ scale: isActive ? 1.2 : 1 }}
                        >
                            {!isActive && <div className="w-[1px] h-[1px] bg-slate-400 rounded-full"></div>}

                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-cyan-500/30"
                                    initial={{ scale: 1, opacity: 1 }}
                                    animate={{ scale: 1.8, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>
                    </div>
                );
            })}
        </nav>
    );
};

export default Navbar;