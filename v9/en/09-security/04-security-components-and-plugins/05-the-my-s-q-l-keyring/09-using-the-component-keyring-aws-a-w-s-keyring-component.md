#### 8.4.5.9 Using the component\_keyring\_aws AWS Keyring Component

Note

`component_keyring_aws` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The AWS Keyring component is intended to replace the AWS Keyring plugin, which is now deprecated. See Migration from AWS keyring plugin.

The `component_keyring_aws` keyring component stores keys encrypted by AWS KMS, using the Customer Managed Key (CMK) service, in a file local to the server host.

`component_keyring_aws` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_aws`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To use `component_keyring_aws` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_aws`, as described in Section 8.4.5.2, “Keyring Component Installation”.

   For `component_keyring_aws`, the contents of the manifest file are shown here:

   ```
   {
     "components": "file://component_aws_keyring"
   }
   ```

2. Write a configuration file for `component_keyring_aws`, as described in AWS Keyring Component Configuration.

The AWS keyring component supports two authentication modes, simple and native, as determined by the value of the `aws_authentication.mode` parameter specified in `component_keyring_aws.cnf`. This parameter is required. Configuration of the component for supporting each of these modes can be found in Simple authentication mode, and Native authentication mode, respectively.

* AWS Keyring Component Configuration
* Simple authentication mode
* Native authentication mode
* Migration from AWS keyring plugin

##### AWS Keyring Component Configuration

When it initializes, `component_keyring_aws` reads a component configuration file `component_keyring_aws.cnf`, as described in Section 8.4.5.2, “Keyring Component Installation”.

In some cases, additional information can be read from an AWS configuration file, a credentials file, or both. These files are described later in this section.

If `component_keyring_aws` cannot find the configuration file, an error results, and the component cannot initialize.

The `component_keyring_aws.cnf` component configuration file must be in valid JSON format. Configuration items supported in this file are shown in the following table:

**Table 8.31 component\_keyring\_aws.cnf Configuration Items**

<table border="1" class="table" summary="This table provides information about configuration items supported in the component_keyring_aws.cnf file."><colgroup><col/><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">Parameter</th><th scope="col">Parent</th><th scope="col">Description</th><th scope="col">Valid</th><th scope="col">Required</th><th scope="col">Default</th><th scope="col">Permitted values</th></tr></thead><tbody><tr><td scope="row"><code class="literal">cmk_id</code></td><td>—</td><td>Customer Managed Key (CMK) identifier obtained from AWS KMS server</td><td>—</td><td>Yes</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">data_file</code></td><td>—</td><td>Location of component JSON storage file</td><td>—</td><td>Yes</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">cache_keys</code></td><td>—</td><td><code class="literal">true</code>: Keys cached in memory in plaintext; <code class="literal">false</code>: Keys decrypted when accessed</td><td>—</td><td>No</td><td><code class="literal">false</code></td><td><code class="literal">true</code>, <code class="literal">false</code></td></tr><tr><td scope="row"><code class="literal">mode</code></td><td><code class="literal">aws_authentication</code></td><td>AWS authentication mode</td><td>—</td><td>Yes</td><td>—</td><td><code class="literal">native</code>, <code class="literal">simple</code></td></tr><tr><td scope="row"><code class="literal">profile</code></td><td><code class="literal">aws_authentication</code></td><td>Name of AWS profile used by AWS native authentication</td><td>When <code class="literal">aws_authentication.mode</code> is <code class="literal">native</code></td><td>No</td><td><code class="literal">default</code></td><td>—</td></tr><tr><td scope="row"><code class="literal">region</code></td><td><code class="literal">aws_authentication</code></td><td>AWS region</td><td>When <code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></td><td>Yes, when <code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></td><td><code class="literal">us-east-1</code></td><td>—</td></tr><tr><td scope="row"><code class="literal">access_key_id</code></td><td><code class="literal">aws_authentication</code></td><td>AWS acccess key identifier</td><td>When <code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></td><td>Yes, when <code class="literal"><code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></code></td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">access_key_secret</code></td><td><code class="literal">aws_authentication</code></td><td>AWS acccess key secret</td><td>When <code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></td><td>Yes, when <code class="literal"><code class="literal">aws_authentication.mode</code> is <code class="literal">simple</code></code></td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">connect_timeout_ms</code></td><td><code class="literal">aws_connection</code></td><td>Socket connection timeout</td><td> </td><td>No</td><td><code class="literal">1000</code></td><td>—</td></tr><tr><td scope="row"><code class="literal">host</code></td><td><code class="literal">aws_connection.proxy</code></td><td>Proxy host</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">port</code></td><td><code class="literal">aws_connection.proxy</code></td><td>Proxy port</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">user</code></td><td><code class="literal">aws_connection.proxy</code></td><td>Proxy user name</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">password</code></td><td><code class="literal">aws_connection.proxy</code></td><td>Proxy user password</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code class="literal">read_only</code></td><td>—</td><td>When <code class="literal">true</code>, no operations which modify the keyring are allowed</td><td>—</td><td>No</td><td><code class="literal">false</code></td><td><code class="literal">true</code>, <code class="literal">false</code></td></tr></tbody></table>

`aws_authentication.region` defaults to `us-east-1`, and must be set explicitly for any other region.

Component configuration file parameters that are not valid are ignored. For example, `aws_authentication.access_key_id` and `aws_authentication.access_key_secret` have no effect when the `aws_authentication.mode` is `native`.

The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails; the administrator must correct any issues indicated by diagnostic messages in the server error log.

Important

Any configuration file that stores a key secret should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Given the preceding configuration file items, to configure `component_keyring_aws`, create a component configuration file named `component_keyring_aws.cnf` in the directory indicated previously.

A read/write keyring data file using JSON format, whose location is determined by the `data_file` configuration item, is also required; the following instructions assume that such a file exists at `/usr/local/mysql/keyring.json`. An example of its content is shown here:

```
{
  "version":"1.0","elements":
    [
      {
        "user":"mary@%",
        "data_id":"key0",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01A1CF92B96934CB08D42D231CF6828A420000006E306C06092A864886F70D010706A0
5F305D020100305806092A864886F70D010701301E060960864801650304012E3011040C19F809F2
7900EACEF99DE2B4020110802BEDA406610AF033504B601C5EC937EFB9F38BB631F68856FF7FA81E
637FCC400BA35900929E99E628E1B3E7",
        "extension":[]
      },
      {
        "user":"mary@%",
        "data_id":"key1",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C017CAA36B2F756892C3AFCAA074A13E655000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864 886F70D010701301E060960864801650304012E30110
40CCDECB095F68DE68BC331A0730201108081BB52EF64775CCE3DD47ADD8C274A297EB1A6E988085
C0036D0AAE64DE50BB7D5AC020A12BF70",
        "extension":[]
      },
      {
        "user":"john@%",
        "data_id":"key2",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01BB9CC22B82E3DB50C76FD855DE0CB305000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864886F70D010701301E060960864801650304012E301104
0C778A6EDBA93A1FF27D82F5340201108081BB809B9599C191BF0DF1F7721DB2915F7A02A5928981
BF9264D9B76BE41046C3B5AF60006F4A",
        "extension":[]
        }
    ]
}
```

Note

Each of the `data` values just shown consists of a single line; the values have been wrapped here to fit within the confines of the viewing space.

Keyring operations are transactional: `component_keyring_aws` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with the added suffix `.backup`.

`component_keyring_aws` configuration files may not be placed anywhere within the MySQL server data directory.

##### Simple authentication mode

This mode provides ease of use when more advanced AWS mechanisms are not needed. (This also simplifies upgrading from the legacy AWS keyring plugin to the component; see Migration from AWS keyring plugin.) The `config` and `credentials` files are not used in this case; the configuration is read from the global `component_keyring_aws.cnf` only. To enable simple authentication mode, set `aws_authentication.mode` to `simple` in this file.

In simple mode, the component uses the access key ID and secret obtained from AWS, which are also set in `component_keyring_aws.cnf`, as the values of the `aws_authentication.access_key_id` and `aws_authentication.access_key_secret` configuration items. In addition, you must specify a region using `aws_authentication.region`.

The contents of a sample `component_keyring_aws.cnf` that meets the requirements for enabling simple authentication mode are shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": "true",
  "aws_authentication":
  {
    "mode": "simple",
    "region": "us-east-1",
    "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
    "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
  }
}
```

##### Native authentication mode

When `aws_authentication.mode` is `native`, the AWS keyring component uses the standard AWS authentication configuration mechanism (see [AWS SDKs and Tools: Configuration](https://docs.aws.amazon.com/sdkref/latest/guide/creds-config-files.html)) and the AWS profile specified in the component configuration file. The source for AWS credentials in this case is the AWS default credentials provider chain (see [AWS SDKs and Tools: Standardized credential providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html)).

Enabling AWS native authentication mode with the AWS Keyring component are more complex, but includes the following advantages:

* Conformance with standard AWS client behavior
* Support for authentication configuration methods other than storing long-term secrets in the same file as other configuration items.

* Possible to leverage the role connected to an AWS container or compute node, thus improving security.

* More flexible configuration, since a wider range of parameters—such as timeouts, proxying, and use of a CA—is available then with the alternative mode.

To enable AWS native authentication, `aws_authentication.mode` must be set to `native` in the `component_keyring_aws.cnf` file, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

Configuration of the component for AWS native authentication is based on a chain of credentials providers. Each provider uses a different source for credentials; possible sources include files, environment variables, and external services. Credential providers are called in the order specified by the default providers chain described in the next few paragraphs.

**Default credentials provider chain.** A credentials provider chain consists of one or more credential providers. Each such provider provides credentials taken from a different source. Providers are called until credentials are provided and collected for further use. The default chain consists of the credential providers listed here together with the credentials each of them provides:

* `EnvironmentAWSCredentialsProvider`: AWS access keys taken from environment variables (see [AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html) for details). This is convenient in development or other short-term environments, but not recommended for production.

* `ProfileConfigFileAWSCredentialsProvider`: AWS access keys taken from a credentials file \*default section (see [AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html)). This is recommended for MySQL server running outside of AWS.

* `ProcessCredentialsProvider`: AWS access keys taken from the output of an external command specified by the `credential_process` AWS configuration parameter. The output of this command must be in `JSON` format (see [AWS SDKs and Tools: Process credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-process-credentials.html)).

* `STSAssumeRoleWebIdentityCredentialsProvider`: A set of temporary security credentials for a specific role (see [AWS SDKs and Tools: Assume role credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-assume-role-credentials.html)).

* `SSOCredentialsProvider`: Credentials from the AWS IAM Identity Center (see [AWS SDKs and Tools: IAM Identity Center credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-sso-credentials.html)).

* `TaskRoleCredentialsProvider`: Credentials for use within an AWS ECS container (see [AWS SDKs and Tools: Amazon ECS task role](https://docs.aws.amazon.com/sdkref/latest/guide/developerguide/task-iam-roles.html)). This is recommended when the MySQL server runs within an AWS ECS container.

* `InstanceProfileCredentialsProvider`: Credentials loaded from the Amazon EC2 Instance Metadata Service (IMDS) (see [AWS SDKs and Tools: IMDS credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-imds-credentials.html)). This is recommended when the MySQL server runs in an AWS EC2 node.

To use AWS native authentication, `aws_authentication.mode` must be set to `native` in the `component_keyring_aws.cnf` file, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

The AWS configuration file (`config`) uses INI format similar to that employed in the MySQL Server `my.cnf` file. You can specify a section of this file to be read by setting `aws_authentication.profile`. For example, setting `aws_authentication.profile` to `mysql` causes the component to read the `[mysql]` section of `config`, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native",
    "profile": "mysql"
  }
}
```

If `aws_authentication.profile` is not specified, the component tries to read the `config` file section labelled `[default]`.

The AWS keyring component also supports an AWS `credentials` file to act as a source of credentials for the provider `ProfileConfigFileAWSCredentialsProvider` as described later in this section's discussion of native authentication mode. This file's location is determined in the same way as that of the `component_keyring_aws.cnf` and `config` files. To override the default for the `credentials` file (`%USERPROFILE%\.aws\credentials` for Windows, `~/.aws/credentials for Linux or MacOS`), set the `AWS_SHARED_CREDENTIALS_FILE` environment variable to the desired location.

##### Migration from AWS keyring plugin

To migrate from the AWS keyring plugin to the AWS keyring component, it is necessary to perform the following steps:

1. Create an equivalent configuration for the component:

   1. Write a local or global manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). The content of the file must match what is shown here:

      ```
      {
        "components": "file://component_keyring_aws"
      }
      ```

   2. Write a component configuration file `component_keyring_aws.cnf` as described in Section 8.4.5.4, “Using the component\_keyring\_file File-Based Keyring Component” (in the example for `component_keyring_file`). See also the instructions given for configuration simple configuration section. In particular, the value of the `cmk_id` configuration item used by the component must be set to the that of the `keyring_aws_cmk_id` used by the plugin; similarly, the `aws_region` item's value must be set to the value of `keyring_aws_region`. For example:

      ```
      {
        "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
        "data_file": "/usr/local/mysql/keyring.json",
        "cache_keys": true,
        "aws_authentication":
        {
           "mode":"simple",
           "region": "us-east-1",
           "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
           "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
         }
      }
      ```

      Values of the access key ID and secret just shown must be copied from the `keyring_aws` configuration file used by the AWS keyring plugin (see Section 8.4.5.8, “Using the keyring\_aws Amazon Web Services Keyring Plugin”).

2. Perform key migration as described in Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

3. Uninstall the plugin.
