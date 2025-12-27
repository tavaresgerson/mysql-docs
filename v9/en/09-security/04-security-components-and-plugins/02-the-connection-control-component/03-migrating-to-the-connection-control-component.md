#### 8.4.2.3 Migrating to the Connection Control Component

Migrating from the Connection Control plugins to the Connection Control component consists of the following steps:

1. Remove any references to the plugins in configuration files, including references made by `--plugin-load-add` or `--early-plugin-load` or plugin system variables.

   As part of this step, copy the values for any Connection Control plugin system variables that you wish to retain. Also, remove any persisted plugin variables using `RESET PERSIST`.

2. Uninstall the plugins, using the following two statements:

   ```
   UNINSTALL PLUGIN CONNECTION_CONTROL;
   UNINSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS;
   ```

3. Install the component as described in Section 8.4.2.1, “Connection Control Component Installation”.

4. If you copied any plugin system variable values, assign these in the server's configuration file to to the equivalent variables supplied by the component, as shown in this table:

   <table><col width="50%"/><col width="50%"/><thead><tr> <th>Plugin Variable</th> <th>Component Variable</th> </tr></thead><tbody><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold"><code class="literal">connection_control_failed_connections_threshold</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.failed_connections_threshold"><code class="literal">component_connection_control.failed_connections_threshold</code></a></td> </tr><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay"><code class="literal">connection_control_max_connection_delay</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.max_connection_delay"><code class="literal">component_connection_control.max_connection_delay</code></a></td> </tr><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay"><code class="literal">connection_control_min_connection_delay</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.min_connection_delay"><code class="literal">component_connection_control.min_connection_delay</code></a></td> </tr></tbody></table>

   Use `SET PERSIST` to persist any component variable values that were persisted previously for their plugin equivalents.

5. Restart the server so that it uses the updated configuration.
