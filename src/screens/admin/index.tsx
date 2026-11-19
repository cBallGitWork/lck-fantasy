import { useMutation, useQueries } from "convex/react";
import { ConvexError } from "convex/values";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { AdminRefusal } from "../../../convex/admin/access";
import type { SimState } from "../../../convex/admin/sim";
import { Empty } from "../../parts";
import { REGION } from "../../region";
import { AdminFrame, AdminPage, KeyForm, type Alert, type Press, type Read } from "./AdminPage";
import { WORDS } from "./words";

/** The refusal an admin read failed with, if it was refused for its key. */
function refusalOf(read: unknown): AdminRefusal | undefined {
  return read instanceof ConvexError ? (read.data as AdminRefusal) : undefined;
}

/** The admin section, once the key is typed: the Sim tab's state, the alerts and the two presses. */
function Opened({ adminKey, onRefused }: { adminKey: string; onRefused: (refusal: AdminRefusal) => void }) {
  const reads = useQueries({
    sim: { query: api.admin.sim.simState, args: { key: adminKey } },
    alerts: { query: api.admin.alerts.alertList, args: { key: adminKey } },
  });
  const nextDay = useMutation(api.admin.sim.nextDay);
  const playToEnd = useMutation(api.admin.sim.playToEnd);
  const sim = reads.sim as Read<SimState>;
  const refused = refusalOf(sim)?.rule;
  // A refused key goes back to the key form, saying why.
  useEffect(() => {
    if (refused !== undefined) onRefused({ rule: refused });
  }, [refused, onRefused]);
  const press = (which: Press) => (which === "nextDay" ? nextDay : playToEnd)({ key: adminKey, competition: REGION.name });
  return <AdminPage sim={sim} alerts={reads.alerts as Read<Alert[]>} onPress={press} />;
}

function Admin() {
  const [key, setKey] = useState<string>();
  const [refused, setRefused] = useState<string>();
  const onRefused = useCallback((refusal: AdminRefusal) => {
    setRefused(WORDS.refused[refusal.rule]);
    setKey(undefined);
  }, []);
  if (key === undefined)
    return (
      <AdminFrame>
        <KeyForm
          refused={refused}
          onKey={(typed) => {
            setRefused(undefined);
            setKey(typed);
          }}
        />
      </AdminFrame>
    );
  return <Opened adminKey={key} onRefused={onRefused} />;
}

/** The admin section (`/admin`): the key form, then Sim and Alerts; without Convex it says so. */
export function AdminScreen() {
  if (!import.meta.env.VITE_CONVEX_URL)
    return (
      <AdminFrame>
        <Empty title={WORDS.noConvex} />
      </AdminFrame>
    );
  return <Admin />;
}
