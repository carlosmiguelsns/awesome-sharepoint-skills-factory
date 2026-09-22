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
    }
});
function InlineSkillsView(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.root },
        React.createElement("div", { className: styles.header },
            React.createElement("div", { className: styles.headerText },
                React.createElement(react_components_1.Text, { size: 500, weight: "semibold" }, "My Skills"),
                React.createElement(react_components_1.Body1, { className: styles.helper }, "A compact view of your top 5 skills used.")),
            React.createElement(react_components_1.Link, { onClick: function () { void props.onExpand(); } }, "Expand")),
        React.createElement(InlineSkillsList_1.default, { skills: props.skills, onSelectSkill: props.onSelectSkill })));
}
//# sourceMappingURL=InlineSkillsView.js.map