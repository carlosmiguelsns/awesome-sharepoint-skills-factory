"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRelativeDate = formatRelativeDate;
exports.formatLongDate = formatLongDate;
function formatRelativeDate(value) {
    var date = new Date(value);
    var diffMs = Date.now() - date.getTime();
    var diffDays = Math.max(0, Math.round(diffMs / 86400000));
    if (diffDays <= 0) {
        return 'Today';
    }
    if (diffDays === 1) {
        return '1 day ago';
    }
    if (diffDays < 7) {
        return "".concat(diffDays, " days ago");
    }
    var weeks = Math.max(1, Math.round(diffDays / 7));
    if (weeks === 1) {
        return '1 week ago';
    }
    return "".concat(weeks, " weeks ago");
}
function formatLongDate(value) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(value));
}
//# sourceMappingURL=dateHelpers.js.map