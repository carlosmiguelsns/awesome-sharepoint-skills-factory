"use strict";
self["webpackHotUpdate_7f6a4b7c_32d0_4d3f_8a1a_35f7e4ac5b29_0_0_1"]("sharepoint-skills-factory",{

/***/ 6087
/*!********************************************!*\
  !*** ./lib/components/SkillsFactoryApp.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SkillsFactoryApp)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 2691);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react-components */ 6122);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react-components */ 7522);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react-components */ 4942);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react-components */ 106);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react-components */ 2640);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react-components */ 4413);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react-components */ 7008);
/* harmony import */ var _services_SkillService__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/SkillService */ 3704);
/* harmony import */ var _services_SiteService__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/SiteService */ 9848);
/* harmony import */ var _inline_InlineSkillsView__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./inline/InlineSkillsView */ 9046);
/* harmony import */ var _fullscreen_SkillsFactoryDashboard__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./fullscreen/SkillsFactoryDashboard */ 776);







var useStyles = (0,_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.makeStyles)({
    root: {
        minHeight: '100%',
        color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.tokens.colorNeutralForeground1
    },
    loading: {
        minHeight: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
function SkillsFactoryApp(props) {
    var _this = this;
    var styles = useStyles();
    var skillService = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        return new _services_SkillService__WEBPACK_IMPORTED_MODULE_9__.SkillService(props.spHttpClient, props.siteUrl, props.msGraphClientFactory, props.currentUserName, props.currentUserEmail);
    }, [props.currentUserEmail, props.currentUserName, props.msGraphClientFactory, props.siteUrl, props.spHttpClient]);
    var siteService = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return new _services_SiteService__WEBPACK_IMPORTED_MODULE_10__.SiteService(props.msGraphClientFactory); }, [props.msGraphClientFactory]);
    var _a = react__WEBPACK_IMPORTED_MODULE_1__.useState([]), skills = _a[0], setSkills = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_1__.useState([]), sites = _b[0], setSites = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_1__.useState([]), siteCollections = _c[0], setSiteCollections = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_1__.useState(undefined), selectedSkillId = _d[0], setSelectedSkillId = _d[1];
    var _e = react__WEBPACK_IMPORTED_MODULE_1__.useState('my-skills'), inlineMode = _e[0], setInlineMode = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_1__.useState(props.hostContext.displayMode === 'fullscreen' ? 'all-skills' : 'my-skills'), activeTab = _f[0], setActiveTab = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_1__.useState(''), searchText = _g[0], setSearchText = _g[1];
    var _h = react__WEBPACK_IMPORTED_MODULE_1__.useState(''), siteSearchText = _h[0], setSiteSearchText = _h[1];
    var _j = react__WEBPACK_IMPORTED_MODULE_1__.useState(true), isLoading = _j[0], setIsLoading = _j[1];
    var _k = react__WEBPACK_IMPORTED_MODULE_1__.useState(0), discoveredSiteCount = _k[0], setDiscoveredSiteCount = _k[1];
    var _l = react__WEBPACK_IMPORTED_MODULE_1__.useState('Loading skills factory…'), loadingMessage = _l[0], setLoadingMessage = _l[1];
    var requestedSkillName = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var query = (props.inputQuery || '').trim();
        var match = query.match(/^where is\s+(.+?)\s+skill\s+used\??$/i) ||
            query.match(/^where is\s+(.+?)\s+used\??$/i) ||
            query.match(/where is\s+(.+?)\s+skill used/i) ||
            query.match(/where is\s+(.+?)\s+used/i);
        return match ? match[1].trim().replace(/^the\s+/i, '') : '';
    }, [props.inputQuery]);
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        var isCancelled = false;
        function loadAsync() {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
                var _a, allSkills, allSites;
                return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_b) {
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
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        if (props.hostContext.displayMode === 'inline') {
            var query = (props.inputQuery || '').trim().toLowerCase();
            var isUsageQuery = query.startsWith('where is ') || query.includes(' where is ') || query.includes(' used?');
            setInlineMode(isUsageQuery ? 'skill-usage' : 'my-skills');
            setActiveTab('my-skills');
        }
    }, [props.hostContext.displayMode, props.inputQuery]);
    var mySkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return skills.filter(function (skill) { return skill.isOwnedByCurrentUser; }); }, [skills]);
    var topMySkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        return mySkills
            .slice()
            .sort(function (left, right) { return right.usageCount - left.usageCount || right.modifiedDate.localeCompare(left.modifiedDate); })
            .slice(0, 5);
    }, [mySkills]);
    var filteredMySkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var source = mySkills;
        var needle = searchText.trim().toLowerCase();
        return source.filter(function (skill) {
            var matchesSearch = !needle
                ? true
                : [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(needle) !== -1;
            return matchesSearch;
        });
    }, [mySkills, searchText]);
    var filteredAllSkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var needle = searchText.trim().toLowerCase();
        return skills.filter(function (skill) {
            var matchesSearch = !needle
                ? true
                : [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(needle) !== -1;
            return matchesSearch;
        });
    }, [searchText, skills]);
    var visibleSkills = activeTab === 'my-skills' ? filteredMySkills : filteredAllSkills;
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        if (visibleSkills.length === 0) {
            return;
        }
        if (!selectedSkillId || !visibleSkills.some(function (skill) { return skill.id === selectedSkillId; })) {
            setSelectedSkillId(visibleSkills[0].id);
        }
    }, [visibleSkills, selectedSkillId]);
    var selectedSkill = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return skills.find(function (skill) { return skill.id === selectedSkillId; }); }, [selectedSkillId, skills]);
    var requestedUsageSkill = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        if (!requestedSkillName) {
            return undefined;
        }
        var normalized = requestedSkillName.toLowerCase();
        var normalizedCompact = normalized.replace(/\s+/g, '');
        return (skills.find(function (skill) { return skill.name.toLowerCase() === normalized; }) ||
            skills.find(function (skill) { return skill.name.toLowerCase().includes(normalized); }) ||
            skills.find(function (skill) { return skill.name.toLowerCase().replace(/\s+/g, '') === normalizedCompact; }));
    }, [requestedSkillName, skills]);
    var requestedUsageSites = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        if (!requestedUsageSkill) {
            return [];
        }
        return sites.filter(function (site) { return requestedUsageSkill.siteIds.indexOf(site.id) !== -1; });
    }, [requestedUsageSkill, sites]);
    var handleCollapse = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(_this, void 0, void 0, function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setActiveTab('my-skills');
                    return [4 /*yield*/, props.onRequestInline()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [props.onRequestInline]);
    var theme = props.hostContext.theme === 'dark' ? _fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__.webDarkTheme : _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.webLightTheme;
    return (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.IdPrefixProvider, { value: "sharepoint-skills-factory-" },
        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.FluentProvider, { theme: theme, targetDocument: props.targetDocument, className: styles.root }, isLoading ? (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.loading },
            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, { label: discoveredSiteCount > 0 ? "".concat(loadingMessage, " ").concat(discoveredSiteCount, " sites discovered") : loadingMessage }))) : props.hostContext.displayMode === 'inline' ? (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_inline_InlineSkillsView__WEBPACK_IMPORTED_MODULE_11__["default"], { mode: inlineMode, skills: inlineMode === 'skill-usage' ? filteredAllSkills : topMySkills, selectedSkill: selectedSkill, usageSkillName: requestedUsageSkill === null || requestedUsageSkill === void 0 ? void 0 : requestedUsageSkill.name, sites: inlineMode === 'skill-usage' ? requestedUsageSites : sites, usageSiteCount: inlineMode === 'skill-usage' ? requestedUsageSites.length : undefined, siteCollections: siteCollections, onSelectSkill: setSelectedSkillId, onExpand: function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(_this, void 0, void 0, function () {
                return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setActiveTab(inlineMode === 'skill-usage' ? 'all-skills' : 'my-skills');
                            return [4 /*yield*/, props.onRequestFullscreen()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); } })) : (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fullscreen_SkillsFactoryDashboard__WEBPACK_IMPORTED_MODULE_12__["default"], { hostContext: props.hostContext, targetDocument: props.targetDocument, inputQuery: props.inputQuery, currentUserName: props.currentUserName, activeTab: activeTab, onTabChange: setActiveTab, searchText: searchText, onSearchTextChange: setSearchText, siteSearchText: siteSearchText, onSiteSearchTextChange: setSiteSearchText, mySkills: filteredMySkills, allSkills: filteredAllSkills, usageSkills: skills, siteCollections: siteCollections, sites: sites, selectedSkill: selectedSkill, onSelectSkill: setSelectedSkillId, onSelectSite: function (_) { return undefined; }, onRequestFullscreen: props.onRequestFullscreen })))));
}


/***/ },

/***/ 763
/*!***************************************************!*\
  !*** ./lib/components/inline/InlineSkillsList.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InlineSkillsList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react-components */ 4494);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react-components */ 7285);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react-components */ 4942);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react-components */ 4413);


var useStyles = (0,_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.makeStyles)({
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.spacingVerticalS
    },
    row: {
        border: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.colorNeutralStroke2),
        borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.borderRadiusMedium,
        backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.colorNeutralBackground1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.spacingHorizontalM,
        padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.spacingVerticalS,
        textAlign: 'left',
        width: '100%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.spacingVerticalXXS,
        minWidth: 0,
        flexGrow: 1
    },
    arrow: {
        color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.colorNeutralForeground3,
        flexShrink: 0
    },
    meta: {
        color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.tokens.colorNeutralForeground3
    }
});
function InlineSkillsList(props) {
    var styles = useStyles();
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.list }, props.skills.map(function (skill) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { key: skill.id, type: "button", className: styles.row, onClick: function () { return props.onSelectSkill(skill.id); } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.content },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, { weight: "semibold" }, skill.name),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.Body1, null, skill.description)),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, { className: styles.arrow, weight: "semibold" }, ">"))); })));
}


/***/ },

/***/ 9046
/*!***************************************************!*\
  !*** ./lib/components/inline/InlineSkillsView.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InlineSkillsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react-components */ 4494);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react-components */ 7285);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react-components */ 9403);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react-components */ 7445);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react-components */ 4942);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react-components */ 4413);
/* harmony import */ var _InlineSkillsList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./InlineSkillsList */ 763);



var useStyles = (0,_fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__.makeStyles)({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingVerticalM,
        padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingHorizontalM
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingHorizontalS
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingVerticalXS
    },
    helper: {
        color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.colorNeutralForeground3
    },
    usageList: {
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingVerticalS
    },
    usageItem: {
        padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.spacingVerticalS
    },
    emptyState: {
        color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.tokens.colorNeutralForeground3
    }
});
function InlineSkillsView(props) {
    var styles = useStyles();
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.root },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.header },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.headerText },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, { size: 500, weight: "semibold" }, props.mode === 'skill-usage' ? 'Skill usage' : 'My Skills'),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.Body1, { className: styles.helper }, props.mode === 'skill-usage'
                    ? "Sites using ".concat(props.usageSkillName || 'the requested skill', " (").concat(props.usageSiteCount || 0, ").")
                    : 'A compact view of your top 5 skills used.'))),
        props.mode === 'skill-usage' ? (props.sites.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: styles.usageList }, props.sites.map(function (site) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Card, { key: site.id, className: styles.usageItem },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_1__.Text, { weight: "semibold" }, site.name),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.Body1, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Link, { href: site.webUrl || site.url, target: "_blank", rel: "noreferrer" }, site.webUrl || site.url)))); }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.Body1, { className: styles.emptyState }, "No sites found for this skill."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_InlineSkillsList__WEBPACK_IMPORTED_MODULE_7__["default"], { skills: props.skills, onSelectSkill: props.onSelectSkill }))));
}


/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("73a664f5d4e3e7c4279b")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=sharepoint-skills-factory.5a9ef373572d8d7b9bd0.hot-update.js.map