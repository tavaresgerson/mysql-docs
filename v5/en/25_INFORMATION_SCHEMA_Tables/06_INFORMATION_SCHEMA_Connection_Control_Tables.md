## 24.6 INFORMATION\_SCHEMA Connection Control Tables

The following sections describe the `INFORMATION_SCHEMA` tables associated with the `connection_control` plugin.


### 24.6.1 INFORMATION\_SCHEMA Connection Control Table Reference

The following table summarizes `INFORMATION_SCHEMA` connection control tables. For greater detail, see the individual table descriptions.

**Table 24.9 INFORMATION\_SCHEMA Connection Control Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA connection control tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS</code></th> <td>Current number of consecutive failed connection attempts per account</td> <td>5.7.17</td> </tr></tbody></table>


### 24.6.2 The INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS Table

This table provides information about the current number of consecutive failed connection attempts per account (user/host combination). The table was added in MySQL 5.7.17.

`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` has these columns:

* `USERHOST`

  The user/host combination indicating an account that has failed connection attempts, in `'user_name'@'host_name'` format.

* `FAILED_ATTEMPTS`

  The current number of consecutive failed connection attempts for the `USERHOST` value. This counts all failed attempts, regardless of whether they were delayed. The number of attempts for which the server added a delay to its response is the difference between the `FAILED_ATTEMPTS` value and the `connection_control_failed_connections_threshold` system variable value.

#### Notes

* The `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` plugin must be activated for this table to be available, and the `CONNECTION_CONTROL` plugin must be activated or the table contents are always empty. See Section 6.4.2, “Connection Control Plugins”.

* The table contains rows only for accounts that have had one or more consecutive failed connection attempts without a subsequent successful attempt. When an account connects successfully, its failed-connection count is reset to zero and the server removes any row corresponding to the account.

* Assigning a value to the `connection_control_failed_connections_threshold` system variable at runtime resets all accumulated failed-connection counters to zero, which causes the table to become empty.
