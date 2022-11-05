#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net --allow-run

import {setCwd} from "https://deno.land/x/chdir_anywhere@v0.0.2/mod.js";
import {generateTypes} from "https://deno.land/x/deno_tsc_helper@v0.1.2/mod.js";

setCwd();
Deno.chdir("..");

await generateTypes({
	include: [
		"scripts",
		"mod.js"
	],
});

const proc = Deno.run({
	cmd: ["deno", "run", "--allow-env", "--allow-read", "--unstable", "npm:typescript@4.8.3/tsc", "-p", "./jsconfig.json"],
});

const status = await proc.status();
if (!status.success) {
	Deno.exit(1);
} else {
	console.log("No type errors!");
}
