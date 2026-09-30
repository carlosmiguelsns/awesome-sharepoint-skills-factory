"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
var tslib_1 = require("tslib");
var TenantSharePointDataService_1 = require("./TenantSharePointDataService");
var SkillService = /** @class */ (function () {
    function SkillService(spHttpClient, siteUrl, msGraphClientFactory, currentUserName, currentUserEmail) {
        if (currentUserName === void 0) { currentUserName = 'User'; }
        if (currentUserEmail === void 0) { currentUserEmail = ''; }
        this.spHttpClient = spHttpClient;
        this.siteUrl = siteUrl;
        this.msGraphClientFactory = msGraphClientFactory;
        this.currentUserName = currentUserName;
        this.currentUserEmail = currentUserEmail;
    }
    SkillService.prototype.getAllSkillsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tenantService, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.spHttpClient && this.siteUrl)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        tenantService = new TenantSharePointDataService_1.TenantSharePointDataService(this.spHttpClient, this.siteUrl, this.msGraphClientFactory, this.currentUserName, this.currentUserEmail);
                        return [4 /*yield*/, tenantService.getTenantSkillsAsync()];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    };
    SkillService.prototype.getSkills = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (query) {
            var skills, needle;
            if (query === void 0) { query = {}; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllSkillsAsync()];
                    case 1:
                        skills = _a.sent();
                        needle = (query.searchText || '').trim().toLowerCase();
                        return [2 /*return*/, skills
                                .filter(function (skill) { return (query.ownedOnly ? skill.isOwnedByCurrentUser : true); })
                                .filter(function (skill) {
                                if (!needle) {
                                    return true;
                                }
                                var haystack = [
                                    skill.name,
                                    skill.description,
                                    skill.owner,
                                    skill.knowledgeSources.join(' '),
                                    skill.suggestedPrompts.join(' ')
                                ]
                                    .join(' ')
                                    .toLowerCase();
                                return haystack.indexOf(needle) !== -1;
                            })];
                }
            });
        });
    };
    SkillService.prototype.getMySkills = function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (searchText) {
            if (searchText === void 0) { searchText = ''; }
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSkills({ searchText: searchText, ownedOnly: true })];
            });
        });
    };
    SkillService.prototype.getSkillById = function (skillId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allSkills;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllSkillsAsync()];
                    case 1:
                        allSkills = _a.sent();
                        return [2 /*return*/, allSkills.find(function (skill) { return skill.id === skillId; })];
                }
            });
        });
    };
    SkillService.prototype.createSkill = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tenantService;
            return tslib_1.__generator(this, function (_a) {
                if (!this.spHttpClient || !this.siteUrl) {
                    throw new Error('SharePoint create support is not available.');
                }
                tenantService = new TenantSharePointDataService_1.TenantSharePointDataService(this.spHttpClient, this.siteUrl, this.msGraphClientFactory, this.currentUserName, this.currentUserEmail);
                return [2 /*return*/, tenantService.createSkillAsync(request)];
            });
        });
    };
    SkillService.prototype.deleteSkill = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tenantService;
            return tslib_1.__generator(this, function (_a) {
                if (!this.spHttpClient || !this.siteUrl) {
                    throw new Error('SharePoint delete support is not available.');
                }
                tenantService = new TenantSharePointDataService_1.TenantSharePointDataService(this.spHttpClient, this.siteUrl, this.msGraphClientFactory, this.currentUserName, this.currentUserEmail);
                return [2 /*return*/, tenantService.deleteSkillAsync(request)];
            });
        });
    };
    SkillService.prototype.activateAgentAssetsFeature = function (siteUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tenantService;
            return tslib_1.__generator(this, function (_a) {
                if (!this.spHttpClient || !this.siteUrl) {
                    throw new Error('SharePoint support is not available.');
                }
                tenantService = new TenantSharePointDataService_1.TenantSharePointDataService(this.spHttpClient, this.siteUrl, this.msGraphClientFactory, this.currentUserName, this.currentUserEmail);
                return [2 /*return*/, tenantService.activateAgentAssetsFeatureAsync(siteUrl)];
            });
        });
    };
    return SkillService;
}());
exports.SkillService = SkillService;
//# sourceMappingURL=SkillService.js.map