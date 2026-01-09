## 14.13 Funções de Criptografia e Compressão

**Tabela 14.18 Funções de Criptografia**

<table frame="box" rules="all" summary="Uma referência que lista funções de criptografia."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th><code>AES_DECRYPT()</code></th> <td> Decrypta usando AES </td> <td></td> </tr><tr><th><code>AES_ENCRYPT()</code></th> <td> Criptota usando AES </td> <td></td> </tr><tr><th><code>COMPRESS()</code></th> <td> Retorna o resultado como uma string binária </td> <td></td> </tr><tr><th><code>MD5()</code></th> <td> Calcula o checksum MD5 </td> <td>Sim</td> </tr><tr><th><code>RANDOM_BYTES()</code></th> <td> Retorna um vetor de bytes aleatórios </td> <td></td> </tr><tr><th><code>SHA1()</code>, <code>SHA()</code></th> <td> Calcula o checksum SHA-1 de 160 bits </td> <td>Sim</td> </tr><tr><th><code>SHA2()</code></th> <td> Calcula o checksum SHA-2 </td> <td></td> </tr><tr><th><code>STATEMENT_DIGEST()</code></th> <td> Calcula o valor do hash do digest de declaração </td> <td></td> </tr><tr><th><code>STATEMENT_DIGEST_TEXT()</code></th> <td> Calcula o digest normalizado da declaração </td> <td></td> </tr><tr><th><code>UNCOMPRESS()</code></th> <td> Descomprime uma string comprimida </td> <td></td> </tr><tr><th><code>UNCOMPRESSED_LENGTH()</code></th> <td> Retorna o comprimento de uma string antes da compressão </td> <td></td> </tr><tr><th><code>VALIDATE_PASSWORD_STRENGTH()</code></th> <td> Determina a força da senha </td> <td></td> </tr></tbody></table>

Muitas funções de criptografia e compressão retornam strings nos quais o resultado pode conter valores de byte arbitrários. Se você deseja armazenar esses resultados, use uma coluna com um tipo de dados de string binária `VARBINARY` ou `BLOB`. Isso evita problemas potenciais com a remoção de espaços finais ou conversão de conjunto de caracteres que alterariam os valores dos dados, como pode ocorrer se você usar um tipo de dados de string não binário (`CHAR`, `VARCHAR`, `TEXT`).

Algumas funções de criptografia retornam strings de caracteres ASCII: `MD5()`, `SHA()`, `SHA1()`, `SHA2()`, `STATEMENT_DIGEST()`, `STATEMENT_DIGEST_TEXT()`. Seu valor de retorno é uma string que tem um conjunto de caracteres e uma ordem de classificação determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Essa é uma string não binária, a menos que o conjunto de caracteres seja `binary`.

Se uma aplicação armazenar valores de uma função como `MD5()` ou `SHA1()` que retorna uma string de dígitos hexadecimais, pode-se obter armazenamento e comparações mais eficientes convertendo a representação hexadecimais para binário usando `UNHEX()` e armazenando o resultado em uma coluna `BINARY(N)`. Cada par de dígitos hexadecimais requer um byte na forma binária, então o valor de *`N`* depende do comprimento da string hexadecimais. *`N`* é 16 para um valor de `MD5()` e 20 para um valor de `SHA1()`. Para `SHA2()`, *`N`* varia de 28 a 32, dependendo do argumento que especifica o comprimento de bits desejado do resultado.

A penalidade de tamanho para armazenar a string hexadecimais em uma coluna `CHAR` é de pelo menos duas vezes, até oito vezes se o valor for armazenado em uma coluna que usa o conjunto de caracteres `utf8mb4` (onde cada caractere usa 4 bytes). Armazenar a string também resulta em comparações mais lentas devido aos valores maiores e à necessidade de levar em conta as regras de classificação de conjunto de caracteres.

Suponha que um aplicativo armazene valores de strings `MD5()` em uma coluna `CHAR(32)`:

```
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

Para converter strings hexadecimais para uma forma mais compacta, modifique o aplicativo para usar `UNHEX()` e `BINARY(16)` da seguinte forma:

```
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

Os aplicativos devem estar preparados para lidar com o caso muito raro de uma função de hashing produzir o mesmo valor para dois valores de entrada diferentes. Uma maneira de detectar colisões é tornar a coluna de hash uma chave primária.

Nota

Exploits para os algoritmos MD5 e SHA-1 tornaram-se conhecidos. Você pode querer considerar usar outra função de criptografia unidirecional descrita nesta seção, como `SHA2()`.

Tanto o MD5 quanto o SHA-1 estão desatualizados; `SHA2()` é recomendado em vez disso.

Cuidado

Senhas ou outros valores sensíveis fornecidos como argumentos às funções de criptografia são enviados como texto claro para o servidor MySQL, a menos que uma conexão SSL seja usada. Além disso, esses valores aparecem em quaisquer logs do MySQL aos quais são escritos. Para evitar esse tipo de exposição, os aplicativos podem criptografar valores sensíveis no lado do cliente antes de enviá-los para o servidor. As mesmas considerações se aplicam às chaves de criptografia. Para evitar expor essas informações, os aplicativos podem usar procedimentos armazenados para criptografar e descriptografar valores no lado do servidor.

* `AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

  Esta função descriptografa dados usando o algoritmo oficial AES (Padrão de Criptografia Avançada). Para mais informações, consulte a descrição de `AES_ENCRYPT()`.

  As instruções que usam `AES_DECRYPT()` não são seguras para replicação baseada em instruções.

* `AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

`AES_ENCRYPT()` e `AES_DECRYPT()` implementam a criptografia e descriptografia de dados usando o algoritmo oficial AES (Padrão de Criptografia Avançada), anteriormente conhecido como “Rijndael”. O padrão AES permite várias comprimentos de chave. Por padrão, essas funções implementam AES com um comprimento de chave de 128 bits. Podem ser usadas comprimentos de chave de 196 ou 256 bits, conforme descrito mais adiante. O comprimento da chave é um compromisso entre desempenho e segurança.

`AES_ENCRYPT()` criptografa a string *`str`* usando a string de chave *`key_str`*, e retorna uma string binária contendo a saída criptografada. `AES_DECRYPT()` descriptografa a string criptografada *`crypt_str`* usando a string de chave *`key_str`*, e retorna a string original (binária) no formato hexadecimal. (Para obter a string como texto simples, converta o resultado para `CHAR`. Alternativamente, inicie o cliente **mysql** com `--skip-binary-as-hex` para fazer com que todos os valores binários sejam exibidos como texto.) Se qualquer argumento da função for `NULL`, a função retorna `NULL`. Se `AES_DECRYPT()` detectar dados inválidos ou alinhamento incorreto, ele retorna `NULL`. No entanto, é possível que `AES_DECRYPT()` retorne um valor não `NULL` (possível lixo) se os dados de entrada ou a chave forem inválidos.

Essas funções suportam o uso de uma função de derivação de chave (KDF) para criar uma chave secreta criptograficamente forte a partir das informações passadas em *`key_str`*. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece uma melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples conforme você usa a função. As funções suportam o HKDF (disponível a partir do OpenSSL 1.1.0), para o qual você pode especificar um sal opcional e informações específicas do contexto para incluir no material de chave, e o PBKDF2 (disponível a partir do OpenSSL 1.0.2), para o qual você pode especificar um sal opcional e definir o número de iterações usadas para produzir a chave.

`AES_ENCRYPT()` e `AES_DECRYPT()` permitem o controle do modo de criptografia de bloco. A variável de sistema `block_encryption_mode` controla o modo para algoritmos de criptografia baseados em blocos. Seu valor padrão é `aes-128-ecb`, o que significa criptografia usando um comprimento de chave de 128 bits e modo ECB. Para uma descrição dos valores permitidos dessa variável, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”. O argumento opcional *`init_vector`* é usado para fornecer um vetor de inicialização para modos de criptografia de bloco que o exigem.

As declarações que usam `AES_ENCRYPT()` ou `AES_DECRYPT()` não são seguras para replicação baseada em declarações.

Se `AES_ENCRYPT()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Os argumentos para as funções `AES_ENCRYPT()` e `AES_DECRYPT()` são os seguintes:

*`str`*:   A string para `AES_ENCRYPT()` para criptografar usando a string de chave *`key_str`*, ou a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O alinhamento é adicionado automaticamente a *`str`* para que seja um múltiplo de um bloco, conforme exigido por algoritmos baseados em blocos, como o AES. Esse alinhamento é removido automaticamente pela função `AES_DECRYPT()`.

  *`crypt_str`*:   A string criptografada para `AES_DECRYPT()` para descriptografar usando a string de chave *`key_str`*, ou a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O comprimento de *`crypt_str`* pode ser calculado a partir do comprimento da string original usando esta fórmula:

      ```
      16 * (trunc(string_length / 16) + 1)
      ```

  *`key_str`*:   A chave de criptografia, ou o material de chave de entrada que é usado como base para derivar uma chave usando uma função de derivação de chave (KDF). Para a mesma instância de dados, use o mesmo valor de *`key_str`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

      Se você estiver usando um KDF, *`key_str`* pode ser qualquer informação arbitrária, como uma senha ou frase de senha. Nos argumentos adicionais da função, você especifica o nome do KDF e, em seguida, adiciona mais opções para aumentar a segurança conforme apropriado para o KDF.

      Quando você usa um KDF, a função cria uma chave secreta criptograficamente forte a partir das informações passadas em *`key_str`* e de qualquer sal ou informação adicional que você forneça nos outros argumentos. A chave derivada é usada para criptografar e descriptografar os dados, e ela permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece uma melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples ao usar a função.

Se você não estiver usando um KDF, para uma chave de 128 bits, a maneira mais segura de passar uma chave para o argumento *`key_str`* é criar um valor verdadeiramente aleatório de 128 bits e passá-lo como um valor binário. Por exemplo:

```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

Uma frase de senha pode ser usada para gerar uma chave AES hashando a frase de senha. Por exemplo:

```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

Se você exceder o comprimento máximo da chave de 128 bits, um aviso é retornado. Se você não estiver usando um KDF, não passe uma senha ou frase de senha diretamente para *`key_str`*, primeiro hash-a. Versões anteriores desta documentação sugeriram a primeira abordagem, mas ela não é mais recomendada, pois os exemplos mostrados aqui são mais seguros.

*`init_vector`*: Um vetor de inicialização, para modos de criptografia de bloco que o exijam. A variável de sistema `block_encryption_mode` controla o modo. Para a mesma instância de dados, use o mesmo valor de *`init_vector`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

Nota

Se você estiver usando um KDF, você deve especificar um vetor de inicialização ou uma string nula para este argumento, a fim de acessar os argumentos subsequentes para definir o KDF.

Para modos que exigem um vetor de inicialização, ele deve ser de 16 bytes ou mais (bytes em excesso de 16 são ignorados). Um erro ocorre se *`init_vector`* estiver ausente. Para modos que não exigem um vetor de inicialização, ele é ignorado e um aviso é gerado se *`init_vector`* for especificado, a menos que você esteja usando um KDF.

O valor padrão para a variável de sistema `block_encryption_mode` é `aes-128-ecb`, ou modo ECB, que não exige um vetor de inicialização. Os modos de criptografia de bloco alternativos permitidos CBC, CFB1, CFB8, CFB128 e OFB todos exigem um vetor de inicialização.

Uma string aleatória de bytes para usar no vetor de inicialização pode ser gerada chamando `RANDOM_BYTES(16)`.

*`kdf_name`*:   O nome da função de derivação de chave (KDF) para criar uma chave a partir do material de chave de entrada passado em *`key_str`*, e outros argumentos conforme apropriado para o KDF. Opcional.

Para a mesma instância de dados, use o mesmo valor de *`kdf_name`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. Quando você especificar *`kdf_name`*, você deve especificar *`init_vector`*, usando um vetor de inicialização válido ou uma string nula se o modo de criptografia não exigir um vetor de inicialização.

Os seguintes valores são suportados:

`hkdf` :   HKDF, que está disponível a partir do OpenSSL 1.1.0. O HKDF extrai uma chave pseudorandom do material de chave e, em seguida, a expande em chaves adicionais. Com o HKDF, você pode especificar um sal opcional (*`salt`*) e informações específicas do contexto, como detalhes da aplicação (*`info`*) para incluir no material de chave.

`pbkdf2_hmac` :   PBKDF2, que está disponível a partir do OpenSSL 1.0.2. O PBKDF2 aplica uma função pseudorandom ao material de chave e repete esse processo um grande número de vezes para produzir a chave. Com o PBKDF2, você pode especificar um sal opcional (*`salt`*) para incluir no material de chave e definir o número de iterações usadas para produzir a chave (*`iterations`*).

Neste exemplo, o HKDF é especificado como a função de derivação de chave, e um sal e informações de contexto são fornecidos. O argumento para o vetor de inicialização é incluído, mas é a string vazia:

```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

Neste exemplo, o PBKDF2 é especificado como a função de derivação de chave, um sal é fornecido e o número de iterações é dobrado do mínimo recomendado:

```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

*`salt`*:   Um sal a ser passado para a função de derivação de chaves (KDF). Opcional. Tanto o HKDF quanto o PBKDF2 podem usar sal, e seu uso é recomendado para ajudar a prevenir ataques baseados em dicionários de senhas comuns ou tabelas de arco-íris.

      Um sal consiste em dados aleatórios, que, para a segurança, devem ser diferentes para cada operação de criptografia. Uma string aleatória de bytes para usar no sal pode ser gerada chamando `RANDOM_BYTES()`. Este exemplo gera um sal de 64 bits:

      ```
      SET @salt = RANDOM_BYTES(8);
      ```

      Para a mesma instância de dados, use o mesmo valor de *`salt`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. O sal pode ser armazenado com segurança junto com os dados criptografados.

  *`info`*:   Informações específicas do contexto para o HKDF incluir no material de chave, como informações sobre o aplicativo. Opcional; disponível quando você especifica `hkdf` como o nome do KDF. O HKDF adiciona essas informações ao material de chave especificado em *`key_str`* e ao sal especificado em *`salt`* para produzir a chave.

      Para a mesma instância de dados, use o mesmo valor de *`info`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

  *`iterations`*:   O número de iterações para o PBKDF2 usar ao produzir a chave. Opcional; disponível quando você especifica `pbkdf2_hmac` como o nome do KDF. Um número maior oferece maior resistência a ataques de força bruta porque tem um custo computacional maior para o atacante, mas o mesmo é necessariamente verdadeiro para o processo de derivação de chaves. O padrão por defeito, se você não especificar esse argumento, é 1000, que é o mínimo recomendado pelo padrão OpenSSL.

      Para a mesma instância de dados, use o mesmo valor de *`iterations`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

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

  Compreende uma string e retorna o resultado como uma string binária. Essa função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`. O valor de retorno também é `NULL` se *`string_to_compress`* for `NULL`. A string comprimida pode ser descomprimiu com `UNCOMPRESS()`.

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

  O conteúdo da string comprimida é armazenado da seguinte maneira:

  + Strings vazias são armazenadas como strings vazias.
  + Strings não vazias são armazenadas como um comprimento de 4 bytes da string não comprimida (baixo byte primeiro), seguido pela string comprimida. Se a string terminar com um espaço, um caractere extra `.` é adicionado para evitar problemas com o corte de espaço final caso o resultado seja armazenado em uma coluna `CHAR` ou `VARCHAR`. (No entanto, o uso de tipos de dados de string não binários, como `CHAR` ou `VARCHAR`, para armazenar strings comprimidas não é recomendado de qualquer forma, pois a conversão do conjunto de caracteres pode ocorrer. Use uma coluna de string binária `VARBINARY` ou `BLOB` em vez disso.)

  Se `COMPRESS()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `MD5(str)`

  Desatualizado; `SHA2()` é recomendado em vez disso. Calcula um checksum de 128 bits MD5 para a string. O valor é retornado como uma string de 32 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. O valor de retorno pode, por exemplo, ser usado como uma chave de hash. Consulte as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  Se o modo FIPS estiver habilitado, `MD5()` retorna `NULL`. Consulte a Seção 8.8, “Suporte FIPS”.

```
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

Este é o “Algoritmo de Digestas de Mensagens RSA Data Security, Inc. MD5”.

Veja a nota sobre o algoritmo MD5 no início desta seção.

* `RANDOM_BYTES(len)`

  Esta função retorna uma string binária de *`len`* bytes aleatórios gerados usando o gerador de números aleatórios da biblioteca SSL. Os valores permitidos de *`len`* variam de 1 a 1024. Para valores fora desse intervalo, ocorre um erro. Retorna `NULL` se *`len`* for `NULL`.

  `RANDOM_BYTES()` pode ser usado para fornecer o vetor de inicialização para as funções `AES_DECRYPT()` e `AES_ENCRYPT()`. Para uso nesse contexto, *`len`* deve ser no mínimo 16. Valores maiores são permitidos, mas os bytes em excesso de 16 são ignorados.

  `RANDOM_BYTES()` gera um valor aleatório, o que torna seu resultado não determinístico. Consequentemente, as declarações que usam essa função são inseguras para replicação baseada em declarações.

  Se `RANDOM_BYTES()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `SHA1(str)`, `SHA(str)`

  Desatualizado; use `SHA2()` em vez disso. Calcula um checksum de 160 bits SHA-1 para a string, conforme descrito no RFC 3174 (Secure Hash Algorithm). O valor é retornado como uma string de 40 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. Um dos usos possíveis para essa função é como chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente. `SHA()` é sinônimo de `SHA1()`.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  ```
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

`SHA1()` pode ser considerado um equivalente criptograficamente mais seguro de `MD5()`. No entanto, consulte a nota sobre os algoritmos MD5 e SHA-1 no início desta seção.

* `SHA2(str, hash_length)`

  Calcula a função de hash da família SHA-2 (SHA-224, SHA-256, SHA-384 e SHA-512). O primeiro argumento é a string em texto plano a ser hash. O segundo argumento indica o comprimento de bits desejado do resultado, que deve ter um valor de 224, 256, 384, 512 ou 0 (o que é equivalente a 256). Se qualquer um dos argumentos for `NULL` ou o comprimento de bits não for um dos valores permitidos, o valor de retorno é `NULL`. Caso contrário, o resultado da função é um valor de hash contendo o número desejado de bits. Consulte as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  ```
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  Esta função só funciona se o MySQL tiver sido configurado com suporte SSL. Consulte a Seção 8.3, “Usando Conexões Encriptadas”.

  `SHA2()` pode ser considerado criptograficamente mais seguro que `MD5()` ou `SHA1()`.

* `STATEMENT_DIGEST(statement)`

  Dado um comando SQL como uma string, retorna o valor de hash do digest do comando como uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. A função relacionada `STATEMENT_DIGEST_TEXT()` retorna o digest normalizado do comando. Para informações sobre digestes de comandos, consulte a Seção 29.10, “Digestas de Comandos do Schema de Desempenho e Amostragem”.

  Ambas as funções usam o analisador de comandos MySQL para analisar o comando. Se a análise falhar, ocorre um erro. A mensagem de erro inclui o erro de análise apenas se o comando for fornecido como uma string literal.

A variável de sistema `max_digest_length` determina o número máximo de bytes disponíveis para essas funções para calcular os digests normalizados de declarações.

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

  Dado uma declaração SQL como uma string, retorna o digest normalizado da declaração como uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. Para discussões adicionais e exemplos, consulte a descrição da função relacionada `STATEMENT_DIGEST()`.

* `UNCOMPRESS(string_to_uncompress)`

  Descomprime uma string comprimida pela função `COMPRESS()`. Se o argumento não for um valor comprimido, o resultado é `NULL`; se *`string_to_uncompress`* for `NULL`, o resultado também é `NULL`. Esta função requer que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`.

```
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* `UNCOMPRESSED_LENGTH(compressed_string)`

  Retorna o comprimento que a string comprimida tinha antes de ser comprimida. Retorna `NULL` se *`compressed_string`* for `NULL`.

```
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* `VALIDATE_PASSWORD_STRENGTH(str)`

  Dado um argumento representando uma senha em texto plano, esta função retorna um inteiro para indicar quão forte a senha é, ou `NULL` se o argumento for `NULL`. O valor de retorno varia de 0 (fraco) a 100 (forte).

A avaliação da senha por `VALIDATE_PASSWORD_STRENGTH()` é feita pelo componente `validate_password`. Se esse componente não estiver instalado, a função sempre retorna

0. Para obter informações sobre a instalação do `validate_password`, consulte a Seção 8.4.4, “O Componente de Validação de Senhas”. Para examinar ou configurar os parâmetros que afetam o teste de senhas, verifique ou defina as variáveis do sistema implementadas pelo `validate_password`. Consulte a Seção 8.4.4.2, “Opções e Variáveis de Validação de Senhas”.

A senha é submetida a testes cada vez mais rigorosos e o valor de retorno reflete quais testes foram atendidos, conforme mostrado na tabela a seguir. Além disso, se a variável do sistema `validate_password.check_user_name` estiver habilitada e a senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis do sistema `validate_password` forem definidas.

<table summary="Testes de senha da função VALIDATE_PASSWORD_STRENGTH() e os valores retornados por cada teste de senha."><col style="width: 60%"/><col style="width: 20%"/><thead><tr> <th>Teste de Senha</th> <th>Valor de Retorno</th> </tr></thead><tbody><tr> <td>Comprimento &lt; 4</td> <td>0</td> </tr><tr> <td>Comprimento ≥ 4 e &lt; <code>validate_password.length</code></td> <td>25</td> </tr><tr> <td>Cumpre a política 1 (<code>LOW</code>)</td> <td>50</td> </tr><tr> <td>Cumpre a política 2 (<code>MEDIUM</code>)</td> <td>75</td> </tr><tr> <td>Cumpre a política 3 (<code>STRONG</code>)</td> <td>100</td> </tr></tbody></table>