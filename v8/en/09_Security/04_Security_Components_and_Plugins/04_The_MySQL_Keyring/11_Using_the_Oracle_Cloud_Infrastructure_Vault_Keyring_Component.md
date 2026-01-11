#### 8.4.4.11 Using the Oracle Cloud Infrastructure Vault Keyring Component

Note

The Oracle Cloud Infrastructure Vault keyring component is included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

`component_keyring_oci` is part of the component infrastructure that communicates with Oracle Cloud Infrastructure Vault for back end storage. No key information is permanently stored in MySQL server local storage. All keys are stored in Oracle Cloud Infrastructure Vault, making this component well suited for Oracle Cloud Infrastructure MySQL customers for management of their MySQL Enterprise Edition keys.

In MySQL 8.0.24, MySQL Keyring began transitioning from plugins to use the component infrastructure. The introduction of `component_keyring_oci` in MySQL 8.0.31 is a continuation of that effort. For more information, see Keyring Components Versus Keyring Plugins.

Note

Only one keyring component or plugin should be enabled at a time. Enabling multiple keyring components or plugins is unsupported and results may not be as anticipated.

To use `component_keyring_oci` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_oci`, as described in Section 8.4.4.2, “Keyring Component Installation”.

2. Write a configuration file for `component_keyring_oci`, as described here.

After writing a manifest and configuration file, you should be able to access keys that were created using the `keyring_oci` plugin, provided that you specify the same set of configuration options to initialize the keyring component. The built-in backward compatibility of `component_keyring_oci` simplifies migrating from the keyring plugin to the component.

* Configuration Notes
* Verify the Component Installation
* Vault Keyring Component Usage

##### Configuration Notes

When it initializes, `component_keyring_oci` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_oci.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_oci` cannot initialize without a valid configuration.

Local configuration files permit setting up multiple server instances to use `component_keyring_oci`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct Oracle Cloud Infrastructure Vault for each instance.

You are assumed to be familiar with Oracle Cloud Infrastructure concepts, but the following documentation may be helpful when setting up resources to be used by `component_keyring_oci`:

* Overview of Vault

* Required Keys and OCIDs

* Managing Keys

* Managing Compartments

* Managing Vaults

* Managing Secrets

`component_keyring_oci` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.

    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.

  + `“user”`: The OCID of the Oracle Cloud Infrastructure user that `component_keyring_oci` uses for connections. Prior to using `component_keyring_oci`, the user account must exist and be granted access to use the configured Oracle Cloud Infrastructure tenancy, compartment, and vault resources. To obtain the user OCID from the Console, use the instructions at Required Keys and OCIDs.

    This value is mandatory.

  + `“tenancy”`: The OCID of the Oracle Cloud Infrastructure tenancy that `component_keyring_oci` uses as the location of the MySQL compartment. Prior to using `component_keyring_oci`, you must create a tenancy if it does not exist. To obtain the tenancy OCID from the Console, use the instructions at Required Keys and OCIDs.

    This value is mandatory.

  + `“compartment”`: The OCID of the tenancy compartment that `component_keyring_oci` uses as the location of the MySQL keys. Prior to using `component_keyring_oci`, you must create a MySQL compartment or subcompartment if it does not exist. This compartment should contain no vault keys or vault secrets. It should not be used by systems other than MySQL Keyring. For information about managing compartments and obtaining the OCID, see Managing Compartments.

    This value is mandatory.

  + `“virtual_vault”`: The OCID of the Oracle Cloud Infrastructure Vault that `component_keyring_oci` uses for encryption operations. Prior to using `component_keyring_oci`, you must create a new vault in the MySQL compartment if it does not exist. (Alternatively, you can reuse an existing vault that is in a parent compartment of the MySQL compartment.) Compartment users can see and use only the keys in their respective compartments. For information about creating a vault and obtaining the vault OCID, see Managing Vaults.

    This value is mandatory.

  + `“encryption_endpoint”`: The endpoint of the Oracle Cloud Infrastructure encryption server that `component_keyring_oci` uses for generating encrypted or encoded information (ciphertext) for new keys. The encryption endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at Managing Vaults.

    This value is mandatory.

  + `"management_endpoint"`: The endpoint of the Oracle Cloud Infrastructure key management server that `component_keyring_oci` uses for listing existing keys. The key management endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at Managing Vaults.

    This value is mandatory.

  + `“vaults_endpoint”`: The endpoint of the Oracle Cloud Infrastructure vaults server that `component_keyring_oci` uses for obtaining the value of secrets. The vaults endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at Managing Vaults.

    This value is mandatory.

  + `“secrets_endpoint”`: The endpoint of the Oracle Cloud Infrastructure secrets server that `component_keyring_oci` uses for listing, creating, and retiring secrets. The secrets endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at Managing Vaults.

    This value is mandatory.

  + `“master_key”`: The OCID of the Oracle Cloud Infrastructure master encryption key that `component_keyring_oci` uses for encryption of secrets. Prior to using `component_keyring_oci`, you must create a cryptographic key for the Oracle Cloud Infrastructure compartment if it does not exist. Provide a MySQL-specific name for the generated key and do not use it for other purposes. For information about key creation, see Managing Keys.

    This value is mandatory.

  + `“key_file”`: The path name of the file containing the RSA private key that `component_keyring_oci` uses for Oracle Cloud Infrastructure authentication. You must also upload the corresponding RSA public key using the Console. The Console displays the key fingerprint value, which you can use to set the `"key_fingerprint"` value. For information about generating and uploading API keys, see Required Keys and OCIDs.

    This value is mandatory.

  + `“key_fingerprint”`: The fingerprint of the RSA private key that `component_keyring_oci` uses for Oracle Cloud Infrastructure authentication. To obtain the key fingerprint while creating the API keys, execute this command:

    ```
    openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
    ```

    Alternatively, obtain the fingerprint from the Console, which automatically displays the fingerprint when you upload the RSA public key. For information about obtaining key fingerprints, see Required Keys and OCIDs.

    This value is mandatory.

  + `“ca_certificate”`: The path name of the CA certificate bundle file that `component_keyring_oci` component uses for Oracle Cloud Infrastructure certificate verification. The file contains one or more certificates for peer verification. If no file is specified, the default CA bundle installed on the system is used. If the value is set to `disabled` (case-sensitive), `component_keyring_oci` performs no certificate verification.

    On Windows systems, this should be set to `disabled`, or to the path to a CA certificate bundle file.

Given the preceding configuration file properties, to configure `component_keyring_oci`, create a global configuration file named `component_keyring_oci.cnf` in the directory where the `component_keyring_oci` library file is installed, and optionally create a local configuration file, also named `component_keyring_oci.cnf`, in the data directory.

##### Verify the Component Installation

After performing any component-specific configuration, start the server. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+--------------------------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                                       |
+---------------------+--------------------------------------------------------------------+
| Component_name      | component_keyring_oci                                              |
| Author              | Oracle Corporation                                                 |
| License             | PROPRIETARY                                                        |
| Implementation_name | component_keyring_oci                                              |
| Version             | 1.0                                                                |
| Component_status    | Active                                                             |
| user                | ocid1.user.oc1..aaaaaaaasqly<...>                                  |
| tenancy             | ocid1.tenancy.oc1..aaaaaaaai<...>                                  |
| compartment         | ocid1.compartment.oc1..aaaaaaaah2swh<...>                          |
| virtual_vault       | ocid1.vault.oc1.iad.bbo5xyzkaaeuk.abuwcljtmvxp4r<...>              |
| master_key          | ocid1.key.oc1.iad.bbo5xyzkaaeuk.abuwcljrbsrewgap<...>              |
| encryption_endpoint | bbo5xyzkaaeuk-crypto.kms.us-<...>                                  |
| management_endpoint | bbo5xyzkaaeuk-management.kms.us-<...>                              |
| vaults_endpoint     | vaults.us-<...>                                                    |
| secrets_endpoint    | secrets.vaults.us-<...>                                            |
| key_file            | ~/.oci/oci_api_key.pem                                             |
| key_fingerprint     | ca:7c:e1:fa:86:b6:40:af:39:d6<...>                                 |
| ca_certificate      | disabled                                                           |
+---------------------+--------------------------------------------------------------------+
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the component cannot be loaded, server startup fails. Check the server error log for diagnostic messages. If the component loads but fails to initialize due to configuration problems, the server starts but the `Component_status` value is `Disabled`. Check the server error log, correct the configuration issues, and use the `ALTER INSTANCE RELOAD KEYRING` statement to reload the configuration.

It is possible to query MySQL server for the list of existing keys. To see which keys exist, examine the Performance Schema `keyring_keys` table.

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

##### Vault Keyring Component Usage

`component_keyring_oci` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.4.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_oci`, see Section 8.4.4.13, “Supported Keyring Key Types and Lengths”.
