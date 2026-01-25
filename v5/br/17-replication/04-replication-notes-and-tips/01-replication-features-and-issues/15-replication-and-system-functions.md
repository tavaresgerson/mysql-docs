#### 16.4.1.15 Replicação e Funções do Sistema

Certas funções não replicam bem sob algumas condições:

*   As funções [`USER()`](information-functions.html#function_user), [`CURRENT_USER()`](information-functions.html#function_current-user) (ou [`CURRENT_USER`](information-functions.html#function_current-user)), [`UUID()`](miscellaneous-functions.html#function_uuid), [`VERSION()`](information-functions.html#function_version) e [`LOAD_FILE()`](string-functions.html#function_load-file) são replicadas sem alteração e, portanto, não funcionam de forma confiável na Replica, a menos que a `row-based replication` esteja habilitada. (Consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").)

    [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) são automaticamente replicadas usando `row-based replication` quando se utiliza o modo `MIXED`, e geram um aviso no modo `STATEMENT`. (Consulte também [Seção 16.4.1.8, “Replication of CURRENT_USER()”](replication-features-current-user.html "16.4.1.8 Replication of CURRENT_USER()").) Isso também é verdade para [`VERSION()`](information-functions.html#function_version) e [`RAND()`](mathematical-functions.html#function_rand).

*   Para [`NOW()`](date-and-time-functions.html#function_now), o Binary Log inclui o `timestamp`. Isso significa que o valor *retornado pela chamada a esta função no Source* é replicado para a Replica. Para evitar resultados inesperados ao replicar entre servidores MySQL em diferentes Time Zones, defina a Time Zone tanto no Source quanto na Replica. Para mais informações, consulte [Seção 16.4.1.31, “Replication and Time Zones”](replication-features-timezone.html "16.4.1.31 Replication and Time Zones").

    Para explicar os problemas potenciais ao replicar entre servidores que estão em diferentes Time Zones, suponha que o Source esteja localizado em Nova York, a Replica esteja localizada em Estocolmo, e ambos os servidores estejam usando a hora local. Suponha ainda que, no Source, você crie uma tabela `mytable`, execute uma instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") nesta tabela e, em seguida, selecione na tabela, conforme mostrado aqui:

    ```sql
  mysql> CREATE TABLE mytable (mycol TEXT);
  Query OK, 0 rows affected (0.06 sec)

  mysql> INSERT INTO mytable VALUES ( NOW() );
  Query OK, 1 row affected (0.00 sec)

  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

    A hora local em Estocolmo é 6 horas mais tarde do que em Nova York; portanto, se você executar `SELECT NOW()` na Replica naquele exato mesmo instante, o valor `2009-09-01 18:00:00` será retornado. Por esta razão, se você selecionar na cópia de `mytable` da Replica após as instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`INSERT`](insert.html "13.2.5 INSERT Statement") acabarem de ser replicadas, você pode esperar que `mycol` contenha o valor `2009-09-01 18:00:00`. No entanto, este não é o caso; quando você seleciona na cópia de `mytable` da Replica, você obtém exatamente o mesmo resultado que no Source:

    ```sql
  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

    Diferentemente de [`NOW()`](date-and-time-functions.html#function_now), a função [`SYSDATE()`](date-and-time-functions.html#function_sysdate) não é `replication-safe` porque não é afetada por instruções `SET TIMESTAMP` no Binary Log e é não determinística se o `statement-based logging` for usado. Isso não é um problema se o `row-based logging` for usado.

    Uma alternativa é usar a opção [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now) para fazer com que [`SYSDATE()`](date-and-time-functions.html#function_sysdate) seja um alias para [`NOW()`](date-and-time-functions.html#function_now). Isso deve ser feito no Source e na Replica para funcionar corretamente. Nesses casos, um aviso ainda é emitido por esta função, mas pode ser ignorado com segurança, desde que [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now) seja usado tanto no Source quanto na Replica.

    [`SYSDATE()`](date-and-time-functions.html#function_sysdate) é automaticamente replicada usando `row-based replication` quando se utiliza o modo `MIXED`, e gera um aviso no modo `STATEMENT`.

    Consulte também [Seção 16.4.1.31, “Replication and Time Zones”](replication-features-timezone.html "16.4.1.31 Replication and Time Zones").

*   *A seguinte restrição se aplica apenas à `statement-based replication`, e não à `row-based replication`.* As funções [`GET_LOCK()`](locking-functions.html#function_get-lock), [`RELEASE_LOCK()`](locking-functions.html#function_release-lock), [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock) e [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock) que lidam com Locks de nível de usuário são replicadas sem que a Replica conheça o `concurrency context` no Source. Portanto, essas funções não devem ser usadas para fazer `INSERT` em uma tabela no Source, pois o conteúdo na Replica seria diferente. Por exemplo, não execute uma instrução como `INSERT INTO mytable VALUES(GET_LOCK(...))`.

    Essas funções são automaticamente replicadas usando `row-based replication` quando se utiliza o modo `MIXED`, e geram um aviso no modo `STATEMENT`.

Como uma solução alternativa (`workaround`) para as limitações anteriores, quando a `statement-based replication` está em vigor, você pode usar a estratégia de salvar o resultado da função problemática em uma variável de usuário e referenciar a variável em uma instrução posterior. Por exemplo, o seguinte [`INSERT`](insert.html "13.2.5 INSERT Statement") de linha única é problemático devido à referência à função [`UUID()`](miscellaneous-functions.html#function_uuid):

```sql
INSERT INTO t VALUES(UUID());
```

Para contornar o problema, faça o seguinte:

```sql
SET @my_uuid = UUID();
INSERT INTO t VALUES(@my_uuid);
```

Essa sequência de instruções replica porque o valor de `@my_uuid` é armazenado no Binary Log como um evento de variável de usuário antes da instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") e está disponível para uso no [`INSERT`](insert.html "13.2.5 INSERT Statement").

A mesma ideia se aplica a `inserts` de múltiplas linhas, mas é mais complicado de usar. Para um `insert` de duas linhas, você pode fazer o seguinte:

```sql
SET @my_uuid1 = UUID(); @my_uuid2 = UUID();
INSERT INTO t VALUES(@my_uuid1),(@my_uuid2);
```

No entanto, se o número de linhas for grande ou desconhecido, a solução alternativa é difícil ou impraticável. Por exemplo, você não pode converter a seguinte instrução para uma na qual uma variável de usuário individual seja associada a cada linha:

```sql
INSERT INTO t2 SELECT UUID(), * FROM t1;
```

Dentro de uma `stored function`, [`RAND()`](mathematical-functions.html#function_rand) replica corretamente, desde que seja invocada apenas uma vez durante a execução da função. (Você pode considerar o `timestamp` de execução da função e a `seed` do número aleatório como entradas implícitas que são idênticas no Source e na Replica.)

As funções [`FOUND_ROWS()`](information-functions.html#function_found-rows) e [`ROW_COUNT()`](information-functions.html#function_row-count) não são replicadas de forma confiável usando `statement-based replication`. Uma solução alternativa é armazenar o resultado da chamada da função em uma variável de usuário e, em seguida, usá-la na instrução [`INSERT`](insert.html "13.2.5 INSERT Statement"). Por exemplo, se você deseja armazenar o resultado em uma tabela chamada `mytable`, você normalmente faria isso assim:

```sql
SELECT SQL_CALC_FOUND_ROWS FROM mytable LIMIT 1;
INSERT INTO mytable VALUES( FOUND_ROWS() );
```

No entanto, se você estiver replicando `mytable`, você deve usar [`SELECT ... INTO`](select-into.html "13.2.9.1 SELECT ... INTO Statement") e, em seguida, armazenar a variável na tabela, assim:

```sql
SELECT SQL_CALC_FOUND_ROWS INTO @found_rows FROM mytable LIMIT 1;
INSERT INTO mytable VALUES(@found_rows);
```

Desta forma, a variável de usuário é replicada como parte do contexto e aplicada na Replica corretamente.

Essas funções são automaticamente replicadas usando `row-based replication` quando se utiliza o modo `MIXED`, e geram um aviso no modo `STATEMENT`. (Bug #12092, Bug #30244)

Antes do MySQL 5.7.3, o valor de [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) não era replicado corretamente se quaisquer opções de filtragem, como [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) e [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table), estivessem habilitadas na Replica. (Bug #17234370, BUG# 69861)