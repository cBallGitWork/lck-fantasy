// The LCK teams' rosters as the pictures share them: 2026's, a placeholder until real data. Each in
// role order, Top to Support then the coach: game name, then hangul.
import type { TeamCode } from "./competition";

export const ROSTERS: Record<TeamCode, readonly (readonly [name: string, hangul: string])[]> = {
  T1: [["Doran", "최현준"], ["Oner", "문현준"], ["Faker", "이상혁"], ["Peyz", "김수환"], ["Keria", "류민석"], ["kkOma", "김정균"]],
  GEN: [["Kiin", "김기인"], ["Canyon", "김건부"], ["Chovy", "정지훈"], ["Ruler", "박재혁"], ["Duro", "주민규"], ["Ryu", "류상욱"]],
  HLE: [["Zeus", "최우제"], ["Kanavi", "서진혁"], ["Zeka", "김건우"], ["Gumayusi", "이민형"], ["Delight", "유환중"], ["Homme", "윤성영"]],
  DK: [["Siwoo", "전시우"], ["Lucid", "최용혁"], ["ShowMaker", "허수"], ["Aiming", "김하람"], ["BeryL", "조건희"], ["cvMax", "김대호"]],
  KT: [["PerfecT", "이승민"], ["Cuzz", "문우찬"], ["Bdd", "곽보성"], ["deokdam", "서대길"], ["Peter", "정윤수"], ["Score", "고동빈"]],
  DNS: [["DuDu", "이동주"], ["Pyosik", "홍창현"], ["BuLLDoG", "이태영"], ["Berserker", "김민철"], ["Life", "김정민"], ["Ssong", "송경호"]],
  NS: [["Kingen", "황성훈"], ["Sponge", "배영준"], ["Scout", "이예찬"], ["Taeyoon", "김태윤"], ["Lehends", "손시우"], ["DanDy", "최인규"]],
  KRX: [["Rich", "이재원"], ["Willer", "김정현"], ["ucal", "손우현"], ["Hype", "변정현"], ["Andil", "문관빈"], ["Joker", "조재읍"]],
  BRO: [["Casting", "신민제"], ["GIDEON", "김민성"], ["Clozer", "이주현"], ["Teddy", "박진성"], ["Pollu", "오동규"], ["Edgar", "최승민"]],
  BFX: [["Clear", "송현민"], ["Raptor", "전어진"], ["VicLa", "이대광"], ["Diable", "남대근"], ["Kellin", "김형규"], ["Mowgli", "이재하"]],
};

/** T1's prices in 억, in roster order, the coach's last: the LCK hub's and the coach card's Roster tab. */
export const T1_PRICES_EOK = [12.5, 14.0, 18.5, 15.0, 14.5, 7.0] as const;

const HANGUL = new Map(Object.values(ROSTERS).flat());

/** A rostered player's or coach's hangul; a name off every roster is a broken fixture. */
export function hangulOf(name: string): string {
  const hangul = HANGUL.get(name);
  if (hangul === undefined) throw new Error(`${name} is on no LCK roster`);
  return hangul;
}
