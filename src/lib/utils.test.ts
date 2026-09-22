import { describe, expect, it } from "vitest";
import { formatCompactDuration } from "./utils";

describe("formatCompactDuration", () => {
  it.each([
    [1, "1 sec"],
    [59, "59 sec"],
    [60, "1 min"],
    [61, "1 min 1 sec"],
    [3_600, "1 hr"],
    [3_661, "1 hr 1 min"],
    [86_400, "1 d"],
    [90_061, "1 d 1 hr"],
    [31_557_600, "1 yr"],
    [31_644_000, "1 yr 1 d"],
  ] as const)("formats %s seconds as %s", (seconds, expected) => {
    expect(formatCompactDuration(seconds)).toBe(expected);
  });

  it("returns at most the two largest non-zero units", () => {
    expect(formatCompactDuration(90_061)).toBe("1 d 1 hr");
    expect(formatCompactDuration(31_647_661)).toBe("1 yr 1 d");
  });

  it("rounds fractional seconds up before formatting", () => {
    expect(formatCompactDuration(0.1)).toBe("1 sec");
    expect(formatCompactDuration(60.1)).toBe("1 min 1 sec");
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "returns Unavailable for invalid duration %s",
    (seconds) => {
      expect(formatCompactDuration(seconds)).toBe("Unavailable");
    },
  );
});
