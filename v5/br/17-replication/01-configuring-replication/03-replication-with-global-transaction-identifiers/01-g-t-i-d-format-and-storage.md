#### 16.1.3.1 Formato e Armazenamento do GTID

Um identificador de transação global (GTID) é um identificador único criado e associado a cada transação realizada no servidor de origem (a fonte). Esse identificador é único não apenas para o servidor em que foi gerado, mas também é único em todos os servidores de uma determinada topologia de replicação.

A atribuição de GTID distingue entre as transações do cliente, que são comprometidas na fonte, e as transações replicadas, que são reproduzidas em uma réplica. Quando uma transação do cliente é comprometida na fonte, ela recebe um novo GTID, desde que a transação tenha sido escrita no log binário. As transações do cliente são garantidas para ter GTIDs que aumentam de forma monótona sem lacunas entre os números gerados. Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não recebe um GTID no servidor de origem.

As transações replicadas retêm o mesmo GTID que foi atribuído à transação no servidor de origem. O GTID está presente antes de a transação replicada começar a ser executada e é persistido mesmo se a transação replicada não for escrita no log binário na replica ou for filtrada na replica. A tabela de sistema MySQL `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos a todas as transações aplicadas em um servidor MySQL, exceto aquelas que estão armazenadas em um arquivo de log binário atualmente ativo.

A função de desvio automático para GTIDs significa que uma transação comprometida na fonte pode ser aplicada no máximo uma vez na replica, o que ajuda a garantir a consistência. Uma vez que uma transação com um GTID específico tenha sido comprometida em um servidor específico, qualquer tentativa de executar uma transação subsequente com o mesmo GTID é ignorada por esse servidor. Nenhum erro é gerado e nenhuma declaração na transação é executada.

Se uma transação com um GTID específico já começou a ser executada em um servidor, mas ainda não foi confirmada ou revertida, qualquer tentativa de iniciar uma transação concorrente no servidor com o mesmo GTID é bloqueada. O servidor não começa a executar a transação concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transação é confirmada ou revertida, as sessões concorrentes que estavam bloqueadas no mesmo GTID podem prosseguir. Se a primeira tentativa for revertida, uma sessão concorrente prossegue para tentar a transação, e quaisquer outras sessões concorrentes que estavam bloqueadas no mesmo GTID permanecem bloqueadas. Se a primeira tentativa for confirmada, todas as sessões concorrentes deixam de ser bloqueadas e ignoram automaticamente todas as instruções da transação.

Um GTID é representado como um par de coordenadas, separados por um caractere de colon (`:`), como mostrado aqui:

```sql
GTID = source_id:transaction_id
```

O *`source_id`* identifica o servidor de origem. Normalmente, o `server_uuid` do servidor de origem é usado para esse propósito. O *`transaction_id`* é um número de sequência determinado pela ordem em que a transação foi comprometida no servidor de origem. Por exemplo, a primeira transação a ser comprometida tem `1` como seu *`transaction_id`*, e a décima transação a ser comprometida no mesmo servidor de origem recebe um *`transaction_id`* de `10`. Não é possível que uma transação tenha `0` como número de sequência em um GTID. Por exemplo, a vigésima terceira transação a ser comprometida originalmente no servidor com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para os números de sequência dos GTIDs em uma instância do servidor é o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado à potência de 63 menos 1, ou 9.223.372.036.854.775.807). Se o servidor ficar sem GTIDs, ele executa a ação especificada por [`binlog_error_action`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_erro_do_binary_log).

O GTID de uma transação é exibido na saída do **mysqlbinlog**, e é usado para identificar uma transação individual nas tabelas de status de replicação do Schema de Desempenho, por exemplo, `replication_applier_status_by_worker`. O valor armazenado pela variável de sistema `@@GLOBAL.gtid_next` (`@@GLOBAL.gtid_next`) é um único GTID.

##### Kits GTID

Um conjunto de GTID é um conjunto que compreende um ou mais GTIDs individuais ou intervalos de GTIDs. Conjuntos de GTID são usados em um servidor MySQL de várias maneiras. Por exemplo, os valores armazenados nas variáveis de sistema `gtid_executed` e `gtid_purged` são conjuntos de GTID. As cláusulas `START SLAVE` (`start-slave.html`) `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` podem ser usadas para fazer com que um processo de replicação execute transações apenas até o primeiro GTID em um conjunto de GTID, ou pare após o último GTID em um conjunto de GTID. As funções integradas `GTID_SUBSET()` e `GTID_SUBTRACT()` exigem conjuntos de GTID como entrada.

Uma série de GTIDs provenientes do mesmo servidor pode ser reduzida a uma única expressão, como mostrado aqui:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa as primeiras cinco transações originadas no servidor MySQL cujo `server_uuid` é `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Vários GTIDs únicos ou intervalos de GTIDs originados do mesmo servidor também podem ser incluídos em uma única expressão, com os GTIDs ou intervalos separados por colchetes, como no exemplo a seguir:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um conjunto de GTID pode incluir qualquer combinação de GTIDs individuais e faixas de GTIDs, e pode incluir GTIDs provenientes de diferentes servidores. Este exemplo mostra o conjunto de GTID armazenado na variável de sistema `[gtid_executed]` (`@@GLOBAL.gtid_executed`) de uma replica que aplicou transações de mais de uma fonte:

```sql
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando os conjuntos GTID são retornados a partir de variáveis do servidor, os UUIDs estão em ordem alfabética e os intervalos numéricos são combinados e em ordem crescente.

A sintaxe para um conjunto de GTID é a seguinte:

```sql
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

interval:
    n[-n]

    (n >= 1)
```

##### Tabela mysql.gtid_executed

Os GTIDs são armazenados em uma tabela chamada `gtid_executed`, no banco de dados `mysql`. Uma linha nesta tabela contém, para cada GTID ou conjunto de GTIDs que ele representa, o UUID do servidor de origem e os IDs de transação de início e fim do conjunto; para uma linha que referencia apenas um único GTID, esses dois últimos valores são os mesmos.

A tabela `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando uma instrução `CREATE TABLE` semelhante à mostrada aqui: CREATE TABLE

```sql
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Aviso

Assim como outras tabelas do sistema MySQL, não tente criar ou modificar essa tabela sozinho.

A tabela `mysql.gtid_executed` é fornecida para uso interno pelo servidor MySQL. Ela permite que uma réplica use GTIDs quando o registro binário está desativado na réplica e permite a retenção do estado do GTID quando os registros binários forem perdidos. Observe que a tabela `mysql.gtid_executed` será limpa se você emitir `RESET MASTER`.

Os GTIDs são armazenados na tabela `mysql.gtid_executed` apenas quando o `gtid_mode` (opções de replicação de GTIDs) está configurado como `ON` ou `ON_PERMISSIVE`. O ponto em que os GTIDs são armazenados depende se o registro binário está habilitado ou desabilitado:

- Se o registro binário estiver desativado (`log_bin` estiver em `OFF`), ou se o `log_slave_updates` estiver desativado, o servidor armazena o GTID pertencente a cada transação junto com a transação no buffer quando a transação é confirmada, e o thread de segundo plano adiciona periodicamente o conteúdo do buffer como uma ou mais entradas à tabela `mysql.gtid_executed`. Além disso, a tabela é comprimida periodicamente a uma taxa configurável pelo usuário; consulte mysql.gtid_executed Table Compression para obter mais informações. Esta situação só pode ocorrer em uma replica onde o registro binário ou o registro de atualização da replica estão desativados. Não se aplica a um servidor de origem de replicação, porque na origem, o registro binário deve estar habilitado para que a replicação ocorra.

- Se o registro binário estiver habilitado (`log_bin` estiver definido como `ON`), sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no log binário anterior na tabela `mysql.gtid_executed`. Esta situação se aplica a um servidor de origem de replicação ou a uma réplica onde o registro binário está habilitado.

  Em caso de parada inesperada do servidor, o conjunto de GTIDs do arquivo de log binário atual não é salvo na tabela `mysql.gtid_executed`. Esses GTIDs são adicionados à tabela a partir do arquivo de log binário durante a recuperação. A exceção a isso é se o registro binário não estiver habilitado quando o servidor for reiniciado. Nessa situação, o servidor não pode acessar o arquivo de log binário para recuperar os GTIDs, portanto, a replicação não pode ser iniciada.

  Quando o registro binário está habilitado, a tabela `mysql.gtid_executed` não contém um registro completo dos GTIDs para todas as transações executadas. Essas informações são fornecidas pelo valor global da variável de sistema `gtid_executed`. Sempre use `@@GLOBAL.gtid_executed`, que é atualizado após cada commit, para representar o estado do GTID para o servidor MySQL, e não consulte a tabela `mysql.gtid_executed`.

##### Compressão da tabela mysql.gtid_executed

Com o passar do tempo, a tabela `mysql.gtid_executed` pode ficar cheia de muitas linhas que se referem a GTIDs individuais que são gerados no mesmo servidor e cujos IDs de transação formam uma faixa, semelhante ao que é mostrado aqui:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           |
...
```

Para economizar espaço, o servidor MySQL comprime a tabela `mysql.gtid_executed` periodicamente, substituindo cada conjunto dessas linhas por uma única linha que abrange todo o intervalo dos identificadores de transação, da seguinte forma:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

Você pode controlar o número de transações permitidas para passar antes que a tabela seja comprimida, e, assim, a taxa de compressão, definindo a variável de sistema `gtid_executed_compression_period`. O valor padrão dessa variável é 1000, o que significa que, por padrão, a compressão da tabela é realizada após cada 1000 transações. Definir `gtid_executed_compression_period` para 0 impede que a compressão seja realizada, e você deve estar preparado para um aumento potencialmente grande na quantidade de espaço em disco que pode ser necessário para a tabela `gtid_executed` se você fizer isso.

Nota

Quando o registro binário está habilitado, o valor de `gtid_executed_compression_period` *não* é usado e a tabela `mysql.gtid_executed` é comprimida em cada rotação do log binário.

A compressão da tabela `mysql.gtid_executed` é realizada por um thread de primeiro plano dedicado chamado `thread/sql/compress_gtid_table`. Esse thread não está listado na saída de `SHOW PROCESSLIST`, mas pode ser visualizado como uma linha na tabela `threads`, conforme mostrado aqui:

```sql
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

O thread `thread/sql/compress_gtid_table` normalmente dorme até que as transações `gtid_executed_compression_period` sejam executadas, e então acorda para realizar a compressão da tabela `mysql.gtid_executed` conforme descrito anteriormente. Ele dorme novamente até que outras transações `gtid_executed_compression_period` ocorram, e então acorda para realizar a compressão novamente, repetindo esse loop indefinidamente. Definir esse valor para 0 quando o registro binário estiver desativado significa que o thread sempre dorme e nunca acorda, o que significa que esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.
