# Transfers

Craig's answers only, from the `/grill`s of 12 and 14 Nov 2026. Where this file is silent the rule is
FPL's, or FPL's logic ([SPEC.md](../SPEC.md), the base assumption). Open questions are in
[docs/to-grill.md](../docs/to-grill.md).

## Free transfers

- A manager gets one free transfer a gameweek. Each transfer beyond the free ones costs −6 points (Craig, 14 Nov 2026; it was −4).
- Swapping the coach counts as a transfer, like swapping a player.
- Unused free transfers bank, up to 3.
- Before a season's first deadline, transfers are free and unlimited. Every manager then has 2
  free transfers for gameweek 2, and gains 1 a week after that, up to the cap.
- Split 2 starts the same way: unlimited before its first deadline, 2 free for its second
  gameweek, then 1 a week up to 3.
- All these numbers are data per competition, never code.

## Undoing a transfer

Grilled 14 Nov 2026.

- Selling a player and buying him back before the same deadline cancels out, as in FPL: no free
  transfer used, no −6, and his old price kept.
- At the top of Transfers, the gameweek's confirmed transfers are listed, each with Undo, until
  the deadline. Example: Siwoo → Kingen, Undo. Undo puts the old player back at his old price and
  gives back the free transfer or the −6. It isn't offered for transfers made under Remake or
  Limitless.
- Playing Remake or Limitless wipes that gameweek's −6s, as FPL's Wildcard and Free Hit do
  ([spec/06](06-buffs.md)).

## Between the splits

Craig, 13 Nov 2026:

- Once Split 1 ends, transfers are locked through the break.
- They reopen 2 weeks before Split 2's first deadline, unlimited and free. Example: Split 2's
  first series is Wednesday 17:00 KST, so the deadline is 16:45; transfers open at 16:45 two
  Wednesdays before.
- The budget raise from Road to MSI ([spec/10](10-season-and-gameweeks.md)) comes back off every
  manager's bank when Split 2 starts, so a bank can fall below zero. Price rises earned in Split 1
  are kept. Example: a raise of 5억 and a bank of 1억 leave −4억.
- In that window every squad must get back to a bank of zero or more and to the regular cap of 2
  per team, the coach included.
- A squad still over at the deadline is fixed by Flol, at no points cost:
  1. For each team over the cap, it sells the most expensive extra.
  2. While the bank is below zero, it sells the most expensive player left.
  3. For each sale, it buys the cheapest player of the same role, or the cheapest coach, that
     keeps the squad within the cap.

## Top-ups

- When something outside managers' control wrecks squads, such as a team swapping a starter
  mid-split, an admin can top every manager's bank up to the cap for a gameweek, as FPL did for
  AFCON in 2024/25.

## Knockouts

- In knockout stages transfers are unlimited, with no hits; the team cap rises to 3 and the
  budget is raised ([spec/10](10-season-and-gameweeks.md)).
- A knockout week keeps the free-transfer bank as it was: 1 banked, then a Road to MSI week, still
  1 after (Craig, 14 Nov 2026).
