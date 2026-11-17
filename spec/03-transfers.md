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

## Roles in a transfer

- A transfer may sell any role and buy any role in one go, as long as the squad still holds one
  of each role ([spec/01](01-squad-and-slots.md)). Example: sell your starting jungler for a mid
  while a jungler sits on your bench, with no need to bench him first (Craig, 16 Nov 2026).
- The coach is swapped only for a coach (Craig, 16 Nov 2026).
- After transfers Flol arranges the squad by role, as FPL does: each role slot takes a player of
  that role; where there's a choice, the player already starting keeps his place; new players
  fill what is left, the flex or the bench. Example: in the swap above, the bench jungler starts
  at jungle and the new mid takes his bench spot (Craig, 16 Nov 2026).
- An empty role slot takes a new player of that role first, then the bench in bench order (bench
  1 before bench 2), and the flex only last. New players left over fill the flex before the
  bench (Craig, 16 Nov 2026).
- Crossed transfers each fill the other's role slot. Example: sell your jungler for a mid and
  your mid for a jungler; the new jungler starts at jungle, the new mid at mid, and the bench is
  left alone (Craig, 16 Nov 2026).

## Undoing a transfer

Grilled 14 Nov 2026.

- Selling a player and buying him back before the same deadline cancels out, as in FPL: no free
  transfer used, no −6, and his old price kept.
- A manager makes as many transfers as they like, then confirms them together, as in FPL.
- Undo works on a whole confirm, never one transfer of it, since one sale can pay for another
  buy (Craig, 14 Nov 2026). At the top of Transfers, each confirm this gameweek is one line with
  one Undo, until the deadline. Example: Siwoo → Kingen, Doran → Zeus · Undo.
- Only the latest confirm can be undone; after it, the one before, newest first. A later confirm
  may spend money an earlier one freed.
- Undo puts the old players back at their old prices and gives back exactly what the confirm
  used: free transfers return to the week's count (never above the bank cap of 3), and its −6s
  are dropped. It isn't offered for transfers made under Remake.
- Undo also clears any changes the manager hasn't confirmed yet. A confirm made under Remake is
  still listed, with no Undo (Craig, 14 Nov 2026).
- Playing Remake wipes that gameweek's −6s, as FPL's Wildcard does
  ([spec/06](06-buffs.md)).

## Between the splits

Craig, 13 Nov 2026:

- Once Split 1 ends, transfers are locked through the break.
- They reopen 2 weeks before Split 2's first deadline, unlimited and free. Example: Split 2's
  first series is Wednesday 17:00 KST, so the deadline is 16:45; transfers open at 16:45 two
  Wednesdays before.
- The budget raise from Road to MSI ([spec/10](10-season-and-gameweeks.md)) comes back off every
  manager's bank when Split 2 starts, so a bank can fall below zero. Price rises earned in Split 1
  are kept. Example: a raise of ₩5m and a bank of ₩1m leave −₩4m.
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
