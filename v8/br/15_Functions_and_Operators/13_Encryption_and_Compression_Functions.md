## 14.13 Funções de Criptografia e Compressão

**Tabela 14.18 Funções de criptografia**

<table frame="box" rules="all" summary="A reference that lists encryption functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>AES_DECRYPT()</code></td> <td>Descifre usando AES</td> </tr><tr><td><code>AES_ENCRYPT()</code></td> <td>Criptografar usando AES</td> </tr><tr><td><code>COMPRESS()</code></td> <td>Retorne o resultado como uma string binária</td> </tr><tr><td><code>MD5()</code></td> <td>Calcular o checksum MD5</td> </tr><tr><td><code>RANDOM_BYTES()</code></td> <td>Retorne um vetor de bytes aleatório</td> </tr><tr><td><code>SHA1()</code>, <code>SHA()</code></td> <td>Calcular um checksum de 160 bits SHA-1</td> </tr><tr><td><code>SHA2()</code></td> <td>Calcular um checksum SHA-2</td> </tr><tr><td><code>STATEMENT_DIGEST()</code></td> <td>Calcular o valor do hash do digest do relatório</td> </tr><tr><td><code>STATEMENT_DIGEST_TEXT()</code></td> <td>Calcular o digestório de declaração normalizado</td> </tr><tr><td><code>UNCOMPRESS()</code></td> <td>Descomprima uma string comprimida</td> </tr><tr><td><code>UNCOMPRESSED_LENGTH()</code></td> <td>Retorne o comprimento de uma string antes da compressão</td> </tr><tr><td><code>VALIDATE_PASSWORD_STRENGTH()</code></td> <td>Determine a força da senha</td> </tr></tbody></table>

Muitas funções de criptografia e compressão retornam strings para as quais o resultado pode conter valores arbitrários de bytes. Se você deseja armazenar esses resultados, use uma coluna com um tipo de dados de string binária `VARBINARY` ou `BLOB`. Isso evita problemas potenciais com remoção de espaço final ou conversão de conjunto de caracteres que mudariam os valores dos dados, como pode ocorrer se você usar um tipo de dados de string não binário (`CHAR`, `VARCHAR`, `TEXT`).

Algumas funções de criptografia retornam cadeias de caracteres ASCII: `MD5()`, `SHA()`, `SHA1()`, `SHA2()`, `STATEMENT_DIGEST()`, `STATEMENT_DIGEST_TEXT()`. Seu valor de retorno é uma cadeia de caracteres que tem um conjunto de caracteres e uma ordenação determinados pelos `character_set_connection` e `collation_connection` variáveis do sistema. Esta é uma cadeia não binária, a menos que o conjunto de caracteres seja `binary`.

Se um aplicativo armazenar valores de uma função como `MD5()` ou `SHA1()` que retorna uma string de dígitos hexadecimais, pode-se obter armazenamento e comparações mais eficientes convertendo a representação hexadecimais para binário usando `UNHEX()` e armazenando o resultado em uma coluna de `BINARY(N)`. Cada par de dígitos hexadecimais requer um byte em forma binária, então o valor de *`N`* depende do comprimento da string hexadecimais. *`N`* é 16 para um valor de `MD5()` e 20 para um valor de `SHA1()`. Para `SHA2()`, *`N`* varia de 28 a 32, dependendo do argumento que especifica o comprimento de bit desejado do resultado.

A penalidade de tamanho para armazenar a string hexadecimal em uma coluna `CHAR` é de pelo menos duas vezes, até oito vezes, se o valor for armazenado em uma coluna que usa o conjunto de caracteres `utf8mb4` (onde cada caractere usa 4 bytes). Armazenar a string também resulta em comparações mais lentas devido aos valores maiores e à necessidade de levar em conta as regras de ordenação do conjunto de caracteres.

Suponha que uma aplicação armazene valores de cadeia `MD5()` em uma coluna `CHAR(32)`:

```
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

Para converter cadeias hex em uma forma mais compacta, modifique o aplicativo para usar `UNHEX()` e `BINARY(16)` conforme a seguir:

```
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

As aplicações devem estar preparadas para lidar com o caso muito raro de uma função de hashing produzir o mesmo valor para dois valores de entrada diferentes. Uma maneira de tornar os conflitos detectáveis é tornar a coluna de hash uma chave primária.

Nota

Os ataques aos algoritmos MD5 e SHA-1 se tornaram conhecidos. Você pode considerar o uso de outra função de criptografia unidirecional descrita nesta seção, como `SHA2()`.

Cuidado

As senhas ou outros valores sensíveis fornecidos como argumentos para funções de criptografia são enviados como texto claro para o servidor MySQL, a menos que uma conexão SSL seja usada. Além disso, esses valores aparecem em quaisquer registros do MySQL para os quais são escritos. Para evitar esse tipo de exposição, as aplicações podem criptografar valores sensíveis no lado do cliente antes de enviá-los para o servidor. As mesmas considerações se aplicam às chaves de criptografia. Para evitar expor esses valores, as aplicações podem usar procedimentos armazenados para criptografar e descriptografar valores no lado do servidor.

* `AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`](encryption-functions.html#function_aes-decrypt)

Essa função descriptografa dados usando o algoritmo oficial AES (Padrão Avançado de Criptografia). Para mais informações, consulte a descrição de `AES_ENCRYPT()`.

As declarações que utilizam `AES_DECRYPT()` não são seguras para replicação baseada em declarações.

* `AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`(encryption-functions.html#function_aes-encrypt)

`AES_ENCRYPT()` e `AES_DECRYPT()` implementam criptografia e descriptografia de dados usando o algoritmo oficial AES (Padrão Avançado de Criptografia), anteriormente conhecido como “Rijndael”. O padrão AES permite várias comprimentos de chave. Por padrão, essas funções implementam AES com um comprimento de chave de 128 bits. Os comprimentos de chave de 196 ou 256 bits podem ser usados, conforme descrito mais adiante. O comprimento da chave é um compromisso entre desempenho e segurança.

`AES_ENCRYPT()` criptografa a string *`str`* usando a string de chave *`key_str`*, e retorna uma string binária contendo a saída criptografada. `AES_DECRYPT()` descriptografa a string criptografada *`crypt_str`* usando a string de chave *`key_str`*, e retorna a string original (binária) em formato hexadecimal. (Para obter a string como texto claro, caste o resultado para `CHAR`. Alternativamente, inicie o cliente **mysql** com `--skip-binary-as-hex` para fazer com que todos os valores binários sejam exibidos como texto.) Se qualquer argumento da função for `NULL`, a função retorna `NULL`. Se `AES_DECRYPT()` detectar dados inválidos ou preenchimento incorreto, ele retorna `NULL`. No entanto, é possível que `AES_DECRYPT()` retorne um valor não `NULL` (possivelmente lixo) se os dados de entrada ou a chave forem inválidos.

A partir do MySQL 8.0.30, essas funções suportam o uso de uma função de derivação de chave (KDF) para criar uma chave secreta criptográficamente forte a partir das informações passadas em *`key_str`*. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples, pois você usa a função. As funções suportam o HKDF (disponível a partir do OpenSSL 1.1.0), para o qual você pode especificar um sal opcional e informações específicas do contexto para incluir no material de chaveamento, e PBKDF2 (disponível a partir do OpenSSL 1.0.2), para o qual você pode especificar um sal opcional e definir o número de iterações usadas para produzir a chave.

`AES_ENCRYPT()` e `AES_DECRYPT()` permitem o controle do modo de criptografia de bloco. A variável de sistema `block_encryption_mode` controla o modo para algoritmos de criptografia baseados em bloco. Seu valor padrão é `aes-128-ecb`, que indica criptografia usando um comprimento de chave de 128 bits e modo ECB. Para uma descrição dos valores permitidos desta variável, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”. O argumento opcional *`init_vector`* é usado para fornecer um vetor de inicialização para modos de criptografia de bloco que o exigem.

As declarações que utilizam `AES_ENCRYPT()` ou `AES_DECRYPT()` não são seguras para replicação baseada em declarações.

Se `AES_ENCRYPT()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

Os argumentos para as funções `AES_ENCRYPT()` e `AES_DECRYPT()` são os seguintes:

*`str`* :   A string para `AES_ENCRYPT()` para encriptar usando a string de chave *`key_str`*, ou (a partir do MySQL 8.0.30) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O preenchimento é adicionado automaticamente a *`str`* para que seja um múltiplo de um bloco conforme exigido por algoritmos baseados em blocos, como o AES. Esse preenchimento é removido automaticamente pela função `AES_DECRYPT()`.

*`crypt_str`* :   A string criptografada para `AES_DECRYPT()` para descriptografar usando a string de chave *`key_str`*, ou (a partir do MySQL 8.0.30) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O comprimento de *`crypt_str`* pode ser calculado a partir do comprimento da string original usando esta fórmula:

      ```
      16 * (trunc(string_length / 16) + 1)
      ```

*`key_str`*:   A chave de criptografia, ou o material de chave de entrada que é usado como base para derivar uma chave usando uma função de derivação de chave (KDF). Para a mesma instância de dados, use o mesmo valor de *`key_str`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

Se você estiver usando um KDF, que você pode fazer a partir do MySQL 8.0.30, *`key_str`* pode ser qualquer informação arbitrária, como uma senha ou frase de senha. Nos argumentos adicionais para a função, você especifica o nome do KDF e, em seguida, adiciona mais opções para aumentar a segurança conforme apropriado para o KDF.

Quando você usa um KDF, a função cria uma chave secreta criptográficamente forte a partir das informações passadas em *`key_str`* e qualquer sal ou informações adicionais que você forneça nos outros argumentos. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples, pois você usa a função.

Se você não estiver usando um KDF, para um comprimento de chave de 128 bits, a maneira mais segura de passar uma chave para o argumento *`key_str`* é criar um valor verdadeiramente aleatório de 128 bits e passá-lo como um valor binário. Por exemplo:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

Uma frase de senha pode ser usada para gerar uma chave AES ao criptografar a frase de senha. Por exemplo:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

Se você exceder o comprimento máximo da chave de 128 bits, um aviso é retornado. Se você não está usando um KDF, não passe uma senha ou frase de senha diretamente para *`key_str`*, faça um hash dela primeiro. Versões anteriores desta documentação sugeriram a primeira abordagem, mas ela não é mais recomendada, pois os exemplos mostrados aqui são mais seguros.

*`init_vector`*: Um vetor de inicialização, para modos de criptografia de bloco que o exijam. A variável de sistema `block_encryption_mode` controla o modo. Para a mesma instância de dados, use o mesmo valor de *`init_vector`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

Nota

Se você estiver usando um KDF, você deve especificar um vetor de inicialização ou uma string nula para este argumento, a fim de acessar os argumentos subsequentes para definir o KDF.

Para os modos que exigem um vetor de inicialização, ele deve ter 16 bytes ou mais (bytes em excesso de 16 são ignorados). Um erro ocorre se *`init_vector`* estiver ausente. Para os modos que não exigem um vetor de inicialização, ele é ignorado e um aviso é gerado se *`init_vector`* for especificado, a menos que você esteja usando um KDF.

O valor padrão da variável de sistema `block_encryption_mode` é `aes-128-ecb`, ou modo ECB, que não requer um vetor de inicialização. Os modos de criptografia de bloco alternativo permitidos CBC, CFB1, CFB8, CFB128 e OFB todos requerem um vetor de inicialização.

Uma cadeia aleatória de bytes para uso no vetor de inicialização pode ser produzida ao chamar `RANDOM_BYTES(16)`.

*`kdf_name`* :   O nome da função de derivação de chave (KDF) para criar uma chave a partir do material de chaveamento de entrada passado em *`key_str`*, e outros argumentos conforme apropriado para o KDF. Este argumento opcional está disponível a partir do MySQL 8.0.30.

Para a mesma instância de dados, use o mesmo valor de *`kdf_name`* para a criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. Quando você especificar *`kdf_name`*, você deve especificar *`init_vector`*, usando um vetor de inicialização válido ou uma string nula se o modo de criptografia não exigir um vetor de inicialização.

Os seguintes valores são suportados:

`hkdf` :   HKDF, que está disponível a partir do OpenSSL 1.1.0. O HKDF extrai uma chave pseudorandom do material de chaveamento e, em seguida, a expande em chaves adicionais. Com o HKDF, você pode especificar um sal opcional (*`salt`*) e informações específicas do contexto, como detalhes da aplicação (*`info`*), para incluir no material de chaveamento.

`pbkdf2_hmac` :   PBKDF2, que está disponível a partir do OpenSSL 1.0.2. O PBKDF2 aplica uma função pseudorandom ao material de chaveamento e repete esse processo um grande número de vezes para produzir a chave. Com o PBKDF2, você pode especificar um sal opcional (*`salt`*) a ser incluído no material de chaveamento e definir o número de iterações usadas para produzir a chave (*`iterations`*).

Neste exemplo, HKDF é especificado como a função de derivação de chave, e um sal e informações de contexto são fornecidos. O argumento para o vetor de inicialização é incluído, mas é a string vazia:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

Neste exemplo, PBKDF2 é especificado como a função de derivação de chave, é fornecido um sal e o número de iterações é dobrado em relação ao mínimo recomendado:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

*`salt`* :   Um sal a ser passado para a função de derivação de chave (KDF). Este argumento opcional está disponível a partir do MySQL 8.0.30. Tanto o HKDF quanto o PBKDF2 podem usar sais, e seu uso é recomendado para ajudar a prevenir ataques baseados em dicionários de senhas comuns ou tabelas arco-íris.

Um sal consiste em dados aleatórios, que, para segurança, devem ser diferentes para cada operação de criptografia. Uma string aleatória de bytes que pode ser usada para o sal pode ser produzida chamando `RANDOM_BYTES()`. Este exemplo produz um sal de 64 bits:

      ```
      SET @salt = RANDOM_BYTES(8);
      ```

Para a mesma instância de dados, use o mesmo valor de *`salt`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. O sal pode ser armazenado com segurança junto com os dados criptografados.

*`info`* :   Informações específicas do contexto para o HKDF para incluir no material de chaveamento, como informações sobre o aplicativo. Este argumento opcional está disponível a partir do MySQL 8.0.30 quando você especifica `hkdf` como o nome do KDF. O HKDF adiciona essas informações ao material de chaveamento especificado em *`key_str`* e ao sal especificado em *`salt`* para produzir a chave.

Para a mesma instância de dados, use o mesmo valor de *`info`* para a criptografia com `AES_ENCRYPT()` e para a descriptografia com `AES_DECRYPT()`.

*`iterations`* :   O número de iterações para PBKDF2 a ser usado na geração da chave. Este argumento opcional está disponível a partir do MySQL 8.0.30 quando você especifica `pbkdf2_hmac` como o nome do KDF. Um número maior oferece maior resistência a ataques brutais, pois tem um custo computacional maior para o atacante, mas o mesmo é necessariamente verdadeiro para o processo de derivação da chave. O padrão predeterminado, se você não especificar este argumento, é 1000, que é o mínimo recomendado pelo padrão OpenSSL.

Para a mesma instância de dados, use o mesmo valor de *`iterations`* para a criptografia com `AES_ENCRYPT()` e para a descriptografia com `AES_DECRYPT()`.

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

* `COMPRESS(string_to_compress)`

Compreende uma cadeia de caracteres e retorna o resultado como uma cadeia binária. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`. O valor de retorno também é `NULL` se *`string_to_compress`* é `NULL`. A cadeia comprimida pode ser descomprimida com `UNCOMPRESS()`.

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

Cadeias vazias são armazenadas como cadeias vazias.  
Cadeias não vazias são armazenadas como uma extensão de 4 bytes da cadeia não comprimida (baixo byte primeiro), seguida pela cadeia comprimida. Se a cadeia terminar com espaço, um caractere extra `.` é adicionado para evitar problemas com o corte de espaço final, caso o resultado seja armazenado em uma coluna `CHAR` ou `VARCHAR`. (No entanto, o uso de tipos de dados de cadeia não binários, como `CHAR` ou `VARCHAR` para armazenar cadeias comprimidas não é recomendado de qualquer forma, pois pode ocorrer conversão de conjunto de caracteres. Use uma coluna de cadeia binária `VARBINARY` ou `BLOB` em vez disso.)

Se `COMPRESS()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `MD5(str)`

Calcula um checksum de 128 bits MD5 para a string. O valor é retornado como uma string de 32 dígitos hexadecimais, ou `NULL` se o argumento foi `NULL`. O valor de retorno pode, por exemplo, ser usado como uma chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

O valor de retorno é uma string no conjunto de caracteres de conexão.

Se o modo FIPS estiver habilitado, `MD5()` retorna `NULL`. Veja a Seção 8.8, “Suporte FIPS”.

  ```
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

Este é o "Algoritmo de Digestas de Mensagem RSA Data Security, Inc."

Veja a nota sobre o algoritmo MD5 no início desta seção.

* `RANDOM_BYTES(len)`

Essa função retorna uma string binária de *`len`* bytes aleatórios gerados usando o gerador de números aleatórios da biblioteca SSL. Os valores permitidos de *`len`* variam de 1 a 1024. Para valores fora desse intervalo, ocorre um erro. Retorna `NULL` se *`len`* é `NULL`.

`RANDOM_BYTES()` pode ser usado para fornecer o vetor de inicialização para as funções `AES_DECRYPT()` e `AES_ENCRYPT()`. Para uso nesse contexto, *`len`* deve ter pelo menos 16. Valores maiores são permitidos, mas os bytes em excesso de 16 são ignorados.

`RANDOM_BYTES()` gera um valor aleatório, o que torna seu resultado não determinístico. Consequentemente, as declarações que utilizam essa função não são seguras para replicação baseada em declarações.

Se `RANDOM_BYTES()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `SHA1(str)`, `SHA(str)`

Calcula um checksum de 160 bits SHA-1 para a string, conforme descrito no RFC 3174 (Algoritmo de Hash Seguro). O valor é retornado como uma string de 40 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. Um dos usos possíveis para essa função é como chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente. `SHA()` é sinônimo de `SHA1()`.

O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

`SHA1()` pode ser considerado um equivalente criptográficamente mais seguro de `MD5()`. No entanto, consulte a nota sobre os algoritmos MD5 e SHA-1 no início desta seção.

* `SHA2(str, hash_length)`(encryption-functions.html#function_sha2)

Calcula a família de funções de hash SHA-2 (SHA-224, SHA-256, SHA-384 e SHA-512). O primeiro argumento é a string em texto plano a ser hash. O segundo argumento indica o comprimento de bits desejado do resultado, que deve ter um valor de 224, 256, 384, 512 ou 0 (que é equivalente a 256). Se qualquer um dos argumentos for `NULL` ou o comprimento do hash não for um dos valores permitidos, o valor de retorno é `NULL`. Caso contrário, o resultado da função é um valor de hash contendo o número desejado de bits. Consulte as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

Essa função só funciona se o MySQL tiver sido configurado com suporte SSL. Veja a Seção 8.3, “Usando conexões criptografadas”.

`SHA2()` pode ser considerado criptográficamente mais seguro do que `MD5()` ou `SHA1()`.

* `STATEMENT_DIGEST(statement)`

Dado uma declaração SQL como uma string, retorna o valor do hash do digest da declaração como uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. A função relacionada `STATEMENT_DIGEST_TEXT()` retorna o digest normalizado da declaração. Para informações sobre digest de declaração, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

Ambas as funções utilizam o analisador MySQL para analisar a declaração. Se a análise falhar, ocorre um erro. A mensagem de erro inclui o erro de análise apenas se a declaração for fornecida como uma string literal.

A variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis para essas funções para a computação de digestos normalizados de declarações.

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

* `STATEMENT_DIGEST_TEXT(statement)`

Dado uma declaração SQL como uma string, retorna o digestão normalizado da declaração como uma string no conjunto de caracteres de conexão, ou `NULL` se o argumento for `NULL`. Para discussão adicional e exemplos, consulte a descrição da função relacionada `STATEMENT_DIGEST()`.

* `UNCOMPRESS(string_to_uncompress)`

Descomprime uma cadeia comprimida pela função `COMPRESS()`. Se o argumento não for um valor comprimido, o resultado é `NULL`; se *`string_to_uncompress`* é `NULL`, o resultado também é `NULL`. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`.

  ```
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* `UNCOMPRESSED_LENGTH(compressed_string)`

Retorna o comprimento que a string comprimida tinha antes de ser comprimida. Retorna `NULL` se *`NULL`* é `compressed_string`.

  ```
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* `VALIDATE_PASSWORD_STRENGTH(str)`

Dado um argumento que representa uma senha em texto plano, essa função retorna um número inteiro para indicar quão forte é a senha, ou `NULL` se o argumento for `NULL`. O valor de retorno varia de 0 (fraco) a 100 (forte).

A avaliação da senha pelo `VALIDATE_PASSWORD_STRENGTH()` é feita pelo componente `validate_password`. Se esse componente não estiver instalado, a função sempre retorna

Para obter informações sobre a instalação do `validate_password`, consulte a Seção 8.4.3, “O componente de validação de senha”. Para examinar ou configurar os parâmetros que afetam o teste de senha, verifique ou defina as variáveis do sistema implementadas pelo `validate_password`. Consulte a Seção 8.4.3.2, “Opções e variáveis de validação de senha”.

A senha é submetida a testes cada vez mais rigorosos e o valor de retorno reflete quais testes foram satisfeitos, conforme mostrado na tabela a seguir. Além disso, se a variável de sistema `validate_password.check_user_name` estiver habilitada e a senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis de sistema `validate_password` forem configuradas.

  <table summary="Password tests of the VALIDATE_PASSWORD_STRENGTH() function and the values returned by each password test."><col style="width: 60%"/><col style="width: 20%"/><thead><tr> <th>Teste de senha</th> <th>Return Value</th> </tr></thead><tbody><tr> <td>Comprimento &lt; 4</td> <td>0</td> </tr><tr> <td>Comprimento ≥ 4 e &lt;<code>validate_password.length</code></td> <td>25</td> </tr><tr> <td>Cumpre a política 1 (<code>LOW</code>)</td> <td>50</td> </tr><tr> <td>Cumpre a política 2 (<code>MEDIUM</code>)</td> <td>75</td> </tr><tr> <td>Cumpre a política 3 (<code>STRONG</code>)</td> <td>100</td> </tr></tbody></table>