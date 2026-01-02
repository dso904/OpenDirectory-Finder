/**
 * OpenDirectory Finder - Main Application
 * 
 * Issue Fixes Applied:
 * - Issue 4: Added error handling with try-catch
 * - Issue 5: Updated dead search engines
 * - Issue 6: Added input validation and sanitization
 * - Issue 7: Uses addEventListener instead of inline handlers
 */

'use strict';

// ===== Configuration =====

const CONFIG = {
    // File type definitions with extensions and display info
    fileTypes: {
        video: {
            extensions: 'mkv|mp4|avi|mov|mpg|wmv|divx|mpeg|webm|flv|m4v',
            label: 'TV/Movies/Video',
            resType: 'video',
            icon: 'bi-film'
        },
        books: {
            extensions: 'MOBI|CBZ|CBR|CBC|CHM|EPUB|FB2|LIT|LRF|ODT|PDF|PRC|PDB|PML|RB|RTF|TCR|DOC|DOCX|TXT',
            label: 'Books',
            resType: 'ebook',
            icon: 'bi-book'
        },
        music: {
            extensions: 'mp3|wav|ac3|ogg|flac|wma|m4a|aac|mod|opus',
            label: 'Music',
            resType: 'audio',
            icon: 'bi-music-note-beamed'
        },
        software: {
            extensions: 'exe|iso|dmg|tar|7z|bz2|gz|rar|zip|apk|msi|deb|rpm|pkg',
            label: 'Software/ISO/Games',
            resType: 'archive',
            icon: 'bi-disc'
        },
        images: {
            extensions: 'jpg|jpeg|png|bmp|gif|tif|tiff|psd|svg|webp|raw',
            label: 'Images',
            resType: 'picture',
            icon: 'bi-image'
        },
        other: {
            extensions: '',
            label: 'All Files',
            resType: 'all',
            icon: 'bi-asterisk'
        }
    },

    // Search engine configurations (Issue 5: Updated URLs)
    searchEngines: {
        google: {
            name: 'Google',
            url: 'https://www.google.com/search?q=',
            icon: 'assets/icons/google.svg',
            usesQuery: true
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            url: 'https://duckduckgo.com/?q=',
            icon: 'assets/icons/duckduckgo.svg',
            usesQuery: true
        },
        startpage: {
            name: 'Startpage',
            url: 'https://www.startpage.com/sp/search?query=',
            icon: 'assets/icons/startpage.svg',
            usesQuery: true
        },
        brave: {
            name: 'Brave Search',
            url: 'https://search.brave.com/search?q=',
            icon: 'assets/icons/brave.svg',
            usesQuery: true
        },
        filepursuit: {
            name: 'FilePursuit',
            url: 'https://filepursuit.com/pursuit?q=',
            icon: 'assets/icons/filepursuit.svg',
            usesQuery: false,  // Uses different query format
            customHandler: true
        }
    },

    // Exclusion patterns for search query
    excludePatterns: {
        inurl: ['jsp', 'pl', 'php', 'html', 'aspx', 'htm', 'cf', 'shtml'],
        sites: ['listen77', 'mp3raid', 'mp3toss', 'mp3drug', 'index_of', 'index-of', 'wallywashis', 'downloadmana']
    },

    // Placeholder examples for each file type
    placeholders: {
        video: 'Search anything e.g. The.Blacklist.S01',
        books: 'Search anything e.g. 1984 George Orwell',
        music: 'Search anything e.g. Pink Floyd discography',
        software: 'Search anything e.g. Adobe Photoshop',
        images: 'Search anything e.g. nature wallpapers',
        other: 'Search anything...'
    }
};

// ===== State Management =====

const state = {
    currentFileType: 'other',
    currentEngine: 'google',
    isSearching: false
};

// ===== DOM Elements =====

let elements = {};

// ===== Utility Functions =====

/**
 * Sanitize user input to prevent XSS (Issue 6: Input validation)
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove potentially dangerous characters but keep search-relevant ones
    return input
        .trim()
        .replace(/[<>'"]/g, '') // Remove HTML/JS injection chars
        .replace(/\s+/g, ' ')   // Normalize whitespace
        .substring(0, 500);     // Limit length
}

/**
 * Validate that required elements exist
 * @returns {boolean} - True if all elements found
 */
function validateElements() {
    const requiredIds = ['query', 'fileType', 'resType', 'engine', 'ddbutton', 'egbutton', 'logo', 'searchForm'];
    
    for (const id of requiredIds) {
        if (!document.getElementById(id)) {
            console.error(`Required element #${id} not found`);
            return false;
        }
    }
    return true;
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 5000);
    }
    console.error('OpenDirectory Finder Error:', message);
}

/**
 * Build the search query with exclusion patterns
 * @param {string} query - User's search query
 * @param {string} fileType - File extensions to search for
 * @returns {string} - Complete search query
 */
function buildSearchQuery(query, fileType) {
    const parts = [query];
    
    // Add file type filter if specified
    if (fileType && fileType !== '') {
        parts.push(`+(${fileType})`);
    }
    
    // Add exclusion patterns
    const excludeInurl = CONFIG.excludePatterns.inurl.join('|');
    parts.push(`-inurl:(${excludeInurl})`);
    
    // Add index.of requirement
    parts.push('intitle:index.of');
    
    // Exclude known spam sites
    const excludeSites = CONFIG.excludePatterns.sites.join('|');
    parts.push(`-inurl:(${excludeSites})`);
    
    return parts.join(' ');
}

// ===== UI Functions =====

/**
 * Set the current file type filter
 * @param {string} typeKey - Key from CONFIG.fileTypes
 */
function setFiletype(typeKey) {
    try {
        const fileType = CONFIG.fileTypes[typeKey];
        if (!fileType) {
            throw new Error(`Unknown file type: ${typeKey}`);
        }
        
        state.currentFileType = typeKey;
        
        // Update hidden form fields
        elements.fileType.value = fileType.extensions;
        elements.resType.value = fileType.resType;
        
        // Update dropdown button
        elements.ddbutton.innerHTML = `<i class="${fileType.icon}"></i> ${fileType.label} <span class="caret"></span>`;
        
        // Update placeholder
        elements.query.placeholder = CONFIG.placeholders[typeKey] || CONFIG.placeholders.other;
        
        // Focus the search input
        elements.query.focus();
        
    } catch (error) {
        showError('Failed to set file type: ' + error.message);
    }
}

/**
 * Set the current search engine
 * @param {string} engineKey - Key from CONFIG.searchEngines
 */
function setEngine(engineKey) {
    try {
        const engine = CONFIG.searchEngines[engineKey];
        if (!engine) {
            throw new Error(`Unknown search engine: ${engineKey}`);
        }
        
        state.currentEngine = engineKey;
        
        // Update hidden form field
        elements.engine.value = engineKey;
        
        // Update engine button with icon
        elements.egbutton.innerHTML = `<i class="bi bi-search"></i> ${engine.name} <span class="caret"></span>`;
        
        // Update logo if element exists
        if (elements.logo && engine.icon) {
            elements.logo.src = engine.icon;
            elements.logo.alt = `${engine.name} logo`;
        }
        
        // Focus the search input
        elements.query.focus();
        
    } catch (error) {
        showError('Failed to set search engine: ' + error.message);
    }
}

/**
 * Execute the search
 */
function startSearch() {
    try {
        // Prevent double-submission
        if (state.isSearching) {
            return;
        }
        
        // Get and validate query (Issue 6: Input validation)
        const rawQuery = elements.query.value;
        const query = sanitizeInput(rawQuery);
        
        if (!query || query.length < 2) {
            showError('Please enter a search query (at least 2 characters)');
            elements.query.focus();
            return;
        }
        
        state.isSearching = true;
        
        const fileType = elements.fileType.value;
        const resType = elements.resType.value;
        const engineKey = elements.engine.value;
        const engine = CONFIG.searchEngines[engineKey];
        
        if (!engine) {
            throw new Error('Invalid search engine selected');
        }
        
        let url;
        
        // Handle FilePursuit differently (different API format)
        if (engine.customHandler && engineKey === 'filepursuit') {
            const fpQuery = query.replace(/ /g, '+');
            url = `https://filepursuit.com/pursuit?q=${encodeURIComponent(query)}&type=${resType}`;
        } else {
            // Build standard search query
            const finalQuery = buildSearchQuery(query, fileType);
            url = engine.url + encodeURIComponent(finalQuery);
        }
        
        console.log('Search URL:', url);
        
        // Open in new tab
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            showError('Pop-up blocked! Please allow pop-ups for this site.');
        }
        
    } catch (error) {
        showError('Search failed: ' + error.message);
    } finally {
        state.isSearching = false;
    }
}

// ===== Event Handlers (Issue 7: Using addEventListener) =====

/**
 * Handle file type dropdown item click
 * @param {Event} event - Click event
 */
function handleFileTypeClick(event) {
    event.preventDefault();
    const typeKey = event.currentTarget.dataset.type;
    if (typeKey) {
        setFiletype(typeKey);
    }
}

/**
 * Handle engine dropdown item click
 * @param {Event} event - Click event
 */
function handleEngineClick(event) {
    event.preventDefault();
    const engineKey = event.currentTarget.dataset.engine;
    if (engineKey) {
        setEngine(engineKey);
    }
}

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    startSearch();
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        elements.query.focus();
        elements.query.select();
    }
}

// ===== Initialization =====

/**
 * Initialize the application
 */
function init() {
    try {
        // Validate required elements exist
        if (!validateElements()) {
            throw new Error('Required page elements not found. Please refresh the page.');
        }
        
        // Cache DOM elements
        elements = {
            query: document.getElementById('query'),
            fileType: document.getElementById('fileType'),
            resType: document.getElementById('resType'),
            engine: document.getElementById('engine'),
            ddbutton: document.getElementById('ddbutton'),
            egbutton: document.getElementById('egbutton'),
            logo: document.getElementById('logo'),
            searchForm: document.getElementById('searchForm')
        };
        
        // Attach event listeners (Issue 7)
        elements.searchForm.addEventListener('submit', handleFormSubmit);
        
        // File type dropdown items
        document.querySelectorAll('[data-type]').forEach(item => {
            item.addEventListener('click', handleFileTypeClick);
        });
        
        // Engine dropdown items
        document.querySelectorAll('[data-engine]').forEach(item => {
            item.addEventListener('click', handleEngineClick);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
        
        // Set default values
        setFiletype('other');
        setEngine('google');
        
        // Focus the search input
        elements.query.focus();
        
        console.log('OpenDirectory Finder initialized successfully');
        
    } catch (error) {
        showError('Initialization failed: ' + error.message);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, sanitizeInput, buildSearchQuery, state };
}
