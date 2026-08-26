"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphSiteService = void 0;
var tslib_1 = require("tslib");
var siteHelpers_1 = require("../utils/siteHelpers");
function toGraphApiPath(nextLink) {
    try {
        var parsed = new URL(nextLink);
        return "".concat(parsed.pathname.replace(/^\//, '')).concat(parsed.search);
    }
    catch (_a) {
        return nextLink.replace(/^\//, '');
    }
}
function isVisibleSite(site) {
    var webUrl = "".concat(site.webUrl || '').toLowerCase();
    if (webUrl.indexOf('contentstorage') !== -1 ||
        webUrl.indexOf('content storage') !== -1 ||
        webUrl.indexOf('appcatalog') !== -1 ||
        webUrl.indexOf('personal') !== -1 ||
        webUrl.indexOf('groupforanswersinvivaengagedonotdelete') !== -1) {
        return false;
    }
    return true;
}
function normalizeSite(site) {
    var _a, _b;
    var webUrl = site.webUrl || '';
    if (!webUrl) {
        return undefined;
    }
    var siteCollectionUrl = (0, siteHelpers_1.getSiteCollectionUrl)(webUrl);
    var siteCollectionName = (0, siteHelpers_1.getSiteCollectionNameFromUrl)(webUrl);
    var hostname = ((_a = site.siteCollection) === null || _a === void 0 ? void 0 : _a.hostName) || new URL(webUrl).host;
    return {
        id: site.id || (0, siteHelpers_1.buildIdFromUrl)(webUrl),
        name: site.displayName || site.name || siteCollectionName,
        url: webUrl,
        webUrl: webUrl,
        hostname: hostname,
        siteCollectionId: ((_b = site.siteCollection) === null || _b === void 0 ? void 0 : _b.id) || (0, siteHelpers_1.buildIdFromUrl)(siteCollectionUrl),
        siteCollectionName: siteCollectionName,
        owner: 'Tenant data',
        description: 'Discovered from Microsoft Graph.',
        template: 'SharePoint'
    };
}
var GraphSiteService = /** @class */ (function () {
    function GraphSiteService(msGraphClientFactory) {
        this.msGraphClientFactory = msGraphClientFactory;
    }
    GraphSiteService.prototype.getAllSites = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (options) {
            var graphClient, discoveredSites, seenIds, nextPath, pageNumber, response, pageSites, _i, pageSites_1, site;
            var _a;
            if (options === void 0) { options = {}; }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.msGraphClientFactory) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.msGraphClientFactory.getClient('3')];
                    case 1:
                        graphClient = _b.sent();
                        discoveredSites = [];
                        seenIds = new Set();
                        nextPath = 'sites?search=*';
                        pageNumber = 0;
                        _b.label = 2;
                    case 2:
                        if (!nextPath) return [3 /*break*/, 4];
                        pageNumber += 1;
                        return [4 /*yield*/, graphClient.api(nextPath).get()];
                    case 3:
                        response = _b.sent();
                        pageSites = (response.value || [])
                            .filter(function (site) { return isVisibleSite(site); })
                            .map(function (site) { return normalizeSite(site); })
                            .filter(function (site) { return Boolean(site); });
                        for (_i = 0, pageSites_1 = pageSites; _i < pageSites_1.length; _i++) {
                            site = pageSites_1[_i];
                            if (seenIds.has(site.id)) {
                                continue;
                            }
                            seenIds.add(site.id);
                            discoveredSites.push(site);
                        }
                        (_a = options.onProgress) === null || _a === void 0 ? void 0 : _a.call(options, {
                            discoveredCount: discoveredSites.length,
                            pageNumber: pageNumber
                        });
                        nextPath = response['@odata.nextLink'] ? toGraphApiPath(response['@odata.nextLink']) : undefined;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, discoveredSites];
                }
            });
        });
    };
    return GraphSiteService;
}());
exports.GraphSiteService = GraphSiteService;
//# sourceMappingURL=GraphSiteService.js.map