#### 8.4.5.1 Keyring Components Versus Keyring Plugins

The MySQL Keyring originally implemented keystore capabilities using server plugins, but began transitioning to use the component infrastructure. This section briefly compares keyring components and plugins to provide an overview of their differences. It may assist you in making the transition from plugins to components, or, if you are just beginning to use the keyring, assist you in choosing whether to use a component versus using a plugin.

* Keyring plugin loading uses the `--early-plugin-load` option (deprecated). Keyring component loading uses a manifest.

* Keyring plugin configuration is based on plugin-specific system variables. For keyring components, no system variables are used. Instead, each component has its own configuration file.

* Keyring components have fewer restrictions than keyring plugins with respect to key types and lengths. See Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

  Note

  `component_keyring_oci` can generate keys of type `AES` with a size of 16, 24, or 32 bytes only.

* Keyring components support secure storage for persisted system variable values, whereas keyring plugins do not support the function.

  A keyring component must be enabled on the MySQL server instance to support secure storage for persisted system variable values. The sensitive data that can be protected in this way includes items such as private keys and passwords that appear in the values of system variables. In the operating system file where persisted system variables are stored, the names and values of sensitive system variables are stored in an encrypted format, along with a generated file key to decrypt them. The generated file key is in turn encrypted using a master key that is stored in a keyring. See Persisting Sensitive System Variables.
