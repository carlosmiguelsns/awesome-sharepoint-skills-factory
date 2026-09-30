"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillDetailsPanel;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var react_editor_1 = require("@toast-ui/react-editor");
require("@toast-ui/editor/dist/toastui-editor.css");
var dateHelpers_1 = require("../../utils/dateHelpers");
var siteHelpers_1 = require("../../utils/siteHelpers");
var TenantSharePointDataService_1 = require("../../services/TenantSharePointDataService");
var ActivateAgentAssetsDialog_1 = tslib_1.__importDefault(require("../ActivateAgentAssetsDialog"));
var SkillCompareDialog_1 = tslib_1.__importDefault(require("./SkillCompareDialog"));
var SITES_PAGE_SIZE = 8;
var useStyles = (0, react_components_1.makeStyles)({
    card: {
        boxShadow: 'none'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXS
    },
    metaLabel: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    siteMetaGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS,
        minWidth: 0
    },
    siteMetaValue: {
        display: 'block',
        lineHeight: react_components_1.tokens.lineHeightBase300
    },
    truncate: {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%'
    },
    sitesToolbar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalS,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sitesSearch: {
        flex: '1 1 240px',
        minWidth: '200px',
        maxWidth: '360px'
    },
    sitesGridCard: {
        overflow: 'hidden',
        boxShadow: 'none'
    },
    sitesGrid: {
        width: '100%'
    },
    sitesEmpty: {
        color: react_components_1.tokens.colorNeutralForeground3,
        padding: react_components_1.tokens.spacingVerticalM
    },
    sitesPagination: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: react_components_1.tokens.spacingHorizontalS
    },
    compareCheckbox: {
        margin: 0
    },
    previewDialogSurface: {
        maxWidth: '90vw',
        width: 'min(1100px, 90vw)'
    },
    previewSurface: {
        maxHeight: '65vh',
        overflow: 'auto',
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium
    },
    previewEmpty: {
        color: react_components_1.tokens.colorNeutralForeground3,
        padding: react_components_1.tokens.spacingVerticalM
    },
    sitesSectionHeader: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: react_components_1.tokens.spacingHorizontalS
    },
    deleteError: {
        color: react_components_1.tokens.colorPaletteRedForeground1
    },
    deleteConfirmButton: {
        backgroundColor: react_components_1.tokens.colorStatusDangerBackground3,
        color: react_components_1.tokens.colorNeutralForegroundOnBrand,
        ':hover': {
            backgroundColor: react_components_1.tokens.colorStatusDangerBackground3Hover,
            color: react_components_1.tokens.colorNeutralForegroundOnBrand
        },
        ':hover:active': {
            backgroundColor: react_components_1.tokens.colorStatusDangerBackground3Pressed,
            color: react_components_1.tokens.colorNeutralForegroundOnBrand
        }
    },
    dialogSpinner: {
        marginTop: react_components_1.tokens.spacingVerticalM,
        marginBottom: react_components_1.tokens.spacingVerticalM
    },
    cloneField: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    cloneTargetHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: react_components_1.tokens.spacingHorizontalS
    },
    cloneTargetList: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS,
        maxHeight: '220px',
        overflowY: 'auto',
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        padding: react_components_1.tokens.spacingVerticalS
    },
    cloneResultsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    cloneResultError: {
        color: react_components_1.tokens.colorPaletteRedForeground1
    }
});
function formatBytes(size) {
    if (!size || size <= 0) {
        return '—';
    }
    if (size < 1024) {
        return "".concat(size, " B");
    }
    var units = ['KB', 'MB', 'GB'];
    var value = size / 1024;
    var unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    return "".concat(value.toFixed(value >= 10 ? 0 : 1), " ").concat(units[unitIndex]);
}
function SkillDetailsPanel(props) {
    var _this = this;
    var _a, _b, _c;
    var styles = useStyles();
    var skill = props.skill;
    var _d = React.useState(undefined), previewSiteId = _d[0], setPreviewSiteId = _d[1];
    var _e = React.useState([]), compareSiteIds = _e[0], setCompareSiteIds = _e[1];
    var _f = React.useState(false), isCompareOpen = _f[0], setIsCompareOpen = _f[1];
    var _g = React.useState(''), siteSearchText = _g[0], setSiteSearchText = _g[1];
    var _h = React.useState(1), sitePage = _h[0], setSitePage = _h[1];
    var _j = React.useState(undefined), deleteTarget = _j[0], setDeleteTarget = _j[1];
    var _k = React.useState(false), isDeleting = _k[0], setIsDeleting = _k[1];
    var _l = React.useState(''), deleteError = _l[0], setDeleteError = _l[1];
    var _m = React.useState(undefined), cloneSource = _m[0], setCloneSource = _m[1];
    var _o = React.useState([]), cloneTargetCollectionIds = _o[0], setCloneTargetCollectionIds = _o[1];
    var _p = React.useState([]), cloneResults = _p[0], setCloneResults = _p[1];
    var _q = React.useState(false), isCloning = _q[0], setIsCloning = _q[1];
    var _r = React.useState(''), cloneStatus = _r[0], setCloneStatus = _r[1];
    var _s = React.useState(''), cloneError = _s[0], setCloneError = _s[1];
    var _t = React.useState(undefined), agentAssetsPromptSiteUrl = _t[0], setAgentAssetsPromptSiteUrl = _t[1];
    var _u = React.useState(false), isActivatingFeature = _u[0], setIsActivatingFeature = _u[1];
    var _v = React.useState(''), activateError = _v[0], setActivateError = _v[1];
    React.useEffect(function () {
        setPreviewSiteId(undefined);
        setCompareSiteIds([]);
        setIsCompareOpen(false);
        setSiteSearchText('');
        setSitePage(1);
        setDeleteTarget(undefined);
        setDeleteError('');
        setCloneSource(undefined);
        setCloneTargetCollectionIds([]);
        setCloneResults([]);
        setCloneError('');
        setAgentAssetsPromptSiteUrl(undefined);
        setActivateError('');
    }, [skill === null || skill === void 0 ? void 0 : skill.id]);
    var handleConfirmDelete = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteTarget) {
                        return [2 /*return*/];
                    }
                    setIsDeleting(true);
                    setDeleteError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, props.onDeleteSkillSite(deleteTarget.site, deleteTarget.skillFolderUrl)];
                case 2:
                    _a.sent();
                    setDeleteTarget(undefined);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setDeleteError(error_1 instanceof Error ? error_1.message : 'Failed to delete the skill.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsDeleting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [deleteTarget, props]);
    var revisionForSite = React.useCallback(function (siteId) { return ((skill === null || skill === void 0 ? void 0 : skill.siteRevisions) || []).find(function (revision) { return revision.siteId === siteId; }); }, [skill]);
    var toggleCompareSite = React.useCallback(function (siteId, checked) {
        setCompareSiteIds(function (current) {
            if (checked) {
                return current.indexOf(siteId) !== -1 || current.length >= 2 ? current : tslib_1.__spreadArray(tslib_1.__spreadArray([], current, true), [siteId], false);
            }
            return current.filter(function (id) { return id !== siteId; });
        });
    }, []);
    var siteCollectionForSite = React.useCallback(function (site) { return props.siteCollections.find(function (collection) { return collection.id === site.siteCollectionId; }); }, [props.siteCollections]);
    var resolveSiteForCollection = React.useCallback(function (collectionId) {
        var candidates = props.sites.filter(function (site) { return site.siteCollectionId === collectionId; });
        var collection = props.siteCollections.find(function (item) { return item.id === collectionId; });
        var rootSite = candidates.find(function (site) { return site.url.replace(/\/$/, '') === ((collection === null || collection === void 0 ? void 0 : collection.url) || '').replace(/\/$/, ''); });
        return rootSite || candidates[0];
    }, [props.sites, props.siteCollections]);
    var cloneTargetCollections = React.useMemo(function () {
        return skill
            ? props.siteCollections.filter(function (collection) {
                return skill.siteCollectionIds.indexOf(collection.id) === -1 &&
                    props.sites.some(function (site) { return site.siteCollectionId === collection.id && (0, siteHelpers_1.isTeamOrCommunicationSiteTemplate)(site.template); });
            })
            : [];
    }, [props.siteCollections, props.sites, skill]);
    var toggleCloneTargetCollection = React.useCallback(function (collectionId, checked) {
        setCloneTargetCollectionIds(function (current) {
            if (checked) {
                return current.indexOf(collectionId) !== -1 ? current : tslib_1.__spreadArray(tslib_1.__spreadArray([], current, true), [collectionId], false);
            }
            return current.filter(function (id) { return id !== collectionId; });
        });
    }, []);
    var handleToggleSelectAllCloneTargets = React.useCallback(function (checked) {
        setCloneTargetCollectionIds(checked ? cloneTargetCollections.map(function (collection) { return collection.id; }) : []);
    }, [cloneTargetCollections]);
    var handleConfirmClone = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var successfulIds, pendingCollectionIds, nextResults, _loop_1, index, state_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cloneSource || !skill || !cloneTargetCollectionIds.length) {
                        return [2 /*return*/];
                    }
                    successfulIds = new Set(cloneResults.filter(function (result) { return result.status === 'success'; }).map(function (result) { return result.collectionId; }));
                    pendingCollectionIds = cloneTargetCollectionIds.filter(function (id) { return !successfulIds.has(id); });
                    if (!pendingCollectionIds.length) {
                        return [2 /*return*/];
                    }
                    setIsCloning(true);
                    setCloneError('');
                    nextResults = cloneResults.filter(function (result) { return successfulIds.has(result.collectionId); });
                    _loop_1 = function (index) {
                        var collectionId, collection, collectionName, targetSite, error_2;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    collectionId = pendingCollectionIds[index];
                                    collection = cloneTargetCollections.find(function (item) { return item.id === collectionId; });
                                    collectionName = (collection === null || collection === void 0 ? void 0 : collection.name) || 'the selected site collection';
                                    targetSite = resolveSiteForCollection(collectionId);
                                    if (!targetSite) {
                                        nextResults.push({ collectionId: collectionId, collectionName: collectionName, status: 'error', message: 'Could not resolve a destination site for that site collection.' });
                                        return [2 /*return*/, "continue"];
                                    }
                                    setCloneStatus("Copying to ".concat(collectionName, " (").concat(nextResults.length + 1, "/").concat(cloneTargetCollectionIds.length, ")\u2026"));
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, props.onCreateSkill({
                                            siteUrl: targetSite.url,
                                            skillName: skill.name,
                                            skillContent: cloneSource.skillContent,
                                            onProgress: function (message) { return setCloneStatus("".concat(collectionName, ": ").concat(message)); }
                                        })];
                                case 2:
                                    _b.sent();
                                    nextResults.push({ collectionId: collectionId, collectionName: collectionName, status: 'success' });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _b.sent();
                                    if ((0, TenantSharePointDataService_1.isAgentAssetsLibraryNotFoundError)(error_2)) {
                                        setCloneResults(nextResults);
                                        setCloneStatus('');
                                        setIsCloning(false);
                                        setAgentAssetsPromptSiteUrl(error_2.siteUrl);
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    nextResults.push({ collectionId: collectionId, collectionName: collectionName, status: 'error', message: error_2 instanceof Error ? error_2.message : 'Failed to copy the skill.' });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < pendingCollectionIds.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(index)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4:
                    setCloneResults(nextResults);
                    setCloneStatus('');
                    setIsCloning(false);
                    if (nextResults.every(function (result) { return result.status === 'success'; })) {
                        setCloneSource(undefined);
                        setCloneTargetCollectionIds([]);
                        setCloneResults([]);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [cloneResults, cloneSource, cloneTargetCollectionIds, cloneTargetCollections, props, resolveSiteForCollection, skill]);
    var handleCancelActivateFeature = React.useCallback(function () {
        setAgentAssetsPromptSiteUrl(undefined);
        setActivateError('');
    }, []);
    var handleConfirmActivateFeature = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var activationError_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!agentAssetsPromptSiteUrl) {
                        return [2 /*return*/];
                    }
                    setIsActivatingFeature(true);
                    setActivateError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, props.onActivateAgentAssetsFeature(agentAssetsPromptSiteUrl)];
                case 2:
                    _a.sent();
                    setAgentAssetsPromptSiteUrl(undefined);
                    return [4 /*yield*/, handleConfirmClone()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    activationError_1 = _a.sent();
                    setActivateError(activationError_1 instanceof Error ? activationError_1.message : 'Failed to activate the Agent Assets feature.');
                    return [3 /*break*/, 6];
                case 5:
                    setIsActivatingFeature(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [agentAssetsPromptSiteUrl, handleConfirmClone, props]);
    var skillSites = React.useMemo(function () { return (skill ? props.sites.filter(function (site) { return skill.siteIds.indexOf(site.id) !== -1; }) : []); }, [props.sites, skill]);
    var filteredSkillSites = React.useMemo(function () {
        var needle = siteSearchText.trim().toLowerCase();
        if (!needle) {
            return skillSites;
        }
        return skillSites.filter(function (site) {
            var _a;
            var collectionName = ((_a = siteCollectionForSite(site)) === null || _a === void 0 ? void 0 : _a.name) || site.siteCollectionName || '';
            return [site.name, site.webUrl, site.url, collectionName].filter(Boolean).join(' ').toLowerCase().indexOf(needle) !== -1;
        });
    }, [siteCollectionForSite, siteSearchText, skillSites]);
    var sitesPageCount = Math.max(1, Math.ceil(filteredSkillSites.length / SITES_PAGE_SIZE));
    var safeSitesPage = Math.min(sitePage, sitesPageCount);
    var pagedSkillSites = filteredSkillSites.slice((safeSitesPage - 1) * SITES_PAGE_SIZE, safeSitesPage * SITES_PAGE_SIZE);
    React.useEffect(function () {
        setSitePage(1);
    }, [siteSearchText]);
    var hasCompareColumn = skillSites.length > 1;
    var columnWidths = hasCompareColumn
        ? { compare: '28px', site: '19%', folder: '35%', file: '35%', actions: '84px' }
        : { site: '20%', folder: '36%', file: '36%', actions: '84px' };
    var columns = React.useMemo(function () {
        var definitions = [];
        if (hasCompareColumn) {
            definitions.push((0, react_components_1.createTableColumn)({
                columnId: 'compare',
                renderHeaderCell: function () { return null; },
                renderCell: function (site) {
                    var isSelectedForCompare = compareSiteIds.indexOf(site.id) !== -1;
                    return (React.createElement(react_components_1.Checkbox, { className: styles.compareCheckbox, checked: isSelectedForCompare, disabled: !isSelectedForCompare && compareSiteIds.length >= 2, "aria-label": "Select ".concat(site.name, " to compare"), onChange: function (_, data) { return toggleCompareSite(site.id, Boolean(data.checked)); } }));
                }
            }));
        }
        definitions.push((0, react_components_1.createTableColumn)({
            columnId: 'site',
            renderHeaderCell: function () { return 'Site'; },
            renderCell: function (site) { return React.createElement(react_components_1.Text, { weight: "semibold", title: site.name, className: styles.truncate }, site.name); }
        }), (0, react_components_1.createTableColumn)({
            columnId: 'folder',
            renderHeaderCell: function () { return 'Folder'; },
            renderCell: function (site) {
                var siteCollection = siteCollectionForSite(site);
                var revision = revisionForSite(site.id);
                var folderName = (revision === null || revision === void 0 ? void 0 : revision.skillFolderName) || (skill === null || skill === void 0 ? void 0 : skill.skillFolderName) || 'Open folder';
                var folderCreatedDate = (revision === null || revision === void 0 ? void 0 : revision.skillFolderCreatedDate) || (skill === null || skill === void 0 ? void 0 : skill.skillFolderCreatedDate);
                var folderModifiedDate = (revision === null || revision === void 0 ? void 0 : revision.skillFolderModifiedDate) || (skill === null || skill === void 0 ? void 0 : skill.skillFolderModifiedDate);
                var folderMeta = "Created ".concat(folderCreatedDate ? (0, dateHelpers_1.formatLongDate)(folderCreatedDate) : '—', " \u00B7 Modified ").concat(folderModifiedDate ? (0, dateHelpers_1.formatLongDate)(folderModifiedDate) : '—');
                return (React.createElement("div", { className: styles.siteMetaGroup },
                    React.createElement(react_components_1.Link, { className: styles.truncate, title: folderName, href: (revision === null || revision === void 0 ? void 0 : revision.skillFolderUrl) || (skill === null || skill === void 0 ? void 0 : skill.skillFolderUrl) || (siteCollection === null || siteCollection === void 0 ? void 0 : siteCollection.url) || site.url, target: "_blank", rel: "noreferrer" }, folderName),
                    React.createElement(react_components_1.Caption1, { className: (0, react_components_1.mergeClasses)(styles.metaLabel, styles.truncate), title: folderMeta }, folderMeta)));
            }
        }), (0, react_components_1.createTableColumn)({
            columnId: 'file',
            renderHeaderCell: function () { return 'Skill file'; },
            renderCell: function (site) {
                var _a;
                var revision = revisionForSite(site.id);
                var fileName = (revision === null || revision === void 0 ? void 0 : revision.skillMarkdownFileName) || (skill === null || skill === void 0 ? void 0 : skill.skillMarkdownFileName) || 'SKILL.md';
                var fileModifiedDate = (revision === null || revision === void 0 ? void 0 : revision.skillMarkdownModifiedDate) || (skill === null || skill === void 0 ? void 0 : skill.skillMarkdownModifiedDate);
                var fileMeta = "Modified ".concat(fileModifiedDate ? (0, dateHelpers_1.formatLongDate)(fileModifiedDate) : '—', " \u00B7 ").concat(formatBytes((_a = revision === null || revision === void 0 ? void 0 : revision.skillMarkdownSize) !== null && _a !== void 0 ? _a : skill === null || skill === void 0 ? void 0 : skill.skillMarkdownSize));
                return (React.createElement("div", { className: styles.siteMetaGroup },
                    React.createElement(react_components_1.Link, { className: styles.truncate, title: fileName, onClick: function () { return setPreviewSiteId(site.id); } }, fileName),
                    React.createElement(react_components_1.Caption1, { className: (0, react_components_1.mergeClasses)(styles.metaLabel, styles.truncate), title: fileMeta }, fileMeta)));
            }
        }), (0, react_components_1.createTableColumn)({
            columnId: 'actions',
            renderHeaderCell: function () { return null; },
            renderCell: function (site) {
                var revision = revisionForSite(site.id);
                var skillFolderUrl = revision === null || revision === void 0 ? void 0 : revision.skillFolderUrl;
                var skillContent = revision === null || revision === void 0 ? void 0 : revision.rawContent;
                return (React.createElement(React.Fragment, null,
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: React.createElement(react_icons_1.DocumentCopy24Regular, null), "aria-label": "Copy skill from ".concat(site.name, " to another site collection"), disabled: !skillContent || !cloneTargetCollections.length, onClick: function () { return skillContent && setCloneSource({ site: site, skillContent: skillContent }); } }),
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: React.createElement(react_icons_1.Delete24Regular, null), "aria-label": "Delete skill from ".concat(site.name), disabled: !skillFolderUrl, onClick: function () { return skillFolderUrl && setDeleteTarget({ site: site, skillFolderUrl: skillFolderUrl }); } })));
            }
        }));
        return definitions;
    }, [cloneTargetCollections.length, compareSiteIds, hasCompareColumn, revisionForSite, siteCollectionForSite, skill, styles, toggleCompareSite]);
    if (!skill) {
        return (React.createElement(react_components_1.Card, { className: styles.card },
            React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill details"), description: React.createElement(react_components_1.Body1, null, "Select a skill to inspect its usage."), action: props.onClose ? React.createElement(react_components_1.Button, { appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close skill details", onClick: props.onClose }) : undefined })));
    }
    var compareSiteA = skillSites.find(function (site) { return site.id === compareSiteIds[0]; });
    var compareSiteB = skillSites.find(function (site) { return site.id === compareSiteIds[1]; });
    return (React.createElement(react_components_1.Card, { className: styles.card },
        React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name), action: props.onClose ? React.createElement(react_components_1.Button, { appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close skill details", onClick: props.onClose }) : undefined }),
        React.createElement(react_components_1.Dialog, { open: previewSiteId !== undefined, onOpenChange: function (_, data) { return setPreviewSiteId(data.open ? previewSiteId : undefined); } },
            React.createElement(react_components_1.DialogSurface, { className: styles.previewDialogSurface },
                React.createElement(react_components_1.DialogBody, null,
                    React.createElement(react_components_1.DialogTitle, null, (previewSiteId ? (_a = revisionForSite(previewSiteId)) === null || _a === void 0 ? void 0 : _a.skillMarkdownFileName : undefined) || skill.skillMarkdownFileName || 'SKILL.md'),
                    React.createElement(react_components_1.DialogContent, null, previewSiteId && ((_b = revisionForSite(previewSiteId)) === null || _b === void 0 ? void 0 : _b.rawContent) ? (React.createElement("div", { className: styles.previewSurface },
                        React.createElement(react_editor_1.Viewer, { key: previewSiteId, initialValue: (_c = revisionForSite(previewSiteId)) === null || _c === void 0 ? void 0 : _c.rawContent }))) : (React.createElement(react_components_1.Body1, { className: styles.previewEmpty }, "No content available to preview for this skill."))),
                    React.createElement(react_components_1.DialogActions, null,
                        React.createElement(react_components_1.Button, { appearance: "secondary", onClick: function () { return setPreviewSiteId(undefined); } }, "Close"))))),
        compareSiteA && compareSiteB ? (React.createElement(SkillCompareDialog_1.default, { open: isCompareOpen, onOpenChange: setIsCompareOpen, skill: skill, siteA: compareSiteA, siteB: compareSiteB })) : null,
        React.createElement(react_components_1.Dialog, { open: Boolean(deleteTarget), onOpenChange: function (_, data) { if (!data.open && !isDeleting) {
                setDeleteTarget(undefined);
                setDeleteError('');
            } } },
            React.createElement(react_components_1.DialogSurface, null,
                React.createElement(react_components_1.DialogBody, null,
                    React.createElement(react_components_1.DialogTitle, null, "Delete this skill?"),
                    React.createElement(react_components_1.DialogContent, null,
                        isDeleting ? (React.createElement(react_components_1.Spinner, { className: styles.dialogSpinner, label: "Deleting the skill folder and its contents\u2026" })) : (React.createElement(React.Fragment, null,
                            React.createElement(react_components_1.Body1, null,
                                "This permanently deletes the \u201C",
                                skill.name,
                                "\u201D skill folder from ",
                                React.createElement("strong", null, deleteTarget === null || deleteTarget === void 0 ? void 0 : deleteTarget.site.name),
                                " - including SKILL.md and everything else inside the folder. This can\u2019t be undone."),
                            React.createElement(react_components_1.Body1, null, "Only Site Collection Administrators or SharePoint Admins for this site can do this."))),
                        deleteError ? React.createElement(react_components_1.Body1, { className: styles.deleteError }, deleteError) : null),
                    React.createElement(react_components_1.DialogActions, null,
                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: isDeleting, onClick: function () { setDeleteTarget(undefined); setDeleteError(''); } }, "Cancel"),
                        React.createElement(react_components_1.Button, { appearance: "primary", className: styles.deleteConfirmButton, disabled: isDeleting, onClick: function () { void handleConfirmDelete(); } }, isDeleting ? 'Deleting…' : 'Delete skill'))))),
        React.createElement(react_components_1.Dialog, { open: Boolean(cloneSource), onOpenChange: function (_, data) { if (!data.open && !isCloning) {
                setCloneSource(undefined);
                setCloneTargetCollectionIds([]);
                setCloneResults([]);
                setCloneError('');
            } } },
            React.createElement(react_components_1.DialogSurface, null,
                React.createElement(react_components_1.DialogBody, null,
                    React.createElement(react_components_1.DialogTitle, null, "Copy skill to other site collections"),
                    React.createElement(react_components_1.DialogContent, null,
                        isCloning ? (React.createElement(react_components_1.Spinner, { className: styles.dialogSpinner, label: cloneStatus || 'Copying skill…' })) : (React.createElement(React.Fragment, null,
                            React.createElement(react_components_1.Body1, null,
                                "Copies the \u201C",
                                skill.name,
                                "\u201D SKILL.md content from ",
                                React.createElement("strong", null, cloneSource === null || cloneSource === void 0 ? void 0 : cloneSource.site.name),
                                " into a new skill folder in each site collection you select below."),
                            cloneTargetCollections.length ? (React.createElement("div", { className: styles.cloneField },
                                React.createElement("div", { className: styles.cloneTargetHeader },
                                    React.createElement(react_components_1.Text, { weight: "semibold" }, "Destination site collections"),
                                    React.createElement(react_components_1.Checkbox, { label: "Select all", checked: cloneTargetCollectionIds.length === cloneTargetCollections.length, onChange: function (_, data) { return handleToggleSelectAllCloneTargets(Boolean(data.checked)); } })),
                                React.createElement("div", { className: styles.cloneTargetList }, cloneTargetCollections.map(function (collection) { return (React.createElement(react_components_1.Checkbox, { key: collection.id, label: collection.name, checked: cloneTargetCollectionIds.indexOf(collection.id) !== -1, onChange: function (_, data) { return toggleCloneTargetCollection(collection.id, Boolean(data.checked)); } })); })))) : (React.createElement(react_components_1.Body1, { className: styles.metaLabel }, "This skill already exists in every discovered site collection.")),
                            cloneResults.length ? (React.createElement("div", { className: styles.cloneResultsList, role: "status", "aria-live": "polite" }, cloneResults.map(function (result) { return (React.createElement(react_components_1.Caption1, { key: result.collectionId, className: result.status === 'error' ? styles.cloneResultError : undefined },
                                React.createElement("span", { "aria-hidden": "true" },
                                    result.status === 'success' ? '✓' : '✗',
                                    " "),
                                result.status === 'success' ? 'Copied' : 'Failed',
                                " to ",
                                result.collectionName,
                                result.message ? ": ".concat(result.message) : '')); }))) : null)),
                        cloneError ? React.createElement(react_components_1.Body1, { className: styles.deleteError }, cloneError) : null),
                    React.createElement(react_components_1.DialogActions, null,
                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: isCloning, onClick: function () { setCloneSource(undefined); setCloneTargetCollectionIds([]); setCloneResults([]); setCloneError(''); } }, "Cancel"),
                        React.createElement(react_components_1.Button, { appearance: "primary", disabled: isCloning || !cloneTargetCollectionIds.length, onClick: function () { void handleConfirmClone(); } }, isCloning ? 'Copying…' : cloneResults.some(function (result) { return result.status === 'error'; }) ? 'Retry failed' : 'Copy skill'))))),
        React.createElement(ActivateAgentAssetsDialog_1.default, { open: Boolean(agentAssetsPromptSiteUrl), siteUrl: agentAssetsPromptSiteUrl, isActivating: isActivatingFeature, error: activateError, onConfirm: function () { void handleConfirmActivateFeature(); }, onCancel: handleCancelActivateFeature }),
        React.createElement("div", { className: styles.root },
            React.createElement("div", { className: styles.section },
                React.createElement("div", { className: styles.sitesSectionHeader },
                    React.createElement(react_components_1.Caption1, null,
                        "Sites where this skill exists (",
                        skillSites.length,
                        ")"),
                    skillSites.length > 1 ? (React.createElement(react_components_1.Button, { appearance: "secondary", size: "small", disabled: !compareSiteA || !compareSiteB, onClick: function () { return setIsCompareOpen(true); } },
                        "Compare selected sites",
                        compareSiteIds.length ? " (".concat(compareSiteIds.length, "/2)") : '')) : null),
                skillSites.length > SITES_PAGE_SIZE ? (React.createElement("div", { className: styles.sitesToolbar },
                    React.createElement(react_components_1.Input, { className: styles.sitesSearch, contentBefore: React.createElement(react_icons_1.Search24Regular, null), value: siteSearchText, onChange: function (_, data) { return setSiteSearchText(data.value); }, placeholder: "Search sites or site collections" }),
                    React.createElement(react_components_1.Caption1, { className: styles.metaLabel },
                        "Showing ",
                        pagedSkillSites.length,
                        " of ",
                        filteredSkillSites.length))) : null,
                React.createElement(react_components_1.Card, { className: styles.sitesGridCard }, filteredSkillSites.length ? (React.createElement(react_components_1.DataGrid, { className: styles.sitesGrid, items: pagedSkillSites, columns: columns, getRowId: function (site) { return site.id; } },
                    React.createElement(react_components_1.DataGridHeader, null,
                        React.createElement(react_components_1.DataGridRow, null, function (_a) {
                            var renderHeaderCell = _a.renderHeaderCell, columnId = _a.columnId;
                            return (React.createElement(react_components_1.DataGridHeaderCell, { "aria-label": columnId === 'compare' ? 'Compare' : columnId === 'actions' ? 'Actions' : undefined, style: columnId === 'compare' || columnId === 'actions'
                                    ? { width: columnWidths[columnId], padding: 0 }
                                    : { width: columnWidths[columnId], paddingLeft: react_components_1.tokens.spacingHorizontalM, paddingRight: react_components_1.tokens.spacingHorizontalM } }, renderHeaderCell()));
                        })),
                    React.createElement(react_components_1.DataGridBody, null, function (_a) {
                        var item = _a.item, rowId = _a.rowId;
                        return (React.createElement(react_components_1.DataGridRow, { key: rowId }, function (_a) {
                            var renderCell = _a.renderCell, columnId = _a.columnId;
                            return (React.createElement(react_components_1.DataGridCell, { style: columnId === 'compare' || columnId === 'actions'
                                    ? { width: columnWidths[columnId], padding: 0, justifyContent: 'center' }
                                    : { width: columnWidths[columnId], paddingLeft: react_components_1.tokens.spacingHorizontalM, paddingRight: react_components_1.tokens.spacingHorizontalM } }, renderCell(item)));
                        }));
                    }))) : (React.createElement(react_components_1.Body1, { className: styles.sitesEmpty }, "No sites match your search."))),
                sitesPageCount > 1 ? (React.createElement("div", { className: styles.sitesPagination },
                    React.createElement(react_components_1.Body1, null,
                        "Page ",
                        safeSitesPage,
                        " of ",
                        sitesPageCount),
                    React.createElement("div", { className: styles.sitesToolbar },
                        React.createElement(react_components_1.Button, { appearance: "secondary", size: "small", disabled: safeSitesPage <= 1, onClick: function () { return setSitePage(function (page) { return Math.max(1, page - 1); }); } }, "Previous"),
                        React.createElement(react_components_1.Button, { appearance: "secondary", size: "small", disabled: safeSitesPage >= sitesPageCount, onClick: function () { return setSitePage(function (page) { return Math.min(sitesPageCount, page + 1); }); } }, "Next")))) : null))));
}
//# sourceMappingURL=SkillDetailsPanel.js.map