#### 16.1.6.2 Opções e Variáveis do Source de Replication

Esta seção descreve as opções de servidor e as system variables que você pode usar nos servidores source de replication. Você pode especificar as opções tanto na [linha de comando](command-line-options.html "4.2.2.1 Using Options on the Command Line") quanto em um [arquivo de opções](option-files.html "4.2.2.2 Using Option Files"). Você pode especificar os valores das system variables usando [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

No source e em cada replica, você deve definir a system variable [`server_id`](replication-options.html#sysvar_server_id) para estabelecer um ID de replication único. Para cada servidor, você deve escolher um inteiro positivo único no intervalo de 1 a 2^32 − 1, e cada ID deve ser diferente de todos os outros IDs em uso por qualquer outro source ou replica na topologia de replication. Exemplo: `server-id=3`.

Para opções usadas no source para controlar o binary logging, consulte [Seção 16.1.6.4, “Opções e Variáveis de Binary Logging”](replication-options-binary-log.html "16.1.6.4 Binary Logging Options and Variables”).

##### Opções de Inicialização para Servidores Source de Replication

A lista a seguir descreve as opções de inicialização para controlar servidores source de replication. As system variables relacionadas à replication são discutidas mais adiante nesta seção.

* [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info)

  <table frame="box" rules="all" summary="Propriedades para show-slave-auth-info"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Exibe nomes de usuário e senhas do replica na saída de [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") no servidor source para replicas iniciados com as opções [`--report-user`](replication-options-replica.html#sysvar_report_user) e [`--report-password`](replication-options-replica.html#sysvar_report_password).

##### System Variables Usadas em Servidores Source de Replication

As seguintes system variables são usadas para controlar sources:

* [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment)

  <table frame="box" rules="all" summary="Propriedades para auto_increment_increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) são destinadas ao uso com replication source-to-source e podem ser usadas para controlar a operação das colunas `AUTO_INCREMENT`. Ambas as variáveis têm valores Global e Session, e cada uma pode assumir um valor inteiro entre 1 e 65.535, inclusive. Definir o valor de qualquer uma dessas duas variáveis como 0 faz com que seu valor seja definido como 1. Tentar definir o valor de qualquer uma dessas duas variáveis para um inteiro maior que 65.535 ou menor que 0 faz com que seu valor seja definido como 65.535. Tentar definir o valor de [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) ou [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) para um valor não inteiro produz um erro, e o valor real da variável permanece inalterado.

  Note

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) também é suportado para uso com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  Quando o Group Replication é iniciado em um servidor, o valor de [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) é alterado para o valor de [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment), cujo padrão é 7, e o valor de [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) é alterado para o server ID. As alterações são revertidas quando o Group Replication é interrompido. Essas alterações são feitas e revertidas apenas se [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) tiverem o valor padrão 1. Se seus valores já tiverem sido modificados a partir do padrão, o Group Replication não os altera.

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) afetam o comportamento da coluna `AUTO_INCREMENT` da seguinte forma:

  + [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) controla o intervalo entre valores de coluna sucessivos. Por exemplo:

    ```sql
    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 1     |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc1
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
      Query OK, 0 rows affected (0.04 sec)

    mysql> SET @@auto_increment_increment=10;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.01 sec)

    mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc1;
    +-----+
    | col |
    +-----+
    |   1 |
    |  11 |
    |  21 |
    |  31 |
    +-----+
    4 rows in set (0.00 sec)
    ```

  + [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) determina o ponto de partida para o valor da coluna `AUTO_INCREMENT`. Considere o seguinte, assumindo que essas instruções sejam executadas durante a mesma Session que o exemplo fornecido na descrição para [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment):

    ```sql
    mysql> SET @@auto_increment_offset=5;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 5     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc2
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
    Query OK, 0 rows affected (0.06 sec)

    mysql> INSERT INTO autoinc2 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc2;
    +-----+
    | col |
    +-----+
    |   5 |
    |  15 |
    |  25 |
    |  35 |
    +-----+
    4 rows in set (0.02 sec)
    ```

    Quando o valor de [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) é maior do que o de [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment), o valor de [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) é ignorado.

  Se qualquer uma dessas variáveis for alterada, e novas linhas forem inseridas em uma tabela contendo uma coluna `AUTO_INCREMENT`, os resultados podem parecer contraintuitivos porque a série de valores `AUTO_INCREMENT` é calculada sem levar em consideração quaisquer valores já presentes na coluna, e o próximo valor inserido é o menor valor da série que é maior que o valor máximo existente na coluna `AUTO_INCREMENT`. A série é calculada assim:

  `auto_increment_offset` + *`N`* × `auto_increment_increment`

  onde *`N`* é um valor inteiro positivo na série [1, 2, 3, ...]. Por exemplo:

  ```sql
  mysql> SHOW VARIABLES LIKE 'auto_inc%';
  +--------------------------+-------+
  | Variable_name            | Value |
  +--------------------------+-------+
  | auto_increment_increment | 10    |
  | auto_increment_offset    | 5     |
  +--------------------------+-------+
  2 rows in set (0.00 sec)

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  +-----+
  4 rows in set (0.00 sec)

  mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
  Query OK, 4 rows affected (0.00 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  |  35 |
  |  45 |
  |  55 |
  |  65 |
  +-----+
  8 rows in set (0.00 sec)
  ```

  Os valores mostrados para [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) geram a série 5 + *`N`* × 10, ou seja, [5, 15, 25, 35, 45, ...]. O valor mais alto presente na coluna `col` antes do [`INSERT`](insert.html "13.2.5 INSERT Statement") é 31, e o próximo valor disponível na série `AUTO_INCREMENT` é 35, então os valores inseridos para `col` começam nesse ponto e os resultados são conforme mostrados para a Query [`SELECT`](select.html "13.2.9 SELECT Statement").

  Não é possível restringir os efeitos dessas duas variáveis a uma única tabela; essas variáveis controlam o comportamento de todas as colunas `AUTO_INCREMENT` em *todas* as tabelas no servidor MySQL. Se o valor Global de qualquer variável for definido, seus efeitos persistem até que o valor Global seja alterado ou substituído pela definição do valor da Session, ou até que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") seja reiniciado. Se o valor local for definido, o novo valor afeta as colunas `AUTO_INCREMENT` para todas as tabelas nas quais novas linhas são inseridas pelo usuário atual durante a Session, a menos que os valores sejam alterados durante essa Session.

  O valor padrão de [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) é 1. Consulte [Seção 16.4.1.1, “Replication e AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)

  <table frame="box" rules="all" summary="Propriedades para auto_increment_offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_offset</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Esta variável tem um valor padrão de 1. Se for mantida com seu valor padrão e o Group Replication for iniciado no servidor, ela será alterada para o server ID. Para obter mais informações, consulte a descrição para [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment).

  Note

  `auto_increment_offset` também é suportado para uso com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_enabled"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_enabled</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla se a semisynchronous replication está habilitada no source. Para habilitar ou desabilitar o plugin, defina esta variável como `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

* [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_timeout"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  Um valor em milissegundos que controla por quanto tempo o source espera em um Commit por um reconhecimento (acknowledgment) de um replica antes de atingir o timeout e reverter para asynchronous replication. O valor padrão é 10000 (10 segundos).

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

* [`rpl_semi_sync_master_trace_level`](replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_trace_level"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_trace_level</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  O nível de rastreamento (trace level) de debug da semisynchronous replication no source. Quatro níveis são definidos:

  + 1 = general level (por exemplo, falhas na função time)
  + 16 = detail level (informações mais verbosas)
  + 32 = net wait level (mais informações sobre esperas de network)

  + 64 = function level (informações sobre entrada e saída de função)

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

* [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_for_slave_count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_for_slave_count</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de reconhecimentos de replica que o source deve receber por transaction antes de prosseguir. Por padrão `rpl_semi_sync_master_wait_for_slave_count` é `1`, significando que a semisynchronous replication prossegue após receber um único reconhecimento de replica. O desempenho é melhor para valores pequenos desta variável.

  Por exemplo, se `rpl_semi_sync_master_wait_for_slave_count` for `2`, então 2 replicas devem reconhecer o recebimento da transaction antes do período de timeout configurado por [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout) para que a semisynchronous replication prossiga. Se menos replicas reconhecerem o recebimento da transaction durante o período de timeout, o source reverte para a replication normal.

  Note

  Este comportamento também depende de [`rpl_semi_sync_master_wait_no_slave`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave)

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

* [`rpl_semi_sync_master_wait_no_slave`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_no_slave"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-wait-no-slave[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_no_slave</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Controla se o source espera que o período de timeout configurado por [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout) expire, mesmo que a contagem de replicas caia para menos do que o número de replicas configurado por [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) durante o período de timeout.

  Quando o valor de `rpl_semi_sync_master_wait_no_slave` é `ON` (o padrão), é permitido que a contagem de replicas caia para menos do que [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) durante o período de timeout. Desde que replicas suficientes reconheçam a transaction antes que o período de timeout expire, a semisynchronous replication continua.

  Quando o valor de `rpl_semi_sync_master_wait_no_slave` é `OFF`, se a contagem de replicas cair para menos do que o número configurado em [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) a qualquer momento durante o período de timeout configurado por [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout), o source reverte para a replication normal.

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

* [`rpl_semi_sync_master_wait_point`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_point"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--rpl-semi-sync-master-wait-point=value</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_point</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>AFTER_SYNC</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AFTER_SYNC</code></p><p><code>AFTER_COMMIT</code></p></td> </tr></tbody></table>

  Esta variável controla o ponto no qual um source semisynchronous espera o reconhecimento do replica sobre o recebimento da transaction antes de retornar um status ao client que realizou o Commit da transaction. Estes valores são permitidos:

  + `AFTER_SYNC` (o padrão): O source escreve cada transaction em seu binary log e no replica, e sincroniza o binary log para o disco (sync). O source espera pelo reconhecimento do replica do recebimento da transaction após o sync. Ao receber o reconhecimento, o source faz o Commit da transaction no storage engine e retorna um resultado ao client, que pode então prosseguir.

  + `AFTER_COMMIT`: O source escreve cada transaction em seu binary log e no replica, sincroniza o binary log, e faz o Commit da transaction no storage engine. O source espera pelo reconhecimento do replica do recebimento da transaction após o Commit. Ao receber o reconhecimento, o source retorna um resultado ao client, que pode então prosseguir.

  As características de replication dessas configurações diferem da seguinte forma:

  + Com `AFTER_SYNC`, todos os clients veem a transaction committed ao mesmo tempo: Depois que ela foi reconhecida pelo replica e committed para o storage engine no source. Assim, todos os clients veem os mesmos dados no source.

    No caso de falha do source, todas as transactions committed no source foram replicadas para o replica (salvas em seu relay log). Uma saída inesperada do source e o failover para o replica não causam perda de dados (lossless) porque o replica está atualizado. Note, no entanto, que o source não pode ser reiniciado neste cenário e deve ser descartado, pois seu binary log pode conter transactions não committed que causariam um conflito com o replica se externalizadas após a recuperação do binary log.

  + Com `AFTER_COMMIT`, o client que emite a transaction obtém um status de retorno somente depois que o servidor faz o Commit no storage engine e recebe o reconhecimento do replica. Após o Commit e antes do reconhecimento do replica, outros clients podem ver a transaction committed antes do client que fez o Commit.

    Se algo der errado de modo que o replica não processe a transaction, então, no caso de uma saída inesperada do source e failover para o replica, é possível que tais clients vejam uma perda de dados em relação ao que viram no source.

  Esta variável está disponível apenas se o plugin de semisynchronous replication do lado do source estiver instalado.

  [`rpl_semi_sync_master_wait_point`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point) foi adicionada no MySQL 5.7.2. Para versões mais antigas, o comportamento do source semisynchronous é equivalente a uma configuração de `AFTER_COMMIT`.

  Esta alteração introduz uma restrição de compatibilidade de versão porque incrementa a versão da interface semisynchronous: Servidores para MySQL 5.7.2 e superiores não funcionam com plugins de semisynchronous replication de versões mais antigas, nem servidores de versões mais antigas funcionam com plugins de semisynchronous replication para MySQL 5.7.2 e superiores.