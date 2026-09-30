"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSharePointDataService = exports.AgentAssetsLibraryNotFoundError = void 0;
exports.isAgentAssetsLibraryNotFoundError = isAgentAssetsLibraryNotFoundError;
var tslib_1 = require("tslib");
var sp_http_1 = require("@microsoft/sp-http");
var siteHelpers_1 = require("../utils/siteHelpers");
var textHelpers_1 = require("../utils/textHelpers");
var AGENT_ASSETS_FEATURE_ID = '9e14d30c-1e0d-4c8c-8dcb-a8d29f7d4c15';
var AgentAssetsLibraryNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(AgentAssetsLibraryNotFoundError, _super);
    function AgentAssetsLibraryNotFoundError(siteUrl) {
        var _this = _super.call(this, 'Agent Assets library was not found on the selected site.') || this;
        Object.setPrototypeOf(_this, AgentAssetsLibraryNotFoundError.prototype);
        _this.name = 'AgentAssetsLibraryNotFoundError';
        _this.siteUrl = siteUrl;
        return _this;
    }
    return AgentAssetsLibraryNotFoundError;
}(Error));
exports.AgentAssetsLibraryNotFoundError = AgentAssetsLibraryNotFoundError;
function isAgentAssetsLibraryNotFoundError(error) {
    return (error instanceof AgentAssetsLibraryNotFoundError ||
        (error instanceof Error && error.name === 'AgentAssetsLibraryNotFoundError' && typeof error.siteUrl === 'string'));
}
function buildIdFromUrl(url) {
    return url.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}
function getCollectionUrlFromSiteUrl(url) {
    var withoutTrailingSlash = url.replace(/\/$/, '');
    var parsed = new URL(withoutTrailingSlash);
    var segments = parsed.pathname.split('/').filter(Boolean);
    return segments.length <= 1 ? "".concat(parsed.protocol, "//").concat(parsed.host) : "".concat(parsed.protocol, "//").concat(parsed.host, "/").concat(segments[0], "/").concat(segments[1]);
}
function getCollectionNameFromUrl(url) {
    var parsed = new URL(url.replace(/\/$/, ''));
    var segments = parsed.pathname.split('/').filter(Boolean);
    return decodeURIComponent(segments[1] || parsed.host);
}
function getFileNameWithoutExtension(fileName) {
    return fileName.replace(/\.[^.]+$/, '');
}
function normalizeKey(value) {
    return (0, textHelpers_1.normalizeSearch)(value).replace(/\s+/g, ' ');
}
function escapeODataString(value) {
    return value.replace(/'/g, "''");
}
function toAbsoluteUrl(siteUrl, serverRelativeUrl) {
    if (/^https?:\/\//i.test(serverRelativeUrl)) {
        return serverRelativeUrl;
    }
    return "".concat(new URL(siteUrl).origin).concat(serverRelativeUrl.startsWith('/') ? '' : '/').concat(serverRelativeUrl);
}
function readSection(markdown, sectionTitle) {
    var pattern = new RegExp("^".concat(sectionTitle, ":\\s*$([\\s\\S]*?)(?=^\\w[^:\\n]*:\\s*$|$)"), 'im');
    var match = pattern.exec(markdown);
    if (!match || !match[1]) {
        return [];
    }
    return match[1]
        .split(/\r?\n/)
        .map(function (line) { return line.replace(/^[-*]\s*/, '').trim(); })
        .filter(function (line) { return Boolean(line); });
}
function getTitle(markdown, fallback) {
    var headingMatch = /^title:\s*(.+)$/im.exec(markdown) || /^#\s+(.+)$/m.exec(markdown);
    return headingMatch && headingMatch[1] ? headingMatch[1].replace(/^["']|["']$/g, '').trim() : fallback;
}
var TenantSharePointDataService = /** @class */ (function () {
    function TenantSharePointDataService(spHttpClient, siteUrl, msGraphClientFactory, fallbackUserName, fallbackUserEmail) {
        if (fallbackUserName === void 0) { fallbackUserName = 'User'; }
        if (fallbackUserEmail === void 0) { fallbackUserEmail = ''; }
        this.spHttpClient = spHttpClient;
        this.siteUrl = siteUrl;
        this.msGraphClientFactory = msGraphClientFactory;
        this.fallbackUserName = fallbackUserName;
        this.fallbackUserEmail = fallbackUserEmail;
    }
    TenantSharePointDataService.prototype.getCurrentUserAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (this._currentUserPromise) {
                    return [2 /*return*/, this._currentUserPromise];
                }
                this._currentUserPromise = (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var graphClient, me, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!this.msGraphClientFactory) return [3 /*break*/, 5];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, this.msGraphClientFactory.getClient('3')];
                            case 2:
                                graphClient = _b.sent();
                                return [4 /*yield*/, graphClient.api('me').select('displayName,mail,userPrincipalName').get()];
                            case 3:
                                me = _b.sent();
                                return [2 /*return*/, {
                                        displayName: me.displayName || this.fallbackUserName,
                                        email: me.mail || me.userPrincipalName || this.fallbackUserEmail
                                    }];
                            case 4:
                                _a = _b.sent();
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/, {
                                    displayName: this.fallbackUserName,
                                    email: this.fallbackUserEmail
                                }];
                        }
                    });
                }); })();
                return [2 /*return*/, this._currentUserPromise];
            });
        });
    };
    TenantSharePointDataService.prototype.getTenantSiteCollectionsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sites, collectionsById, _i, sites_1, site;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTenantSitesAsync()];
                    case 1:
                        sites = _a.sent();
                        collectionsById = new Map();
                        for (_i = 0, sites_1 = sites; _i < sites_1.length; _i++) {
                            site = sites_1[_i];
                            if (!collectionsById.has(site.siteCollectionId)) {
                                collectionsById.set(site.siteCollectionId, {
                                    id: site.siteCollectionId,
                                    name: site.siteCollectionName || getCollectionNameFromUrl(site.url),
                                    url: getCollectionUrlFromSiteUrl(site.url),
                                    owner: 'Tenant data',
                                    description: 'Discovered from Microsoft Graph.'
                                });
                            }
                        }
                        return [2 /*return*/, Array.from(collectionsById.values())];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getTenantSkillsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentUser, sites, skillsByKey, _loop_1, this_1, _i, sites_2, site;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCurrentUserAsync()];
                    case 1:
                        currentUser = _c.sent();
                        return [4 /*yield*/, this.getValidatedTenantSitesAsync()];
                    case 2:
                        sites = _c.sent();
                        skillsByKey = new Map();
                        _loop_1 = function (site) {
                            var skillsRootServerRelativeUrl, skillFiles, _d, skillFiles_1, skillFile, markdown, skillName, skillKey, siteIds, collectionIds, existing, siteRevisions, nextSkill;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!site.hasAgentAssetsLibrary || !site.agentAssetsRootFolderUrl) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        skillsRootServerRelativeUrl = "".concat(site.agentAssetsRootFolderUrl.replace(/\/$/, ''), "/skills");
                                        return [4 /*yield*/, this_1.getSkillMarkdownFilesAsync(site.url, skillsRootServerRelativeUrl)];
                                    case 1:
                                        skillFiles = _e.sent();
                                        _d = 0, skillFiles_1 = skillFiles;
                                        _e.label = 2;
                                    case 2:
                                        if (!(_d < skillFiles_1.length)) return [3 /*break*/, 5];
                                        skillFile = skillFiles_1[_d];
                                        return [4 /*yield*/, this_1.getMarkdownFileContentAsync(site.url, skillFile.ServerRelativeUrl || '')];
                                    case 3:
                                        markdown = _e.sent();
                                        skillName = getTitle(markdown, getFileNameWithoutExtension(skillFile.Name || 'Skill'));
                                        skillKey = normalizeKey(skillName);
                                        siteIds = skillsByKey.has(skillKey) ? new Set(((_a = skillsByKey.get(skillKey)) === null || _a === void 0 ? void 0 : _a.siteIds) || []) : new Set();
                                        collectionIds = skillsByKey.has(skillKey)
                                            ? new Set(((_b = skillsByKey.get(skillKey)) === null || _b === void 0 ? void 0 : _b.siteCollectionIds) || [])
                                            : new Set();
                                        siteIds.add(site.id);
                                        collectionIds.add(site.siteCollectionId);
                                        existing = skillsByKey.get(skillKey);
                                        siteRevisions = ((existing === null || existing === void 0 ? void 0 : existing.siteRevisions) || []).filter(function (revision) { return revision.siteId !== site.id; });
                                        siteRevisions.push({
                                            siteId: site.id,
                                            rawContent: markdown,
                                            modifiedDate: skillFile.TimeLastModified,
                                            skillFolderName: skillFile.folderName,
                                            skillFolderUrl: skillFile.folderServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.folderServerRelativeUrl) : undefined,
                                            skillFolderCreatedDate: skillFile.folderCreatedDate,
                                            skillFolderModifiedDate: skillFile.folderModifiedDate,
                                            skillMarkdownFileName: skillFile.Name,
                                            skillMarkdownUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
                                            skillMarkdownCreatedDate: skillFile.TimeCreated,
                                            skillMarkdownModifiedDate: skillFile.TimeLastModified,
                                            skillMarkdownSize: typeof skillFile.Length === 'number' ? skillFile.Length : undefined
                                        });
                                        nextSkill = {
                                            id: (existing === null || existing === void 0 ? void 0 : existing.id) || skillKey || buildIdFromUrl(skillFile.ServerRelativeUrl || "".concat(site.url, "/").concat(skillName)),
                                            name: skillName,
                                            description: readSection(markdown, 'description').join(' ') || "Skill discovered from ".concat(site.name, "."),
                                            owner: readSection(markdown, 'owner').join(' ') || currentUser.displayName,
                                            createdByEmail: currentUser.email,
                                            createdDate: (existing === null || existing === void 0 ? void 0 : existing.createdDate) || new Date().toISOString(),
                                            modifiedDate: new Date().toISOString(),
                                            instructions: readSection(markdown, 'instructions'),
                                            knowledgeSources: readSection(markdown, 'knowledge'),
                                            suggestedPrompts: readSection(markdown, 'suggested prompts'),
                                            usageCount: siteIds.size,
                                            siteIds: Array.from(siteIds.values()),
                                            siteCollectionIds: Array.from(collectionIds.values()),
                                            isOwnedByCurrentUser: true,
                                            source: 'tenant',
                                            originSiteUrl: site.url,
                                            originLibraryTitle: skillFile.folderName ? "AgentAssets/Skills/".concat(skillFile.folderName) : 'AgentAssets/Skills',
                                            sourceDocumentUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
                                            skillFolderName: skillFile.folderName,
                                            skillFolderUrl: skillFile.folderServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.folderServerRelativeUrl) : undefined,
                                            skillFolderCreatedDate: skillFile.folderCreatedDate,
                                            skillFolderModifiedDate: skillFile.folderModifiedDate,
                                            skillMarkdownFileName: skillFile.Name,
                                            skillMarkdownUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
                                            skillMarkdownCreatedDate: skillFile.TimeCreated,
                                            skillMarkdownModifiedDate: skillFile.TimeLastModified,
                                            skillMarkdownSize: typeof skillFile.Length === 'number' ? skillFile.Length : undefined,
                                            rawContent: markdown,
                                            siteRevisions: siteRevisions
                                        };
                                        skillsByKey.set(skillKey, nextSkill);
                                        _e.label = 4;
                                    case 4:
                                        _d++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, sites_2 = sites;
                        _c.label = 3;
                    case 3:
                        if (!(_i < sites_2.length)) return [3 /*break*/, 6];
                        site = sites_2[_i];
                        return [5 /*yield**/, _loop_1(site)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, Array.from(skillsByKey.values()).sort(function (left, right) { return right.usageCount - left.usageCount; })];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.createSkillAsync = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var reportProgress, normalizedSkillName, libraryInfo, skillsRootServerRelativeUrl, existingFolderNames, skillFolderServerRelativeUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportProgress = function (message) { var _a; return (_a = request.onProgress) === null || _a === void 0 ? void 0 : _a.call(request, message); };
                        normalizedSkillName = (0, textHelpers_1.normalizeSkillFolderName)(request.skillName);
                        if (!normalizedSkillName) {
                            throw new Error('Skill name must contain at least one letter or number.');
                        }
                        reportProgress('Locating the Agent Assets library…');
                        return [4 /*yield*/, this.getAgentAssetsLibraryAsync(request.siteUrl)];
                    case 1:
                        libraryInfo = _a.sent();
                        if (!libraryInfo) {
                            throw new AgentAssetsLibraryNotFoundError(request.siteUrl);
                        }
                        skillsRootServerRelativeUrl = "".concat(libraryInfo.rootFolderServerRelativeUrl.replace(/\/$/, ''), "/skills");
                        reportProgress('Preparing the skills folder…');
                        return [4 /*yield*/, this.ensureFolderExistsAsync(request.siteUrl, libraryInfo.rootFolderServerRelativeUrl, 'skills')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getChildFolderNamesAsync(request.siteUrl, skillsRootServerRelativeUrl)];
                    case 3:
                        existingFolderNames = _a.sent();
                        if (existingFolderNames.indexOf(normalizedSkillName) !== -1) {
                            throw new Error("A skill folder named \"".concat(normalizedSkillName, "\" already exists."));
                        }
                        skillFolderServerRelativeUrl = "".concat(skillsRootServerRelativeUrl, "/").concat(normalizedSkillName);
                        reportProgress("Creating skill folder \"".concat(normalizedSkillName, "\"\u2026"));
                        return [4 /*yield*/, this.createFolderAsync(request.siteUrl, skillsRootServerRelativeUrl, normalizedSkillName)];
                    case 4:
                        _a.sent();
                        reportProgress('Uploading SKILL.md…');
                        return [4 /*yield*/, this.createTextFileAsync(request.siteUrl, skillFolderServerRelativeUrl, 'SKILL.md', request.skillContent)];
                    case 5:
                        _a.sent();
                        reportProgress('Finalizing…');
                        return [2 /*return*/, {
                                normalizedSkillName: normalizedSkillName,
                                skillFolderUrl: "".concat(request.siteUrl.replace(/\/$/, ''), "/").concat(skillFolderServerRelativeUrl.replace(/^\//, '')),
                                skillMarkdownUrl: "".concat(request.siteUrl.replace(/\/$/, ''), "/").concat(skillFolderServerRelativeUrl.replace(/^\//, ''), "/SKILL.md")
                            }];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.isCurrentUserSiteCollectionAdminAsync = function (siteUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/currentuser?$select=IsSiteAdmin"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_c.sent());
                        return [2 /*return*/, Boolean((_a = data.IsSiteAdmin) !== null && _a !== void 0 ? _a : (_b = data.d) === null || _b === void 0 ? void 0 : _b.IsSiteAdmin)];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.deleteSkillAsync = function (request) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var reportProgress, isAuthorized, folderServerRelativeUrl, deleteResponse;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportProgress = function (message) { var _a; return (_a = request.onProgress) === null || _a === void 0 ? void 0 : _a.call(request, message); };
                        reportProgress('Checking permissions…');
                        return [4 /*yield*/, this.isCurrentUserSiteCollectionAdminAsync(request.siteUrl)];
                    case 1:
                        isAuthorized = _a.sent();
                        if (!isAuthorized) {
                            throw new Error('Only Site Collection Administrators or SharePoint Admins can delete a skill.');
                        }
                        folderServerRelativeUrl = new URL(request.skillFolderUrl).pathname;
                        reportProgress('Deleting skill folder…');
                        return [4 /*yield*/, this.spHttpClient.post("".concat(request.siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(folderServerRelativeUrl), "')"), sp_http_1.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'X-HTTP-Method': 'DELETE',
                                    'IF-MATCH': '*'
                                }
                            })];
                    case 2:
                        deleteResponse = _a.sent();
                        if (!deleteResponse.ok) {
                            throw new Error('Failed to delete the skill folder.');
                        }
                        reportProgress('Finalizing…');
                        return [2 /*return*/];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getTenantSitesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var graphClient, discovered, nextPath, response, _i, _a, site, collectionUrl;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.msGraphClientFactory) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.msGraphClientFactory.getClient('3')];
                    case 1:
                        graphClient = _d.sent();
                        discovered = [];
                        nextPath = 'sites?search=*';
                        _d.label = 2;
                    case 2:
                        if (!nextPath) return [3 /*break*/, 4];
                        return [4 /*yield*/, graphClient.api(nextPath).get()];
                    case 3:
                        response = _d.sent();
                        for (_i = 0, _a = response.value || []; _i < _a.length; _i++) {
                            site = _a[_i];
                            if (!site.webUrl || !(0, siteHelpers_1.isVisibleSite)(site)) {
                                continue;
                            }
                            collectionUrl = getCollectionUrlFromSiteUrl(site.webUrl);
                            discovered.push({
                                id: site.id || buildIdFromUrl(site.webUrl),
                                name: site.name || decodeURIComponent(site.webUrl.split('/').pop() || 'Site'),
                                url: site.webUrl,
                                webUrl: site.webUrl,
                                hostname: ((_b = site.siteCollection) === null || _b === void 0 ? void 0 : _b.hostName) || new URL(site.webUrl).host,
                                siteCollectionId: ((_c = site.siteCollection) === null || _c === void 0 ? void 0 : _c.id) || buildIdFromUrl(collectionUrl),
                                siteCollectionName: getCollectionNameFromUrl(site.webUrl),
                                owner: 'Tenant data',
                                description: 'Discovered from Microsoft Graph.',
                                template: 'SharePoint'
                            });
                        }
                        nextPath = response['@odata.nextLink'] ? response['@odata.nextLink'].replace(/^\//, '') : undefined;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, discovered];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getValidatedTenantSitesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sites, validated, _i, sites_3, site, libraryInfo;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTenantSitesAsync()];
                    case 1:
                        sites = _a.sent();
                        validated = [];
                        _i = 0, sites_3 = sites;
                        _a.label = 2;
                    case 2:
                        if (!(_i < sites_3.length)) return [3 /*break*/, 5];
                        site = sites_3[_i];
                        return [4 /*yield*/, this.getAgentAssetsLibraryAsync(site.url)];
                    case 3:
                        libraryInfo = _a.sent();
                        validated.push(tslib_1.__assign(tslib_1.__assign({}, site), { hasAgentAssetsLibrary: Boolean(libraryInfo), agentAssetsItemCount: libraryInfo ? libraryInfo.itemCount : 0, agentAssetsRootFolderUrl: libraryInfo === null || libraryInfo === void 0 ? void 0 : libraryInfo.rootFolderServerRelativeUrl }));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, validated];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getAgentAssetsLibraryAsync = function (siteUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data, rootFolderServerRelativeUrl;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/lists/GetByTitle('Agent Assets')?$select=Id,Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_b.sent());
                        rootFolderServerRelativeUrl = (_a = data.RootFolder) === null || _a === void 0 ? void 0 : _a.ServerRelativeUrl;
                        if (!rootFolderServerRelativeUrl) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, {
                                itemCount: data.ItemCount || 0,
                                rootFolderServerRelativeUrl: rootFolderServerRelativeUrl
                            }];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.activateAgentAssetsFeatureAsync = function (siteUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.post("".concat(siteUrl, "/_api/site/features/add(guid'").concat(AGENT_ASSETS_FEATURE_ID, "')"), sp_http_1.SPHttpClient.configurations.v1, {
                            headers: {
                                Accept: 'application/json;odata=nometadata',
                                'Content-Type': 'application/json;odata=nometadata'
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to activate the Agent Assets feature on the selected site.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.ensureFolderExistsAsync = function (siteUrl, parentFolderServerRelativeUrl, folderName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var folderResponse, createResponse;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString("".concat(parentFolderServerRelativeUrl, "/").concat(folderName)), "')?$select=ServerRelativeUrl"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        folderResponse = _a.sent();
                        if (folderResponse.ok) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.spHttpClient.post("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(parentFolderServerRelativeUrl), "')/Folders/add('").concat(escapeODataString(folderName), "')"), sp_http_1.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                }
                            })];
                    case 2:
                        createResponse = _a.sent();
                        if (!createResponse.ok) {
                            throw new Error("Failed to create the \"".concat(folderName, "\" folder in the Agent Assets library."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.createFolderAsync = function (siteUrl, parentFolderServerRelativeUrl, folderName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var createResponse;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.post("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(parentFolderServerRelativeUrl), "')/Folders/add('").concat(escapeODataString(folderName), "')"), sp_http_1.SPHttpClient.configurations.v1, {
                            headers: {
                                Accept: 'application/json;odata=nometadata',
                                'Content-Type': 'application/json;odata=nometadata'
                            }
                        })];
                    case 1:
                        createResponse = _a.sent();
                        if (!createResponse.ok) {
                            throw new Error("Failed to create the skill folder \"".concat(folderName, "\"."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.createTextFileAsync = function (siteUrl, folderServerRelativeUrl, fileName, content) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var createResponse;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.post("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(folderServerRelativeUrl), "')/Files/add(url='").concat(escapeODataString(fileName), "',overwrite=true)"), sp_http_1.SPHttpClient.configurations.v1, {
                            body: content,
                            headers: {
                                Accept: 'application/json;odata=nometadata',
                                'Content-Type': 'text/plain;charset=utf-8'
                            }
                        })];
                    case 1:
                        createResponse = _a.sent();
                        if (!createResponse.ok) {
                            throw new Error('Failed to create SKILL.md.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getChildFolderNamesAsync = function (siteUrl, folderServerRelativeUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(folderServerRelativeUrl), "')/Folders?$select=Name,ServerRelativeUrl"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_b.sent());
                        return [2 /*return*/, (data.value || ((_a = data.d) === null || _a === void 0 ? void 0 : _a.results) || [])
                                .map(function (folder) { return (folder.Name || '').trim(); })
                                .filter(function (name) { return Boolean(name); })];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getSkillMarkdownFilesAsync = function (siteUrl, skillsRootServerRelativeUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data, folders, skillFiles, _i, folders_1, folder, folderName, folderServerRelativeUrl, fileResponse, fileData, files, skillFile;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(skillsRootServerRelativeUrl), "')/Folders?$select=Name,ServerRelativeUrl,TimeCreated,TimeLastModified,ItemCount"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_c.sent());
                        folders = data.value || ((_a = data.d) === null || _a === void 0 ? void 0 : _a.results) || [];
                        skillFiles = [];
                        _i = 0, folders_1 = folders;
                        _c.label = 3;
                    case 3:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 7];
                        folder = folders_1[_i];
                        folderName = (folder.Name || '').trim();
                        if (!folderName) {
                            return [3 /*break*/, 6];
                        }
                        folderServerRelativeUrl = folder.ServerRelativeUrl || "".concat(skillsRootServerRelativeUrl, "/").concat(folderName);
                        return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/GetFolderByServerRelativeUrl('").concat(escapeODataString(folderServerRelativeUrl), "')/Files?$select=Name,ServerRelativeUrl,TimeCreated,TimeLastModified,Length"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 4:
                        fileResponse = _c.sent();
                        if (!fileResponse.ok) {
                            return [3 /*break*/, 6];
                        }
                        return [4 /*yield*/, fileResponse.json()];
                    case 5:
                        fileData = (_c.sent());
                        files = fileData.value || ((_b = fileData.d) === null || _b === void 0 ? void 0 : _b.results) || [];
                        skillFile = files.find(function (file) { return (file.Name || '').toLowerCase() === 'skill.md'; });
                        if (skillFile) {
                            skillFiles.push(tslib_1.__assign(tslib_1.__assign({}, skillFile), { ServerRelativeUrl: skillFile.ServerRelativeUrl || "".concat(folderServerRelativeUrl, "/Skill.md"), folderName: folderName, folderServerRelativeUrl: folderServerRelativeUrl, folderCreatedDate: folder.TimeCreated, folderModifiedDate: folder.TimeLastModified }));
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, skillFiles];
                }
            });
        });
    };
    TenantSharePointDataService.prototype.getMarkdownFileContentAsync = function (siteUrl, serverRelativeUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spHttpClient.get("".concat(siteUrl, "/_api/web/GetFileByServerRelativeUrl('").concat(serverRelativeUrl, "')/$value"), sp_http_1.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/, response.text()];
                }
            });
        });
    };
    return TenantSharePointDataService;
}());
exports.TenantSharePointDataService = TenantSharePointDataService;
//# sourceMappingURL=TenantSharePointDataService.js.map