#### 15.7.4.5 UNINSTALL COMPONENT Statement

```
UNINSTALL COMPONENT component_name [, component_name ] ...
```

This statement deactivates and uninstalls one or more components. A component provides services that are available to the server and other components; see Section 7.5, “MySQL Components”. `UNINSTALL COMPONENT` is the complement of `INSTALL COMPONENT`. It requires the `DELETE` privilege for the `mysql.component` system table because it removes the row from that table that registers the component. `UNINSTALL COMPONENT` does not undo persisted variables, including the variables persisted using `INSTALL COMPONENT ... SET PERSIST`.

Example:

```
UNINSTALL COMPONENT 'file://component1', 'file://component2';
```

For information about component naming, see Section 15.7.4.3, “INSTALL COMPONENT Statement”.

If any error occurs, the statement fails and has no effect. For example, this happens if a component name is erroneous, a named component is not installed, or cannot be uninstalled because other installed components depend on it.

A loader service handles component unloading, which includes removing uninstalled components from the `mysql.component` system table that serves as a registry. As a result, unloaded components are not loaded during the startup sequence for subsequent server restarts.

Note

This statement has no effect for keyring components, which are loaded using a manifest file and cannot be uninstalled. See Section 8.4.4.2, “Keyring Component Installation”.
