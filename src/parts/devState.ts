import { useRouterState } from "@tanstack/react-router";

/** The search param that opens an approved picture's state in dev: `/?state=idle` (`src/devStates.ts` lists them). */
export const DEV_STATE_PARAM = "state";

/**
 * In dev, the screen's state `?state=` names, from the states it can open that its plain route
 * can't reach; undefined for none. A build ignores the param, so production never reads it.
 */
export function useDevState<T>(states: Record<string, T>): T | undefined {
  const search: Record<string, unknown> = useRouterState({ select: (s) => s.location.search });
  if (!import.meta.env.DEV) return undefined;
  const name = search[DEV_STATE_PARAM];
  if (name === undefined) return undefined;
  if (typeof name === "string" && Object.hasOwn(states, name)) return states[name];
  console.warn(`No dev state "${String(name)}" here; this screen opens ${Object.keys(states).join(", ") || "none"}`);
  return undefined;
}
