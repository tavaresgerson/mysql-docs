#### 16.1.6.2 Opções e variáveis de fonte de replicação

Esta seção descreve as opções do servidor e as variáveis do sistema que você pode usar nos servidores de origem da replicação. Você pode especificar as opções na linha de comando (command-line-options.html) ou em um arquivo de opções (option-files.html). Você pode especificar os valores das variáveis do sistema usando `SET`.

Na fonte e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único. Para cada servidor, você deve escolher um número inteiro positivo único no intervalo de 1 a 232 − 1, e cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo: `server-id=3`.

Para opções usadas na fonte para controlar o registro binário, consulte Seção 16.1.6.4, “Opções e variáveis de registro binário”.

##### Opções de inicialização para servidores de origem de replicação

A lista a seguir descreve as opções de inicialização para controlar os servidores de origem da replicação. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

- `--show-slave-auth-info`

  <table frame="box" rules="all" summary="Propriedades para show-slave-auth-info"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--show-slave-auth-info[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Exiba nomes de usuários e senhas replicados na saída de `SHOW SLAVE HOSTS` no servidor de origem para réplicas iniciadas com as opções `--report-user` (`replication-options-replica.html#sysvar_report_user`) e `--report-password` (`replication-options-replica.html#sysvar_report_password`).

##### Variáveis do sistema usadas nos servidores de origem de replicação

As seguintes variáveis de sistema são usadas para controlar as fontes:

- [`auto_increment_increment`](https://replication-options-source.html#sysvar_auto_increment_increment)

  <table frame="box" rules="all" summary="Propriedades para auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_auto_increment_increment">auto_increment_increment</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  `auto_increment_increment` e `auto_increment_offset` são destinados para uso com replicação de fonte para fonte e podem ser usados para controlar o funcionamento das colunas `AUTO_INCREMENT`. Ambas as variáveis têm valores globais e de sessão, e cada uma pode assumir um valor inteiro entre 1 e 65.535, inclusive. Definir o valor de qualquer uma dessas duas variáveis para 0 faz com que seu valor seja definido para 1 em vez disso. Tentar definir o valor de qualquer uma dessas duas variáveis para um valor inteiro maior que 65.535 ou menor que 0 faz com que seu valor seja definido para 65.535 em vez disso. Tentar definir o valor de `auto_increment_increment` ou `auto_increment_offset` para um valor não inteiro produz um erro, e o valor real da variável permanece inalterado.

  Nota

  A opção `auto_increment_increment` também é compatível com as tabelas do tipo `NDB`.

  Quando a Replicação em Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é parada. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` tenham seus valores padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação em Grupo não os altera.

  `auto_increment_increment` e `auto_increment_offset` afetam o comportamento da coluna `AUTO_INCREMENT` da seguinte forma:

  - [`auto_increment_increment`](https://replication-options-source.html#sysvar_auto_increment_increment) controla o intervalo entre os valores sucessivos da coluna. Por exemplo:

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

  - `auto_increment_offset` determina o ponto de partida para o valor da coluna `AUTO_INCREMENT`. Considere o seguinte, assumindo que essas instruções são executadas durante a mesma sessão que o exemplo dado na descrição para `auto_increment_increment`:

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

    Quando o valor de `auto_increment_offset` for maior que o de `auto_increment_increment`, o valor de `auto_increment_offset` será ignorado.

  Se alguma dessas variáveis for alterada e novas linhas forem inseridas em uma tabela que contenha uma coluna `AUTO_INCREMENT`, os resultados podem parecer contraintuitivos porque a série de valores `AUTO_INCREMENT` é calculada sem considerar quaisquer valores já presentes na coluna, e o próximo valor inserido é o menor valor da série que é maior que o valor máximo existente na coluna `AUTO_INCREMENT`. A série é calculada da seguinte forma:

  `auto_increment_offset` + *`N`* × `auto_increment_increment`

  onde *`N`* é um valor inteiro positivo na série \[1, 2, 3, ...]. Por exemplo:

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

  Os valores mostrados para `auto_increment_increment` e `auto_increment_offset` geram a série 5 + *`N`* × 10, ou seja, \[5, 15, 25, 35, 45, ...]. O valor mais alto presente na coluna `col` antes do `INSERT` é 31, e o próximo valor disponível na série `AUTO_INCREMENT` é 35, então os valores inseridos para `col` começam nesse ponto e os resultados são conforme mostrado para a consulta `SELECT`.

  Não é possível restringir os efeitos dessas duas variáveis a uma única tabela; essas variáveis controlam o comportamento de todas as colunas `AUTO_INCREMENT` em *todas* as tabelas no servidor MySQL. Se o valor global de qualquer uma dessas variáveis for definido, seus efeitos persistem até que o valor global seja alterado ou substituído definindo o valor da sessão, ou até que o **mysqld** seja reiniciado. Se o valor local for definido, o novo valor afeta as colunas `AUTO_INCREMENT` para todas as tabelas nas quais novas linhas forem inseridas pelo usuário atual durante a duração da sessão, a menos que os valores sejam alterados durante essa sessão.

  O valor padrão de `auto_increment_increment` é

  1. Veja Seção 16.4.1.1, “Replicação e AUTO\_INCREMENT”.

- [`auto_increment_offset`](https://replication-options-source.html#sysvar_auto_increment_offset)

  <table frame="box" rules="all" summary="Propriedades para auto_increment_offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-increment-offset=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_auto_increment_offset">auto_increment_offset</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  Esta variável tem um valor padrão de 1. Se for deixada com seu valor padrão e a replicação por grupo for iniciada no servidor, ela será alterada para o ID do servidor. Para mais informações, consulte a descrição de `auto_increment_increment`.

  Nota

  O `auto_increment_offset` também é suportado para uso com tabelas de `NDB` (mysql-cluster.html).

- [`rpl_semi_sync_master_enabled`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_enabled"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_enabled">rpl_semi_sync_master_enabled</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Controla se a replicação semisoincronizada está habilitada na fonte. Para habilitar ou desabilitar o plugin, defina essa variável para `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- [`rpl_semi_sync_master_timeout`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_timeout">rpl_semi_sync_master_timeout</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  Um valor em milissegundos que controla quanto tempo a fonte espera por um commit para receber um reconhecimento de uma réplica antes de expirar e reverter para replicação assíncrona. O valor padrão é 10000 (10 segundos).

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- [`rpl_semi_sync_master_trace_level`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_trace_level"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-trace-level=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level">rpl_semi_sync_master_trace_level</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  O nível de rastreamento de depuração da replicação semiesincronizada na fonte. Quatro níveis são definidos:

  - 1 = nível geral (por exemplo, falhas na função de tempo)

  - 16 = nível de detalhe (informações mais verbais)

  - 32 = nível de espera líquida (mais informações sobre as esperas de rede)

  - 64 = nível de função (informações sobre a entrada e saída da função)

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- [`rpl_semi_sync_master_wait_for_slave_count`](https://docs.postgresql.org/en/current/replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_for_slave_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-wait-for-slave-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count">rpl_semi_sync_master_wait_for_slave_count</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  O número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir. Por padrão, `rpl_semi_sync_master_wait_for_slave_count` é `1`, o que significa que a replicação semi-sincronizada prossegue após receber uma única confirmação de replicação. O desempenho é melhor para valores pequenos dessa variável.

  Por exemplo, se `rpl_semi_sync_master_wait_for_slave_count` for `2`, então 2 réplicas devem confirmar a recepção da transação antes que o período de tempo configurado por `rpl_semi_sync_master_timeout` para a replicação semi-sincronizada prossiga. Se menos réplicas confirmarem a recepção da transação durante o período de tempo, a fonte retorna à replicação normal.

  Nota

  Esse comportamento também depende de `rpl_semi_sync_master_wait_no_slave`

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- [`rpl_semi_sync_master_wait_no_slave`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_no_slave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-wait-no-slave[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave">rpl_semi_sync_master_wait_no_slave</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Controla se a fonte espera que o período de tempo de espera configurado por `rpl_semi_sync_master_timeout` expire, mesmo que o número de réplicas caia para menos que o número de réplicas configurado por `rpl_semi_sync_master_wait_for_slave_count` durante o período de espera.

  Quando o valor de `rpl_semi_sync_master_wait_no_slave` estiver ativado (o padrão), é permitido que o número de réplicas caia para menos que `rpl_semi_sync_master_wait_for_slave_count` durante o período de tempo limite. Enquanto houver réplicas suficientes reconhecendo a transação antes do período de tempo limite expirar, a replicação semi-sincronizada continua.

  Quando o valor de `rpl_semi_sync_master_wait_no_slave` for `OFF`, se o número de réplicas cair para menos que o número configurado em `rpl_semi_sync_master_wait_for_slave_count` em qualquer momento durante o período de tempo configurado por `rpl_semi_sync_master_timeout`, a fonte retorna à replicação normal.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- [`rpl_semi_sync_master_wait_point`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point)

  <table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_point"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--rpl-semi-sync-master-wait-point=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point">rpl_semi_sync_master_wait_point</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AFTER_SYNC</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AFTER_SYNC</code>]]</p><p class="valid-value">[[<code>AFTER_COMMIT</code>]]</p></td> </tr></tbody></table>

  Essa variável controla o ponto em que uma fonte semisoincronizada aguarda o reconhecimento da replicação da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

  - `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte aguarda o reconhecimento da replica da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte confirma a transação no mecanismo de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

  - `AFTER_COMMIT`: A fonte escreve cada transação no seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte aguarda a confirmação da replica sobre a recepção da transação após o commit. Ao receber a confirmação, a fonte retorna um resultado ao cliente, que pode então prosseguir.

  As características de replicação desses ajustes diferem da seguinte forma:

  - Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo: Depois de ser reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

    Em caso de falha na fonte, todas as transações realizadas na fonte foram replicadas para a replica (salvadas em seu log de retransmissão). Uma saída inesperada da fonte e a transição para a replica são irreversíveis porque a replica está atualizada. No entanto, é importante notar que a fonte não pode ser reiniciada neste cenário e deve ser descartada, pois seu log binário pode conter transações não confirmadas que causariam um conflito com a replica quando externalizadas após a recuperação do log binário.

  - Com `AFTER_COMMIT`, o cliente que emite a transação recebe o status de retorno apenas após o servidor confirmar o armazenamento no mecanismo de armazenamento e receber o reconhecimento da replica. Após o commit e antes do reconhecimento da replica, outros clientes podem ver a transação confirmada antes do cliente que a confirmou.

    Se algo der errado de modo que a réplica não processe a transação, então, em caso de uma saída inesperada da fonte e failover para a réplica, é possível que esses clientes percam dados em relação ao que viram na fonte.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

  `rpl_semi_sync_master_wait_point` foi adicionado no MySQL 5.7.2. Para versões mais antigas, o comportamento de origem semiesincronizado é equivalente a uma configuração de `AFTER_COMMIT`.

  Essa mudança introduz uma restrição de compatibilidade de versão porque incrementa a versão da interface semisoincronizada: Servidores para o MySQL 5.7.2 e versões posteriores não funcionam com plugins de replicação semisoincronizada de versões mais antigas, e servidores de versões mais antigas também não funcionam com plugins de replicação semisoincronizada para o MySQL 5.7.2 e versões posteriores.
