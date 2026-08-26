import { z } from 'zod';

const propertiesSchema = z.object({
  inputQuery: z.string().optional().describe('Natural language query that drives the initial inline experience.')
});

export type ISharePointSkillsFactoryCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default propertiesSchema.toJSONSchema();
