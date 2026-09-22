"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleCase = titleCase;
exports.normalizeSearch = normalizeSearch;
exports.containsSearch = containsSearch;
exports.normalizeSkillFolderName = normalizeSkillFolderName;
function titleCase(value) {
    return value
        .trim()
        .split(/\s+/)
        .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(); })
        .join(' ');
}
function normalizeSearch(value) {
    return value.trim().toLowerCase();
}
function containsSearch(haystack, needle) {
    return normalizeSearch(haystack).includes(normalizeSearch(needle));
}
function normalizeSkillFolderName(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}
//# sourceMappingURL=textHelpers.js.map