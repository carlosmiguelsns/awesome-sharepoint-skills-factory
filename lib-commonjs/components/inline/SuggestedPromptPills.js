"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestedPromptPills;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var useStyles = (0, react_components_1.makeStyles)({
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalXS
    },
    pill: {
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusCircular,
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        color: react_components_1.tokens.colorNeutralForeground1,
        padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalM),
        font: 'inherit',
        fontSize: react_components_1.tokens.fontSizeBase200,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        '&:hover': {
            backgroundColor: react_components_1.tokens.colorNeutralBackground2
        },
        '&:focus-visible': {
            outline: "2px solid ".concat(react_components_1.tokens.colorStrokeFocus2),
            outlineOffset: '2px'
        }
    },
    pillActive: {
        border: "1px solid ".concat(react_components_1.tokens.colorBrandStroke1),
        backgroundColor: react_components_1.tokens.colorBrandBackground2,
        color: react_components_1.tokens.colorBrandForeground1,
        fontWeight: react_components_1.tokens.fontWeightSemibold
    }
});
function SuggestedPromptPills(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.row, role: "group", "aria-label": "Suggested questions" }, props.prompts.map(function (prompt) { return (React.createElement("button", { key: prompt.key, type: "button", className: "".concat(styles.pill, " ").concat(prompt.isActive ? styles.pillActive : ''), "aria-pressed": Boolean(prompt.isActive), onClick: prompt.onClick }, prompt.label)); })));
}
//# sourceMappingURL=SuggestedPromptPills.js.map