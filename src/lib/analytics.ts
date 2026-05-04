// STUB — Plan 03-02 (wave 2) will replace this with the full typed analytics wrapper.
// This stub exists so Plan 03-06 (wave 1, Mermaid install) can satisfy `astro check`
// for the diagram:view observer block that Phase 3 owns.
// DO NOT add direct `window.posthog.capture` calls here — the full wrapper handles routing.

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventProps = Record<EventName, Record<string, any>>;

// Stub track — Plan 03-02 replaces this with the full typed implementation.
export function track<E extends EventName>(
  eventName: E,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
): void {
  // Will be wired to window.posthog.capture by Plan 03-02.
  if (typeof window !== 'undefined' && (window as unknown as { posthog?: { capture: (e: string, p: unknown) => void } }).posthog) {
    (window as unknown as { posthog: { capture: (e: string, p: unknown) => void } }).posthog.capture(eventName, props);
  }
}

// Stub identify — Plan 03-02 replaces this.
export function identify(email: string, traits?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && (window as unknown as { posthog?: { identify: (id: string, t?: unknown) => void } }).posthog) {
    (window as unknown as { posthog: { identify: (id: string, t?: unknown) => void } }).posthog.identify(email, traits);
  }
}
