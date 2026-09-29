"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = void 0;
var tslib_1 = require("tslib");
var GraphSiteService_1 = require("./GraphSiteService");
var SiteService = /** @class */ (function () {
    function SiteService(msGraphClientFactory, spHttpClient) {
        this.msGraphClientFactory = msGraphClientFactory;
        this.spHttpClient = spHttpClient;
    }
    SiteService.prototype.getSites = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (options) {
            var graphSiteService;
            if (options === void 0) { options = {}; }
            return tslib_1.__generator(this, function (_a) {
                graphSiteService = new GraphSiteService_1.GraphSiteService(this.msGraphClientFactory, this.spHttpClient);
                return [2 /*return*/, graphSiteService.getAllSites(options)];
            });
        });
    };
    SiteService.prototype.getSiteCollections = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (options) {
            var sites, collectionsById, _i, sites_1, site;
            if (options === void 0) { options = {}; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSites(options)];
                    case 1:
                        sites = _a.sent();
                        collectionsById = new Map();
                        for (_i = 0, sites_1 = sites; _i < sites_1.length; _i++) {
                            site = sites_1[_i];
                            if (collectionsById.has(site.siteCollectionId)) {
                                continue;
                            }
                            collectionsById.set(site.siteCollectionId, {
                                id: site.siteCollectionId,
                                name: site.siteCollectionName || site.name,
                                url: site.webUrl || site.url,
                                owner: site.owner,
                                description: "Discovered from Microsoft Graph".concat(site.hostname ? " on ".concat(site.hostname) : '', ".")
                            });
                        }
                        return [2 /*return*/, Array.from(collectionsById.values())];
                }
            });
        });
    };
    return SiteService;
}());
exports.SiteService = SiteService;
//# sourceMappingURL=SiteService.js.map