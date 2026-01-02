import { motion } from "framer-motion";
import { Heart, Github, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <motion.footer
            className="py-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <div className="flex flex-col items-center gap-4">
                {/* Info text */}
                <p className="max-w-lg mx-auto">
                    OpenDirectory Finder helps you discover file listings from public web servers
                    using advanced search operators.
                </p>

                {/* Links */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Copyright */}
                <p className="flex items-center gap-1.5">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>using React + Vite</span>
                </p>
            </div>
        </motion.footer>
    );
}
