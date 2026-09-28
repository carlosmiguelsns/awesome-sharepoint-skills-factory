"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateSkillForm;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_editor_1 = require("@toast-ui/react-editor");
require("@toast-ui/editor/dist/toastui-editor.css");
var textHelpers_1 = require("../utils/textHelpers");
var useStyles = (0, react_components_1.makeStyles)({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        opacity: 0.9,
        borderRadius: react_components_1.tokens.borderRadiusMedium
    },
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: react_components_1.tokens.spacingHorizontalS,
        alignItems: 'start'
    },
    fullWidth: {
        gridColumn: '1 / -1'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    select: {
        minHeight: '32px',
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        color: react_components_1.tokens.colorNeutralForeground1,
        padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS),
        font: 'inherit'
    },
    contentField: {
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0
    },
    contentEditor: {
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        overflow: 'hidden'
    },
    preview: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    statusText: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    statusError: {
        color: react_components_1.tokens.colorPaletteRedForeground1
    },
    actions: {
        display: 'flex',
        gap: react_components_1.tokens.spacingHorizontalS,
        justifyContent: 'flex-end'
    }
});
function buildSkillMarkdownContent(normalizedSkillName, skillName, content) {
    var escapedNormalizedName = normalizedSkillName.replace(/"/g, '\\"');
    var header = "---\nname: \"".concat(escapedNormalizedName, "\"\ndescription: \"\"\n---\n\n# ").concat(skillName, "\n\n\n");
    return "".concat(header).concat(content);
}
function compareSiteName(left, right) {
    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
}
function CreateSkillForm(props) {
    var _this = this;
    var styles = useStyles();
    var skillContentEditorRef = React.useRef(null);
    var _a = React.useState(''), siteId = _a[0], setSiteId = _a[1];
    var _b = React.useState(''), name = _b[0], setName = _b[1];
    var _c = React.useState(''), content = _c[0], setContent = _c[1];
    var _d = React.useState(false), submitting = _d[0], setSubmitting = _d[1];
    var _e = React.useState(''), status = _e[0], setStatus = _e[1];
    var _f = React.useState(''), error = _f[0], setError = _f[1];
    React.useEffect(function () {
        if (!siteId && props.sites.length) {
            setSiteId(props.sites[0].id);
        }
    }, [props.sites, siteId]);
    React.useEffect(function () {
        var _a;
        (_a = props.onSubmittingChange) === null || _a === void 0 ? void 0 : _a.call(props, submitting);
    }, [submitting]); // eslint-disable-line react-hooks/exhaustive-deps
    var normalizedName = React.useMemo(function () { return (0, textHelpers_1.normalizeSkillFolderName)(name); }, [name]);
    var selectedSite = React.useMemo(function () { return props.sites.find(function (site) { return site.id === siteId; }); }, [props.sites, siteId]);
    var handleSubmit = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var trimmedName, site, normalized, result, submitError_1;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    trimmedName = name.trim();
                    site = props.sites.find(function (item) { return item.id === siteId; });
                    setError('');
                    setStatus('');
                    if (!trimmedName) {
                        setError('Skill Name is required.');
                        return [2 /*return*/];
                    }
                    if (!site) {
                        setError('Site selection is required.');
                        return [2 /*return*/];
                    }
                    normalized = (0, textHelpers_1.normalizeSkillFolderName)(trimmedName);
                    if (!normalized) {
                        setError('Skill Name must contain at least one letter or number.');
                        return [2 /*return*/];
                    }
                    if (!content.trim()) {
                        setError('Skill Content is required.');
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    setStatus('Creating skill folder…');
                    return [4 /*yield*/, props.onCreateSkill({
                            siteUrl: site.url,
                            skillName: trimmedName,
                            skillContent: buildSkillMarkdownContent(normalized, trimmedName, content),
                            onProgress: function (message) { return setStatus(message); }
                        })];
                case 2:
                    result = _c.sent();
                    setStatus("Created ".concat(result.normalizedSkillName, " successfully."));
                    setName('');
                    setContent('');
                    (_a = skillContentEditorRef.current) === null || _a === void 0 ? void 0 : _a.getInstance().setMarkdown('');
                    (_b = props.onCreated) === null || _b === void 0 ? void 0 : _b.call(props, result);
                    return [3 /*break*/, 5];
                case 3:
                    submitError_1 = _c.sent();
                    setError(submitError_1 instanceof Error ? submitError_1.message : 'Failed to create the skill.');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [content, name, props, siteId]);
    return (React.createElement("div", { className: styles.root },
        submitting ? (React.createElement("div", { className: styles.overlay },
            React.createElement(react_components_1.Spinner, { label: status || 'Creating skill…' }))) : null,
        error ? React.createElement(react_components_1.Body1, { className: styles.statusError }, error) : null,
        status && !submitting ? React.createElement(react_components_1.Body1, { className: styles.statusText }, status) : null,
        React.createElement("div", { className: styles.form },
            React.createElement(react_components_1.Field, { className: styles.field, label: "Site", required: true },
                React.createElement("select", { className: styles.select, value: siteId, disabled: submitting, onChange: function (event) { return setSiteId(event.target.value); } },
                    React.createElement("option", { value: "" }, "Select a site"),
                    props.sites.slice().sort(compareSiteName).map(function (site) { return (React.createElement("option", { key: site.id, value: site.id }, site.name)); }))),
            React.createElement(react_components_1.Field, { className: styles.field, label: "Skill Name", required: true },
                React.createElement(react_components_1.Input, { value: name, disabled: submitting, onChange: function (_, data) { return setName(data.value); }, placeholder: 'Example: "Build HTML Dashboard!"' }),
                React.createElement(react_components_1.Caption1, null,
                    "Normalized folder name: ",
                    normalizedName || '—')),
            React.createElement(react_components_1.Field, { className: (0, react_components_1.mergeClasses)(styles.field, styles.fullWidth, styles.contentField), label: "Skill Content", required: true },
                React.createElement("div", { className: styles.contentEditor },
                    React.createElement(react_editor_1.Editor, { ref: skillContentEditorRef, initialValue: content, previewStyle: "vertical", initialEditType: "wysiwyg", useCommandShortcut: true, placeholder: "Write the SKILL.md content\u2026", onChange: function () { var _a, _b; return setContent((_b = (_a = skillContentEditorRef.current) === null || _a === void 0 ? void 0 : _a.getInstance().getMarkdown()) !== null && _b !== void 0 ? _b : ''); } }))),
            React.createElement("div", { className: (0, react_components_1.mergeClasses)(styles.preview, styles.fullWidth) },
                React.createElement(react_components_1.Caption1, null,
                    "Folder path: ",
                    selectedSite ? "".concat(selectedSite.name, " / Agent Assets / skills / ").concat(normalizedName || 'skill-name') : 'Select a site to preview the path.'),
                React.createElement(react_components_1.Caption1, null,
                    "SKILL.md path: ",
                    selectedSite ? "".concat(selectedSite.name, " / Agent Assets / skills / ").concat(normalizedName || 'skill-name', " / SKILL.md") : 'Select a site to preview the path.')),
            React.createElement("div", { className: (0, react_components_1.mergeClasses)(styles.actions, styles.fullWidth) },
                props.onCancel ? (React.createElement(react_components_1.Button, { appearance: "secondary", disabled: submitting, onClick: props.onCancel }, "Cancel")) : null,
                React.createElement(react_components_1.Button, { appearance: "primary", onClick: function () { void handleSubmit(); }, disabled: submitting || !name.trim() || !siteId }, submitting ? 'Creating…' : 'Create Skill')))));
}
//# sourceMappingURL=CreateSkillForm.js.map