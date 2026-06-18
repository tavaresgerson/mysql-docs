### 8.6.6 Descrições das funções de criptografia do MySQL Enterprise Legacy

Em versões anteriores ao MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são baseadas na biblioteca compartilhada `openssl_udf`. Esta referência descreve essas funções. As funções continuam disponíveis em versões posteriores se tiverem sido instaladas, mas estão desatualizadas.

Para obter informações sobre a atualização para as novas funções do componente fornecidas pelo componente MySQL `component_enterprise_encryption`, e uma lista das diferenças de comportamento entre as funções legadas e as funções do componente, consulte Atualizando a criptografia do MySQL Enterprise.

A referência para as funções do componente está na Seção 8.6.5, “Descrição das Funções do Componente de Criptografia do MySQL Enterprise”.

As funções de criptografia do MySQL Enterprise têm essas características gerais:

- Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

- Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, se o comprimento de uma chave for muito curto ou longo, ou se uma string esperada ser uma string de chave no formato PEM não for uma chave válida.

- A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

Várias das funções herdadas aceitam um argumento de algoritmo de criptografia. A tabela a seguir resume os algoritmos suportados por função.

**Tabela 8.49 Algoritmos suportados por função**

<table summary="Algoritmos de criptografia suportados por função."><thead><tr> <th>Função</th> <th>Algoritmos suportados</th> </tr></thead><tbody><tr> <td>[[<code>asymmetric_decrypt()</code>]]</td> <td>RSA</td> </tr><tr> <td>[[<code>asymmetric_derive()</code>]]</td> <td>DH</td> </tr><tr> <td>[[<code>asymmetric_encrypt()</code>]]</td> <td>RSA</td> </tr><tr> <td>[[<code>asymmetric_sign()</code>]]</td> <td>RSA, DSA</td> </tr><tr> <td>[[<code>asymmetric_verify()</code>]]</td> <td>RSA, DSA</td> </tr><tr> <td>[[<code>create_asymmetric_priv_key()</code>]]</td> <td>RSA, DSA, DH</td> </tr><tr> <td>[[<code>create_asymmetric_pub_key()</code>]]</td> <td>RSA, DSA, DH</td> </tr><tr> <td>[[<code>create_dh_parameters()</code>]]</td> <td>DH</td> </tr></tbody></table>

Nota

Embora você possa criar chaves usando qualquer um dos algoritmos de criptografia RSA, DSA ou DH, outras funções legadas que aceitam argumentos de chave podem aceitar apenas certos tipos de chaves. Por exemplo, `asymmetric_encrypt()` e `asymmetric_decrypt()` aceitam apenas chaves RSA.

Para exemplos adicionais e discussão, consulte a Seção 8.6.3, “Uso e Exemplos de Criptografia Empresarial do MySQL”.

- `asymmetric_decrypt(algorithm, crypt_str, key_str)`

  Descripta uma string criptografada usando o algoritmo e a string de chave fornecidos, e retorna a string em texto simples resultante como uma string binária. Se a descriptografia falhar, o resultado é `NULL`.

  A função da biblioteca compartilhada `openssl_udf` não pode descriptografar o conteúdo gerado pelas funções `component_enterprise_encryption` que estão disponíveis a partir do MySQL 8.0.30.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `crypt_str` é a string criptografada para descriptografar, que foi criptografada com `asymmetric_encrypt()`.

  `key_str` é uma chave pública ou privada RSA codificada em PEM válida. Para a descriptografia bem-sucedida, a string da chave deve corresponder à string da chave pública ou privada usada com `asymmetric_encrypt()` para produzir a string criptografada.

  Para um exemplo de uso, veja a descrição de `asymmetric_encrypt()`.

- `asymmetric_derive(pub_key_str, priv_key_str)`

  Desenha uma chave simétrica usando a chave privada de uma das partes e a chave pública da outra, e retorna a chave resultante como uma string binária. Se a derivação da chave falhar, o resultado é `NULL`.

  `pub_key_str` e `priv_key_str` são cadeias de caracteres de chave codificadas PEM válidas que foram criadas usando o algoritmo DH.

  Suponha que você tenha dois pares de chaves públicas e privadas:

  ```
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

  Suponha, ainda, que você use a chave privada de um par e a chave pública do outro par para criar uma string de chave simétrica. Então, essa relação de identidade de chave simétrica é válida:

  ```
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

  Este exemplo requer chaves privadas/públicas DH como entradas, criadas usando um segredo simétrico compartilhado. Crie o segredo passando o comprimento da chave para `create_dh_parameters()`, depois passe o segredo como o “comprimento da chave” para `create_asymmetric_priv_key()`.

  ```
  -- Generate DH shared symmetric secret
  SET @dhp = create_dh_parameters(1024);
  -- Generate DH key pairs
  SET @algo = 'DH';
  SET @priv1 = create_asymmetric_priv_key(@algo, @dhp);
  SET @pub1 = create_asymmetric_pub_key(@algo, @priv1);
  SET @priv2 = create_asymmetric_priv_key(@algo, @dhp);
  SET @pub2 = create_asymmetric_pub_key(@algo, @priv2);

  -- Generate symmetric key using public key of first party,
  -- private key of second party
  SET @sym1 = asymmetric_derive(@pub1, @priv2);

  -- Or use public key of second party, private key of first party
  SET @sym2 = asymmetric_derive(@pub2, @priv1);
  ```

- `asymmetric_encrypt(algorithm, str, key_str)`

  Criptografa uma string usando o algoritmo e a string de chave fornecidos e retorna o texto cifrado resultante como uma string binária. Se a criptografia falhar, o resultado é `NULL`.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `str` é a string a ser criptografada. O comprimento dessa string não pode ser maior que o comprimento da string de chave em bytes, menos 11 (para contabilizar o preenchimento).

  `key_str` é uma chave pública ou privada RSA codificada em PEM válida.

  Para recuperar a string original não criptografada, passe a string criptografada para `asymmetric_decrypt()`, juntamente com a outra parte do par de chaves usado para criptografia, como no exemplo a seguir:

  ```
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

  ```
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

  Então, essas relações de identidade são válidas:

  ```
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

- `asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`

  Assina uma string de digest usando uma string de chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

  `algorithm` é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'` e `'DSA'`.

  `digest_str` é uma string de digestão. Uma string de digestão pode ser gerada chamando `create_digest()`.

  `priv_key_str` é a string da chave privada a ser usada para assinar a string de digest. Pode ser uma chave privada RSA ou DSA codificada em PEM válida.

  `digest_type` é o algoritmo a ser utilizado para assinar os dados. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

  Para um exemplo de uso, veja a descrição de `asymmetric_verify()`.

- `asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`

  Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou não. Se a verificação falhar, o resultado é `NULL`.

  A função da biblioteca compartilhada `openssl_udf` não pode verificar o conteúdo produzido pelas funções `component_enterprise_encryption` que estão disponíveis a partir do MySQL 8.0.30.

  `algorithm` é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'` e `'DSA'`.

  `digest_str` é a string de digestão. Uma string de digestão é necessária e pode ser gerada chamando `create_digest()`.

  `sig_str` é a string de assinatura a ser verificada. Uma string de assinatura pode ser gerada chamando `asymmetric_sign()`.

  `pub_key_str` é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura. Ela deve ser uma chave pública RSA ou DSA codificada em PEM válida.

  `digest_type` é o algoritmo que foi usado para assinar os dados. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

  ```
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

  Cria uma chave privada usando o algoritmo e a duração da chave fornecidos ou o segredo DH e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #1. Se a geração da chave falhar, o resultado é `NULL`.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. Os valores do algoritmo suportados são `'RSA'`, `'DSA'` e `'DH'`.

  `key_len` é o comprimento da chave em bits para chaves RSA e DSA. Se você exceder o comprimento máximo permitido da chave ou especificar menos do que o mínimo, a geração de chaves falha e o resultado é uma saída nula. O comprimento mínimo permitido da chave em bits é de 1.024, e o comprimento máximo permitido da chave é de 16.384 para o algoritmo RSA ou 10.000 para o algoritmo DSA. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais ao comprimento máximo da chave configurando as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`. Veja a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”.

  Nota

  Gerar chaves mais longas pode consumir recursos significativos da CPU. Limitar o comprimento da chave usando as variáveis de ambiente permite que você forneça a segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

  `dh_secret` é um segredo DH compartilhado, que deve ser passado em vez do comprimento da chave para as chaves DH. Para criar o segredo, passe o comprimento da chave para `create_dh_parameters()`.

  Este exemplo cria uma chave privada DSA de 2.048 bits e, em seguida, deriva uma chave pública a partir da chave privada:

  ```
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  Para um exemplo que mostra a geração de chaves DH, veja a descrição de `asymmetric_derive()`.

- `create_asymmetric_pub_key(algorithm, priv_key_str)`

  Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #1. Se a derivação da chave falhar, o resultado é `NULL`.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. Os valores do algoritmo suportados são `'RSA'`, `'DSA'` e `'DH'`.

  `priv_key_str` é uma chave privada RSA, DSA ou DH codificada em PEM válida.

  Para um exemplo de uso, veja a descrição de `create_asymmetric_priv_key()`.

- `create_dh_parameters(key_len)`

  Cria um segredo compartilhado para gerar um par de chaves privadas/públicas DH e retorna uma string binária que pode ser passada para `create_asymmetric_priv_key()`. Se a geração do segredo falhar, o resultado é `NULL`.

  `key_len` é o comprimento da chave. Os comprimentos de chave mínima e máxima em bits são 1.024 e 10.000. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais ao comprimento máximo da chave configurando as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`. Veja a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”.

  Para um exemplo que mostra como usar o valor de retorno para gerar chaves simétricas, consulte a descrição de `asymmetric_derive()`.

  ```
  SET @dhp = create_dh_parameters(1024);
  ```

- `create_digest(digest_type, str)`

  Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração do digest falhar, o resultado é `NULL`.

  A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`. Uma digest é necessária para essas funções.

  `digest_type` é o algoritmo de digest que será usado para gerar a string de digest. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

  `str` é a string de dados não nula para a qual o digest deve ser gerado.

  ```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```
