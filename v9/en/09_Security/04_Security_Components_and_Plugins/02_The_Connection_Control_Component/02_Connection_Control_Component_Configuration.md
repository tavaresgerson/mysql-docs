#### 8.4.2.2 Connection Control Component Configuration

The Connection Control component exposes the following system variables:

* `component_connection_control.failed_connections_threshold`: This is the number of consecutive failed connection attempts by a given account which are allowed before the server adds a delay for subsequent connection attempts by this user. To disable counting of failed connections, set this variable to zero.

* `component_connection_control.max_connection_delay`: The maximum delay in milliseconds for connection failures above the threshold.

* `component_connection_control.min_connection_delay`: The minimum delay in milliseconds for connection failures above the threshold.

* `component_connection_control.exempt_unknown_users`: Whether to penalize hosts generating failed TCP connections. This improves the component's ability to handle legitimate connection attempts from load balancers, ensuring better server availability while maintaining effectiveness in thwarting brute force attacks.

If `component_connection_control.failed_connections_threshold` is greater than zero, counting of failed connections and thus connection control is enabled, and applies as follows for each user account:

* The first `component_connection_control.failed_connections_threshold` consecutive times that this account fails to connect, no action is taken.

* For each subsequent attempt by this user to connect, the server adds an increasing delay, until a successful connection occurs. Initial unadjusted delays begin at 1000 milliseconds (1 second) and increase by 1000 milliseconds per attempt. That is, once a delay has been imposed for a given account, the unadjusted delays for subsequent failed attempts are 1000 milliseconds, 2000 milliseconds, 3000 milliseconds, and so forth.

* The actual delay experienced by a client is the unadjusted delay, adjusted to lie within the values of the `component_connection_control.min_connection_delay` and `component_connection_control.max_connection_delay` system variables, inclusive.

  For example, assuming that `component_connection_control.failed_connections_threshold` is the default (3): If `component_connection_control.min_connection_delay` is 3000 and `component_connection_control.max_connection_delay` is 6000, then the delay for each failed attempt to connect is as shown in the following table:

  <table><thead><tr> <th>Attempt #</th> <th>Unadjusted Delay (milliseconds)</th> <th>Actual Delay (milliseconds)</th> </tr></thead><tbody><tr> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <td>2</td> <td>0</td> <td>0</td> </tr><tr> <td>3</td> <td>0</td> <td>0</td> </tr><tr> <td>4</td> <td>1000</td> <td>3000</td> </tr><tr> <td>5</td> <td>2000</td> <td>3000</td> </tr><tr> <td>6</td> <td>3000</td> <td>3000</td> </tr><tr> <td>7</td> <td>4000</td> <td>4000</td> </tr><tr> <td>8</td> <td>5000</td> <td>5000</td> </tr><tr> <td>9</td> <td>6000</td> <td>6000</td> </tr><tr> <td>10</td> <td>7000</td> <td>6000</td> </tr><tr> <td>11</td> <td>8000</td> <td>6000</td> </tr><tr> <td>12</td> <td>8000</td> <td>6000</td> </tr></tbody></table>

* Once delays have been instituted for an account, the first successful connection thereafter by that account also experiences a delay, but the failure count is reset to zero for subsequent connections by this account.

The Connection Control component also exposes the following status variables: .

* `Component_connection_control_delay_generated` is the number of times the server has added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the limit set by the `component_connection_control.failed_connections_threshold` system variable, since no delay was imposed for these attempts.

  This variable provides a simple counter. You can obtain more detailed connection control monitoring information from the Performance Schema the `connection_control_failed_login_attempts` table.

  Assigning a value to `component_connection_control.failed_connections_threshold` at runtime resets `Component_connection_control_delay_generated` to zero.

* `Component_connection_control_exempted_unknown_users` lists the number of connections exempted by `component_connection_control.exempt_unknown_users`.

When the `component_connection_control` component is installed, it checks connection attempts and tracks whether they fail or succeed. For this purpose, a failed connection attempt is one for which the client user and host match a known MySQL account but the provided credentials are incorrect, or do not match any known account.

**Proxies.** Counting of failed connection attempts is based on the combination of user name and host name (`user@host`) used for each connection attempt. Determination of the applicable user name and host name takes proxying into account, as follows:

* If the client user proxies another user, the account for failed-connection counting is the proxying user, not the proxied user. For example, if `external_user@example.com` proxies `proxy_user@example.com`, connection counting uses the proxying user, `external_user@example.com`, rather than the proxied user, `proxy_user@example.com`. Both `external_user@example.com` and `proxy_user@example.com` must have valid entries in the `mysql.user` system table and a proxy relationship between them must be defined in the `mysql.proxies_priv` system table (see Section 8.2.19, “Proxy Users”).

* If the client user does not proxy another user, but does match a `mysql.user` entry, counting uses the `CURRENT_USER()` value corresponding to that entry. For example, if a user `user1` connecting from a host `host1.example.com` matches a `user1@host1.example.com` entry, counting uses `user1@host1.example.com`. If the user matches a `user1@%.example.com`, `user1@%.com`, or `user1@%` entry instead, counting uses `user1@%.example.com`, `user1@%.com`, or `user1@%`, respectively.

For the cases just described, the connection attempt matches some `mysql.user` entry, and whether the request succeeds or fails depends on whether the client provides the correct authentication credentials. For example, if the client presents an incorrect password, the connection attempt fails.

If the connection attempt matches no `mysql.user` entry, the attempt fails. In this case, no `CURRENT_USER()` value is available and connection-failure counting uses the user name provided by the client and the client host as determined by the MySQL server. For example, if a client attempts to connect as user `user2` from host `host2.example.com`, the user name part is available in the client request and the server determines the host information. The user/host combination used for counting is `user2@host2.example.com`.

Note

The MySQL server maintains information about which client hosts can possibly connect to the server (essentially the union of host values for `mysql.user` entries). If a client attempts to connect from any other host, the server rejects the attempt at an early stage of connection setup:

```
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

This type of rejection occurs before password authentication is attempted; thus, the Connection Control component does not see it, and it is not included in the count shown by `Component_connection_control_delay_generated` or in the `performance_schema.connection_control_failed_login_attempts` table.

**Failure monitoring.** You can use the following information sources to monitor failed connections:

* `Component_connection_control_delay_generated`: This server status variable indicates the number of times the server has added a delay to its response to a failed connection attempt, not counting attempts that occur before reaching the limit determined by `component_connection_control.failed_connections_threshold`.

* `connection_control_failed_login_attempts`: This Performance Schema table provides the current number of consecutive failed connection attempts per MySQL user account (that is, for each combination of user and host). This count includes all failed attempts, regardless of whether they were delayed.

Assigning a value to `component_connection_control.failed_connections_threshold` at runtime has the effects listed here:

* All accumulated failed-connection counters are reset to zero.

* `Component_connection_control_delay_generated` is reset to zero.

* The `performance_schema.connection_control_failed_login_attempts` table becomes empty.
