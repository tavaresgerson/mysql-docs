#### 7.5.8.3 Option Tracker Status Variables

The Option Tracker component supplies a number of status variables, which are described in this section.

**Table 7.9 Option Tracker Status Variable Summary**

<table frame="box" rules="all" summary="Reference for status variables supplied by the Option Tracker."><thead><tr><th>Variable Name</th> <th>Variable Type</th> <th>Variable Scope</th> </tr></thead><tbody><tr><th>option_tracker_usage:AWS keyring plugin</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Binary Log</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Connection control component</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Connection DoS control</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Encrypted File keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Enterprise AUDIT</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Enterprise Data Masking</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Enterprise Encryption</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Enterprise Firewall</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Enterprise Thread Pool</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:File keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Group Replication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Hashicorp keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Hypergraph Optimizer</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:HyperLogLog</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:JavaScript Library</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:JavaScript Stored Program</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:JSON Duality View</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Kerberos authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:LDAP Simple authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Server</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell _ Copy</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell _ Dump</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell _ Dump _ Load</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell for VS Code</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell _ MRS</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell _ Upgrade Checker</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ Dump</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ Dump _ Load</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ HeatWave Chat</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ Lakehouse Navigator</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ MRS</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Shell VSC _ Natural Language to SQL</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:MySQL Telemetry</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:OCI Authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Oracle Key Vault keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:PAM authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Password validation</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Replication Replica</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:SASL LDAP Authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Scheduler</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Traditional MySQL Optimizer</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Vector</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:WebAssembly Library</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:WebauthN authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker_usage:Windows authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_complete_table_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_complete_table_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_error_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_error_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_reset_request_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_reset_request_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_single_row_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th>option_tracker.gr_single_row_sent</th> <td>Integer</td> <td>Global</td> </tr></tbody></table>

* `option_tracker_usage:AWS keyring plugin`

  Number of times a general-purpose keyring function has been called using the AWS keyring plugin.

* `option_tracker_usage:Binary Log`

  Incremented every 600 seconds (10 minutes) while binary logging is enabled.

* `option_tracker_usage:Connection control component`

  The number of times that a failed connection attempt has been delayed.

* `option_tracker_usage:Connection DoS control`

  The number of times a failed connection attempt has been delayed.

* `option_tracker_usage:Encrypted File keyring`

  Number of times that any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called.

* `option_tracker_usage:Enterprise AUDIT`

  This count is incremented when any Audit Log plugin function is called, or when a new audit output file is opened for writing. See Section 8.4.6, “MySQL Enterprise Audit”, for more information.

* `option_tracker_usage:Enterprise Data Masking`

  This value is incremented each time that a MySQL Enterprise Data Masking function is used. See Section 8.5, “MySQL Enterprise Data Masking”.

* `option_tracker_usage:Enterprise Encryption`

  This is incremented each time a MySQL Enterprise Encryption function is called. See Section 8.6, “MySQL Enterprise Encryption”, for more information.

* `option_tracker_usage:Enterprise Firewall`

  This status variable is incremented each time a MySQL Enterprise Firewall administrative function is called, or a statement is added, flagged, or rejected. See Section 8.4.8, “MySQL Enterprise Firewall”.

* `option_tracker_usage:Enterprise Thread Pool`

  The number of times that the MySQL Enterprise Thread Pool plugin has been initialized, or a new connection added. See Section 7.6.3, “MySQL Enterprise Thread Pool”, for more information.

* `option_tracker_usage:File keyring`

  This variable is imcremented each time any general-purpose keyring function (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) is called.

* `option_tracker_usage:Group Replication`

  This status variable is incremented every 600 seconds (10 minutes) whenever the MySQL Group Replication plugin is running. See Chapter 20, *Group Replication*.

* `option_tracker_usage:Hashicorp keyring`

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the Hashicorp keyring component.

* `option_tracker_usage:Hypergraph Optimizer`

  Number of times a query was optimized using the Hypergrpah Optimizer. MySQL HeatWave only.

* `option_tracker_usage:HyperLogLog`

  Incremented whenever the `HLL()` aggregate function is called. MySQL HeatWave only.

* `option_tracker_usage:JavaScript Library`

  Number of times that a JavaScript library has been created or used. See Section 27.3.8, “Using JavaScript Libraries”.

* `option_tracker_usage:JavaScript Stored Program`

  Incremented each time a JavaScript program is invoked. See Section 27.3, “JavaScript Stored Programs”.

* `option_tracker_usage:JSON Duality View`

  Number of times that a JSON duality view has been opened. See Section 27.7, “JSON Duality Views”.

* `option_tracker_usage:Kerberos authentication`

  When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using the Kerberos authentication component.

* `option_tracker_usage:LDAP Simple authentication`

  Incremented whenever any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using the `authentication_ldap_simple` plugin.

* `option_tracker_usage:MySQL Server`

  This status variable is reset to 0 whenever the MySQL server is restarted. Thereafter, it is incremented every 600 seconds (10 minutes) as long as the server is running.

* `option_tracker_usage-MySQL_Shell_VSC_HeatWave_Chat`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Natural_Language_to_SQL`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Lakehouse_Navigator`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_for_VS_Code`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Dump`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Dump`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Dump_Load`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Dump_Load`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_MRS`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_MRS`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Copy`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Upgrade_Checker`

  Reserved for future development.

* `option_tracker_usage:MySQL Telemetry`

  This value is incremented every 1000th time that traces, logs, or metrics are exported.

* `option_tracker_usage:OCI Authentication`

  Incremented each time any OCI Authentication plugin function is called.

* `option_tracker_usage:Oracle Key Vault keyring`

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the Oracle Key Vault keyring plugin.

* `option_tracker_usage:PAM authentication`

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the PAM Authentication plugin. For more information, see Section 8.4.1.4, “PAM Pluggable Authentication”.

* `option_tracker_usage:Password validation`

  The number of times that passwords have been evaluated for strength, validated, or changed using `component_validate_password`. See Section 8.4.4, “The Password Validation Component”.

* `option_tracker_usage:Replication Replica`

  Every 600 seconds (10 minutes) whenever replication is enabled and this server is acting as a replica; reset each time a secondary is reset or the primary is changed.

* `option_tracker_usage:SASL LDAP Authentication`

  The number of times that a password has been evaluated for strength, validated, or changed using the `authentication_ldap_sasl` plugin. See Section 8.4.1.6, “LDAP Pluggable Authentication”, for more information.

* `option_tracker_usage:Scheduler`

  The number of times that a scheduled task has been created, executed, or deleted using the Scheduler component. See Section 7.5.5, “Scheduler Component”.

* `option_tracker_usage:Traditional MySQL Optimizer`

  This is the number of times that queries has been executed using the traditional MySQL optimizer.

* `option_tracker_usage:Vector`

  Incremented whenever the `DISTANCE()` function or its alias `VECTOR_DISTANCE()` is called (MySQL HeatWave only)

* `option_tracker_usage:WebAssembly Library`

  The number of times that WebAssembly libraries have been created or used. See Section 27.3.9, “Using WebAssembly Libraries”, for more information.

* `option_tracker_usage:WebauthN authentication`

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the WebauthN authentication plugin. For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* `option_tracker_usage:Windows authentication`

  This value is incremented each time any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) is called using the MySQL Windows authentication plugin. See Section 8.4.1.5, “Windows Pluggable Authentication”, for more information.

* `option_tracker.gr_complete_table_received`

  This is the number of complete tables which have been received through Group Replication.

* `option_tracker.gr_complete_table_sent`

  This is the number of complete tables which have been sent through Group Replication.

* `option_tracker.gr_error_received`

  This is the number of errors which have been received through Group Replication.

* `option_tracker.gr_error_sent`

  This is the number of errors which have been sent through Group Replication.

* `option_tracker.gr_reset_request_received`

  This is the number of reset requests which have been received through Group Replication.

* `option_tracker.gr_reset_request_sent`

  This is the number of reset requests which have been sent through Group Replication.

* `option_tracker.gr_single_row_received`

  This is the number of single rows which have been received through Group Replication.

* `option_tracker.gr_single_row_sent`

  This is the number of single rows which have been sent through Group Replication.
