#### 8.4.5.18 Keyring Command Options

MySQL supports the following keyring-related command-line options:

* `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-destination"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The destination keyring plugin or component for key migration. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”. The option value interpretation depends on whether `--keyring-migration-to-component` or `--keyring-migration-from-component` is specified:

  + If `--keyring-migration-to-component` is used, the option value is a keyring plugin, interpreted the same way as for `--keyring-migration-source`.

  + If `--keyring-migration-to-component` is used, the option value is a keyring component, specified as the component library name in the plugin directory, including any platform-specific extension such as `.so` or `.dll`.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination must differ, and the migration server must support both.

* `--keyring-migration-from-component`

  <table frame="box" rules="all" summary="Properties for keyring-migration-from-component"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-from-component[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indicates that a key migration is from a keyring component to a keyring plugin. This option makes it possible to migrate keys from a keyring component to a keyring plugin.

  For migration from a keyring plugin to a keyring component, use the `--keyring-migration-to-component` option. For key migration from one keyring component to another, use the **mysql\_migrate\_keyring** utility. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-host=host_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-host"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  The host location of the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”. Migration always occurs on the local host, so the option always specifies a value for connecting to a local server, such as `localhost`, `127.0.0.1`, `::1`, or the local host IP address or host name.

* `--keyring-migration-password[=password]`

  <table frame="box" rules="all" summary="Properties for keyring-migration-password"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

  The password value is optional. If not given, the server prompts for one. If given, there must be *no space* between `--keyring-migration-password=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. See Section 8.1.2.1, “End-User Guidelines for Password Security”. You can use an option file to avoid giving the password on the command line. In this case, the file should have a restrictive mode and be accessible only to the account used to run the migration server.

* `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Properties for keyring-migration-port"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-socket=path`

  <table frame="box" rules="all" summary="Properties for keyring-migration-socket"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For Unix socket file or Windows named pipe connections, the socket file or named pipe for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-source"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The source keyring plugin for key migration. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

  The option value is similar to that for `--plugin-load`, except that only one plugin library can be specified. The value is given as *`plugin_library`* or *`name`*`=`*`plugin_library`*, where *`plugin_library`* is the name of a library file that contains plugin code, and *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the library. The server looks for plugin library files in the directory named by the `plugin_dir` system variable.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination plugins must differ, and the migration server must support both plugins.

* `--keyring-migration-to-component`

  <table frame="box" rules="all" summary="Properties for keyring-migration-to-component"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-to-component[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indicates that a key migration is from a keyring plugin to a keyring component. This option makes it possible to migrate keys from a keyring plugin to a keyring component.

  For migration from a keyring component to a keyring plugin, use the `--keyring-migration-from-component` option. For key migration from one keyring component to another, use the **mysql\_migrate\_keyring** utility. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-user=user_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-user"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.
