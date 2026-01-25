#### 16.1.3.7 Exemplos de Stored Functions para Manipular GTIDs

Esta seção fornece exemplos de Stored Functions (consulte [Capítulo 23, *Stored Objects*](stored-objects.html "Chapter 23 Stored Objects")) que você pode criar usando algumas das funções embutidas fornecidas pelo MySQL para uso com a Replication baseada em GTID, listadas aqui:

* [`GTID_SUBSET()`](gtid-functions.html#function_gtid-subset): Mostra se um GTID set é um subset de outro.

* [`GTID_SUBTRACT()`](gtid-functions.html#function_gtid-subtract): Retorna os GTIDs de um GTID set que não estão em outro.

* `WAIT_FOR_EXECUTED_GTID_SET()`: Aguarda até que todas as Transactions em um GTID set fornecido tenham sido executadas.

Consulte [Seção 12.18, “Functions Used with Global Transaction Identifiers (GTIDs)”](gtid-functions.html "12.18 Functions Used with Global Transaction Identifiers (GTIDs)"), para mais informações sobre as funções listadas.

Observe que, nestas Stored Functions, o comando `delimiter` foi usado para alterar o delimitador de instrução MySQL para uma barra vertical, assim:

```sql
mysql> delimiter |
```

Todas as Stored Functions mostradas nesta seção aceitam representações de string de GTID sets como argumentos, portanto, os GTID sets devem sempre ser colocados entre aspas quando usados com elas.

Esta função retorna um valor diferente de zero (true) se dois GTID sets forem o mesmo set, mesmo que não estejam formatados da mesma maneira:

```sql
CREATE FUNCTION GTID_IS_EQUAL(gs1 LONGTEXT, gs2 LONGTEXT)
  RETURNS INT
  RETURN GTID_SUBSET(gs1, gs2) AND GTID_SUBSET(gs2, gs1)
|
```

Esta função retorna um valor diferente de zero (true) se dois GTID sets forem disjoint (disjuntos):

```sql
CREATE FUNCTION GTID_IS_DISJOINT(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS INT
  RETURN GTID_SUBSET(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Esta função retorna um valor diferente de zero (true) se dois GTID sets forem disjoint (disjuntos) e `sum` for a união deles:

```sql
CREATE FUNCTION GTID_IS_DISJOINT_UNION(gs1 LONGTEXT, gs2 LONGTEXT, sum LONGTEXT)
RETURNS INT
  RETURN GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs1), gs2) AND
         GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs2), gs1)
|
```

Esta função retorna uma forma normalizada do GTID set, em maiúsculas, sem whitespace e sem duplicatas, com UUIDs em ordem alfabética e intervalos em ordem numérica:

```sql
CREATE FUNCTION GTID_NORMALIZE(gs LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, '')
|
```

Esta função retorna a união de dois GTID sets:

```sql
CREATE FUNCTION GTID_UNION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_NORMALIZE(CONCAT(gs1, ',', gs2))
|
```

Esta função retorna a intersection de dois GTID sets.

```sql
CREATE FUNCTION GTID_INTERSECTION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Esta função retorna a diferença simétrica entre dois GTID sets, ou seja, os GTIDs que existem em `gs1` mas não em `gs2`, bem como os GTIDs que existem em `gs2` mas não em `gs1`.

```sql
CREATE FUNCTION GTID_SYMMETRIC_DIFFERENCE(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(CONCAT(gs1, ',', gs2), GTID_INTERSECTION(gs1, gs2))
|
```

Esta função remove de um GTID set todos os GTIDs com a origem especificada e retorna os GTIDs restantes, se houver. O UUID é o identificador usado pelo Server onde a Transaction se originou, que normalmente é o valor de [`server_uuid`](replication-options.html#sysvar_server_uuid).

```sql
CREATE FUNCTION GTID_SUBTRACT_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, CONCAT(UUID, ':1-', (1 << 63) - 2))
|
```

Esta função atua como o inverso da anterior; ela retorna apenas os GTIDs do GTID set que se originam do Server com o identificador (UUID) especificado.

```sql
CREATE FUNCTION GTID_INTERSECTION_WITH_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, GTID_SUBTRACT_UUID(gs, uuid))
|
```

**Exemplo 16.1 Verificando se uma Replica está atualizada**

As funções embutidas [`GTID_SUBSET()`](gtid-functions.html#function_gtid-subset) e [`GTID_SUBTRACT()`](gtid-functions.html#function_gtid-subtract) podem ser usadas para verificar se uma Replica aplicou pelo menos todas as Transactions que um Source aplicou.

Para realizar esta verificação com `GTID_SUBSET()`, execute a seguinte instrução na Replica:

```sql
SELECT GTID_SUBSET(source_gtid_executed, replica_gtid_executed);
```

Se o valor retornado for `0` (false), isso significa que alguns GTIDs em *`source_gtid_executed`* não estão presentes em *`replica_gtid_executed`*, e que a Replica ainda não aplicou Transactions que foram aplicadas no Source, o que significa que a Replica não está atualizada.

Para realizar a mesma verificação com `GTID_SUBTRACT()`, execute a seguinte instrução na Replica:

```sql
SELECT GTID_SUBTRACT(source_gtid_executed, replica_gtid_executed);
```

Esta instrução retorna quaisquer GTIDs que estejam em *`source_gtid_executed`* mas não em *`replica_gtid_executed`*. Se algum GTID for retornado, o Source aplicou algumas Transactions que a Replica não aplicou e, portanto, a Replica não está atualizada.

**Exemplo 16.2 Cenário de Backup e Restore**

As Stored Functions `GTID_IS_EQUAL()`, `GTID_IS_DISJOINT()` e `GTID_IS_DISJOINT_UNION()` podem ser usadas para verificar operações de Backup e Restore que envolvem múltiplos Databases e Servers. Neste cenário de exemplo, o `server1` contém o Database `db1`, e o `server2` contém o Database `db2`. O objetivo é copiar o Database `db2` para o `server1`, e o resultado no `server1` deve ser a união dos dois Databases. O procedimento utilizado é fazer o Backup do `server2` usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e, em seguida, fazer o Restore desse Backup no `server1`.

Desde que [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") tenha sido executado com [`--set-gtid-purged`](mysqldump.html#option_mysqldump_set-gtid-purged) definido como `ON` ou `AUTO` (o padrão), a saída contém uma instrução `SET @@GLOBAL.gtid_purged` que adiciona o GTID set [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) do `server2` ao GTID set [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) no `server1`. `gtid_purged` contém os GTIDs de todas as Transactions que foram commited em um determinado Server, mas que não existem em nenhum arquivo de Binary Log no Server. Quando o Database `db2` é copiado para o `server1`, os GTIDs das Transactions commited no `server2`, que não estão nos arquivos de Binary Log no `server1`, devem ser adicionados a `gtid_purged` para que o `server1` complete o set.

As Stored Functions podem ser usadas para auxiliar nas seguintes etapas neste cenário:

* Use `GTID_IS_EQUAL()` para verificar se a operação de Backup calculou o GTID set correto para a instrução `SET @@GLOBAL.gtid_purged`. No `server2`, extraia essa instrução da saída do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e armazene o GTID set em uma variável local, como `$gtid_purged_set`. Em seguida, execute a seguinte instrução:

  ```sql
  server2> SELECT GTID_IS_EQUAL($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  Se o resultado for 1, os dois GTID sets são iguais e o set foi calculado corretamente.

* Use `GTID_IS_DISJOINT()` para verificar se o GTID set na saída do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") não se sobrepõe ao set `gtid_executed` no `server1`. Ter GTIDs idênticos presentes em ambos os Servers causa erros ao copiar o Database `db2` para o `server1`. Para verificar, no `server1`, extraia e armazene `gtid_purged` da saída em uma variável local conforme feito anteriormente e, em seguida, execute a seguinte instrução:

  ```sql
  server1> SELECT GTID_IS_DISJOINT($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  Se o resultado for 1, não há sobreposição entre os dois GTID sets, portanto, nenhuma duplicata de GTIDs está presente.

* Use `GTID_IS_DISJOINT_UNION()` para verificar se a operação de Restore resultou no estado GTID correto no `server1`. Antes de restaurar o Backup, no `server1`, obtenha o set `gtid_executed` existente executando a seguinte instrução:

  ```sql
  server1> SELECT @@GLOBAL.gtid_executed;
  ```

  Armazene o resultado em uma variável local `$original_gtid_executed`, bem como o set de `gtid_purged` em outra variável local, conforme descrito anteriormente. Quando o Backup do `server2` tiver sido restaurado no `server1`, execute a seguinte instrução para verificar o estado do GTID:

  ```sql
  server1> SELECT
        ->   GTID_IS_DISJOINT_UNION($original_gtid_executed,
        ->                          $gtid_purged_set,
        ->                          @@GLOBAL.gtid_executed);
  ```

  Se o resultado for `1`, a Stored Function verificou que o set `gtid_executed` original do `server1` (`$original_gtid_executed`) e o set `gtid_purged` que foi adicionado do `server2` (`$gtid_purged_set`) não têm sobreposição, e que o set `gtid_executed` atualizado no `server1` agora consiste no set `gtid_executed` anterior do `server1` mais o set `gtid_purged` do `server2`, que é o resultado desejado. Certifique-se de que esta verificação seja realizada antes que quaisquer Transactions adicionais ocorram no `server1`, caso contrário, as novas Transactions em `gtid_executed` farão com que ela falhe.

**Exemplo 16.3 Selecionando a Replica mais atualizada para Failover manual**

A Stored Function `GTID_UNION()` pode ser usada para identificar a Replica mais atualizada de um conjunto de Replicas, a fim de realizar uma operação de Failover manual depois que um Source Server para inesperadamente. Se algumas das Replicas estiverem experimentando Replication lag, esta Stored Function pode ser usada para calcular a Replica mais atualizada sem esperar que todas as Replicas apliquem seus Relay Logs existentes e, portanto, para minimizar o tempo de Failover. A função pode retornar a união de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) em cada Replica com o set de Transactions recebidas pela Replica, que é registrado na tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") do Performance Schema. Você pode comparar esses resultados para descobrir qual registro de Transactions da Replica está mais atualizado, mesmo que nem todas as Transactions tenham sido commited ainda.

Em cada Replica, compute o registro completo de Transactions emitindo a seguinte instrução:

```sql
SELECT GTID_UNION(RECEIVED_TRANSACTION_SET, @@GLOBAL.gtid_executed)
    FROM performance_schema.replication_connection_status
    WHERE channel_name = 'name';
```

Você pode então comparar os resultados de cada Replica para ver qual tem o registro de Transactions mais atualizado e usar essa Replica como o novo Source.

**Exemplo 16.4 Verificando Transactions estranhas em uma Replica**

A Stored Function `GTID_SUBTRACT_UUID()` pode ser usada para verificar se uma Replica recebeu Transactions que não se originaram de seu Source ou Sources designados. Se isso ocorreu, pode haver um problema com sua configuração de Replication, ou com um Proxy, Router ou Load Balancer. Esta função funciona removendo de um GTID set todos os GTIDs de um Server de origem especificado e retornando os GTIDs restantes, se houver.

Para uma Replica com um único Source, emita a seguinte instrução, fornecendo o identificador do Source de origem, que normalmente é o mesmo que [`server_uuid`](replication-options.html#sysvar_server_uuid):

```sql
SELECT GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed, server_uuid_of_source);
```

Se o resultado não estiver vazio, as Transactions retornadas são Transactions extras que não se originaram do Source designado.

Para uma Replica em uma Topology Multisource, inclua o Server UUID de cada Source na chamada da função, assim:

```sql
SELECT
  GTID_SUBTRACT_UUID(GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed,
                                        server_uuid_of_source_1),
                                        server_uuid_of_source_2);
```

Se o resultado não estiver vazio, as Transactions retornadas são Transactions extras que não se originaram de nenhum dos Sources designados.

**Exemplo 16.5 Verificando se um Server em uma Topology de Replication é Read-Only**

A Stored Function `GTID_INTERSECTION_WITH_UUID()` pode ser usada para verificar se um Server não originou nenhum GTID e está em um estado Read-Only. A função retorna apenas os GTIDs do GTID set que se originam do Server com o identificador especificado. Se alguma das Transactions listadas em [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) deste Server usar o próprio identificador do Server, o próprio Server originou essas Transactions. Você pode emitir a seguinte instrução no Server para verificar:

```sql
SELECT GTID_INTERSECTION_WITH_UUID(@@GLOBAL.gtid_executed, my_server_uuid);
```

**Exemplo 16.6 Validando uma Replica adicional na Replication Multisource**

A Stored Function `GTID_INTERSECTION_WITH_UUID()` pode ser usada para descobrir se uma Replica anexada a uma configuração de Replication Multisource aplicou todas as Transactions originadas de um Source específico. Neste cenário, `source1` e `source2` são Source e Replica e replicam um para o outro. `source2` também tem sua própria Replica. A Replica também recebe e aplica Transactions de `source1` se `source2` estiver configurado com [`log_replica_updates=ON`](/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_log_replica_updates), mas não o faz se `source2` usar `log_replica_updates=OFF`. Seja qual for o caso, atualmente queremos apenas descobrir se a Replica está atualizada com `source2`. Nesta situação, `GTID_INTERSECTION_WITH_UUID()` pode ser usada para identificar as Transactions que `source2` originou, descartando as Transactions que `source2` replicou de `source1`. A função embutida [`GTID_SUBSET()`](gtid-functions.html#function_gtid-subset) pode então ser usada para comparar o resultado com o set [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) na Replica. Se a Replica estiver atualizada com `source2`, o set `gtid_executed` na Replica contém todas as Transactions no set de Intersection (as Transactions que se originaram de `source2`).

Para realizar esta verificação, armazene os valores de `gtid_executed` e o Server UUID de `source2` e o valor de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) da Replica em variáveis de usuário, conforme segue:

```sql
source2> SELECT @@GLOBAL.gtid_executed INTO @source2_gtid_executed;

source2> SELECT @@GLOBAL.server_uuid INTO @source2_server_uuid;

replica> SELECT @@GLOBAL.gtid_executed INTO @replica_gtid_executed;
```

Em seguida, use `GTID_INTERSECTION_WITH_UUID()` e `GTID_SUBSET()` com estas variáveis como input, da seguinte forma:

```sql
SELECT
  GTID_SUBSET(
    GTID_INTERSECTION_WITH_UUID(@source2_gtid_executed,
                                @source2_server_uuid),
                                @replica_gtid_executed);
```

O identificador do Server de `source2` (`@source2_server_uuid`) é usado com `GTID_INTERSECTION_WITH_UUID()` para identificar e retornar apenas aqueles GTIDs do set de GTIDs que se originaram em `source2`, omitindo aqueles que se originaram em `source1`. O GTID set resultante é então comparado com o set de todos os GTIDs executados na Replica, usando `GTID_SUBSET()`. Se esta instrução retornar um valor diferente de zero (true), todos os GTIDs identificados de `source2` (o primeiro input do set) também são encontrados em [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) da Replica, o que significa que a Replica recebeu e executou todas as Transactions que se originaram de `source2`.