import { useMutation, useQueries } from "convex/react";
import { ConvexError } from "convex/values";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { AdminRefusal } from "../../../convex/admin/access";
import type { SimState } from "../../../convex/admin/sim";
import { browserZone, Empty } from "../../parts";
import { REGION } from "../../region";
import { AdminFrame, AdminPage, PasswordForm, type Alert, type Press, type Read } from "./AdminPage";
import { WORDS } from "./words";

/** Why an admin read was refused, if it was refused for its password. */
function refusalOf(read: unknown): AdminRefusal["rule"] | undefined {
  return read instanceof ConvexError ? (read.data as AdminRefusal).rule : undefined;
}

/** The admin section, once the password is typed: the Sim tab's state, the alerts and the two presses. */
function Opened({ password, onRefused }: { password: string; onRefused: (rule: AdminRefusal["rule"]) => void }) {
  const reads = useQueries({
    sim: { query: api.admin.sim.simState, args: { password } },
    alerts: { query: api.admin.alerts.alertList, args: { password } },
  });
  const nextDay = useMutation(api.admin.sim.nextDay);
  const playToEnd = useMutation(api.admin.sim.playToEnd);
  const sim = reads.sim as Read<SimState>;
  const refused = refusalOf(sim);
  // A refused password goes back to the password form, saying why.
  useEffect(() => {
    if (refused !== undefined) onRefused(refused);
  }, [refused, onRefused]);
  const press = (which: Press) => (which === "nextDay" ? nextDay : playToEnd)({ password, competition: REGION.name });
  return <AdminPage sim={sim} alerts={reads.alerts as Read<Alert[]>} onPress={press} zone={browserZone()} />;
}

function Admin() {
  const [password, setPassword] = useState<string>();
  const [refused, setRefused] = useState<string>();
  const onRefused = useCallback((rule: AdminRefusal["rule"]) => {
    setRefused(WORDS.refused[rule]);
    setPassword(undefined);
  }, []);
  if (password === undefined)
    return (
      <AdminFrame>
        <PasswordForm
          refused={refused}
          onPassword={(typed) => {
            setRefused(undefined);
            setPassword(typed);
          }}
        />
      </AdminFrame>
    );
  return <Opened password={password} onRefused={onRefused} />;
}

/** The admin section (`/admin`): the password form, then Sim and Alerts; without Convex it says so. */
export function AdminScreen() {
  if (!import.meta.env.VITE_CONVEX_URL)
    return (
      <AdminFrame>
        <Empty title={WORDS.noConvex} />
      </AdminFrame>
    );
  return <Admin />;
}
