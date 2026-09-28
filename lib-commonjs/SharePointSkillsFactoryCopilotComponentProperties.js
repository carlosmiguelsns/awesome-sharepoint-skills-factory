"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
// Drives what the inline view opens with, parsed by Copilot from the user's natural-language
// request (e.g. "list my top 3 skills used", "show me all my skills", "I want to create a new
// skill"). Every field is optional: with no match the component defaults to listing the
// signed-in user's top 5 skills, with more surfaced via the in-view "Show all" pill.
var propertiesSchema = zod_1.z.object({
    intent: zod_1.z
        .enum(['listSkills', 'createSkill'])
        .optional()
        .describe("The user's goal. Use 'listSkills' when they ask to see, list, or find their skills " +
        "(e.g. 'list my top skills used', 'show me all my skills'). Use 'createSkill' when they " +
        "ask to create, add, or build a new skill (e.g. 'I want to create a new skill'). Omit " +
        'when neither is clearly implied.'),
    skillCount: zod_1.z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("How many of the user's skills to list, only when they give an explicit number " +
        "(e.g. 'show my top 3 skills used' -> 3). Omit if no count was mentioned or the user " +
        "asked for 'all' skills."),
    showAllSkills: zod_1.z
        .boolean()
        .optional()
        .describe("True only when the user explicitly asks for every skill they have (e.g. 'show me all my " +
        "skills', 'list all of my skills'), as opposed to a top-N subset.")
});
exports.default = propertiesSchema.toJSONSchema();
//# sourceMappingURL=SharePointSkillsFactoryCopilotComponentProperties.js.map