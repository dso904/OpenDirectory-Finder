import { CONFIG, DATE_FILTERS } from "./config";
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
 * Build the open directory search query with filters and exclusions
 */
export function buildSearchQuery(
    query: string,
    fileType: FileType,
    options?: SearchOptions
): string {
    const parts: string[] = [sanitizeInput(query)];

    // Add file extension filter if not "all"
    if (fileType.extensions) {
        parts.push(`+(${fileType.extensions})`);
    }

    // Add "index of" pattern for directory listings
    parts.push('intitle:"index of"');

    // Add "parent directory" for better results (based on search mode)
    if (!options || options.mode !== "broad") {
        parts.push('"parent directory"');
    }

    // Exclude dynamic page types
    const excludeInurl = CONFIG.excludePatterns.inurl.join("|");
    parts.push(`-inurl:(${excludeInurl})`);

    // Exclude known spam/fake sites
    const excludeSites = CONFIG.excludePatterns.sites.join("|");
    parts.push(`-inurl:(${excludeSites})`);

    // Add stricter filters for precise mode
    if (options?.mode === "precise") {
        parts.push('"last modified"');
        parts.push('"size"');
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
