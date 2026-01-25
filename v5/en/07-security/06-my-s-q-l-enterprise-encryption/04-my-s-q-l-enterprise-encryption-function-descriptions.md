### 6.6.4 Descrições das Funções de Criptografia do MySQL Enterprise

As funções de Criptografia do MySQL Enterprise têm estas características gerais:

* Para argumentos do tipo incorreto ou um número incorreto de argumentos, cada função retorna um erro.

* Se os argumentos não forem adequados para permitir que uma função execute a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um *algorithm* especificado, se o comprimento de uma *key* for muito curto ou longo, ou se uma *string* esperada para ser uma *key string* no formato PEM não for uma *key* válida. (O OpenSSL impõe seus próprios limites de comprimento de *key*, e administradores de servidor podem impor limites adicionais no comprimento máximo de *key* configurando variáveis de ambiente. Consulte [Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”](enterprise-encryption-usage.html "6.6.2 Uso e Exemplos de Criptografia do MySQL Enterprise").)

* A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

Várias das funções aceitam um argumento de *algorithm* de *encryption*. A tabela a seguir resume os *algorithms* suportados por função.

**Tabela 6.37 Algorithms Suportados por Função**

| Função | Algorithms Suportados |
| :--- | :--- |
| `asymmetric_decrypt()` | RSA |
| `asymmetric_derive()` | DH |
| `asymmetric_encrypt()` | RSA |
| `asymmetric_sign()` | RSA, DSA |
| `asymmetric_verify()` | RSA, DSA |
| `create_asymmetric_priv_key()` | RSA, DSA, DH |
| `create_asymmetric_pub_key()` | RSA, DSA, DH |
| `create_dh_parameters()` | DH |

Nota

Embora você possa criar *keys* usando qualquer um dos *encryption algorithms* RSA, DSA ou DH, outras funções que aceitam argumentos de *key* podem aceitar apenas certos tipos de *keys*. Por exemplo, [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt) e [`asymmetric_decrypt()`](enterprise-encryption-functions.html#function_asymmetric-decrypt) aceitam apenas *keys* RSA.

As descrições a seguir detalham as sequências de chamada para as funções de Criptografia do MySQL Enterprise. Para exemplos adicionais e discussão, consulte [Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”](enterprise-encryption-usage.html "6.6.2 Uso e Exemplos de Criptografia do MySQL Enterprise").

* [`asymmetric_decrypt(algorithm, crypt_str, key_str)`](enterprise-encryption-functions.html#function_asymmetric-decrypt)

  Descriptografa uma *string* criptografada usando o *algorithm* e a *key string* fornecidos, e retorna o *plaintext* resultante como uma *binary string*. Se a *decryption* falhar, o resultado é `NULL`.

  *`key_str`* deve ser uma *key string* válida no formato PEM. Para uma *decryption* bem-sucedida, ela deve ser a *public key string* ou *private key string* correspondente à *private key string* ou *public key string* usada com [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt) para produzir a *string* criptografada. *`algorithm`* indica o *encryption algorithm* usado para criar a *key*.

  Valores de *`algorithm`* suportados: `'RSA'`

  Para um exemplo de uso, consulte a descrição de [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt).

* [`asymmetric_derive(pub_key_str, priv_key_str)`](enterprise-encryption-functions.html#function_asymmetric-derive)

  Deriva uma *symmetric key* usando a *private key* de uma parte e a *public key* de outra, e retorna a *key* resultante como uma *binary string*. Se a derivação da *key* falhar, o resultado é `NULL`.

  *`pub_key_str`* e *`priv_key_str`* devem ser *key strings* válidas no formato PEM. Elas devem ser criadas usando o *algorithm* DH.

  Suponha que você tenha dois pares de *public* e *private keys*:

  ```sql
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

  Suponha ainda que você use a *private key* de um par e a *public key* do outro par para criar uma *symmetric key string*. Então esta relação de identidade da *symmetric key* se mantém:

  ```sql
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

* [`asymmetric_encrypt(algorithm, str, key_str)`](enterprise-encryption-functions.html#function_asymmetric-encrypt)

  Criptografa uma *string* usando o *algorithm* e a *key string* fornecidos, e retorna o *ciphertext* resultante como uma *binary string*. Se a *encryption* falhar, o resultado é `NULL`.

  O comprimento de *`str`* não pode ser maior que o comprimento de *`key_str`* − 11, em bytes.

  *`key_str`* deve ser uma *key string* válida no formato PEM. *`algorithm`* indica o *encryption algorithm* usado para criar a *key*.

  Valores de *`algorithm`* suportados: `'RSA'`

  Para criptografar uma *string*, passe uma *private* ou *public key string* para [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt). Para recuperar a *string* original não criptografada, passe a *string* criptografada para [`asymmetric_decrypt()`](enterprise-encryption-functions.html#function_asymmetric-decrypt), juntamente com a *public key string* ou *private key string* correspondente à *private key string* ou *public key string* usada para a *encryption*.

  ```sql
  -- Generate private/public key pair
  SET @priv = create_asymmetric_priv_key('RSA', 1024);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);

  -- Encrypt using private key, decrypt using public key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @priv);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @pub);

  -- Encrypt using public key, decrypt using private key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @pub);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @priv);
  ```

  Suponha que:

  ```sql
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

  Então estas relações de identidade se mantêm:

  ```sql
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* [`asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`](enterprise-encryption-functions.html#function_asymmetric-sign)

  Assina uma *digest string* usando uma *private key string* e retorna a *signature* como uma *binary string*. Se a assinatura falhar, o resultado é `NULL`.

  *`digest_str`* é a *digest string*. Ela pode ser gerada chamando [`create_digest()`](enterprise-encryption-functions.html#function_create-digest). *`digest_type`* indica o *digest algorithm* usado para gerar a *digest string*.

  *`priv_key_str`* é a *private key string* a ser usada para assinar a *digest string*. Ela deve ser uma *key string* válida no formato PEM. *`algorithm`* indica o *encryption algorithm* usado para criar a *key*.

  Valores de *`algorithm`* suportados: `'RSA'`, `'DSA'`

  Valores de *`digest_type`* suportados: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  Para um exemplo de uso, consulte a descrição de [`asymmetric_verify()`](enterprise-encryption-functions.html#function_asymmetric-verify).

* [`asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`](enterprise-encryption-functions.html#function_asymmetric-verify)

  Verifica se a *signature string* corresponde à *digest string* e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou falhou.

  *`digest_str`* é a *digest string*. Ela pode ser gerada chamando [`create_digest()`](enterprise-encryption-functions.html#function_create-digest). *`digest_type`* indica o *digest algorithm* usado para gerar a *digest string*.

  *`sig_str`* é a *signature string*. Ela pode ser gerada chamando [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign).

  *`pub_key_str`* é a *public key string* do signatário. Ela corresponde à *private key* passada para [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign) para gerar a *signature string* e deve ser uma *key string* válida no formato PEM. *`algorithm`* indica o *encryption algorithm* usado para criar a *key*.

  Valores de *`algorithm`* suportados: `'RSA'`, `'DSA'`

  Valores de *`digest_type`* suportados: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  -- Set the encryption algorithm and digest type
  SET @algo = 'RSA';
  SET @dig_type = 'SHA224';

  -- Create private/public key pair
  SET @priv = create_asymmetric_priv_key(@algo, 1024);
  SET @pub = create_asymmetric_pub_key(@algo, @priv);

  -- Generate digest from string
  SET @dig = create_digest(@dig_type, 'The quick brown fox');

  -- Generate signature for digest and verify signature against digest
  SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
  SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
  ```

* [`create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key)

  Cria uma *private key* usando o *algorithm* e o comprimento da *key* ou *DH secret* fornecidos, e retorna a *key* como uma *binary string* no formato PEM. Se a geração da *key* falhar, o resultado é `NULL`.

  Valores de *`algorithm`* suportados: `'RSA'`, `'DSA'`, `'DH'`

  Valores de *`key_len`* suportados: O comprimento mínimo da *key* em bits é 1.024. O comprimento máximo da *key* depende do *algorithm*: 16.384 para RSA e 10.000 para DSA. Esses limites de comprimento de *key* são restrições impostas pelo OpenSSL. Administradores de servidor podem impor limites adicionais no comprimento máximo da *key* configurando variáveis de ambiente. Consulte [Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”](enterprise-encryption-usage.html "6.6.2 Uso e Exemplos de Criptografia do MySQL Enterprise").

  Para *keys* DH, passe um *DH secret* compartilhado em vez de um comprimento de *key*. Para criar o *secret*, passe o comprimento da *key* para [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters).

  Este exemplo cria uma *private key* DSA de 2.048 bits e, em seguida, deriva uma *public key* a partir da *private key*:

  ```sql
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  Para um exemplo mostrando a geração de *key* DH, consulte a descrição de [`asymmetric_derive()`](enterprise-encryption-functions.html#function_asymmetric-derive).

  Algumas considerações gerais na escolha de comprimentos de *key* e *encryption algorithms*:

  + A força da *encryption* para *private* e *public keys* aumenta com o tamanho da *key*, mas o tempo para a geração da *key* também aumenta.

  + A geração de *keys* DH leva muito mais tempo do que as *keys* RSA ou RSA.

  + Funções de *encryption* assimétrica são mais lentas do que funções simétricas. Se a performance for um fator importante e as funções forem usadas com muita frequência, é melhor usar *encryption* simétrica. Por exemplo, considere usar [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) e [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

* [`create_asymmetric_pub_key(algorithm, priv_key_str)`](enterprise-encryption-functions.html#function_create-asymmetric-pub-key)

  Deriva uma *public key* a partir da *private key* fornecida usando o *algorithm* especificado, e retorna a *key* como uma *binary string* no formato PEM. Se a derivação da *key* falhar, o resultado é `NULL`.

  *`priv_key_str`* deve ser uma *key string* válida no formato PEM. *`algorithm`* indica o *encryption algorithm* usado para criar a *key*.

  Valores de *`algorithm`* suportados: `'RSA'`, `'DSA'`, `'DH'`

  Para um exemplo de uso, consulte a descrição de [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key).

* [`create_dh_parameters(key_len)`](enterprise-encryption-functions.html#function_create-dh-parameters)

  Cria um *shared secret* para gerar um par de *keys* DH *private/public* e retorna uma *binary string* que pode ser passada para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). Se a geração do *secret* falhar, o resultado é *null*.

  Valores de *`key_len`* suportados: Os comprimentos mínimo e máximo da *key* em bits são 1.024 e 10.000. Esses limites de comprimento de *key* são restrições impostas pelo OpenSSL. Administradores de servidor podem impor limites adicionais no comprimento máximo da *key* configurando variáveis de ambiente. Consulte [Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”](enterprise-encryption-usage.html "6.6.2 Uso e Exemplos de Criptografia do MySQL Enterprise").

  Para um exemplo mostrando como usar o valor de retorno para gerar *symmetric keys*, consulte a descrição de [`asymmetric_derive()`](enterprise-encryption-functions.html#function_asymmetric-derive).

  ```sql
  SET @dhp = create_dh_parameters(1024);
  ```

* [`create_digest(digest_type, str)`](enterprise-encryption-functions.html#function_create-digest)

  Cria um *digest* a partir da *string* fornecida usando o *digest type* especificado e retorna o *digest* como uma *binary string*. Se a geração do *digest* falhar, o resultado é `NULL`.

  Valores de *`digest_type`* suportados: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  SET @dig = create_digest('SHA512', The quick brown fox');
  ```

  A *digest string* resultante é adequada para uso com [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign) e [`asymmetric_verify()`](enterprise-encryption-functions.html#function_asymmetric-verify).