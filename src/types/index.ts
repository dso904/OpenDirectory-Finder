// File type category interface
export interface FileType {
    id: string;
    extensions: string;
    label: string;
    resType: string;
    icon: string;
    description: string;
}

// Search engine interface
export interface SearchEngine {
    id: string;
    name: string;
    url: string;
    icon: string;
    usesQuery: boolean;
    customHandler?: boolean;
    description: string;
}

// Search state
export interface SearchState {
    query: string;
    fileType: FileType;
    engine: SearchEngine;
    isSearching: boolean;
    error: string | null;
}

// Search configuration
export interface SearchConfig {
    fileTypes: Record<string, FileType>;
    searchEngines: Record<string, SearchEngine>;
    excludePatterns: {
        inurl: string[];
        sites: string[];
    };
}

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Search mode type
export type SearchMode = 'precise' | 'balanced' | 'broad';

// Date filter type
export type DateFilter = 'any' | 'past_day' | 'past_week' | 'past_month' | 'past_year';

// Search options for advanced features
export interface SearchOptions {
    mode: SearchMode;
    dateFilter: DateFilter;
    multiEngine: boolean;
    selectedEngines: string[];
}

// Search mode configuration
export interface SearchModeConfig {
    id: SearchMode;
    label: string;
    description: string;
    icon: string;
}

// Date filter configuration
export interface DateFilterConfig {
    id: DateFilter;
    label: string;
    description: string;
    googleParam?: string; // Google's tbs parameter
}
