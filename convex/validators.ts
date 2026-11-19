import { v } from "convex/values";

/** A validator for one of `values`. */
export const literals = <T extends string>(values: readonly [T, T, ...T[]]) =>
  v.union(...values.map((value) => v.literal(value)));
