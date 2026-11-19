// The two sign-up sheets over the front door on Save team (spec/09, Signing up; the Settings
// picture's sign-up sheets, docs/design/approved/settings/).
import { TEAMS, type TeamCode } from "../../fixtures/week3";
import { Field, GoLink, MainAction, Modal, OutlinedKey, plainOptions, ProviderMark, Select, SheetKeys, Time } from "../../parts";
import { PATHS } from "../../paths";
import { continueWith, stepOf, WORDS } from "./words";

export const PROVIDERS = ["Google", "Discord"] as const;
export type Provider = (typeof PROVIDERS)[number];

/** Step 2's answers. */
export interface SignUpAnswers {
  teamName: string;
  favouriteTeam: TeamCode | null;
  country: string;
  ticked: boolean;
}

const TEAM_OPTIONS = (Object.keys(TEAMS) as TeamCode[]).map((code) => ({ value: code, label: TEAMS[code] }));

/** Text cut to the name cap, hangul syllables one each. */
export const capName = (text: string, max: number) => [...text].slice(0, max).join("");

/** Save team is offered once the team is named (spaces alone are no name), a favourite team picked,
 *  a country set and the 16+ box ticked (spec/09). */
export const canSaveTeam = (a: SignUpAnswers) => a.teamName.trim() !== "" && a.favouriteTeam !== null && a.country !== "" && a.ticked;

function Step({ of }: { of: 1 | 2 }) {
  return <span className="pick-team-signed-out__step quiet num">{stepOf(of)}</span>;
}

/** Step 1, on Save team: sign in with Google or Discord. */
export function SignUpStepOne({ onContinue, onClose }: { onContinue: (provider: Provider) => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={WORDS.saveTitle} onClose={onClose}>
      <Step of={1} />
      <p className="pick-team-signed-out__lead">{WORDS.keptLead}</p>
      <div className="pick-team-signed-out__providers">
        {PROVIDERS.map((provider) => (
          <OutlinedKey key={provider} onClick={() => onContinue(provider)}>
            <ProviderMark provider={provider} />
            {continueWith(provider)}
          </OutlinedKey>
        ))}
      </div>
      <p className="pick-team-signed-out__warn quiet">
        {WORDS.noPassword}{" "}
        <GoLink go={{ to: PATHS.privacy }} className="pick-team-signed-out__go">
          {WORDS.privacy} ›
        </GoLink>
        <GoLink go={{ to: PATHS.terms }} className="pick-team-signed-out__go">
          {WORDS.terms} ›
        </GoLink>
      </p>
    </Modal>
  );
}

/** Step 2: team name, favourite team, country and the 16+ tick; Save team makes the account. */
export function SignUpStepTwo({
  answers,
  onChange,
  countries,
  nameMax,
  deadline,
  onBack,
  onSave,
  onClose,
}: {
  answers: SignUpAnswers;
  onChange: (patch: Partial<SignUpAnswers>) => void;
  countries: string[];
  /** The season's cap on a team name (data, spec/09). */
  nameMax: number;
  /** The manager's first deadline, when favourite team and country lock. */
  deadline: { local: string; kst: string };
  onBack: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal kind="sheet" title={WORDS.yourTeam} onClose={onClose}>
      <Step of={2} />
      <Field
        label={WORDS.teamName}
        aside={`${[...answers.teamName].length}/${nameMax}`}
        value={answers.teamName}
        onChange={(e) => onChange({ teamName: capName(e.target.value, nameMax) })}
      />
      <div className="pick-team-signed-out__two">
        <label className="pick-team-signed-out__field">
          {WORDS.favouriteTeam}
          <Select
            label={WORDS.favouriteTeam}
            value={answers.favouriteTeam}
            options={TEAM_OPTIONS}
            empty={WORDS.chooseTeam}
            onChange={(favouriteTeam) => onChange({ favouriteTeam })}
          />
        </label>
        <label className="pick-team-signed-out__field">
          {WORDS.country}
          <Select
            label={WORDS.country}
            value={answers.country === "" ? null : answers.country}
            options={plainOptions(countries)}
            empty={WORDS.chooseCountry}
            onChange={(country) => onChange({ country })}
          />
        </label>
      </div>
      <p className="pick-team-signed-out__sub quiet">
        {WORDS.lockAt} <Time {...deadline} />
      </p>
      <label className="pick-team-signed-out__tick">
        <input
          type="checkbox"
          className="pick-team-signed-out__tick-box"
          checked={answers.ticked}
          onChange={(e) => onChange({ ticked: e.target.checked })}
        />
        <span>
          {WORDS.tickStart}{" "}
          <GoLink go={{ to: PATHS.terms }} className="pick-team-signed-out__underlined">
            {WORDS.terms}
          </GoLink>{" "}
          {WORDS.and}{" "}
          <GoLink go={{ to: PATHS.privacy }} className="pick-team-signed-out__underlined">
            {WORDS.privacy}
          </GoLink>
        </span>
      </label>
      <SheetKeys onBack={onBack}>
        <MainAction onClick={onSave} disabledReason={canSaveTeam(answers) ? undefined : ""}>
          {WORDS.save}
        </MainAction>
      </SheetKeys>
    </Modal>
  );
}
