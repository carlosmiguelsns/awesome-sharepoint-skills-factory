"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillDetailsPanel;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var dateHelpers_1 = require("../../utils/dateHelpers");
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
    var styles = useStyles();
    var skill = props.skill;
    if (!skill) {
        return (React.createElement(react_components_1.Card, null,
            React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill details"), description: React.createElement(react_components_1.Body1, null, "Select a skill to inspect its usage.") })));
    }
    var skillSites = props.sites.filter(function (site) { return skill.siteIds.indexOf(site.id) !== -1; });
    var siteCollectionForSite = React.useCallback(function (site) { return props.siteCollections.find(function (collection) { return collection.id === site.siteCollectionId; }); }, [props.siteCollections]);
    return (React.createElement(react_components_1.Card, null,
        React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name), description: React.createElement(react_components_1.Body1, null, skill.description) }),
        React.createElement("div", { className: styles.root },
            React.createElement("div", { className: styles.section },
                React.createElement(react_components_1.Caption1, null, "Sites where this skill exists"),
                React.createElement("div", { className: styles.siteGrid }, skillSites.map(function (site) {
                    var siteCollection = siteCollectionForSite(site);
                    return (React.createElement(react_components_1.Card, { key: site.id, className: styles.siteCard },
                        React.createElement("div", { className: styles.siteCardHeader },
                            React.createElement(react_components_1.Text, { weight: "semibold" }, site.name),
                            React.createElement(react_components_1.Caption1, null, (siteCollection === null || siteCollection === void 0 ? void 0 : siteCollection.name) || site.siteCollectionName || 'Site collection')),
                        React.createElement("div", { className: styles.metaGrid },
                            React.createElement("div", { className: styles.siteMetaGroup },
                                React.createElement(react_components_1.Caption1, { className: styles.metaLabel }, "Folder"),
                                React.createElement(react_components_1.Body1, { className: styles.siteMetaValue },
                                    React.createElement(react_components_1.Link, { href: skill.skillFolderUrl || (siteCollection === null || siteCollection === void 0 ? void 0 : siteCollection.url) || site.url, target: "_blank", rel: "noreferrer" }, skill.skillFolderName || 'Open folder')),
                                React.createElement(react_components_1.Caption1, null,
                                    "Created ",
                                    skill.skillFolderCreatedDate ? (0, dateHelpers_1.formatLongDate)(skill.skillFolderCreatedDate) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Modified ",
                                    skill.skillFolderModifiedDate ? (0, dateHelpers_1.formatLongDate)(skill.skillFolderModifiedDate) : '—')),
                            React.createElement("div", { className: styles.siteMetaGroup },
                                React.createElement(react_components_1.Caption1, { className: styles.metaLabel }, "Skill file"),
                                React.createElement(react_components_1.Body1, { className: styles.siteMetaValue },
                                    React.createElement(react_components_1.Link, { href: skill.skillMarkdownUrl || skill.sourceDocumentUrl || site.url, target: "_blank", rel: "noreferrer" }, skill.skillMarkdownFileName || 'SKILL.md')),
                                React.createElement(react_components_1.Caption1, null,
                                    "Creator ",
                                    skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner),
                                React.createElement(react_components_1.Caption1, null,
                                    "Created ",
                                    skill.skillMarkdownCreatedDate ? (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownCreatedDate) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Modified ",
                                    skill.skillMarkdownModifiedDate ? (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownModifiedDate) : '—'),
                                React.createElement(react_components_1.Caption1, null,
                                    "Size ",
                                    formatBytes(skill.skillMarkdownSize))))));
                }))))));
}
//# sourceMappingURL=SkillDetailsPanel.js.map