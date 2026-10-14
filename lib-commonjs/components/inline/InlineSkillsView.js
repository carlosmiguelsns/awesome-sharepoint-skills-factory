"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InlineSkillsView;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var CreateSkillForm_1 = tslib_1.__importDefault(require("../CreateSkillForm"));
var InlineSkillsList_1 = tslib_1.__importDefault(require("./InlineSkillsList"));
var SuggestedPromptPills_1 = tslib_1.__importDefault(require("./SuggestedPromptPills"));
var useStyles = (0, react_components_1.makeStyles)({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM,
        padding: react_components_1.tokens.spacingHorizontalM
    },
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: react_components_1.tokens.spacingHorizontalS
    },
    headerIconTile: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        backgroundColor: react_components_1.tokens.colorBrandBackground2,
        color: react_components_1.tokens.colorBrandForeground1,
        flexShrink: 0
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXS
    },
    helper: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    empty: {
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function describeVisibleSkills(visibleCount, totalCount, limit) {
    if (totalCount === 0) {
        return "You don't own any skills yet — try creating one.";
    }
    if (limit === 'all' || visibleCount >= totalCount) {
        return "Showing all ".concat(totalCount, " skill").concat(totalCount === 1 ? '' : 's', " you own.");
    }
    return "Showing your top ".concat(visibleCount, " of ").concat(totalCount, " skills, ranked by usage.");
}
function InlineSkillsView(props) {
    var styles = useStyles();
    var prompts = [
        { key: 'top-5', label: 'Show my top 5 skills', isActive: props.mode === 'list' && props.skillLimit === 5, onClick: function () { return props.onShowTopSkills(5); } },
        { key: 'all', label: 'Show all my skills', isActive: props.mode === 'list' && props.skillLimit === 'all', onClick: props.onShowAllSkills },
        { key: 'create', label: 'Create a new skill', isActive: props.mode === 'create', onClick: props.onStartCreateSkill }
    ];
    return (React.createElement("div", { className: styles.root },
        React.createElement("div", { className: styles.headerRow },
            React.createElement("span", { className: styles.headerIconTile, "aria-hidden": "true" },
                React.createElement(react_icons_1.Sparkle24Regular, null)),
            React.createElement("div", { className: styles.headerText },
                React.createElement(react_components_1.Text, { size: 500, weight: "semibold" }, "My Skills"),
                React.createElement(react_components_1.Body1, { className: styles.helper }, props.mode === 'create' ? 'Create a new skill folder and SKILL.md in a selected site.' : describeVisibleSkills(props.skills.length, props.totalMySkillsCount, props.skillLimit)))),
        React.createElement(SuggestedPromptPills_1.default, { prompts: prompts }),
        props.mode === 'create' ? (React.createElement(CreateSkillForm_1.default, { sites: props.sites, onCreateSkill: props.onCreateSkill, onActivateAgentAssetsFeature: props.onActivateAgentAssetsFeature, onCreated: props.onSkillCreated, onCancel: props.onCancelCreateSkill })) : props.skills.length ? (React.createElement(InlineSkillsList_1.default, { skills: props.skills, currentUserName: props.currentUserName, onSelectSkill: props.onSelectSkill })) : (React.createElement(react_components_1.Body1, { className: styles.empty }, "No skills to show yet. Try \u201CCreate a new skill\u201D to get started."))));
}
//# sourceMappingURL=InlineSkillsView.js.map