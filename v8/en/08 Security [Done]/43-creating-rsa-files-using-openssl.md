#### 8.3.3.3 Creating RSA Keys Using openssl

This section describes how to use the **openssl** command to set up the RSA key files that enable MySQL to support secure password exchange over unencrypted connections for accounts authenticated by the `sha256_password` (deprecated) and `caching_sha2_password` plugins.

::: info Note

An easier alternative to generating the files required for SSL than the procedure described here is to let the server autogenerate them; see Section 8.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

:::

To create the RSA private and public key-pair files, run these commands while logged into the system account used to run the MySQL server so that the files are owned by that account:

```
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Those commands create 2,048-bit keys. To create stronger keys, use a larger value.

Then set the access modes for the key files. The private key should be readable only by the server, whereas the public key can be freely distributed to client users:

```
chmod 400 private_key.pem
chmod 444 public_key.pem
```
