/** Joins the class names that are set; none gives no class attribute at all. */
export function cx(...names: (string | false | null | undefined)[]): string | undefined {
  return names.filter(Boolean).join(" ") || undefined;
}
