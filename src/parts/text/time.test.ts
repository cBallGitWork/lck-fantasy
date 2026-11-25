import { describe, expect, test } from "vitest";
import { momentIn } from "./time";

const LONDON = "Europe/London";

describe("a moment reads am/pm, lower case, no space, no leading zero (Craig, 19 Nov 2026)", () => {
  test("morning, afternoon, noon and midnight", () => {
    expect(momentIn("2027-01-20T07:45:00Z", LONDON)).toBe("Wed 7:45am");
    expect(momentIn("2027-01-20T22:30:00Z", LONDON)).toBe("Wed 10:30pm");
    expect(momentIn("2027-01-20T12:00:00Z", LONDON)).toBe("Wed 12:00pm");
    expect(momentIn("2027-01-20T00:00:00Z", LONDON)).toBe("Wed 12:00am");
  });

  test("with the date, and the date alone", () => {
    expect(momentIn("2026-12-30T07:45:00Z", LONDON, { date: true })).toBe("Wed 30 Dec 7:45am");
    expect(momentIn("2026-12-30T07:45:00Z", LONDON, { date: true, time: false })).toBe("Wed 30 Dec");
  });
});
