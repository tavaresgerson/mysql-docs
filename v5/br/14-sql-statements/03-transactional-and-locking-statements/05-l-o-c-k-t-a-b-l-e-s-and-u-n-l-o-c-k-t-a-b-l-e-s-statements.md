### 13.3.5 Instruções LOCK TABLES e UNLOCK TABLES

```sql
LOCK {TABLE | TABLES}
    tbl_name AS] alias] lock_type
    [, tbl_name AS] alias] lock_type] ...

lock_type: {
    READ [LOCAL]
  | [LOW_PRIORITY] WRITE
}

UNLOCK {TABLE | TABLES}
```

O MySQL permite que sessões de cliente adquiram Table Locks explicitamente com o propósito de cooperar com outras sessões para o acesso a tabelas, ou para impedir que outras sessões modifiquem tabelas durante períodos em que uma sessão requer acesso exclusivo a elas. Uma sessão pode adquirir ou liberar Locks apenas para si mesma. Uma sessão não pode adquirir Locks para outra sessão ou liberar Locks mantidos por outra sessão.

Os Locks podem ser usados para emular Transactions ou para obter mais velocidade ao atualizar tabelas. Isso é explicado em mais detalhes em [Restrições e Condições de Table-Locking](lock-tables.html#lock-tables-restrictions "Table-Locking Restrictions and Conditions").

[`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") adquire Table Locks explicitamente para a sessão de cliente atual. Os Table Locks podem ser adquiridos para base tables ou views. Você deve ter o privilégio [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) e o privilégio [`SELECT`](privileges-provided.html#priv_select) para cada objeto a ser travado (locked).

Para travamento de View, [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") adiciona todas as base tables usadas na View ao conjunto de tabelas a serem travadas e as trava automaticamente. A partir do MySQL 5.7.32, [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") verifica se o definer da View possui os privilégios apropriados nas tabelas subjacentes à View.

Se você travar uma tabela explicitamente com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), quaisquer tabelas usadas em Triggers também são travadas implicitamente, conforme descrito em [LOCK TABLES e Triggers](lock-tables.html#lock-tables-and-triggers "LOCK TABLES and Triggers").

[`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") libera explicitamente quaisquer Table Locks mantidos pela sessão atual. [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") libera implicitamente quaisquer Table Locks mantidos pela sessão atual antes de adquirir novos Locks.

Outro uso para [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") é liberar o Global Read Lock (Lock de leitura global) adquirido com a instrução [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock), que permite travar todas as tabelas em todas as Databases. Consulte [Seção 13.7.6.3, “Instrução FLUSH”](flush.html "13.7.6.3 FLUSH Statement"). (Esta é uma maneira muito conveniente de obter Backups se você tiver um sistema de arquivos como o Veritas que possa tirar Snapshots no tempo.)

`LOCK TABLE` é um sinônimo para `LOCK TABLES`; `UNLOCK TABLE` é um sinônimo para `UNLOCK TABLES`.

Um Table Lock protege apenas contra leituras ou gravações inadequadas por outras sessões. Uma sessão que mantém um Lock `WRITE` pode realizar operações no nível da tabela, como [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") ou [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Para sessões que mantêm um Lock `READ`, as operações [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") e [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não são permitidas.

A discussão a seguir se aplica apenas a tabelas não-`TEMPORARY`. [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") é permitido (mas ignorado) para uma tabela `TEMPORARY`. A tabela pode ser acessada livremente pela sessão na qual foi criada, independentemente de qualquer outro travamento que possa estar em vigor. Nenhum Lock é necessário porque nenhuma outra sessão pode ver a tabela.

* [Aquisição de Table Lock](lock-tables.html#table-lock-acquisition "Table Lock Acquisition")
* [Liberação de Table Lock](lock-tables.html#table-lock-release "Table Lock Release")
* [Interação de Table Locking e Transactions](lock-tables.html#lock-tables-and-transactions "Interaction of Table Locking and Transactions")
* [LOCK TABLES e Triggers](lock-tables.html#lock-tables-and-triggers "LOCK TABLES and Triggers")
* [Restrições e Condições de Table-Locking](lock-tables.html#lock-tables-restrictions "Table-Locking Restrictions and Conditions")

#### Aquisição de Table Lock

Para adquirir Table Locks dentro da sessão atual, use a instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), que adquire Metadata Locks (consulte [Seção 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking")).

Os seguintes tipos de Lock estão disponíveis:

Lock `READ [LOCAL]`:

* A sessão que mantém o Lock pode ler a tabela (mas não pode escrevê-la).

* Múltiplas sessões podem adquirir um Lock `READ` para a tabela ao mesmo tempo.

* Outras sessões podem ler a tabela sem adquirir explicitamente um Lock `READ`.

* O modificador `LOCAL` permite que instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") não conflitantes (concurrent inserts) por outras sessões sejam executadas enquanto o Lock é mantido. (Consulte [Seção 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").) No entanto, `READ LOCAL` não pode ser usado se você for manipular o Database usando processos externos ao Server enquanto mantém o Lock. Para tabelas `InnoDB`, `READ LOCAL` é o mesmo que `READ`.

Lock `[LOW_PRIORITY] WRITE`:

* A sessão que mantém o Lock pode ler e escrever na tabela.

* Apenas a sessão que mantém o Lock pode acessar a tabela. Nenhuma outra sessão pode acessá-la até que o Lock seja liberado.

* Solicitações de Lock para a tabela por outras sessões bloqueiam enquanto o Lock `WRITE` é mantido.

* O modificador `LOW_PRIORITY` não tem efeito. Em versões anteriores do MySQL, ele afetava o comportamento de Locking, mas isso não é mais verdade. Agora ele está deprecated e seu uso gera um Warning. Use `WRITE` sem `LOW_PRIORITY` em vez disso.

Locks `WRITE` normalmente têm prioridade mais alta do que Locks `READ` para garantir que as atualizações sejam processadas o mais rápido possível. Isso significa que se uma sessão obtém um Lock `READ` e, em seguida, outra sessão solicita um Lock `WRITE`, as solicitações subsequentes de Lock `READ` esperam até que a sessão que solicitou o Lock `WRITE` o tenha obtido e liberado. (Uma exceção a esta política pode ocorrer para valores pequenos da variável de sistema [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count); consulte [Seção 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking").)

Se a instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") tiver que esperar devido a Locks mantidos por outras sessões em qualquer uma das tabelas, ela bloqueará até que todos os Locks possam ser adquiridos.

Uma sessão que requer Locks deve adquirir todos os Locks de que precisa em uma única instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). Enquanto os Locks assim obtidos forem mantidos, a sessão pode acessar apenas as tabelas travadas. Por exemplo, na seguinte sequência de instruções, ocorre um erro na tentativa de acesso a `t2` porque ela não foi travada na instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"):

```sql
mysql> LOCK TABLES t1 READ;
mysql> SELECT COUNT(*) FROM t1;
+----------+
| COUNT(*) |
+----------+
|        3 |
+----------+
mysql> SELECT COUNT(*) FROM t2;
ERROR 1100 (HY000): Table 't2' was not locked with LOCK TABLES
```

Tabelas no Database `INFORMATION_SCHEMA` são uma exceção. Elas podem ser acessadas sem serem travadas explicitamente, mesmo enquanto uma sessão mantém Table Locks obtidos com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

Você não pode se referir a uma tabela travada múltiplas vezes em uma única Query usando o mesmo nome. Use Aliases em vez disso, e obtenha um Lock separado para a tabela e cada Alias:

```sql
mysql> LOCK TABLE t WRITE, t AS t1 READ;
mysql> INSERT INTO t SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> INSERT INTO t SELECT * FROM t AS t1;
```

O erro ocorre para o primeiro [`INSERT`](insert.html "13.2.5 INSERT Statement") porque existem duas referências ao mesmo nome para uma tabela travada. O segundo [`INSERT`](insert.html "13.2.5 INSERT Statement") é bem-sucedido porque as referências à tabela usam nomes diferentes.

Se suas instruções se referem a uma tabela por meio de um Alias, você deve travar a tabela usando o mesmo Alias. Não funciona travar a tabela sem especificar o Alias:

```sql
mysql> LOCK TABLE t READ;
mysql> SELECT * FROM t AS myalias;
ERROR 1100: Table 'myalias' was not locked with LOCK TABLES
```

Por outro lado, se você trava uma tabela usando um Alias, você deve se referir a ela em suas instruções usando esse Alias:

```sql
mysql> LOCK TABLE t AS myalias READ;
mysql> SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> SELECT * FROM t AS myalias;
```

Nota

`LOCK TABLES` ou `UNLOCK TABLES`, quando aplicados a uma partitioned table, sempre travam ou destravam a tabela inteira; estas instruções não suportam Partition Lock Pruning. Consulte [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

#### Liberação de Table Lock

Quando os Table Locks mantidos por uma sessão são liberados, todos são liberados ao mesmo tempo. Uma sessão pode liberar seus Locks explicitamente, ou os Locks podem ser liberados implicitamente sob certas condições.

* Uma sessão pode liberar seus Locks explicitamente com [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

* Se uma sessão emite uma instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") para adquirir um Lock enquanto já mantém Locks, seus Locks existentes são liberados implicitamente antes que os novos Locks sejam concedidos.

* Se uma sessão inicia uma Transaction (por exemplo, com [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")), um [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") implícito é realizado, o que faz com que os Locks existentes sejam liberados. (Para informações adicionais sobre a interação entre Table Locking e Transactions, consulte [Interação de Table Locking e Transactions](lock-tables.html#lock-tables-and-transactions "Interaction of Table Locking and Transactions").)

Se a conexão para uma sessão de cliente terminar, seja normal ou anormalmente, o Server libera implicitamente todos os Table Locks mantidos pela sessão (transacionais e não transacionais). Se o cliente se reconectar, os Locks não estarão mais em vigor. Além disso, se o cliente tinha uma Transaction ativa, o Server faz o Rollback da Transaction após a desconexão e, se a reconexão ocorrer, a nova sessão começa com o autocommit habilitado. Por esta razão, os clientes podem desejar desabilitar o Auto-Reconnect. Com o Auto-Reconnect em vigor, o cliente não é notificado se a reconexão ocorrer, mas quaisquer Table Locks ou Transactions atuais são perdidos. Com o Auto-Reconnect desabilitado, se a conexão cair, um erro ocorre para a próxima instrução emitida. O cliente pode detectar o erro e tomar a ação apropriada, como readquirir os Locks ou refazer a Transaction. Consulte [Controle de Reconexão Automática](/doc/c-api/5.7/en/c-api-auto-reconnect.html).

Nota

Se você usar [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela travada, ela pode ser destravada. Por exemplo, se você tentar uma segunda operação [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), o resultado pode ser um erro `Table 'tbl_name' was not locked with LOCK TABLES`. Para lidar com isso, trave a tabela novamente antes da segunda alteração. Consulte também [Seção B.3.6.1, “Problemas com ALTER TABLE”](alter-table-problems.html "B.3.6.1 Problems with ALTER TABLE").

#### Interação de Table Locking e Transactions

[`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") interagem com o uso de Transactions da seguinte forma:

* [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") não é Transaction-safe e implicitamente faz o Commit de qualquer Transaction ativa antes de tentar travar as tabelas.

* [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") implicitamente faz o Commit de qualquer Transaction ativa, mas somente se [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") tiver sido usado para adquirir Table Locks. Por exemplo, no seguinte conjunto de instruções, [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") libera o Global Read Lock, mas não faz o Commit da Transaction porque nenhum Table Lock está em vigor:

  ```sql
  FLUSH TABLES WITH READ LOCK;
  START TRANSACTION;
  SELECT ... ;
  UNLOCK TABLES;
  ```

* Iniciar uma Transaction (por exemplo, com [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")) implicitamente faz o Commit de qualquer Transaction atual e libera os Table Locks existentes.

* [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) adquire um Global Read Lock e não Table Locks, portanto, não está sujeito ao mesmo comportamento que [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") no que diz respeito ao Table Locking e Implicit Commits. Por exemplo, [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") não libera o Global Read Lock. Consulte [Seção 13.7.6.3, “Instrução FLUSH”](flush.html "13.7.6.3 FLUSH Statement").

* Outras instruções que implicitamente causam o Commit de Transactions não liberam os Table Locks existentes. Para uma lista dessas instruções, consulte [Seção 13.3.3, “Instruções Que Causam um Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

* A maneira correta de usar [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") com transactional tables, como tabelas `InnoDB`, é iniciar uma Transaction com `SET autocommit = 0` (não [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")) seguido por [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), e a não chamar [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") até que você faça o Commit da Transaction explicitamente. Por exemplo, se você precisa gravar na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```sql
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

  Quando você chama [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), o `InnoDB` internamente adquire seu próprio Table Lock, e o MySQL adquire seu próprio Table Lock. O `InnoDB` libera seu Internal Table Lock no próximo Commit, mas para que o MySQL libere seu Table Lock, você deve chamar [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). Você não deve ter [`autocommit = 1`](server-system-variables.html#sysvar_autocommit), pois então o `InnoDB` libera seu Internal Table Lock imediatamente após a chamada de [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), e Deadlocks podem acontecer muito facilmente. O `InnoDB` não adquire o Internal Table Lock se [`autocommit = 1`](server-system-variables.html#sysvar_autocommit), para ajudar aplicações antigas a evitar Deadlocks desnecessários.

* [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") não libera Table Locks.

#### LOCK TABLES e Triggers

Se você travar uma tabela explicitamente com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), quaisquer tabelas usadas em Triggers também são travadas implicitamente:

* Os Locks são adquiridos ao mesmo tempo que aqueles adquiridos explicitamente com a instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

* O Lock em uma tabela usada em um Trigger depende se a tabela é usada apenas para leitura. Se for, um Read Lock é suficiente. Caso contrário, um Write Lock é usado.

* Se uma tabela for travada explicitamente para leitura com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), mas precisar ser travada para escrita porque pode ser modificada dentro de um Trigger, um Write Lock é adquirido em vez de um Read Lock. (Ou seja, um Write Lock implícito necessário devido à aparição da tabela dentro de um Trigger faz com que uma solicitação de Read Lock explícito para a tabela seja convertida em uma solicitação de Write Lock.)

Suponha que você trave duas tabelas, `t1` e `t2`, usando esta instrução:

```sql
LOCK TABLES t1 WRITE, t2 READ;
```

Se `t1` ou `t2` tiverem algum Trigger, as tabelas usadas dentro dos Triggers também são travadas. Suponha que `t1` tenha um Trigger definido assim:

```sql
CREATE TRIGGER t1_a_ins AFTER INSERT ON t1 FOR EACH ROW
BEGIN
  UPDATE t4 SET count = count+1
      WHERE id = NEW.id AND EXISTS (SELECT a FROM t3);
  INSERT INTO t2 VALUES(1, 2);
END;
```

O resultado da instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") é que `t1` e `t2` são travadas porque aparecem na instrução, e `t3` e `t4` são travadas porque são usadas dentro do Trigger:

* `t1` é travada para escrita conforme a solicitação de Lock `WRITE`.

* `t2` é travada para escrita, mesmo que a solicitação seja de um Lock `READ`. Isso ocorre porque `t2` recebe uma inserção dentro do Trigger, então a solicitação `READ` é convertida em uma solicitação `WRITE`.

* `t3` é travada para leitura porque é apenas lida dentro do Trigger.

* `t4` é travada para escrita porque pode ser atualizada dentro do Trigger.

#### Restrições e Condições de Table-Locking

Você pode usar [`KILL`](kill.html "13.7.6.4 KILL Statement") com segurança para terminar uma sessão que está esperando por um Table Lock. Consulte [Seção 13.7.6.4, “Instrução KILL”](kill.html "13.7.6.4 KILL Statement").

[`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") não podem ser usados dentro de stored programs.

Tabelas no Database `performance_schema` não podem ser travadas com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), exceto as tabelas `setup_xxx`.

O escopo de um Lock gerado por `LOCK TABLES` é um único MySQL Server. Não é compatível com NDB Cluster, que não tem como aplicar um Lock de nível SQL em múltiplas instâncias do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Você pode aplicar o Locking em uma aplicação API. Consulte [Seção 21.2.7.10, “Limitações Relacionadas a Múltiplos NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes"), para mais informações.

As seguintes instruções são proibidas enquanto uma instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") estiver em vigor: [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`CREATE TABLE ... LIKE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement"), [`DROP VIEW`](drop-view.html "13.1.32 DROP VIEW Statement"), e instruções DDL em stored functions, procedures e events.

Para algumas operações, as System Tables no Database `mysql` devem ser acessadas. Por exemplo, a instrução [`HELP`](help.html "13.8.3 HELP Statement") requer o conteúdo das help tables do lado do Server, e [`CONVERT_TZ()`](date-and-time-functions.html#function_convert-tz) pode precisar ler as time zone tables. O Server trava implicitamente as System Tables para leitura conforme necessário, de modo que você não precisa travá-las explicitamente. Estas tabelas são tratadas como acabamos de descrever:

```sql
mysql.help_category
mysql.help_keyword
mysql.help_relation
mysql.help_topic
mysql.proc
mysql.time_zone
mysql.time_zone_leap_second
mysql.time_zone_name
mysql.time_zone_transition
mysql.time_zone_transition_type
```

Se você quiser colocar explicitamente um Lock `WRITE` em qualquer uma dessas tabelas com uma instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), a tabela deve ser a única travada; nenhuma outra tabela pode ser travada com a mesma instrução.

Normalmente, você não precisa travar tabelas, porque todas as instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement") individuais são atômicas; nenhuma outra sessão pode interferir com qualquer outra instrução SQL atualmente em execução. No entanto, há alguns casos em que o Locking de tabelas pode fornecer uma vantagem:

* Se você for executar muitas operações em um conjunto de tabelas `MyISAM`, é muito mais rápido travar as tabelas que você usará. O Locking de tabelas `MyISAM` acelera as operações de Insert, Update ou Delete nelas porque o MySQL não faz o Flush do Key Cache para as tabelas travadas até que [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") seja chamado. Normalmente, o Key Cache é liberado após cada instrução SQL.

  O lado negativo do Locking de tabelas é que nenhuma sessão pode atualizar uma tabela travada com `READ` (incluindo aquela que mantém o Lock) e nenhuma sessão pode acessar uma tabela travada com `WRITE` além daquela que mantém o Lock.

* Se você estiver usando tabelas para um Storage Engine não-transacional, você deve usar [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") se quiser garantir que nenhuma outra sessão modifique as tabelas entre um [`SELECT`](select.html "13.2.9 SELECT Statement") e um [`UPDATE`](update.html "13.2.11 UPDATE Statement"). O exemplo mostrado aqui requer [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") para ser executado com segurança:

  ```sql
  LOCK TABLES trans READ, customer WRITE;
  SELECT SUM(value) FROM trans WHERE customer_id=some_id;
  UPDATE customer
    SET total_value=sum_from_previous_statement
    WHERE customer_id=some_id;
  UNLOCK TABLES;
  ```

  Sem [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), é possível que outra sessão insira uma nova Row na tabela `trans` entre a execução das instruções [`SELECT`](select.html "13.2.9 SELECT Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement").

Você pode evitar o uso de [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") em muitos casos usando Updates relativos (`UPDATE customer SET value=value+new_value`) ou a função [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id).

Você também pode evitar o Locking de tabelas em alguns casos usando as funções de Lock Advisory de nível de usuário [`GET_LOCK()`](locking-functions.html#function_get-lock) e [`RELEASE_LOCK()`](locking-functions.html#function_release-lock). Esses Locks são salvos em uma Hash Table no Server e implementados com `pthread_mutex_lock()` e `pthread_mutex_unlock()` para alta velocidade. Consulte [Seção 12.14, “Funções de Locking”](locking-functions.html "12.14 Locking Functions").

Consulte [Seção 8.11.1, “Internal Locking Methods”](internal-locking.html "8.11.1 Internal Locking Methods"), para mais informações sobre a política de Locking.