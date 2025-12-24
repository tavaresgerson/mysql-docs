## 7.5 MySQL Components

MySQL Server includes a component-based infrastructure for extending server capabilities. A component provides services that are available to the server and other components. (With respect to service use, the server is a component, equal to other components.) Components interact with each other only through the services they provide.

MySQL distributions include several components that implement server extensions:

* Components for configuring error logging. See Section 7.4.2, “The Error Log”, and Section 7.5.3, “Error Log Components”.
* A component for checking passwords. See Section 8.4.3, “The Password Validation Component”.
* Keyring components provide secure storage for sensitive information. See  Section 8.4.4, “The MySQL Keyring”.
* A component that enables applications to add their own message events to the audit log. See Section 8.4.6, “The Audit Message Component”.
* A component that implements a loadable function for accessing query attributes. See  Section 11.6, “Query Attributes”.
* A component for scheduling actively executing tasks. See Section 7.5.5, “Scheduler Component”.

System and status variables implemented by a component are exposed when the component is installed and have names that begin with a component-specific prefix. For example, the `log_filter_dragnet` error log filter component implements a system variable named `log_error_filter_rules`, the full name of which is `dragnet.log_error_filter_rules`. To refer to this variable, use the full name.

The following sections describe how to install and uninstall components, and how to determine at runtime which components are installed and obtain information about them.

For information about the internal implementation of components, see the MySQL Server Doxygen documentation, available at https://dev.mysql.com/doc/index-other.html. For example, if you intend to write your own components, this information is important for understanding how components work.
