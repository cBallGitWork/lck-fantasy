import type { TeamCode } from "../../fixtures/week3";
import { Field, MainAction, Modal, OutlinedKey, Time } from "../../parts";
import { LegalNames, plainOptions, ProviderMark, Select, TEAM_OPTIONS } from "./form";
import { canSaveTeam, capName, counter, type Account } from "./settings";
import "./settings.css";

const PROVIDERS: Account["provider"][] = ["Google", "Discord"];

/** Sign-up step 2's answers. */
export interface SignUpAnswers {
  teamName: string;
  favouriteTeam: TeamCode | null;
  country: string;
  ticked: boolean;
}

function Step({ of }: { of: 1 | 2 }) {
  return <span className="settings__step quiet num">{of} of 2</span>;
}

/** Step 1, over Pick Team on Save: sign in with Google or Discord. */
export function SignUpStepOne({
  squadSize,
  onContinue,
  onClose,
}: {
  squadSize: number;
  onContinue: (provider: Account["provider"]) => void;
  onClose: () => void;
}) {
  return (
    <Modal kind="sheet" title="Save your team" onClose={onClose}>
      <Step of={1} />
      <p className="settings__lead">Your squad of {squadSize} is kept while you sign up.</p>
      <div className="settings__providers">
        {PROVIDERS.map((provider) => (
          <OutlinedKey key={provider} onClick={() => onContinue(provider)}>
            <ProviderMark provider={provider} />
            Continue with {provider}
          </OutlinedKey>
        ))}
      </div>
      <p className="settings__warn quiet">
        No password is stored. <LegalNames />
      </p>
    </Modal>
  );
}

/** Step 2: team name, favourite team, country and the 16+ tick; Save team makes the account. */
export function SignUpStepTwo({
  answers,
  onChange,
  countries,
  deadline,
  onBack,
  onSave,
  onClose,
}: {
  answers: SignUpAnswers;
  onChange: (patch: Partial<SignUpAnswers>) => void;
  countries: string[];
  /** The manager's first deadline, when favourite team and country lock. */
  deadline: { local: string; kst: string };
  onBack: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const ready = canSaveTeam(answers.favouriteTeam, answers.ticked);
  return (
    <Modal kind="sheet" title="Your team" onClose={onClose}>
      <Step of={2} />
      <Field label="Team name" aside={counter(answers.teamName)} value={answers.teamName} onChange={(e) => onChange({ teamName: capName(e.target.value) })} />
      <div className="settings__two">
        <label className="settings__field">
          Favourite team
          <Select
            label="Favourite team"
            value={answers.favouriteTeam}
            options={TEAM_OPTIONS}
            empty="Choose a team"
            onChange={(favouriteTeam) => onChange({ favouriteTeam })}
          />
        </label>
        <label className="settings__field">
          Country
          <Select label="Country" value={answers.country} options={plainOptions(countries)} onChange={(country) => onChange({ country })} />
        </label>
      </div>
      <p className="settings__sub quiet">
        Both lock at your first deadline: <Time {...deadline} />
      </p>
      <label className="settings__tick">
        <input type="checkbox" className="settings__tick-box" checked={answers.ticked} onChange={(e) => onChange({ ticked: e.target.checked })} />
        <span>
          I&apos;m 16 or over and accept the <span className="settings__underlined">Terms</span> and{" "}
          <span className="settings__underlined">Privacy</span>
        </span>
      </label>
      <div className="settings__sheet-keys">
        <button type="button" className="settings__text-key key-bare" onClick={onBack}>
          Back
        </button>
        <MainAction onClick={onSave} disabledReason={ready ? undefined : ""}>
          Save team
        </MainAction>
      </div>
    </Modal>
  );
}
