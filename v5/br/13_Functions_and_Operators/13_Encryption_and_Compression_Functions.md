## 12.13 Funções de Criptografia e Compressão

**Tabela 12.18 Funções de criptografia**

<table frame="box" rules="all" summary="A reference that lists encryption functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>AES_DECRYPT()</code></th> <td> Decrypt using AES </td> <td></td> </tr><tr><th><code>AES_ENCRYPT()</code></th> <td> Encrypt using AES </td> <td></td> </tr><tr><th><code>COMPRESS()</code></th> <td>Retorne o resultado como uma string binária</td> <td></td> </tr><tr><th><code>DECODE()</code></th> <td>Decodifique uma string criptografada usando ENCODE()</td> <td>Sim</td> </tr><tr><th><code>DES_DECRYPT()</code></th> <td> Decrypt a string </td> <td>Yes</td> </tr><tr><th><code>DES_ENCRYPT()</code></th> <td> Encrypt a string </td> <td>Yes</td> </tr><tr><th><code>ENCODE()</code></th> <td> Encode a string </td> <td>Yes</td> </tr><tr><th><code>ENCRYPT()</code></th> <td> Encrypt a string </td> <td>Yes</td> </tr><tr><th><code>MD5()</code></th> <td> Calculate MD5 checksum </td> <td></td> </tr><tr><th><code>PASSWORD()</code></th> <td>Calcular e retornar uma string de senha</td> <td>Sim</td> </tr><tr><th><code>RANDOM_BYTES()</code></th> <td>Retorne um vetor de bytes aleatório</td> <td></td> </tr><tr><th><code>SHA1()</code>,<code>SHA()</code></th> <td>Calcular um checksum de 160 bits SHA-1</td> <td></td> </tr><tr><th><code>SHA2()</code></th> <td>Calcular um checksum SHA-2</td> <td></td> </tr><tr><th><code>UNCOMPRESS()</code></th> <td>Descomprima uma string comprimida</td> <td></td> </tr><tr><th><code>UNCOMPRESSED_LENGTH()</code></th> <td>Retorne o comprimento de uma string antes da compressão</td> <td></td> </tr><tr><th><code>VALIDATE_PASSWORD_STRENGTH()</code></th> <td>Determine a força da senha</td> <td></td> </tr></tbody></table>

Muitas funções de criptografia e compressão retornam strings para as quais o resultado pode conter valores arbitrários de bytes. Se você deseja armazenar esses resultados, use uma coluna com um tipo de dados de string binária `VARBINARY` ou `BLOB`. Isso evita problemas potenciais com remoção de espaço final ou conversão de conjunto de caracteres que mudariam os valores dos dados, como pode ocorrer se você usar um tipo de dados de string não binário (`CHAR`, `VARCHAR`, `TEXT`).

Algumas funções de criptografia retornam cadeias de caracteres ASCII: `MD5()`, `PASSWORD()`, `SHA()`, `SHA1()`, `SHA2()`. Seu valor de retorno é uma cadeia de caracteres que tem um conjunto de caracteres e uma ordenação determinados pelo sistema de variáveis `character_set_connection` e `collation_connection`. Esta é uma cadeia não binária, a menos que o conjunto de caracteres seja `binary`.

Se um aplicativo armazenar valores de uma função como `MD5()` ou `SHA1()` que retorna uma string de dígitos hexadecimais, pode-se obter armazenamento e comparações mais eficientes convertendo a representação hexadecimais para binário usando `UNHEX()` e armazenando o resultado em uma coluna de `BINARY(N)`. Cada par de dígitos hexadecimais requer um byte em forma binária, então o valor de *`N`* depende do comprimento da string hexadecimais. *`N`* é 16 para um valor de `MD5()` e 20 para um valor de `SHA1()`. Para `SHA2()`, *`N`* varia de 28 a 32, dependendo do argumento que especifica o comprimento de bit desejado do resultado.

A penalidade de tamanho para armazenar a string hexadecimal em uma coluna `CHAR` é de pelo menos duas vezes, até oito vezes, se o valor for armazenado em uma coluna que usa o conjunto de caracteres `utf8` (onde cada caractere usa 4 bytes). Armazenar a string também resulta em comparações mais lentas devido aos valores maiores e à necessidade de levar em conta as regras de ordenação do conjunto de caracteres.

Suponha que uma aplicação armazene valores de cadeia `MD5()` em uma coluna `CHAR(32)`:

```sql
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

Para converter cadeias hex em uma forma mais compacta, modifique o aplicativo para usar `UNHEX()` e `BINARY(16)` conforme a seguir:

```sql
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

As aplicações devem estar preparadas para lidar com o caso muito raro de uma função de hashing produzir o mesmo valor para dois valores de entrada diferentes. Uma maneira de tornar os conflitos detectáveis é tornar a coluna de hash uma chave primária.

Nota

Os ataques aos algoritmos MD5 e SHA-1 se tornaram conhecidos. Você pode considerar o uso de outra função de criptografia unidirecional descrita nesta seção, como `SHA2()`.

Cuidado

As senhas ou outros valores sensíveis fornecidos como argumentos para funções de criptografia são enviados como texto claro para o servidor MySQL, a menos que uma conexão SSL seja usada. Além disso, esses valores aparecem em quaisquer registros do MySQL para os quais são escritos. Para evitar esse tipo de exposição, as aplicações podem criptografar valores sensíveis no lado do cliente antes de enviá-los para o servidor. As mesmas considerações se aplicam às chaves de criptografia. Para evitar expor esses valores, as aplicações podem usar procedimentos armazenados para criptografar e descriptografar valores no lado do servidor.

* `AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`(encryption-functions.html#function_aes-decrypt)

Essa função descriptografa dados usando o algoritmo oficial AES (Padrão Avançado de Criptografia). Para mais informações, consulte a descrição de `AES_ENCRYPT()`.

As declarações que utilizam `AES_DECRYPT()` não são seguras para replicação baseada em declarações.

* `AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`](encryption-functions.html#function_aes-encrypt)

`AES_ENCRYPT()` e `AES_DECRYPT()` implementam criptografia e descriptografia de dados usando o algoritmo oficial AES (Padrão Avançado de Criptografia), anteriormente conhecido como “Rijndael”. O padrão AES permite várias comprimentos de chave. Por padrão, essas funções implementam AES com um comprimento de chave de 128 bits. Os comprimentos de chave de 196 ou 256 bits podem ser usados, conforme descrito mais adiante. O comprimento da chave é um compromisso entre desempenho e segurança.

`AES_ENCRYPT()` criptografa a string *`str`* usando a string de chave *`key_str`*, e retorna uma string binária contendo a saída criptografada. `AES_DECRYPT()` descriptografa a string criptografada *`crypt_str`* usando a string de chave *`key_str`*, e retorna a string de texto plano original. Se qualquer argumento da função for `NULL`, a função retorna `NULL`. Se `AES_DECRYPT()` detectar dados inválidos ou alinhamento incorreto, ele retorna `NULL`. No entanto, é possível que `AES_DECRYPT()` retorne um valor não `NULL` (possivelmente lixo) se os dados de entrada ou a chave forem inválidos.

A partir do MySQL 5.7.40, essas funções suportam o uso de uma função de derivação de chave (KDF) para criar uma chave secreta criptográficamente forte a partir das informações passadas em *`key_str`*. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples, pois você usa a função. As funções suportam o HKDF (disponível a partir do OpenSSL 1.1.0), para o qual você pode especificar um sal opcional e informações específicas do contexto para incluir no material de chaveamento, e PBKDF2 (disponível a partir do OpenSSL 1.0.2), para o qual você pode especificar um sal opcional e definir o número de iterações usadas para produzir a chave.

`AES_ENCRYPT()` e `AES_DECRYPT()` permitem o controle do modo de criptografia de bloco. A variável de sistema `block_encryption_mode` controla o modo para algoritmos de criptografia baseados em bloco. Seu valor padrão é `aes-128-ecb`, que indica criptografia usando um comprimento de chave de 128 bits e modo ECB. Para uma descrição dos valores permitidos desta variável, consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”. O argumento opcional *`init_vector`* é usado para fornecer um vetor de inicialização para modos de criptografia de bloco que o exigem.

As declarações que utilizam `AES_ENCRYPT()` ou `AES_DECRYPT()` não são seguras para replicação baseada em declarações.

Se `AES_ENCRYPT()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

Os argumentos para as funções `AES_ENCRYPT()` e `AES_DECRYPT()` são os seguintes:

*`str`* :   A string para `AES_ENCRYPT()` para encriptar usando a string de chave *`key_str`*, ou (a partir do MySQL 5.7.40) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O alinhamento é adicionado automaticamente a *`str`* para que seja um múltiplo de um bloco conforme exigido por algoritmos baseados em blocos, como o AES. Esse alinhamento é removido automaticamente pela função `AES_DECRYPT()`.

*`crypt_str`* :   A string criptografada para `AES_DECRYPT()` para descriptografar usando a string de chave *`key_str`*, ou (a partir do MySQL 5.7.40) a chave derivada dela pelo KDF especificado. A string pode ter qualquer comprimento. O comprimento de *`crypt_str`* pode ser calculado a partir do comprimento da string original usando esta fórmula:

      ```sql
      16 * (trunc(string_length / 16) + 1)
      ```

*`key_str`*:   A chave de criptografia, ou o material de chave de entrada que é usado como base para derivar uma chave usando uma função de derivação de chave (KDF). Para a mesma instância de dados, use o mesmo valor de *`key_str`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

Se você estiver usando um KDF, que você pode fazer a partir do MySQL 5.7.40, *`key_str`* pode ser qualquer informação arbitrária, como uma senha ou frase de senha. Nos argumentos adicionais para a função, você especifica o nome do KDF e, em seguida, adiciona mais opções para aumentar a segurança conforme apropriado para o KDF.

Quando você usa um KDF, a função cria uma chave secreta criptográficamente forte a partir das informações passadas em *`key_str`* e qualquer sal ou informações adicionais que você forneça nos outros argumentos. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do MySQL Server e não é acessível aos usuários. Usar um KDF é altamente recomendado, pois oferece melhor segurança do que especificar sua própria chave pré-criada ou derivá-la por um método mais simples, pois você usa a função.

Se você não estiver usando um KDF, para um comprimento de chave de 128 bits, a maneira mais segura de passar uma chave para o argumento *`key_str`* é criar um valor verdadeiramente aleatório de 128 bits e passá-lo como um valor binário. Por exemplo:

      ```sql
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

Uma frase de senha pode ser usada para gerar uma chave AES ao criptografar a frase de senha. Por exemplo:

      ```sql
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

Se você exceder o comprimento máximo da chave de 128 bits, um aviso é retornado. Se você não está usando um KDF, não passe uma senha ou frase de senha diretamente para *`key_str`*, faça um hash dela primeiro. Versões anteriores desta documentação sugeriram a primeira abordagem, mas ela não é mais recomendada, pois os exemplos mostrados aqui são mais seguros.

*`init_vector`*: Um vetor de inicialização, para modos de criptografia de bloco que o exijam. A variável de sistema `block_encryption_mode` controla o modo. Para a mesma instância de dados, use o mesmo valor de *`init_vector`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

Nota

Se você estiver usando um KDF, você deve especificar um vetor de inicialização ou uma string nula para este argumento, a fim de acessar os argumentos subsequentes para definir o KDF.

Para os modos que exigem um vetor de inicialização, ele deve ter 16 bytes ou mais (bytes em excesso de 16 são ignorados). Um erro ocorre se *`init_vector`* estiver ausente. Para os modos que não exigem um vetor de inicialização, ele é ignorado e um aviso é gerado se *`init_vector`* for especificado, a menos que você esteja usando um KDF.

O valor padrão para a variável de sistema `block_encryption_mode` é `aes-128-ecb`, ou modo ECB, que não requer um vetor de inicialização. Os modos de criptografia de bloco alternativo permitidos CBC, CFB1, CFB8, CFB128 e OFB todos requerem um vetor de inicialização.

Uma cadeia aleatória de bytes para usar no vetor de inicialização pode ser produzida ao chamar `RANDOM_BYTES(16)`.

*`kdf_name`* :   O nome da função de derivação de chave (KDF) para criar uma chave a partir do material de chaveamento de entrada passado em *`key_str`*, e outros argumentos conforme apropriado para o KDF. Este argumento opcional está disponível a partir do MySQL 5.7.40.

Para a mesma instância de dados, use o mesmo valor de *`kdf_name`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. Quando você especificar *`kdf_name`*, você deve especificar *`init_vector`*, usando um vetor de inicialização válido ou uma string nula se o modo de criptografia não exigir um vetor de inicialização.

Os seguintes valores são suportados:

`hkdf` :   HKDF, que está disponível a partir do OpenSSL 1.1.0. O HKDF extrai uma chave pseudorandom do material de chaveamento e, em seguida, a expande em chaves adicionais. Com o HKDF, você pode especificar um sal opcional (*`salt`*) e informações específicas do contexto, como detalhes da aplicação (*`info`*), para incluir no material de chaveamento.

`pbkdf2_hmac` : PBKDF2, que está disponível a partir do OpenSSL 1.0.2. O PBKDF2 aplica uma função pseudorandom ao material de chaveamento e repete esse processo um grande número de vezes para produzir a chave. Com o PBKDF2, você pode especificar um sal opcional (*`salt`*) para incluir no material de chaveamento e definir o número de iterações usadas para produzir a chave (*`iterations`*).

Neste exemplo, HKDF é especificado como a função de derivação de chave, e um sal e informações de contexto são fornecidos. O argumento para o vetor de inicialização é incluído, mas é a string vazia:

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

Neste exemplo, PBKDF2 é especificado como a função de derivação de chave, é fornecido um sal e o número de iterações é dobrado em relação ao mínimo recomendado:

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

*`salt`* :   Um sal a ser passado para a função de derivação de chave (KDF). Este argumento opcional está disponível a partir do MySQL 5.7.40. Tanto o HKDF quanto o PBKDF2 podem usar sal, e seu uso é recomendado para ajudar a prevenir ataques baseados em dicionários de senhas comuns ou tabelas arco-íris.

Um sal consiste em dados aleatórios, que, para segurança, devem ser diferentes para cada operação de criptografia. Uma string aleatória de bytes que pode ser usada para o sal pode ser produzida chamando `RANDOM_BYTES()`. Este exemplo produz um sal de 64 bits:

      ```sql
      SET @salt = RANDOM_BYTES(8);
      ```

Para a mesma instância de dados, use o mesmo valor de *`salt`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. O sal pode ser armazenado com segurança junto com os dados criptografados.

*`info`* :   Informações específicas do contexto para o HKDF para incluir no material de chaveamento, como informações sobre o aplicativo. Este argumento opcional está disponível a partir do MySQL 5.7.40 quando você especifica `hkdf` como o nome do KDF. O HKDF adiciona essas informações ao material de chaveamento especificado em *`key_str`* e ao sal especificado em *`salt`* para produzir a chave.

Para a mesma instância de dados, use o mesmo valor de *`info`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

*`iterations`* :   O número de iterações para PBKDF2 a ser usado na geração da chave. Este argumento opcional está disponível a partir do MySQL 5.7.40 quando você especifica `pbkdf2_hmac` como o nome do KDF. Um número maior oferece maior resistência a ataques brutais, pois tem um custo computacional maior para o atacante, mas o mesmo é necessariamente verdadeiro para o processo de derivação da chave. O padrão predeterminado, se você não especificar este argumento, é 1000, que é o mínimo recomendado pelo padrão OpenSSL.

Para a mesma instância de dados, use o mesmo valor de *`iterations`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

  ```sql
  mysql> SET block_encryption_mode = 'aes-256-cbc';
  mysql> SET @key_str = SHA2('My secret passphrase',512);
  mysql> SET @init_vector = RANDOM_BYTES(16);
  mysql> SET @crypt_str = AES_ENCRYPT('text',@key_str,@init_vector);
  mysql> SELECT AES_DECRYPT(@crypt_str,@key_str,@init_vector);
  +-----------------------------------------------+
  | AES_DECRYPT(@crypt_str,@key_str,@init_vector) |
  +-----------------------------------------------+
  | text                                          |
  +-----------------------------------------------+
  ```

* `COMPRESS(string_to_compress)`

Compreende uma cadeia e retorna o resultado como uma cadeia binária. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre [[`NULL`]. A cadeia comprimida pode ser descomprimida com `UNCOMPRESS()`.

  ```sql
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

Se `COMPRESS()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `DECODE(crypt_str,pass_str)`

`DECODE()` descifra a string criptografada *`crypt_str`* usando *`pass_str`* como senha. *`crypt_str`* deve ser uma string retornada de `ENCODE()`.

Nota

As funções `ENCODE()` e `DECODE()` são descontinuadas no MySQL 5.7 e não devem mais ser usadas. Espera-se que elas sejam removidas em um lançamento futuro do MySQL. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez delas.

* `DES_DECRYPT(crypt_str[,key_str])`

Descodifica uma cadeia criptografada com `DES_ENCRYPT()`. Se ocorrer um erro, essa função retorna `NULL`.

Essa função só funciona se o MySQL tiver sido configurado com suporte SSL. Veja a Seção 6.3, “Usando conexões criptografadas”.

Se não for fornecido o argumento *`key_str`*, o `DES_DECRYPT()` examina o primeiro byte da string criptografada para determinar o número da chave DES que foi usado para criptografar a string original, e depois lê a chave do arquivo de chave DES para descriptografar a mensagem. Para que isso funcione, o usuário deve ter o privilégio `SUPER`. O arquivo de chave pode ser especificado com a opção de servidor `--des-key-file`.

Se você passar este função um argumento *`key_str`*, essa string é usada como chave para descriptografar a mensagem.

Se o argumento *`crypt_str`* não parecer ser uma string criptografada, o MySQL retorna o dado *`crypt_str`*.

Nota

As funções `DES_ENCRYPT()` e `DES_DECRYPT()` são descontinuadas no MySQL 5.7, removidas no MySQL 8.0 e não devem mais ser usadas. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

* `DES_ENCRYPT(str[,{key_num|key_str}])`

Encripta a string com a chave fornecida usando o algoritmo Triple-DES.

Essa função só funciona se o MySQL tiver sido configurado com suporte SSL. Veja a Seção 6.3, “Usando conexões criptografadas”.

A chave de criptografia a ser usada é escolhida com base no segundo argumento de `DES_ENCRYPT()`, se um foi dado. Sem argumento, a primeira chave do arquivo de chave DES é usada. Com um *`key_num`* argumento, o número de chave fornecido (de 0 a 9) do arquivo de chave DES é usado. Com um *`key_str`* argumento, a string de chave fornecida é usada para criptografar *`str`*.

O arquivo chave pode ser especificado com a opção de servidor `--des-key-file`.

A string de retorno é uma string binária onde o primeiro caractere é `CHAR(128 | key_num)`(string-functions.html#function_char). Se ocorrer um erro, `DES_ENCRYPT()` retorna `NULL`.

O 128 é adicionado para facilitar o reconhecimento de uma chave criptografada. Se você usar uma chave de string, *`key_num`* é 127.

O comprimento da cadeia para o resultado é dado por esta fórmula:

  ```sql
  new_len = orig_len + (8 - (orig_len % 8)) + 1
  ```

Cada string no arquivo de chave DES tem o seguinte formato:

  ```sql
  key_num des_key_str
  ```

Cada valor *`key_num`* deve ser um número no intervalo de `0` a `9`. As strings no arquivo podem estar em qualquer ordem. *`des_key_str`* é a string que é usada para criptografar a mensagem. Deve haver pelo menos um espaço entre o número e a chave. A primeira chave é a chave padrão que é usada se você não especificar nenhum argumento de chave para `DES_ENCRYPT()`.

Você pode informar ao MySQL que leia novos valores de chave do arquivo de chave com a declaração `FLUSH DES_KEY_FILE`. Isso requer o privilégio `RELOAD`.

Um benefício de ter um conjunto de chaves padrão é que ele dá às aplicações uma maneira de verificar a existência de valores de coluna criptografados, sem dar ao usuário final o direito de descriptografar esses valores.

Nota

As funções `DES_ENCRYPT()` e `DES_DECRYPT()` são descontinuadas no MySQL 5.7, removidas no MySQL 8.0 e não devem mais ser usadas. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

  ```sql
  mysql> SELECT customer_address FROM customer_table
       > WHERE crypted_credit_card = DES_ENCRYPT('credit_card_number');
  ```

Se `DES_ENCRYPT()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `ENCODE(str,pass_str)`

`ENCODE()` cifra *`str`* usando *`pass_str`* como senha. O resultado é uma string binária da mesma extensão que *`str`*. Para descriptografar o resultado, use `DECODE()`.

Nota

As funções `ENCODE()` e `DECODE()` são descontinuadas no MySQL 5.7 e não devem mais ser usadas. Espera-se que elas sejam removidas em um lançamento futuro do MySQL.

Se você ainda precisar usar `ENCODE()`, um valor de sal deve ser usado com ele para reduzir o risco. Por exemplo:

  ```sql
  ENCODE('cleartext', CONCAT('my_random_salt','my_secret_password'))
  ```

Um novo valor aleatório de sal deve ser usado sempre que uma senha for atualizada.

Se `ENCODE()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `ENCRYPT(str[,salt])`

Encripta *`str`* usando a chamada de sistema Unix `crypt()` e retorna uma string binária. O argumento *`salt`* deve ser uma string com pelo menos dois caracteres, caso contrário, o resultado é `NULL`. Se não for fornecido nenhum argumento *`salt`*, um valor aleatório é usado.

Nota

A função `ENCRYPT()` é descontinuada no MySQL 5.7, removida no MySQL 8.0 e não deve mais ser usada. Para hashing unidirecional, considere usar `SHA2()` em vez disso.

  ```sql
  mysql> SELECT ENCRYPT('hello');
          -> 'VxuFAJXVARROc'
  ```

`ENCRYPT()` ignora todos, exceto os primeiros oito caracteres de *`str`*, pelo menos em alguns sistemas. Esse comportamento é determinado pela implementação da chamada de sistema subjacente `crypt()`.

O uso de `ENCRYPT()` com os conjuntos de caracteres multiletra `ucs2`, `utf16`, `utf16le` ou `utf32` não é recomendado, pois a chamada do sistema espera uma string terminada por um byte zero.

Se `crypt()` não estiver disponível no seu sistema (como é o caso do Windows), `ENCRYPT()` sempre retorna `NULL`.

Se `ENCRYPT()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `MD5(str)`

Calcula um checksum de 128 bits MD5 para a string. O valor é retornado como uma string de 32 dígitos hexadecimais, ou `NULL` se o argumento foi `NULL`. O valor de retorno pode, por exemplo, ser usado como uma chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```sql
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

Este é o "Algoritmo de Digestas de Mensagem RSA Data Security, Inc."

Veja a nota sobre o algoritmo MD5 no início desta seção.

* `PASSWORD(str)`

Nota

Essa função é descontinuada no MySQL 5.7 e removida no MySQL 8.0.

Retorna uma string de senha hashada calculada a partir da senha em texto claro *`str`*. O valor de retorno é uma string no conjunto de caracteres de conexão, ou `NULL`, se o argumento for `NULL`. Esta função é a interface SQL para o algoritmo usado pelo servidor para criptografar senhas MySQL para armazenamento na tabela de concessão `mysql.user`.

A variável de sistema `old_passwords` controla o método de hashing de senha utilizado pela função `PASSWORD()`. Ela também influencia o hashing de senha realizado pelas declarações `CREATE USER` e `GRANT` que especificam uma senha usando uma cláusula `IDENTIFIED BY`.

A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

  <table summary="For each password hashing method, the permitted value of old_passwords and which authentication plugins use the hashing method"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Método de hashing de senha</th> <th>senhas antigas Valor</th> <th>Plugin de Autenticação Associada</th> </tr></thead><tbody><tr> <th>MySQL 4.1 native hashing</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>SHA-256 hashing</th> <td>2</td> <td><code>sha256_password</code></td> </tr></tbody></table>

A geração de hash de senha SHA-256 (`old_passwords=2`) utiliza um valor de sal aleatório, o que torna o resultado de `PASSWORD()` não determinístico. Consequentemente, as declarações que utilizam essa função não são seguras para replicação baseada em declarações e não podem ser armazenadas no cache de consulta.

A criptografia realizada por `PASSWORD()` é unidirecional (não reversível), mas não é o mesmo tipo de criptografia usada para senhas do Unix.

Nota

`PASSWORD()` é usado pelo sistema de autenticação no MySQL Server; você *não* deve usá-lo em seus próprios aplicativos. Para esse propósito, considere uma função mais segura, como `SHA2()`, em vez disso. Veja também [RFC 2195, seção 2 (Mecanismo de Autenticação de Desafio-Resposta (CRAM)][(http://www.faqs.org/rfcs/rfc2195.html)]], para mais informações sobre como lidar com senhas e autenticação de forma segura em seus aplicativos.

Cuidado

Em algumas circunstâncias, declarações que invocam `PASSWORD()` podem ser registradas em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 4.5.1.3, “Registro do Cliente do MySQL”.

* `RANDOM_BYTES(len)`

Essa função retorna uma string binária de *`len`* bytes aleatórios gerados usando o gerador de números aleatórios da biblioteca SSL. Os valores permitidos de *`len`* variam de 1 a 1024. Para valores fora desse intervalo, ocorre um erro.

`RANDOM_BYTES()` pode ser usado para fornecer o vetor de inicialização para as funções `AES_DECRYPT()` e `AES_ENCRYPT()`. Para uso nesse contexto, *`len`* deve ter pelo menos 16. Valores maiores são permitidos, mas os bytes em excesso de 16 são ignorados.

`RANDOM_BYTES()` gera um valor aleatório, o que torna seu resultado não determinístico. Consequentemente, as declarações que utilizam essa função não são seguras para replicação baseada em declarações e não podem ser armazenadas no cache de consulta.

Se `RANDOM_BYTES()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `SHA1(str)`, `SHA(str)`

Calcula um checksum de 160 bits SHA-1 para a string, conforme descrito no RFC 3174 (Algoritmo de Hash Seguro). O valor é retornado como uma string de 40 dígitos hexadecimais, ou `NULL` se o argumento fosse `NULL`. Um dos usos possíveis para essa função é como chave de hash. Veja as notas no início desta seção sobre como armazenar valores de hash de forma eficiente. `SHA()` é sinônimo de `SHA1()`.

O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```sql
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

`SHA1()` pode ser considerado um equivalente criptográficamente mais seguro de `MD5()`. No entanto, consulte a nota sobre os algoritmos MD5 e SHA-1 no início desta seção.

* `SHA2(str, hash_length)`(encryption-functions.html#function_sha2)

Calcula a família de funções de hash SHA-2 (SHA-224, SHA-256, SHA-384 e SHA-512). O primeiro argumento é a string em texto plano a ser hash. O segundo argumento indica o comprimento de bits desejado do resultado, que deve ter um valor de 224, 256, 384, 512 ou 0 (que é equivalente a 256). Se qualquer um dos argumentos for `NULL` ou o comprimento do hash não for um dos valores permitidos, o valor de retorno é `NULL`. Caso contrário, o resultado da função é um valor de hash contendo o número desejado de bits. Consulte as notas no início desta seção sobre como armazenar valores de hash de forma eficiente.

O valor de retorno é uma string no conjunto de caracteres de conexão.

  ```sql
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

Essa função só funciona se o MySQL tiver sido configurado com suporte SSL. Veja a Seção 6.3, “Usando conexões criptografadas”.

`SHA2()` pode ser considerado criptográficamente mais seguro do que `MD5()` ou `SHA1()`.

* `UNCOMPRESS(string_to_uncompress)`

Descomprime uma cadeia comprimida pela função `COMPRESS()`. Se o argumento não for um valor comprimido, o resultado é `NULL`. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`.

  ```sql
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* `UNCOMPRESSED_LENGTH(compressed_string)`

Retorna o comprimento que a string comprimida tinha antes de ser comprimida.

  ```sql
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* `VALIDATE_PASSWORD_STRENGTH(str)`

Dado um argumento que representa uma senha em texto plano, essa função retorna um número inteiro para indicar quão forte é a senha. O valor de retorno varia de 0 (fraco) a 100 (forte).

A avaliação da senha pelo `VALIDATE_PASSWORD_STRENGTH()` é feita pelo plugin `validate_password`. Se esse plugin não estiver instalado, a função sempre retornará 0. Para obter informações sobre a instalação do `validate_password`, consulte a Seção 6.4.3, “O Plugin de Validação de Senha”. Para examinar ou configurar os parâmetros que afetam o teste de senha, verifique ou defina as variáveis do sistema implementadas pelo `validate_password`. Consulte a Seção 6.4.3.2, “Opções e Variáveis do Plugin de Validação de Senha”.

A senha é submetida a testes cada vez mais rigorosos e o valor de retorno reflete quais testes foram satisfeitos, conforme mostrado na tabela a seguir. Além disso, se a variável de sistema `validate_password_check_user_name` estiver habilitada e a senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis de sistema `validate_password` forem configuradas.

  <table summary="Password tests of the VALIDATE_PASSWORD_STRENGTH() function and the values returned by each password test."><col style="width: 60%"/><col style="width: 20%"/><thead><tr> <th>Teste de senha</th> <th>Return Value</th> </tr></thead><tbody><tr> <td>Comprimento &lt; 4</td> <td>0</td> </tr><tr> <td>Comprimento ≥ 4 e &lt;<code>validate_password_length</code></td> <td>25</td> </tr><tr> <td>Cumpre a política 1 (<code>LOW</code>)</td> <td>50</td> </tr><tr> <td>Cumpre a política 2 (<code>MEDIUM</code>)</td> <td>75</td> </tr><tr> <td>Cumpre a política 3 (<code>STRONG</code>)</td> <td>100</td> </tr></tbody></table>