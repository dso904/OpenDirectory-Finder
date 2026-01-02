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

const features = [
    {
        icon: Film,
        title: "Movies & TV",
        description: "MKV, MP4, AVI, and more video formats",
    },
    {
        icon: BookOpen,
        title: "Books",
        description: "PDF, EPUB, MOBI, and document formats",
    },
    {
        icon: Music,
        title: "Music",
        description: "MP3, FLAC, WAV, and audio formats",
    },
    {
        icon: Package,
        title: "Software",
        description: "ISO, EXE, DMG, and archive formats",
    },
    {
        icon: Image,
        title: "Images",
        description: "JPG, PNG, GIF, and graphic formats",
    },
    {
        icon: Globe,
        title: "Multi-Engine",
        description: "Search across Google, DuckDuckGo, Brave & more",
    },
];

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
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
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background/80 p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6 backdrop-blur-sm">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                    <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                        <Icon className="h-5 w-5 text-foreground" />
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
                        />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
