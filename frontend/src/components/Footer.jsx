import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-900 pt-24 pb-12 relative overflow-hidden border-t border-slate-800">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
                    Currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>

                <a
                    href="mailto:jaypmakwana007@gmail.com"
                    className="inline-block px-8 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-bold rounded-md hover:bg-cyan-500/10 transition-all duration-300 mb-20"
                >
                    Say Hello
                </a>

                <div className="flex justify-center items-center gap-8 mb-8">
                    <a href="https://github.com/jaypmakwana" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 hover:-translate-y-1 transition-all">
                        <Github size={24} />
                    </a>
                    <a href="https://linkedin.com/in/jaypmakwana" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 hover:-translate-y-1 transition-all">
                        <Linkedin size={24} />
                    </a>
                    <a href="mailto:jaypmakwana007@gmail.com" className="text-slate-400 hover:text-cyan-400 hover:-translate-y-1 transition-all">
                        <Mail size={24} />
                    </a>
                </div>

                <div className="text-slate-600 text-sm">
                    <p>Designed & Built by Jay Makwana</p>
                    <p className="mt-2">© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
