#### 16.2.5.1 Avaliação das Opções de Replication e Binary Logging em Nível de Database

Ao avaliar as opções de Replication, a Replica começa verificando se há alguma opção [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) ou [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) aplicável. Ao usar [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) ou [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db), o processo é semelhante, mas as opções são verificadas na Source.

A Database que é verificada quanto à correspondência depende do formato do Binary Log do Statement que está sendo processado. Se o Statement foi logado usando o Row Format, a Database onde os dados serão alterados é a Database verificada. Se o Statement foi logado usando o Statement Format, a Database padrão (especificada com um Statement [`USE`](use.html "13.8.4 USE Statement")) é a Database verificada.

Note

Apenas Statements DML podem ser logados usando o Row Format. Statements DDL são sempre logados como Statements, mesmo quando [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format). Todos os Statements DDL são, portanto, sempre filtrados de acordo com as regras para Statement-based Replication. Isso significa que você deve selecionar a Database padrão explicitamente com um Statement [`USE`](use.html "13.8.4 USE Statement") para que um Statement DDL seja aplicado.

Para Replication, as etapas envolvidas estão listadas aqui:

1. Qual formato de Logging é usado?

   * **STATEMENT.** Testa a Database padrão.

   * **ROW.** Testa a Database afetada pelas alterações.

2. Existem opções [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db)?

   * **Sim.** A Database corresponde a alguma delas?

     + **Sim.** Continua para a Etapa 4.

     + **Não.** Ignora o update e sai.

   * **Não.** Continua para a Etapa 3.

3. Existem opções [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db)?

   * **Sim.** A Database corresponde a alguma delas?

     + **Sim.** Ignora o update e sai.

     + **Não.** Continua para a Etapa 4.

   * **Não.** Continua para a Etapa 4.

4. Procede para a verificação das opções de Replication em nível de tabela, se houver. Para uma descrição de como essas opções são verificadas, consulte [Section 16.2.5.2, “Evaluation of Table-Level Replication Options”](replication-rules-table-options.html "16.2.5.2 Evaluation of Table-Level Replication Options").

   Important

   Um Statement que ainda é permitido nesta fase ainda não foi de fato executado. O Statement não é executado até que todas as opções em nível de tabela (se houver) também tenham sido verificadas, e o resultado desse processo permita a execução do Statement.

Para Binary Logging, as etapas envolvidas estão listadas aqui:

1. Existem opções [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) ou [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db)?

   * **Sim.** Continua para a Etapa 2.

   * **Não.** Loga o Statement e sai.

2. Existe uma Database padrão (alguma Database foi selecionada por [`USE`](use.html "13.8.4 USE Statement"))?

   * **Sim.** Continua para a Etapa 3.

   * **Não.** Ignora o Statement e sai.

3. Existe uma Database padrão. Existem opções [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db)?

   * **Sim.** Alguma delas corresponde à Database?

     + **Sim.** Loga o Statement e sai.

     + **Não.** Ignora o Statement e sai.

   * **Não.** Continua para a Etapa 4.

4. Alguma das opções [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) corresponde à Database?

   * **Sim.** Ignora o Statement e sai.

   * **Não.** Loga o Statement e sai.

Important

Para Logging baseado em Statement (statement-based logging), uma exceção é feita nas regras acima para os Statements [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement") e [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"). Nesses casos, a Database sendo *criada, alterada ou descartada* substitui a Database padrão ao determinar se deve logar ou ignorar os updates.

[`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) pode, por vezes, significar “ignorar outras Databases”. Por exemplo, ao usar statement-based logging, um servidor rodando apenas com [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) não grava no Binary Log Statements para os quais a Database padrão é diferente de `sales`. Ao usar row-based logging com a mesma opção, o servidor loga apenas aqueles updates que alteram dados em `sales`.