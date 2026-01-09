### 8.4.2 The Connection Control Component

8.4.2.1 Connection Control Component Installation

8.4.2.2 Connection Control Component Configuration

8.4.2.3 Migrating to the Connection Control Component

The Connection Control component for MySQL (`component_connection_control`) makes it possible to introduce an increasing delay in the MySQL server's response to connection attempts after an arbitrary number of consecutive failed attempts. This capability provides a deterrent that slows down brute force attacks against MySQL user accounts.

* Purpose: Monitor failed connection attempts; add a delay in the response to an account with an excessive number of attempts.

* URN: `file://component_connection_control`

`component_connection_control` was introduced in MySQL 9.2.0 as a single replacement for both Connection Control plugins, which are now deprecated (see Section 8.4.3, “Connection Control Plugins”, for more information about these plugins).

This component also exposes system variables that enable its operation to be configured and a status variable that provides basic monitoring information; these are described in Section 8.4.2.2, “Connection Control Component Configuration”, and elsewhere. In addition, `component_connection_control` implements a Performance Schema table `connection_control_failed_login_attempts` which provides detailed monitoring information for failed connection attempts. For more information about this table, see Section 29.12.22.2, “The connection_control_failed_login_attempts Table”.

The component also supports the MySQL Option Tracker component (part of MySQL Enterprise Edition, a commercial offering). See Section 7.5.8.2, “Option Tracker Supported Components”, for more information.

The first two sections following provide information about installing and configuring the component. An additional section, Section 8.4.2.3, “Migrating to the Connection Control Component”, provides guidance on migrating from the Connection Control plugins to the Connection Control component.
