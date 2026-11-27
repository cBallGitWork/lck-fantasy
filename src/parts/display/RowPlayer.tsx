import { TeamBar } from "./TeamBar";

/** A player named in a row, read as his tile's plate: his team's bar and code, then his name (`T1 Faker`; plate.md, Parts). */
export function RowPlayer({ team, name }: { team: string; name: string }) {
  return (
    <>
      <TeamBar team={team} />
      {team} <b>{name}</b>
    </>
  );
}
