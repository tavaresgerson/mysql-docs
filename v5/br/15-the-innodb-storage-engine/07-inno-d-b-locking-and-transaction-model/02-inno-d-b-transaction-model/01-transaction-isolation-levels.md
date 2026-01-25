#### 14.7.2.1 Níveis de Isolation de Transaction

Isolation de Transaction é um dos fundamentos do processamento de Database. Isolation é o I no acrônimo ACID; o isolation level é a configuração que ajusta o equilíbrio entre performance e confiabilidade, consistency e reprodutibilidade de resultados quando múltiplas transactions estão realizando alterações e executando Queries simultaneamente.

O `InnoDB` oferece todos os quatro isolation levels de Transaction descritos pelo padrão SQL:1992: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`. O isolation level padrão para o `InnoDB` é `REPEATABLE READ`.

Um usuário pode alterar o isolation level para uma única session ou para todas as conexões subsequentes com a instrução `SET TRANSACTION`. Para definir o isolation level padrão do servidor para todas as conexões, use a opção `--transaction-isolation` na linha de comando ou em um arquivo de opção. Para obter informações detalhadas sobre isolation levels e a sintaxe de configuração de nível, consulte a Seção 13.3.6, “Instrução SET TRANSACTION”.

O `InnoDB` suporta cada um dos isolation levels de Transaction descritos aqui usando diferentes estratégias de Locking. Você pode impor um alto grau de consistency com o nível padrão `REPEATABLE READ`, para operações em dados cruciais onde a conformidade com ACID é importante. Ou você pode relaxar as regras de consistency com `READ COMMITTED` ou até mesmo `READ UNCOMMITTED`, em situações como relatórios em massa onde a consistency precisa e resultados repetíveis são menos importantes do que minimizar a sobrecarga de Locking. `SERIALIZABLE` impõe regras ainda mais rigorosas do que `REPEATABLE READ` e é usado principalmente em situações especializadas, como com XA transactions e para solucionar problemas de concurrency e Deadlocks.

A lista a seguir descreve como o MySQL suporta os diferentes níveis de Transaction. A lista vai do nível mais comumente usado para o menos usado.

* `REPEATABLE READ`

  Este é o isolation level padrão para o `InnoDB`. Consistent Reads dentro da mesma Transaction leem o snapshot estabelecido pela primeira leitura. Isso significa que, se você emitir várias instruções `SELECT` simples (nonlocking) dentro da mesma Transaction, essas instruções `SELECT` também serão consistentes entre si. Consulte a Seção 14.7.2.3, “Consistent Nonlocking Reads”.

  Para Locking Reads (`SELECT` com `FOR UPDATE` ou `LOCK IN SHARE MODE`), instruções `UPDATE` e `DELETE`, o Locking depende se a instrução usa um Unique Index com uma condição de busca única ou uma condição de busca do tipo Range.

  + Para um Unique Index com uma condição de busca única, o `InnoDB` bloqueia apenas o Index Record encontrado, e não o Gap antes dele.

  + Para outras condições de busca, o `InnoDB` bloqueia o Index Range escaneado, usando Gap Locks ou Next-Key Locks para bloquear inserções por outras sessions nos Gaps cobertos pelo Range. Para obter informações sobre Gap Locks e Next-Key Locks, consulte a Seção 14.7.1, “InnoDB Locking”.

  Não é recomendado misturar instruções de Locking (`UPDATE`, `INSERT`, `DELETE` ou `SELECT ... FOR ...`) com instruções `SELECT` non-locking em uma única Transaction `REPEATABLE READ`, porque tipicamente em tais casos você desejaria `SERIALIZABLE`. Isso ocorre porque uma instrução `SELECT` non-locking apresenta o estado do Database a partir de uma read-view que consiste em transactions commitadas antes que a read-view fosse criada e antes das próprias escritas da Transaction atual, enquanto as instruções de Locking veem e modificam o estado mais recente do Database para usar Locking. Em geral, esses dois estados de tabela diferentes são inconsistentes entre si e difíceis de analisar.

* `READ COMMITTED`

  Cada Consistent Read, mesmo dentro da mesma Transaction, define e lê seu próprio snapshot novo. Para obter informações sobre Consistent Reads, consulte a Seção 14.7.2.3, “Consistent Nonlocking Reads”.

  Para Locking Reads (`SELECT` com `FOR UPDATE` ou `LOCK IN SHARE MODE`), instruções `UPDATE` e instruções `DELETE`, o `InnoDB` bloqueia apenas Index Records, e não os Gaps antes deles, e, portanto, permite a inserção livre de novos records ao lado de records bloqueados. Gap Locking é usado apenas para verificação de Foreign Key Constraint e verificação de Duplicate Key.

  Como o Gap Locking está desativado, problemas de Phantom Row podem ocorrer, pois outras sessions podem inserir novas Rows nos Gaps. Para obter informações sobre Phantom Rows, consulte a Seção 14.7.4, “Phantom Rows”.

  Apenas o Row-based Binary Logging é suportado com o isolation level `READ COMMITTED`. Se você usar `READ COMMITTED` com `binlog_format=MIXED`, o servidor usará automaticamente Row-based Logging.

  O uso de `READ COMMITTED` tem efeitos adicionais:

  + Para instruções `UPDATE` ou `DELETE`, o `InnoDB` mantém Locks apenas para Rows que ele atualiza ou deleta. Record Locks para Rows não correspondentes são liberados depois que o MySQL avalia a condição `WHERE`. Isso reduz muito a probabilidade de Deadlocks, mas eles ainda podem ocorrer.

  + Para instruções `UPDATE`, se uma Row já estiver bloqueada, o `InnoDB` realiza uma leitura "semi-consistente", retornando a versão commitada mais recente ao MySQL para que o MySQL possa determinar se a Row corresponde à condição `WHERE` do `UPDATE`. Se a Row corresponder (deve ser atualizada), o MySQL lê a Row novamente e desta vez o `InnoDB` a bloqueia ou espera por um Lock nela.

  Considere o exemplo a seguir, começando com esta tabela:

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

  Neste caso, a tabela não possui Indexes, então as buscas e Index Scans usam o Hidden Clustered Index para Record Locking (consulte a Seção 14.6.2.1, “Clustered Indexes e Secondary Indexes”) em vez de colunas indexadas.

  Suponha que uma session realize um `UPDATE` usando estas instruções:

  ```sql
  # Session A
  START TRANSACTION;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

  Suponha também que uma segunda session realize um `UPDATE` executando esta instrução após as da primeira session:

  ```sql
  # Session B
  UPDATE t SET b = 4 WHERE b = 2;
  ```

  À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um Exclusive Lock para cada Row que lê e, em seguida, determina se deve modificá-la. Se o `InnoDB` não modificar a Row, ele libera o Lock. Caso contrário, o `InnoDB` retém o Lock até o final da Transaction. Isso afeta o processamento da Transaction da seguinte forma.

  Ao usar o isolation level padrão `REPEATABLE READ`, o primeiro `UPDATE` adquire um X-Lock em cada Row que lê e não libera nenhum deles:

  ```sql
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

  O segundo `UPDATE` bloqueia assim que tenta adquirir qualquer Lock (porque o primeiro update reteve Locks em todas as Rows) e não prossegue até que o primeiro `UPDATE` commite ou execute Rollback:

  ```sql
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

  Se `READ COMMITTED` for usado em vez disso, o primeiro `UPDATE` adquire um X-Lock em cada Row que lê e libera aqueles para as Rows que não modifica:

  ```sql
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

  Para o segundo `UPDATE`, o `InnoDB` faz uma leitura "semi-consistente", retornando a versão commitada mais recente de cada Row que lê para o MySQL, para que o MySQL possa determinar se a Row corresponde à condição `WHERE` do `UPDATE`:

  ```sql
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

  No entanto, se a condição `WHERE` incluir uma coluna indexada e o `InnoDB` usar o Index, apenas a coluna indexada será considerada ao adquirir e reter Record Locks. No exemplo a seguir, o primeiro `UPDATE` adquire e retém um X-Lock em cada Row onde b = 2. O segundo `UPDATE` bloqueia quando tenta adquirir X-Locks nos mesmos records, pois ele também usa o Index definido na coluna b.

  ```sql
  CREATE TABLE t (a INT NOT NULL, b INT, c INT, INDEX (b)) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2,3),(2,2,4);
  COMMIT;

  # Session A
  START TRANSACTION;
  UPDATE t SET b = 3 WHERE b = 2 AND c = 3;

  # Session B
  UPDATE t SET b = 4 WHERE b = 2 AND c = 4;
  ```

  Os efeitos do uso do isolation level `READ COMMITTED` são os mesmos que habilitar a variável obsoleta `innodb_locks_unsafe_for_binlog`, com estas exceções:

  + Habilitar `innodb_locks_unsafe_for_binlog` é uma configuração global e afeta todas as sessions, enquanto o isolation level pode ser definido globalmente para todas as sessions, ou individualmente por session.

  + `innodb_locks_unsafe_for_binlog` pode ser definido apenas na inicialização do servidor, enquanto o isolation level pode ser definido na inicialização ou alterado em runtime.

  O `READ COMMITTED` oferece, portanto, um controle mais preciso e flexível do que `innodb_locks_unsafe_for_binlog`.

* `READ UNCOMMITTED`

  As instruções `SELECT` são executadas de forma nonlocking, mas uma possível versão anterior de uma Row pode ser usada. Assim, usando este isolation level, tais leituras não são consistentes. Isso também é chamado de dirty read (leitura suja). Caso contrário, este isolation level funciona como `READ COMMITTED`.

* `SERIALIZABLE`

  Este nível é como `REPEATABLE READ`, mas o `InnoDB` implicitamente converte todas as instruções `SELECT` simples para `SELECT ... LOCK IN SHARE MODE` se o `autocommit` estiver desabilitado. Se o `autocommit` estiver habilitado, o `SELECT` é a sua própria Transaction. Portanto, ele é conhecido por ser Read Only e pode ser serializado se executado como um Consistent Read (nonlocking) e não precisa bloquear por outras transactions. (Para forçar um `SELECT` simples a bloquear se outras transactions tiverem modificado as Rows selecionadas, desabilite o `autocommit`.)