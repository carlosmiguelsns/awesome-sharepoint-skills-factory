"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillDetailsPanel;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_editor_1 = require("@toast-ui/react-editor");
require("@toast-ui/editor/dist/toastui-editor.css");
var dateHelpers_1 = require("../../utils/dateHelpers");
var SkillCompareDialog_1 = tslib_1.__importDefault(require("./SkillCompareDialog"));
var useStyles = (0, react_components_1.makeStyles)({
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
    metadataGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: react_components_1.tokens.spacingVerticalS
    },
    siteGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: react_components_1.tokens.spacingVerticalS
    },
    metaCard: {
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        padding: react_components_1.tokens.spacingVerticalS,
        backgroundColor: react_components_1.tokens.colorNeutralBackground2,
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    metaLabel: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    metaValue: {
        overflowWrap: 'anywhere'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalXS
    },
    siteItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    siteLink: {
        color: react_components_1.tokens.colorBrandForegroundLink,
        textDecorationLine: 'none',
        ':hover': {
            textDecorationLine: 'underline'
        }
    },
    metaGrid: {
        display: 'grid',
        gap: react_components_1.tokens.spacingVerticalL
    },
    sourceLine: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    sourceMeta: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    siteCard: {
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        padding: react_components_1.tokens.spacingVerticalS,
        backgroundColor: react_components_1.tokens.colorNeutralBackground2,
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM
    },
    siteCardHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS,
        paddingBottom: react_components_1.tokens.spacingVerticalXS,
        borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2)
    },
    siteMetaGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS
    },
    siteMetaValue: {
        display: 'block',
        lineHeight: react_components_1.tokens.lineHeightBase300
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
    compareCheckbox: {
        alignSelf: 'flex-start'
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
    React.useEffect(function () {
        setPreviewSiteId(undefined);
        setCompareSiteIds([]);
        setIsCompareOpen(false);
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
    if (!skill) {
        return (React.createElement(react_components_1.Card, null,
            React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill details"), description: React.createElement(react_components_1.Body1, null, "Select a skill to inspect its usage.") })));
    }
    var skillSites = props.sites.filter(function (site) { return skill.siteIds.indexOf(site.id) !== -1; });
    var siteCollectionForSite = React.useCallback(function (site) { return props.siteCollections.find(function (collection) { return collection.id === site.siteCollectionId; }); }, [props.siteCollections]);
    return (React.createElement(react_components_1.Card, null,
        React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name), description: React.createElement(react_components_1.Body1, null, skill.description) }),
        React.createElement(react_components_1.Dialog, { open: previewSiteId !== undefined, onOpenChange: function (_, data) { return setPreviewSiteId(data.open ? previewSiteId : undefined); } },
            React.createElement(react_components_1.DialogSurface, { className: styles.previewDialogSurface },
                React.createElement(react_components_1.DialogBody, null,
                    React.createElement(react_components_1.DialogTitle, null, (previewSiteId ? (_a = revisionForSite(previewSiteId)) === null || _a === void 0 ? void 0 : _a.skillMarkdownFileName : undefined) || skill.skillMarkdownFileName || 'SKILL.md'),
                    React.createElement(react_components_1.DialogContent, null, previewSiteId && ((_b = revisionForSite(previewSiteId)) === null || _b === void 0 ? void 0 : _b.rawContent) ? (React.createElement("div", { className: styles.previewSurface },
                        React.createElement(react_editor_1.Viewer, { key: previewSiteId, initialValue: (_c = revisionForSite(previewSiteId)) === null || _c === void 0 ? void 0 : _c.rawContent }))) : (React.createElement(react_components_1.Body1, { className: styles.previewEmpty }, "No content available to preview for this skill."))),
                    React.createElement(react_components_1.DialogActions, null,
                        React.createElement(react_components_1.Button, { appearance: "secondary", onClick: function () { return setPreviewSiteId(undefined); } }, "Close"))))),
        compareSiteIds.length === 2 ? (React.createElement(SkillCompareDialog_1.default, { open: isCompareOpen, onOpenChange: setIsCompareOpen, skill: skill, siteA: skillSites.find(function (site) { return site.id === compareSiteIds[0]; }), siteB: skillSites.find(function (site) { return site.id === compareSiteIds[1]; }) })) : null,
        React.createElement("div", { className: styles.root },
            React.createElement("div", { className: styles.section },
                React.createElement("div", { className: styles.sitesSectionHeader },
                    React.createElement(react_components_1.Caption1, null, "Sites where this skill exists"),
                    skillSites.length > 1 ? (React.createElement(react_components_1.Button, { appearance: "secondary", size: "small", disabled: compareSiteIds.length !== 2, onClick: function () { return setIsCompareOpen(true); } }, "Compare selected sites")) : null),
                React.createElement("div", { className: styles.siteGrid }, skillSites.map(function (site) {
                    var _a;
                    var siteCollection = siteCollectionForSite(site);
                    var isSelectedForCompare = compareSiteIds.indexOf(site.id) !== -1;
                    var revision = revisionForSite(site.id);
                    return (React.createElement(react_components_1.Card, { key: site.id, className: styles.siteCard },
                        React.createElement("div", { className: styles.siteCardHeader },
                            React.createElement(react_components_1.Text, { weight: "semibold" }, site.name),
                            React.createElement(react_components_1.Caption1, null, (siteCollection === null || siteCollection === void 0 ? void 0 : siteCollection.name) || site.siteCollectionName || 'Site collection')),
                        skillSites.length > 1 ? (React.createElement(react_components_1.Checkbox, { className: styles.compareCheckbox, checked: isSelectedForCompare, disabled: !isSelectedForCompare && compareSiteIds.length >= 2, label: "Select to compare", onChange: function (_, data) { return toggleCompareSite(site.id, Boolean(data.checked)); } })) : null,
                        React.createElement("div", { className: styles.metaGrid },
                            React.createElement("div", { className: styles.siteMetaGroup },
                                React.createElement(react_components_1.Caption1, { className: styles.metaLabel }, "Folder"),
                                React.createElement(react_components_1.Body1, { className: styles.siteMetaValue },
                                    React.createElement(react_components_1.Link, { href: (revision === null || revision === void 0 ? void 0 : revision.skillFolderUrl) || skill.skillFolderUrl || (siteCollection === null || siteCollection === void 0 ? void 0 : siteCollection.url) || site.url, target: "_blank", rel: "noreferrer" }, (revision === null || revision === void 0 ? void 0 : revision.skillFolderName) || skill.skillFolderName || 'Open folder')),
                                React.createElement(react_components_1.Caption1, null,
                                    "Created ",
                                    ((revision === null || revision === void 0 ? void 0 : revision.skillFolderCreatedDate) || skill.skillFolderCreatedDate) ? (0, dateHelpers_1.formatLongDate)(((revision === null || revision === void 0 ? void 0 : revision.skillFolderCreatedDate) || skill.skillFolderCreatedDate)) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Modified ",
                                    ((revision === null || revision === void 0 ? void 0 : revision.skillFolderModifiedDate) || skill.skillFolderModifiedDate) ? (0, dateHelpers_1.formatLongDate)(((revision === null || revision === void 0 ? void 0 : revision.skillFolderModifiedDate) || skill.skillFolderModifiedDate)) : '—')),
                            React.createElement("div", { className: styles.siteMetaGroup },
                                React.createElement(react_components_1.Caption1, { className: styles.metaLabel }, "Skill file"),
                                React.createElement(react_components_1.Body1, { className: styles.siteMetaValue },
                                    React.createElement(react_components_1.Link, { onClick: function () { return setPreviewSiteId(site.id); } }, (revision === null || revision === void 0 ? void 0 : revision.skillMarkdownFileName) || skill.skillMarkdownFileName || 'SKILL.md')),
                                React.createElement(react_components_1.Caption1, null,
                                    "Creator ",
                                    skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner),
                                React.createElement(react_components_1.Caption1, null,
                                    "Created ",
                                    ((revision === null || revision === void 0 ? void 0 : revision.skillMarkdownCreatedDate) || skill.skillMarkdownCreatedDate) ? (0, dateHelpers_1.formatLongDate)(((revision === null || revision === void 0 ? void 0 : revision.skillMarkdownCreatedDate) || skill.skillMarkdownCreatedDate)) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Modified ",
                                    ((revision === null || revision === void 0 ? void 0 : revision.skillMarkdownModifiedDate) || skill.skillMarkdownModifiedDate) ? (0, dateHelpers_1.formatLongDate)(((revision === null || revision === void 0 ? void 0 : revision.skillMarkdownModifiedDate) || skill.skillMarkdownModifiedDate)) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Size ",
                                    formatBytes((_a = revision === null || revision === void 0 ? void 0 : revision.skillMarkdownSize) !== null && _a !== void 0 ? _a : skill.skillMarkdownSize))))));
                }))))));
}
//# sourceMappingURL=SkillDetailsPanel.js.map