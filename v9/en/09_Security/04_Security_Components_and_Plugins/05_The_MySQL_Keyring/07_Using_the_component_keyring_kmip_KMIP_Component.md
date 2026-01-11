#### 8.4.5.7 Using the component\_keyring\_kmip KMIP Component

Note

`component_keyring_kmip` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The Key Management Interoperability Protocol (KMIP) Keyring component is intended to replace the `keyring_okv` Keyring plugin, which is now deprecated. See Migration from KMIP Plugin.

The Key Management Interoperability Protocol (KMIP) enables communication of cryptographic keys between a key management server and its clients. The `component_keyring_kmip` keyring component uses the KMIP 1.1 protocol to communicate securely as a client of a KMIP back end. Keyring material is generated exclusively by the back end, not by `component_keyring_kmip`. The component works with Oracle Key Vault, and any other product that uses KMIP 1.1 protocol.

`component_keyring_kmip` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

To use `component_keyring_kmip` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_kmip`, as described in Section 8.4.5.2, “Keyring Component Installation”.

2. Write a configuration file for `component_keyring_kmip`, as described here.

* Configuration Notes
* Configuring component\_keyring\_kmip for Oracle Key Vault
* Password-Protecting the component\_keyring\_kmip Key File
* Migration from KMIP Plugin

##### Configuration Notes

When it initializes, `component_keyring_kmip` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_kmip.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_kmip` cannot initialize without a valid configuration.

`component_keyring_kmip` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"kmip_configuration_directory"`: Points to the path of a directory with any supported vault server configuration. MySQL server requires TLS certificates to communicate with the KMIP server, and it expects these certificates to be in the `config_dir/ssl` directory. MySQL server looks for the following files in the directory:

    - `CA.pem`
    - `cert.pem`
    - `key.pem` (if the key is password-protected, see Password-Protecting the component\_keyring\_kmip Key File)

    Only the certificates from the `ssl/` sub-directory are used. If the certificates are password-protected, then `password.txt` needs to be present in the `ssl/` sub-directory.

    If you use Oracle Key Vault, neither `okvclient.jar` nor `okvclient.ora` are used for the component configuration. `okvclient.ora` contains `SERVER=` and `STANDBY_SERVER=` options, which you directly pass when configuring the `keyring_okv` plugin. Thus, the file is not used. The `okvclient.jar` contains the `libokvcsdk.so` (the C SDK library), but it is not needed by the server.

  + `"cache_keys"`: If the value is `true`, the keys are cached in memory in plaintext. If the value is `false`, the keys are fetched from the backend server whenever accessed.

  + `"server"`: The primary host with the port number.

  + `"standby_server"`: The secondary host with the port number.

A configuration looks like this:

```
{
     "kmip_configuration_directory":"path to directory that contains SSL certificates"
     "cache_keys": true/false
     "server": "primary_host:primary_port",
     "standby_server": [
       "secondary_one_host:secondary_one_port,
       "secondary_two_host:secondary_two_port",
       "secondary_three_host:secondary_thre_port",
     ]
}
```

##### Configuring component\_keyring\_kmip for Oracle Key Vault

The discussion here assumes that you are familiar with Oracle Key Vault (OKV). Some pertinent information sources:

* Oracle Key Vault site

* Oracle Key Vault documentation

In Oracle Key Vault terminology, clients that use Oracle Key Vault to store and retrieve security objects are called endpoints. To communicate with Oracle Key Vault, it is necessary to register as an endpoint and enroll by downloading and installing endpoint support files. Note that you must register a separate endpoint for each MySQL Server instance. If two or more MySQL Server instances use the same endpoint, they can interfere with each other’s functioning.

To run any commands, you need to retrieve the `okvrestclipackage.zip` file. This file has the `bin`, `lib`, and `conf` directories.

`kmip_configuration_directory` has `okvclient.jar`, `okvclient.ora`, and `ssl`. To allow the `okvclient.jar` file to download the endpoint from the OKV server, run the following command:

```
${OKVRESTCLI}/bin/okv admin endpoint download --endpoint $EPNAME --location
ENDPOINT
```

To create the `ssl` directory, run the following command:

```
jar -xvf okvclient.jar ssl
```

A sample `component_keyring_kmip.cnf` file looks like the following:

```
{
  "kmip_configuration_directory":"path to directory that contains the ssl/ directory and SSL certificates"
     "cache_keys": true
     "server": "VALID_OKV_SERVER_IP:VALID_OKV_SERVER_PORT"
     "standby_server": "VALID_OKV_STANDBY_SERVER:VALID_OKV_STANDBY_SERVER_PORT"
}
```

##### Password-Protecting the component\_keyring\_kmip Key File

You can optionally protect the key file with a password and supply a file containing the password to enable the key file to be decrypted. To so do, change location to the `ssl` directory and perform these steps:

1. Encrypt the `key.pem` key file. For example, use a command like this, and enter the encryption password at the prompts:

   ```
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Save the encryption password in a single-line text file named `password.txt` in the `ssl` directory.

3. Verify that the encrypted key file can be decrypted using the following command. The decrypted file should display on the console:

   ```
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remove the original `key.pem` file and rename `key.pem.new` to `key.pem`.

5. Change the ownership and access mode of new `key.pem` file and `password.txt` file as necessary to ensure that they have the same restrictions as other files in the `ssl` directory.

##### Migration from KMIP Plugin

To migrate from the KMIP keyring plugin to the KMIP keyring component, you must perform the following steps:

1. Write a local or global manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). The content of the file must match what is shown here:

   ```
   {
     "components": "file://component_keyring_kmip"
   }
   ```

2. Write a configuration file for the component. See Configuration Notes.

3. Perform any migration of keys that might be required. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores” for more information.

4. Uninstall the plugin using `UNINSTALL PLUGIN`. See Uninstalling Plugins.

5. Remove any references to the plugin in `my.cnf` and any other MySQL configuration files. Be sure to remove the line shown here:

   ```
   early-plugin-load=keyring_okv.so
   ```

   In addition, you should remove references to any variables specific to the OKV keyring plugin (equivalent options listed previously). Variables that are persisted (saved to `mysqld-auto.cnf`) must be removed from the server's configuration using `RESET PERSIST`.

6. Restart **mysqld** to cause the changes to take effect.
