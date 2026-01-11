#### 8.4.1.11 WebAuthn Pluggable Authentication

Note

WebAuthn authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using WebAuthn authentication.

WebAuthn stands for Web Authentication, which is a web standard published by the World Wide Web Consortium (W3C) and web application APIs that add FIDO-based authentication to supported browsers and platforms.

WebAuthn pluggable authentication replaces FIDO pluggable authentication, which is deprecated. WebAuthn pluggable authentication supports both FIDO and FIDO2 devices.

WebAuthn pluggable authentication provides these capabilities:

* WebAuthn enables authentication to MySQL Server using devices such as smart cards, security keys, and biometric readers.

* Because authentication can occur other than by providing a password, WebAuthn enables passwordless authentication.

* On the other hand, device authentication is often used in conjunction with password authentication, so WebAuthn authentication can be used to good effect for MySQL accounts that use multifactor authentication; see Section 8.2.18, “Multifactor Authentication”.

The following table shows the plugin and library file names. The file name suffix might differ on your system. Common suffixes are `.so` for Unix and Unix-like systems, and `.dll` for Windows. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing WebAuthn Pluggable Authentication.

**Table 8.26 Plugin and Library Names for WebAuthn Authentication**

<table summary="Names for the plugins and library file used for WebAuthn authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_webauthn</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_webauthn_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_webauthn.so</code>, <code>authentication_webauthn_client.so</code></td> </tr></tbody></table>

Note

A `libfido2` library must be available on systems where either the server-side or client-side WebAuthn authentication plugin is used.

The server-side WebAuthn authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions, which enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to WebAuthn pluggable authentication:

* Installing WebAuthn Pluggable Authentication
* Using WebAuthn Authentication
* WebAuthn Passwordless Authentication
* Device Unregistration for WebAuthn
* How WebAuthn Authentication of MySQL Users Works

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing WebAuthn Pluggable Authentication

This section describes how to install the server-side WebAuthn authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base name is `authentication_webauthn`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

Before installing the server-side plugin, define a unique name for the relying party ID (used for device registration and authentication), which is the MySQL server. Start the server using the `--loose-authentication-webauthn-rp-id=value` option. The example here specifies the value `mysql.com` as the relying party ID. Replace this value with one that satisfies your requirements.

```
$> mysqld [options] --loose-authentication-webauthn-rp-id=mysql.com
```

Note

For replication, use the same `authentication_webauthn_rp_id` value on all nodes if a user is expected to connect to multiple servers.

To define the relying party and load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it, adjusting the .so suffix for your platform as necessary. With this plugin-loading method, the option must be given each time the server starts.

```
$> mysqld [options]
    --loose-authentication-webauthn-rp-id=mysql.com
    --plugin-load-add=authentication_webauthn.so
```

To define the relying party and load the plugin, put lines such as this in your `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
plugin-load-add=authentication_webauthn.so
authentication_webauthn_rp_id=mysql.com
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN authentication_webauthn
  SONAME 'authentication_webauthn.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_webauthn';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_webauthn | ACTIVE        |
+-------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the WebAuthn authentication plugin, see Using WebAuthn Authentication.

##### Using WebAuthn Authentication

WebAuthn authentication typically is used in the context of multifactor authentication (see Section 8.2.18, “Multifactor Authentication”). This section shows how to incorporate WebAuthn device-based authentication into a multifactor account, using the `authentication_webauthn` plugin.

It is assumed in the following discussion that the server is running with the server-side WebAuthn authentication plugin enabled, as described in Installing WebAuthn Pluggable Authentication, and that the client-side WebAuthn plugin is available in the plugin directory on the client host.

Note

On Windows, WebAuthn authentication only functions if the client process runs as a user with administrator privileges. It might also be necessary to add the location of your FIDO/FIDO2 device to the client host' `PATH` environment variable.

It is also assumed that WebAuthn authentication is used in conjunction with non-WebAuthn authentication (which implies a 2FA or 3FA account). WebAuthn can also be used by itself to create 1FA accounts that authenticate in a passwordless manner. In this case, the setup process differs somewhat. For instructions, see WebAuthn Passwordless Authentication.

An account that is configured to use the `authentication_webauthn` plugin is associated with a Fast Identity Online (FIDO/FIDO2) device. Because of this, a one-time device registration step is required before WebAuthn authentication can occur. The device registration process has these characteristics:

* Any FIDO/FIDO2 device associated with an account must be registered before the account can be used.

* Registration requires that a FIDO/FIDO2 device be available on the client host, or registration fails.

* The user is expected to perform the appropriate FIDO/FIDO2 device action when prompted during registration (for example, touching the device or performing a biometric scan).

* To perform device registration, the client user must invoke the **mysql** client program and specify the `--register-factor` option to specify the factor or factors for which a device is being registered. For example, if the account is set to use WebAuthn as the second authentication factor, the user invokes **mysql** with the `--register-factor=2` option.

* If the user account is configured with the `authentication_webauthn` plugin set as the second or third factor, authentication for all preceding factors must succeed before the registration step can proceed.

* The server knows from the information in the user account whether the FIDO/FIDO2 device requires registration or has already been registered. When the client program connects, the server places the client session in sandbox mode if the device must be registered, so that registration must occur before anything else can be done. Sandbox mode used for FIDO/FIDO2 device registration is similar to that used for handling of expired passwords. See Section 8.2.16, “Server Handling of Expired Passwords”.

* In sandbox mode, no statements other than `ALTER USER` are permitted. Registration is performed using forms of this statement. When invoked with the `--register-factor` option, the **mysql** client generates the `ALTER USER` statements required to perform registration. After registration has been accomplished, the server switches the session out of sandbox mode, and the client can proceed normally. For information about the generated `ALTER USER` statements, refer to the `--register-factor` description.

* When device registration has been performed for the account, the server updates the `mysql.user` system table row for that account to update the device registration status and to store the public key and credential ID. (The server does not retain the credential ID following FIDO2 device registration.)

* The registration step can be performed only by the user named by the account. If one user attempts to perform registration for another user, an error occurs.

* The user should use the same FIDO/FIDO2 device during registration and authentication. If, after registering a FIDO/FIDO2 device on the client host, the device is reset or a different device is inserted, authentication fails. In this case, the device associated with the account must be unregistered and registration must be done again.

* MySQL 9.5 supports Windows Hello authentication. The server plugin is available with MySQL Enterprise Edition only; the client plugin is available with MySQL Enterprise Edition and MySQL Community Edition. Windows 11 and later is supported.

  The `authentication_webauthn` client plugin uses the `libfido` library, which supports the concept of a “device” which can be implemented as hardware (such as a Yubikey) or as software (for example, the Windows Hello passkey store). `libfido` uses such a device to communicate with the backend passkey store and to interact with the passkeys which the store contains. Passkeys do not physically leave the backend store.

  To specify a device, use the **mysql** client `--plugin-authentication-webauthn-device=#` option. The default is the first device (`0`). The client raises an error if the device specified does not exist. This occurs, for example, if there are only two devices and the user requests a third one. The client does not perform any checks for more active devices than are needed.

  The client plugin prints the product and manufacturer names for the device prior to interacting with it.

  Only passkeys stored in the Windows Hello passkey store are currently supported by the Windows Hello device; other nonlocal passkey stores (located on other devices, possibly accessible through Windows Hello by scanning a QR code) are not supported. Passkeys stored in HSM modules or Yubikeys need to be accessed directly, rather than using the Windows Hello device.

  Stored passkey deletion from the Windows passkey store must peformed using system tools; the **mysql** client does not provide a way to delete a passkey.

Suppose that you want an account to authenticate first using the `caching_sha2_password` plugin, then using the `authentication_webauthn` plugin. Create a multifactor account using a statement like this:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_webauthn;
```

To connect, supply the factor 1 password to satisfy authentication for that factor, and to initiate registration of the FIDO/FIDO2 device, set the `--register-factor` to factor 2.

```
$> mysql --user=u2 --password1 --register-factor=2
Enter password: (enter factor 1 password)
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
```

After the factor 1 password is accepted, the client session enters sandbox mode so that device registration can be performed for factor 2. During registration, you are prompted to perform the appropriate FIDO/FIDO2 device action, such as touching the device or performing a biometric scan.

Optionally, you can invoke the **mysql** client program and specify the `--plugin-authentication-webauthn-client-preserve-privacy` option. If the FIDO2 device contains multiple discoverable credentials (resident keys) for a given replying party (RP) ID, this option permits choosing a key to be used for assertion. By default, the option is set to `FALSE`, indicating that assertions are to be created using all resident keys for a given RP ID. When specified with this option, **mysql** prompts you for a device PIN and lists all of the available credentials for given RP ID. Select one key and then perform the remaining online instructions to complete the authentication. The example here assumes that `mysql.com` is a valid RP ID:

```
$> mysql --user=u2 --password1 --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password: (enter factor 1 password)
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u2`@`127.0.0.1`
[2]`u2`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u2@127.0.0.1   |
+----------------+
```

The `--plugin-authentication-webauthn-client-preserve-privacy` option has no effect on FIDO devices that do not support the resident-key feature.

When the registration process is complete, the connection to the server is permitted.

Note

The connection to the server is permitted following registration regardless of additional authentication factors in the account's authentication chain. For example, if the account in the preceding example was defined with a third authentication factor (using non-WebAuthn authentication), the connection would be permitted after a successful registration without authenticating the third factor. However, subsequent connections would require authenticating all three factors.

##### WebAuthn Passwordless Authentication

This section describes how WebAuthn can be used by itself to create 1FA accounts that authenticate in a passwordless manner. In this context, “passwordless” means that authentication occurs but uses a method other than a password, such as a security key or biometric scan. It does not refer to an account that uses a password-based authentication plugin for which the password is empty. That kind of “passwordless” is completely insecure and is not recommended.

The following prerequisites apply when using the `authentication_webauthn` plugin to achieve passwordless authentication:

* The user that creates a passwordless-authentication account requires the `PASSWORDLESS_USER_ADMIN` privilege in addition to the `CREATE USER` privilege.

* The first element of the `authentication_policy` value must be an asterisk (`*`) and not a plugin name. For example, the default `authentication_policy` value supports enabling passwordless authentication because the first element is an asterisk:

  ```
  authentication_policy='*,,'
  ```

  For information about configuring the `authentication_policy` value, see Configuring the Multifactor Authentication Policy.

To use `authentication_webauthn` as a passwordless authentication method, the account must be created with `authentication_webauthn` as the first factor authentication method. The `INITIAL AUTHENTICATION IDENTIFIED BY` clause must also be specified for the first factor (it is not supported with 2nd or 3rd factors). This clause specifies whether a randomly generated or user-specified password will be used for FIDO/FIDO2 device registration. After device registration, the server deletes the password and modifies the account to make `authentication_webauthn` the sole authentication method (the 1FA method).

The required `CREATE USER` syntax is as follows:

```
CREATE USER user
  IDENTIFIED WITH authentication_webauthn
  INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
```

The following example uses the `RANDOM PASSWORD` syntax:

```
mysql> CREATE USER 'u1'@'localhost'
         IDENTIFIED WITH authentication_webauthn
         INITIAL AUTHENTICATION IDENTIFIED BY RANDOM PASSWORD;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| u1   | localhost | 9XHK]M{l2rnD;VXyHzeF |           1 |
+------+-----------+----------------------+-------------+
```

To perform registration, the user must authenticate to the server with the password associated with the `INITIAL AUTHENTICATION IDENTIFIED BY` clause, either the randomly generated password, or the `'auth_string'` value. If the account was created as just shown, the user executes this command and pastes in the preceding randomly generated password (`9XHK]M{l2rnD;VXyHzeF`) at the prompt:

```
$> mysql --user=u1 --password --register-factor=2
Enter password:
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
```

Alternatively, use the `--plugin-authentication-webauthn-client-preserve-privacy` option to select a discoverable credential for authentication.

```
$> mysql --user=u1 --password --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password:
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u1`@`127.0.0.1`
[2]`u1`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u1@127.0.0.1   |
+----------------+
```

The option `--register-factor=2` is used because the `INITIAL AUTHENTICATION IDENTIFIED BY` clause is currently acting as the first factor authentication method. The user must therefore provide the temporary password by using the second factor. On a successful registration, the server removes the temporary password and revises the account entry in the `mysql.user` system table to list `authentication_webauthn` as the sole (1FA) authentication method.

When creating a passwordless-authentication account, it is important to include the `INITIAL AUTHENTICATION IDENTIFIED BY` clause in the `CREATE USER` statement. The server accepts a statement without the clause, but the resulting account is unusable because there is no way to connect to the server to register the device. Suppose that you execute a statement like this:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH authentication_webauthn;
```

Subsequent attempts to use the account to connect fail like this:

```
$> mysql --user=u2 --skip-password
mysql: [Warning] Using a password on the command line can be insecure.
No FIDO device on client host.
ERROR 1 (HY000): Unknown MySQL error
```

Note

Passwordless authentication is achieved using the Universal 2nd Factor (U2F) protocol, which does not support additional security measures such as setting a PIN on the device to be registered. It is therefore the responsibility of the device holder to ensure the device is handled in a secure manner.

##### Device Unregistration for WebAuthn

It is possible to unregister FIDO/FIDO2 devices associated with a MySQL account. This might be desirable or necessary under multiple circumstances:

* A FIDO/FIDO2 device is to be replaced with a different device. The previous device must be unregistered and the new device registered.

  In this case, the account owner or any user who has the `CREATE USER` privilege can unregister the device. The account owner can register the new device.

* A FIDO/FIDO2 device is reset or lost. Authentication attempts will fail until the current device is unregistered and a new registration is performed.

  In this case, the account owner, being unable to authenticate, cannot unregister the current device and must contact the DBA (or any user who has the `CREATE USER` privilege) to do so. Then the account owner can reregister the reset device or register a new device.

Unregistering a FIDO/FIDO2 device can be done by the account owner or by any user who has the `CREATE USER` privilege. Use this syntax:

```
ALTER USER user {2 | 3} FACTOR UNREGISTER;
```

To re-register a device or perform a new registration, refer to the instructions in Using WebAuthn Authentication.

##### How WebAuthn Authentication of MySQL Users Works

This section provides an overview of how MySQL and WebAuthn work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use the WebAuthn authentication plugins, see Using WebAuthn Authentication.

An account that uses WebAuthn authentication must perform an initial device registration step before it can connect to the server. After the device has been registered, authentication can proceed. WebAuthn device registration process is as follows:

1. The server sends a random challenge, user ID, and relying party ID (which uniquely identifies a server) to the client in JSON format. The relying party ID is defined by the `authentication_webauthn_rp_id` system variable. The default value is `mysql.com`.

2. The client receives that information and sends it to the client-side WebAuthn authentication plugin, which in turn provides it to the FIDO/FIDO2 device. Client also sends 1-byte capability, with RESIDENT\_KEYS bit set to `ON` (if it is FIDO2 device) or `OFF`.

3. After the user has performed the appropriate device action (for example, touching the device or performing a biometric scan) the FIDO/FIDO2 device generates a public/private key pair, a key handle, an X.509 certificate, and a signature, which is returned to the server.

4. The server-side WebAuthn authentication plugin verifies the signature. With successful verification, the server stores the credential ID (for FIDO devices only) and public key in the `mysql.user` system table.

After registration has been performed successfully, WebAuthn authentication follows this process:

1. The server sends a random challenge, user ID, relying party ID and credentials to the client. The challenge is converted to URL-safe Base64 format.

2. The client sends the same information to the device. The client queries the device to check if it supports Client-to-Authenticator Protocols (CTAP2) protocol. CTAP2 support indicates that the device is FIDO2-protocol aware.

3. The FIDO/FIDO2 device prompts the user to perform the appropriate device action, based on the selection made during registration.

   If the device is FIDO2-protocol aware, the device signs with all private keys available in the device for a given RP ID. Optionally, it may prompt user to pick one from the list as well. If the device is not FIDO2 capable, it fetches the right private key.

4. This action unlocks the private key and the challenge is signed.

5. This signed challenge is returned to the server.
6. The server-side WebAuthn authentication plugin verifies the signature with the public key and responds to indicate authentication success or failure.
