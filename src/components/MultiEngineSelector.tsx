import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Shield,
    ShieldCheck,
    Lock,
    Globe,
    FolderSearch,
    Layers,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SEARCH_ENGINES } from "@/lib/config";

// Icon mapping for search engines
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Search,
    Shield,
    ShieldCheck,
    Lock,
    Globe,
    FolderSearch,
};

interface MultiEngineSelectorProps {
    selectedEngines: string[];
    onChange: (engines: string[]) => void;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export function MultiEngineSelector({
    selectedEngines,
    onChange,
    enabled,
    onToggle,
}: MultiEngineSelectorProps) {
    const [open, setOpen] = useState(false);

    const handleToggleEngine = useCallback(
        (engineId: string, checked: boolean) => {
            if (checked) {
                onChange([...selectedEngines, engineId]);
            } else {
                // Ensure at least one engine is selected
                if (selectedEngines.length > 1) {
                    onChange(selectedEngines.filter((id) => id !== engineId));
                }
            }
        },
        [selectedEngines, onChange]
    );

    const handleToggleMulti = useCallback(() => {
        onToggle(!enabled);
        if (!enabled && selectedEngines.length < 2) {
            // Default to Google + DuckDuckGo when enabling
            onChange(["google", "duckduckgo"]);
        }
    }, [enabled, onToggle, selectedEngines, onChange]);

    const selectedCount = selectedEngines.length;

    return (
        <div className="flex items-center gap-2">
            {/* Toggle button */}
            <Button
                variant={enabled ? "gradient" : "glass"}
                size="sm"
                onClick={handleToggleMulti}
                className="text-xs gap-1.5"
            >
                <Layers className="h-3.5 w-3.5" />
                <span>Multi</span>
                {enabled && (
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">
                        {selectedCount}
                    </span>
                )}
            </Button>

            {/* Engine selector (only shown when multi is enabled) */}
            <AnimatePresence>
                {enabled && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="glass" size="sm" className="text-xs">
                                    Select Engines
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Select Engines</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.values(SEARCH_ENGINES).map((engine) => {
                                    const EngineIcon = iconMap[engine.icon] || Search;
                                    const isSelected = selectedEngines.includes(engine.id);

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={engine.id}
                                            checked={isSelected}
                                            onCheckedChange={(checked) =>
                                                handleToggleEngine(engine.id, checked)
                                            }
                                            disabled={isSelected && selectedEngines.length === 1}
                                        >
                                            <div className="flex items-center gap-2">
                                                <EngineIcon
                                                    className={`h-4 w-4 ${isSelected ? "text-violet-400" : "text-muted-foreground"
                                                        }`}
                                                />
                                                <span>{engine.name}</span>
                                            </div>
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
