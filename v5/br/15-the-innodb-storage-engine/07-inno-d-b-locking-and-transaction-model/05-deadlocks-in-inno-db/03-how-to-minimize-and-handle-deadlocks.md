#### 14.7.5.3 Como Minimizar e Lidar com Deadlocks

Esta seção se baseia nas informações conceituais sobre Deadlocks na Seção 14.7.5.2, “Detecção de Deadlock”. Ela explica como organizar operações de Database para minimizar Deadlocks e o subsequente tratamento de erro exigido em aplicações.

Deadlocks são um problema clássico em Databases transacionais, mas não são perigosos, a menos que sejam tão frequentes que impeçam a execução de certas Transactions. Normalmente, você deve escrever suas aplicações para que estejam sempre preparadas para re-emitir uma Transaction caso ela sofra Rollback devido a um Deadlock.

`InnoDB` usa Locking automático em nível de linha (row-level locking). Você pode ter Deadlocks mesmo no caso de Transactions que apenas inserem ou deletam uma única linha. Isso ocorre porque essas operações não são realmente "atômicas"; elas definem automaticamente Locks nos (possivelmente vários) registros de Index da linha inserida ou deletada.

Você pode lidar com Deadlocks e reduzir a probabilidade de sua ocorrência com as seguintes técnicas:

* A qualquer momento, execute `SHOW ENGINE INNODB STATUS` para determinar a causa do Deadlock mais recente. Isso pode ajudar você a ajustar (tune) sua aplicação para evitar Deadlocks.

* Se avisos frequentes de Deadlock causarem preocupação, colete informações de debugging mais extensas habilitando a variável `innodb_print_all_deadlocks`. As informações sobre cada Deadlock, e não apenas o mais recente, são registradas no log de erro do MySQL. Desabilite esta opção quando terminar o debugging.

* Esteja sempre preparado para re-emitir uma Transaction se ela falhar devido a um Deadlock. Deadlocks não são perigosos. Apenas tente novamente.

* Mantenha as Transactions pequenas e de curta duração para torná-las menos propensas a colisões.

* Execute Commit nas Transactions imediatamente após fazer um conjunto de alterações relacionadas para torná-las menos propensas a colisões. Em particular, não deixe uma sessão interativa do **mysql** aberta por um longo período com uma Transaction não confirmada (uncommitted).

* Se você usar locking reads (`SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`), tente usar um Isolation Level mais baixo, como `READ COMMITTED`.

* Ao modificar múltiplas Tables dentro de uma Transaction, ou diferentes conjuntos de linhas na mesma Table, execute essas operações sempre em uma ordem consistente. Dessa forma, as Transactions formam filas bem definidas e não entram em Deadlock. Por exemplo, organize operações de Database em funções dentro de sua aplicação, ou chame stored routines, em vez de codificar múltiplas sequências semelhantes de comandos `INSERT`, `UPDATE` e `DELETE` em lugares diferentes.

* Adicione Indexes bem escolhidos às suas Tables para que suas Queries escaneiem menos registros de Index e definam menos Locks. Use `EXPLAIN SELECT` para determinar quais Indexes o servidor MySQL considera mais apropriados para suas Queries.

* Use menos Locking. Se você puder permitir que um `SELECT` retorne dados de um snapshot antigo, não adicione uma cláusula `FOR UPDATE` ou `LOCK IN SHARE MODE` a ele. Usar o Isolation Level `READ COMMITTED` é uma boa prática aqui, porque cada consistent read dentro da mesma Transaction lê a partir de seu próprio snapshot atualizado (fresh).

* Se nada mais ajudar, serialize suas Transactions com Locks em nível de Table (table-level locks). A maneira correta de usar `LOCK TABLES` com Tables transacionais, como as Tables `InnoDB`, é iniciar uma Transaction com `SET autocommit = 0` (não `START TRANSACTION`) seguido por `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você faça o Commit da Transaction explicitamente. Por exemplo, se você precisar escrever na Table `t1` e ler da Table `t2`, você pode fazer isso:

  ```sql
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

  Locks em nível de Table impedem atualizações concorrentes na Table, evitando Deadlocks ao custo de menor responsividade para um sistema ocupado.

* Outra forma de serializar Transactions é criar uma Table auxiliar de “semáforo” que contenha apenas uma única linha. Faça com que cada Transaction atualize essa linha antes de acessar outras Tables. Dessa forma, todas as Transactions ocorrem de maneira serial. Note que o algoritmo de detecção instantânea de Deadlock do `InnoDB` também funciona neste caso, porque o Lock de serialização é um row-level lock. Com os table-level locks do MySQL, o método de timeout deve ser usado para resolver Deadlocks.