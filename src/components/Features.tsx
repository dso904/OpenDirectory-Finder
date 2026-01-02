import { motion } from "framer-motion";
import {
    Film,
    BookOpen,
    Music,
    Package,
    Image,
    Globe,
} from "lucide-react";

const features = [
    {
        icon: Film,
        title: "Movies & TV",
        description: "MKV, MP4, AVI, and more video formats",
        color: "from-rose-500 to-pink-600",
    },
    {
        icon: BookOpen,
        title: "Books",
        description: "PDF, EPUB, MOBI, and document formats",
        color: "from-amber-500 to-orange-600",
    },
    {
        icon: Music,
        title: "Music",
        description: "MP3, FLAC, WAV, and audio formats",
        color: "from-green-500 to-emerald-600",
    },
    {
        icon: Package,
        title: "Software",
        description: "ISO, EXE, DMG, and archive formats",
        color: "from-blue-500 to-cyan-600",
    },
    {
        icon: Image,
        title: "Images",
        description: "JPG, PNG, GIF, and graphic formats",
        color: "from-purple-500 to-violet-600",
    },
    {
        icon: Globe,
        title: "Multi-Engine",
        description: "Search across Google, DuckDuckGo, Brave & more",
        color: "from-indigo-500 to-blue-600",
    },
];

export function Features() {
    return (
        <motion.section
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        className="group relative p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-border transition-all duration-300 cursor-default"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.8 }}
                        whileHover={{ y: -4 }}
                    >
                        {/* Gradient background on hover */}
                        <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />

                        <div className="relative">
                            <div
                                className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${feature.color} mb-3`}
                            >
                                <feature.icon className="w-5 h-5 text-white" />
                            </div>

                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
