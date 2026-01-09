#### 6.4.4.12 Keyring System Variables

MySQL Keyring plugins support the following system variables. Use them to configure keyring plugin operation. These variables are unavailable unless the appropriate keyring plugin is installed (see [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation")).

* [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id)

  <table frame="box" rules="all" summary="Properties for keyring_aws_cmk_id"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-cmk-id=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The customer master key (CMK) ID obtained from the AWS KMS server and used by the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_aws` initialization fails.

* [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file)

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the configuration file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, `keyring_aws` reads the AWS secret access key ID and key from the configuration file. For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described in [Section 6.4.4.5, “Using the keyring_aws Amazon Web Services Keyring Plugin”](keyring-aws-plugin.html "6.4.4.5 Using the keyring_aws Amazon Web Services Keyring Plugin").

  The default file name is `keyring_aws_conf`, located in the default keyring file directory. The location of this default directory is the same as for the [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable. See the description of that variable for details, as well as for considerations to take into account if you create the directory manually.

* [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file)

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the storage file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, if the value assigned to [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file) specifies a file that does not exist, the `keyring_aws` plugin attempts to create it (as well as its parent directory, if necessary). If the file does exist, `keyring_aws` reads any encrypted keys contained in the file into its in-memory cache. `keyring_aws` does not cache unencrypted keys in memory.

  The default file name is `keyring_aws_data`, located in the default keyring file directory. The location of this default directory is the same as for the [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable. See the description of that variable for details, as well as for considerations to take into account if you create the directory manually.

* [`keyring_aws_region`](keyring-system-variables.html#sysvar_keyring_aws_region)

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valid Values (≥ 5.7.39)</th> <td><p><code>af-south-1</code></p><p><code>ap-east-1</code></p><p><code>ap-northeast-1</code></p><p><code>ap-northeast-2</code></p><p><code>ap-northeast-3</code></p><p><code>ap-south-1</code></p><p><code>ap-southeast-1</code></p><p><code>ap-southeast-2</code></p><p><code>ca-central-1</code></p><p><code>cn-north-1</code></p><p><code>cn-northwest-1</code></p><p><code>eu-central-1</code></p><p><code>eu-north-1</code></p><p><code>eu-south-1</code></p><p><code>eu-west-1</code></p><p><code>eu-west-2</code></p><p><code>eu-west-3</code></p><p><code>me-south-1</code></p><p><code>sa-east-1</code></p><p><code>us-east-1</code></p><p><code>us-east-2</code></p><p><code>us-gov-east-1</code></p><p><code>us-iso-east-1</code></p><p><code>us-iso-west-1</code></p><p><code>us-isob-east-1</code></p><p><code>us-west-1</code></p><p><code>us-west-2</code></p></td> </tr><tr><th>Valid Values (≥ 5.7.27, ≤ 5.7.38)</th> <td><p><code>ap-northeast-1</code></p><p><code>ap-northeast-2</code></p><p><code>ap-south-1</code></p><p><code>ap-southeast-1</code></p><p><code>ap-southeast-2</code></p><p><code>ca-central-1</code></p><p><code>cn-north-1</code></p><p><code>cn-northwest-1</code></p><p><code>eu-central-1</code></p><p><code>eu-west-1</code></p><p><code>eu-west-2</code></p><p><code>eu-west-3</code></p><p><code>sa-east-1</code></p><p><code>us-east-1</code></p><p><code>us-east-2</code></p><p><code>us-west-1</code></p><p><code>us-west-2</code></p></td> </tr><tr><th>Valid Values (≥ 5.7.19, ≤ 5.7.26)</th> <td><p><code>ap-northeast-1</code></p><p><code>ap-northeast-2</code></p><p><code>ap-south-1</code></p><p><code>ap-southeast-1</code></p><p><code>ap-southeast-2</code></p><p><code>eu-central-1</code></p><p><code>eu-west-1</code></p><p><code>sa-east-1</code></p><p><code>us-east-1</code></p><p><code>us-west-1</code></p><p><code>us-west-2</code></p></td> </tr></tbody></table>

  The AWS region for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  If not set, the AWS region defaults to `us-east-1`. Thus, for any other region, this variable must be set explicitly.

* [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data)

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_data"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-data=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The path name of the data file used for secure data storage by the `keyring_encrypted_file` plugin. This variable is unavailable unless that plugin is installed. The file location should be in a directory considered for use only by keyring plugins. For example, do not locate the file under the data directory.

  Keyring operations are transactional: The `keyring_encrypted_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) system variable with a suffix of `.backup`.

  Do not use the same `keyring_encrypted_file` data file for multiple MySQL instances. Each instance should have its own unique data file.

  The default file name is `keyring_encrypted`, located in a directory that is platform specific and depends on the value of the [`INSTALL_LAYOUT`](source-configuration-options.html#option_cmake_install_layout) **CMake** option, as shown in the following table. To specify the default directory for the file explicitly if you are building from source, use the [`INSTALL_MYSQLKEYRINGDIR`](source-configuration-options.html#option_cmake_install_mysqlkeyringdir) **CMake** option.

  <table summary="The default keyring_encrypted_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code> Value</th> <th>Default <code>keyring_encrypted_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>, <code>RPM</code>, <code>SLES</code>, <code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring_encrypted</code></td> </tr><tr> <td>Otherwise</td> <td><code>keyring/keyring_encrypted</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

  At plugin startup, if the value assigned to [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) specifies a file that does not exist, the `keyring_encrypted_file` plugin attempts to create it (as well as its parent directory, if necessary).

  If you create the directory manually, it should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  If the `keyring_encrypted_file` plugin cannot create or access its data file, it writes an error message to the error log. If an attempted runtime assignment to [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) results in an error, the variable value remains unchanged.

  Important

  Once the `keyring_encrypted_file` plugin has created its data file and started to use it, it is important not to remove the file. Loss of the file causes data encrypted using its keys to become inaccessible. (It is permissible to rename or move the file, as long as you change the value of [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) to match.)

* [`keyring_encrypted_file_password`](keyring-system-variables.html#sysvar_keyring_encrypted_file_password)

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_password"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-password=password</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_password</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password used by the `keyring_encrypted_file` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_encrypted_file` initialization fails.

  If this variable is specified in an option file, the file should have a restrictive mode and be accessible only to the account used to run the MySQL server.

  Important

  Once the [`keyring_encrypted_file_password`](keyring-system-variables.html#sysvar_keyring_encrypted_file_password) value has been set, changing it does not rotate the keyring password and could make the server inaccessible. If an incorrect password is provided, the `keyring_encrypted_file` plugin cannot load keys from the encrypted keyring file.

  The password value cannot be displayed at runtime with [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") or the Performance Schema [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table because the display value is obfuscated.

* [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data)

  <table frame="box" rules="all" summary="Properties for keyring_file_data"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-file-data=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.11</td> </tr><tr><th>System Variable</th> <td><code>keyring_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The path name of the data file used for secure data storage by the `keyring_file` plugin. This variable is unavailable unless that plugin is installed. The file location should be in a directory considered for use only by keyring plugins. For example, do not locate the file under the data directory.

  Keyring operations are transactional: The `keyring_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable with a suffix of `.backup`.

  Do not use the same `keyring_file` data file for multiple MySQL instances. Each instance should have its own unique data file.

  The default file name is `keyring`, located in a directory that is platform specific and depends on the value of the [`INSTALL_LAYOUT`](source-configuration-options.html#option_cmake_install_layout) **CMake** option, as shown in the following table. To specify the default directory for the file explicitly if you are building from source, use the [`INSTALL_MYSQLKEYRINGDIR`](source-configuration-options.html#option_cmake_install_mysqlkeyringdir) **CMake** option.

  <table summary="The default keyring_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code> Value</th> <th>Default <code>keyring_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>, <code>RPM</code>, <code>SLES</code>, <code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring</code></td> </tr><tr> <td>Otherwise</td> <td><code>keyring/keyring</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

  At plugin startup, if the value assigned to [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) specifies a file that does not exist, the `keyring_file` plugin attempts to create it (as well as its parent directory, if necessary).

  If you create the directory manually, it should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  If the `keyring_file` plugin cannot create or access its data file, it writes an error message to the error log. If an attempted runtime assignment to [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) results in an error, the variable value remains unchanged.

  Important

  Once the `keyring_file` plugin has created its data file and started to use it, it is important not to remove the file. For example, `InnoDB` uses the file to store the master key used to decrypt the data in tables that use `InnoDB` tablespace encryption; see [Section 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). Loss of the file causes data in such tables to become inaccessible. (It is permissible to rename or move the file, as long as you change the value of [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) to match.) It is recommended that you create a separate backup of the keyring data file immediately after you create the first encrypted table and before and after master key rotation.

* [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir)

  <table frame="box" rules="all" summary="Properties for keyring_okv_conf_dir"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-okv-conf-dir=dir_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>keyring_okv_conf_dir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The path name of the directory that stores configuration information used by the `keyring_okv` plugin. This variable is unavailable unless that plugin is installed. The location should be a directory considered for use only by the `keyring_okv` plugin. For example, do not locate the directory under the data directory.

  The default [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) value is empty. For the `keyring_okv` plugin to be able to access Oracle Key Vault, the value must be set to a directory that contains Oracle Key Vault configuration and SSL materials. For instructions on setting up this directory, see [Section 6.4.4.4, “Using the keyring_okv KMIP Plugin”](keyring-okv-plugin.html "6.4.4.4 Using the keyring_okv KMIP Plugin").

  The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  If the value assigned to [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) specifies a directory that does not exist, or that does not contain configuration information that enables a connection to Oracle Key Vault to be established, `keyring_okv` writes an error message to the error log. If an attempted runtime assignment to [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) results in an error, the variable value and keyring operation remain unchanged.

* [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations)

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  Whether keyring operations are enabled. This variable is used during key migration operations. See [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").
