"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InlineSkillsView;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var InlineSkillsList_1 = tslib_1.__importDefault(require("./InlineSkillsList"));
var useStyles = (0, react_components_1.makeStyles)({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM,
        padding: react_components_1.tokens.spacingHorizontalM
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: react_components_1.tokens.spacingHorizontalS
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXS
    },
    helper: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    usageList: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS
    },
    usageItem: {
        padding: react_components_1.tokens.spacingVerticalS
    },
    emptyState: {
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function InlineSkillsView(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.root },
        React.createElement("div", { className: styles.header },
            React.createElement("div", { className: styles.headerText },
                React.createElement(react_components_1.Text, { size: 500, weight: "semibold" }, props.mode === 'skill-usage' ? 'Skill usage' : 'My Skills'),
                React.createElement(react_components_1.Body1, { className: styles.helper }, props.mode === 'skill-usage'
                    ? "Sites using ".concat(props.usageSkillName || 'the requested skill', " (").concat(props.usageSiteCount || 0, ").")
                    : 'A compact view of your top 5 skills used.'))),
        props.mode === 'skill-usage' ? (props.sites.length > 0 ? (React.createElement("div", { className: styles.usageList }, props.sites.map(function (site) { return (React.createElement(react_components_1.Card, { key: site.id, className: styles.usageItem },
            React.createElement(react_components_1.Text, { weight: "semibold" }, site.name),
            React.createElement(react_components_1.Body1, null,
                React.createElement(react_components_1.Link, { href: site.webUrl || site.url, target: "_blank", rel: "noreferrer" }, site.webUrl || site.url)))); }))) : (React.createElement(react_components_1.Body1, { className: styles.emptyState }, "No sites found for this skill."))) : (React.createElement(InlineSkillsList_1.default, { skills: props.skills, onSelectSkill: props.onSelectSkill }))));
}
//# sourceMappingURL=InlineSkillsView.js.map