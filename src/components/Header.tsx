import { motion } from "framer-motion";
import { FolderOpen, Sparkles } from "lucide-react";

export function Header() {
    return (
        <motion.header
            className="text-center py-8 md:py-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Logo */}
            <motion.div
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-500/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
            >
                <FolderOpen className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <span className="text-gradient">Open Directory</span>
                <br />
                <span className="text-foreground">Finder</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Find direct download links for almost anything</span>
                <Sparkles className="w-5 h-5 text-violet-400" />
            </motion.p>

            {/* Decorative elements */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            />
            <motion.div
                className="absolute top-40 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
            />
        </motion.header>
    );
}
