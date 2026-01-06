## 12.20 Funções Diversas

**Tabela 12.26 Funções Diversas**

<table frame="box" rules="all" summary="Uma referência que lista funções diversas."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="miscellaneous-functions.html#function_any-value">[[PH_HTML_CODE_<code class="literal">NAME_CONST()</code>]</a></td> <td>Suprima a rejeição do valor ONLY_FULL_GROUP_BY</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_default">[[PH_HTML_CODE_<code class="literal">NAME_CONST()</code>]</a></td> <td>Retorne o valor padrão para uma coluna de tabela</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet-aton">[[PH_HTML_CODE_<code class="literal">UUID()</code>]</a></td> <td>Retorne o valor numérico de um endereço IP</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet-ntoa">[[PH_HTML_CODE_<code class="literal">UUID_SHORT()</code>]</a></td> <td>Retorne o endereço IP a partir de um valor numérico</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet6-aton">[[PH_HTML_CODE_<code class="literal">VALUES()</code>]</a></td> <td>Retorne o valor numérico de um endereço IPv6</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet6-ntoa">[[<code class="literal">INET6_NTOA()</code>]]</a></td> <td>Retorne o endereço IPv6 a partir de um valor numérico</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4">[[<code class="literal">IS_IPV4()</code>]]</a></td> <td>Se o argumento é um endereço IPv4</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4-compat">[[<code class="literal">IS_IPV4_COMPAT()</code>]]</a></td> <td>Se o argumento é um endereço compatível com IPv4</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4-mapped">[[<code class="literal">IS_IPV4_MAPPED()</code>]]</a></td> <td>Se o argumento é um endereço mapeado IPv4</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv6">[[<code class="literal">IS_IPV6()</code>]]</a></td> <td>Se o argumento é um endereço IPv6</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_name-const">[[<code class="literal">NAME_CONST()</code>]]</a></td> <td>Faça com que a coluna tenha o nome dado</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_sleep">[[<code class="literal">DEFAULT()</code><code class="literal">NAME_CONST()</code>]</a></td> <td>Durma por alguns segundos</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_uuid">[[<code class="literal">UUID()</code>]]</a></td> <td>Retorne um Identificador Único Universal (UUID)</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_uuid-short">[[<code class="literal">UUID_SHORT()</code>]]</a></td> <td>Retorne um identificador universal com valor inteiro</td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_values">[[<code class="literal">VALUES()</code>]]</a></td> <td>Defina os valores a serem usados durante um INSERT</td> </tr></tbody></table>

- `ANY_VALUE(arg)`

  Essa função é útil para consultas `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, para casos em que o MySQL rejeita uma consulta que você sabe que é válida por razões que o MySQL não pode determinar. O valor de retorno e o tipo da função são os mesmos do valor de retorno e do tipo de seu argumento, mas o resultado da função não é verificado para o modo SQL `ONLY_FULL_GROUP_BY`.

  Por exemplo, se `name` for uma coluna não indexada, a seguinte consulta falha com `ONLY_FULL_GROUP_BY` habilitado:

  ```sql
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  O erro ocorre porque `address` é uma coluna não agregada que não está nomeada entre as colunas `GROUP BY` nem depende funcionalmente delas. Como resultado, o valor de `address` para as linhas dentro de cada grupo `name` é não determinístico. Existem várias maneiras de fazer o MySQL aceitar a consulta:

  - Altere a tabela para tornar `name` uma chave primária ou uma coluna `NOT NULL` única. Isso permite que o MySQL determine que `address` é funcionalmente dependente de `name`; ou seja, `address` é determinado de forma única por `name`. (Essa técnica não é aplicável se `NULL` deve ser permitido como um valor válido de `name`.)

  - Use `ANY_VALUE()` para se referir a `address`:

    ```sql
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    Nesse caso, o MySQL ignora o não determinismo dos valores de `address` dentro de cada grupo de `name` e aceita a consulta. Isso pode ser útil se você simplesmente não se importar com qual valor de uma coluna não agregada será escolhido para cada grupo. `ANY_VALUE()` não é uma função agregada, ao contrário de funções como `SUM()` ou `COUNT()`. Ele simplesmente atua para suprimir o teste de não determinismo.

  - Desative `ONLY_FULL_GROUP_BY`. Isso é equivalente ao uso de `ANY_VALUE()` com `ONLY_FULL_GROUP_BY` habilitado, conforme descrito no item anterior.

  `ANY_VALUE()` também é útil se houver dependência funcional entre as colunas, mas o MySQL não puder determinar isso. A seguinte consulta é válida porque `age` depende funcionalmente da coluna de agrupamento `age-1`, mas o MySQL não consegue determinar isso e rejeita a consulta com `ONLY_FULL_GROUP_BY` habilitado:

  ```sql
  SELECT age FROM t GROUP BY age-1;
  ```

  Para fazer com que o MySQL aceite a consulta, use `ANY_VALUE()`:

  ```sql
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

  `ANY_VALUE()` pode ser usado para consultas que fazem referência a funções agregadas na ausência de uma cláusula `GROUP BY`:

  ```sql
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

  Sem `GROUP BY`, há um único grupo e não é determinado qual valor de `name` deve ser escolhido para o grupo. `ANY_VALUE()` informa ao MySQL que deve aceitar a consulta:

  ```sql
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

  Pode ser que, devido a alguma propriedade de um conjunto de dados específico, você saiba que uma coluna não agregada selecionada depende funcionalmente de uma coluna `GROUP BY`. Por exemplo, um aplicativo pode impor a unicidade de uma coluna em relação a outra. Nesse caso, usar `ANY_VALUE()` para a coluna funcionalmente dependente pode fazer sentido.

  Para uma discussão adicional, consulte a Seção 12.19.3, “Manejo do MySQL do GROUP BY”.

- `DEFAULT(col_name)`

  Retorna o valor padrão para uma coluna de tabela. Um erro ocorre se a coluna não tiver um valor padrão.

  ```sql
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

- `FORMAT(X, D)`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Para detalhes, consulte a Seção 12.8, “Funções e Operadores de String”.

- `INET_ATON(expr)`

  Dado a representação de um endereço de rede IPv4 como uma string na forma de quadrados pontilhados, retorna um inteiro que representa o valor numérico do endereço na ordem de bytes da rede (big endian). O `INET_ATON()` retorna `NULL` se não entender o argumento.

  ```sql
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  Para este exemplo, o valor de retorno é calculado como 10 × 2563 + 0 × 2562 + 5 × 256 + 9.

  `INET_ATON()` pode ou não retornar um resultado que não seja `NULL` para endereços IP de curta forma (como `'127.1'` como representação de `'127.0.0.1'`). Por isso, `INET_ATON()`a não deve ser usado para esses endereços.

  Nota

  Para armazenar valores gerados por `INET_ATON()`, use uma coluna `INT UNSIGNED` em vez de `INT` (INTEIRO, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), que é assinado. Se você usar uma coluna assinada, os valores correspondentes a endereços IP para os quais o primeiro octeto é maior que 127 não podem ser armazenados corretamente. Veja a Seção 11.1.7, “Tratamento de Saída de Faixa e Transbordamento”.

- `INET_NTOA(expr)`

  Dado um endereço de rede IPv4 numérico na ordem de bytes da rede, retorna a representação da string de quadrículas do endereço como uma string no conjunto de caracteres de conexão. `INET_NTOA()` retorna `NULL` se não entender o argumento.

  ```sql
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

- `INET6_ATON(expr)`

  Dado um endereço de rede IPv6 ou IPv4 como uma string, retorna uma string binária que representa o valor numérico do endereço na ordem de bytes da rede (big endian). Como os endereços IPv6 de formato numérico requerem mais bytes do que o maior tipo de inteiro, a representação retornada por essa função tem o tipo de dados `VARBINARY`: `VARBINARY(16)` para endereços IPv6 e `VARBINARY(4)` para endereços IPv4. Se o argumento não for um endereço válido, `INET6_ATON()` retorna `NULL`.

  Os exemplos a seguir usam `HEX()` para exibir o resultado da função `INET6_ATON()` em formato imprimível:

  ```sql
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```

  `INET6_ATON()` observa várias restrições sobre os argumentos válidos. Essas restrições estão listadas a seguir, juntamente com exemplos.

  - Não é permitido um ID de zona de tráfego, como `fe80::3%1` ou `fe80::3%eth0`.

  - Uma máscara de rede de derivação não é permitida, como em `2001:45f:3:ba::/64` ou `198.51.100.0/24`.

  - Para valores que representam endereços IPv4, apenas endereços sem classe são suportados. Endereços classe-baseados, como `198.51.1`, são rejeitados. Um número de porta final não é permitido, como em `198.51.100.2:8080`. Números hexadecimais em componentes de endereço não são permitidos, como em `198.0xa0.1.2`. Números octal não são suportados: `198.51.010.1` é tratado como `198.51.10.1`, não como `198.51.8.1`. Essas restrições do IPv4 também se aplicam aos endereços IPv6 que têm partes de endereço IPv4, como endereços compatíveis com IPv4 ou mapeados com IPv4.

  Para converter um endereço IPv4 *`expr`* representado em formato numérico como um valor de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para um endereço IPv6 representado em formato numérico como um valor de `VARBINARY`, use esta expressão:

  ```sql
  INET6_ATON(INET_NTOA(expr))
  ```

  Por exemplo:

  ```sql
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

  Se a função `INET6_ATON()` for chamada dentro do cliente **mysql**, as cadeias binárias serão exibidas usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `INET6_NTOA(expr)`

  Dado um endereço de rede IPv6 ou IPv4 representado em forma numérica como uma string binária, retorna a representação da string do endereço como uma string no conjunto de caracteres de conexão. Se o argumento não for um endereço válido, `INET6_NTOA()` retorna `NULL`.

  `INET6_NTOA()` tem essas propriedades:

  - Ele não utiliza as funções do sistema operacional para realizar conversões, portanto, a string de saída é independente da plataforma.

  - A string de retorno tem um comprimento máximo de 39 (4 x 8 + 7). Dadas essas informações:

    ```sql
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```

    A tabela resultante teria esta definição:

    ```sql
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8 DEFAULT NULL);
    ```

  - A string de retorno usa letras minúsculas para endereços IPv6.

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

  Se a função `INET6_NTOA()` for chamada a partir do cliente **mysql**, as cadeias binárias serão exibidas em notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `IS_IPV4(expr)`

  Retorna 1 se o argumento for um endereço IPv4 válido especificado como uma string, caso contrário, retorna 0.

  ```sql
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

  Para um argumento específico, se `IS_IPV4()` retornar 1, `INET_ATON()` (e `INET6_ATON()`) retorna um valor que não é `NULL`. A afirmação inversa não é verdadeira: em alguns casos, `INET_ATON()` retorna um valor diferente de `NULL` quando `IS_IPV4()` retorna 0.

  Como indicado pelas observações anteriores, `IS_IPV4()` é mais rigoroso do que `INET_ATON()` em relação ao que constitui um endereço IPv4 válido, portanto, pode ser útil para aplicações que precisam realizar verificações rigorosas contra valores inválidos. Alternativamente, use `INET6_ATON()` para converter endereços IPv4 para a forma interna e verificar se há um resultado `NULL` (o que indica um endereço inválido). `INET6_ATON()` é igualmente rigoroso quanto `IS_IPV4()` em relação à verificação de endereços IPv4.

- `IS_IPV4_COMPAT(expr)`

  Essa função recebe uma endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 compatível com IPv4, 0 caso contrário. Endereços compatíveis com IPv4 têm a forma `::ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

  A parte IPv4 de um endereço compatível com IPv4 também pode ser representada usando notação hexadecimal. Por exemplo, `198.51.100.1` tem esse valor hexadecimal bruto:

  ```sql
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```

  Expresso na forma compatível com IPv4, `::198.51.100.1` é equivalente a `::c0a8:0001` ou (sem zeros no início) `::c0a8:1`

  ```sql
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

- `IS_IPV4_MAPPED(expr)`

  Essa função recebe uma endereço IPv6 representado em forma numérica como uma string binária, conforme retornado por `INET6_ATON()`. Ela retorna 1 se o argumento for um endereço IPv6 mapeado para IPv4 válido, 0 caso contrário. Endereços mapeados para IPv4 têm a forma `::ffff:ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```

  Assim como no caso de `IS_IPV4_COMPAT()`, a parte IPv4 de um endereço mapeado para IPv4 também pode ser representada usando notação hexadecimal:

  ```sql
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

- `IS_IPV6(expr)`

  Retorna 1 se o argumento for uma endereço IPv6 válido especificado como uma string, caso contrário, retorna 0. Esta função não considera endereços IPv4 como endereços IPv6 válidos.

  ```sql
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

  Para um argumento específico, se `IS_IPV6()` retornar 1, `INET6_ATON()` retornará um valor que não seja `NULL`.

- `MASTER_POS_WAIT(nome_log, pos_log[, timeout][, canal])`

  Essa função é útil para o controle da sincronização de origem-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log de origem. O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread SQL da replica não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite tiver sido excedido. Se o thread SQL da replica parar enquanto o `MASTER_POS_WAIT()` estiver esperando, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

  Em uma replica multithreading, a função aguarda até o vencimento do limite definido pela variável de sistema `slave_checkpoint_group` ou `slave_checkpoint_period`, quando a operação de checkpoint é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

  Se um valor de *`timeout`* for especificado, o `MASTER_POS_WAIT()` para de esperar quando *`timeout`* segundos tiverem decorrido. *`timeout`* deve ser maior ou igual a 0. (A partir do MySQL 5.7.18, quando o servidor está em modo SQL rigoroso, um valor de *`timeout`* negativo é rejeitado imediatamente com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna **`NULL`** e emite uma mensagem de aviso.)

  O valor opcional *`channel`* permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `NOME_CONST(nome, valor)`

  Retorna o valor fornecido. Quando usado para produzir uma coluna de conjunto de resultados, `NAME_CONST()` faz com que a coluna tenha o nome fornecido. Os argumentos devem ser constantes.

  ```sql
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

  Essa função é para uso interno apenas. O servidor a utiliza ao escrever instruções de programas armazenados que contêm referências a variáveis locais de programas, conforme descrito na Seção 23.7, “Registro binário de programas armazenados”. Você pode ver essa função na saída do **mysqlbinlog**.

  Para suas aplicações, você pode obter exatamente o mesmo resultado que no exemplo mostrado acima usando alias simples, assim:

  ```sql
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

  Consulte a Seção 13.2.9, “Instrução SELECT”, para obter mais informações sobre aliases de colunas.

- `SLEEP(duração)`

  Espera (pausa) por um número de segundos fornecido pelo argumento *`duration`*, e então retorna 0. A duração pode ter uma parte fracionária. Se o argumento for `NULL` ou negativo, o `SLEEP()` produz uma mensagem de aviso ou um erro no modo SQL rigoroso.

  Quando o sono retorna normalmente (sem interrupção), ele retorna 0:

  ```sql
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```

  Quando `SLEEP()` é a única coisa invocada por uma consulta interrompida, ele retorna 1 e a própria consulta não retorna nenhum erro. Isso é verdadeiro, independentemente de a consulta ser interrompida ou ficar sem resposta:

  - Essa declaração é interrompida usando `KILL QUERY` de outra sessão:

    ```sql
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  - Esta declaração é interrompida pelo tempo de espera:

    ```sql
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  Quando `SLEEP()` é apenas parte de uma consulta que é interrompida, a consulta retorna um erro:

  - Essa declaração é interrompida usando `KILL QUERY` de outra sessão:

    ```sql
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

  - Esta declaração é interrompida pelo tempo de espera:

    ```sql
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `UUID()`

  Retorna um identificador único universal (UUID) gerado de acordo com o RFC 4122, “Um namespace de URN (UUID) Uunique Identificador (UUID)” (<http://www.ietf.org/rfc/rfc4122.txt>).

  Um UUID é projetado como um número que é globalmente único no espaço e no tempo. Duas chamadas para `UUID()` devem gerar dois valores diferentes, mesmo que essas chamadas sejam realizadas em dois dispositivos separados e não conectados entre si.

  Aviso

  Embora os valores `UUID()` sejam destinados a serem únicos, eles não são necessariamente adivinhados ou imprevisíveis. Se a imprevisibilidade for necessária, os valores UUID devem ser gerados de outra maneira.

  `UUID()` retorna um valor que está em conformidade com a versão 1 do UUID, conforme descrito no RFC 4122. O valor é um número de 128 bits representado como uma string `utf8` de cinco números hexadecimais no formato `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`:

  - Os três primeiros números são gerados a partir das partes baixa, média e alta de um timestamp. A parte alta também inclui o número de versão do UUID.

  - O quarto número preserva a unicidade temporal caso o valor do timestamp perca a monotonia (por exemplo, devido ao horário de verão).

  - O quinto número é um número de nó IEEE 802 que fornece unicidade espacial. Um número aleatório é substituído se este não estiver disponível (por exemplo, porque o dispositivo hospedeiro não tem cartão Ethernet ou não se sabe como encontrar o endereço de hardware de uma interface no sistema operacional do hospedeiro). Nesse caso, a unicidade espacial não pode ser garantida. No entanto, a probabilidade de colisão deve ser *muito* baixa.

    O endereço MAC de uma interface é considerado apenas no FreeBSD, no Linux e no Windows. Em outros sistemas operacionais, o MySQL utiliza um número gerado aleatoriamente de 48 bits.

  ```sql
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

- `UUID_SHORT()`

  Retorna um identificador universal "curto" como um inteiro sem sinal de 64 bits. Os valores retornados pelo `UUID_SHORT()` diferem dos identificadores de 128 bits no formato de string retornados pela função `UUID()` e têm propriedades de unicidade diferentes. O valor de `UUID_SHORT()` é garantido como único se as seguintes condições forem atendidas:

  - O valor `server_id` do servidor atual está entre 0 e 255 e é único entre o conjunto de servidores de origem e replica.

  - Você não deve atrasar o horário do sistema do seu servidor hospedeiro entre os reinicializações do **mysqld**

  - Você invoca `UUID_SHORT()` em média menos de 16 milhões de vezes por segundo entre os reinicializações do **mysqld**

  O valor de retorno `UUID_SHORT()` é construído da seguinte maneira:

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

  `UUID_SHORT()` não funciona com a replicação baseada em declarações.

- `VALUES(col_name)`

  Em uma instrução `INSERT ... ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` na cláusula `UPDATE` para referenciar os valores da coluna da parte `INSERT` da instrução. Em outras palavras, `VALUES(col_name)` na cláusula `UPDATE` refere-se ao valor de *`col_name`* que seria inserido, caso não houvesse conflito de chave duplicada. Essa função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` só tem significado na cláusula `ON DUPLICATE KEY UPDATE` de instruções `INSERT` e retorna `NULL` caso contrário. Veja a Seção 13.2.5.2, “Instrução `INSERT ... ON DUPLICATE KEY UPDATE`”.

  ```sql
  mysql> INSERT INTO table (a,b,c) VALUES (1,2,3),(4,5,6)
      -> ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
  ```
