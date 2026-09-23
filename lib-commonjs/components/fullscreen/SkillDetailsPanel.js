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
        overflow: 'hidden'
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
    var _a, _b, _c;
    var styles = useStyles();
    var skill = props.skill;
    var _d = React.useState(undefined), previewSiteId = _d[0], setPreviewSiteId = _d[1];
    var _e = React.useState([]), compareSiteIds = _e[0], setCompareSiteIds = _e[1];
    var _f = React.useState(false), isCompareOpen = _f[0], setIsCompareOpen = _f[1];
    var _g = React.useState(''), siteSearchText = _g[0], setSiteSearchText = _g[1];
    var _h = React.useState(1), sitePage = _h[0], setSitePage = _h[1];
    React.useEffect(function () {
        setPreviewSiteId(undefined);
        setCompareSiteIds([]);
        setIsCompareOpen(false);
        setSiteSearchText('');
        setSitePage(1);
    }, [skill === null || skill === void 0 ? void 0 : skill.id]);
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
        ? { compare: '24px', site: '23%', folder: '38.5%', file: '38.5%' }
        : { site: '25%', folder: '37.5%', file: '37.5%' };
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
        }));
        return definitions;
    }, [compareSiteIds, hasCompareColumn, revisionForSite, siteCollectionForSite, skill, styles, toggleCompareSite]);
    if (!skill) {
        return (React.createElement(react_components_1.Card, { className: styles.card },
            React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill details"), description: React.createElement(react_components_1.Body1, null, "Select a skill to inspect its usage.") })));
    }
    var compareSiteA = skillSites.find(function (site) { return site.id === compareSiteIds[0]; });
    var compareSiteB = skillSites.find(function (site) { return site.id === compareSiteIds[1]; });
    return (React.createElement(react_components_1.Card, { className: styles.card },
        React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name) }),
        React.createElement(react_components_1.Dialog, { open: previewSiteId !== undefined, onOpenChange: function (_, data) { return setPreviewSiteId(data.open ? previewSiteId : undefined); } },
            React.createElement(react_components_1.DialogSurface, { className: styles.previewDialogSurface },
                React.createElement(react_components_1.DialogBody, null,
                    React.createElement(react_components_1.DialogTitle, null, (previewSiteId ? (_a = revisionForSite(previewSiteId)) === null || _a === void 0 ? void 0 : _a.skillMarkdownFileName : undefined) || skill.skillMarkdownFileName || 'SKILL.md'),
                    React.createElement(react_components_1.DialogContent, null, previewSiteId && ((_b = revisionForSite(previewSiteId)) === null || _b === void 0 ? void 0 : _b.rawContent) ? (React.createElement("div", { className: styles.previewSurface },
                        React.createElement(react_editor_1.Viewer, { key: previewSiteId, initialValue: (_c = revisionForSite(previewSiteId)) === null || _c === void 0 ? void 0 : _c.rawContent }))) : (React.createElement(react_components_1.Body1, { className: styles.previewEmpty }, "No content available to preview for this skill."))),
                    React.createElement(react_components_1.DialogActions, null,
                        React.createElement(react_components_1.Button, { appearance: "secondary", onClick: function () { return setPreviewSiteId(undefined); } }, "Close"))))),
        compareSiteA && compareSiteB ? (React.createElement(SkillCompareDialog_1.default, { open: isCompareOpen, onOpenChange: setIsCompareOpen, skill: skill, siteA: compareSiteA, siteB: compareSiteB })) : null,
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
                            return (React.createElement(react_components_1.DataGridHeaderCell, { style: columnId === 'compare'
                                    ? { width: columnWidths[columnId], padding: 0 }
                                    : { width: columnWidths[columnId] } }, renderHeaderCell()));
                        })),
                    React.createElement(react_components_1.DataGridBody, null, function (_a) {
                        var item = _a.item, rowId = _a.rowId;
                        return (React.createElement(react_components_1.DataGridRow, { key: rowId }, function (_a) {
                            var renderCell = _a.renderCell, columnId = _a.columnId;
                            return (React.createElement(react_components_1.DataGridCell, { style: columnId === 'compare'
                                    ? { width: columnWidths[columnId], padding: 0, justifyContent: 'center' }
                                    : { width: columnWidths[columnId] } }, renderCell(item)));
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