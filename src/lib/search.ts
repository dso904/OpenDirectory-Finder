import { CONFIG, DATE_FILTERS, DIRECTORY_PATTERNS, FAKE_DOWNLOAD_PHRASES } from "./config";
import type { FileType, SearchEngine, SearchOptions } from "@/types";

/**
 * Sanitize user input to prevent XSS and normalize whitespace
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== "string") {
        return "";
    }

    return input
        .trim()
        .replace(/[<>'"]/g, "") // Remove potential XSS chars
        .replace(/\s+/g, " ") // Normalize whitespace
        .substring(0, 500); // Limit length
}

/**
 * Validate search query
 */
export function validateQuery(query: string): { valid: boolean; error?: string } {
    const sanitized = sanitizeInput(query);

    if (!sanitized) {
        return { valid: false, error: "Please enter a search query" };
    }

    if (sanitized.length < 2) {
        return { valid: false, error: "Query must be at least 2 characters" };
    }

    if (sanitized.length > 500) {
        return { valid: false, error: "Query is too long (max 500 characters)" };
    }

    return { valid: true };
}

/**
 * Build file type filter using modern filetype: syntax
 */
function buildFileTypeFilter(fileType: FileType): string {
    if (!fileType.extensions) return "";

    const extensions = fileType.extensions.split("|");
    // Use first 5 extensions to keep query manageable
    const topExtensions = extensions.slice(0, 5);
    return topExtensions.map(ext => `filetype:${ext}`).join(" OR ");
}

/**
 * Build the open directory search query with enhanced filters
 */
export function buildSearchQuery(
    query: string,
    fileType: FileType,
    options?: SearchOptions
): string {
    const parts: string[] = [];
    const mode = options?.mode || "balanced";

    // 1. User's search query (sanitized)
    parts.push(sanitizeInput(query));

    // 2. Directory detection patterns (based on mode)
    if (mode === "precise") {
        // Precise: Use primary pattern + quality indicators
        parts.push(DIRECTORY_PATTERNS.primary);
        parts.push(DIRECTORY_PATTERNS.secondary);
        parts.push(DIRECTORY_PATTERNS.quality);
    } else if (mode === "balanced") {
        // Balanced: Primary + secondary patterns
        parts.push(DIRECTORY_PATTERNS.primary);
        parts.push(DIRECTORY_PATTERNS.secondary);
    } else {
        // Broad: Just primary pattern for maximum recall
        parts.push(DIRECTORY_PATTERNS.primary);
    }

    // 3. File type filters using modern filetype: syntax
    if (fileType.extensions) {
        const fileTypeFilter = buildFileTypeFilter(fileType);
        if (fileTypeFilter) {
            parts.push(`(${fileTypeFilter})`);
        }
    }

    // 4. Exclude dynamic page types
    const excludeInurl = CONFIG.excludePatterns.inurl.join("|");
    parts.push(`-inurl:(${excludeInurl})`);

    // 5. Exclude spam sites (limit to first 20 to keep query size manageable)
    const spamSites = CONFIG.excludePatterns.sites.slice(0, 20);
    parts.push(`-inurl:(${spamSites.join("|")})`);

    // 6. Exclude fake download phrases (for precise/balanced modes)
    if (mode !== "broad") {
        // Add first 2 fake phrases to exclude scam pages
        FAKE_DOWNLOAD_PHRASES.slice(0, 2).forEach(phrase => {
            parts.push(`-${phrase}`);
        });
    }

    return parts.join(" ");
}

/**
 * Build the final search URL with date filters
 */
export function buildSearchUrl(
    query: string,
    fileType: FileType,
    engine: SearchEngine,
    options?: SearchOptions
): string {
    const sanitizedQuery = sanitizeInput(query);

    // FilePursuit has a different query format
    if (engine.customHandler && engine.id === "filepursuit") {
        return `${engine.url}${encodeURIComponent(sanitizedQuery)}&type=${fileType.resType}`;
    }

    // Standard search engines use our dork query
    const dorkQuery = buildSearchQuery(query, fileType, options);
    let url = `${engine.url}${encodeURIComponent(dorkQuery)}`;

    // Add date filter for Google (and engines that support tbs parameter)
    if (options?.dateFilter && options.dateFilter !== "any") {
        const dateConfig = DATE_FILTERS[options.dateFilter];
        if (dateConfig?.googleParam) {
            // Google uses tbs parameter for time-based search
            if (engine.id === "google") {
                url += `&tbs=${dateConfig.googleParam}`;
            }
            // DuckDuckGo uses df parameter
            else if (engine.id === "duckduckgo") {
                const ddgMap: Record<string, string> = {
                    "qdr:d": "d",
                    "qdr:w": "w",
                    "qdr:m": "m",
                    "qdr:y": "y",
                };
                const ddgParam = ddgMap[dateConfig.googleParam];
                if (ddgParam) {
                    url += `&df=${ddgParam}`;
                }
            }
            // Brave uses freshness parameter
            else if (engine.id === "brave") {
                const braveMap: Record<string, string> = {
                    "qdr:d": "pd",
                    "qdr:w": "pw",
                    "qdr:m": "pm",
                    "qdr:y": "py",
                };
                const braveParam = braveMap[dateConfig.googleParam];
                if (braveParam) {
                    url += `&freshness=${braveParam}`;
                }
            }
        }
    }

    return url;
}

/**
 * Execute search by opening in new tab using link click (avoids popup blockers)
 */
export function executeSearch(
    query: string,
    fileType: FileType,
    engine: SearchEngine,
    options?: SearchOptions
): { success: boolean; error?: string; url?: string } {
    const validation = validateQuery(query);

    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    const url = buildSearchUrl(query, fileType, engine, options);

    try {
        // Create a temporary link and click it - this bypasses popup blockers
        // because it's a user-initiated action (form submit -> link click)
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { success: true, url };
    } catch (error) {
        return {
            success: false,
            error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}
