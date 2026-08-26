"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIdFromUrl = buildIdFromUrl;
exports.getSiteCollectionUrl = getSiteCollectionUrl;
exports.getSiteCollectionNameFromUrl = getSiteCollectionNameFromUrl;
function buildIdFromUrl(url) {
    return url.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}
function getSiteCollectionUrl(siteUrl) {
    var parsed = new URL(siteUrl);
    var pathSegments = parsed.pathname.split('/').filter(Boolean);
    if (pathSegments.length <= 1) {
        return "".concat(parsed.protocol, "//").concat(parsed.host);
    }
    return "".concat(parsed.protocol, "//").concat(parsed.host, "/").concat(pathSegments[0], "/").concat(pathSegments[1]);
}
function getSiteCollectionNameFromUrl(siteUrl) {
    var parsed = new URL(siteUrl);
    var pathSegments = parsed.pathname.split('/').filter(Boolean);
    if (pathSegments.length <= 1) {
        return parsed.host;
    }
    return decodeURIComponent(pathSegments[1]);
}
//# sourceMappingURL=siteHelpers.js.map