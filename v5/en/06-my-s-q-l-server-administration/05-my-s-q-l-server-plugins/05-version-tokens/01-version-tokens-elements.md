#### 5.5.5.1 Version Tokens Elements

Version Tokens is based on a plugin library that implements these elements:

* A server-side plugin named `version_tokens` holds the list of version tokens associated with the server and subscribes to notifications for statement execution events. The `version_tokens` plugin uses the [audit plugin API](/doc/extending-mysql/5.7/en/plugin-types.html#audit-plugin-type) to monitor incoming statements from clients and matches each client's session-specific version token list against the server version token list. If there is a match, the plugin lets the statement through and the server continues to process it. Otherwise, the plugin returns an error to the client and the statement fails.

* A set of loadable functions provides an SQL-level API for manipulating and inspecting the list of server version tokens maintained by the plugin. The [`SUPER`](privileges-provided.html#priv_super) privilege is required to call any of the Version Token functions.

* A system variable enables clients to specify the list of version tokens that register the required server state. If the server has a different state when a client sends a statement, the client receives an error.
