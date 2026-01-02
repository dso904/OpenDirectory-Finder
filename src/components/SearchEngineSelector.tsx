import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Shield,
    ShieldCheck,
    Lock,
    Globe,
    FolderSearch,
    ChevronDown,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SEARCH_ENGINES, DEFAULT_ENGINE } from "@/lib/config";
import type { SearchEngine } from "@/types";

// Icon mapping for search engines
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Search,
    Shield,
    ShieldCheck,
    Lock,
    Globe,
    FolderSearch,
};

interface SearchEngineSelectorProps {
    value: SearchEngine;
    onChange: (engine: SearchEngine) => void;
}

export function SearchEngineSelector({
    value,
    onChange,
}: SearchEngineSelectorProps) {
    const [open, setOpen] = useState(false);
    const Icon = iconMap[value.icon] || Search;

    const handleSelect = useCallback(
        (engine: SearchEngine) => {
            onChange(engine);
            setOpen(false);
        },
        [onChange]
    );

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="glass"
                    className="min-w-[130px] justify-between gap-2 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-indigo-400" />
                        <span>{value.name}</span>
                    </span>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </motion.div>
                </Button>
            </DropdownMenuTrigger>
            <AnimatePresence>
                {open && (
                    <DropdownMenuContent align="start" className="w-56" forceMount>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <DropdownMenuLabel>Search Engine</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(SEARCH_ENGINES).map((engine) => {
                                const ItemIcon = iconMap[engine.icon] || Search;
                                const isSelected = engine.id === value.id;

                                return (
                                    <DropdownMenuItem
                                        key={engine.id}
                                        onClick={() => handleSelect(engine)}
                                        className="cursor-pointer"
                                    >
                                        <ItemIcon
                                            className={`h-4 w-4 ${isSelected ? "text-indigo-400" : "text-muted-foreground"
                                                }`}
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className={isSelected ? "text-indigo-400" : ""}>
                                                {engine.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {engine.description}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className="ml-auto h-4 w-4 text-indigo-400" />
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </motion.div>
                    </DropdownMenuContent>
                )}
            </AnimatePresence>
        </DropdownMenu>
    );
}

export { DEFAULT_ENGINE };
