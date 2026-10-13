import { describe, expect, test } from "vitest";
import { chunkText } from "./chunkText.js";

describe("chunkText", () => {

    // Checks that text is split into the correct chunk sizes
    test("splits text into smaller chunks", () => {

        const result = chunkText("ABCDEFGHIJKL", 5);

        expect(result).toEqual([
            "ABCDE",
            "FGHIJ",
            "KL",
        ]);
    });

});