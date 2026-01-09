### 8.6.5 Descrições das Funções do Componente de Criptografia da MySQL Enterprise

As funções de criptografia da MySQL Enterprise têm essas características gerais:

* Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

* Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0 conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, uma comprimento de chave seja muito curto ou longo, ou uma string esperada ser uma string de chave no formato PEM não for uma chave válida.

* A biblioteca subjacente SSL cuida da inicialização da aleatoriedade.

As funções do componente só suportam o algoritmo de criptografia RSA.

Para exemplos adicionais e discussões, consulte a Seção 8.6.3, “Uso e Exemplos de Criptografia da MySQL Enterprise”.

* `asymmetric_decrypt(algorithm, data_str, priv_key_str)`

  Descriptografa uma string criptografada usando o algoritmo e a string de chave fornecidos, e retorna o texto claro resultante como uma string binária. Se a descriptografia falhar, o resultado é `NULL`.

* Para a versão legada desta função em uso antes do MySQL 8.0.29, consulte as Descrições das Funções Legadas de Criptografia da MySQL Enterprise.

Por padrão, a função `component_enterprise_encryption` assume que o texto criptografado usa o esquema de enchimento RSAES-OAEP. A função suporta a descriptografia de conteúdo criptografado pelas antigas funções da biblioteca compartilhada `openssl_udf` se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando esta é `ON`, a função também suporta o esquema de enchimento RSAES-PKCS1-v1_5, como usado pelas funções da biblioteca compartilhada `openssl_udf` antigas. Quando a variável é definida como `OFF`, o conteúdo criptografado pelas funções legadas não pode ser descriptografado, e a função retorna uma saída nulo para tal conteúdo.

*`algorithm`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`data_str`* é a string criptografada a ser descriptografada, que foi criptografada com `asymmetric_encrypt()`.

*`priv_key_str`* é uma chave privada RSA codificada em PEM válida. Para a descriptografia bem-sucedida, a string da chave deve corresponder à string da chave pública usada com `asymmetric_encrypt()` para produzir a string criptografada. O componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública, então a descriptografia ocorre com a chave privada correspondente.

Para um exemplo de uso, consulte a descrição de `asymmetric_encrypt()`.

* `asymmetric_encrypt(algorithm, data_str, pub_key_str)`

  Criptografa uma string usando o algoritmo e a string de chave fornecidos, e retorna a string cifrada resultante como uma string binária. Se a criptografia falhar, o resultado é `NULL`.

  Para a versão legada desta função usada antes do MySQL 8.0.29, consulte as descrições das funções de criptografia da MySQL Enterprise Legacy.

  *`algorithm`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`data_str`* é a string a ser criptografada. O comprimento dessa string não pode ser maior que o comprimento da string de chave em bytes, menos 42 (para contabilizar o preenchimento).

*`pub_key_str`* é uma chave pública RSA codificada em PEM válida. O componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública.

Para recuperar a string original não criptografada, passe a string criptografada para `asymmetric_decrypt()`, juntamente com a outra parte do par de chaves usado para a criptografia, como no exemplo a seguir:

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

Então, essas relações de identidade se aplicam:

```
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* `asymmetric_sign(algorithm, text, priv_key_str, digest_type)`

  Assina uma string de digest ou string de dados usando uma chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

  Para a versão legada dessa função usada antes do MySQL 8.0.29, consulte as descrições de funções de criptografia do MySQL Enterprise Legacy.

  *`algorithm`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  *`text`* é uma string de dados ou string de digest. O função aceita digests, mas não os exige, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digest pode ser gerada chamando `create_digest()`.

  *`priv_key_str`* é a string de chave privada a ser usada para assinar a string de digest. Ela deve ser uma chave privada RSA codificada em PEM válida.

  *`digest_type`* é o algoritmo a ser usado para assinar os dados. Os valores de *`digest_type`* suportados são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`digest_type`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

Para um exemplo de uso, consulte a descrição de `asymmetric_verify()`.

* `asymmetric_verify(algoritmo, texto, sig_str, chave_pub_str, tipo_digest)`

  Verifica se a string de assinatura corresponde à string de digest, e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou não. Se a verificação falhar, o resultado é `NULL`.

  Por padrão, a função `component_enterprise_encryption` assume que as assinaturas usam o esquema de assinatura RSASSA-PSS. A função suporta a verificação de assinaturas produzidas pelas antigas funções da biblioteca compartilhada `openssl_udf` se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando isso é `ON`, a função também suporta o esquema de assinatura RSASSA-PKCS1-v1_5, como usado pelas funções da biblioteca compartilhada `openssl_udf` antigas; quando é `OFF`, as assinaturas produzidas pelas funções legadas não podem ser verificadas, e a função retorna uma saída nulo para esse conteúdo.

  *`algorithm`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  *`texto`* é uma string de dados ou string de digest. O componente da função aceita digests, mas não os requer, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digest pode ser gerada chamando `create_digest()`.

  *`sig_str`* é a string de assinatura a ser verificada. Uma string de assinatura pode ser gerada chamando `asymmetric_sign()`.

  *`chave_pub_str`* é a string de chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura. Ela deve ser uma chave pública RSA codificada em PEM válida.

*`digest_type`* é o algoritmo usado para assinar os dados. Os valores de *`digest_type`* suportados são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`digest_type`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

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

* `create_asymmetric_priv_key(algorithm, key_length)`

  Cria uma chave privada usando o algoritmo fornecido e o comprimento da chave, e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a geração da chave falhar, o resultado é `NULL`.

  Para a versão legada desta função em uso antes do MySQL 8.0.29, consulte as descrições das funções de criptografia da MySQL Enterprise Legacy.

  *`algorithm`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

  *`key_length`* é o comprimento da chave em bits. Se você exceder o comprimento máximo permitido da chave ou especificar menos que o mínimo, a geração da chave falha e o resultado é uma saída `null`. O comprimento mínimo permitido da chave em bits é 2048. O comprimento máximo permitido da chave é o valor da variável de sistema `enterprise_encryption.maximum_rsa_key_size`, que tem um valor padrão de 4096. Tem um limite máximo de 16384, que é o comprimento máximo permitido da chave para o algoritmo RSA. Veja a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”.

  Nota

  Gerar chaves mais longas pode consumir recursos significativos do CPU. Limitar o comprimento da chave usando a variável de sistema `enterprise_encryption.maximum_rsa_key_size` permite que você forneça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

Este exemplo cria uma chave privada RSA de 2048 bits, e depois deriva uma chave pública a partir da chave privada:

```
  SET @priv = create_asymmetric_priv_key('RSA', 2048);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);
  ```

* `create_asymmetric_pub_key(algoritmo, str_chave_privada)`

Desenha a chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a derivação da chave falhar, o resultado é `NULL`.

Para a versão legada desta função usada antes do MySQL 8.0.29, consulte as descrições das funções de criptografia de MySQL Enterprise Legacy.

*`algoritmo`* é o algoritmo de criptografia usado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`str_chave_privada`* é uma chave privada codificada em PEM válida RSA.

Para um exemplo de uso, consulte a descrição de `create_asymmetric_priv_key()`.

* `create_digest(tipo_digest, str)`

Cria um digest a partir da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração do digest falhar, o resultado é `NULL`.

Para a versão legada desta função usada antes do MySQL 8.0.29, consulte as descrições das funções de criptografia de MySQL Enterprise Legacy.

O digest resultante é adequado para uso com `asymmetric_sign()` e `asymmetric_verify()`. As versões componentes dessas funções aceitam digests, mas não os exigem, pois são capazes de lidar com dados de comprimento arbitrário.

*`tipo_digest`* é o algoritmo de digest a ser usado para gerar a string de digest. Os valores de *`tipo_digest`* suportados são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'` quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`tipo_digest`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

*`str`* é a string de dados não nula para a qual o digest deve ser gerado.

```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```