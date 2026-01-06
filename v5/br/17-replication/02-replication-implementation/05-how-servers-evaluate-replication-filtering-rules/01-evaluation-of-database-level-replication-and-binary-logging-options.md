#### 16.2.5.1 Avaliação das opções de replicação e registro binário em nível de banco de dados

Ao avaliar as opções de replicação, a replicação começa verificando se existem opções como [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) ou [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) que se aplicam. Ao usar [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) ou [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db), o processo é semelhante, mas as opções são verificadas na fonte.

O banco de dados que é verificado para uma correspondência depende do formato do log binário da declaração que está sendo processada. Se a declaração tiver sido registrada no formato de linha, o banco de dados onde os dados devem ser alterados é o banco de dados que é verificado. Se a declaração tiver sido registrada no formato de declaração, o banco de dados padrão (especificado com uma declaração [`USE`](use.html) é o banco de dados que é verificado.

Nota

Apenas as instruções DML podem ser registradas no formato de linha. As instruções DDL são sempre registradas como instruções, mesmo quando [`binlog_format=ROW`](replicação-opções-binary-log.html#sysvar_binlog_format). Portanto, todas as instruções DDL são sempre filtradas de acordo com as regras para replicação baseada em instruções. Isso significa que você deve selecionar explicitamente o banco de dados padrão com uma instrução [`USE`](use.html) para que uma instrução DDL seja aplicada.

Para a replicação, os passos envolvidos estão listados aqui:

1. Qual é o formato de registro utilizado?

   - **DECLARAÇÃO.** Teste o banco de dados padrão.

   - **ROW.** Teste o banco de dados afetado pelas alterações.

2. Existem alguma opção [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db)?

   - **Sim.** O banco de dados corresponde a algum deles?

     - **Sim.** Continue para o Passo 4.

     - **Não.** Ignore a atualização e saia.

   - **Não.** Continue para o passo 3.

3. Existem alguma opção [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db)?

   - **Sim.** O banco de dados corresponde a algum deles?

     - **Sim.** Ignore a atualização e saia.

     - **Não.** Continue para o passo 4.

   - **Não.** Continue para o passo 4.

4. Prossiga para verificar as opções de replicação de nível de tabela, se houver. Para uma descrição de como essas opções são verificadas, consulte [Seção 16.2.5.2, “Avaliação das Opções de Replicação de Nível de Tabela”](replication-rules-table-options.html).

   Importante

   Uma declaração que ainda é permitida nesta fase não está sendo executada. A declaração só será executada quando todas as opções de nível de tabela (se houver) também forem verificadas, e o resultado desse processo permitir a execução da declaração.

Para o registro binário, os passos envolvidos estão listados aqui:

1. Existem alguma opção [`--binlog-do-db`](https://pt.wikipedia.org/wiki/Replicação_de_log) ou [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_de_log) disponíveis?

   - **Sim.** Continue para o passo 2.

   - **Não.** Registre a declaração e saia.

2. Existe um banco de dados padrão (foi selecionado algum banco de dados por [`USE`](use.html))?

   - **Sim.** Continue para o passo 3.

   - **Não.** Ignore a declaração e saia.

3. Existe um banco de dados padrão. Existem alguma opção [`--binlog-do-db`](https://pt.wikipedia.org/wiki/Replicação_de_log_binário#Op%C3%A7%C3%A3o_mysqld_binlog-do-db)?

   - **Sim.** Alguma delas correspondem ao banco de dados?

     - **Sim.** Registre a declaração e saia.

     - **Não.** Ignore a declaração e saia.

   - **Não.** Continue para o passo 4.

4. Algumas das opções [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_\(programação\)#Replic%C3%A3o_de_op%C3%A9rnias_bin%C3%A1rias) correspondem ao banco de dados?

   - **Sim.** Ignore a declaração e saia.

   - **Não.** Registre a declaração e saia.

Importante

Para o registro baseado em declarações, uma exceção é feita nas regras acima mencionadas para as declarações [`CREATE DATABASE`](create-database.html), [`ALTER DATABASE`](alter-database.html) e [`DROP DATABASE`](drop-database.html). Nesses casos, o banco de dados que está sendo *criado, alterado ou excluído* substitui o banco de dados padrão ao determinar se as atualizações devem ser registradas ou ignoradas.

[`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) pode às vezes significar “ignorar outros bancos de dados”. Por exemplo, ao usar o registro baseado em instruções, um servidor que roda com apenas [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) não escreve as declarações do log binário para as quais o banco de dados padrão difere de `sales`. Ao usar o registro baseado em linhas com a mesma opção, o servidor registra apenas as atualizações que alteram dados em `sales`.
