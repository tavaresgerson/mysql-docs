#### 16.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela

A réplica verifica e avalia as opções da tabela apenas se uma das duas condições a seguir for verdadeira:

- Não foram encontradas opções de banco de dados correspondentes.
- Foram encontradas uma ou mais opções de banco de dados e avaliadas para chegar a uma condição de “executar” de acordo com as regras descritas na seção anterior (veja Seção 16.2.5.1, “Avaliação das Opções de Replicação e Registro Binário em Nível de Banco de Dados”).

Primeiro, como condição preliminar, a replica verifica se a replicação baseada em declarações está habilitada. Se estiver, e a declaração ocorrer dentro de uma função armazenada, a replica executa a declaração e sai. Se a replicação baseada em linhas estiver habilitada, a replica não sabe se uma declaração ocorreu dentro de uma função armazenada na fonte, então essa condição não se aplica.

Nota

Para a replicação baseada em declarações, os eventos de replicação representam declarações (todas as alterações que compõem um determinado evento estão associadas a uma única declaração SQL); para a replicação baseada em linhas, cada evento representa uma alteração em uma única linha de uma tabela (assim, uma única declaração, como `UPDATE mytable SET mycol = 1`, pode gerar muitos eventos baseados em linhas). Quando vistos em termos de eventos, o processo de verificação das opções da tabela é o mesmo para a replicação baseada em linhas e em declarações.

Chegando a este ponto, se não houver opções de tabela, a replica simplesmente executa todos os eventos. Se houver as opções `--replicate-do-table` ou `--replicate-wild-do-table`, o evento deve corresponder a uma dessas opções para ser executado; caso contrário, ele é ignorado. Se houver as opções `--replicate-ignore-table` ou `--replicate-wild-ignore-table`, todos os eventos são executados, exceto aqueles que correspondem a qualquer uma dessas opções.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de wildcard.

Os passos a seguir descrevem essa avaliação com mais detalhes. O ponto de partida é o final da avaliação das opções de nível de banco de dados, conforme descrito em Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário de nível de banco de dados”.

1. Há alguma opção de replicação de tabela?

   - **Sim.** Continue para o passo 2.

   - **Não.** Execute a atualização e saia.

2. Qual é o formato de registro utilizado?

   - **DECLARAÇÃO.** Realize as etapas restantes para cada declaração que realiza uma atualização.

   - **LINHA.** Realize as etapas restantes para cada atualização de uma linha da tabela.

3. Existem alguma opção `--replicate-do-table`?

   - **Sim.** A mesa combina com alguma delas?

     - **Sim.** Execute a atualização e saia.

     - **Não.** Continue para o passo 4.

   - **Não.** Continue para o passo 4.

4. Existem alguma opção `--replicate-ignore-table`?

   - **Sim.** A mesa combina com alguma delas?

     - **Sim.** Ignore a atualização e saia.

     - **Não.** Continue para o passo 5.

   - **Não.** Continue para o passo 5.

5. Existem alguma opção `--replicate-wild-do-table`?

   - **Sim.** A mesa combina com alguma delas?

     - **Sim.** Execute a atualização e saia.

     - **Não.** Continue para o passo 6.

   - **Não.** Continue para o passo 6.

6. Existem alguma opção `--replicate-wild-ignore-table`?

   - **Sim.** A mesa combina com alguma delas?

     - **Sim.** Ignore a atualização e saia.

     - **Não.** Continue para o passo 7.

   - **Não.** Continue para o passo 7.

7. Há outra mesa para ser testada?

   - **Sim.** Volte para o passo 3.

   - **Não.** Continue para o passo 8.

8. Existem alguma opção `--replicate-do-table` ou `--replicate-wild-do-table`?

   - **Sim.** Ignore a atualização e saia.

   - **Não.** Execute a atualização e saia.

Nota

A replicação baseada em declarações é interrompida se uma única declaração SQL operar tanto em uma tabela que é incluída por uma opção `--replicate-do-table` ou `--replicate-wild-do-table` quanto em outra tabela que é ignorada por uma opção `--replicate-ignore-table` ou `--replicate-wild-ignore-table`. A réplica deve executar ou ignorar a declaração completa (que forma um evento de replicação) e não pode fazer isso logicamente. Isso também se aplica à replicação baseada em linhas para declarações DDL, porque as declarações DDL são sempre registradas como declarações, independentemente do formato de registro em vigor. O único tipo de declaração que pode atualizar tanto uma tabela incluída quanto uma tabela ignorada e ainda ser replicada com sucesso é uma declaração DML que foi registrada com `binlog_format=ROW`.
