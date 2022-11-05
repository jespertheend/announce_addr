import { assertSpyCall, assertSpyCalls, stub } from "std/testing/mock.ts";
import { announceAddrs } from "../mod.js";

/**
 * @param {Object} options
 * @param {Parameters<typeof announceAddrs>} options.params
 * @param {string} options.expected
 */
function announceAddrsTest({
	params,
	expected,
}) {
	const consoleLogSpy = stub(console, "log", () => {});
	try {
		announceAddrs(...params);
		assertSpyCalls(consoleLogSpy, 1);
		assertSpyCall(consoleLogSpy, 0, {
			args: [expected],
		});
	} finally {
		consoleLogSpy.restore();
	}
}

Deno.test({
	name: "announceAddrs() basic",
	fn() {
		announceAddrsTest({
			params: [
				[
					{ hostname: "example.com", transport: "tcp", port: 8080, protocol: "http" },
					{ hostname: "example2.com", transport: "tcp", port: 8081, protocol: "https" },
					{ hostname: "example3.com", transport: "tcp", port: 8082, protocol: "https:" },
					{ hostname: "example4.com", transport: "tcp", port: 8083, protocol: "https://" },
				],
			],
			expected: `Listening on:
- http://example.com:8080
- https://example2.com:8081
- https://example3.com:8082
- https://example4.com:8083`,
		});
	},
});

Deno.test({
	name: "announceAddrs() no protocol",
	fn() {
		announceAddrsTest({
			params: [
				[
					{ hostname: "example.com", transport: "tcp", port: 8080 },
					{ hostname: "example2.com", transport: "tcp", port: 8081 },
				],
			],
			expected: `Listening on:
- example.com:8080
- example2.com:8081`,
		});
	},
});

Deno.test({
	name: "announceAddrs() default protocol",
	fn() {
		announceAddrsTest({
			params: [
				[
					{ hostname: "example.com", transport: "tcp", port: 8080 },
					{ hostname: "example2.com", transport: "tcp", port: 8081, protocol: "https" },
				],
				{
					defaultProtocol: "http",
				},
			],
			expected: `Listening on:
- http://example.com:8080
- https://example2.com:8081`,
		});
	},
});

Deno.test({
	name: "announceAddrs() custom title",
	fn() {
		announceAddrsTest({
			params: [
				[
					{ hostname: "example.com", transport: "tcp", port: 8080 },
				],
				{
					titleText: "custom text",
				},
			],
			expected: `custom text
- example.com:8080`,
		});
	},
});
