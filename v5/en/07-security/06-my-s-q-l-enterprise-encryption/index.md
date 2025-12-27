## 6.6 MySQL Enterprise Encryption

[6.6.1 MySQL Enterprise Encryption Installation](enterprise-encryption-installation.html)

[6.6.2 MySQL Enterprise Encryption Usage and Examples](enterprise-encryption-usage.html)

[6.6.3 MySQL Enterprise Encryption Function Reference](enterprise-encryption-function-reference.html)

[6.6.4 MySQL Enterprise Encryption Function Descriptions](enterprise-encryption-functions.html)

Note

MySQL Enterprise Encryption is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes a set of encryption functions based on the OpenSSL library that expose OpenSSL capabilities at the SQL level. These functions enable Enterprise applications to perform the following operations:

* Implement added data protection using public-key asymmetric cryptography

* Create public and private keys and digital signatures
* Perform asymmetric encryption and decryption
* Use cryptographic hashing for digital signing and data verification and validation

MySQL Enterprise Encryption supports the RSA, DSA, and DH cryptographic algorithms.

MySQL Enterprise Encryption is supplied as a library of loadable functions, from which individual functions can be installed individually.
