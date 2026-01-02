import { motion } from "framer-motion";
import {
    Film,
    BookOpen,
    Music,
    Package,
    Image,
    Globe,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: Film,
        title: "Movies & TV",
        description: "MKV, MP4, AVI, and more video formats",
        color: "from-rose-500/20 to-pink-600/20",
        iconColor: "text-rose-400",
        borderColor: "border-rose-500/20"
    },
    {
        icon: BookOpen,
        title: "Books",
        description: "PDF, EPUB, MOBI, and document formats",
        color: "from-amber-500/20 to-orange-600/20",
        iconColor: "text-amber-400",
        borderColor: "border-amber-500/20"
    },
    {
        icon: Music,
        title: "Music",
        description: "MP3, FLAC, WAV, and audio formats",
        color: "from-emerald-500/20 to-green-600/20",
        iconColor: "text-emerald-400",
        borderColor: "border-emerald-500/20"
    },
    {
        icon: Package,
        title: "Software",
        description: "ISO, EXE, DMG, and archive formats",
        color: "from-blue-500/20 to-cyan-600/20",
        iconColor: "text-blue-400",
        borderColor: "border-blue-500/20"
    },
    {
        icon: Image,
        title: "Images",
        description: "JPG, PNG, GIF, and graphic formats",
        color: "from-purple-500/20 to-violet-600/20",
        iconColor: "text-purple-400",
        borderColor: "border-purple-500/20"
    },
    {
        icon: Globe,
        title: "Multi-Engine",
        description: "Search across Google, DuckDuckGo, Brave & more",
        color: "from-indigo-500/20 to-blue-600/20",
        iconColor: "text-indigo-400",
        borderColor: "border-indigo-500/20"
    },
];

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    iconColor: string;
    borderColor: string;
}

const FeatureCard = ({ icon: Icon, title, description, color, iconColor, borderColor }: FeatureCardProps) => {
    return (
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <div className={cn(
                "relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background/60 p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6 backdrop-blur-md transition-colors duration-300",
                "group hover:bg-background/40"
            )}>
                {/* Subtle colored gradient overlay */}
                <div className={cn(
                    "absolute inset-0 opacity-20 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-30",
                    color
                )} />

                <div className="relative flex flex-1 flex-col justify-between gap-3">
                    <div className={cn(
                        "w-fit rounded-lg border-[0.75px] bg-background/50 p-2 backdrop-blur-md",
                        borderColor
                    )}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="pt-0.5 text-lg font-semibold font-sans tracking-tight text-foreground">
                            {title}
                        </h3>
                        <h2 className="font-sans text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function Features() {
    return (
        <motion.section
            className="py-12 w-full max-w-7xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.8 }}
                        className="h-full"
                    >
                        <FeatureCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                            iconColor={feature.iconColor}
                            borderColor={feature.borderColor}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
