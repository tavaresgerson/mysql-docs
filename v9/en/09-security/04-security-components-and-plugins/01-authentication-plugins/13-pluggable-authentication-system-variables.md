#### 8.4.1.13 Pluggable Authentication System Variables

These variables are unavailable unless the appropriate server-side plugin is installed:

* `authentication_ldap_sasl` for system variables with names of the form `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` for system variables with names of the form `authentication_ldap_simple_xxx`

**Table 8.28 Authentication Plugin System Variable Summary**

<table frame="box" rules="all" summary="Reference for authentication plugin system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_base_dn">authentication_ldap_sasl_bind_base_dn</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn">authentication_ldap_sasl_bind_root_dn</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd">authentication_ldap_sasl_bind_root_pwd</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path">authentication_ldap_sasl_ca_path</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_connect_timeout">authentication_ldap_sasl_connect_timeout</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr">authentication_ldap_sasl_group_search_attr</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_filter">authentication_ldap_sasl_group_search_filter</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_init_pool_size">authentication_ldap_sasl_init_pool_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_log_status">authentication_ldap_sasl_log_status</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size">authentication_ldap_sasl_max_pool_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_referral">authentication_ldap_sasl_referral</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_response_timeout">authentication_ldap_sasl_response_timeout</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_server_host">authentication_ldap_sasl_server_host</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_server_port">authentication_ldap_sasl_server_port</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_tls">authentication_ldap_sasl_tls</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr">authentication_ldap_sasl_user_search_attr</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name">authentication_ldap_simple_auth_method_name</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_base_dn">authentication_ldap_simple_bind_base_dn</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_dn">authentication_ldap_simple_bind_root_dn</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_pwd">authentication_ldap_simple_bind_root_pwd</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path">authentication_ldap_simple_ca_path</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_connect_timeout">authentication_ldap_simple_connect_timeout</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr">authentication_ldap_simple_group_search_attr</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_filter">authentication_ldap_simple_group_search_filter</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_init_pool_size">authentication_ldap_simple_init_pool_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_log_status">authentication_ldap_simple_log_status</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size">authentication_ldap_simple_max_pool_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_referral">authentication_ldap_simple_referral</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_response_timeout">authentication_ldap_simple_response_timeout</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_host">authentication_ldap_simple_server_host</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_port">authentication_ldap_simple_server_port</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_tls">authentication_ldap_simple_tls</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr">authentication_ldap_simple_user_search_attr</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_authentication_openid_connect_configuration">authentication_openid_connect_configuration</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_authentication_policy">authentication_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_webauthn_rp_id">authentication_webauthn_rp_id</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_authentication_windows_log_level">authentication_windows_log_level</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr></tbody></table>

* `authentication_kerberos_service_key_tab`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>

  The name of the server-side key-table (“keytab”) file containing Kerberos service keys to authenticate MySQL service tickets received from clients. The file name should be given as an absolute path name. If this variable is not set, the default is `mysql.keytab` in the data directory.

  The file must exist and contain a valid key for the service principal name (SPN) or authentication of clients will fail. (The SPN and same key also must be created in the Kerberos server.) The file may contain multiple service principal names and their respective key combinations.

  The file must be generated by the Kerberos server administrator and be copied to a location accessible by the MySQL server. The file can be validated to make sure that it is correct and was copied properly using this command:

  ```
  klist -k file_name
  ```

  For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

* `authentication_kerberos_service_principal`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>

  The Kerberos service principal name (SPN) that the MySQL server sends to clients.

  The value is composed from the service name (`mysql`), a host name, and a realm name. The default value is `mysql/host_name@realm_name`. The realm in the service principal name enables retrieving the exact service key.

  To use a nondefault value, set the value using the same format. For example, to use a host name of `krbauth.example.com` and a realm of `MYSQL.LOCAL`, set `authentication_kerberos_service_principal` to `mysql/krbauth.example.com@MYSQL.LOCAL`.

  The service principal name and service key must already be present in the database managed by the KDC server.

  There can be service principal names that differ only by realm name.

* `authentication_ldap_sasl_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>

  For SASL LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method to ensure password security.

  These authentication method values are permitted:

  + `SCRAM-SHA-1`: Use a SASL challenge-response mechanism.

    The client-side `authentication_ldap_sasl_client` plugin communicates with the SASL server, using the password to create a challenge and obtain a SASL request buffer, then passes this buffer to the server-side `authentication_ldap_sasl` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

    `SCRAM-SHA-1` is deprecated as of MySQL 9.5.0, and subject to removal in a future MySQL release.

  + `SCRAM-SHA-256`: Use a SASL challenge-response mechanism.

    This method is similar to `SCRAM-SHA-1`, but is more secure. It requires an OpenLDAP server built using Cyrus SASL 2.1.27 or higher.

    `SCRAM-SHA-256` is the default value as of MySQL 9.5.0.

  + `GSSAPI`: Use Kerberos, a passwordless and ticket-based protocol.

    GSSAPI/Kerberos is supported as an authentication method for MySQL clients and servers only on Linux. It is useful in Linux environments where applications access LDAP using Microsoft Active Directory, which has Kerberos enabled by default.

    The client-side `authentication_ldap_sasl_client` plugin obtains a service ticket using the ticket-granting ticket (TGT) from Kerberos, but does not use LDAP services directly. The server-side `authentication_ldap_sasl` plugin routes Kerberos messages between the client-side plugin and the LDAP server. Using the credentials thus obtained, the server-side plugin then communicates with the LDAP server to interpret LDAP authentication messages and retrieve LDAP groups.

* `authentication_ldap_sasl_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_base_dn">authentication_ldap_sasl_bind_base_dn</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_sasl_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn">authentication_ldap_sasl_bind_root_dn</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_sasl_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_sasl` performs an initial LDAP binding using `authentication_ldap_sasl_bind_root_dn` and `authentication_ldap_sasl_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_sasl` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_sasl` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_sasl_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_pwd"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd">authentication_ldap_sasl_bind_root_pwd</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_sasl_bind_root_dn`. See the description of that variable.

* `authentication_ldap_sasl_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path">authentication_ldap_sasl_ca_path</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_sasl_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_sasl_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_sasl_connect_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-connect-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_connect_timeout">authentication_ldap_sasl_connect_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Specifies the time (in seconds) that MySQL server waits to connect to the LDAP server using TCP.

  When a MySQL account authenticates using LDAP, MySQL server attempts to establish a TCP connection with the LDAP server, which it uses to send an LDAP bind request over the connection. If the LDAP server does not respond to TCP handshake after a configured amount of time, MySQL abandons the TCP handshake attempt and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

  Note

  If you set this variable to a timeout value that is greater than the host system's default value, the shorter system timeout is used.

* `authentication_ldap_sasl_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_attr"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr">authentication_ldap_sasl_group_search_attr</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">cn</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_sasl_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  This variable should be the empty string if you want no group or proxy authentication.

  If the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_sasl_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>0

  For SASL LDAP authentication, the custom group search filter.

  The search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  In some cases for the user scenario, `memberOf` is a simple user attribute that holds no group information. For additional flexibility, an optional `{GA}` prefix can be used with the group search attribute. Any group attribute with a {GA} prefix is treated as a user attribute having group names. For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

* `authentication_ldap_sasl_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>1

  For SASL LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_sasl_init_pool_size` and `authentication_ldap_sasl_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_sasl_init_pool_size` connections, unless `authentication_ldap_sasl_max_pool_size=0` to disable pooling.

  + If the plugin receives an authentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_sasl_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_sasl_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_sasl_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>2

  For SASL LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 8.29 Log Levels for authentication\_ldap\_sasl\_log\_status**

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>3

  On the client side, messages can be logged to the standard output by setting the `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable. The permitted and default values are the same as for `authentication_ldap_sasl_log_status`.

  The `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable applies only to SASL LDAP authentication. It has no effect for simple LDAP authentication because the client plugin in that case is `mysql_clear_password`, which knows nothing about LDAP operations.

* `authentication_ldap_sasl_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>4

  For SASL LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_sasl_init_pool_size`. See the description of that variable.

* `authentication_ldap_sasl_referral`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>5

  For SASL LDAP authentication, whether to enable LDAP search referral. See LDAP Search Referral.

  This variable can be set to override the default OpenLDAP referral configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_sasl_response_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>6

  Specifies the time (in seconds) that MySQL server waits for the LDAP server to response to an LDAP bind request.

  When a MySQL account authenticates using LDAP, MySQL server sends an LDAP bind request to the LDAP server. If the LDAP server does not respond to the request after a configured amount of time, MySQL abandons the request and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

* `authentication_ldap_sasl_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>7

  The LDAP server host for SASL LDAP authentication; this can be a host name or IP address.

* `authentication_ldap_sasl_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>8

  For SASL LDAP authentication, the LDAP server TCP/IP port number.

  If the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_sasl_tls`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">datadir/mysql.keytab</code></td> </tr></tbody></table>9

  For SASL LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_sasl_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  LDAPS can be used by setting the `authentication_ldap_sasl_server_port` system variable.

* `authentication_ldap_sasl_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>0

  For SASL LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_sasl_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.

* `authentication_ldap_simple_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>1

  For simple LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method.

  Note

  For all simple LDAP authentication methods, it is recommended to also set TLS parameters to require that communication with the LDAP server take place over secure connections.

  These authentication method values are permitted:

  + `SIMPLE`: Use simple LDAP authentication. This method uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user distinguished name. See the description of `authentication_ldap_simple_bind_root_dn`.

  + `AD-FOREST`: A variation on `SIMPLE`, such that authentication searches all domains in the Active Directory forest, performing an LDAP bind to each Active Directory domain until the user is found in some domain.

* `authentication_ldap_simple_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>2

  For simple LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_simple_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>3

  For simple LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_simple_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_simple` performs an initial LDAP binding using `authentication_ldap_simple_bind_root_dn` and `authentication_ldap_simple_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_simple` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_simple` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_simple_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>4

  For simple LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_simple_bind_root_dn`. See the description of that variable.

* `authentication_ldap_simple_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>5

  For simple LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_simple_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_simple_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_simple_connect_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>6

  Specifies the time (in seconds) that MySQL server waits to connect to the LDAP server using TCP.

  When a MySQL account authenticates using LDAP, MySQL server attempts to establish a TCP connection with the LDAP server, which it uses to send an LDAP bind request over the connection. If the LDAP server does not respond to TCP handshake after a configured amount of time, MySQL abandons the TCP handshake attempt and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

  Note

  If you set this variable to a timeout value that is greater than the host system's default value, the shorter system timeout is used.

* `authentication_ldap_simple_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>7

  For simple LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_simple_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  If the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_simple_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>8

  For simple LDAP authentication, the custom group search filter.

  The search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  In some cases for the user scenario, `memberOf` is a simple user attribute that holds no group information. For additional flexibility, an optional `{GA}` prefix can be used with the group search attribute. Any group attribute with a {GA} prefix is treated as a user attribute having group names. For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

* `authentication_ldap_simple_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql/host_name@realm_name</code></td> </tr></tbody></table>9

  For simple LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_simple_init_pool_size` and `authentication_ldap_simple_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_simple_init_pool_size` connections, unless `authentication_ldap_simple_max_pool_size=0` to disable pooling.

  + If the plugin receives an authentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_simple_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_simple_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_simple_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>0

  For simple LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 8.30 Log Levels for authentication\_ldap\_simple\_log\_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>1

* `authentication_ldap_simple_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>2

  For simple LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_simple_init_pool_size`. See the description of that variable.

* `authentication_ldap_simple_referral`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>3

  For simple LDAP authentication, whether to enable LDAP search referral. See LDAP Search Referral.

* `authentication_ldap_simple_response_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>4

  Specifies the time (in seconds) that MySQL server waits for the LDAP server to response to an LDAP bind request.

  When a MySQL account authenticates using LDAP, MySQL server sends an LDAP bind request to the LDAP server. If the LDAP server does not respond to the request after a configured amount of time, MySQL abandons the request and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

* `authentication_ldap_simple_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>5

  For simple LDAP authentication, the LDAP server host. The permitted values for this variable depend on the authentication method:

  + For `authentication_ldap_simple_auth_method_name=SIMPLE`: The LDAP server host can be a host name or IP address.

  + For `authentication_ldap_simple_auth_method_name=AD-FOREST`. The LDAP server host can be an Active Directory domain name. For example, for an LDAP server URL of `ldap://example.mem.local:389`, the domain name can be `mem.local`.

    An Active Directory forest setup can have multiple domains (LDAP server IPs), which can be discovered using DNS. On Unix and Unix-like systems, some additional setup may be required to configure your DNS server with SRV records that specify the LDAP servers for the Active Directory domain. For information about DNS SRV, see [RFC 2782](https://tools.ietf.org/html/rfc2782).

    Suppose that your configuration has these properties:

    - The name server that provides information about Active Directory domains has IP address `10.172.166.100`.

    - The LDAP servers have names `ldap1.mem.local` through `ldap3.mem.local` and IP addresses `10.172.166.101` through `10.172.166.103`.

    You want the LDAP servers to be discoverable using SRV searches. For example, at the command line, a command like this should list the LDAP servers:

    ```
    host -t SRV _ldap._tcp.mem.local
    ```

    Perform the DNS configuration as follows:

    1. Add a line to `/etc/resolv.conf` to specify the name server that provides information about Active Directory domains:

       ```
       nameserver 10.172.166.100
       ```

    2. Configure the appropriate zone file for the name server with SRV records for the LDAP servers:

       ```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

    3. It may also be necessary to specify the IP address for the LDAP servers in `/etc/hosts` if the server host cannot be resolved. For example, add lines like this to the file:

       ```
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

    With the DNS configured as just described, the server-side LDAP plugin can discover the LDAP servers and tries to authenticate in all domains until authentication succeeds or there are no more servers.

    Windows needs no such settings as just described. Given the LDAP server host in the `authentication_ldap_simple_server_host` value, the Windows LDAP library searches all domains and attempts to authenticate.

* `authentication_ldap_simple_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>6

  For simple LDAP authentication, the LDAP server TCP/IP port number.

  If the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_simple_tls`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>7

  For simple LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_simple_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  LDAPS can be used by setting the `authentication_ldap_simple_server_port` system variable.

* `authentication_ldap_simple_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>8

  For simple LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_simple_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.

* `authentication_webauthn_rp_id`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SCRAM-SHA-1</code></p><p class="valid-value"><code class="literal">SCRAM-SHA-256</code></p><p class="valid-value"><code class="literal">GSSAPI</code></p></td> </tr></tbody></table>9

  This variable specifies the relying party ID used for server-side plugin installation, device registration, and WebAuthn authentication. If WebAuthn authentication is attempted and this value is not the one expected by the device, the device assumes that it is not talking to the correct server and an error occurs. The maximum value length is 255 characters.
