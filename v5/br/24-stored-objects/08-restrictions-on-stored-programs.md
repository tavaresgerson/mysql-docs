## 23.8 Restrições em Stored Programs

* [Instruções SQL Não Permitidas em Stored Routines](stored-program-restrictions.html#stored-routine-sql-restrictions "SQL Statements Not Permitted in Stored Routines")
* [Restrições para Stored Functions](stored-program-restrictions.html#stored-routines-function-restrictions "Restrictions for Stored Functions")
* [Restrições para Triggers](stored-program-restrictions.html#stored-routines-trigger-restrictions "Restrictions for Triggers")
* [Conflitos de Nomes dentro de Stored Routines](stored-program-restrictions.html#stored-routine-name-conflicts "Name Conflicts within Stored Routines")
* [Considerações sobre Replicação](stored-program-restrictions.html#stored-routines-replication-restrictions "Replication Considerations")
* [Considerações sobre Debugging](stored-program-restrictions.html#stored-routines-debugging-restrictions "Debugging Considerations")
* [Sintaxe Não Suportada do Padrão SQL:2003](stored-program-restrictions.html#stored-routines-standard-restrictions "Unsupported Syntax from the SQL:2003 Standard")
* [Considerações sobre Concorrência de Stored Routines](stored-program-restrictions.html#stored-routines-concurrency-restrictions "Stored Routine Concurrency Considerations")
* [Restrições do Event Scheduler](stored-program-restrictions.html#stored-routines-event-restrictions "Event Scheduler Restrictions")
* [Stored Programs no NDB Cluster](stored-program-restrictions.html#stored-routines-ndbcluster "Stored Programs in NDB Cluster")

Estas restrições se aplicam aos recursos descritos no [Capítulo 23, *Stored Objects*](stored-objects.html "Chapter 23 Stored Objects").

Algumas das restrições aqui mencionadas se aplicam a todos os *stored routines*; ou seja, tanto a *stored procedures* quanto a *stored functions*. Há também algumas [restrições específicas para stored functions](stored-program-restrictions.html#stored-routines-function-restrictions "Restrictions for Stored Functions") mas não para *stored procedures*.

As restrições para *stored functions* também se aplicam a *triggers*. Há também algumas [restrições específicas para triggers](stored-program-restrictions.html#stored-routines-trigger-restrictions "Restrictions for Triggers").

As restrições para *stored procedures* também se aplicam à cláusula [`DO`](do.html "13.2.3 DO Statement") das definições de *event* do Event Scheduler. Há também algumas [restrições específicas para events](stored-program-restrictions.html#stored-routines-event-restrictions "Event Scheduler Restrictions").

### Instruções SQL Não Permitidas em Stored Routines

Stored routines não podem conter instruções SQL arbitrárias. As seguintes instruções não são permitidas:

* As instruções de Lock [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") e [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

* [`ALTER VIEW`](alter-view.html "13.1.10 ALTER VIEW Statement").
* [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement").

* SQL prepared statements ([`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement")) podem ser usadas em *stored procedures*, mas não em *stored functions* ou *triggers*. Assim, *stored functions* e *triggers* não podem usar SQL dinâmico (onde você constrói instruções como *strings* e depois as executa).

* Geralmente, instruções não permitidas em SQL prepared statements também não são permitidas em *stored programs*. Para uma lista de instruções suportadas como *prepared statements*, veja [Seção 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements"). Exceções são [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"), e [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement"), que não são permissíveis como *prepared statements* mas são permitidas em *stored programs*.

* Como variáveis locais estão no *scope* apenas durante a execução de um *stored program*, referências a elas não são permitidas em *prepared statements* criadas dentro de um *stored program*. O *scope* do *prepared statement* é a sessão atual, não o *stored program*, então a instrução poderia ser executada após o programa terminar, momento em que as variáveis não estariam mais no *scope*. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como um *prepared statement*. Esta restrição também se aplica a parâmetros de *stored procedures* e *functions*. Veja [Seção 13.5.1, “PREPARE Statement”](prepare.html "13.5.1 PREPARE Statement").

* Dentro de todos os *stored programs* (*stored procedures* e *functions*, *triggers* e *events*), o *parser* trata [`BEGIN [WORK]`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") como o início de um bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement").

  Para iniciar uma Transaction dentro de um *stored procedure* ou *event*, use [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") em vez disso.

  `START TRANSACTION` não pode ser usado dentro de uma *stored function* ou *trigger*.

### Restrições para Stored Functions

As seguintes instruções ou operações adicionais não são permitidas dentro de *stored functions*. Elas são permitidas dentro de *stored procedures*, exceto *stored procedures* que são invocadas de dentro de uma *stored function* ou *trigger*. Por exemplo, se você usar [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") em uma *stored procedure*, essa *stored procedure* não poderá ser chamada a partir de uma *stored function* ou *trigger*.

* Instruções que executam Commit ou Rollback explícito ou implícito. O suporte para essas instruções não é exigido pelo padrão SQL, que afirma que cada fornecedor de DBMS pode decidir se as permite.

* Instruções que retornam um *result set*. Isso inclui instruções [`SELECT`](select.html "13.2.9 SELECT Statement") que não possuem uma cláusula `INTO var_list` e outras instruções como [`SHOW`](show.html "13.7.5 SHOW Statements"), [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), e [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"). Uma *Function* pode processar um *result set* usando [`SELECT ... INTO var_list`](select-into.html "13.2.9.1 SELECT ... INTO Statement") ou usando um *cursor* e instruções [`FETCH`](fetch.html "13.6.6.3 Cursor FETCH Statement"). Veja [Seção 13.2.9.1, “SELECT ... INTO Statement”](select-into.html "13.2.9.1 SELECT ... INTO Statement"), e [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

* Instruções [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement").
* Stored functions não podem ser usadas recursivamente.
* Uma *stored function* ou *trigger* não pode modificar uma tabela que já está sendo usada (para leitura ou escrita) pela instrução que invocou a *function* ou *trigger*.

* Se você fizer referência a uma tabela temporária múltiplas vezes em uma *stored function* sob diferentes *aliases*, ocorre um erro `Can't reopen table: 'tbl_name'`, mesmo que as referências ocorram em instruções diferentes dentro da *function*.

* Instruções [`HANDLER ... READ`](handler.html "13.2.4 HANDLER Statement") que invocam *stored functions* podem causar erros de Replicação e são proibidas.

### Restrições para Triggers

Para *triggers*, aplicam-se as seguintes restrições adicionais:

* Triggers não são ativados por ações de Foreign Key.
* Ao usar Replicação baseada em linha (*row-based replication*), *triggers* na réplica não são ativados por instruções originadas na fonte (*source*). Os *triggers* na réplica são ativados ao usar Replicação baseada em instrução (*statement-based replication*). Para mais informações, veja [Seção 16.4.1.34, “Replication and Triggers”](replication-features-triggers.html "16.4.1.34 Replication and Triggers").

* A instrução [`RETURN`](return.html "13.6.5.7 RETURN Statement") não é permitida em *triggers*, que não podem retornar um valor. Para sair de um *trigger* imediatamente, use a instrução [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement").

* Triggers não são permitidos em tabelas no Database `mysql`. Nem são permitidos em tabelas `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, Views, e *triggers* não são permitidos em *views*.

* O cache de *trigger* não detecta quando os metadados dos objetos subjacentes foram alterados. Se um *trigger* usa uma tabela e a tabela mudou desde que o *trigger* foi carregado no cache, o *trigger* opera usando metadados desatualizados.

### Conflitos de Nomes dentro de Stored Routines

O mesmo identificador pode ser usado para um parâmetro de *routine*, uma variável local e uma coluna de tabela. Além disso, o mesmo nome de variável local pode ser usado em blocos aninhados. Por exemplo:

```sql
CREATE PROCEDURE p (i INT)
BEGIN
  DECLARE i INT DEFAULT 0;
  SELECT i FROM t;
  BEGIN
    DECLARE i INT DEFAULT 1;
    SELECT i FROM t;
  END;
END;
```

Nesses casos, o identificador é ambíguo e as seguintes regras de precedência se aplicam:

* Uma variável local tem precedência sobre um parâmetro de *routine* ou coluna de tabela.

* Um parâmetro de *routine* tem precedência sobre uma coluna de tabela.
* Uma variável local em um bloco interno tem precedência sobre uma variável local em um bloco externo.

O comportamento em que variáveis têm precedência sobre colunas de tabela não é padrão.

### Considerações sobre Replicação

O uso de *stored routines* pode causar problemas de Replicação. Este tópico é discutido em detalhes em [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

A opção [`--replicate-wild-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) se aplica a tabelas, *views* e *triggers*. Não se aplica a *stored procedures*, *functions* ou *events*. Para filtrar instruções que operam nos últimos objetos, use uma ou mais opções `--replicate-*-db`.

### Considerações sobre Debugging

Não existem recursos de *debugging* para *stored routines*.

### Sintaxe Não Suportada do Padrão SQL:2003

A sintaxe de *stored routine* do MySQL é baseada no padrão SQL:2003. Os seguintes itens desse padrão não são atualmente suportados:

* `UNDO` handlers
* `FOR` loops

### Considerações sobre Concorrência de Stored Routines

Para prevenir problemas de interação entre sessões, quando um cliente emite uma instrução, o servidor usa um *snapshot* das *routines* e *triggers* disponíveis para a execução da instrução. Ou seja, o servidor calcula uma lista de *procedures*, *functions* e *triggers* que podem ser usados durante a execução da instrução, carrega-os e, em seguida, prossegue para executar a instrução. Enquanto a instrução é executada, ela não vê alterações nas *routines* realizadas por outras sessões.

Para máxima Concorrência, *stored functions* devem minimizar seus *side-effects*; em particular, atualizar uma tabela dentro de uma *stored function* pode reduzir operações concorrentes nessa tabela. Uma *stored function* adquire Table Locks antes de executar, para evitar inconsistência no Binary Log devido à incompatibilidade da ordem em que as instruções executam e quando elas aparecem no Log. Quando o *statement-based binary logging* é usado, as instruções que invocam uma *function* são registradas, em vez das instruções executadas dentro da *function*. Consequentemente, *stored functions* que atualizam as mesmas tabelas subjacentes não são executadas em paralelo. Em contraste, *stored procedures* não adquirem *table-level locks*. Todas as instruções executadas dentro de *stored procedures* são escritas no Binary Log, mesmo para *statement-based binary logging*. Veja [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

### Restrições do Event Scheduler

As seguintes limitações são específicas do Event Scheduler:

* Os nomes de Event são tratados de forma *case-insensitive*. Por exemplo, você não pode ter dois *events* no mesmo Database com os nomes `anEvent` e `AnEvent`.

* Um *event* não pode ser criado, alterado ou descartado de dentro de um *stored program*, se o nome do *event* for especificado por meio de uma variável. Um *event* também não pode criar, alterar ou descartar *stored routines* ou *triggers*.

* Instruções DDL em *events* são proibidas enquanto uma instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") estiver em vigor.

* Os *timings* de Event que usam os intervalos `YEAR`, `QUARTER`, `MONTH` e `YEAR_MONTH` são resolvidos em meses; aqueles que usam qualquer outro intervalo são resolvidos em segundos. Não há como fazer com que *events* programados para ocorrer no mesmo segundo sejam executados em uma determinada ordem. Além disso — devido a arredondamentos, à natureza de aplicações Threaded e ao fato de que um tempo de duração diferente de zero é necessário para criar *events* e sinalizar sua execução — *events* podem ser atrasados em até 1 ou 2 segundos. No entanto, o tempo exibido na coluna `LAST_EXECUTED` da tabela [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") do Information Schema ou na coluna `last_executed` da tabela `mysql.event` é sempre preciso em até um segundo do tempo real de execução do *event*. (Veja também Bug #16522.)

* Cada execução das instruções contidas no corpo de um *event* ocorre em uma nova *connection*; assim, essas instruções não têm efeito em uma determinada sessão de usuário nas contagens de instruções do servidor, como `Com_select` e `Com_insert`, que são exibidas por [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"). No entanto, tais contagens *são* atualizadas no *global scope*. (Bug #16422)

* Events não suportam horários posteriores ao fim da Unix Epoch; isso é aproximadamente o início do ano de 2038. Tais datas são especificamente não permitidas pelo Event Scheduler. (Bug #16396)

* Referências a *stored functions*, *loadable functions* e tabelas nas cláusulas `ON SCHEDULE` das instruções [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") e [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") não são suportadas. Este tipo de referência não é permitido. (Consulte Bug #22830 para obter mais informações.)

### Stored Programs no NDB Cluster

Embora *stored procedures*, *stored functions*, *triggers* e *events* agendados sejam todos suportados por tabelas que usam o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você deve ter em mente que eles *não* se propagam automaticamente entre MySQL Servers atuando como nós SQL do Cluster. Isso ocorre devido ao seguinte:

* As definições de *stored routine* são mantidas em tabelas no System Database `mysql` usando o Storage Engine `MyISAM`, e, portanto, não participam do *clustering*.

* Os arquivos `.TRN` e `.TRG` contendo definições de *trigger* não são lidos pelo Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), e não são copiados entre os nós do Cluster.

Qualquer *stored routine* ou *trigger* que interaja com tabelas NDB Cluster deve ser recriado executando as instruções apropriadas [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements"), [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement") ou [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") em cada MySQL Server que participa do Cluster onde você deseja usar a *stored routine* ou *trigger*. Da mesma forma, quaisquer alterações em *stored routines* ou *triggers* existentes devem ser realizadas explicitamente em todos os nós SQL do Cluster, usando as instruções `ALTER` ou `DROP` apropriadas em cada MySQL Server que acessa o Cluster.

Aviso

*Não* tente contornar o problema descrito no primeiro item mencionado anteriormente convertendo quaisquer tabelas do Database `mysql` para usar o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). *A alteração das System Tables no Database `mysql` não é suportada* e é muito provável que produza resultados indesejáveis.
