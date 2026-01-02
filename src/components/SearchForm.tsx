import { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, AlertCircle, Loader2, Command, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTypeSelector, DEFAULT_FILE_TYPE } from "./FileTypeSelector";
import { SearchEngineSelector, DEFAULT_ENGINE } from "./SearchEngineSelector";
import { SearchModeSelector } from "./SearchModeSelector";
import { DateFilterSelector } from "./DateFilterSelector";
import { MultiEngineSelector } from "./MultiEngineSelector";
import { QueryPreview } from "./QueryPreview";
import { executeSearch } from "@/lib/search";
import { SEARCH_ENGINES, DEFAULT_SEARCH_OPTIONS } from "@/lib/config";
import type { FileType, SearchEngine, SearchMode, DateFilter, SearchOptions } from "@/types";

// Placeholder examples for typing animation
const PLACEHOLDERS = [
    "The Office S01E01",
    "Python Programming Book PDF",
    "Pink Floyd Greatest Hits",
    "Windows 11 ISO",
    "Avatar 2 2022",
    "Adobe Photoshop 2024",
    "Game of Thrones complete series",
];

export function SearchForm() {
    const [query, setQuery] = useState("");
    const [fileType, setFileType] = useState<FileType>(DEFAULT_FILE_TYPE);
    const [engine, setEngine] = useState<SearchEngine>(DEFAULT_ENGINE);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Advanced search options
    const [searchOptions, setSearchOptions] = useState<SearchOptions>(DEFAULT_SEARCH_OPTIONS);

    // Rotate placeholder text
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + K to focus
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Handler updates
    const handleModeChange = useCallback((mode: SearchMode) => {
        setSearchOptions((prev) => ({ ...prev, mode }));
    }, []);

    const handleDateFilterChange = useCallback((dateFilter: DateFilter) => {
        setSearchOptions((prev) => ({ ...prev, dateFilter }));
    }, []);

    const handleMultiEngineToggle = useCallback((enabled: boolean) => {
        setSearchOptions((prev) => ({ ...prev, multiEngine: enabled }));
    }, []);

    const handleSelectedEnginesChange = useCallback((selectedEngines: string[]) => {
        setSearchOptions((prev) => ({ ...prev, selectedEngines }));
    }, []);

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            setError(null);

            if (isSearching) return;

            setIsSearching(true);

            // Small delay for animation
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Multi-engine search: open multiple tabs
            if (searchOptions.multiEngine && searchOptions.selectedEngines.length > 1) {
                let hasError = false;

                for (const engineId of searchOptions.selectedEngines) {
                    const selectedEngine = SEARCH_ENGINES[engineId];
                    if (selectedEngine) {
                        const result = executeSearch(query, fileType, selectedEngine, searchOptions);
                        if (!result.success) {
                            hasError = true;
                            setError(result.error || "Search failed");
                            break;
                        }
                        // Small delay between opening tabs to avoid blocking
                        await new Promise((resolve) => setTimeout(resolve, 200));
                    }
                }

                if (!hasError) {
                    // Success message for multi-engine
                    setError(null);
                }
            } else {
                // Single engine search
                const result = executeSearch(query, fileType, engine, searchOptions);

                if (!result.success) {
                    setError(result.error || "Search failed");
                }
            }

            setIsSearching(false);
        },
        [query, fileType, engine, isSearching, searchOptions]
    );

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Search Container */}
            <motion.div
                className={`
          relative rounded-2xl p-1.5
          bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20
          ${isFocused ? "shadow-lg shadow-violet-500/20" : ""}
          transition-shadow duration-300
        `}
                animate={{
                    boxShadow: isFocused
                        ? "0 0 40px rgba(139, 92, 246, 0.3)"
                        : "0 0 0px rgba(139, 92, 246, 0)",
                }}
            >
                {/* Glass background */}
                <div className="relative flex flex-col gap-3 p-3 rounded-xl bg-background/80 backdrop-blur-xl border border-white/10">
                    {/* Row 1: Main dropdowns */}
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex gap-2 flex-wrap">
                            <FileTypeSelector value={fileType} onChange={setFileType} />
                            {!searchOptions.multiEngine && (
                                <SearchEngineSelector value={engine} onChange={setEngine} />
                            )}
                        </div>

                        {/* Search input */}
                        <div className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    ref={inputRef}
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder={PLACEHOLDERS[placeholderIndex]}
                                    className="pl-12 pr-4 h-12 text-base bg-secondary/50 border-0 focus:ring-2 focus:ring-violet-500/50"
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    required
                                    minLength={2}
                                    maxLength={500}
                                />
                            </div>

                            {/* Search button */}
                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                disabled={isSearching || query.length < 2}
                                className="min-w-[120px] h-12"
                            >
                                {isSearching ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Searching</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Search</span>
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Advanced Options (collapsible) */}
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                        >
                            <Settings2 className="h-3.5 w-3.5" />
                            <span>Advanced Options</span>
                            <motion.span
                                animate={{ rotate: showAdvanced ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                ▾
                            </motion.span>
                        </Button>

                        {/* Always-visible Multi-Engine toggle */}
                        <MultiEngineSelector
                            enabled={searchOptions.multiEngine}
                            onToggle={handleMultiEngineToggle}
                            selectedEngines={searchOptions.selectedEngines}
                            onChange={handleSelectedEnginesChange}
                        />
                    </div>

                    {/* Advanced Options Panel */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                                    <SearchModeSelector
                                        value={searchOptions.mode}
                                        onChange={handleModeChange}
                                    />
                                    <DateFilterSelector
                                        value={searchOptions.dateFilter}
                                        onChange={handleDateFilterChange}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Query Preview */}
                    <QueryPreview
                        query={query}
                        fileType={fileType}
                        searchOptions={searchOptions}
                        engine={engine.name}
                    />
                </div>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard hint */}
            <motion.div
                className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary/50 border border-border text-xs">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                </kbd>
                <span>to focus search</span>
            </motion.div>
        </motion.form>
    );
}
