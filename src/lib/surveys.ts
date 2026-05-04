// src/lib/surveys.ts
//
// Hardcoded survey-id map. The user CREATES the 5 Surveys in the PostHog dashboard
// (User-Action Item 3 in 03-RESEARCH.md) and pastes the dashboard-assigned UUIDs
// here in Plan 03-04. Each Survey has 2 question UUIDs (email + free-text context).
//
// astro check enforces exhaustiveness: if a productId is missing from this map,
// `Record<ProductId, SurveyConfig>` fails the build.
//
// Pitfall 7: shipping with PASTE_* placeholders breaks form submissions silently.
// Plan 03-04's acceptance criterion: `grep -r "PASTE_" src/lib/` returns zero matches
// before commit.

export type ProductId =
  | 'scientific-paper-agent'
  | 'triage-router-bot'
  | 'recorder-extractor'
  | 'agentic-employees'
  | 'delegate';
//   ^ buggerd is intentionally absent — buggerd has no interest form
//     (CTA is external; see Phase 2 Pattern 8 + CONTENT-09).

export interface SurveyConfig {
  surveyId: string;       // $survey_id from PostHog dashboard (Plan 03-04 fills)
  questions: {
    email: string;        // question UUID for the email field
    context: string;      // question UUID for "what would you use this for"
  };
}

// USER-ACTION ITEM 3: paste the Survey UUIDs here after creating in PostHog dashboard.
// Until populated, the strings are placeholder and forms will dispatch
// $survey_id="PASTE_..." which PostHog will reject — Plan 03-04 acceptance verifies
// real UUIDs are present.
export const SURVEYS: Record<ProductId, SurveyConfig> = {
  'scientific-paper-agent': {
    surveyId: 'PASTE_SURVEY_ID_FOR_SCIENTIFIC_PAPER_AGENT',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'triage-router-bot': {
    surveyId: 'PASTE_SURVEY_ID_FOR_TRIAGE_ROUTER_BOT',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'recorder-extractor': {
    surveyId: 'PASTE_SURVEY_ID_FOR_RECORDER_EXTRACTOR',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'agentic-employees': {
    surveyId: 'PASTE_SURVEY_ID_FOR_AGENTIC_EMPLOYEES',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'delegate': {
    surveyId: 'PASTE_SURVEY_ID_FOR_DELEGATE',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
};

export function getSurveyConfig(productId: ProductId): SurveyConfig {
  return SURVEYS[productId];
}
