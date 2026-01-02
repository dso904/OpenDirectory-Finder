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
