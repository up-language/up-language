// テスト - Deno 日本語マニュアル
// https://yoshixmk.github.io/deno-manual-ja/testing.html

import * as path from "https://deno.land/std/path/mod.ts";
const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);
import * as asst from "https://deno.land/std/testing/asserts.ts";

// Simple name and function, compact form, but not configurable
Deno.test("hello world #1", () => {
    const x = 1 + 2;
    asst.assertEquals(x, 3);
});

// Fully fledged test definition, longer form, but configurable (see below)
Deno.test({
    name: "hello world #2",
    fn: () => {
        const x = 1 + 2;
        asst.assertEquals(x, 3);
    },
});
