#### 19.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela

A replicação verifica e avalia as opções de tabela apenas se uma das duas condições a seguir for verdadeira:

* Não foram encontradas opções de banco de dados correspondentes.
* Foram encontradas uma ou mais opções de banco de dados, e foram avaliadas para chegar a uma condição de "executar" de acordo com as regras descritas na seção anterior (veja a Seção 19.2.5.1, “Avaliação das Opções de Replicação de Nível de Banco de Dados e Registro Binário”).

Primeiro, como condição preliminar, a replica verifica se a replicação baseada em declarações está habilitada. Se estiver, e a declaração ocorrer dentro de uma função armazenada, a replica executa a declaração e sai. Se a replicação baseada em linhas estiver habilitada, a replica não sabe se uma declaração ocorreu dentro de uma função armazenada na fonte, então essa condição não se aplica.

Observação

Para a replicação baseada em declarações, os eventos de replicação representam declarações (todas as alterações que compõem um determinado evento estão associadas a uma única declaração SQL); para a replicação baseada em linhas, cada evento representa uma mudança em uma única linha de tabela (assim, uma única declaração como `UPDATE mytable SET mycol = 1` pode gerar muitos eventos baseados em linhas). Quando vistos em termos de eventos, o processo de verificação das opções de tabela é o mesmo para a replicação baseada em linhas e baseada em declarações.

Chegando a este ponto, se não houver opções de tabela, a replica simplesmente executa todos os eventos. Se houver alguma opção `--replicate-do-table` ou `--replicate-wild-do-table`, o evento deve corresponder a uma dessas opções para ser executado; caso contrário, é ignorado. Se houver alguma opção `--replicate-ignore-table` ou `--replicate-wild-ignore-table`, todos os eventos são executados, exceto aqueles que correspondem a qualquer uma dessas opções.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de wildcard.

Os seguintes passos descrevem essa avaliação com mais detalhes. O ponto de partida é o final da avaliação das opções de replicação e registro binário de nível de banco de dados, conforme descrito na Seção 19.2.5.1, “Avaliação das Opções de Replicação e Registro Binário de Nível de Banco de Dados”.

1. Existem alguma opção de replicação de tabela?

   * **Sim.** Continue para o passo 2.

   * **Não.** Execute a atualização e saia.

2. Qual é o formato de registro usado?

   * **DECLARAÇÃO.** Realize os passos restantes para cada declaração que realiza uma atualização.

   * **LINHA.** Realize os passos restantes para cada atualização de uma linha de tabela.

3. Existem alguma opção `--replicate-do-table`?

   * **Sim.** A tabela corresponde a alguma delas?

     + **Sim.** Execute a atualização e saia.

     + **Não.** Continue para o passo 4.

   * **Não.** Continue para o passo 4.

4. Existem alguma opção `--replicate-ignore-table`?

   * **Sim.** A tabela corresponde a alguma delas?

     + **Sim.** Ignore a atualização e saia.

     + **Não.** Continue para o passo 5.

   * **Não.** Continue para o passo 5.

5. Existem alguma opção `--replicate-wild-do-table`?

   * **Sim.** A tabela corresponde a alguma delas?

     + **Sim.** Execute a atualização e saia.

     + **Não.** Continue para o passo 6.

   * **Não.** Continue para o passo 6.

6. Existem alguma opção `--replicate-wild-ignore-table`?

   * **Sim.** A tabela corresponde a alguma delas?

     + **Sim.** Ignore a atualização e saia.

     + **Não.** Continue para o passo 7.

* **Não.** Continue para o passo 7.

7. Há outra tabela a ser testada?

   * **Sim.** Volte ao passo 3.

   * **Não.** Continue para o passo 8.

8. Há alguma opção `--replicate-do-table` ou `--replicate-wild-do-table`?

   * **Sim.** Ignore a atualização e saia.

   * **Não.** Execute a atualização e saia.

Observação

A replicação baseada em declarações para interrupção é interrompida se uma única declaração SQL operar tanto em uma tabela incluída por uma opção `--replicate-do-table` ou `--replicate-wild-do-table`, quanto em outra tabela ignorada por uma opção `--replicate-ignore-table` ou `--replicate-wild-ignore-table`. A replicação deve executar ou ignorar a declaração completa (que forma um evento de replicação) e não pode logicamente fazer isso. Isso também se aplica à replicação baseada em linhas para declarações DDL, porque as declarações DDL são sempre registradas como declarações, independentemente do formato de registro em vigor. O único tipo de declaração que pode atualizar tanto uma tabela incluída quanto uma tabela ignorada e ainda ser replicada com sucesso é uma declaração DML que foi registrada com `binlog_format=ROW`.