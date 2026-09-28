"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillsFactoryApp;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var SkillService_1 = require("../services/SkillService");
var SiteService_1 = require("../services/SiteService");
var InlineSkillsView_1 = tslib_1.__importDefault(require("./inline/InlineSkillsView"));
var SkillsFactoryDashboard_1 = tslib_1.__importDefault(require("./fullscreen/SkillsFactoryDashboard"));
var useStyles = (0, react_components_1.makeStyles)({
    root: {
        minHeight: '100%',
        color: react_components_1.tokens.colorNeutralForeground1
    },
    loading: {
        minHeight: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
var DEFAULT_INLINE_SKILL_LIMIT = 5;
function SkillsFactoryApp(props) {
    var _this = this;
    var styles = useStyles();
    var skillService = React.useMemo(function () {
        return new SkillService_1.SkillService(props.spHttpClient, props.siteUrl, props.msGraphClientFactory, props.currentUserName, props.currentUserEmail);
    }, [props.currentUserEmail, props.currentUserName, props.msGraphClientFactory, props.siteUrl, props.spHttpClient]);
    var siteService = React.useMemo(function () { return new SiteService_1.SiteService(props.msGraphClientFactory); }, [props.msGraphClientFactory]);
    var _a = React.useState([]), skills = _a[0], setSkills = _a[1];
    var _b = React.useState([]), sites = _b[0], setSites = _b[1];
    var _c = React.useState([]), siteCollections = _c[0], setSiteCollections = _c[1];
    var _d = React.useState(undefined), selectedSkillId = _d[0], setSelectedSkillId = _d[1];
    var _e = React.useState('all-skills'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = React.useState(''), searchText = _f[0], setSearchText = _f[1];
    var _g = React.useState(''), siteSearchText = _g[0], setSiteSearchText = _g[1];
    var _h = React.useState(true), isLoading = _h[0], setIsLoading = _h[1];
    var _j = React.useState(0), discoveredSiteCount = _j[0], setDiscoveredSiteCount = _j[1];
    var _k = React.useState('Loading skills factory…'), loadingMessage = _k[0], setLoadingMessage = _k[1];
    var _l = React.useState(props.initialIntent === 'createSkill' ? 'create' : 'list'), inlineMode = _l[0], setInlineMode = _l[1];
    var _m = React.useState(props.initialShowAllSkills ? 'all' : props.initialSkillCount || DEFAULT_INLINE_SKILL_LIMIT), inlineSkillLimit = _m[0], setInlineSkillLimit = _m[1];
    React.useEffect(function () {
        var isCancelled = false;
        function loadAsync() {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a, allSkills, allSites;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setIsLoading(true);
                            setLoadingMessage('Discovering SharePoint sites…');
                            setDiscoveredSiteCount(0);
                            return [4 /*yield*/, Promise.all([
                                    skillService.getSkills({ ownedOnly: false }),
                                    siteService.getSites({
                                        onProgress: function (progress) {
                                            if (isCancelled) {
                                                return;
                                            }
                                            setDiscoveredSiteCount(progress.discoveredCount);
                                            setLoadingMessage("Discovering SharePoint sites\u2026");
                                        }
                                    })
                                ])];
                        case 1:
                            _a = _b.sent(), allSkills = _a[0], allSites = _a[1];
                            if (isCancelled) {
                                return [2 /*return*/];
                            }
                            setSkills(allSkills);
                            setSites(allSites);
                            setSiteCollections(allSites.reduce(function (collections, site) {
                                if (collections.some(function (collection) { return collection.id === site.siteCollectionId; })) {
                                    return collections;
                                }
                                collections.push({
                                    id: site.siteCollectionId,
                                    name: site.siteCollectionName || site.name,
                                    url: site.url,
                                    owner: site.owner,
                                    description: site.description
                                });
                                return collections;
                            }, []));
                            setIsLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        void loadAsync();
        return function () {
            isCancelled = true;
        };
    }, [siteService, skillService]);
    var refreshSkills = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var allSkills;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, skillService.getSkills({ ownedOnly: false })];
                case 1:
                    allSkills = _a.sent();
                    setSkills(allSkills);
                    return [2 /*return*/];
            }
        });
    }); }, [skillService]);
    var handleCreateSkill = React.useCallback(function (request) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, skillService.createSkill(request)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, refreshSkills()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); }, [refreshSkills, skillService]);
    var handleDeleteSkillSite = React.useCallback(function (site, skillFolderUrl) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, skillService.deleteSkill({ siteUrl: site.url, skillFolderUrl: skillFolderUrl })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshSkills()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [refreshSkills, skillService]);
    var mySkills = React.useMemo(function () { return skills.filter(function (skill) { return skill.isOwnedByCurrentUser; }); }, [skills]);
    var sortedMySkills = React.useMemo(function () { return mySkills.slice().sort(function (left, right) { return right.usageCount - left.usageCount || right.modifiedDate.localeCompare(left.modifiedDate); }); }, [mySkills]);
    var visibleMySkills = React.useMemo(function () { return (inlineSkillLimit === 'all' ? sortedMySkills : sortedMySkills.slice(0, inlineSkillLimit)); }, [sortedMySkills, inlineSkillLimit]);
    var selectedSkill = React.useMemo(function () { return skills.find(function (skill) { return skill.id === selectedSkillId; }); }, [selectedSkillId, skills]);
    var handleToggleSelectSkill = React.useCallback(function (skillId) {
        setSelectedSkillId(function (current) { return (current === skillId ? undefined : skillId); });
    }, []);
    var handleTabChange = React.useCallback(function (tab) {
        setActiveTab(tab);
        setSelectedSkillId(undefined);
    }, []);
    React.useEffect(function () {
        if (props.hostContext.displayMode === 'inline') {
            setSelectedSkillId(undefined);
        }
    }, [props.hostContext.displayMode]);
    var handleSelectInlineSkill = React.useCallback(function (skillId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedSkillId(skillId);
                    setActiveTab('all-skills');
                    return [4 /*yield*/, props.onRequestFullscreen()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [props.onRequestFullscreen]);
    var handleShowTopSkills = React.useCallback(function (count) {
        setInlineMode('list');
        setInlineSkillLimit(count);
    }, []);
    var handleShowAllSkills = React.useCallback(function () {
        setInlineMode('list');
        setInlineSkillLimit('all');
    }, []);
    var handleStartCreateSkill = React.useCallback(function () {
        setInlineMode('create');
    }, []);
    var handleCancelCreateSkill = React.useCallback(function () {
        setInlineMode('list');
    }, []);
    var theme = props.hostContext.theme === 'dark' ? react_components_1.webDarkTheme : react_components_1.webLightTheme;
    return (React.createElement(react_components_1.IdPrefixProvider, { value: "sharepoint-skills-factory-" },
        React.createElement(react_components_1.FluentProvider, { theme: theme, targetDocument: props.targetDocument, className: styles.root }, isLoading ? (React.createElement("div", { className: styles.loading },
            React.createElement(react_components_1.Spinner, { label: discoveredSiteCount > 0 ? "".concat(loadingMessage, " ").concat(discoveredSiteCount, " sites discovered") : loadingMessage }))) : props.hostContext.displayMode === 'inline' ? (React.createElement(InlineSkillsView_1.default, { mode: inlineMode, skills: visibleMySkills, totalMySkillsCount: mySkills.length, skillLimit: inlineSkillLimit, currentUserName: props.currentUserName, sites: sites, onSelectSkill: function (skillId) { void handleSelectInlineSkill(skillId); }, onShowTopSkills: handleShowTopSkills, onShowAllSkills: handleShowAllSkills, onStartCreateSkill: handleStartCreateSkill, onCancelCreateSkill: handleCancelCreateSkill, onCreateSkill: handleCreateSkill, onSkillCreated: handleCancelCreateSkill })) : (React.createElement(SkillsFactoryDashboard_1.default, { hostContext: props.hostContext, targetDocument: props.targetDocument, currentUserName: props.currentUserName, activeTab: activeTab, onTabChange: handleTabChange, searchText: searchText, onSearchTextChange: setSearchText, siteSearchText: siteSearchText, onSiteSearchTextChange: setSiteSearchText, allSkills: skills, usageSkills: skills, siteCollections: siteCollections, sites: sites, selectedSkill: selectedSkill, onSelectSkill: handleToggleSelectSkill, onSelectSite: function (_) { return undefined; }, onCreateSkill: handleCreateSkill, onDeleteSkillSite: handleDeleteSkillSite, onRequestFullscreen: props.onRequestFullscreen })))));
}
//# sourceMappingURL=SkillsFactoryApp.js.map