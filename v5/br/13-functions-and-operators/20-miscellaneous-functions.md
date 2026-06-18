## 12.20 Funções Diversas

**Tabela 12.26 Funções Diversas**

<table frame="box" rules="all" summary="Uma referência que lista funções diversas."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ANY_VALUE()</code></td> <td> Suprime a rejeição de valor do ONLY_FULL_GROUP_BY </td> </tr><tr><td><code>DEFAULT()</code></td> <td> Retorna o valor default para uma coluna de tabela </td> </tr><tr><td><code>INET_ATON()</code></td> <td> Retorna o valor numérico de um endereço IP </td> </tr><tr><td><code>INET_NTOA()</code></td> <td> Retorna o endereço IP a partir de um valor numérico </td> </tr><tr><td><code>INET6_ATON()</code></td> <td> Retorna o valor numérico de um endereço IPv6 </td> </tr><tr><td><code>INET6_NTOA()</code></td> <td> Retorna o endereço IPv6 a partir de um valor numérico </td> </tr><tr><td><code>IS_IPV4()</code></td> <td> Se o argumento é um endereço IPv4 </td> </tr><tr><td><code>IS_IPV4_COMPAT()</code></td> <td> Se o argumento é um endereço compatível com IPv4 </td> </tr><tr><td><code>IS_IPV4_MAPPED()</code></td> <td> Se o argumento é um endereço mapeado para IPv4 </td> </tr><tr><td><code>IS_IPV6()</code></td> <td> Se o argumento é um endereço IPv6 </td> </tr><tr><td><code>NAME_CONST()</code></td> <td> Faz com que a coluna tenha o nome fornecido </td> </tr><tr><td><code>SLEEP()</code></td> <td> Pausa por um número de segundos </td> </tr><tr><td><code>UUID()</code></td> <td> Retorna um Identificador Único Universal (UUID) </td> </tr><tr><td><code>UUID_SHORT()</code></td> <td> Retorna um identificador universal com valor inteiro </td> </tr><tr><td><code>VALUES()</code></td> <td> Define os valores a serem usados durante um INSERT </td> </tr></tbody></table>

* `ANY_VALUE(arg)`

  Esta função é útil para `GROUP BY` queries quando o SQL mode `ONLY_FULL_GROUP_BY` está habilitado, para casos em que o MySQL rejeita uma Query que você sabe ser válida por razões que o MySQL não consegue determinar. O valor de retorno da função e o tipo são os mesmos que o valor de retorno e o tipo do seu argumento, mas o resultado da função não é verificado quanto ao SQL mode `ONLY_FULL_GROUP_BY`.

  Por exemplo, se `name` é uma coluna não indexada, a seguinte Query falha com `ONLY_FULL_GROUP_BY` habilitado:

  ```sql
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  A falha ocorre porque `address` é uma coluna não agregada que não está nomeada entre as colunas do `GROUP BY` nem é funcionalmente dependente delas. Como resultado, o valor de `address` para linhas dentro de cada grupo `name` é não determinístico. Existem várias maneiras de fazer com que o MySQL aceite a Query:

  + Altere a tabela para tornar `name` uma Primary Key ou uma coluna `UNIQUE NOT NULL`. Isso permite que o MySQL determine que `address` é funcionalmente dependente de `name`; ou seja, `address` é determinado de forma única por `name`. (Esta técnica é inaplicável se `NULL` deve ser permitido como um valor `name` válido.)

  + Use `ANY_VALUE()` para se referir a `address`:

    ```sql
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    Neste caso, o MySQL ignora o não determinismo dos valores de `address` dentro de cada grupo `name` e aceita a Query. Isso pode ser útil se você simplesmente não se importa com qual valor de uma coluna não agregada é escolhido para cada grupo. `ANY_VALUE()` não é uma função de agregação, diferente de funções como `SUM()` ou `COUNT()`. Ela simplesmente atua para suprimir o teste de não determinismo.

  + Desabilite `ONLY_FULL_GROUP_BY`. Isso é equivalente a usar `ANY_VALUE()` com `ONLY_FULL_GROUP_BY` habilitado, conforme descrito no item anterior.

  `ANY_VALUE()` também é útil se a dependência funcional existir entre colunas, mas o MySQL não puder determiná-la. A seguinte Query é válida porque `age` é funcionalmente dependente da coluna de agrupamento `age-1`, mas o MySQL não consegue perceber isso e rejeita a Query com `ONLY_FULL_GROUP_BY` habilitado:

  ```sql
  SELECT age FROM t GROUP BY age-1;
  ```

  Para fazer com que o MySQL aceite a Query, use `ANY_VALUE()`:

  ```sql
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

  `ANY_VALUE()` pode ser usado para Queries que se referem a funções de agregação na ausência de uma cláusula `GROUP BY`:

  ```sql
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

  Sem `GROUP BY`, existe um único grupo e é não determinístico qual valor de `name` escolher para o grupo. `ANY_VALUE()` instrui o MySQL a aceitar a Query:

  ```sql
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

  Pode ser que, devido a alguma propriedade de um determinado conjunto de dados, você saiba que uma coluna não agregada selecionada é efetivamente funcionalmente dependente de uma coluna `GROUP BY`. Por exemplo, um aplicativo pode impor a unicidade de uma coluna em relação a outra. Neste caso, usar `ANY_VALUE()` para a coluna efetivamente funcionalmente dependente pode fazer sentido.

  Para discussão adicional, consulte a Seção 12.19.3, “Tratamento de GROUP BY pelo MySQL”.

* `DEFAULT(col_name)`

  Retorna o valor default para uma coluna de tabela. Um erro ocorre se a coluna não tiver um valor default.

  ```sql
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

* `FORMAT(X,D)`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado para *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 12.8, “Funções e Operadores de String”.

* `INET_ATON(expr)`

  Dada a representação quad-pontilhada de um endereço de rede IPv4 como uma string, retorna um inteiro que representa o valor numérico do endereço em *network byte order* (big endian). `INET_ATON()` retorna `NULL` se não entender seu argumento.

  ```sql
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  Para este exemplo, o valor de retorno é calculado como 10×256³ + 0×256² + 5×256 + 9.

  `INET_ATON()` pode ou não retornar um resultado não-`NULL` para endereços IP de formato curto (como `'127.1'` como uma representação de `'127.0.0.1'`). Por causa disso, `INET_ATON()` não deve ser usado para tais endereços.

  Nota

  Para armazenar valores gerados por `INET_ATON()`, use uma coluna `INT UNSIGNED` em vez de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), que é assinado. Se você usar uma coluna assinada, valores correspondentes a endereços IP para os quais o primeiro octeto é maior que 127 não podem ser armazenados corretamente. Consulte a Seção 11.1.7, “Tratamento de Valores Fora do Intervalo e Overflow”.

* `INET_NTOA(expr)`

  Dado um endereço de rede IPv4 numérico em *network byte order*, retorna a representação de string quad-pontilhada do endereço como uma string no *character set* da conexão. `INET_NTOA()` retorna `NULL` se não entender seu argumento.

  ```sql
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

* `INET6_ATON(expr)`

  Dado um endereço de rede IPv6 ou IPv4 como uma string, retorna uma string binária que representa o valor numérico do endereço em *network byte order* (big endian). Como endereços IPv6 em formato numérico requerem mais bytes do que o maior tipo inteiro, a representação retornada por esta função tem o tipo de dado `VARBINARY`: `VARBINARY(16)` para endereços IPv6 e `VARBINARY(4)` para endereços IPv4. Se o argumento não for um endereço válido, `INET6_ATON()` retorna `NULL`.

  Os exemplos a seguir usam `HEX()` para exibir o resultado de `INET6_ATON()` em formato imprimível:

  ```sql
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```

  `INET6_ATON()` observa várias restrições sobre argumentos válidos. Elas são fornecidas na lista a seguir, juntamente com exemplos.

  + Um ID de zona final (*trailing zone ID*) não é permitido, como em `fe80::3%1` ou `fe80::3%eth0`.

  + Uma máscara de rede final (*trailing network mask*) não é permitida, como em `2001:45f:3:ba::/64` ou `198.51.100.0/24`.

  + Para valores que representam endereços IPv4, apenas endereços sem classe (*classless addresses*) são suportados. Endereços com classe (*classful addresses*), como `198.51.1`, são rejeitados. Um número de porta final não é permitido, como em `198.51.100.2:8080`. Números hexadecimais em componentes de endereço não são permitidos, como em `198.0xa0.1.2`. Números octais não são suportados: `198.51.010.1` é tratado como `198.51.10.1`, não `198.51.8.1`. Estas restrições de IPv4 também se aplicam a endereços IPv6 que têm partes de endereço IPv4, como endereços compatíveis com IPv4 ou mapeados para IPv4.

  Para converter um endereço IPv4 *`expr`* representado em formato numérico como um valor `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um endereço IPv6 representado em formato numérico como um valor `VARBINARY`, use esta expressão:

  ```sql
  INET6_ATON(INET_NTOA(expr))
  ```

  Por exemplo:

  ```sql
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

  Se `INET6_ATON()` for invocado de dentro do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `INET6_NTOA(expr)`

  Dado um endereço de rede IPv6 ou IPv4 representado em formato numérico como uma string binária, retorna a representação de string do endereço como uma string no *character set* da conexão. Se o argumento não for um endereço válido, `INET6_NTOA()` retorna `NULL`.

  `INET6_NTOA()` tem estas propriedades:

  + Não usa funções do sistema operacional para realizar conversões, portanto, a string de saída é independente de plataforma.

  + A string de retorno tem um comprimento máximo de 39 (4 x 8 + 7). Dada esta declaração:

    ```sql
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```

    A tabela resultante teria esta definição:

    ```sql
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8 DEFAULT NULL);
    ```

  + A string de retorno usa letras minúsculas para endereços IPv6.

  ```sql
  mysql> SELECT INET6_NTOA(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(INET6_ATON('10.0.5.9'));
          -> '10.0.5.9'

  mysql> SELECT INET6_NTOA(UNHEX('FDFE0000000000005A55CAFFFEFA9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(UNHEX('0A000509'));
          -> '10.0.5.9'
  ```

  Se `INET6_NTOA()` for invocado de dentro do cliente **mysql**, as strings binárias serão exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `IS_IPV4(expr)`

  Retorna 1 se o argumento for um endereço IPv4 válido especificado como uma string, 0 caso contrário.

  ```sql
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

  Para um determinado argumento, se `IS_IPV4()` retornar 1, `INET_ATON()` (e `INET6_ATON()`) retornará um valor que não é `NULL`. A afirmação inversa não é verdadeira: Em alguns casos, `INET_ATON()` retorna um valor diferente de `NULL` quando `IS_IPV4()` retorna 0.

  Conforme implícito nas observações anteriores, `IS_IPV4()` é mais rigoroso que `INET_ATON()` sobre o que constitui um endereço IPv4 válido, então pode ser útil para aplicações que precisam realizar verificações fortes contra valores inválidos. Alternativamente, use `INET6_ATON()` para converter endereços IPv4 para o formato interno e verifique se o resultado é `NULL` (o que indica um endereço inválido). `INET6_ATON()` é igualmente rigoroso como `IS_IPV4()` sobre a verificação de endereços IPv4.

* `IS_IPV4_COMPAT(expr)`

  Esta função recebe um endereço IPv6 representado em formato numérico como uma string binária, conforme retornado por `INET6_ATON()`. Retorna 1 se o argumento for um endereço IPv6 válido compatível com IPv4, 0 caso contrário. Endereços compatíveis com IPv4 têm o formato `::ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

  A parte IPv4 de um endereço compatível com IPv4 também pode ser representada usando notação hexadecimal. Por exemplo, `198.51.100.1` tem este valor hexadecimal bruto:

  ```sql
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```

  Expresso em formato compatível com IPv4, `::198.51.100.1` é equivalente a `::c0a8:0001` ou (sem zeros à esquerda) `::c0a8:1`

  ```sql
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV4_MAPPED(expr)`

  Esta função recebe um endereço IPv6 representado em formato numérico como uma string binária, conforme retornado por `INET6_ATON()`. Retorna 1 se o argumento for um endereço IPv6 válido mapeado para IPv4, 0 caso contrário. Endereços mapeados para IPv4 têm o formato `::ffff:ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```

  Assim como em `IS_IPV4_COMPAT()`, a parte IPv4 de um endereço mapeado para IPv4 também pode ser representada usando notação hexadecimal:

  ```sql
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV6(expr)`

  Retorna 1 se o argumento for um endereço IPv6 válido especificado como uma string, 0 caso contrário. Esta função não considera endereços IPv4 como endereços IPv6 válidos.

  ```sql
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

  Para um determinado argumento, se `IS_IPV6()` retornar 1, `INET6_ATON()` retorna um valor que não é `NULL`.

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  Esta função é útil para o controle da sincronização source-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log do source. O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar até a posição especificada. A função retorna `NULL` se o Thread SQL da replica não for iniciado, se as informações do source da replica não forem inicializadas, se os argumentos estiverem incorretos ou se ocorrer um erro. Retorna `-1` se o *timeout* for excedido. Se o Thread SQL da replica parar enquanto `MASTER_POS_WAIT()` estiver esperando, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

  Em uma replica multithreaded, a função espera até o vencimento do limite definido pela variável de sistema `slave_checkpoint_group` ou `slave_checkpoint_period`, quando a operação de *checkpoint* é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo depois que a posição especificada foi alcançada.

  Se um valor *`timeout`* for especificado, `MASTER_POS_WAIT()` para de esperar quando *`timeout`* segundos tiverem decorrido. *`timeout`* deve ser maior ou igual a 0. (A partir do MySQL 5.7.18, quando o servidor está em execução no SQL mode *strict*, um valor *`timeout`* negativo é imediatamente rejeitado com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna **`NULL`** e levanta um *warning*.)

  O valor opcional *`channel`* permite que você nomeie a qual Replication Channel a função se aplica. Consulte a Seção 16.2.2, “Replication Channels” para mais informações.

  Esta função não é segura para replication baseada em statement. Um *warning* é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

* `NAME_CONST(name,value)`

  Retorna o valor fornecido. Quando usado para produzir uma coluna de *result set*, `NAME_CONST()` faz com que a coluna tenha o nome fornecido. Os argumentos devem ser constantes.

  ```sql
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

  Esta função é para uso interno apenas. O servidor a usa ao gravar statements de stored programs que contêm referências a variáveis de programa locais, conforme descrito na Seção 23.7, “Stored Program Binary Logging”. Você pode ver esta função na saída de **mysqlbinlog**.

  Para suas aplicações, você pode obter exatamente o mesmo resultado que no exemplo mostrado acima usando um simples *aliasing*, assim:

  ```sql
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

  Consulte a Seção 13.2.9, “Declaração SELECT”, para obter mais informações sobre aliases de coluna.

* `SLEEP(duration)`

  Pausa (*sleeps*) pelo número de segundos dado pelo argumento *`duration`*, então retorna 0. A duração pode ter uma parte fracionária. Se o argumento for `NULL` ou negativo, `SLEEP()` produz um *warning*, ou um erro no SQL mode *strict*.

  Quando o *sleep* retorna normalmente (sem interrupção), ele retorna 0:

  ```sql
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```

  Quando `SLEEP()` é a única coisa invocada por uma Query que é interrompida, ele retorna 1 e a Query em si não retorna erro. Isso é verdade se a Query for eliminada (*killed*) ou se o *timeout* for atingido:

  + Este statement é interrompido usando `KILL QUERY` de outra sessão:

    ```sql
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  + Este statement é interrompido por *timeout*:

    ```sql
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  Quando `SLEEP()` é apenas parte de uma Query que é interrompida, a Query retorna um erro:

  + Este statement é interrompido usando `KILL QUERY` de outra sessão:

    ```sql
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

  + Este statement é interrompido por *timeout*:

    ```sql
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```

  Esta função não é segura para replication baseada em statement. Um *warning* é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

* `UUID()`

  Retorna um Identificador Único Universal (UUID) gerado de acordo com a RFC 4122, “A Universally Unique IDentifier (UUID) URN Namespace” (<http://www.ietf.org/rfc/rfc4122.txt>).

  Um UUID é projetado como um número que é globalmente único no espaço e no tempo. Espera-se que duas chamadas a `UUID()` gerem dois valores diferentes, mesmo que essas chamadas sejam realizadas em dois dispositivos separados não conectados entre si.

  Aviso

  Embora os valores `UUID()` sejam destinados a serem únicos, eles não são necessariamente indivinháveis ou imprevisíveis. Se a imprevisibilidade for necessária, os valores UUID devem ser gerados de alguma outra forma.

  `UUID()` retorna um valor que está em conformidade com a versão 1 do UUID, conforme descrito na RFC 4122. O valor é um número de 128-bit representado como uma string `utf8` de cinco números hexadecimais no formato `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`:

  + Os três primeiros números são gerados a partir das partes baixa, média e alta de um *timestamp*. A parte alta também inclui o número de versão do UUID.

  + O quarto número preserva a unicidade temporal no caso de o valor do *timestamp* perder a monotonicidade (por exemplo, devido ao horário de verão).

  + O quinto número é um número de nó IEEE 802 que fornece unicidade espacial. Um número aleatório é substituído se este último não estiver disponível (por exemplo, porque o dispositivo host não tem uma placa Ethernet, ou é desconhecido como encontrar o endereço de hardware de uma interface no sistema operacional host). Neste caso, a unicidade espacial não pode ser garantida. No entanto, uma colisão deve ter uma probabilidade *muito* baixa.

    O endereço MAC de uma interface é levado em consideração apenas no FreeBSD, Linux e Windows. Em outros sistemas operacionais, o MySQL usa um número de 48-bit gerado aleatoriamente.

  ```sql
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

  Esta função não é segura para replication baseada em statement. Um *warning* é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

* `UUID_SHORT()`

  Retorna um identificador universal “curto” como um inteiro não assinado de 64-bit. Os valores retornados por `UUID_SHORT()` diferem dos identificadores de 128-bit em formato string retornados pela função `UUID()` e têm propriedades de unicidade diferentes. O valor de `UUID_SHORT()` é garantido como único se as seguintes condições forem válidas:

  + O valor `server_id` do servidor atual está entre 0 e 255 e é único entre seu conjunto de source e replica servers.

  + Você não atrasa o horário do sistema para o seu host de servidor entre as reinicializações do **mysqld**.

  + Você invoca `UUID_SHORT()` em média menos de 16 milhões de vezes por segundo entre as reinicializações do **mysqld**.

  O valor de retorno de `UUID_SHORT()` é construído desta forma:

  ```sql
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```

  ```sql
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```

  Nota

  `UUID_SHORT()` não funciona com replication baseada em statement.

* `VALUES(col_name)`

  Em um statement `INSERT ... ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` na cláusula `UPDATE` para se referir aos valores de coluna da porção `INSERT` do statement. Em outras palavras, `VALUES(col_name)` na cláusula `UPDATE` se refere ao valor de *`col_name`* que seria inserido, caso não tivesse ocorrido nenhum conflito de chave duplicada. Esta função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` é significativa apenas na cláusula `ON DUPLICATE KEY UPDATE` de statements `INSERT` e retorna `NULL` caso contrário. Consulte a Seção 13.2.5.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”.

  ```sql
  mysql> INSERT INTO table (a,b,c) VALUES (1,2,3),(4,5,6)
      -> ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
  ```
