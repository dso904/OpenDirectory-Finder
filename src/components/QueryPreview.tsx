import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQueryPreview } from "@/lib/search";
import type { FileType, SearchOptions } from "@/types";

interface QueryPreviewProps {
    query: string;
    fileType: FileType;
    searchOptions: SearchOptions;
    engine: string;
}

export function QueryPreview({ query, fileType, searchOptions, engine }: QueryPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Only show preview if there's a query
    if (!query.trim()) {
        return null;
    }

    const preview = getQueryPreview(query, fileType, searchOptions);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(preview.query);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="w-full">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2"
            >
                {isOpen ? (
                    <EyeOff className="h-3 w-3" />
                ) : (
                    <Eye className="h-3 w-3" />
                )}
                <span>{isOpen ? "Hide" : "Preview"} Query</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                            {/* Header with copy button */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium">Search Query</span>
                                    <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px]">
                                        {engine}
                                    </span>
                                    {searchOptions.mode === "fresh" && (
                                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px]">
                                            <Clock className="h-2.5 w-2.5" />
                                            Fresh
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-6 px-2 text-xs gap-1"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3 w-3 text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Query preview */}
                            <div className="font-mono text-xs text-foreground/80 bg-background/50 rounded-lg p-3 break-all leading-relaxed scrollbar-thin max-h-32 overflow-y-auto">
                                {preview.query}
                            </div>

                            {/* Date filter indicator */}
                            {preview.dateFilter !== "Any time" && (
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Time filter: {preview.dateFilter}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
