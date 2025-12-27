#### 19.1.3.8 Exemplos de Funções Armazenadas para Manipular GTIDs

Esta seção fornece exemplos de funções armazenadas (consulte o Capítulo 27, *Objetos Armazenados*) que você pode criar usando algumas das funções embutidas fornecidas pelo MySQL para uso com replicação baseada em GTID, listadas aqui:

* `GTID_SUBSET()`: Mostra se um conjunto de GTID é um subconjunto de outro.

* `GTID_SUBTRACT()`: Retorna os GTIDs de um conjunto de GTID que não estão em outro.

* `WAIT_FOR_EXECUTED_GTID_SET()`: Aguarda até que todas as transações em um conjunto de GTID específico tenham sido executadas.

Veja a Seção 14.18.2, “Funções Usadas com Identificadores Globais de Transação (GTIDs”)”), para obter mais informações sobre as funções listadas.

Note que, nessas funções armazenadas, o comando delimitador foi usado para alterar o delimitador da instrução MySQL para uma barra vertical, da seguinte forma:

```
mysql> delimiter |
```

Todas as funções armazenadas mostradas nesta seção aceitam representações de strings de conjuntos de GTID como argumentos, portanto, os conjuntos de GTID devem sempre ser citados quando usados com elas.

Esta função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem o mesmo conjunto, mesmo que não estejam formatados da mesma maneira:

```
CREATE FUNCTION GTID_IS_EQUAL(gs1 LONGTEXT, gs2 LONGTEXT)
  RETURNS INT
  RETURN GTID_SUBSET(gs1, gs2) AND GTID_SUBSET(gs2, gs1)
|
```

Esta função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem disjuntos:

```
CREATE FUNCTION GTID_IS_DISJOINT(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS INT
  RETURN GTID_SUBSET(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Esta função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem disjuntos e `sum` for sua união:

```
CREATE FUNCTION GTID_IS_DISJOINT_UNION(gs1 LONGTEXT, gs2 LONGTEXT, sum LONGTEXT)
RETURNS INT
  RETURN GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs1), gs2) AND
         GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs2), gs1)
|
```

Esta função retorna uma forma normalizada do conjunto de GTID, em maiúsculas, sem espaços em branco nem duplicatas, com UUIDs em ordem alfabética e intervalos em ordem numérica:

```
CREATE FUNCTION GTID_NORMALIZE(gs LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, '')
|
```

Esta função retorna a união de dois conjuntos de GTID:

```
CREATE FUNCTION GTID_UNION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_NORMALIZE(CONCAT(gs1, ',', gs2))
|
```

Esta função retorna a interseção de dois conjuntos de GTID.

```
CREATE FUNCTION GTID_INTERSECTION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Essa função retorna a diferença simétrica entre dois conjuntos de GTID, ou seja, os GTID que existem em `gs1`, mas não em `gs2`, bem como os GTID que existem em `gs2`, mas não em `gs1`.

```
CREATE FUNCTION GTID_SYMMETRIC_DIFFERENCE(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(CONCAT(gs1, ',', gs2), GTID_INTERSECTION(gs1, gs2))
|
```

Essa função remove de um conjunto de GTID todos os GTID com a origem especificada e retorna os GTID restantes, se houver. O UUID é o identificador usado pelo servidor onde a transação foi originada, que normalmente é o valor de `server_uuid`.

```
CREATE FUNCTION GTID_SUBTRACT_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, CONCAT(UUID, ':1-', (1 << 63) - 2))
|
```

Essa função atua como o inverso da anterior; ela retorna apenas aqueles GTID do conjunto de GTID que originam do servidor com o identificador (UUID) especificado.

```
CREATE FUNCTION GTID_INTERSECTION_WITH_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, GTID_SUBTRACT_UUID(gs, uuid))
|
```

**Exemplo 19.1 Verificação de que uma replica está atualizada**

As funções internas `GTID_SUBSET()` e `GTID_SUBTRACT()` podem ser usadas para verificar se uma replica aplicou pelo menos todas as transações que uma fonte aplicou.

Para realizar essa verificação com `GTID_SUBSET()`, execute a seguinte instrução na replica:

```
SELECT GTID_SUBSET(source_gtid_executed, replica_gtid_executed);
```

Se o valor de retorno for `0` (false), isso significa que alguns GTID em *`source_gtid_executed`* não estão presentes em *`replica_gtid_executed`*, e que a replica ainda não aplicou transações que foram aplicadas na fonte, o que significa que a replica não está atualizada.

Para realizar a mesma verificação com `GTID_SUBTRACT()`, execute a seguinte instrução na replica:

```
SELECT GTID_SUBTRACT(source_gtid_executed, replica_gtid_executed);
```

Essa instrução retorna quaisquer GTID que estejam em *`source_gtid_executed`* mas não em *`replica_gtid_executed`*. Se algum GTID for retornado, a fonte aplicou algumas transações que a replica não aplicou, e, portanto, a replica não está atualizada.

**Exemplo 19.2 Cenário de backup e restauração**

As funções armazenadas `GTID_IS_EQUAL()`, `GTID_IS_DISJOINT()` e `GTID_IS_DISJOINT_UNION()` podem ser usadas para verificar operações de backup e restauração que envolvem múltiplos bancos de dados e servidores. Neste cenário de exemplo, o `server1` contém o banco de dados `db1`, e o `server2` contém o banco de dados `db2`. O objetivo é copiar o banco de dados `db2` para o `server1`, e o resultado no `server1` deve ser a união dos dois bancos de dados. O procedimento usado é fazer o backup do `server2` usando **mysqldump**, e depois restaurar esse backup no `server1`.

Supondo que **mysqldump** foi executado com `--set-gtid-purged` definido como `ON` ou `AUTO` (o padrão), a saída contém uma declaração `SET @@GLOBAL.gtid_purged` que adiciona o conjunto `gtid_executed` do `server2` ao conjunto `gtid_purged` no `server1`. `gtid_purged` contém os GTIDs de todas as transações que foram comprometidas em um servidor específico, mas que não existem em nenhum arquivo de log binário no servidor. Quando o banco de dados `db2` é copiado para o `server1`, os GTIDs das transações comprometidas no `server2`, que não estão nos arquivos de log binário no `server1`, devem ser adicionados ao `gtid_purged` para que o conjunto seja completo.

As funções armazenadas podem ser usadas para auxiliar nas seguintes etapas neste cenário:

* Use `GTID_IS_EQUAL()` para verificar se a operação de backup calculou o conjunto de GTIDs correto para a declaração `SET @@GLOBAL.gtid_purged`. No `server2`, extraia essa declaração do **mysqldump** de saída, e armazene o conjunto de GTIDs em uma variável local, como `$gtid_purged_set`. Em seguida, execute a seguinte declaração:

  ```
  server2> SELECT GTID_IS_EQUAL($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  Se o resultado for 1, os dois conjuntos de GTIDs são iguais, e o conjunto foi calculado corretamente.

* Use `GTID_IS_DISJOINT()` para verificar se o GTID definido na saída do **mysqldump** não se sobrepõe ao conjunto `gtid_executed` no `server1`. Ter GTIDs idênticos presentes em ambos os servidores causa erros ao copiar o banco de dados `db2` para o `server1`. Para verificar, no `server1`, extraia e armazene `gtid_purged` da saída em uma variável local, como feito anteriormente, e execute a seguinte instrução:

  ```
  server1> SELECT GTID_IS_DISJOINT($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  Se o resultado for 1, não há sobreposição entre os dois conjuntos de GTIDs, então não há GTIDs duplicados presentes.

* Use `GTID_IS_DISJOINT_UNION()` para verificar se a operação de restauração resultou no estado correto do GTID no `server1`. Antes de restaurar o backup, no `server1`, obtenha o conjunto `gtid_executed` existente executando a seguinte instrução:

  ```
  server1> SELECT @@GLOBAL.gtid_executed;
  ```

  Armazene o resultado em uma variável local `$original_gtid_executed`, bem como o conjunto de `gtid_purged` em outra variável local, conforme descrito anteriormente. Quando o backup do `server2` tiver sido restaurado no `server1`, execute a seguinte instrução para verificar o estado do GTID:

  ```
  server1> SELECT
        ->   GTID_IS_DISJOINT_UNION($original_gtid_executed,
        ->                          $gtid_purged_set,
        ->                          @@GLOBAL.gtid_executed);
  ```

  Se o resultado for `1`, a função armazenada verificou que o conjunto `gtid_executed` original do `server1` (`$original_gtid_executed`) e o conjunto `gtid_purged` que foi adicionado do `server2` (`$gtid_purged_set`) não têm sobreposição, e que o conjunto `gtid_executed` atualizado no `server1` agora consiste no conjunto `gtid_executed` anterior do `server1` mais o conjunto `gtid_purged` do `server2`, o que é o resultado desejado. Certifique-se de que essa verificação seja realizada antes que quaisquer transações adicionais ocorram no `server1`, caso contrário, as novas transações no `gtid_executed` farão com que ele falhe.

**Exemplo 19.3 Selecionando a replica mais atualizada para falha manual**

A função armazenada `GTID_UNION()` pode ser usada para identificar a replica mais atualizada de um conjunto de replicas, a fim de realizar uma operação de falha manual após um servidor de origem ter parado inesperadamente. Se algumas das replicas estiverem com atraso na replicação, essa função armazenada pode ser usada para calcular a replica mais atualizada sem esperar que todas as replicas apliquem seus logs de relevo existentes, e, portanto, para minimizar o tempo de falha. A função pode retornar a união de `gtid_executed` em cada replica com o conjunto de transações recebidas pela replica, que é registrado na tabela `replication_connection_status` do Schema de Desempenho. Você pode comparar esses resultados para descobrir qual o registro de transações da replica é o mais atualizado, mesmo que nem todas as transações tenham sido confirmadas ainda.

Em cada replica, calcule o registro completo de transações emitindo a seguinte declaração:

```
SELECT GTID_UNION(RECEIVED_TRANSACTION_SET, @@GLOBAL.gtid_executed)
    FROM performance_schema.replication_connection_status
    WHERE channel_name = 'name';
```
Em seguida, você pode comparar os resultados de cada replica para ver qual tem o registro de transações mais atualizado e usar essa replica como a nova fonte.

**Exemplo 19.4 Verificando transações estranhas em uma replica**

A função armazenada `GTID_SUBTRACT_UUID()` pode ser usada para verificar se uma replica recebeu transações que não se originaram de sua(s) fonte(s) designada(s). Se tiver, pode haver um problema com sua configuração de replicação, ou com um proxy, roteador ou balanceador de carga. Essa função funciona removendo de um conjunto de GTIDs todos os GTIDs de um servidor de origem especificado e retornando os GTIDs restantes, se houver.

Para uma replica com uma única fonte, emita a seguinte declaração, fornecendo o identificador da fonte de origem, que normalmente é o mesmo que `server_uuid`:

```
SELECT GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed, server_uuid_of_source);
```

Se o resultado não estiver vazio, as transações devolvidas são transações extras que não se originaram da fonte designada.

Para uma replica em uma topologia de multifonte, inclua o UUID do servidor de cada fonte na chamada da função, assim:

```
SELECT
  GTID_SUBTRACT_UUID(GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed,
                                        server_uuid_of_source_1),
                                        server_uuid_of_source_2);
```

Se o resultado não estiver vazio, as transações devolvidas são transações extras que não se originaram de nenhuma das fontes designadas.

**Exemplo 19.5 Verificando se um servidor em uma topologia de replicação é de leitura somente**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para verificar se um servidor não originou nenhum GTID e está em estado de leitura somente. A função retorna apenas os GTIDs do conjunto de GTIDs que se originam do servidor com o identificador especificado. Se qualquer uma das transações listadas em `gtid_executed` deste servidor usar o próprio identificador do servidor, o servidor próprio originou essas transações. Você pode emitir a seguinte declaração no servidor para verificar:

```
SELECT GTID_INTERSECTION_WITH_UUID(@@GLOBAL.gtid_executed, my_server_uuid);
```

**Exemplo 19.6 Validando uma replica adicional em replicação de multifonte**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para descobrir se uma replica anexada a uma configuração de replicação multifonte aplicou todas as transações originadas de uma fonte específica. Neste cenário, `source1` e `source2` são ambas fontes e réplicas e replicam uma para a outra. `source2` também tem sua própria replica. A replica também recebe e aplica transações de `source1` se `source2` estiver configurada com `log_replica_updates=ON`, mas não o faz se `source2` usar `log_replica_updates=OFF`. Independentemente do caso, atualmente queremos apenas descobrir se a replica está atualizada com `source2`. Neste caso, `GTID_INTERSECTION_WITH_UUID()` pode ser usado para identificar as transações que `source2` originou, descartando as transações que `source2` replicou de `source1`. A função embutida `GTID_SUBSET()` pode então ser usada para comparar o resultado com o conjunto `gtid_executed` na replica. Se a replica estiver atualizada com `source2`, o conjunto `gtid_executed` na replica contém todas as transações no conjunto de interseção (as transações que originaram de `source2`).

Para realizar essa verificação, armazene os valores de `gtid_executed` e o UUID do servidor de `source2` e o valor de `gtid_executed` da replica em variáveis de usuário da seguinte forma:

```
source2> SELECT @@GLOBAL.gtid_executed INTO @source2_gtid_executed;

source2> SELECT @@GLOBAL.server_uuid INTO @source2_server_uuid;

replica> SELECT @@GLOBAL.gtid_executed INTO @replica_gtid_executed;
```

Em seguida, use `GTID_INTERSECTION_WITH_UUID()` e `GTID_SUBSET()` com essas variáveis como entrada, da seguinte forma:

```
SELECT
  GTID_SUBSET(
    GTID_INTERSECTION_WITH_UUID(@source2_gtid_executed,
                                @source2_server_uuid),
                                @replica_gtid_executed);
```

O identificador do servidor de `source2` (`@source2_server_uuid`) é usado com `GTID_INTERSECTION_WITH_UUID()` para identificar e retornar apenas aqueles GTIDs do conjunto de GTIDs que se originaram em `source2`, omitindo aqueles que se originaram em `source1`. O conjunto de GTIDs resultante é então comparado com o conjunto de todos os GTIDs executados na replica, usando `GTID_SUBSET()`. Se essa declaração retornar um valor não nulo (verdadeiro), todos os GTIDs identificados de `source2` (o primeiro conjunto de entrada) também são encontrados em `gtid_executed` da replica, o que significa que a replica recebeu e executou todas as transações que se originaram em `source2`.