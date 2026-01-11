## 8.6 MySQL Enterprise Encryption

8.6.1 MySQL Enterprise Encryption Installation and Upgrading

8.6.2 Configuring MySQL Enterprise Encryption

8.6.3 MySQL Enterprise Encryption Usage and Examples

8.6.4 MySQL Enterprise Encryption Function Reference

8.6.5 MySQL Enterprise Encryption Component Function Descriptions

8.6.6 MySQL Enterprise Encryption Legacy Function Descriptions

Note

MySQL Enterprise Encryption is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes a set of encryption functions that expose OpenSSL capabilities at the SQL level. The functions enable Enterprise applications to perform the following operations:

* Implement added data protection using public-key asymmetric cryptography

* Create public and private keys and digital signatures
* Perform asymmetric encryption and decryption
* Use cryptographic hashing for digital signing and data verification and validation

In releases before MySQL 8.0.30, these functions are based on the `openssl_udf` shared library. From MySQL 8.0.30, they are provided by a MySQL component `component_enterprise_encryption`.
