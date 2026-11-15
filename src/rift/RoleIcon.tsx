import "./RoleIcon.css";
import type { IconKey } from "./roles";
import { ROLE_NAME } from "./roles";

// Position icons drawn after LoL's own: Top and Bot are opposite corners, Mid the diagonal,
// Jungle a claw, Support a crest (points.html). Three tones: a, b and c, set in RoleIcon.css.
function Paths({ role }: { role: IconKey }) {
  switch (role) {
    case "top":
      return (
        <>
          <path className="role-icon__a" d="M1 1h14l-3 3H4v8l-3 3z" />
          <rect className="role-icon__b" x="6" y="6" width="4" height="4" />
          <path className="role-icon__c" d="M15 6v9H6l3-3h3V9z" />
        </>
      );
    case "bot":
      return (
        <>
          <path className="role-icon__a" d="M15 15H1l3-3h8V4l3-3z" />
          <rect className="role-icon__b" x="6" y="6" width="4" height="4" />
          <path className="role-icon__c" d="M1 10V1h9L7 4H4v3z" />
        </>
      );
    case "mid":
      return (
        <>
          <path className="role-icon__a" d="M11 1h4v4L5 15H1v-4z" />
          <path className="role-icon__c" d="M1 1h6L4 4H4v3L1 10zM15 15H9l3-3v-3l3-3z" />
        </>
      );
    case "jng":
      return <path className="role-icon__a" d="M3 1c2 4 2 9 5 14C6 10 6 6 3 1zM8 1c1 4 1 8 1 11 1-3 2-7-1-11zM13 1c-1 3-2 6-2 9 2-2 3-6 2-9z" />;
    case "sup":
      return <path className="role-icon__a" d="M8 3l2 2-2 9-2-9zM1 4h5l1 2-2 2zM15 4h-5l-1 2 2 2zM6 2l2-1 2 1-2 1z" />;
    case "coach":
      return (
        <>
          <rect className="role-icon__line" x="2" y="3" width="12" height="10" strokeWidth="1.6" />
          <path className="role-icon__line" d="M5 7h6M5 10h4" strokeWidth="1.4" />
        </>
      );
    case "flex":
      return <path className="role-icon__line" d="M8 1l2 5h5l-4 3 2 6-5-4-5 4 2-6-4-3h5z" strokeWidth="1.4" />;
  }
}

/** A role's icon, 16 units square, drawn at the size its box gives it. */
export function RoleIcon({ role, className }: { role: IconKey; className?: string }) {
  return (
    <svg className={["role-icon", className].filter(Boolean).join(" ")} viewBox="0 0 16 16" role="img" aria-label={ROLE_NAME[role]}>
      <Paths role={role} />
    </svg>
  );
}
