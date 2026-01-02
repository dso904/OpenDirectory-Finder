import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Scale, Maximize, ChevronDown, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SEARCH_MODES } from "@/lib/config";
import type { SearchMode } from "@/types";

// Icon mapping for search modes
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Target,
    Scale,
    Maximize,
};

interface SearchModeSelectorProps {
    value: SearchMode;
    onChange: (mode: SearchMode) => void;
}

export function SearchModeSelector({ value, onChange }: SearchModeSelectorProps) {
    const [open, setOpen] = useState(false);
    const currentMode = SEARCH_MODES[value];
    const Icon = iconMap[currentMode.icon] || Scale;

    const handleSelect = useCallback(
        (mode: SearchMode) => {
            onChange(mode);
            setOpen(false);
        },
        [onChange]
    );

    // Color mapping for modes
    const colorMap: Record<SearchMode, string> = {
        precise: "text-emerald-400",
        balanced: "text-amber-400",
        broad: "text-blue-400",
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="glass"
                    size="sm"
                    className="min-w-[110px] justify-between gap-2 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${colorMap[value]}`} />
                        <span className="text-xs">{currentMode.label}</span>
                    </span>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </motion.div>
                </Button>
            </DropdownMenuTrigger>
            <AnimatePresence>
                {open && (
                    <DropdownMenuContent align="start" className="w-48" forceMount>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <DropdownMenuLabel>Search Mode</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(SEARCH_MODES).map((mode) => {
                                const ModeIcon = iconMap[mode.icon] || Scale;
                                const isSelected = mode.id === value;

                                return (
                                    <DropdownMenuItem
                                        key={mode.id}
                                        onClick={() => handleSelect(mode.id)}
                                        className="cursor-pointer"
                                    >
                                        <ModeIcon
                                            className={`h-4 w-4 ${isSelected ? colorMap[mode.id] : "text-muted-foreground"
                                                }`}
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className={isSelected ? colorMap[mode.id] : ""}>
                                                {mode.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {mode.description}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className={`ml-auto h-4 w-4 ${colorMap[mode.id]}`} />
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
