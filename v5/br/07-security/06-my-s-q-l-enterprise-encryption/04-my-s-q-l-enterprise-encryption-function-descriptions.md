### 6.6.4 Descrições das Funções de Criptografia do MySQL Enterprise

As funções de criptografia do MySQL Enterprise têm essas características gerais:

- Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

- Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, se o comprimento de uma chave for muito curto ou longo, ou se uma string esperada ser uma string de chave no formato PEM não for uma chave válida. (O OpenSSL impõe seus próprios limites de comprimento de chave, e os administradores do servidor podem impor limites adicionais de comprimento máximo de chave configurando variáveis de ambiente. Veja Seção 6.6.2, “Uso e Exemplos de Criptografia da MySQL Enterprise”.)

- A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

Várias das funções aceitam um argumento de algoritmo de criptografia. A tabela a seguir resume os algoritmos suportados por função.

**Tabela 6.37 Algoritmos suportados por função**

<table summary="Algoritmos de criptografia suportados por função."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Função</th> <th>Algoritmos suportados</th> </tr></thead><tbody><tr> <td>[[<code>asymmetric_decrypt()</code>]]</td> <td>RSA</td> </tr><tr> <td>[[<code>asymmetric_derive()</code>]]</td> <td>DH</td> </tr><tr> <td>[[<code>asymmetric_encrypt()</code>]]</td> <td>RSA</td> </tr><tr> <td>[[<code>asymmetric_sign()</code>]]</td> <td>RSA, DSA</td> </tr><tr> <td>[[<code>asymmetric_verify()</code>]]</td> <td>RSA, DSA</td> </tr><tr> <td>[[<code>create_asymmetric_priv_key()</code>]]</td> <td>RSA, DSA, DH</td> </tr><tr> <td>[[<code>create_asymmetric_pub_key()</code>]]</td> <td>RSA, DSA, DH</td> </tr><tr> <td>[[<code>create_dh_parameters()</code>]]</td> <td>DH</td> </tr></tbody></table>

Nota

Embora você possa criar chaves usando qualquer um dos algoritmos de criptografia RSA, DSA ou DH, outras funções que aceitam argumentos de chave podem aceitar apenas certos tipos de chaves. Por exemplo, `asymmetric_encrypt()` e `asymmetric_decrypt()` aceitam apenas chaves RSA.

As descrições a seguir descrevem as sequências de chamada para as funções de criptografia do MySQL Enterprise. Para exemplos adicionais e discussões, consulte Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”.

- `asymmetric_decrypt(algoritmo, crypt_str, key_str)`

  Descripta uma string criptografada usando o algoritmo e a string de chave fornecidos, e retorna a string em texto simples resultante como uma string binária. Se a descriptografia falhar, o resultado é `NULL`.

  *`key_str`* deve ser uma string de chave válida no formato PEM. Para a descriptografia bem-sucedida, ela deve ser a string de chave pública ou privada correspondente à string de chave privada ou pública usada com `asymmetric_encrypt()` para produzir a string criptografada. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

  Valores suportados de *`algorithm`*: `'RSA'`

  Para um exemplo de uso, consulte a descrição de `asymmetric_encrypt()`.

- `asymmetric_derive(pub_key_str, priv_key_str)`

  Desenha uma chave simétrica usando a chave privada de uma das partes e a chave pública da outra, e retorna a chave resultante como uma string binária. Se a derivação da chave falhar, o resultado é `NULL`.

  *`pub_key_str`* e *`priv_key_str`* devem ser cadeias de chave válidas no formato PEM. Elas devem ser criadas usando o algoritmo DH.

  Suponha que você tenha dois pares de chaves públicas e privadas:

  ```sql
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

  Suponha, ainda, que você use a chave privada de um par e a chave pública do outro par para criar uma string de chave simétrica. Então, essa relação de identidade de chave simétrica é válida:

  ```sql
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

- `asymmetric_encrypt(algoritmo, str, key_str)`

  Criptografa uma string usando o algoritmo e a string de chave fornecidos e retorna o texto cifrado resultante como uma string binária. Se a criptografia falhar, o resultado é `NULL`.

  O comprimento do *`str`* não pode ser maior que o comprimento do *`key_str`* − 11, em bytes

  *`key_str`* deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

  Valores suportados de *`algorithm`*: `'RSA'`

  Para criptografar uma string, passe uma string de chave privada ou pública para `asymmetric_encrypt()`. Para recuperar a string original não criptografada, passe a string criptografada para `asymmetric_decrypt()`, juntamente com a string de chave pública ou privada correspondente à string de chave privada ou pública usada para criptografia.

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

  Então, essas relações de identidade são válidas:

  ```sql
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

- `assinatura assimétrica(algoritmo, digest_str, priv_key_str, digest_type)`

  Assina uma string de digest usando uma string de chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

  *`digest_str`* é a string de digest. Ela pode ser gerada chamando `create_digest()`. *`digest_type`* indica o algoritmo de digest usado para gerar a string de digest.

  *`priv_key_str`* é a string da chave privada a ser usada para assinar a string de digest. Ela deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

  Valores suportados de *`algorithm`*: `'RSA'`, `'DSA'`

  Valores suportados de `digest_type`: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  Para um exemplo de uso, consulte a descrição de `asymmetric_verify()`.

- `asymmetric_verify(algoritmo, digest_str, sig_str, chave_pub_str, tipo_digest)`

  Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou

  *`digest_str`* é a string de digest. Ela pode ser gerada chamando `create_digest()`. *`digest_type`* indica o algoritmo de digest usado para gerar a string de digest.

  *`sig_str`* é a string de assinatura. Ela pode ser gerada chamando `asymmetric_sign()`.

  *`pub_key_str`* é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura e deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

  Valores suportados de *`algorithm`*: `'RSA'`, `'DSA'`

  Valores suportados de `digest_type`: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

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

- `create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`

  Cria uma chave privada usando o algoritmo e a duração da chave fornecidos ou o segredo DH e retorna a chave como uma string binária no formato PEM. Se a geração da chave falhar, o resultado é `NULL`.

  Valores suportados de *`algorithm`*: `'RSA'`, `'DSA'`, `'DH'`

  Valores suportados de *`key_len`*: O comprimento mínimo da chave em bits é de 1.024. O comprimento máximo da chave depende do algoritmo: 16.384 para RSA e 10.000 para DSA. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais de comprimento máximo de chave definindo variáveis de ambiente. Consulte Seção 6.6.2, “Uso e Exemplos de Criptografia da MySQL Enterprise”.

  Para chaves DH, passe um segredo compartilhado DH em vez de um comprimento de chave. Para criar o segredo, passe o comprimento da chave para `create_dh_parameters()`.

  Este exemplo cria uma chave privada DSA de 2.048 bits e, em seguida, deriva uma chave pública a partir da chave privada:

  ```sql
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  Para um exemplo que mostra a geração de chaves DH, consulte a descrição de `asymmetric_derive()`.

  Algumas considerações gerais na escolha de comprimentos de chave e algoritmos de criptografia:

  - A força da criptografia para chaves privadas e públicas aumenta com o tamanho da chave, mas o tempo para a geração da chave também aumenta.

  - A geração de chaves DH leva muito mais tempo do que as chaves RSA ou RSA.

  - As funções de criptografia assimétricas são mais lentas do que as funções simétricas. Se o desempenho for um fator importante e as funções forem usadas com frequência, é melhor usar criptografia simétrica. Por exemplo, considere usar [`AES_ENCRYPT()`](https://docs.php.net/en/manual/encryption-functions.html#function_aes-encrypt) e [`AES_DECRYPT()`](https://docs.php.net/en/manual/encryption-functions.html#function_aes-decrypt).

- `criar-chave-pública-asimétrica(algoritmo, priv_key_str)`

  Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. Se a derivação da chave falhar, o resultado é `NULL`.

  *`priv_key_str`* deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

  Valores suportados de *`algorithm`*: `'RSA'`, `'DSA'`, `'DH'`

  Para um exemplo de uso, consulte a descrição de `create_asymmetric_priv_key()`.

- `create_dh_parameters(key_len)`

  Cria um segredo compartilhado para gerar um par de chaves privadas/públicas DH e retorna uma string binária que pode ser passada para `create_asymmetric_priv_key()` (enterprise-encryption-functions.html#function_create-asymmetric-priv-key). Se a geração do segredo falhar, o resultado é nulo.

  Valores suportados de *`key_len`*: As comprimentos de chave mínima e máxima em bits são 1.024 e 10.000. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais de comprimento de chave máxima configurando variáveis de ambiente. Consulte Seção 6.6.2, “Uso e Exemplos de Criptografia da MySQL Enterprise”.

  Para um exemplo de como usar o valor de retorno para gerar chaves simétricas, consulte a descrição de `asymmetric_derive()`.

  ```sql
  SET @dhp = create_dh_parameters(1024);
  ```

- `create_digest(digest_type, str)`

  Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração do digest falhar, o resultado é `NULL`.

  Valores suportados de `digest_type`: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  SET @dig = create_digest('SHA512', The quick brown fox');
  ```

  A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`.
