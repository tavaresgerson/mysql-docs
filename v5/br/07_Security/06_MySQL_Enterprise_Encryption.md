## 6.6 Encriptação da MySQL Enterprise

Nota

A Encriptação Empresarial do MySQL é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia com base na biblioteca OpenSSL, que expõem as capacidades da OpenSSL ao nível do SQL. Essas funções permitem que os aplicativos empresariais realizem as seguintes operações:

* Implemente proteção de dados adicional usando criptografia assimétrica de chave pública

* Crie chaves públicas e privadas e assinaturas digitais
* Realize criptografia assimétrica e descriptografia
* Use hashing criptográfico para assinatura digital e verificação e validação de dados

O MySQL Enterprise Encryption suporta os algoritmos criptográficos RSA, DSA e DH.

A Encriptação Empresarial do MySQL é fornecida como uma biblioteca de funções carregáveis, das quais as funções individuais podem ser instaladas individualmente.

### 6.6.1 Instalação de Encriptação da MySQL Enterprise

As funções de criptografia do MySQL Enterprise estão localizadas em um arquivo de biblioteca de funções carregável instalado no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). O nome base da biblioteca de funções é `openssl_udf` e o sufixo depende da plataforma. Por exemplo, o nome do arquivo no Linux ou no Windows é `openssl_udf.so` ou `openssl_udf.dll`, respectivamente.

Para instalar funções do arquivo da biblioteca, use a declaração `CREATE FUNCTION`. Para carregar todas as funções da biblioteca, use este conjunto de declarações, ajustando o sufixo do nome do arquivo conforme necessário:

```sql
CREATE FUNCTION asymmetric_decrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_derive RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_encrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_sign RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_verify RETURNS INTEGER
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_priv_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_pub_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_dh_parameters RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_digest RETURNS STRING
  SONAME 'openssl_udf.so';
```

Uma vez instalado, as funções permanecem instaladas após a reinicialização do servidor. Para descarregar as funções, use a declaração `DROP FUNCTION`:

```sql
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

Nas declarações `CREATE FUNCTION` e `DROP FUNCTION`, os nomes das funções devem ser especificados em minúsculas. Isso difere de seu uso no momento da invocação da função, para o qual você pode usar qualquer caso de letra.

As declarações `CREATE FUNCTION` e `DROP FUNCTION` exigem o privilégio `INSERT` e `DROP`, respectivamente, para o banco de dados `mysql`.

### 6.6.2 Uso e exemplos de criptografia empresarial do MySQL

Para usar a Encriptação Empresarial do MySQL em aplicativos, invoque as funções apropriadas para as operações que você deseja realizar. Esta seção demonstra como realizar algumas tarefas representativas:

* Crie um par de chave privada/pública usando criptografia RSA
* Use a chave privada para criptografar dados e a chave pública para descriptografá-los
* Gerar um digest de uma string
* Use o digest com um par de chaves
* Crie uma chave simétrica
* Limite o uso da CPU por operações de geração de chave

#### Crie um par de chave privada/pública usando criptografia RSA

```sql
-- Encryption algorithm; can be 'DSA' or 'DH' instead
SET @algo = 'RSA';
-- Key length in bits; make larger for stronger keys
SET @key_len = 1024;

-- Create private key
SET @priv = create_asymmetric_priv_key(@algo, @key_len);
-- Derive corresponding public key from private key, using same algorithm
SET @pub = create_asymmetric_pub_key(@algo, @priv);
```

Agora você pode usar o par de chaves para criptografar e descriptografar dados, assinar e verificar dados ou gerar chaves simétricas.

#### Use a chave privada para criptografar dados e a chave pública para descriptografá-los

Isso exige que os membros do par de chaves sejam chaves RSA.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @priv);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @pub);
```

Por outro lado, você pode criptografar usando a chave pública e descriptografar usando a chave privada.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

Em qualquer caso, o algoritmo especificado para as funções de criptografia e descriptografia deve corresponder ao utilizado para gerar as chaves.

#### Gerar um resumo de uma string

```sql
-- Digest type; can be 'SHA256', 'SHA384', or 'SHA512' instead
SET @dig_type = 'SHA224';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Use o digest com um par de chave

O par de chaves pode ser usado para assinar dados, e depois verificar se a assinatura corresponde ao digest.

```sql
-- Encryption algorithm; could be 'DSA' instead; keys must
-- have been created using same algorithm
SET @algo = 'RSA';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
```

#### Crie uma chave simétrica

Isso requer chaves privadas/públicas do DH como entradas, criadas usando um segredo simétrico compartilhado. Crie o segredo passando o comprimento da chave para `create_dh_parameters()`, em seguida, passe o segredo como o “comprimento da chave” para `create_asymmetric_priv_key()`.

```sql
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

Valores de cadeia chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando `SET`, `SELECT` ou `INSERT`:

```sql
SET @priv1 = create_asymmetric_priv_key('RSA', 1024);
SELECT create_asymmetric_priv_key('RSA', 1024) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Os valores-chave de cadeia armazenados em arquivos podem ser lidos usando a função `LOAD_FILE()` por usuários que possuem o privilégio `FILE`.

As cadeias de digestão e assinatura podem ser manipuladas de maneira semelhante.

#### Limite o uso da CPU por operações de geração de chaves

As funções de criptografia `create_asymmetric_priv_key()` e `create_dh_parameters()` recebem um parâmetro de comprimento de chave, e a quantidade de recursos de CPU necessários por essas funções aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em uso de CPU inaceitável se as aplicações gerarem frequentemente chaves excessivamente longas.

O OpenSSL exige um comprimento mínimo de chave de 1.024 bits para todas as chaves. O OpenSSL também exige um comprimento máximo de chave de 10.000 bits e 16.384 bits para as chaves DSA e RSA, respectivamente, para `create_asymmetric_priv_key()`, e um comprimento máximo de chave de 10.000 bits para `create_dh_parameters()`. Se esses valores máximos forem muito altos, três variáveis de ambiente estão disponíveis a partir do MySQL 5.7.17 para permitir que os administradores do servidor MySQL definam comprimentos máximos mais baixos para a geração de chaves, e, assim, limitem o uso da CPU:

* `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Comprimento máximo da chave DSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1.024 e 10.000.

* `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Comprimento máximo da chave RSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1.024 e 16.384.

* `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Comprimento máximo da chave em bits para `create_dh_parameters()`. Os valores mínimo e máximo para esta variável são 1.024 e 10.000.

Para usar qualquer uma dessas variáveis de ambiente, configure-as no ambiente do processo que inicia o servidor. Se configuradas, seus valores têm precedência sobre os comprimentos de chave máximos impostos pelo OpenSSL. Por exemplo, para definir um comprimento de chave máximo de 4.096 bits para chaves DSA e RSA para `create_asymmetric_priv_key()`, configure essas variáveis:

```sql
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

O exemplo usa a sintaxe do Bourne shell. A sintaxe para outras caixas pode ser diferente.

### 6.6.3 Referência à função de criptografia empresarial do MySQL

**Tabela 6.36 Funções de criptografia empresarial do MySQL**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Encryption functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name*</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>asymmetric_decrypt()</code></td> <td>Descifre o texto cifrado usando uma chave privada ou pública</td> </tr><tr><td><code>asymmetric_derive()</code></td> <td>Derivar chave simétrica a partir de chaves assimétricas</td> </tr><tr><td><code>asymmetric_encrypt()</code></td> <td>Criptografar texto em claro usando chave privada ou pública</td> </tr><tr><td><code>asymmetric_sign()</code></td> <td>Gerar assinatura a partir do digest</td> </tr><tr><td><code>asymmetric_verify()</code></td> <td>Verifique se a assinatura corresponde ao digest</td> </tr><tr><td><code>create_asymmetric_priv_key()</code></td> <td>Crie a chave privada</td> </tr><tr><td><code>create_asymmetric_pub_key()</code></td> <td>Crie a chave pública</td> </tr><tr><td><code>create_dh_parameters()</code></td> <td>Gerar segredo de DH compartilhado</td> </tr><tr><td><code>create_digest()</code></td> <td>Gerar digestão a partir de uma string</td> </tr></tbody></table>

### 6.6.4 Descrição das funções de criptografia do MySQL Enterprise

As funções de criptografia do MySQL Enterprise têm essas características gerais:

* Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

* Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, uma chave tiver comprimento muito curto ou longo, ou uma string esperada ser uma string de chave em formato PEM não for uma chave válida. (O OpenSSL impõe seus próprios limites de comprimento de chave, e os administradores do servidor podem impor limites adicionais ao comprimento máximo da chave, definindo variáveis de ambiente. Veja a Seção 6.6.2, “Uso e Exemplos de Encriptação Empresarial do MySQL”.)

* A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

Várias das funções aceitam um argumento de algoritmo de criptografia. O quadro a seguir resume os algoritmos suportados por função.

**Tabela 6.37 Algoritmos suportados por função**

<table summary="Supported encryption algorithms by function."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Function</th> <th>Supported Algorithms</th> </tr></thead><tbody><tr> <td><code>asymmetric_decrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_derive()</code></td> <td>DH</td> </tr><tr> <td><code>asymmetric_encrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_sign()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>asymmetric_verify()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>create_asymmetric_priv_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_asymmetric_pub_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_dh_parameters()</code></td> <td>DH</td> </tr></tbody></table>

Nota

Embora você possa criar chaves usando qualquer um dos algoritmos de criptografia RSA, DSA ou DH, outras funções que aceitam argumentos de chave podem aceitar apenas certos tipos de chaves. Por exemplo, `asymmetric_encrypt()` e `asymmetric_decrypt()` aceitam apenas chaves RSA.

As descrições a seguir descrevem as sequências de chamada para as funções de criptografia do MySQL Enterprise. Para exemplos adicionais e discussão, consulte a Seção 6.6.2, “Uso e Exemplos de Criptografia do MySQL Enterprise”.

* `asymmetric_decrypt(algorithm, crypt_str, key_str)`

Descodifica uma cadeia criptografada usando o algoritmo e a cadeia de chave fornecidos, e retorna a cadeia de texto descodificada como uma cadeia binária. Se a descriptografia falhar, o resultado é `NULL`.

*`key_str`* deve ser uma string de chave válida no formato PEM. Para a descriptografia bem-sucedida, ela deve ser a string de chave pública ou privada correspondente à string de chave pública ou privada usada com *`asymmetric_encrypt()`* para produzir a string criptografada. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

Valores suportados *`algorithm`*: `'RSA'`

Para um exemplo de uso, veja a descrição de `asymmetric_encrypt()`.

* `asymmetric_derive(pub_key_str, priv_key_str)`

Desenha uma chave simétrica usando a chave privada de uma das partes e a chave pública da outra, e retorna a chave resultante como uma string binária. Se a derivação da chave falhar, o resultado é `NULL`.

*`pub_key_str`* e *`priv_key_str`* devem ser cadeias de caracteres chave válidas no formato PEM. Elas devem ser criadas usando o algoritmo DH.

Suponha que você tenha dois pares de chaves públicas e privadas:

  ```sql
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

Suponha que você use a chave privada de um par e a chave pública do outro par para criar uma cadeia de chave simétrica. Então, essa relação de identidade de chave simétrica é válida:

  ```sql
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

* `asymmetric_encrypt(algorithm, str, key_str)`

Encripta uma string usando o algoritmo e a string de chave fornecidos, e retorna o texto cifrado resultante como uma string binária. Se a encriptação falhar, o resultado é `NULL`.

O comprimento do *`str`* não pode ser maior que o comprimento do *`key_str`* menos 11, em bytes

*`key_str`* deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia utilizado para criar a chave.

Valores suportados *`algorithm`*: `'RSA'`

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

* `asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`

Assina uma string de digest usando uma string de chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

*`digest_str`* é a string de digestão. Pode ser gerada chamando `create_digest()`. *`digest_type`* indica o algoritmo de digestão usado para gerar a string de digestão.

*`priv_key_str`* é a string da chave privada a ser usada para assinar a string de digest. Ela deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia usado para criar a chave.

Valores suportados *`algorithm`*: `'RSA'`, `'DSA'`

Valores suportados *`digest_type`*: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

Para um exemplo de uso, veja a descrição de `asymmetric_verify()`.

* `asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`

Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou

*`digest_str`* é a string de digestão. Pode ser gerada chamando `create_digest()`. *`digest_type`* indica o algoritmo de digestão usado para gerar a string de digestão.

*`sig_str`* é a string de assinatura. Pode ser gerada chamando `asymmetric_sign()`.

*`pub_key_str`* é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura e deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia utilizado para criar a chave.

Valores suportados *`algorithm`*: `'RSA'`, `'DSA'`

Valores suportados *`digest_type`*: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

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

* `create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`

Cria uma chave privada usando o algoritmo e o comprimento de chave ou segredo DH fornecidos, e retorna a chave como uma string binária no formato PEM. Se a geração da chave falhar, o resultado é `NULL`.

Valores suportados *`algorithm`*: `'RSA'`, `'DSA'`, `'DH'`

Valores suportados *`key_len`*: O comprimento mínimo da chave em bits é de 1.024. O comprimento máximo da chave depende do algoritmo: 16.384 para RSA e 10.000 para DSA. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais sobre o comprimento máximo da chave, definindo variáveis de ambiente. Veja a Seção 6.6.2, “Uso e Exemplos de Encriptação Empresarial do MySQL”.

Para chaves DH, passe um segredo compartilhado DH em vez de um comprimento de chave. Para criar o segredo, passe o comprimento da chave para `create_dh_parameters()`.

Este exemplo cria uma chave privada DSA de 2.048 bits, e depois deriva uma chave pública a partir da chave privada:

  ```sql
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

Para um exemplo que mostra a geração de chaves DH, veja a descrição de `asymmetric_derive()`.

Algumas considerações gerais na escolha de comprimentos de chave e algoritmos de criptografia:

+ A força da criptografia para chaves privadas e públicas aumenta com o tamanho da chave, mas o tempo para geração da chave também aumenta.

+ A geração de chaves DH leva muito mais tempo do que as chaves RSA ou RSA.

As funções de criptografia assimétricas são mais lentas do que as funções simétricas. Se o desempenho é um fator importante e as funções devem ser usadas com frequência, é melhor usar criptografia simétrica. Por exemplo, considere usar `AES_ENCRYPT()` e `AES_DECRYPT()`.

* `create_asymmetric_pub_key(algorithm, priv_key_str)`

Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. Se a derivação da chave falhar, o resultado é `NULL`.

*`priv_key_str`* deve ser uma string de chave válida no formato PEM. *`algorithm`* indica o algoritmo de criptografia utilizado para criar a chave.

Valores suportados *`algorithm`*: `'RSA'`, `'DSA'`, `'DH'`

Para um exemplo de uso, veja a descrição de `create_asymmetric_priv_key()`.

* `create_dh_parameters(key_len)`

Cria um segredo compartilhado para gerar um par de chaves privadas/públicas DH e retorna uma string binária que pode ser passada para `create_asymmetric_priv_key()`. Se a geração do segredo falhar, o resultado é nulo.

Valores suportados *`key_len`*: Os comprimentos de chave mínima e máxima em bits são 1.024 e 10.000. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais sobre o comprimento máximo de chave, definindo variáveis de ambiente. Veja a Seção 6.6.2, “Uso e Exemplos de Encriptação Empresarial do MySQL”.

Para um exemplo que mostra como usar o valor de retorno para gerar chaves simétricas, veja a descrição de `asymmetric_derive()`.

  ```sql
  SET @dhp = create_dh_parameters(1024);
  ```

* `create_digest(digest_type, str)`

Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração de digest falhar, o resultado é `NULL`.

Valores suportados *`digest_type`*: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  SET @dig = create_digest('SHA512', The quick brown fox');
  ```

A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`.