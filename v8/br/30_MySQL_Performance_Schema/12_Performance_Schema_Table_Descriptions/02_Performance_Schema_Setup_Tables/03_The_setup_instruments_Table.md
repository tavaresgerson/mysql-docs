#### 29.12.2.3 A tabela setup\_instruments

A tabela `setup_instruments` lista as classes de objetos instrumentados para os quais eventos podem ser coletados:

```
mysql> SELECT * FROM performance_schema.setup_instruments\G
*************************** 1. row ***************************
         NAME: wait/synch/mutex/pfs/LOCK_pfs_share_list
      ENABLED: NO
        TIMED: NO
   PROPERTIES: singleton
        FLAGS: NULL
   VOLATILITY: 1
DOCUMENTATION: Components can provide their own performance_schema tables.
This lock protects the list of such tables definitions.
...
*************************** 410. row ***************************
         NAME: stage/sql/executing
      ENABLED: NO
        TIMED: NO
   PROPERTIES:
        FLAGS: NULL
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 733. row ***************************
         NAME: statement/abstract/Query
      ENABLED: YES
        TIMED: YES
   PROPERTIES: mutable
        FLAGS: NULL
   VOLATILITY: 0
DOCUMENTATION: SQL query just received from the network.
At this point, the real statement type is unknown, the type
will be refined after SQL parsing.
...
*************************** 737. row ***************************
         NAME: memory/performance_schema/mutex_instances
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: global_statistics
        FLAGS:
   VOLATILITY: 1
DOCUMENTATION: Memory used for table performance_schema.mutex_instances
...
*************************** 823. row ***************************
         NAME: memory/sql/Prepared_statement::infrastructure
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: controlled_by_default
        FLAGS: controlled
   VOLATILITY: 0
DOCUMENTATION: Map infrastructure for prepared statements per session.
...
```

Cada instrumento adicionado ao código-fonte fornece uma linha para a tabela `setup_instruments`, mesmo quando o código instrumentado não é executado. Quando um instrumento é habilitado e executado, instâncias instrumentadas são criadas, que são visíveis nas tabelas `xxx_instances`, como `file_instances` ou `rwlock_instances`.

As modificações na maioria das linhas `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes ao iniciar o servidor; alterá-las durante a execução não tem efeito. Isso afeta principalmente mutexes, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

Para obter mais informações sobre o papel da tabela `setup_instruments` no filtro de eventos, consulte a Seção 29.4.3, “Pré-filtro de eventos”.

A tabela `setup_instruments` tem essas colunas:

- `NAME`

  O nome do instrumento. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”. Os eventos gerados pela execução de um instrumento têm um valor `EVENT_NAME` que é obtido do valor `NAME` do instrumento. (Os eventos não têm realmente um “nome”, mas isso fornece uma maneira de associar eventos a instrumentos.)

- `ENABLED`

  Se o instrumento está habilitado. O valor é `YES` ou `NO`. Um instrumento desabilitado não produz eventos. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para instrumentos que já foram criados.

- `TIMED`

  Se o instrumento está com o horário definido. O valor é `YES`, `NO` ou `NULL`. Esta coluna pode ser modificada, embora definir `TIMED` não tenha efeito para instrumentos que já foram criados.

  Um valor `TIMED` de `NULL` indica que o instrumento não suporta temporização. Por exemplo, as operações de memória não são temporizadas, portanto, sua coluna `TIMED` é `NULL`.

  Definir `TIMED` para `NULL` para um instrumento que suporta temporização não tem efeito, assim como definir `TIMED` para não `NULL` para um instrumento que não suporta temporização.

  Se um instrumento habilitado não estiver temporizado, o código do instrumento será habilitado, mas o temporizador não. Os eventos gerados pelo instrumento terão `NULL` para os valores do temporizador `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de soma, mínimo, máximo e média de tempo nas tabelas de resumo.

- `PROPERTIES`

  Propriedades do instrumento. Esta coluna utiliza o tipo de dados `SET`, portanto, várias bandeiras da lista a seguir podem ser definidas por instrumento:

  - `controlled_by_default`: a memória é coletada por padrão para este instrumento.

  - `global_statistics`: O instrumento produz apenas resumos globais. Resumos para níveis mais detalhados não estão disponíveis, como por fio, conta, usuário ou host. Por exemplo, a maioria dos instrumentos de memória produz apenas resumos globais.

  - `mutable`: O instrumento pode "mutar" para um mais específico. Essa propriedade se aplica apenas a instrumentos de declaração.

  - `progress`: O instrumento é capaz de relatar dados de progresso. Esta propriedade aplica-se apenas a instrumentos de estágio.

  - `singleton`: O instrumento tem uma única instância. Por exemplo, a maioria dos bloqueios de mutex globais no servidor são singletons, então os instrumentos correspondentes também são.

  - `user`: O instrumento está diretamente relacionado à carga de trabalho do usuário (ao contrário da carga de trabalho do sistema). Um desses instrumentos é `wait/io/socket/sql/client_connection`.

- `FLAGS`

  Se a memória do instrumento é controlada.

  Essa bandeira é suportada apenas para instrumentos de memória não globais e pode ser definida ou desdefinida. Por exemplo:

  ```
                SQL> UPDATE PERFORMANCE_SCHEMA.SETUP_INTRUMENTS SET FLAGS="controlled" WHERE NAME='memory/sql/NET::buff';
  ```

  Nota

  Tentar definir `FLAGS = controlled` em instrumentos não de memória ou em instrumentos de memória global falha silenciosamente.

- `VOLATILITY`

  A volatilidade do instrumento. Os valores de volatilidade variam de baixo a alto. Os valores correspondem às constantes `PSI_VOLATILITY_xxx` definidas no arquivo de cabeçalho `mysql/psi/psi_base.h`:

  ```
  #define PSI_VOLATILITY_UNKNOWN 0
  #define PSI_VOLATILITY_PERMANENT 1
  #define PSI_VOLATILITY_PROVISIONING 2
  #define PSI_VOLATILITY_DDL 3
  #define PSI_VOLATILITY_CACHE 4
  #define PSI_VOLATILITY_SESSION 5
  #define PSI_VOLATILITY_TRANSACTION 6
  #define PSI_VOLATILITY_QUERY 7
  #define PSI_VOLATILITY_INTRA_QUERY 8
  ```

  A coluna `VOLATILITY` é puramente informativa, para fornecer aos usuários (e ao código do Schema de Desempenho) uma dica sobre o comportamento do runtime do instrumento.

  Os instrumentos com um índice de volatilidade baixo (PERMANENTE = 1) são criados uma vez no início da inicialização do servidor e nunca destruídos ou recriados durante a operação normal do servidor. Eles são destruídos apenas durante o desligamento do servidor.

  Por exemplo, o mutex `wait/synch/mutex/pfs/LOCK_pfs_share_list` é definido com uma volatilidade de 1, o que significa que ele é criado uma vez. O possível overhead da própria instrumentação (ou seja, a inicialização do mutex) não tem efeito para este instrumento. O overhead de tempo de execução ocorre apenas quando o mutex é bloqueado ou desbloqueado.

  Instrumentos com um índice de volatilidade mais alto (por exemplo, SESSION = 5) são criados e destruídos para cada sessão do usuário. Por exemplo, o `wait/synch/mutex/sql/THD::LOCK_query_plan` mutex é criado toda vez que uma sessão se conecta e destruído quando a sessão se desconecta.

  Esse mutex é mais sensível ao overhead do Schema de Desempenho, porque o overhead não vem apenas da instrumentação de bloqueio e desbloqueio, mas também da instrumentação de criação e destruição do mutex, que é executada com mais frequência.

  Outro aspecto da volatilidade diz respeito a se e quando uma atualização na coluna `ENABLED` realmente tem algum efeito:

  - Uma atualização para `ENABLED` afeta objetos instrumentados criados posteriormente, mas não tem efeito sobre os instrumentos já criados.

  - Os instrumentos que são mais "voláteis" usam as novas configurações da tabela `setup_instruments` mais cedo.

  Por exemplo, essa declaração não afeta o mutex `LOCK_query_plan` para sessões existentes, mas tem um efeito em novas sessões criadas após a atualização:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED=value
  WHERE NAME = 'wait/synch/mutex/sql/THD::LOCK_query_plan';
  ```

  Essa declaração, na verdade, não tem nenhum efeito:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED=value
  WHERE NAME = 'wait/synch/mutex/pfs/LOCK_pfs_share_list';
  ```

  Este mutex é permanente e foi criado antes da execução da atualização. O mutex nunca é criado novamente, portanto, o valor `ENABLED` em `setup_instruments` nunca é usado. Para habilitar ou desabilitar este mutex, use a tabela `mutex_instances` em vez disso.

- `DOCUMENTATION`

  Uma cadeia que descreve o propósito do instrumento. O valor é `NULL` se nenhuma descrição estiver disponível.

A tabela `setup_instruments` tem esses índices:

- Chave primária em (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `setup_instruments`.

A partir do MySQL 8.0.27, para auxiliar no monitoramento e na solução de problemas, o instrumento do Schema de Desempenho é usado para exportar os nomes dos threads instrumentados para o sistema operacional. Isso permite que utilitários que exibem nomes de threads, como depuradores e o comando **ps** do Unix, exibam nomes de threads distintos do **mysqld** em vez de “mysqld”. Esta funcionalidade é suportada apenas no Linux, macOS e Windows.

Suponha que o **mysqld** esteja rodando em um sistema que tem uma versão do **ps** que suporte essa sintaxe de invocação:

```
ps -C mysqld H -o "pid tid cmd comm"
```

Sem a exportação dos nomes dos fios para o sistema operacional, o comando exibe a saída da seguinte forma, onde a maioria dos valores `COMMAND` são `mysqld`:

```
  PID   TID CMD                         COMMAND
 1377  1377 /usr/sbin/mysqld            mysqld
 1377  1528 /usr/sbin/mysqld            mysqld
 1377  1529 /usr/sbin/mysqld            mysqld
 1377  1530 /usr/sbin/mysqld            mysqld
 1377  1531 /usr/sbin/mysqld            mysqld
 1377  1534 /usr/sbin/mysqld            mysqld
 1377  1535 /usr/sbin/mysqld            mysqld
 1377  1588 /usr/sbin/mysqld            xpl_worker1
 1377  1589 /usr/sbin/mysqld            xpl_worker0
 1377  1590 /usr/sbin/mysqld            mysqld
 1377  1594 /usr/sbin/mysqld            mysqld
 1377  1595 /usr/sbin/mysqld            mysqld
```

Com a exportação dos nomes dos fios para o sistema operacional, a saída parece assim, com fios que têm um nome semelhante ao nome do instrumento:

```
  PID   TID CMD                         COMMAND
27668 27668 /usr/sbin/mysqld            mysqld
27668 27671 /usr/sbin/mysqld            ib_io_ibuf
27668 27672 /usr/sbin/mysqld            ib_io_log
27668 27673 /usr/sbin/mysqld            ib_io_rd-1
27668 27674 /usr/sbin/mysqld            ib_io_rd-2
27668 27677 /usr/sbin/mysqld            ib_io_wr-1
27668 27678 /usr/sbin/mysqld            ib_io_wr-2
27668 27699 /usr/sbin/mysqld            xpl_worker-2
27668 27700 /usr/sbin/mysqld            xpl_accept-1
27668 27710 /usr/sbin/mysqld            evt_sched
27668 27711 /usr/sbin/mysqld            sig_handler
27668 27933 /usr/sbin/mysqld            connection
```

Diferentes instâncias de fio dentro da mesma classe são numeradas para fornecer nomes distintos, quando possível. Devido às restrições de comprimento de nome em relação a um número potencialmente grande de conexões, as conexões são nomeadas simplesmente `connection`.
