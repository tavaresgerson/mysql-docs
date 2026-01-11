### 8.3.3 Creating SSL and RSA Certificates and Keys

8.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL

8.3.3.2 Creating SSL Certificates and Keys Using openssl

8.3.3.3 Creating RSA Keys Using openssl

The following discussion describes how to create the files required for SSL and RSA support in MySQL. File creation can be performed using facilities provided by MySQL itself, or by invoking the **openssl** command directly.

SSL certificate and key files enable MySQL to support encrypted connections using SSL. See Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”.

RSA key files enable MySQL to support secure password exchange over unencrypted connections for accounts authenticated by the `sha256_password` or `caching_sha2_password` plugin. See Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
