#### 16.2.5.2 Avaliação de Opções de Replication em Nível de Tabela

A réplica verifica e avalia as opções de tabela somente se uma das duas condições a seguir for verdadeira:

*   Nenhuma opção de Database correspondente foi encontrada.
*   Uma ou mais opções de Database foram encontradas e foram avaliadas para chegar a uma condição de “execute” de acordo com as regras descritas na seção anterior (consulte [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options")).

Primeiro, como condição preliminar, a réplica verifica se a Replication baseada em Statement está habilitada. Se estiver, e o Statement ocorrer dentro de uma stored function, a réplica executa o Statement e sai. Se a Replication baseada em Row estiver habilitada, a réplica não sabe se um Statement ocorreu dentro de uma stored function na source, portanto, esta condição não se aplica.

Note

Para a Replication baseada em Statement, os Events de Replication representam Statements (todas as alterações que compõem um determinado Evento estão associadas a um único Statement SQL); para a Replication baseada em Row, cada Evento representa uma alteração em um único Row da tabela (portanto, um único Statement, como `UPDATE mytable SET mycol = 1`, pode gerar muitos Events baseados em Row). Quando vista em termos de Events, o processo de verificação de opções de tabela é o mesmo tanto para a Replication baseada em Row quanto para a baseada em Statement.

Tendo chegado a este ponto, se não houver opções de tabela, a réplica simplesmente executa todos os Events. Se houver alguma opção [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) ou [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table), o Evento deve corresponder a uma delas para ser executado; caso contrário, é ignorado. Se houver alguma opção [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table) ou [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table), todos os Events são executados, exceto aqueles que correspondem a qualquer uma dessas opções.

Important

Os filtros de Replication em nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e operadas na Query. Eles não se aplicam a tabelas que são implicitamente atualizadas pela Query. Por exemplo, um Statement [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), que atualiza a tabela de sistema `mysql.user`, mas não menciona essa tabela, não é afetado por um filtro que especifica `mysql.%` como o padrão wildcard.

As etapas a seguir descrevem esta avaliação em mais detalhes. O ponto de partida é o final da avaliação das opções em nível de Database, conforme descrito em [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options").

1.  Existem opções de Replication de tabela?

    *   **Sim.** Continue para a etapa 2.

    *   **Não.** Executa o update e sai.

2.  Qual formato de logging é usado?

    *   **STATEMENT.** Realiza os passos restantes para cada Statement que executa um update.

    *   **ROW.** Realiza os passos restantes para cada update de um Row da tabela.

3.  Existem opções [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table)?

    *   **Sim.** A tabela corresponde a alguma delas?

        +   **Sim.** Executa o update e sai.

        +   **Não.** Continue para a etapa 4.

    *   **Não.** Continue para a etapa 4.

4.  Existem opções [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table)?

    *   **Sim.** A tabela corresponde a alguma delas?

        +   **Sim.** Ignora o update e sai.

        +   **Não.** Continue para a etapa 5.

    *   **Não.** Continue para a etapa 5.

5.  Existem opções [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table)?

    *   **Sim.** A tabela corresponde a alguma delas?

        +   **Sim.** Executa o update e sai.

        +   **Não.** Continue para a etapa 6.

    *   **Não.** Continue para a etapa 6.

6.  Existem opções [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)?

    *   **Sim.** A tabela corresponde a alguma delas?

        +   **Sim.** Ignora o update e sai.

        +   **Não.** Continue para a etapa 7.

    *   **Não.** Continue para a etapa 7.

7.  Existe outra tabela a ser testada?

    *   **Sim.** Volta para a etapa 3.

    *   **Não.** Continue para a etapa 8.

8.  Existem opções [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) ou [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table)?

    *   **Sim.** Ignora o update e sai.

    *   **Não.** Executa o update e sai.

Note

A Replication baseada em Statement é interrompida se um único Statement SQL operar em uma tabela incluída por uma opção [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) ou [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) e em outra tabela que é ignorada por uma opção [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table) ou [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table). A réplica deve executar ou ignorar o Statement completo (que forma um Evento de Replication) e não pode fazer isso logicamente. Isso também se aplica à Replication baseada em Row para Statements DDL, pois Statements DDL são sempre logados como Statements, independentemente do formato de logging em vigor. O único tipo de Statement que pode atualizar uma tabela incluída e uma ignorada e ainda ser replicado com sucesso é um Statement DML que tenha sido logado com [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format).