/** The 5 practice skills and their route. All 5 have shipped content — there
 *  is no "coming soon" state anymore, so this is a plain lookup, not a
 *  readiness map. */
export const SKILL_ROUTES = {
  listening: "/practice/listening",
  reading: "/practice/reading",
  grammar_vocab: "/practice/grammar-vocab",
  writing: "/practice/writing",
  speaking: "/practice/speaking",
} as const;

export type SkillSlug = keyof typeof SKILL_ROUTES;
