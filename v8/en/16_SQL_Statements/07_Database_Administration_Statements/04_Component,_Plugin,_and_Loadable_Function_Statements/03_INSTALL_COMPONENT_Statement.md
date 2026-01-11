#### 15.7.4.3 INSTALL COMPONENT Statement

```
INSTALL COMPONENT component_name  [, component_name ...
     [SET variable = expr [, variable = expr] ...]

  variable: {
    {GLOBAL | @@GLOBAL.} [component_prefix.]system_var_name
  | {PERSIST | @@PERSIST.} [component_prefix.]system_var_name
}
```

This statement installs one or more components, which become active immediately. A component provides services that are available to the server and other components; see Section 7.5, “MySQL Components”. `INSTALL COMPONENT` requires the `INSERT` privilege for the `mysql.component` system table because it adds a row to that table to register the component.

Example:

```
INSTALL COMPONENT 'file://component1', 'file://component2';
```

A component is named using a URN that begins with `file://` and indicates the base name of the library file that implements the component, located in the directory named by the `plugin_dir` system variable. Component names do not include any platform-dependent file name suffix such as `.so` or `.dll`. (These naming details are subject to change because component name interpretation is itself performed by a service and the component infrastructure makes it possible to replace the default service implementation with alternative implementations.)

`INSTALL COMPONENT` (from 8.0.33) permits setting the values of component system variables when you install one or more components. The `SET` clause enables you to specify variable values precisely when they are needed, without the inconvenience or limitations associated with other forms of assignment. Specifically, you can also set component variables with these alternatives:

* At server startup using options on the command line or in an option file, but doing so involves a server restart. The values do not take effect until you install the component. You can specify an invalid variable name for a component on the command line without triggering an error.

* Dynamically while the server is running by means of the `SET` statement, which enables you to modify operation of the server without having to stop and restart it. Setting a read-only variable is not permitted.

The optional `SET` clause applies a value, or values, only to the component specified in the `INSTALL COMPONENT` statement, rather than to all subsequent installations of that component. `SET GLOBAL|PERSIST` works for all types of variables, including read-only variables, without having to restart the server. A component system variable that you set using `INSTALL COMPONENT` takes precedence over any conflicting value coming from the command line or an option file.

Example:

```
INSTALL COMPONENT 'file://component1', 'file://component2'
    SET GLOBAL component1.var1 = 12 + 3, PERSIST component2.var2 = 'strings';
```

Omitting `PERSIST` or `GLOBAL` is equivalent to specifying `GLOBAL`.

Specifying `PERSIST` for any variable in `SET` silently executes `SET PERSIST_ONLY` immediately after `INSTALL COMPONENT` loads the components, but before updating the `mysql.component` table. If `SET PERSIST_ONLY` fails, then the server unloads all of the previously loaded new components without persisting anything to `mysql.component`.

The `SET` clause accepts only valid variable names of the component being installed and emits an error message for all invalid names. Subqueries, stored functions, and aggregate functions are not permitted as part of the value expression. If you install a single component, it is not necessary to prefix the variable name with the component name.

Note

While specifying a variable value using the `SET` clause is similar to that of the command line—it is available immediately at variable registration—there is a distinct difference in how the `SET` clause handles *invalid numerical* values for boolean variables. For example, if you set a boolean variable to 11 (`component1.boolvar = 11`), you see the following behavior:

* `SET` clause yields true
* Command line yields false (11 is neither ON nor 1)

If any error occurs, the statement fails and has no effect. For example, this happens if a component name is erroneous, a named component does not exist or is already installed, or component initialization fails.

A loader service handles component loading, which includes adding installed components to the `mysql.component` system table that serves as a registry. For subsequent server restarts, any components listed in `mysql.component` are loaded by the loader service during the startup sequence. This occurs even if the server is started with the `--skip-grant-tables` option.

If a component depends on services not present in the registry and you attempt to install the component without also installing the component or components that provide the services on which it depends, an error occurs:

```
ERROR 3527 (HY000): Cannot satisfy dependency for service 'component_a'
required by component 'component_b'.
```

To avoid this problem, either install all components in the same statement, or install the dependent component after installing any components on which it depends.

Note

For keyring components, do not use `INSTALL COMPONENT`. Instead, configure keyring component loading using a manifest file. See Section 8.4.4.2, “Keyring Component Installation”.
