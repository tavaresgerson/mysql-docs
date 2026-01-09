### 8.6.2 Configuring MySQL Enterprise Encryption

MySQL Enterprise Encryption lets you limit keys to a length that provides adequate security for your requirements while balancing this with resource usage. You can also configure the functions provided by the `component_enterprise_encryption` component to support decryption and verification for content produced by the old `openssl_udf` shared library functions.

#### Decryption Support By Component Functions For Legacy Functions

By default, the functions provided by the `component_enterprise_encryption` component do not decrypt encrypted text, or verify signatures, that were produced by the legacy functions provided in earlier releases by the `openssl_udf` shared library. The component functions assume that encrypted text uses the RSAES-OAEP padding scheme, and signatures use the RSASSA-PSS signature scheme. However, encrypted text produced by the legacy functions uses the RSAES-PKCS1-v1_5 padding scheme, and signatures produced by the legacy functions use the RSASSA-PKCS1-v1_5 signature scheme.

If you want the component functions to support content produced by the legacy functions, set the `enterprise_encryption.rsa_support_legacy_padding` system variable to `ON`. This variable is available when the component is installed. When you set it to `ON`, the component functions first attempt to decrypt or verify content assuming it has their normal schemes. If that does not work, they also attempt to decrypt or verify the content assuming it has the schemes used by the old functions. This behavior is not the default because it increases the time taken to process content that cannot be decrypted or verified at all. If you are not handling content produced by the old functions, let the system variable default to `OFF`.

#### Key Length Limits

The amount of CPU resources required by MySQL Enterprise Encryption's key generation functions increases as the key length increases. For some installations, this might result in unacceptable CPU usage if applications frequently generate excessively long keys.

The functions provided by the `component_enterprise_encryption` component have a minimum key length of 2048 bits for RSA keys, which is in line with current best practice for minimum key lengths. The `enterprise_encryption.maximum_rsa_key_size` system variable specifies the maximum key size.
