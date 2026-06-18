## 12.13 Funções de Criptografia e Compressão

**Tabela 12.18 Funções de Criptografia**

<table frame="box" rules="all" summary="Uma referência que lista funções de criptografia."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Obsoleta</th> </tr></thead><tbody><tr><th><code>AES_DECRYPT()</code></th> <td> Descriptografa usando AES </td> <td></td> </tr><tr><th><code>AES_ENCRYPT()</code></th> <td> Criptografa usando AES </td> <td></td> </tr><tr><th><code>COMPRESS()</code></th> <td> Retorna o resultado como uma string binária </td> <td></td> </tr><tr><th><code>DECODE()</code></th> <td> Decodifica uma string criptografada usando ENCODE() </td> <td>Sim</td> </tr><tr><th><code>DES_DECRYPT()</code></th> <td> Descriptografa uma string </td> <td>Sim</td> </tr><tr><th><code>DES_ENCRYPT()</code></th> <td> Criptografa uma string </td> <td>Sim</td> </tr><tr><th><code>ENCODE()</code></th> <td> Codifica uma string </td> <td>Sim</td> </tr><tr><th><code>ENCRYPT()</code></th> <td> Criptografa uma string </td> <td>Sim</td> </tr><tr><th><code>MD5()</code></th> <td> Calcula o checksum MD5 </td> <td></td> </tr><tr><th><code>PASSWORD()</code></th> <td> Calcula e retorna uma string de senha </td> <td>Sim</td> </tr><tr><th><code>RANDOM_BYTES()</code></th> <td> Retorna um vetor de bytes aleatórios </td> <td></td> </tr><tr><th><code>SHA1()</code>, <code>SHA()</code></th> <td> Calcula um checksum SHA-1 de 160 bits </td> <td></td> </tr><tr><th><code>SHA2()</code></th> <td> Calcula um checksum SHA-2 </td> <td></td> </tr><tr><th><code>UNCOMPRESS()</code></th> <td> Descomprime uma string compactada </td> <td></td> </tr><tr><th><code>UNCOMPRESSED_LENGTH()</code></th> <td> Retorna o comprimento de uma string antes da compressão </td> <td></td> </tr><tr><th><code>VALIDATE_PASSWORD_STRENGTH()</code></th> <td> Determina a força da senha </td> <td></td> </tr> </tbody></table>

Muitas funções de criptografia e compressão retornam strings cujo resultado pode conter valores de byte arbitrários. Se você deseja armazenar esses resultados, use uma coluna com um tipo de dado de string binária `VARBINARY` ou `BLOB`. Isso evita problemas potenciais com a remoção de espaços finais ou conversão de conjunto de caracteres que alterariam os valores dos dados, o que pode ocorrer se você usar um tipo de dado de string não binária (`CHAR`, `VARCHAR`, `TEXT`).

Algumas funções de criptografia retornam strings de caracteres ASCII: `MD5()`, `PASSWORD()`, `SHA()`, `SHA1()`, `SHA2()`. Seu valor de retorno é uma string que possui um conjunto de caracteres e collation determinados pelas variáveis de sistema `character_set_connection` e `collation_connection`. Esta é uma string não binária, a menos que o conjunto de caracteres seja `binary`.

Se uma aplicação armazena valores de uma função como `MD5()` ou `SHA1()` que retorna uma string de dígitos hexadecimais, um armazenamento e comparações mais eficientes podem ser obtidos convertendo a representação hexadecimal para binária usando `UNHEX()` e armazenando o resultado em uma coluna `BINARY(N)`. Cada par de dígitos hexadecimais requer um byte na forma binária, então o valor de *`N`* depende do comprimento da string hexadecimal. *`N`* é 16 para um valor `MD5()` e 20 para um valor `SHA1()`. Para `SHA2()`, *`N`* varia de 28 a 32, dependendo do argumento que especifica o comprimento de bit desejado do resultado.

A penalidade de tamanho por armazenar a string hexadecimal em uma coluna `CHAR` é de pelo menos duas vezes, até oito vezes se o valor for armazenado em uma coluna que usa o conjunto de caracteres `utf8` (onde cada caractere usa 4 bytes). Armazenar a string também resulta em comparações mais lentas devido aos valores maiores e à necessidade de levar em conta as regras de collation do conjunto de caracteres.

Suponha que uma aplicação armazene valores de string `MD5()` em uma coluna `CHAR(32)`:

```sql
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

Para converter strings hexadecimais para uma forma mais compacta, modifique a aplicação para usar `UNHEX()` e `BINARY(16)` em vez disso, conforme segue:

```sql
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

As aplicações devem estar preparadas para lidar com o caso muito raro de uma função de hashing produzir o mesmo valor para dois valores de entrada diferentes. Uma maneira de tornar as colisões detectáveis é transformar a coluna hash em uma Primary Key.

Nota

Exploits para os algoritmos MD5 e SHA-1 tornaram-se conhecidos. Você pode considerar o uso de outra função de criptografia unidirecional descrita nesta seção, como `SHA2()`.

Cuidado

Senhas ou outros valores sensíveis fornecidos como argumentos para funções de criptografia são enviados como texto não criptografado (cleartext) para o servidor MySQL, a menos que uma conexão SSL seja utilizada. Além disso, esses valores aparecem em quaisquer logs do MySQL para os quais são escritos. Para evitar esses tipos de exposição, as aplicações podem criptografar valores sensíveis no lado do cliente antes de enviá-los ao servidor. As mesmas considerações se aplicam às chaves de criptografia. Para evitar expô-las, as aplicações podem usar stored procedures para criptografar e descriptografar valores no lado do servidor.

* `AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

  Esta função descriptografa dados usando o algoritmo oficial AES (Advanced Encryption Standard). Para mais informações, consulte a descrição de `AES_ENCRYPT()`.

  Statements que usam `AES_DECRYPT()` são inseguras para replicação baseada em statement.

* `AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`

  `AES_ENCRYPT()` e `AES_DECRYPT()` implementam a criptografia e descriptografia de dados usando o algoritmo oficial AES (Advanced Encryption Standard), anteriormente conhecido como “Rijndael.” O padrão AES permite vários comprimentos de chave. Por padrão, essas funções implementam AES com um comprimento de chave de 128 bits. Comprimentos de chave de 196 ou 256 bits podem ser usados, conforme descrito adiante. O comprimento da chave é uma compensação entre desempenho e segurança.

  `AES_ENCRYPT()` criptografa a string *`str`* usando a string chave *`key_str`* e retorna uma string binária contendo a saída criptografada. `AES_DECRYPT()` descriptografa a string criptografada *`crypt_str`* usando a string chave *`key_str`* e retorna a string de texto simples (plaintext) original. Se qualquer um dos argumentos da função for `NULL`, a função retorna `NULL`. Se `AES_DECRYPT()` detectar dados inválidos ou preenchimento incorreto (padding), ela retorna `NULL`. No entanto, é possível que `AES_DECRYPT()` retorne um valor não-`NULL` (possivelmente lixo) se os dados de entrada ou a chave forem inválidos.

  A partir do MySQL 5.7.40, essas funções suportam o uso de uma função de derivação de chave (KDF, Key Derivation Function) para criar uma chave secreta criptograficamente forte a partir das informações passadas em *`key_str`*. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do Servidor MySQL, não sendo acessível aos usuários. Usar uma KDF é altamente recomendado, pois fornece melhor segurança do que especificar sua própria chave pré-fabricada ou derivá-la por um método mais simples ao usar a função. As funções suportam HKDF (disponível a partir do OpenSSL 1.1.0), para o qual você pode especificar um salt opcional e informações específicas de contexto a serem incluídas no material de chave, e PBKDF2 (disponível a partir do OpenSSL 1.0.2), para o qual você pode especificar um salt opcional e definir o número de iterations usadas para produzir a chave.

  `AES_ENCRYPT()` e `AES_DECRYPT()` permitem o controle do modo de criptografia de bloco (block encryption mode). A variável de sistema `block_encryption_mode` controla o modo para algoritmos de criptografia baseados em bloco. Seu valor padrão é `aes-128-ecb`, o que significa criptografia usando um comprimento de chave de 128 bits e modo ECB. Para uma descrição dos valores permitidos desta variável, consulte Seção 5.1.7, “Server System Variables”. O argumento opcional *`init_vector`* é usado para fornecer um initialization vector para os modos de criptografia de bloco que o exigem.

  Statements que usam `AES_ENCRYPT()` ou `AES_DECRYPT()` são inseguras para replicação baseada em statement.

  Se `AES_ENCRYPT()` for invocada a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

  Os argumentos para as funções `AES_ENCRYPT()` e `AES_DECRYPT()` são os seguintes:

  *`str`* : A string para `AES_ENCRYPT()` criptografar usando a string chave *`key_str`*, ou (a partir do MySQL 5.7.40) a chave derivada dela pela KDF especificada. A string pode ter qualquer comprimento. O padding é adicionado automaticamente a *`str`* para que seja um múltiplo de um bloco, conforme exigido por algoritmos baseados em bloco, como AES. Este padding é removido automaticamente pela função `AES_DECRYPT()`.

  *`crypt_str`* : A string criptografada para `AES_DECRYPT()` descriptografar usando a string chave *`key_str`*, ou (a partir do MySQL 5.7.40) a chave derivada dela pela KDF especificada. A string pode ter qualquer comprimento. O comprimento de *`crypt_str`* pode ser calculado a partir do comprimento da string original usando esta fórmula:

      ```sql
      16 * (trunc(string_length / 16) + 1)
      ```

  *`key_str`* : A chave de criptografia, ou o material de chave de entrada (input keying material) que é usado como base para derivar uma chave usando uma função de derivação de chave (KDF). Para a mesma instância de dados, use o mesmo valor de *`key_str`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

      Se você estiver usando uma KDF, o que é possível a partir do MySQL 5.7.40, *`key_str`* pode ser qualquer informação arbitrária, como uma senha ou passphrase. Nos argumentos adicionais para a função, você especifica o nome da KDF e, em seguida, adiciona outras opções para aumentar a segurança, conforme apropriado para a KDF.

      Ao usar uma KDF, a função cria uma chave secreta criptograficamente forte a partir das informações passadas em *`key_str`* e qualquer salt ou informação adicional que você forneça nos outros argumentos. A chave derivada é usada para criptografar e descriptografar os dados, e permanece na instância do Servidor MySQL, não sendo acessível aos usuários. Usar uma KDF é altamente recomendado, pois fornece melhor segurança do que especificar sua própria chave pré-fabricada ou derivá-la por um método mais simples ao usar a função.

      Se você não estiver usando uma KDF, para um comprimento de chave de 128 bits, a maneira mais segura de passar uma chave para o argumento *`key_str`* é criar um valor de 128 bits verdadeiramente aleatório e passá-lo como um valor binário. Por exemplo:

      ```sql
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

      Uma passphrase pode ser usada para gerar uma chave AES aplicando hashing na passphrase. Por exemplo:

      ```sql
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

      Se você exceder o comprimento máximo de chave de 128 bits, um warning será retornado. Se você não estiver usando uma KDF, não passe uma senha ou passphrase diretamente para *`key_str`*, aplique hash nela primeiro. Versões anteriores desta documentação sugeriam a abordagem anterior, mas ela não é mais recomendada, pois os exemplos mostrados aqui são mais seguros.

  *`init_vector`* : Um initialization vector, para modos de criptografia de bloco que o exigem. A variável de sistema `block_encryption_mode` controla o modo. Para a mesma instância de dados, use o mesmo valor de *`init_vector`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

      Nota

      Se você estiver usando uma KDF, você deve especificar um initialization vector ou uma string nula para este argumento, a fim de acessar os argumentos posteriores para definir a KDF.

      Para os modos que exigem um initialization vector, ele deve ter 16 bytes ou mais (bytes em excesso de 16 são ignorados). Ocorre um erro se *`init_vector`* estiver faltando. Para os modos que não exigem um initialization vector, ele é ignorado e um warning é gerado se *`init_vector`* for especificado, a menos que você esteja usando uma KDF.

      O valor padrão para a variável de sistema `block_encryption_mode` é `aes-128-ecb`, ou modo ECB, que não requer um initialization vector. Os modos alternativos de criptografia de bloco permitidos CBC, CFB1, CFB8, CFB128 e OFB exigem um initialization vector.

      Uma string aleatória de bytes para usar no initialization vector pode ser produzida chamando `RANDOM_BYTES(16)`.

  *`kdf_name`* : O nome da função de derivação de chave (KDF) para criar uma chave a partir do material de chave de entrada passado em *`key_str`*, e outros argumentos conforme apropriado para a KDF. Este argumento opcional está disponível a partir do MySQL 5.7.40.

      Para a mesma instância de dados, use o mesmo valor de *`kdf_name`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. Ao especificar *`kdf_name`*, você deve especificar *`init_vector`*, usando um initialization vector válido ou uma string nula se o modo de criptografia não exigir um initialization vector.

      Os seguintes valores são suportados:

      `hkdf` : HKDF, que está disponível a partir do OpenSSL 1.1.0. HKDF extrai uma chave pseudoaleatória do material de chave e, em seguida, a expande em chaves adicionais. Com HKDF, você pode especificar um salt opcional (*`salt`*) e informações específicas de contexto, como detalhes da aplicação (*`info`*), para incluir no material de chave.

      `pbkdf2_hmac` : PBKDF2, que está disponível a partir do OpenSSL 1.0.2. PBKDF2 aplica uma função pseudoaleatória ao material de chave e repete este processo um grande número de vezes para produzir a chave. Com PBKDF2, você pode especificar um salt opcional (*`salt`*) para incluir no material de chave e definir o número de iterations usadas para produzir a chave (*`iterations`*).

      Neste exemplo, HKDF é especificado como a função de derivação de chave, e um salt e informações de contexto são fornecidos. O argumento para o initialization vector é incluído, mas é uma string vazia:

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

      Neste exemplo, PBKDF2 é especificado como a função de derivação de chave, um salt é fornecido e o número de iterations é dobrado em relação ao mínimo recomendado:

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

  *`salt`* : Um salt a ser passado para a função de derivação de chave (KDF). Este argumento opcional está disponível a partir do MySQL 5.7.40. Tanto HKDF quanto PBKDF2 podem usar salts, e seu uso é recomendado para ajudar a prevenir ataques baseados em dicionários de senhas comuns ou rainbow tables.

      Um salt consiste em dados aleatórios, que, por segurança, devem ser diferentes para cada operação de criptografia. Uma string aleatória de bytes para usar como salt pode ser produzida chamando `RANDOM_BYTES()`. Este exemplo produz um salt de 64 bits:

      ```sql
      SET @salt = RANDOM_BYTES(8);
      ```

      Para a mesma instância de dados, use o mesmo valor de *`salt`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`. O salt pode ser armazenado com segurança junto com os dados criptografados.

  *`info`* : Informações específicas de contexto para HKDF incluir no material de chave, como informações sobre a aplicação. Este argumento opcional está disponível a partir do MySQL 5.7.40 quando você especifica `hkdf` como o nome da KDF. HKDF adiciona esta informação ao material de chave especificado em *`key_str`* e ao salt especificado em *`salt`* para produzir a chave.

      Para a mesma instância de dados, use o mesmo valor de *`info`* para criptografia com `AES_ENCRYPT()` e descriptografia com `AES_DECRYPT()`.

  *`iterations`* : A contagem de iterations para PBKDF2 usar ao produzir a chave. Este argumento opcional está disponível a partir do MySQL 5.7.40 quando você especifica `pbkdf2_hmac` como o nome da KDF. Uma contagem maior oferece maior resistência a ataques de força bruta, pois tem um custo computacional maior para o atacante, mas o mesmo é necessariamente verdade para o processo de derivação de chave. O padrão, se você não especificar este argumento, é 1000, que é o mínimo recomendado pelo padrão OpenSSL.

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

  Comprime uma string e retorna o resultado como uma string binária. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão, como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`. A string comprimida pode ser descomprimida com `UNCOMPRESS()`.

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

  O conteúdo da string comprimida é armazenado da seguinte forma:

  + Strings vazias são armazenadas como strings vazias.
  + Strings não vazias são armazenadas como um comprimento de 4 bytes da string não compactada (byte baixo primeiro), seguido pela string compactada. Se a string terminar com espaço, um caractere `.` extra é adicionado para evitar problemas com o corte de espaço final (endspace trimming), caso o resultado seja armazenado em uma coluna `CHAR` ou `VARCHAR`. (No entanto, o uso de tipos de dados de string não binários, como `CHAR` ou `VARCHAR`, para armazenar strings compactadas não é recomendado de qualquer forma, pois pode ocorrer conversão de conjunto de caracteres. Use uma coluna de string binária `VARBINARY` ou `BLOB` em vez disso.)

  Se `COMPRESS()` for invocado a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* `DECODE(crypt_str,pass_str)`

  `DECODE()` descriptografa a string criptografada *`crypt_str`* usando *`pass_str`* como a senha. *`crypt_str`* deve ser uma string retornada de `ENCODE()`.

  Nota

  As funções `ENCODE()` e `DECODE()` estão obsoletas no MySQL 5.7 e não devem mais ser usadas. Espere que sejam removidas em uma futura versão do MySQL. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

* `DES_DECRYPT(crypt_str[,key_str])`

  Descriptografa uma string criptografada com `DES_ENCRYPT()`. Se ocorrer um erro, esta função retorna `NULL`.

  Esta função só funciona se o MySQL tiver sido configurado com suporte a SSL. Consulte Seção 6.3, “Using Encrypted Connections”.

  Se nenhum argumento *`key_str`* for fornecido, `DES_DECRYPT()` examina o primeiro byte da string criptografada para determinar o número da chave DES que foi usado para criptografar a string original e, em seguida, lê a chave do arquivo de chaves DES para descriptografar a mensagem. Para que isso funcione, o usuário deve ter o privilégio `SUPER`. O arquivo de chave pode ser especificado com a opção de servidor `--des-key-file`.

  Se você passar um argumento *`key_str`* para esta função, essa string será usada como chave para descriptografar a mensagem.

  Se o argumento *`crypt_str`* não parecer ser uma string criptografada, o MySQL retorna o *`crypt_str`* fornecido.

  Nota

  As funções `DES_ENCRYPT()` e `DES_DECRYPT()` estão obsoletas no MySQL 5.7, foram removidas no MySQL 8.0 e não devem mais ser usadas. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

* `DES_ENCRYPT(str[,{key_num|key_str}])`

  Criptografa a string com a chave fornecida usando o algoritmo Triple-DES.

  Esta função só funciona se o MySQL tiver sido configurado com suporte a SSL. Consulte Seção 6.3, “Using Encrypted Connections”.

  A chave de criptografia a ser usada é escolhida com base no segundo argumento de `DES_ENCRYPT()`, se um tiver sido fornecido. Sem argumento, a primeira chave do arquivo de chaves DES é usada. Com um argumento *`key_num`*, o número da chave fornecido (0 a 9) do arquivo de chaves DES é usado. Com um argumento *`key_str`*, a string chave fornecida é usada para criptografar *`str`*.

  O arquivo de chave pode ser especificado com a opção de servidor `--des-key-file`.

  A string de retorno é uma string binária onde o primeiro caractere é `CHAR(128 | key_num)`. Se ocorrer um erro, `DES_ENCRYPT()` retorna `NULL`.

  O 128 é adicionado para facilitar o reconhecimento de uma chave criptografada. Se você usar uma string como chave, *`key_num`* é 127.

  O comprimento da string para o resultado é dado por esta fórmula:

  ```sql
  new_len = orig_len + (8 - (orig_len % 8)) + 1
  ```

  Cada linha no arquivo de chaves DES tem o seguinte formato:

  ```sql
  key_num des_key_str
  ```

  Cada valor *`key_num`* deve ser um número no intervalo de `0` a `9`. As linhas no arquivo podem estar em qualquer ordem. *`des_key_str`* é a string que é usada para criptografar a mensagem. Deve haver pelo menos um espaço entre o número e a chave. A primeira chave é a chave padrão que é usada se você não especificar nenhum argumento de chave para `DES_ENCRYPT()`.

  Você pode instruir o MySQL a ler novos valores de chave do arquivo de chave com o statement `FLUSH DES_KEY_FILE`. Isso requer o privilégio `RELOAD`.

  Um benefício de ter um conjunto de chaves padrão é que ele oferece às aplicações uma maneira de verificar a existência de valores de coluna criptografados, sem dar ao usuário final o direito de descriptografar esses valores.

  Nota

  As funções `DES_ENCRYPT()` e `DES_DECRYPT()` estão obsoletas no MySQL 5.7, foram removidas no MySQL 8.0 e não devem mais ser usadas. Considere usar `AES_ENCRYPT()` e `AES_DECRYPT()` em vez disso.

  ```sql
  mysql> SELECT customer_address FROM customer_table
       > WHERE crypted_credit_card = DES_ENCRYPT('credit_card_number');
  ```

  Se `DES_ENCRYPT()` for invocada a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* `ENCODE(str,pass_str)`

  `ENCODE()` criptografa *`str`* usando *`pass_str`* como a senha. O resultado é uma string binária do mesmo comprimento que *`str`*. Para descriptografar o resultado, use `DECODE()`.

  Nota

  As funções `ENCODE()` e `DECODE()` estão obsoletas no MySQL 5.7 e não devem mais ser usadas. Espere que sejam removidas em uma futura versão do MySQL.

  Se você ainda precisar usar `ENCODE()`, um valor salt deve ser usado com ela para reduzir o risco. Por exemplo:

  ```sql
  ENCODE('cleartext', CONCAT('my_random_salt','my_secret_password'))
  ```

  Um novo valor salt aleatório deve ser usado sempre que uma senha for atualizada.

  Se `ENCODE()` for invocado a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* `ENCRYPT(str[,salt])`

  Criptografa *`str`* usando a chamada de sistema Unix `crypt()` e retorna uma string binária. O argumento *`salt`* deve ser uma string com pelo menos dois caracteres, caso contrário, o resultado é `NULL`. Se nenhum argumento *`salt`* for fornecido, um valor aleatório é usado.

  Nota

  A função `ENCRYPT()` está obsoleta no MySQL 5.7, foi removida no MySQL 8.0 e não deve mais ser usada. Para hashing unidirecional, considere usar `SHA2()` em vez disso.

  ```sql
  mysql> SELECT ENCRYPT('hello');
          -> 'VxuFAJXVARROc'
  ```

  `ENCRYPT()` ignora todos os caracteres, exceto os primeiros oito de *`str`*, pelo menos em alguns sistemas. Este comportamento é determinado pela implementação da chamada de sistema `crypt()` subjacente.

  O uso de `ENCRYPT()` com os conjuntos de caracteres multibyte `ucs2`, `utf16`, `utf16le` ou `utf32` não é recomendado, pois a chamada de sistema espera uma string terminada por um byte zero.

  Se `crypt()` não estiver disponível em seu sistema (como é o caso do Windows), `ENCRYPT()` sempre retorna `NULL`.

  Se `ENCRYPT()` for invocado a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* `MD5(str)`

  Calcula um checksum MD5 de 128 bits para a string. O valor é retornado como uma string de 32 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. O valor de retorno pode, por exemplo, ser usado como uma hash key. Consulte as notas no início desta seção sobre o armazenamento eficiente de valores hash.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  ```sql
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

  Este é o “RSA Data Security, Inc. MD5 Message-Digest Algorithm.”

  Consulte a nota referente ao algoritmo MD5 no início desta seção.

* `PASSWORD(str)`

  Nota

  Esta função está obsoleta no MySQL 5.7 e foi removida no MySQL 8.0.

  Retorna uma string de senha hashed calculada a partir da senha em texto simples (cleartext) *`str`*. O valor de retorno é uma string no conjunto de caracteres da conexão, ou `NULL` se o argumento for `NULL`. Esta função é a interface SQL para o algoritmo usado pelo servidor para criptografar senhas do MySQL para armazenamento na grant table `mysql.user`.

  A variável de sistema `old_passwords` controla o método de hashing de senha usado pela função `PASSWORD()`. Ela também influencia o hashing de senha realizado pelos statements `CREATE USER` e `GRANT` que especificam uma senha usando uma cláusula `IDENTIFIED BY`.

  A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

  <table summary="Para cada método de hashing de senha, o valor permitido de old_passwords e quais plugins de autenticação usam o método de hashing"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Método de Hashing de Senha</th> <th>Valor de old_passwords</th> <th>Plugin de Autenticação Associado</th> </tr></thead><tbody><tr> <th>Hashing nativo do MySQL 4.1</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>Hashing SHA-256</th> <td>2</td> <td><code>sha256_password</code></td> </tr></tbody></table>

  O hashing de senha SHA-256 (`old_passwords=2`) usa um valor salt aleatório, o que torna o resultado de `PASSWORD()` não determinístico. Consequentemente, statements que usam esta função não são seguros para replicação baseada em statement e não podem ser armazenados no Query Cache.

  A criptografia realizada por `PASSWORD()` é unidirecional (não reversível), mas não é o mesmo tipo de criptografia usado para senhas Unix.

  Nota

  `PASSWORD()` é usada pelo sistema de autenticação no MySQL Server; você *não* deve usá-la em suas próprias aplicações. Para esse propósito, considere uma função mais segura como `SHA2()` em vez disso. Consulte também RFC 2195, seção 2 (Challenge-Response Authentication Mechanism (CRAM)), para mais informações sobre o tratamento seguro de senhas e autenticação em suas aplicações.

  Cuidado

  Em algumas circunstâncias, statements que invocam `PASSWORD()` podem ser registrados nos logs do servidor ou no lado do cliente em um arquivo de histórico como `~/.mysql_history`, o que significa que senhas em texto simples (cleartext) podem ser lidas por qualquer pessoa que tenha acesso de leitura a essa informação. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte Seção 6.1.2.3, “Passwords and Logging”. Para informações semelhantes sobre o log do lado do cliente, consulte Seção 4.5.1.3, “mysql Client Logging”.

* `RANDOM_BYTES(len)`

  Esta função retorna uma string binária de *`len`* bytes aleatórios gerados usando o gerador de números aleatórios da biblioteca SSL. Os valores permitidos de *`len`* variam de 1 a 1024. Para valores fora desse intervalo, ocorre um erro.

  `RANDOM_BYTES()` pode ser usada para fornecer o initialization vector para as funções `AES_DECRYPT()` e `AES_ENCRYPT()`. Para uso nesse contexto, *`len`* deve ser de pelo menos 16. Valores maiores são permitidos, mas bytes em excesso de 16 são ignorados.

  `RANDOM_BYTES()` gera um valor aleatório, o que torna seu resultado não determinístico. Consequentemente, statements que usam esta função são inseguras para replicação baseada em statement e não podem ser armazenadas no Query Cache.

  Se `RANDOM_BYTES()` for invocada a partir do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”.

* `SHA1(str)`, `SHA(str)`

  Calcula um checksum SHA-1 de 160 bits para a string, conforme descrito na RFC 3174 (Secure Hash Algorithm). O valor é retornado como uma string de 40 dígitos hexadecimais, ou `NULL` se o argumento for `NULL`. Um dos possíveis usos para esta função é como uma hash key. Consulte as notas no início desta seção sobre o armazenamento eficiente de valores hash.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  ```sql
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

  `SHA1()` pode ser considerada um equivalente criptograficamente mais seguro de `MD5()`. No entanto, consulte a nota referente aos algoritmos MD5 e SHA-1 no início desta seção.

* `SHA2(str, hash_length)`

  Calcula a família SHA-2 de hash functions (SHA-224, SHA-256, SHA-384 e SHA-512). O primeiro argumento é a string de texto simples (plaintext) a ser hashed. O segundo argumento indica o comprimento de bit desejado do resultado, que deve ter um valor de 224, 256, 384, 512 ou 0 (que é equivalente a 256). Se qualquer um dos argumentos for `NULL` ou o comprimento do hash não for um dos valores permitidos, o valor de retorno é `NULL`. Caso contrário, o resultado da função é um valor hash contendo o número desejado de bits. Consulte as notas no início desta seção sobre o armazenamento eficiente de valores hash.

  O valor de retorno é uma string no conjunto de caracteres da conexão.

  ```sql
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  Esta função só funciona se o MySQL tiver sido configurado com suporte a SSL. Consulte Seção 6.3, “Using Encrypted Connections”.

  `SHA2()` pode ser considerada criptograficamente mais segura do que `MD5()` ou `SHA1()`.

* `UNCOMPRESS(string_to_uncompress)`

  Descomprime uma string compactada pela função `COMPRESS()`. Se o argumento não for um valor compactado, o resultado é `NULL`. Esta função exige que o MySQL tenha sido compilado com uma biblioteca de compressão como `zlib`. Caso contrário, o valor de retorno é sempre `NULL`.

  ```sql
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* `UNCOMPRESSED_LENGTH(compressed_string)`

  Retorna o comprimento que a string compactada tinha antes de ser compactada.

  ```sql
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* `VALIDATE_PASSWORD_STRENGTH(str)`

  Dado um argumento que representa uma senha em texto simples (plaintext), esta função retorna um inteiro para indicar o quão forte é a senha. O valor de retorno varia de 0 (fraca) a 100 (forte).

  A avaliação de senha por `VALIDATE_PASSWORD_STRENGTH()` é feita pelo plugin `validate_password`. Se esse plugin não estiver instalado, a função sempre retorna 0. Para obter informações sobre a instalação de `validate_password`, consulte Seção 6.4.3, “The Password Validation Plugin”. Para examinar ou configurar os parâmetros que afetam o teste de senha, verifique ou defina as variáveis de sistema implementadas por `validate_password`. Consulte Seção 6.4.3.2, “Password Validation Plugin Options and Variables”.

  A senha é submetida a testes cada vez mais rigorosos e o valor de retorno reflete quais testes foram satisfeitos, conforme mostrado na tabela a seguir. Além disso, se a variável de sistema `validate_password_check_user_name` estiver habilitada e a senha corresponder ao user name, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como outras variáveis de sistema `validate_password` estiverem configuradas.

  <table summary="Testes de senha da função VALIDATE_PASSWORD_STRENGTH() e os valores retornados por cada teste de senha."><col style="width: 60%"/><col style="width: 20%"/><thead><tr> <th>Teste de Senha</th> <th>Valor de Retorno</th> </tr></thead><tbody><tr> <td>Comprimento &lt; 4</td> <td>0</td> </tr><tr> <td>Comprimento ≥ 4 e &lt; <code>validate_password_length</code></td> <td>25</td> </tr><tr> <td>Satisfaz política 1 (BAIXA)</td> <td>50</td> </tr><tr> <td>Satisfaz política 2 (MÉDIA)</td> <td>75</td> </tr><tr> <td>Satisfaz política 3 (FORTE)</td> <td>100</td> </tr></tbody></table>