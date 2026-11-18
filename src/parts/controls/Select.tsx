import "./Select.css";

/** A choice from a list, 40px tall, edged: Settings' favourite team, country and time zone, and the
 *  sign-up sheet's. `empty` shows until something is chosen (`Choose a team`). */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  empty,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  empty?: string;
}) {
  return (
    <select className="select" aria-label={label} value={value ?? ""} onChange={(e) => onChange(e.target.value as T)}>
      {value === null && (
        <option value="" disabled>
          {empty}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Options whose words are their values. */
export const plainOptions = <T extends string>(values: readonly T[]) => values.map((value) => ({ value, label: value }));
