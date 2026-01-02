import { CONFIG } from "./config";
import type { FileType, SearchEngine } from "@/types";

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
export function buildSearchQuery(query: string, fileType: FileType): string {
    const parts: string[] = [sanitizeInput(query)];

    // Add file extension filter if not "all"
    if (fileType.extensions) {
        parts.push(`+(${fileType.extensions})`);
    }

    // Add "index of" pattern for directory listings
    parts.push('intitle:"index of"');

    // Exclude dynamic page types
    const excludeInurl = CONFIG.excludePatterns.inurl.join("|");
    parts.push(`-inurl:(${excludeInurl})`);

    // Exclude known spam/fake sites
    const excludeSites = CONFIG.excludePatterns.sites.join("|");
    parts.push(`-inurl:(${excludeSites})`);

    return parts.join(" ");
}

/**
 * Build the final search URL
 */
export function buildSearchUrl(
    query: string,
    fileType: FileType,
    engine: SearchEngine
): string {
    const sanitizedQuery = sanitizeInput(query);

    // FilePursuit has a different query format
    if (engine.customHandler && engine.id === "filepursuit") {
        return `${engine.url}${encodeURIComponent(sanitizedQuery)}&type=${fileType.resType}`;
    }

    // Standard search engines use our dork query
    const dorkQuery = buildSearchQuery(query, fileType);
    return `${engine.url}${encodeURIComponent(dorkQuery)}`;
}

/**
 * Execute search by opening in new tab
 */
export function executeSearch(
    query: string,
    fileType: FileType,
    engine: SearchEngine
): { success: boolean; error?: string; url?: string } {
    const validation = validateQuery(query);

    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    const url = buildSearchUrl(query, fileType, engine);

    try {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");

        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
            return {
                success: false,
                error: "Pop-up blocked! Please allow pop-ups for this site.",
            };
        }

        return { success: true, url };
    } catch (error) {
        return {
            success: false,
            error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
}
