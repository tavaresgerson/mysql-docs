### 6.4.1 Authentication Plugins

[6.4.1.1 Native Pluggable Authentication](native-pluggable-authentication.html)

[6.4.1.2 Old Native Pluggable Authentication](old-native-pluggable-authentication.html)

[6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin](account-upgrades.html)

[6.4.1.4 Caching SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html)

[6.4.1.5 SHA-256 Pluggable Authentication](sha256-pluggable-authentication.html)

[6.4.1.6 Client-Side Cleartext Pluggable Authentication](cleartext-pluggable-authentication.html)

[6.4.1.7 PAM Pluggable Authentication](pam-pluggable-authentication.html)

[6.4.1.8 Windows Pluggable Authentication](windows-pluggable-authentication.html)

[6.4.1.9 LDAP Pluggable Authentication](ldap-pluggable-authentication.html)

[6.4.1.10 No-Login Pluggable Authentication](no-login-pluggable-authentication.html)

[6.4.1.11 Socket Peer-Credential Pluggable Authentication](socket-pluggable-authentication.html)

[6.4.1.12 Test Pluggable Authentication](test-pluggable-authentication.html)

[6.4.1.13 Pluggable Authentication System Variables](pluggable-authentication-system-variables.html)

The following sections describe pluggable authentication methods available in MySQL and the plugins that implement these methods. For general discussion of the authentication process, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

The default plugin is indicated by the value of the [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) system variable.
