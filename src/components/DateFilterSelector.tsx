import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CalendarDays, CalendarRange, ChevronDown, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DATE_FILTERS } from "@/lib/config";
import type { DateFilter } from "@/types";

// Icon mapping for date filters
const iconMap: Record<DateFilter, React.ComponentType<{ className?: string }>> = {
    any: Calendar,
    past_day: Clock,
    past_week: CalendarDays,
    past_month: CalendarRange,
    past_year: Calendar,
};

interface DateFilterSelectorProps {
    value: DateFilter;
    onChange: (filter: DateFilter) => void;
}

export function DateFilterSelector({ value, onChange }: DateFilterSelectorProps) {
    const [open, setOpen] = useState(false);
    const currentFilter = DATE_FILTERS[value];
    const Icon = iconMap[value] || Calendar;

    const handleSelect = useCallback(
        (filter: DateFilter) => {
            onChange(filter);
            setOpen(false);
        },
        [onChange]
    );

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="glass"
                    size="sm"
                    className="min-w-[120px] justify-between gap-2 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-xs">{currentFilter.label}</span>
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
                    <DropdownMenuContent align="start" side="bottom" className="w-48" forceMount>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(DATE_FILTERS).map((filter) => {
                                const FilterIcon = iconMap[filter.id] || Calendar;
                                const isSelected = filter.id === value;

                                return (
                                    <DropdownMenuItem
                                        key={filter.id}
                                        onClick={() => handleSelect(filter.id)}
                                        className="cursor-pointer"
                                    >
                                        <FilterIcon
                                            className={`h-4 w-4 ${isSelected ? "text-cyan-400" : "text-muted-foreground"
                                                }`}
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className={isSelected ? "text-cyan-400" : ""}>
                                                {filter.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {filter.description}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className="ml-auto h-4 w-4 text-cyan-400" />
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
