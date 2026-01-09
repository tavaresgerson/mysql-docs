#### 8.4.3.2 Connection Control Plugin System and Status Variables

This section describes the system and status variables that the `CONNECTION_CONTROL` plugin provides to enable its operation to be configured and monitored.

* Connection Control Plugin System Variables
* Connection Control Plugin Status Variables

##### Connection Control Plugin System Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes these system variables:

* `connection_control_failed_connections_threshold`

  <table frame="box" rules="all" summary="Properties for connection_control_failed_connections_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code class="literal">connection_control_failed_connections_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code class="literal">SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2147483647</code></td> </tr></tbody></table>

  The number of consecutive failed connection attempts permitted to accounts before the server adds a delay for subsequent connection attempts:

  + If the variable has a nonzero value *`N`*, the server adds a delay beginning with consecutive failed attempt *`N`*+1. If an account has reached the point where connection responses are delayed, a delay also occurs for the next subsequent successful connection.

  + Setting this variable to zero disables failed-connection counting. In this case, the server never adds delays.

  For information about how `connection_control_failed_connections_threshold` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

* `connection_control_max_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_max_connection_delay"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code class="literal">connection_control_max_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code class="literal">SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">2147483647</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The maximum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_max_connection_delay` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

* `connection_control_min_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_min_connection_delay"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code class="literal">connection_control_min_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code class="literal">SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1000</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1000</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The minimum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_min_connection_delay` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

##### Connection Control Plugin Status Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes this status variable:

* `Connection_control_delay_generated`

  The number of times the server added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the threshold defined by the `connection_control_failed_connections_threshold` system variable.

  This variable provides a simple counter. For more detailed connection control monitoring information, examine the `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table; see Section 28.6.2, “The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table”.

  Assigning a value to `connection_control_failed_connections_threshold` at runtime resets `Connection_control_delay_generated` to zero.
