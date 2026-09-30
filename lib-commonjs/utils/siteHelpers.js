"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIdFromUrl = buildIdFromUrl;
exports.getSiteCollectionUrl = getSiteCollectionUrl;
exports.getSiteCollectionNameFromUrl = getSiteCollectionNameFromUrl;
exports.isTeamOrCommunicationSiteTemplate = isTeamOrCommunicationSiteTemplate;
exports.isVisibleSite = isVisibleSite;
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
var CREATABLE_SITE_WEB_TEMPLATES = new Set(['GROUP', 'STS', 'SITEPAGEPUBLISHING']);
function isTeamOrCommunicationSiteTemplate(webTemplate) {
    var normalized = (webTemplate || '').split('#')[0].trim().toUpperCase();
    return CREATABLE_SITE_WEB_TEMPLATES.has(normalized);
}
// Shared by both tenant site-discovery paths (GraphSiteService and
// TenantSharePointDataService) so system/non-content sites are excluded consistently
// everywhere, not just in the Sites/Usage view.
function isVisibleSite(site) {
    var webUrl = "".concat(site.webUrl || '').toLowerCase();
    var siteName = "".concat(site.displayName || site.name || '').toLowerCase();
    return (webUrl.indexOf('contentstorage') === -1 &&
        webUrl.indexOf('content storage') === -1 &&
        webUrl.indexOf('appcatalog') === -1 &&
        webUrl.indexOf('personal') === -1 &&
        webUrl.indexOf('groupforanswersinvivaengagedonotdelete') === -1 &&
        webUrl.indexOf('contenttypehub') === -1 &&
        siteName.indexOf('content type hub') === -1 &&
        webUrl.indexOf('allcompany') === -1 &&
        siteName.indexOf('all company') === -1);
}
//# sourceMappingURL=siteHelpers.js.map