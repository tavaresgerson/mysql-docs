### 6.3.3 Creating SSL and RSA Certificates and Keys

[6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL](creating-ssl-rsa-files-using-mysql.html)

[6.3.3.2 Creating SSL Certificates and Keys Using openssl](creating-ssl-files-using-openssl.html)

[6.3.3.3 Creating RSA Keys Using openssl](creating-rsa-files-using-openssl.html)

The following discussion describes how to create the files required for SSL and RSA support in MySQL. File creation can be performed using facilities provided by MySQL itself, or by invoking the **openssl** command directly.

SSL certificate and key files enable MySQL to support encrypted connections using SSL. See [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

RSA key files enable MySQL to support secure password exchange over unencrypted connections for accounts authenticated by the `sha256_password` plugin. See [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").
