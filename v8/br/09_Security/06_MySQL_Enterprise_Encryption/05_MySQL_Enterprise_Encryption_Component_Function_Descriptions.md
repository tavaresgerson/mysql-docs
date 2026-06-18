### 8.6.5 Descrições das funções do componente de criptografia da MySQL Enterprise

Nas versões do MySQL 8.0.30, as funções do MySQL Enterprise Encryption são fornecidas pelo componente MySQL `component_enterprise_encryption`. Esta referência descreve essas funções.

Para obter informações sobre a atualização para as novas funções do componente fornecidas pelo componente MySQL `component_enterprise_encryption`, e uma lista das diferenças de comportamento entre as funções legadas e as funções do componente, consulte Atualizando a criptografia do MySQL Enterprise.

A referência para as funções de legado nas versões anteriores ao MySQL 8.0.30 com base na biblioteca compartilhada `openssl_udf` é a Seção 8.6.6, “Descrição de Funções de Encriptação de Negócios do MySQL”.

As funções de criptografia do MySQL Enterprise têm essas características gerais:

- Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

- Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, se o comprimento de uma chave for muito curto ou longo, ou se uma string esperada ser uma string de chave no formato PEM não for uma chave válida.

- A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

O componente só suporta o algoritmo de criptografia RSA.

Para exemplos adicionais e discussão, consulte a Seção 8.6.3, “Uso e Exemplos de Criptografia Empresarial do MySQL”.

- `asymmetric_decrypt(algorithm, data_str, priv_key_str)`

  Descripta uma string criptografada usando o algoritmo e a string de chave fornecidos, e retorna a string em texto simples resultante como uma string binária. Se a descriptografia falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  Por padrão, a função `component_enterprise_encryption` assume que o texto criptografado usa o esquema de enchimento RSAES-OAEP. A função suporta a descriptografia de conteúdo criptografado pelas funções da biblioteca compartilhada `openssl_udf` legadas, se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando `ON` estiver definida, a função também suporta o esquema de enchimento RSAES-PKCS1-v1\_5, conforme usado pelas funções da biblioteca compartilhada `openssl_udf` legadas. Quando `OFF` estiver definida, o conteúdo criptografado pelas funções legadas não pode ser descriptografado, e a função retorna uma saída nulo para tal conteúdo.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `data_str` é a string criptografada para descriptografar, que foi criptografada com `asymmetric_encrypt()`.

  `priv_key_str` é uma chave privada RSA codificada em PEM válida. Para a descriptografia bem-sucedida, a string da chave deve corresponder à string da chave pública usada com `asymmetric_encrypt()` para produzir a string criptografada. O componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública, portanto, a descriptografia ocorre com a chave privada correspondente.

  Para um exemplo de uso, veja a descrição de `asymmetric_encrypt()`.

- `asymmetric_encrypt(algorithm, data_str, pub_key_str)`

  Criptografa uma string usando o algoritmo e a string de chave fornecidos e retorna o texto cifrado resultante como uma string binária. Se a criptografia falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `data_str` é a string a ser criptografada. O comprimento dessa string não pode ser maior que o comprimento da string de chave em bytes, menos 42 (para contabilizar o preenchimento).

  `pub_key_str` é uma chave pública RSA codificada em PEM válida. A função componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública.

  Para recuperar a string original não criptografada, passe a string criptografada para `asymmetric_decrypt()`, juntamente com a outra parte do par de chaves usado para criptografia, como no exemplo a seguir:

  ```
  -- Generate private/public key pair
  SET @priv = create_asymmetric_priv_key('RSA', 2048);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);

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
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

- `asymmetric_sign(algorithm, text, priv_key_str, digest_type)`

  Assina uma string de digest ou string de dados usando uma chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `text` é uma string de dados ou string de digestão. A função aceita digestões, mas não as exige, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digestão pode ser gerada chamando `create_digest()`.

  `priv_key_str` é a string da chave privada a ser usada para assinar a string de digest. Ela deve ser uma chave privada RSA codificada em PEM válida.

  `digest_type` é o algoritmo a ser utilizado para assinar os dados. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de `digest_type` `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

  Para um exemplo de uso, veja a descrição de `asymmetric_verify()`.

- `asymmetric_verify(algorithm, text, sig_str, pub_key_str, digest_type)`

  Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou não. Se a verificação falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  Por padrão, a função `component_enterprise_encryption` assume que as assinaturas utilizam o esquema de assinatura RSASSA-PSS. A função suporta a verificação de assinaturas produzidas pelas funções da biblioteca compartilhada `openssl_udf` legadas, se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando `ON` estiver definida, a função também suporta o esquema de assinatura RSASSA-PKCS1-v1\_5, conforme utilizado pelas funções da biblioteca compartilhada `openssl_udf` legadas. Quando `OFF` estiver definida, as assinaturas produzidas pelas funções legadas não podem ser verificadas, e a função retorna uma saída nulo para esse conteúdo.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `text` é uma string de dados ou uma string de digestão. A função componente aceita digestões, mas não as exige, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digestão pode ser gerada chamando `create_digest()`.

  `sig_str` é a string de assinatura a ser verificada. Uma string de assinatura pode ser gerada chamando `asymmetric_sign()`.

  `pub_key_str` é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura. Ela deve ser uma chave pública RSA codificada em PEM válida.

  `digest_type` é o algoritmo que foi usado para assinar os dados. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de `digest_type` `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

  ```
  -- Set the encryption algorithm and digest type
  SET @algo = 'RSA';
  SET @dig_type = 'SHA512';

  -- Create private/public key pair
  SET @priv = create_asymmetric_priv_key(@algo, 2048);
  SET @pub = create_asymmetric_pub_key(@algo, @priv);

  -- Generate digest from string
  SET @dig = create_digest(@dig_type, 'The quick brown fox');

  -- Generate signature for digest and verify signature against digest
  SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
  SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
  ```

- `create_asymmetric_priv_key(algorithm, key_length)`

  Cria uma chave privada usando o algoritmo e a extensão de chave fornecidos e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a geração da chave falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `key_length` é o comprimento da chave em bits. Se você exceder o comprimento máximo permitido da chave ou especificar menos que o mínimo, a geração da chave falha e o resultado é uma saída nula. O comprimento mínimo permitido da chave em bits é 2048. O comprimento máximo permitido da chave é o valor da variável de sistema `enterprise_encryption.maximum_rsa_key_size`, que tem um valor padrão de 4096. Tem um ajuste máximo de 16384, que é o comprimento máximo de chave permitido para o algoritmo RSA. Veja a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”.

  Nota

  Gerar chaves mais longas pode consumir recursos significativos da CPU. Limitar o comprimento da chave usando a variável de sistema `enterprise_encryption.maximum_rsa_key_size` permite que você forneça a segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

  Este exemplo cria uma chave privada RSA de 2048 bits e, em seguida, deriva uma chave pública a partir da chave privada:

  ```
  SET @priv = create_asymmetric_priv_key('RSA', 2048);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);
  ```

- `create_asymmetric_pub_key(algorithm, priv_key_str)`

  Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a derivação da chave falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  `algorithm` é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  `priv_key_str` é uma chave privada RSA codificada em PEM válida.

  Para um exemplo de uso, veja a descrição de `create_asymmetric_priv_key()`.

- `create_digest(digest_type, str)`

  Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração do digest falhar, o resultado é `NULL`.

  Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de Funções de Criptografia de Negócios do MySQL”.

  A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`. As versões dos componentes dessas funções aceitam digests, mas não os exigem, pois são capazes de lidar com dados de comprimento arbitrário.

  `digest_type` é o algoritmo de digest que será usado para gerar a string de digest. Os valores suportados de `digest_type` são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de `digest_type` `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

  `str` é a string de dados não nula para a qual o digest deve ser gerado.

  ```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```
