import { useId, useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { Columns, OutlinedKey, PageFrame, SponsorNote, TabPanel, Tabs, TierMark, useDevState } from "../../parts";
import { PROFILE, type FollowState, type ProfileData, type ProfileManager } from "./fixtures";
import "./profile.css";
import { ProfileHistory } from "./ProfileHistory";
import { ProfilePoints } from "./ProfilePoints";
import { ProfileSide } from "./ProfileSide";
import { ProfileTransfers } from "./ProfileTransfers";
import { FOLLOW_LABEL, TABS, WORDS } from "./words";

export type ProfileTab = (typeof TABS)[number];

/** Following unfollows; Follow sends a request; Requested cancels it, with no confirm (spec/14). */
export function nextFollow(state: FollowState): FollowState {
  if (state === "follow") return "requested";
  if (state === "following" || state === "requested") return "follow";
  return state;
}

/**
 * A manager's profile (docs/design/approved/profile/): the hangul banner, then Points, History and
 * Transfers, with her leagues beside each. Fed by props; the fixture feeds it until the backend does.
 */
export function Profile({
  data,
  account,
  initialTab = "Points",
  initialWeek = data.currentWeek,
  onFollow,
}: {
  data: ProfileData;
  /** Your team's name, for the account menu; null for a visitor. */
  account: string | null;
  initialTab?: ProfileTab;
  initialWeek?: number;
  /** Tells the backend the follow key was pressed, with the state it moves to. */
  onFollow?: (next: FollowState) => void;
}) {
  const [tab, setTab] = useState<ProfileTab>(initialTab);
  const [weekNo, setWeekNo] = useState(initialWeek);
  const [follow, setFollow] = useState(data.manager.follow);
  const tabsId = useId();
  const week = data.weeks.find((w) => w.week === weekNo);
  if (!week) throw new Error(`No Week ${weekNo} on ${data.manager.name}'s profile`);
  const hasWeek = (n: number) => data.weeks.some((w) => w.week === n);

  const pressFollow = () => {
    const next = nextFollow(follow);
    setFollow(next);
    onFollow?.(next);
  };
  const openWeek = (n: number) => {
    setWeekNo(n);
    setTab("Points");
  };

  return (
    <PageFrame screen="profile" account={account}>
      <Banner manager={data.manager} follow={follow} onFollow={pressFollow} />
      <Tabs id={tabsId} tabs={TABS} chosen={tab} onChoose={setTab} label={WORDS.profile} />
      <Columns className="profile__grid">
        <TabPanel id={tabsId} className="profile__main">
          {tab === "Points" && <ProfilePoints week={week} hasPrev={hasWeek(weekNo - 1)} hasNext={hasWeek(weekNo + 1)} onWeek={setWeekNo} />}
          {tab === "History" && <ProfileHistory rows={data.history} buffsLeft={data.buffsLeft} pastSeasons={data.pastSeasons} onOpenWeek={openWeek} />}
          {tab === "Transfers" && <ProfileTransfers weeks={data.transfers} />}
        </TabPanel>
        <aside className="profile__side">
          <ProfileSide leagues={data.leagues} cheers={tab === "Points" ? { week: week.week, list: week.cheers } : undefined} />
        </aside>
      </Columns>
      <SponsorNote />
    </PageFrame>
  );
}

/** The hangul banner (spec/13): the team name in hangul, in English, the manager, her Overall tier (spec/08), and the follow key. */
function Banner({ manager, follow, onFollow }: { manager: ProfileManager; follow: FollowState; onFollow: () => void }) {
  return (
    <header className="profile__banner">
      <h1 className="profile__hangul" lang="ko">
        {manager.hangul}
      </h1>
      <p className="profile__team">
        <b>{manager.team}</b>
        {manager.name}
      </p>
      <TierMark standing={manager.overall} className="profile__tier" />
      {follow !== "self" && (
        <span className="profile__follow">
          <OutlinedKey onClick={onFollow}>{FOLLOW_LABEL[follow]}</OutlinedKey>
        </span>
      )}
    </header>
  );
}

/** The route (`/manager/$managerId`), on the made-up Week 3 until the backend feeds it. `?state=history` or `transfers` opens that tab, in dev. */
export function ProfileScreen() {
  return <Profile data={PROFILE} account={MANAGER.team} initialTab={useDevState<ProfileTab>({ history: "History", transfers: "Transfers" })} />;
}
