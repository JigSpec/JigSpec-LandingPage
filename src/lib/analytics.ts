// src/lib/analytics.ts
//
// THE typed wrapper. ANALYTICS-02: direct posthog.capture calls anywhere
// outside this file are forbidden — `npm run analytics-audit` enforces.
//
// Per ANALYTICS-04 (identify-before-track), the call order in form submit
// handlers is identify() THEN track('form:submit', ...) THEN
// captureSurveyResponse({...}) — NEVER capture-then-identify.
//
// Source-of-truth: 03-RESEARCH.md § Pattern 2 + § Pattern 6.

// ----- Event taxonomy (ANALYTICS-03) -----

export type EventName =
  | 'page:home_view'
  | 'nav:link_click'
  | 'card:open'
  | 'card:cta_external_click'
  | 'form:open'
  | 'form:abandon'
  | 'form:submit'
  | 'problem_pitch:submit'
  | 'diagram:view'
  | 'educator:scroll_complete'
  | 'footer:link_click';

// ----- Per-event property contracts (discriminated by event name) -----

export type EventProps = {
  'page:home_view': { location: 'home' | 'product-detail' };
  'nav:link_click': { location: string };          // e.g. 'header', 'mobile-menu'
  'card:open': { productId: string };
  'card:cta_external_click': { productId: string }; // buggerd-only at v1
  'form:open': { productId?: string; form: 'interest' | 'problem-pitch' };
  'form:abandon': { productId?: string; form: 'interest' | 'problem-pitch'; field?: string };
  'form:submit': { productId: string; survey_id: string };
  'problem_pitch:submit': { has_email: boolean };
  'diagram:view': { diagram_id: 'pipeline-run' | 'ship-to-you' };
  'educator:scroll_complete': Record<string, never>; // no props
  'footer:link_click': { location: string };       // e.g. 'docs', 'github', 'email'
};

// ----- Survey-response props for the per-card forms (DEMAND-01) -----
// PostHog dashboard recognizes 'survey sent' events by $survey_id +
// $survey_response_$question_id. We capture 'form:submit' for our typed
// taxonomy AND a separate 'survey sent' event with the PostHog-shaped props
// so the dashboard's Surveys UI sees the response.
//
// Question UUIDs come from the dashboard at Survey-creation time.
// The user pastes them into src/lib/surveys.ts after creating each Survey.

export interface SurveyResponseProps {
  $survey_id: string;
  // PostHog uses "$survey_response_$question_id" as the property key.
  // We type these as a Record because the question_id values are runtime strings.
  [key: `$survey_response_${string}`]: string | undefined;
}

// ----- Wrapper API -----

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
      identify: (
        distinctId: string,
        userProps?: Record<string, unknown>
      ) => void;
      __loaded?: boolean;
    };
  }
}

export function track<E extends EventName>(eventName: E, props: EventProps[E]): void {
  if (typeof window === 'undefined') return; // SSR safety; unreachable for static build but cheap
  const ph = window.posthog;
  if (!ph) {
    // SDK not yet loaded. PostHog's snippet queues capture() calls before _dom_loaded(),
    // so this branch is rare. Log to console for the canary-debugging window.
    if (import.meta.env.DEV) console.warn('[analytics] posthog not ready, dropping', eventName, props);
    return;
  }
  ph.capture(eventName, props as Record<string, unknown>);
}

// Identify before track on form:submit. ANALYTICS-04.
// `first_signup_location` lets the dashboard see which page first captured the email.
export function identify(email: string, traits: { first_signup_location: string }): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.identify(email, { email, ...traits });
}

// Survey-response capture is a separate path because the PostHog dashboard
// recognizes the 'survey sent' event by name + $survey_id. Internally we ALSO
// fire 'form:submit' so our typed taxonomy stays consistent.
// [VERIFIED: posthog.com/docs/surveys/implementing-custom-surveys]
export function captureSurveyResponse(props: SurveyResponseProps): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.capture('survey sent', props as unknown as Record<string, unknown>);
}

// Open-ended problem-pitch capture — the free-text body is too noisy for the
// EventProps typed contract but DEMAND-05 wants it surfaced in a readable list.
// One wrapper function so the analytics-audit grep stays clean.
// DEMAND-02 free-text capture; routes through this wrapper to keep ANALYTICS-02 audit clean.
export function captureProblemPitch(problem: string, hasEmail: boolean): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.capture('problem_pitch', { problem, has_email: hasEmail });
}
