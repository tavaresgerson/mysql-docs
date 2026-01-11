#### 8.4.1.9 OpenID Connect Pluggable Authentication

Note

OpenID Connect pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using OpenID Connect, provided that appropriate OpenID Connect credentials and tokens are properly configured based on the OAuth 2.0 framework.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing OpenID Pluggable Authentication.

**Table 8.24 Plugin and Library Names for OpenID Connect Authentication**

<table summary="Names for the plugins and library file used for OpenID Connect authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_openid_connect</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_openid_connect_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_openid_connect.so</code>, <code>authentication_openid_connect_client.so</code></td> </tr></tbody></table>

The server-side OpenID Connect authentication plugin is included in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to OpenID Connect pluggable authentication:

* Prerequisites for OpenID Connect Pluggable Authentication
* OpenID Connect Process and Workflow
* Installing OpenID Pluggable Authentication
* Connecting with a Client

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Prerequisites for OpenID Connect Pluggable Authentication

To use OpenID Connect pluggable authentication for MySQL, these prerequisites must be satisfied:

* The *connecting user* must have an account in the Identity provider domain, and the means to obtain the Identity Token.

* The *administrator* must have a list of token issuers to support along with their public signing keys. The administrator must also have the user' identifier from the Identity provider domain.

##### OpenID Connect Process and Workflow

OpenID Connect authentication follows these steps, where the server-side and client-side parts are performed using the `authentication_openid_connect` and `authentication_openid_connect_client` authentication plugins, respectively:

1. The client reads the Identity token file. For example, the **mysql** command-line client uses the `authentication-openid-connect-client-id-token-file` option with a full filepath to the token file. The client does not accept a token with a size exceeding 10 KB. Each connector has a method to pass in this information.

2. The client checks if the connection is secure between the client and the server. Only TLS, socket, and shared memory connections are considered secure.

3. The client sends the token to the server after checking if it is a valid JSON Web Token (JWT).

4. The server checks if the connection is secure between the client and the server, and receives the token.

5. The server decodes and validates the token:

   1. It checks if the token is a valid JWT.
   2. The headers are extracted using the encryption algorithm, which uses the RS256 asymmetric algorithm.

   3. The payload is decoded, and checks are performed to determine if the appropriate criteria is met for a successful login.

6. Criteria for a successful login:

   * The Identity token's `sub` claim value must be the same as the user's value in the authentication string.

   * The `identity_provider` value in the authentication string must be one of the `identity_provider` values set in the configuration.

   * The Identity token's `iss` claim value must equal the `identity_provider` name's value set in the configuration.

   * The Identity token expiration time must be greater than the current time.

   * The Identity token's signature must be verified by the public key of the Identity token's issuer specified in the `authentication_openid_connect_configuration` option as set by the administrator.

7. Authentication is successful if all the required criteria are met, otherwise authentication fails and logs the appropriate information to the error log.

##### Installing OpenID Pluggable Authentication

This section describes how to install the server-side OpenID Connect authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

Install the server-side `authentication_openid_connect` plugin on the MySQL Server. For example, by using `INSTALL PLUGIN`:

```
INSTALL PLUGIN authentication_openid_connect SONAME 'authentication_openid_connect.so';
```

Next, configure the `authentication_openid_connect_configuration` MySQL server option. The administrator specifies the list of issuers and their corresponding Public Signing Keys used to validate the Identity token's signature. This is defined as a JSON string (with the `JSON://` prefix) or point to a JSON file (with the `file://` prefix). Only the Identity tokens issued by the list of issuers specified by the administrator are accepted for authentication. For example:

```
SET GLOBAL authentication_openid_connect_configuration = "file://full/path/to/file.json";
```

File `file.json` in this example looks similar to:

```
{
  "issuer1": "{\"name\":\"issuer1_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}",
  "issuer2": "{\"name\":\"issuer2_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}"
}
```

Alternatively, set `authentication_openid_connect_configuration` inline as a JSON string instead of a file:

```
SET GLOBAL authentication_openid_connect_configuration = "JSON://{\"issuer1\" : \"{\\\"name\\\":\\\"issuer1_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\", \"issuer2\": \"{\\\"name\\\":\\\"issuer2_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\"}";
```

One of the issuer names should match the authentication string's `identity_provider` value, and the corresponding `name` key value must match with Identity token's `iss` value.

A MySQL user is mapped to a user managed in an Identity provider domain to authenticate via the `authentication_openid_connect_client` client-side plugin, as in the example shown here:

```
CREATE USER
  'username'@'%'
IDENTIFIED WITH
  'authentication_openid_connect'
AS
  '{"identity_provider" : "idp_name_here", "user" : "user_id_here"}';
```

Replace *`idp_name_here`* with the Identity provider name chosen by the administrator to match one of the allowed identity provider keys specified in the configuration. Replace *`user_id_here`* with the user's identifier in the Identity Provider' domain, which must match with the `sub` field in the Identity token.

##### Connecting with a Client

A client with the `authentication_openid_connect_client` plugin enabled passes the required Identity token to authenticate with a mapped MySQL user, using the complete path to the Identity token file used when connecting to the MySQL server.

For example, the **mysql** command-line client passes in the `--authentication-openid-connect-client-id-token-file` option. For example:

```
mysql -h hostname --port port --authentication-openid-connect-client-id-token-file=/path/to/token/file -u username
```
