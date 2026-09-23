"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillCompareDialog;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_diff_viewer_continued_1 = tslib_1.__importDefault(require("react-diff-viewer-continued"));
var useStyles = (0, react_components_1.makeStyles)({
    surface: {
        maxWidth: '90vw',
        width: 'min(1100px, 90vw)'
    },
    viewer: {
        maxHeight: '65vh',
        overflow: 'auto',
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium
    },
    empty: {
        color: react_components_1.tokens.colorNeutralForeground3,
        padding: react_components_1.tokens.spacingVerticalM
    }
});
function SkillCompareDialog(props) {
    var styles = useStyles();
    var revisionFor = React.useCallback(function (siteId) { return (props.skill.siteRevisions || []).find(function (revision) { return revision.siteId === siteId; }); }, [props.skill.siteRevisions]);
    var revisionA = revisionFor(props.siteA.id);
    var revisionB = revisionFor(props.siteB.id);
    return (React.createElement(react_components_1.Dialog, { open: props.open, onOpenChange: function (_, data) { return props.onOpenChange(data.open); } },
        React.createElement(react_components_1.DialogSurface, { className: styles.surface },
            React.createElement(react_components_1.DialogBody, null,
                React.createElement(react_components_1.DialogTitle, null,
                    "Compare: ",
                    props.siteA.name,
                    " vs ",
                    props.siteB.name),
                React.createElement(react_components_1.DialogContent, null, revisionA && revisionB ? (React.createElement("div", { className: styles.viewer },
                    React.createElement(react_diff_viewer_continued_1.default, { oldValue: revisionA.rawContent, newValue: revisionB.rawContent, splitView: true, disableWorker: true, showDiffOnly: false, leftTitle: props.siteA.name, rightTitle: props.siteB.name }))) : (React.createElement(react_components_1.Body1, { className: styles.empty }, "No content was captured for one or both of the selected sites, so a comparison isn't available."))),
                React.createElement(react_components_1.DialogActions, null,
                    React.createElement(react_components_1.Button, { appearance: "secondary", onClick: function () { return props.onOpenChange(false); } }, "Close"))))));
}
//# sourceMappingURL=SkillCompareDialog.js.map