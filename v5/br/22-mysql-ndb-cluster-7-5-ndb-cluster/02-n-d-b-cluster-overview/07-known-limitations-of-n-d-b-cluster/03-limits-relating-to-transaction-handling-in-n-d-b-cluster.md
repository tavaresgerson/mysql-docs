#### 21.2.7.3 Limitações Relacionadas ao Gerenciamento de Transactions no NDB Cluster

Existem várias limitações no NDB Cluster em relação ao gerenciamento de Transactions. Elas incluem o seguinte:

* **Nível de isolamento de Transaction.**

  O storage engine [`NDBCLUSTER`] suporta apenas o nível de isolamento de Transaction [`READ COMMITTED`]. (`InnoDB`, por exemplo, suporta [`READ COMMITTED`], [`READ UNCOMMITTED`], [`REPEATABLE READ`], e [`SERIALIZABLE`].) Você deve ter em mente que o `NDB` implementa `READ COMMITTED` por linha (per-row basis); quando uma solicitação de read chega ao nó de dados que armazena a linha, o que é retornado é a última versão com Commit da linha naquele momento.

  Dados sem Commit nunca são retornados, mas quando uma Transaction modificando várias linhas executa Commit concorrentemente com uma Transaction lendo as mesmas linhas, a Transaction que está executando o read pode observar valores "antes", valores "depois", ou ambos, para diferentes linhas entre estas, devido ao fato de que uma determinada solicitação de read de linha pode ser processada antes ou depois do Commit da outra Transaction.

  Para garantir que uma determinada Transaction leia apenas valores anteriores ou posteriores, você pode impor row Locks usando [`SELECT ... LOCK IN SHARE MODE`]. Nesses casos, o Lock é mantido até que a Transaction proprietária execute Commit. O uso de row Locks também pode causar os seguintes problemas:

  + Aumento da frequência de erros de timeout de espera por Lock (lock wait timeout) e redução da concorrência
  + Aumento da sobrecarga de processamento da Transaction devido a reads que exigem uma fase de Commit
  + Possibilidade de esgotar o número disponível de Locks concorrentes, que é limitado por [`MaxNoOfConcurrentOperations`]

  O `NDB` usa `READ COMMITTED` para todos os reads, a menos que um modificador como `LOCK IN SHARE MODE` ou `FOR UPDATE` seja usado. `LOCK IN SHARE MODE` faz com que shared row Locks sejam utilizados; `FOR UPDATE` faz com que exclusive row Locks sejam utilizados. Reads de Unique Key têm seus Locks atualizados automaticamente pelo `NDB` para garantir um read autoconsistente; reads de `BLOB` também empregam Lock extra para consistência.

  Consulte [Seção 21.6.8.4, “Solução de Problemas de Backup do NDB Cluster”], para obter informações sobre como a implementação do nível de isolamento de Transaction do NDB Cluster pode afetar o backup e a restauração de Databases `NDB`.

* **Transactions e colunas BLOB ou TEXT.** O [`NDBCLUSTER`] armazena apenas parte de um valor de coluna que usa qualquer um dos tipos de dados [`BLOB`] ou [`TEXT`] do MySQL na tabela visível ao MySQL; o restante do [`BLOB`] ou [`TEXT`] é armazenado em uma tabela interna separada que não é acessível ao MySQL. Isso gera dois problemas relacionados, dos quais você deve estar ciente sempre que executar statements [`SELECT`] em tabelas que contêm colunas desses tipos:

  1. Para qualquer [`SELECT`] de uma tabela NDB Cluster: Se o [`SELECT`] incluir uma coluna [`BLOB`] ou [`TEXT`], o nível de isolamento de Transaction [`READ COMMITTED`] é convertido para um read com read Lock. Isso é feito para garantir a consistência.

  2. Para qualquer [`SELECT`] que use uma unique key lookup para recuperar quaisquer colunas que usem qualquer um dos tipos de dados [`BLOB`] ou [`TEXT`] e que seja executado dentro de uma Transaction, um shared read Lock é mantido na tabela durante a duração da Transaction—isto é, até que a Transaction seja Commit ou abortada.

     Este problema não ocorre para Queries que usam index ou table scans, mesmo contra tabelas [`NDB`] que possuem colunas [`BLOB`] ou [`TEXT`].

     Por exemplo, considere a tabela `t` definida pelo seguinte statement [`CREATE TABLE`]:

     ```sql
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

     A seguinte Query em `t` causa um shared read Lock, porque usa uma unique key lookup:

     ```sql
     SELECT * FROM t WHERE c = 1;
     ```

     No entanto, nenhuma das quatro Queries mostradas aqui causa um shared read Lock:

     ```sql
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

     Isso ocorre porque, dessas quatro Queries, a primeira usa um index scan, a segunda e a terceira usam table scans, e a quarta, embora use uma primary key lookup, não recupera o valor de nenhuma coluna [`BLOB`] ou [`TEXT`].

     Você pode ajudar a minimizar problemas com shared read Locks evitando Queries que usem unique key lookups que recuperam colunas [`BLOB`] ou [`TEXT`] ou, em casos onde tais Queries não são evitáveis, executando Commit nas Transactions o mais rápido possível depois.

* **Unique key lookups e isolamento de Transaction.** Unique Indexes são implementados no `NDB` usando uma hidden index table que é mantida internamente. Quando uma tabela `NDB` criada pelo usuário é acessada usando um unique Index, a hidden index table é lida primeiro para encontrar a Primary Key que é então usada para ler a tabela criada pelo usuário. Para evitar a modificação do Index durante esta operação de double-read, a linha encontrada na hidden index table é bloqueada (locked). Quando uma linha referenciada por um unique Index na tabela `NDB` criada pelo usuário é atualizada (updated), a hidden index table está sujeita a um exclusive Lock pela Transaction na qual o update é executado. Isso significa que qualquer operação de read na mesma tabela `NDB` (criada pelo usuário) deve esperar que o update seja concluído. Isso é verdade mesmo quando o nível de Transaction da operação de read é [`READ COMMITTED`].

  Uma solução alternativa (workaround) que pode ser usada para ignorar reads potencialmente bloqueadores é forçar o nó SQL a ignorar o unique Index ao executar o read. Isso pode ser feito usando a index hint `IGNORE INDEX` como parte do statement [`SELECT`] que lê a tabela (consulte [Seção 8.9.4, “Index Hints”]). Como o MySQL server cria um ordered Index de shadowing para cada unique Index criado no `NDB`, isso permite que o ordered Index seja lido em vez disso, e evita o Lock de acesso do unique Index. O read resultante é tão consistente quanto um committed read por Primary Key, retornando o último valor com Commit no momento em que a linha é lida.

  Ler através de um ordered Index torna o uso de recursos no Cluster menos eficiente e pode ter maior latência.

  Também é possível evitar o uso do unique Index para acesso consultando ranges em vez de valores únicos.

* **Rollbacks.** Não há Transactions parciais, nem Rollbacks parciais de Transactions. Uma duplicate key ou erro semelhante faz com que toda a Transaction seja executada Rollback.

  Este comportamento difere do de outros transactional storage engines como o [`InnoDB`] que podem executar Rollback em statements individuais.

* **Transactions e uso de memória.** Conforme observado em outras partes deste capítulo, o NDB Cluster não gerencia bem Transactions grandes; é melhor executar várias Transactions pequenas com poucas operações cada do que tentar uma única Transaction grande contendo muitas operações. Entre outras considerações, Transactions grandes exigem grandes quantidades de memória. Devido a isso, o comportamento transacional de vários statements MySQL é afetado conforme descrito na lista a seguir:

  + [`TRUNCATE TABLE`] não é transacional quando usado em tabelas [`NDB`]. Se um [`TRUNCATE TABLE`] falhar ao esvaziar a tabela, ele deverá ser executado novamente até ser bem-sucedido.

  + `DELETE FROM` (mesmo sem uma cláusula `WHERE`) *é* transacional. Para tabelas que contêm muitas linhas, você pode descobrir que o desempenho melhora usando vários statements `DELETE FROM ... LIMIT ...` para “dividir em chunks” a operação de delete. Se seu objetivo é esvaziar a tabela, você pode optar por usar [`TRUNCATE TABLE`] em vez disso.

  + **Statements LOAD DATA.** [`LOAD DATA`] não é transacional quando usado em tabelas [`NDB`].

    **Importante**

    Ao executar um statement [`LOAD DATA`], o engine [`NDB`] realiza Commits em intervalos irregulares que permitem melhor utilização da rede de comunicação. Não é possível saber antecipadamente quando tais Commits ocorrem.

  + **ALTER TABLE e Transactions.** Ao copiar uma tabela [`NDB`] como parte de um [`ALTER TABLE`], a criação da cópia não é transacional. (Em qualquer caso, esta operação é Rollback quando a cópia é deletada.)

* **Transactions e a função COUNT().** Ao usar NDB Cluster Replication, não é possível garantir a consistência transacional da função [`COUNT()`] na réplica. Em outras palavras, ao executar no source uma série de statements ([`INSERT`], [`DELETE`], ou ambos) que alteram o número de linhas em uma tabela dentro de uma única Transaction, a execução de Queries `SELECT COUNT(*) FROM table` na réplica pode produzir resultados intermediários. Isso se deve ao fato de que `SELECT COUNT(...)` pode executar dirty reads e não é um bug no storage engine [`NDB`]. (Consulte Bug #31321 para mais informações.)