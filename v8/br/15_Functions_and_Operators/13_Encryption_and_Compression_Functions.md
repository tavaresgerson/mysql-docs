## 14.13 Funções de Criptografia e Compressão

**Tabela 14.18 Funções de Criptografia**

<table summary="Uma referência que lista as funções de criptografia."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[PH_HTML_CODE_<code>UNCOMPRESS()</code>]</td> <td>Descifre usando AES</td> </tr><tr><td>[[PH_HTML_CODE_<code>UNCOMPRESS()</code>]</td> <td>Criptografar usando AES</td> </tr><tr><td>[[PH_HTML_CODE_<code>VALIDATE_PASSWORD_STRENGTH()</code>]</td> <td>Retorne o resultado como uma string binária</td> </tr><tr><td>[[<code>MD5()</code>]]</td> <td>Calcular o checksum MD5</td> </tr><tr><td>[[<code>RANDOM_BYTES()</code>]]</td> <td>Retorne um vetor de bytes aleatório</td> </tr><tr><td>[[<code>SHA1()</code>]], [[<code>SHA()</code>]]</td> <td>Calcule um checksum de 160 bits SHA-1</td> </tr><tr><td>[[<code>SHA2()</code>]]</td> <td>Calcule um checksum SHA-2</td> </tr><tr><td>[[<code>STATEMENT_DIGEST()</code>]]</td> <td>Calcule o valor de hash do digest do relatório</td> </tr><tr><td>[[<code>STATEMENT_DIGEST_TEXT()</code>]]</td> <td>Calcular o resumo normalizado da declaração</td> </tr><tr><td>[[<code>UNCOMPRESS()</code>]]</td> <td>Descompactar uma string compactada</td> </tr><tr><td>[[<code>AES_ENCRYPT()</code><code>UNCOMPRESS()</code>]</td> <td>Retorne o comprimento de uma string antes da compressão</td> </tr><tr><td>[[<code>VALIDATE_PASSWORD_STRENGTH()</code>]]</td> <td>Determine a força da senha</td> </tr></tbody></table>

Muitas funções de criptografia e compressão retornam strings nos quais o resultado pode conter valores de byte arbitrários. Se você deseja armazenar esses resultados, use uma coluna com um tipo de dados de string binária `VARBINARY` ou `BLOB`. Isso evita problemas potenciais com a remoção de espaços finais ou conversão de conjuntos de caracteres que alterariam os valores dos dados, como pode ocorrer se você usar um tipo de dados de string não binário (`CHAR`, `VARCHAR`, `TEXT`).

Algumas funções de criptografia retornam cadeias de caracteres ASCII: `MD5()`, `SHA()`, `SHA1()`, `SHA2()`, `STATEMENT_DIGEST()`, `STATEMENT_DIGEST_TEXT()`. Seu valor de retorno é uma cadeia de caracteres que tem um conjunto de caracteres e uma ordenação determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Esta é uma cadeia de caracteres não binária, a menos que o conjunto de caracteres seja `binary`.

Se um aplicativo armazenar valores de uma função como `MD5()` ou `SHA1()` que retorna uma string de dígitos hexadecimais, uma armazenagem e comparação mais eficientes podem ser obtidas convertendo a representação hexadecimais para binário usando `UNHEX()` e armazenando o resultado em uma coluna `BINARY(N)`. Cada par de dígitos hexadecimais requer um byte na forma binária, então o valor de `N` depende da extensão da string hex. `N` é 16 para um valor de `MD5()` e 20 para um valor de `SHA1()`. Para `SHA2()`, `N` varia de 28 a 32, dependendo do argumento que especifica o comprimento de bits desejado do resultado.

A penalidade de tamanho para armazenar a string hexadecimal em uma coluna `CHAR` é de pelo menos duas vezes, até oito vezes, se o valor for armazenado em uma coluna que usa o conjunto de caracteres `utf8mb4` (onde cada caractere usa 4 bytes). A armazenagem da string também resulta em comparações mais lentas devido aos valores maiores e à necessidade de levar em consideração as regras de ordenação do conjunto de caracteres.

Suponha que um aplicativo armazene valores de cadeia de caracteres `MD5()` em uma coluna `CHAR(32)`:

```
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

Para converter cadeias hexadecimais para uma forma mais compacta, modifique o aplicativo para usar `UNHEX()` e `BINARY(16)` conforme a seguir:

```
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

As aplicações devem estar preparadas para lidar com o caso muito raro de uma função de hashing produzir o mesmo valor para dois valores de entrada diferentes. Uma maneira de detectar colisões é tornar a coluna de hash uma chave primária.

Nota

Os ataques aos algoritmos MD5 e SHA-1 já são conhecidos. Você pode considerar o uso de outra função de criptografia unidirecional descrita nesta seção, como `SHA2()`.

Cuidado

As senhas ou outros valores sensíveis fornecidos como argumentos para funções de criptografia são enviados em texto claro para o servidor MySQL, a menos que uma conexão SSL seja usada. Além disso, esses valores aparecem em quaisquer logs do MySQL aos quais são escritos. Para evitar esse tipo de exposição, as aplicações podem criptografar valores sensíveis no lado do cliente antes de enviá-los para o servidor. As mesmas considerações se aplicam às chaves de criptografia. Para evitar expor esses valores, as aplicações podem usar procedimentos armazenados para criptografar e descriptografar valores no lado do servidor.

- `AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

  Essa função decripta os dados usando o algoritmo oficial AES (Padrão de Criptografia Avançada). Para mais informações, consulte a descrição de `AES_ENCRYPT()`.

  As declarações que utilizam `AES_DECRYPT()` não são seguras para a replicação baseada em declarações.

- `AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

  `AES_ENCRYPT()` e `AES_DECRYPT()` implementam criptografia e descriptografia de dados usando o algoritmo oficial AES (Padrão de Criptografia Avançada), anteriormente conhecido como “Rijndael”. O padrão AES permite várias comprimentos de chave. Por padrão, essas funções implementam AES com um comprimento de chave de 128 bits. Os comprimentos de chave de 196 ou 256 bits podem ser usados, conforme descrito mais adiante. O comprimento da chave é um compromisso entre desempenho e segurança.

  `AES_ENCRYPT()` criptografa a string `str` usando a string de chave `key_str`, e retorna uma string binária contendo a saída criptografada. `AES_DECRYPT()` descriptografa a string criptografada `crypt_str` usando a string de chave `key_str`, e retorna a string original (binária) no formato hexadecimal. (Para obter a string em texto simples, converta o resultado para `CHAR`. Alternativamente, inicie o cliente **mysql** com `--skip-binary-as-hex` para fazer com que todos os valores binários sejam exibidos como texto.) Se qualquer argumento da função for `NULL`, a função retorna `NULL`. Se `AES_DECRYPT()` detectar dados inválidos ou alinhamento incorreto, ele retorna `NULL`. No entanto, é possível que `AES_DECRYPT()` retorne um valor não `NULL` (possível lixo) se os dados de entrada ou a chave forem inválidos.

  A partir do MySQL 8.0.30, essas funções suportam o uso de uma função de derivação de chave (KDF) para criar uma chave secreta criptograficamente forte a partir das informações passadas em `key_str`. A chave derivada é usada para criptografar e descriptografar os dados e permanece na instância do MySQL Server e não é acessível aos usuários. Usar uma KDF é altamente recomendado, pois oferece uma melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples ao usar a função. As funções suportam o HKDF (disponível a partir do OpenSSL 1.1.0), para o qual você pode especificar um sal opcional e informações específicas do contexto para incluir no material de chaveamento, e o PBKDF2 (disponível a partir do OpenSSL 1.0.2), para o qual você pode especificar um sal opcional e definir o número de iterações usadas para produzir a chave.

  Os `AES_ENCRYPT()` e `AES_DECRYPT()` permitem o controle do modo de criptografia de bloco. A variável de sistema `block_encryption_mode` controla o modo para algoritmos de criptografia baseados em blocos. Seu valor padrão é `aes-128-ecb`, que indica a criptografia usando uma chave de 128 bits e o modo ECB. Para uma descrição dos valores permitidos dessa variável, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”. O argumento opcional `init_vector` é usado para fornecer um vetor de inicialização para modos de criptografia de bloco que o exigem.

  As declarações que utilizam `AES_ENCRYPT()` ou `AES_DECRYPT()` não são seguras para a replicação baseada em declarações.

  Se `AES_ENCRYPT()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

  Os argumentos das funções `AES_ENCRYPT()` e `AES_DECRYPT()` são os seguintes:

  `str`: A string para `AES_ENCRYPT()` para criptografia usando a string de chave `key_str`, ou (a partir do MySQL 8.0.30) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O alinhamento é adicionado automaticamente a `str` para que seja um múltiplo de um bloco, conforme exigido pelos algoritmos baseados em blocos, como o AES. Esse alinhamento é removido automaticamente pela função `AES_DECRYPT()`.

  `crypt_str` :   A string criptografada para `AES_DECRYPT()` para descriptografar usando a string de chave `key_str`, ou (a partir do MySQL 8.0.30) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O comprimento de `crypt_str` pode ser calculado a partir do comprimento da string original usando esta fórmula:

  ````
  ```
  16 * (trunc(string_length / 16) + 1)
  ```
  ````

  `key_str`:   A chave de criptografia ou o material de chave de entrada que é usado como base para derivar uma chave usando uma função de derivação de chave (KDF). Para a mesma instância de dados, use o mesmo valor de `key_str` para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

  ````
  If you are using a KDF, which you can from MySQL 8.0.30, *`key_str`* can be any arbitrary information such as a password or passphrase. In the further arguments for the function, you specify the KDF name, then add further options to increase the security as appropriate for the KDF.

  When you use a KDF, the function creates a cryptographically strong secret key from the information passed in *`key_str`* and any salt or additional information that you provide in the other arguments. The derived key is used to encrypt and decrypt the data, and it remains in the MySQL Server instance and is not accessible to users. Using a KDF is highly recommended, as it provides better security than specifying your own premade key or deriving it by a simpler method as you use the function.

  If you are not using a KDF, for a key length of 128 bits, the most secure way to pass a key to the *`key_str`* argument is to create a truly random 128-bit value and pass it as a binary value. For example:

  ```
  INSERT INTO t
  VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
  ```

  A passphrase can be used to generate an AES key by hashing the passphrase. For example:

  ```
  INSERT INTO t
  VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
  ```

  If you exceed the maximum key length of 128 bits, a warning is returned. If you are not using a KDF, do not pass a password or passphrase directly to *`key_str`*, hash it first. Previous versions of this documentation suggested the former approach, but it is no longer recommended as the examples shown here are more secure.
  ````

  `init_vector`: Um vetor de inicialização, para modos de criptografia de bloco que o exijam. A variável de sistema `block_encryption_mode` controla o modo. Para a mesma instância de dados, use o mesmo valor de `init_vector` para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

  ```
  Note

  If you are using a KDF, you must specify an initialization vector or a null string for this argument, in order to access the later arguments to define the KDF.

  For modes that require an initialization vector, it must be 16 bytes or longer (bytes in excess of 16 are ignored). An error occurs if *`init_vector`* is missing. For modes that do not require an initialization vector, it is ignored and a warning is generated if *`init_vector`* is specified, unless you are using a KDF.

  The default value for the `block_encryption_mode` system variable is `aes-128-ecb`, or ECB mode, which does not require an initialization vector. The alternative permitted block encryption modes CBC, CFB1, CFB8, CFB128, and OFB all require an initialization vector.

  A random string of bytes to use for the initialization vector can be produced by calling `RANDOM_BYTES(16)`.
  ```

  `kdf_name`:   O nome da função de derivação de chave (KDF) para criar uma chave a partir do material de chaveamento de entrada passado em `key_str`, e outros argumentos conforme apropriado para a KDF. Este argumento opcional está disponível a partir do MySQL 8.0.30.

  ````
  For the same instance of data, use the same value of *`kdf_name`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`. When you specify *`kdf_name`*, you must specify *`init_vector`*, using either a valid initialization vector, or a null string if the encryption mode does not require an initialization vector.

  The following values are supported:

  `hkdf` :   HKDF, which is available from OpenSSL 1.1.0. HKDF extracts a pseudorandom key from the keying material then expands it into additional keys. With HKDF, you can specify an optional salt (*`salt`*) and context-specific information such as application details (*`info`*) to include in the keying material.

  `pbkdf2_hmac` :   PBKDF2, which is available from OpenSSL 1.0.2. PBKDF2 applies a pseudorandom function to the keying material, and repeats this process a large number of times to produce the key. With PBKDF2, you can specify an optional salt (*`salt`*) to include in the keying material, and set the number of iterations used to produce the key (*`iterations`*).

  In this example, HKDF is specified as the key derivation function, and a salt and context information are provided. The argument for the initialization vector is included but is the empty string:

  ```
  SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
  ```

  In this example, PBKDF2 is specified as the key derivation function, a salt is provided, and the number of iterations is doubled from the recommended minimum:

  ```
  SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
  ```
  ````

  `salt` : Um sal a ser passado para a função de derivação de chaves (KDF). Este argumento opcional está disponível a partir do MySQL 8.0.30. Tanto o HKDF quanto o PBKDF2 podem usar sal, e seu uso é recomendado para ajudar a prevenir ataques baseados em dicionários de senhas comuns ou tabelas de arco-íris.

  ````
  A salt consists of random data, which for security must be different for each encryption operation. A random string of bytes to use for the salt can be produced by calling `RANDOM_BYTES()`. This example produces a 64-bit salt:

  ```
  SET @salt = RANDOM_BYTES(8);
  ```

  For the same instance of data, use the same value of *`salt`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`. The salt can safely be stored along with the encrypted data.
  ````

  `info` :   Informações específicas do contexto para o HKDF para incluir no material de chaveamento, como informações sobre o aplicativo. Este argumento opcional está disponível a partir do MySQL 8.0.30 quando você especifica `hkdf` como o nome do KDF. O HKDF adiciona essas informações ao material de chaveamento especificado em `key_str` e ao sal especificado em `salt` para produzir a chave.

  ```
  For the same instance of data, use the same value of *`info`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.
  ```

  `iterations` :   O número de iterações para o PBKDF2 a ser usado na geração da chave. Este argumento opcional está disponível a partir do MySQL 8.0.30 quando você especifica `pbkdf2_hmac` como o nome do KDF. Um número maior de iterações oferece maior resistência a ataques de força bruta, pois o atacante tem um custo computacional maior, mas isso é necessariamente verdadeiro para o processo de derivação da chave. O valor padrão, se você não especificar este argumento, é 1000, que é o valor mínimo recomendado pelo padrão OpenSSL.

  ```
  For the same instance of data, use the same value of *`iterations`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.
  ```

  ```
  mysql> SET block_encryption_mode = 'aes-256-cbc';
  mysql> SET @key_str = SHA2('My secret passphrase',512);
  mysql> SET @init_vector = RANDOM_BYTES(16);
  mysql> SET @crypt_str = AES_ENCRYPT('text',@key_str,@init_vector);
  mysql> SELECT CAST(AES_DECRYPT(@crypt_str,@key_str,@init_vector) AS CHAR);
  +-------------------------------------------------------------+
  | CAST(AES_DECRYPT(@crypt_str,@key_str,@init_vector) AS CHAR) |
  +-------------------------------------------------------------+
  | text                                                        |
  +-------------------------------------------------------------+
  ```

- `COMPRESS(string_to_compress)`

  Compreende uma cadeia de caracteres e retorna o resultado como uma cadeia de caracteres binária. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`. O valor de retorno também é `NULL` se `string_to_compress` for `NULL`. A cadeia de caracteres comprimida pode ser descomprimida com `UNCOMPRESS()`.

  ```
  mysql> SELECT LENGTH(COMPRESS(REPEAT('a',1000)));
          -> 21
  mysql> SELECT LENGTH(COMPRESS(''));
          -> 0
  mysql> SELECT LENGTH(COMPRESS('a'));
          -> 13
  mysql> SELECT LENGTH(COMPRESS(REPEAT('a',16)));
          -> 15
  ```

  O conteúdo comprimido da string é armazenado da seguinte maneira:

  - Cadeias vazias são armazenadas como cadeias vazias.
  - As cadeias não vazias são armazenadas como um comprimento de 4 bytes da cadeia não comprimida (baixo byte primeiro), seguido pela cadeia comprimida. Se a cadeia terminar com um espaço, um caractere extra `.` é adicionado para evitar problemas com o corte de espaço final, caso o resultado seja armazenado em uma coluna `CHAR` ou `VARCHAR`. (No entanto, o uso de tipos de dados de cadeia não binários, como `CHAR` ou `VARCHAR`, para armazenar cadeias comprimidas não é recomendado de qualquer forma, pois pode ocorrer conversão de conjunto de caracteres. Use uma coluna de cadeia binária `VARBINARY` ou `BLOB`.)

  Se `COMPRESS()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `MD5(str)`

  Calcula um checksum MD5 de 128 bits para a string. O valor é retornado como uma string de 32 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. O valor de retorno pode, por exemplo, ser usado como uma chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

  O valor de retorno é uma string no conjunto de caracteres de conexão.

  Se o modo FIPS estiver ativado, `MD5()` retorna `NULL`. Veja a Seção 8.8, “Suporte FIPS”.

  ```
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

  Este é o "Algoritmo de Digestas de Mensagens MD5 da RSA Data Security, Inc."

  Veja a nota sobre o algoritmo MD5 no início desta seção.

- `RANDOM_BYTES(len)`

  Essa função retorna uma string binária de `len` bytes aleatórios gerados usando o gerador de números aleatórios da biblioteca SSL. Os valores permitidos de `len` variam de 1 a 1024. Para valores fora desse intervalo, ocorre um erro. Retorna `NULL` se `len` for `NULL`.

  O `RANDOM_BYTES()` pode ser usado para fornecer o vetor de inicialização para as funções `AES_DECRYPT()` e `AES_ENCRYPT()`. Para uso nesse contexto, `len` deve ser de pelo menos 16. Valores maiores são permitidos, mas os bytes que excedam 16 são ignorados.

  `RANDOM_BYTES()` gera um valor aleatório, o que torna seu resultado não determinístico. Consequentemente, as declarações que utilizam essa função não são seguras para a replicação baseada em declarações.

  Se `RANDOM_BYTES()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `SHA1(str)`, `SHA(str)`

  Calcula um checksum de 160 bits SHA-1 para a string, conforme descrito no RFC 3174 (Algoritmo de Hash Seguro). O valor é retornado como uma string de 40 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. Um dos usos possíveis para essa função é como chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente. `SHA()` é sinônimo de `SHA1()`.

  O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

  O `SHA1()` pode ser considerado um equivalente criptograficamente mais seguro do `MD5()`. No entanto, consulte a nota sobre os algoritmos MD5 e SHA-1 no início desta seção.

- `SHA2(str, hash_length)`

  Calcula a família de funções de hash SHA-2 (SHA-224, SHA-256, SHA-384 e SHA-512). O primeiro argumento é a string em texto plano a ser hash. O segundo argumento indica o comprimento de bits desejado do resultado, que deve ter um valor de 224, 256, 384, 512 ou 0 (que é equivalente a 256). Se qualquer um dos argumentos for `NULL` ou o comprimento do hash não for um dos valores permitidos, o valor de retorno é `NULL`. Caso contrário, o resultado da função é um valor de hash contendo o número desejado de bits. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

  O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  Essa função só funciona se o MySQL tiver sido configurado com suporte SSL. Consulte a Seção 8.3, “Usando Conexões Encriptadas”.

  O `SHA2()` pode ser considerado criptograficamente mais seguro do que o `MD5()` ou o `SHA1()`.

- `STATEMENT_DIGEST(statement)`

  Dado uma instrução SQL como uma string, retorna o valor do hash do digest da instrução como uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. A função relacionada `STATEMENT_DIGEST_TEXT()` retorna o digest normalizado da instrução. Para informações sobre digest de instruções, consulte a Seção 29.10, “Digestas e Amostragem de Instruções do Schema de Desempenho”.

  Ambas as funções usam o analisador MySQL para analisar a instrução. Se a análise falhar, ocorre um erro. A mensagem de erro inclui o erro de análise apenas se a instrução for fornecida como uma string literal.

  A variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis para essas funções para calcular os resumos normalizados das declarações.

  ```
  mysql> SET @stmt = 'SELECT * FROM mytable WHERE cola = 10 AND colb = 20';
  mysql> SELECT STATEMENT_DIGEST(@stmt);
  +------------------------------------------------------------------+
  | STATEMENT_DIGEST(@stmt)                                          |
  +------------------------------------------------------------------+
  | 3bb95eeade896657c4526e74ff2a2862039d0a0fe8a9e7155b5fe492cbd78387 |
  +------------------------------------------------------------------+
  mysql> SELECT STATEMENT_DIGEST_TEXT(@stmt);
  +----------------------------------------------------------+
  | STATEMENT_DIGEST_TEXT(@stmt)                             |
  +----------------------------------------------------------+
  | SELECT * FROM `mytable` WHERE `cola` = ? AND `colb` = ?  |
  +----------------------------------------------------------+
  ```

- `STATEMENT_DIGEST_TEXT(statement)`

  Dado uma instrução SQL como uma string, retorna o resumo normalizado da instrução como uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. Para discussões e exemplos adicionais, consulte a descrição da função relacionada `STATEMENT_DIGEST()`.

- `UNCOMPRESS(string_to_uncompress)`

  Descomprime uma string comprimida pela função `COMPRESS()`. Se o argumento não for um valor comprimido, o resultado é `NULL`; se `string_to_uncompress` for `NULL`, o resultado também é `NULL`. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`.

  ```
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

- `UNCOMPRESSED_LENGTH(compressed_string)`

  Retorna o comprimento que a string comprimida tinha antes de ser comprimida. Retorna `NULL` se `compressed_string` for `NULL`.

  ```
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

- `VALIDATE_PASSWORD_STRENGTH(str)`

  Dado um argumento que representa uma senha em texto simples, essa função retorna um inteiro para indicar quão forte a senha é, ou `NULL` se o argumento for `NULL`. O valor de retorno varia de 0 (fraco) a 100 (forte).

  A avaliação da senha pelo `VALIDATE_PASSWORD_STRENGTH()` é feita pelo componente `validate_password`. Se esse componente não estiver instalado, a função sempre retornará

  0. Para obter informações sobre a instalação do `validate_password`, consulte a Seção 8.4.3, “O Componente de Validação de Senhas”. Para examinar ou configurar os parâmetros que afetam o teste de senhas, verifique ou defina as variáveis do sistema implementadas pelo `validate_password`. Consulte a Seção 8.4.3.2, “Opções e Variáveis de Validação de Senhas”.

  A senha está sujeita a testes cada vez mais rigorosos e o valor de retorno reflete quais testes foram atendidos, conforme mostrado na tabela a seguir. Além disso, se a variável de sistema `validate_password.check_user_name` estiver habilitada e a senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retornará 0, independentemente de como as outras variáveis de sistema `validate_password` estejam configuradas.

  <table summary="Testes de senha da função VALIDATE_PASSWORD_STRENGTH() e os valores retornados por cada teste de senha."><thead><tr> <th>Teste de senha</th> <th>Valor de retorno</th> </tr></thead><tbody><tr> <td>Comprimento < 4</td> <td>0</td> </tr><tr> <td>Comprimento ≥ 4 e &lt; [[<code>validate_password.length</code>]]</td> <td>25</td> </tr><tr> <td>Cumpre a política 1 ([[<code>LOW</code>]])</td> <td>50</td> </tr><tr> <td>Cumpre a política 2 ([[<code>MEDIUM</code>]])</td> <td>75</td> </tr><tr> <td>Cumpre a política 3 ([[<code>STRONG</code>]])</td> <td>100</td> </tr></tbody></table>
