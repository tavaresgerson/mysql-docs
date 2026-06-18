## 23.8 Restrições em Stored Programs

* Instruções SQL Não Permitidas em Stored Routines
* Restrições para Stored Functions
* Restrições para Triggers
* Conflitos de Nomes dentro de Stored Routines
* Considerações sobre Replicação
* Considerações sobre Debugging
* Sintaxe Não Suportada do Padrão SQL:2003
* Considerações sobre Concorrência de Stored Routines
* Restrições do Event Scheduler
* Stored Programs no NDB Cluster

Estas restrições se aplicam aos recursos descritos no Capítulo 23, *Stored Objects*.

Algumas das restrições aqui mencionadas se aplicam a todos os *stored routines*; ou seja, tanto a *stored procedures* quanto a *stored functions*. Há também algumas restrições específicas para stored functions mas não para *stored procedures*.

As restrições para *stored functions* também se aplicam a *triggers*. Há também algumas restrições específicas para triggers.

As restrições para *stored procedures* também se aplicam à cláusula `DO` das definições de *event* do Event Scheduler. Há também algumas restrições específicas para events.

### Instruções SQL Não Permitidas em Stored Routines

Stored routines não podem conter instruções SQL arbitrárias. As seguintes instruções não são permitidas:

* As instruções de Lock `LOCK TABLES` e `UNLOCK TABLES`.

* `ALTER VIEW`.
* `LOAD DATA` e `LOAD XML`.

* SQL prepared statements (`PREPARE`, `EXECUTE`, `DEALLOCATE PREPARE`) podem ser usadas em *stored procedures*, mas não em *stored functions* ou *triggers*. Assim, *stored functions* e *triggers* não podem usar SQL dinâmico (onde você constrói instruções como *strings* e depois as executa).

* Geralmente, instruções não permitidas em SQL prepared statements também não são permitidas em *stored programs*. Para uma lista de instruções suportadas como *prepared statements*, veja Seção 13.5, “Prepared Statements”. Exceções são `SIGNAL`, `RESIGNAL`, e `GET DIAGNOSTICS`, que não são permissíveis como *prepared statements* mas são permitidas em *stored programs*.

* Como variáveis locais estão no *scope* apenas durante a execução de um *stored program*, referências a elas não são permitidas em *prepared statements* criadas dentro de um *stored program*. O *scope* do *prepared statement* é a sessão atual, não o *stored program*, então a instrução poderia ser executada após o programa terminar, momento em que as variáveis não estariam mais no *scope*. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como um *prepared statement*. Esta restrição também se aplica a parâmetros de *stored procedures* e *functions*. Veja Seção 13.5.1, “PREPARE Statement”.

* Dentro de todos os *stored programs* (*stored procedures* e *functions*, *triggers* e *events*), o *parser* trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`.

  Para iniciar uma Transaction dentro de um *stored procedure* ou *event*, use `START TRANSACTION` em vez disso.

  `START TRANSACTION` não pode ser usado dentro de uma *stored function* ou *trigger*.

### Restrições para Stored Functions

As seguintes instruções ou operações adicionais não são permitidas dentro de *stored functions*. Elas são permitidas dentro de *stored procedures*, exceto *stored procedures* que são invocadas de dentro de uma *stored function* ou *trigger*. Por exemplo, se você usar `FLUSH` em uma *stored procedure*, essa *stored procedure* não poderá ser chamada a partir de uma *stored function* ou *trigger*.

* Instruções que executam Commit ou Rollback explícito ou implícito. O suporte para essas instruções não é exigido pelo padrão SQL, que afirma que cada fornecedor de DBMS pode decidir se as permite.

* Instruções que retornam um *result set*. Isso inclui instruções `SELECT` que não possuem uma cláusula `INTO var_list` e outras instruções como `SHOW`, `EXPLAIN`, e `CHECK TABLE`. Uma *Function* pode processar um *result set* usando `SELECT ... INTO var_list` ou usando um *cursor* e instruções `FETCH`. Veja Seção 13.2.9.1, “SELECT ... INTO Statement”, e Seção 13.6.6, “Cursors”.

* Instruções `FLUSH`.
* Stored functions não podem ser usadas recursivamente.
* Uma *stored function* ou *trigger* não pode modificar uma tabela que já está sendo usada (para leitura ou escrita) pela instrução que invocou a *function* ou *trigger*.

* Se você fizer referência a uma tabela temporária múltiplas vezes em uma *stored function* sob diferentes *aliases*, ocorre um erro `Can't reopen table: 'tbl_name'`, mesmo que as referências ocorram em instruções diferentes dentro da *function*.

* Instruções `HANDLER ... READ` que invocam *stored functions* podem causar erros de Replicação e são proibidas.

### Restrições para Triggers

Para *triggers*, aplicam-se as seguintes restrições adicionais:

* Triggers não são ativados por ações de Foreign Key.
* Ao usar Replicação baseada em linha (*row-based replication*), *triggers* na réplica não são ativados por instruções originadas na fonte (*source*). Os *triggers* na réplica são ativados ao usar Replicação baseada em instrução (*statement-based replication*). Para mais informações, veja Seção 16.4.1.34, “Replication and Triggers”.

* A instrução `RETURN` não é permitida em *triggers*, que não podem retornar um valor. Para sair de um *trigger* imediatamente, use a instrução `LEAVE`.

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

O uso de *stored routines* pode causar problemas de Replicação. Este tópico é discutido em detalhes em Seção 23.7, “Stored Program Binary Logging”.

A opção `--replicate-wild-do-table=db_name.tbl_name` se aplica a tabelas, *views* e *triggers*. Não se aplica a *stored procedures*, *functions* ou *events*. Para filtrar instruções que operam nos últimos objetos, use uma ou mais opções `--replicate-*-db`.

### Considerações sobre Debugging

Não existem recursos de *debugging* para *stored routines*.

### Sintaxe Não Suportada do Padrão SQL:2003

A sintaxe de *stored routine* do MySQL é baseada no padrão SQL:2003. Os seguintes itens desse padrão não são atualmente suportados:

* `UNDO` handlers
* `FOR` loops

### Considerações sobre Concorrência de Stored Routines

Para prevenir problemas de interação entre sessões, quando um cliente emite uma instrução, o servidor usa um *snapshot* das *routines* e *triggers* disponíveis para a execução da instrução. Ou seja, o servidor calcula uma lista de *procedures*, *functions* e *triggers* que podem ser usados durante a execução da instrução, carrega-os e, em seguida, prossegue para executar a instrução. Enquanto a instrução é executada, ela não vê alterações nas *routines* realizadas por outras sessões.

Para máxima Concorrência, *stored functions* devem minimizar seus *side-effects*; em particular, atualizar uma tabela dentro de uma *stored function* pode reduzir operações concorrentes nessa tabela. Uma *stored function* adquire Table Locks antes de executar, para evitar inconsistência no Binary Log devido à incompatibilidade da ordem em que as instruções executam e quando elas aparecem no Log. Quando o *statement-based binary logging* é usado, as instruções que invocam uma *function* são registradas, em vez das instruções executadas dentro da *function*. Consequentemente, *stored functions* que atualizam as mesmas tabelas subjacentes não são executadas em paralelo. Em contraste, *stored procedures* não adquirem *table-level locks*. Todas as instruções executadas dentro de *stored procedures* são escritas no Binary Log, mesmo para *statement-based binary logging*. Veja Seção 23.7, “Stored Program Binary Logging”.

### Restrições do Event Scheduler

As seguintes limitações são específicas do Event Scheduler:

* Os nomes de Event são tratados de forma *case-insensitive*. Por exemplo, você não pode ter dois *events* no mesmo Database com os nomes `anEvent` e `AnEvent`.

* Um *event* não pode ser criado, alterado ou descartado de dentro de um *stored program*, se o nome do *event* for especificado por meio de uma variável. Um *event* também não pode criar, alterar ou descartar *stored routines* ou *triggers*.

* Instruções DDL em *events* são proibidas enquanto uma instrução `LOCK TABLES` estiver em vigor.

* Os *timings* de Event que usam os intervalos `YEAR`, `QUARTER`, `MONTH` e `YEAR_MONTH` são resolvidos em meses; aqueles que usam qualquer outro intervalo são resolvidos em segundos. Não há como fazer com que *events* programados para ocorrer no mesmo segundo sejam executados em uma determinada ordem. Além disso — devido a arredondamentos, à natureza de aplicações Threaded e ao fato de que um tempo de duração diferente de zero é necessário para criar *events* e sinalizar sua execução — *events* podem ser atrasados em até 1 ou 2 segundos. No entanto, o tempo exibido na coluna `LAST_EXECUTED` da tabela `EVENTS` do Information Schema ou na coluna `last_executed` da tabela `mysql.event` é sempre preciso em até um segundo do tempo real de execução do *event*. (Veja também Bug #16522.)

* Cada execução das instruções contidas no corpo de um *event* ocorre em uma nova *connection*; assim, essas instruções não têm efeito em uma determinada sessão de usuário nas contagens de instruções do servidor, como `Com_select` e `Com_insert`, que são exibidas por `SHOW STATUS`. No entanto, tais contagens *são* atualizadas no *global scope*. (Bug #16422)

* Events não suportam horários posteriores ao fim da Unix Epoch; isso é aproximadamente o início do ano de 2038. Tais datas são especificamente não permitidas pelo Event Scheduler. (Bug #16396)

* Referências a *stored functions*, *loadable functions* e tabelas nas cláusulas `ON SCHEDULE` das instruções `CREATE EVENT` e `ALTER EVENT` não são suportadas. Este tipo de referência não é permitido. (Consulte Bug #22830 para obter mais informações.)

### Stored Programs no NDB Cluster

Embora *stored procedures*, *stored functions*, *triggers* e *events* agendados sejam todos suportados por tabelas que usam o Storage Engine `NDB`, você deve ter em mente que eles *não* se propagam automaticamente entre MySQL Servers atuando como nós SQL do Cluster. Isso ocorre devido ao seguinte:

* As definições de *stored routine* são mantidas em tabelas no System Database `mysql` usando o Storage Engine `MyISAM`, e, portanto, não participam do *clustering*.

* Os arquivos `.TRN` e `.TRG` contendo definições de *trigger* não são lidos pelo Storage Engine `NDB`, e não são copiados entre os nós do Cluster.

Qualquer *stored routine* ou *trigger* que interaja com tabelas NDB Cluster deve ser recriado executando as instruções apropriadas `CREATE PROCEDURE`, `CREATE FUNCTION` ou `CREATE TRIGGER` em cada MySQL Server que participa do Cluster onde você deseja usar a *stored routine* ou *trigger*. Da mesma forma, quaisquer alterações em *stored routines* ou *triggers* existentes devem ser realizadas explicitamente em todos os nós SQL do Cluster, usando as instruções `ALTER` ou `DROP` apropriadas em cada MySQL Server que acessa o Cluster.

Aviso

*Não* tente contornar o problema descrito no primeiro item mencionado anteriormente convertendo quaisquer tabelas do Database `mysql` para usar o Storage Engine `NDB`. *A alteração das System Tables no Database `mysql` não é suportada* e é muito provável que produza resultados indesejáveis.
