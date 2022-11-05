/**
 * @typedef {Deno.Addr & {protocol?: string}} AddrWithProtocol
 */

/**
 * @typedef AnnounceOptions
 * @property {string} [titleText]
 * @property {string} [defaultProtocol]
 */

/** @type {Object<number, string | undefined>} */
const commonPortProtocols = {
	20: "tcp",
	21: "ftp",
	22: "ssh",
	80: "http",
	443: "https",
	8080: "http",
}

/**
 * Logs a list of addresses to the console.
 * Useful when calling `new Server` (from std/http) or `Deno.listen()`
 *
 * ### Example usage
 * ```js
 * import {Server} from "https://deno.land/std/http/mod.ts";
 * const server = new Server();
 * server.listenAndServe();
 * announceAddrs(server.addrs);
 * ```
 * @param {(AddrWithProtocol)[]} addrs
 * @param {AnnounceOptions} options
 */
export function announceAddrs(addrs, {
	titleText = "Listening on:",
	defaultProtocol,
} = {}) {
	const listenUrls = [];
	for (const addr of addrs) {
		if ("hostname" in addr) {
			let hostname = addr.hostname;
			if (hostname == "0.0.0.0") {
				hostname = "localhost";
			}
			let protocol = addr.protocol || defaultProtocol || commonPortProtocols[addr.port] ||  "";
			if (protocol) {
				if (protocol.endsWith(":")) {
					protocol += "//";
				} else if (!protocol.endsWith("://")) {
					protocol += "://";
				}
			}
			listenUrls.push(`- ${protocol}${hostname}:${addr.port}`);
		}
	}
	console.log(titleText + "\n" + listenUrls.join("\n"));
}

/**
 * A utility that allows you to collect addresses for them to be printed later.
 */
export class AddrAnnouncer {
	/**
	 * @param {AnnounceOptions} announceOptions
	 */
	constructor(announceOptions = {}) {
		this.announceOptions = announceOptions;
		/** @type {AddrWithProtocol[]} */
		this.addrs = [];
	}

	/**
	 * Adds an address to be printed later.
	 * @param {Deno.Addr[]} addrs
	 * @param {string} [protocol]
	 */
	addAddrs(addrs, protocol) {
		for (const addr of addrs) {
			this.addrs.push({ ...addr, protocol });
		}
	}

	/**
	 * Prints all the collected addresses
	 */
	announce() {
		announceAddrs(this.addrs, this.announceOptions);
	}
}
