import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Film,
    BookOpen,
    Music,
    Package,
    Image,
    Subtitles,
    Asterisk,
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
import { FILE_TYPES, DEFAULT_FILE_TYPE } from "@/lib/config";
import type { FileType } from "@/types";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Film,
    BookOpen,
    Music,
    Package,
    Image,
    Subtitles,
    Asterisk,
};

interface FileTypeSelectorProps {
    value: FileType;
    onChange: (fileType: FileType) => void;
}

export function FileTypeSelector({ value, onChange }: FileTypeSelectorProps) {
    const [open, setOpen] = useState(false);
    const Icon = iconMap[value.icon] || Asterisk;

    const handleSelect = useCallback(
        (fileType: FileType) => {
            onChange(fileType);
            setOpen(false);
        },
        [onChange]
    );

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="glass"
                    className="min-w-[140px] justify-between gap-2 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-violet-400" />
                        <span>{value.label}</span>
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
                    <DropdownMenuContent align="start" side="bottom" className="w-56" forceMount>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <DropdownMenuLabel>File Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(FILE_TYPES).map((fileType) => {
                                const ItemIcon = iconMap[fileType.icon] || Asterisk;
                                const isSelected = fileType.id === value.id;

                                return (
                                    <DropdownMenuItem
                                        key={fileType.id}
                                        onClick={() => handleSelect(fileType)}
                                        className="cursor-pointer"
                                    >
                                        <ItemIcon
                                            className={`h-4 w-4 ${isSelected ? "text-violet-400" : "text-muted-foreground"
                                                }`}
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className={isSelected ? "text-violet-400" : ""}>
                                                {fileType.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {fileType.description}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className="ml-auto h-4 w-4 text-violet-400" />
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

export { DEFAULT_FILE_TYPE };
