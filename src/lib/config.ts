import type { FileType, SearchEngine, SearchConfig } from "@/types";

export const FILE_TYPES: Record<string, FileType> = {
    all: {
        id: "all",
        extensions: "",
        label: "All Files",
        resType: "all",
        icon: "Asterisk",
        description: "Search all file types",
    },
    video: {
        id: "video",
        extensions: "mkv|mp4|avi|mov|mpg|wmv|divx|mpeg|webm|flv|m4v|ts|vob",
        label: "Video",
        resType: "video",
        icon: "Film",
        description: "Movies, TV Shows, Video files",
    },
    books: {
        id: "books",
        extensions: "pdf|epub|mobi|azw3|djvu|cbr|cbz|doc|docx|txt|rtf|odt|chm",
        label: "Books",
        resType: "ebook",
        icon: "BookOpen",
        description: "eBooks, PDFs, Documents",
    },
    music: {
        id: "music",
        extensions: "mp3|flac|wav|aac|ogg|wma|m4a|opus|alac|aiff",
        label: "Music",
        resType: "audio",
        icon: "Music",
        description: "Music, Audio files",
    },
    software: {
        id: "software",
        extensions: "exe|msi|dmg|pkg|deb|rpm|iso|img|apk|appx|tar|gz|7z|rar|zip",
        label: "Software",
        resType: "archive",
        icon: "Package",
        description: "Software, Games, ISOs, Archives",
    },
    images: {
        id: "images",
        extensions: "jpg|jpeg|png|gif|bmp|svg|webp|tiff|raw|psd|ai|eps",
        label: "Images",
        resType: "picture",
        icon: "Image",
        description: "Pictures, Photos, Graphics",
    },
    subtitles: {
        id: "subtitles",
        extensions: "srt|sub|ass|ssa|vtt|idx",
        label: "Subtitles",
        resType: "subtitle",
        icon: "Subtitles",
        description: "Subtitle files",
    },
};

export const SEARCH_ENGINES: Record<string, SearchEngine> = {
    google: {
        id: "google",
        name: "Google",
        url: "https://www.google.com/search?q=",
        icon: "Search",
        usesQuery: true,
        description: "Most comprehensive results",
    },
    duckduckgo: {
        id: "duckduckgo",
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=",
        icon: "Shield",
        usesQuery: true,
        description: "Privacy-focused search",
    },
    brave: {
        id: "brave",
        name: "Brave",
        url: "https://search.brave.com/search?q=",
        icon: "ShieldCheck",
        usesQuery: true,
        description: "Independent privacy search",
    },
    startpage: {
        id: "startpage",
        name: "Startpage",
        url: "https://www.startpage.com/sp/search?query=",
        icon: "Lock",
        usesQuery: true,
        description: "Anonymous Google results",
    },
    yandex: {
        id: "yandex",
        name: "Yandex",
        url: "https://yandex.com/search/?text=",
        icon: "Globe",
        usesQuery: true,
        description: "Good for Russian content",
    },
    filepursuit: {
        id: "filepursuit",
        name: "FilePursuit",
        url: "https://filepursuit.com/pursuit?q=",
        icon: "FolderSearch",
        usesQuery: false,
        customHandler: true,
        description: "Specialized file search",
    },
};

export const CONFIG: SearchConfig = {
    fileTypes: FILE_TYPES,
    searchEngines: SEARCH_ENGINES,
    excludePatterns: {
        inurl: ["jsp", "pl", "php", "html", "aspx", "htm", "cf", "shtml", "cgi"],
        sites: [
            "listen77",
            "mp3raid",
            "mp3toss",
            "mp3drug",
            "index_of",
            "index-of",
            "wallywashis",
            "downloadmana",
            "freemp3cloud",
        ],
    },
};

export const DEFAULT_FILE_TYPE = FILE_TYPES.all;
export const DEFAULT_ENGINE = SEARCH_ENGINES.google;

// Search mode configurations
export const SEARCH_MODES = {
    precise: {
        id: "precise" as const,
        label: "Precise",
        description: "Fewer results, higher quality",
        icon: "Target",
    },
    balanced: {
        id: "balanced" as const,
        label: "Balanced",
        description: "Default, good balance",
        icon: "Scale",
    },
    broad: {
        id: "broad" as const,
        label: "Broad",
        description: "More results, may include noise",
        icon: "Maximize",
    },
};

// Date filter configurations
export const DATE_FILTERS = {
    any: {
        id: "any" as const,
        label: "Any Time",
        description: "All results",
        googleParam: undefined,
    },
    past_day: {
        id: "past_day" as const,
        label: "Past 24 Hours",
        description: "Very recent",
        googleParam: "qdr:d",
    },
    past_week: {
        id: "past_week" as const,
        label: "Past Week",
        description: "Last 7 days",
        googleParam: "qdr:w",
    },
    past_month: {
        id: "past_month" as const,
        label: "Past Month",
        description: "Last 30 days",
        googleParam: "qdr:m",
    },
    past_year: {
        id: "past_year" as const,
        label: "Past Year",
        description: "Last 12 months",
        googleParam: "qdr:y",
    },
};

// Default search options
export const DEFAULT_SEARCH_OPTIONS = {
    mode: "balanced" as const,
    dateFilter: "any" as const,
    multiEngine: false,
    selectedEngines: ["google"],
};
