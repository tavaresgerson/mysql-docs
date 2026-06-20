## 13.3 Declarações Transacionais e de Acionamento de Fechamento

O MySQL suporta transações locais (dentro de uma sessão de cliente dada) através de declarações como `SET autocommit`, `START TRANSACTION`, `COMMIT` e `ROLLBACK`. Veja a Seção 13.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”. O suporte a transações XA permite que o MySQL também participe em transações distribuídas. Veja a Seção 13.3.7, “Transações XA”.

### 13.3.1 Estruturas de Transação, Commit e Rollback

```sql
START TRANSACTION
    [transaction_characteristic [, transaction_characteristic] ...]

transaction_characteristic: {
    WITH CONSISTENT SNAPSHOT
  | READ WRITE
  | READ ONLY
}

BEGIN [WORK]
COMMIT [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
ROLLBACK [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
SET autocommit = {0 | 1}
```

Essas declarações fornecem controle sobre o uso de transações:

* `START TRANSACTION` ou `BEGIN` inicia uma nova transação.

* `COMMIT` compromete a transação atual, tornando suas alterações permanentes.

* `ROLLBACK` desfaz a transação atual, cancelando suas alterações.

* `SET autocommit` desabilita ou habilita o modo de autocommit padrão para a sessão atual.

Por padrão, o MySQL é executado com o modo de autocommit ativado. Isso significa que, quando não estiver dentro de uma transação, cada declaração é atômica, como se estivesse cercada por `START TRANSACTION` e `COMMIT`. Você não pode usar `ROLLBACK` para desfazer o efeito; no entanto, se ocorrer um erro durante a execução da declaração, a declaração é revertida.

Para desabilitar o modo de autocommit implicitamente para uma única série de declarações, use a declaração `START TRANSACTION`:

```sql
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

Com `START TRANSACTION`, o autocommit permanece desativado até que você termine a transação com `COMMIT` ou `ROLLBACK`. O modo de autocommit então retorna ao seu estado anterior.

`START TRANSACTION` permite vários modificadores que controlam as características da transação. Para especificar vários modificadores, separe-os por vírgulas.

O modificador `WITH CONSISTENT SNAPSHOT` inicia uma leitura consistente para motores de armazenamento que são capazes disso. Isso se aplica apenas ao `InnoDB`. O efeito é o mesmo que emitir um `START TRANSACTION` seguido por um `SELECT` de qualquer tabela `InnoDB`. Veja a Seção 14.7.2.3, “Leitura Não Bloqueada Consistente”. O modificador `WITH CONSISTENT SNAPSHOT` não altera o nível de isolamento de transação atual, portanto, fornece uma instantânea consistente apenas se o nível de isolamento atual for um que permita uma leitura consistente. O único nível de isolamento que permite uma leitura consistente é `REPEATABLE READ`. Para todos os outros níveis de isolamento, a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada. A partir do MySQL 5.7.2, um aviso é gerado quando a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada.

* Os modificadores `READ WRITE` e `READ ONLY` definem o modo de acesso à transação. Eles permitem ou proíbem alterações em tabelas utilizadas na transação. A restrição `READ ONLY` impede que a transação modifique ou bloqueie tabelas tanto transacionais quanto não transacionais que são visíveis para outras transações; a transação ainda pode modificar ou bloquear tabelas temporárias.

O MySQL permite otimizações adicionais para consultas em tabelas `InnoDB`, quando a transação é conhecida como somente leitura. Especificar `READ ONLY` garante que essas otimizações sejam aplicadas nos casos em que o status de somente leitura não pode ser determinado automaticamente. Consulte a Seção 8.5.3, “Otimizando Transações somente leitura do InnoDB”, para mais informações.

Se nenhum modo de acesso for especificado, o modo padrão será aplicado. A menos que o padrão tenha sido alterado, ele é de leitura/escrita. Não é permitido especificar tanto `READ WRITE` quanto `READ ONLY` na mesma declaração.

No modo somente leitura, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Para obter informações adicionais sobre o modo de acesso à transação, incluindo maneiras de alterar o modo padrão, consulte a Seção 13.3.6, “Instrução SET TRANSACTION”.

Se a variável de sistema `read_only` estiver habilitada, iniciar explicitamente uma transação com `START TRANSACTION READ WRITE` requer o privilégio `SUPER`.

Importante

Muitas APIs usadas para escrever aplicações de cliente MySQL (como JDBC) fornecem seus próprios métodos para iniciar transações que podem (e às vezes devem) ser usadas em vez de enviar uma declaração `START TRANSACTION` do cliente. Consulte o Capítulo 27, *Conectores e APIs*, ou a documentação da sua API, para mais informações.

Para desabilitar o modo de autocommit explicitamente, use a seguinte declaração:

```sql
SET autocommit=0;
```

Após desabilitar o modo de autocommit, definindo a variável `autocommit` como zero, as alterações em tabelas seguras para transações (como as de `InnoDB` ou `NDB`) não são feitas permanentemente imediatamente. Você deve usar `COMMIT` para armazenar suas alterações no disco ou `ROLLBACK` para ignorar as alterações.

`autocommit` é uma variável de sessão e deve ser definida para cada sessão. Para desabilitar o modo de autocommit para cada nova conexão, consulte a descrição da variável de sistema `autocommit` na Seção 5.1.7, “Variáveis do sistema do servidor”.

`BEGIN` e `BEGIN WORK` são suportados como aliases de `START TRANSACTION` para iniciar uma transação. `START TRANSACTION` é a sintaxe padrão do SQL, é a maneira recomendada para iniciar uma transação ad-hoc e permite modificadores que `BEGIN` não permite.

A declaração `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma declaração composta `BEGIN ... END`. Esta última não inicia uma transação. Veja a Seção 13.6.1, “BEGIN ... END Declaração Composta”.

Nota

Dentro de todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Comece uma transação neste contexto com `START TRANSACTION` em vez disso.

A palavra-chave opcional `WORK` é suportada para `COMMIT` e `ROLLBACK`, assim como as cláusulas `CHAIN` e `RELEASE`. `CHAIN` e `RELEASE` podem ser usados para controle adicional sobre o término da transação. O valor da variável de sistema `completion_type` determina o comportamento padrão de conclusão. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

A cláusula `AND CHAIN` faz com que uma nova transação comece assim que a transação atual termina, e a nova transação tem o mesmo nível de isolamento que a transação que acabou de ser terminada. A nova transação também usa o mesmo modo de acesso (`READ WRITE` ou `READ ONLY`) que a transação que acabou de ser terminada. A cláusula `RELEASE` faz com que o servidor desconecte a sessão do cliente atual após a conclusão da transação atual. Incluir a palavra-chave `NO` suprime a conclusão de `CHAIN` ou `RELEASE`, o que pode ser útil se a variável de sistema `completion_type` estiver definida para causar encaixe ou liberação de conclusão por padrão.

Começar uma transação faz com que qualquer transação pendente seja comprometida. Consulte a Seção 13.3.3, “Declarações que causam um compromisso implícito”, para obter mais informações.

Começar uma transação também faz com que as chaves de tabela adquiridas com `LOCK TABLES` sejam liberadas, como se você tivesse executado `UNLOCK TABLES`. Começar uma transação não libera uma chave de leitura global adquirida com `FLUSH TABLES WITH READ LOCK`.

Para obter os melhores resultados, as transações devem ser realizadas usando apenas tabelas gerenciadas por um único motor de armazenamento seguro para transações. Caso contrário, os seguintes problemas podem ocorrer:

* Se você usa tabelas de mais de um mecanismo de armazenamento seguro para transações (como `InnoDB`), e o nível de isolamento de transação não é `SERIALIZABLE`, é possível que, quando uma transação é confirmada, outra transação em andamento que usa as mesmas tabelas veja apenas algumas das alterações feitas pela primeira transação. Isso significa que a atomicidade das transações não é garantida com motores mistos e inconsistências podem resultar. (Se as transações com motores mistos são infrequentes, você pode usar `SET TRANSACTION ISOLATION LEVEL` para definir o nível de isolamento para `SERIALIZABLE` em uma base por transação, conforme necessário.)

* Se você usar tabelas que não são seguras para transações dentro de uma transação, as alterações nessas tabelas são armazenadas de uma só vez, independentemente do status do modo de autocommit.

* Se você emitir uma declaração `ROLLBACK` após atualizar uma tabela não transacional dentro de uma transação, um aviso `ER_WARNING_NOT_COMPLETE_ROLLBACK` ocorre. As alterações em tabelas seguras para transação são revertidas, mas não as alterações em tabelas não seguras para transação.

Cada transação é armazenada no log binário em um único bloco, após `COMMIT`. As transações que são revertidas não são registradas. (**Exceção**: As modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nas tabelas não transacionais sejam replicadas.) Veja a Seção 5.4.4, “O Log Binário”.

Você pode alterar o nível de isolamento ou o modo de acesso para transações com a declaração `SET TRANSACTION`. Veja a Seção 13.3.6, “Declaração SET TRANSACTION”.

O recuo pode ser uma operação lenta que pode ocorrer implicitamente sem que o usuário tenha explicitamente solicitado (por exemplo, quando ocorre um erro). Por isso, `SHOW PROCESSLIST` exibe `Rolling back` na coluna `State` para a sessão, não apenas para recuos explícitos realizados com a declaração `ROLLBACK`, mas também para recuos implícitos.

Nota

Em MySQL 5.7, `BEGIN`, `COMMIT` e `ROLLBACK` não são afetados pelas regras de `--replicate-do-db` ou `--replicate-ignore-db`.

Quando o `InnoDB` realiza um rollback completo de uma transação, todas as bloqueadoras definidas pela transação são liberadas. Se uma única declaração SQL dentro de uma transação for revertida como resultado de um erro, como um erro de chave duplicada, as bloqueadoras definidas pela declaração são preservadas enquanto a transação permanece ativa. Isso acontece porque o `InnoDB` armazena bloqueadoras de string em um formato de tal forma que não pode saber posteriormente qual bloqueadora foi definida por qual declaração.

Se uma declaração `SELECT` dentro de uma transação chamar uma função armazenada, e uma declaração dentro da função armazenada falhar, essa declaração é revertida. Se `ROLLBACK` for executado para a transação subsequentemente, toda a transação é revertida.

### 13.3.2 Declarações que não podem ser revertidas

Algumas declarações não podem ser revertidas. Em geral, essas incluem declarações de linguagem de definição de dados (DDL), como aquelas que criam ou excluem bancos de dados, aquelas que criam, excluem ou alteram tabelas ou rotinas armazenadas.

Você deve projetar suas transações para não incluir tais declarações. Se você emitir uma declaração no início de uma transação que não pode ser revertida, e, em seguida, outra declaração falha mais tarde, o efeito total da transação não pode ser revertido nesses casos, emitindo uma declaração `ROLLBACK`.

### 13.3.3 Declarações que Causam um Compromisso Implícito

As declarações listadas nesta seção (e quaisquer sinônimos para elas) implicitamente encerram qualquer transação ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração.

A maioria dessas declarações também causa um compromisso implícito após a execução. O objetivo é lidar com cada uma dessas declarações em sua própria transação especial, porque não pode ser revertida de qualquer maneira. As declarações de controle e bloqueio de transação são exceções: se um compromisso implícito ocorre antes da execução, outro não ocorre depois.

* **declarações de linguagem de definição de dados (DDL) que definem ou modificam objetos de banco de dados.** `ALTER DATABASE ... UPGRADE DATA DIRECTORY NAME`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER SERVER`, `ALTER TABLE`, `ALTER TABLESPACE`, `ALTER VIEW`, `CREATE DATABASE`, `CREATE EVENT`, `CREATE INDEX`, `CREATE PROCEDURE`, `CREATE SERVER`, `CREATE TABLE`, `CREATE TABLESPACE`, `CREATE TRIGGER`, `CREATE VIEW`, `DROP DATABASE`, `DROP EVENT`, `DROP INDEX`, `DROP PROCEDURE`, `DROP SERVER`, `DROP TABLE`, `DROP TABLESPACE`, `DROP TRIGGER`, `DROP VIEW`, `INSTALL PLUGIN`, `RENAME TABLE`, `TRUNCATE TABLE`, `UNINSTALL PLUGIN`.

`ALTER FUNCTION`, `CREATE FUNCTION` e `DROP FUNCTION` também causam um compromisso implícito quando usados com funções armazenadas, mas não com funções carregáveis. (`ALTER FUNCTION` só pode ser usado com funções armazenadas.)

As declarações `CREATE TABLE` e `DROP TABLE` não comprometem uma transação se a palavra-chave `TEMPORARY` for usada. (Isso não se aplica a outras operações em tabelas temporárias, como `ALTER TABLE` e `CREATE INDEX`, que causam um compromisso.) No entanto, embora não ocorra um compromisso implícito, a declaração também não pode ser revertida, o que significa que o uso dessas declarações causa a violação da atomicidade transacional. Por exemplo, se você usar `CREATE TEMPORARY TABLE` e depois reverter a transação, a tabela permanece em existência.

A declaração `CREATE TABLE` em `InnoDB` é processada como uma única transação. Isso significa que uma declaração `ROLLBACK` do usuário não anula as declarações `CREATE TABLE` que o usuário fez durante essa transação.

`CREATE TABLE ... SELECT` causa um compromisso implícito antes e depois da declaração ser executada quando você está criando tabelas não temporárias. (Não ocorre compromisso para `CREATE TEMPORARY TABLE ... SELECT`.)

* **Declarações que implicitamente utilizam ou modificam tabelas no banco de dados `mysql`. `ALTER USER`, `CREATE USER`, `DROP USER`, `GRANT`, `RENAME USER`, `REVOKE`, `SET PASSWORD`.

* **Declarações de controle e bloqueio de transações.** `BEGIN`, `LOCK TABLES`, `SET autocommit = 1` (se o valor não for já 1), `START TRANSACTION`, `UNLOCK TABLES`.

`UNLOCK TABLES` realiza uma transação apenas se quaisquer tabelas estiverem atualmente bloqueadas com `LOCK TABLES` para adquirir bloqueios não transacionais de tabela. Não ocorre um compromisso para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK` porque a última declaração não adquire bloqueios de nível de tabela.

As transações não podem ser aninhadas. Essa é uma consequência do compromisso implícito realizado para qualquer transação atual quando você emite uma declaração `START TRANSACTION` ou uma de seus sinônimos.

As declarações que causam um compromisso implícito não podem ser usadas em uma transação XA enquanto a transação estiver no estado `ACTIVE`.

A declaração `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma declaração composta `BEGIN ... END`. Esta última não causa um compromisso implícito. Veja a Seção 13.6.1, “BEGIN ... END Declaração Composta”.

* **Declarações de carregamento de dados.** `LOAD DATA`. `LOAD DATA` causa um compromisso implícito apenas para tabelas que utilizam o mecanismo de armazenamento `NDB`.

* **Declarações administrativas.** `ANALYZE TABLE`, `CACHE INDEX`, `CHECK TABLE`, `FLUSH`, `LOAD INDEX INTO CACHE`, `OPTIMIZE TABLE`, `REPAIR TABLE`, `RESET`.

* **declarações de controle de replicação**. `START SLAVE`, `STOP SLAVE`, `RESET SLAVE`, `CHANGE MASTER TO`.

### 13.3.4 Declarações SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

```sql
SAVEPOINT identifier
ROLLBACK [WORK] TO [SAVEPOINT] identifier
RELEASE SAVEPOINT identifier
```

`InnoDB` suporta as declarações SQL `SAVEPOINT`, `ROLLBACK TO SAVEPOINT`, `RELEASE SAVEPOINT` e a palavra-chave opcional `WORK` para `ROLLBACK`.

A declaração `SAVEPOINT` define um ponto de salvamento de transação nomeado com o nome de *`identifier`*. Se a transação atual tiver um ponto de salvamento com o mesmo nome, o antigo ponto de salvamento é excluído e um novo é definido.

A declaração `ROLLBACK TO SAVEPOINT` desfaz uma transação até o ponto de salvamento nomeado sem a sua conclusão. As modificações que a transação atual fez em strings após o ponto de salvamento ter sido definido são desfeitas no desfazimento, mas a `InnoDB` *não* libera os bloqueios de string que foram armazenados na memória após o ponto de salvamento. (Para uma nova string inserida, as informações de bloqueio são carregadas pelo ID de transação armazenado na string; o bloqueio não é armazenado separadamente na memória. Neste caso, o bloqueio de string é liberado no desfazimento.) Os pontos de salvamento que foram definidos em um momento posterior ao ponto de salvamento nomeado são excluídos.

Se a declaração `ROLLBACK TO SAVEPOINT` retornar o seguinte erro, isso significa que não existe um ponto de salvamento com o nome especificado:

```sql
ERROR 1305 (42000): SAVEPOINT identifier does not exist
```

A declaração `RELEASE SAVEPOINT` remove o ponto de salvamento nomeado do conjunto de pontos de salvamento da transação atual. Não ocorre nenhum compromisso ou rollback. É um erro se o ponto de salvamento não existir.

Todos os pontos de salvamento da transação atual são excluídos se você executar um `COMMIT`, ou um `ROLLBACK` que não nomeia um ponto de salvamento.

Um novo nível de ponto de salvamento é criado quando uma função armazenada é invocada ou um gatilho é ativado. Os pontos de salvamento dos níveis anteriores tornam-se indisponíveis e, portanto, não entram em conflito com os pontos de salvamento do novo nível. Quando a função ou o gatilho termina, quaisquer pontos de salvamento que ele criou são liberados e o nível de ponto de salvamento anterior é restaurado.

### 13.3.5 Declarações LOCK TABLES e UNLOCK TABLES

```sql
LOCK {TABLE | TABLES}
    tbl_name [[AS] alias] lock_type
    [, tbl_name [[AS] alias] lock_type] ...

lock_type: {
    READ [LOCAL]
  | [LOW_PRIORITY] WRITE
}

UNLOCK {TABLE | TABLES}
```

O MySQL permite que as sessões do cliente adquiram bloqueios de tabela explicitamente com o propósito de cooperar com outras sessões para o acesso a tabelas, ou para impedir que outras sessões modifiquem as tabelas durante períodos em que uma sessão requer acesso exclusivo a elas. Uma sessão só pode adquirir ou liberar bloqueios para si mesma. Uma sessão não pode adquirir bloqueios para outra sessão ou liberar bloqueios mantidos por outra sessão.

As chaves de bloqueio podem ser usadas para emular transações ou para obter mais velocidade ao atualizar tabelas. Isso é explicado com mais detalhes em Restrições e condições de bloqueio de tabela.

`LOCK TABLES` adquire explicitamente bloqueios de tabela para a sessão atual do cliente. Bloqueios de tabela podem ser adquiridos para tabelas de base ou visualizações. Você deve ter o privilégio `LOCK TABLES` e o privilégio `SELECT` para cada objeto que deve ser bloqueado.

Para o bloqueio de visualização, `LOCK TABLES` adiciona todas as tabelas de base usadas na visualização ao conjunto de tabelas a serem bloqueadas e as bloqueia automaticamente. A partir do MySQL 5.7.32, `LOCK TABLES` verifica se o definidor da visualização tem os devidos privilégios nas tabelas que fundamentam a visualização.

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, todas as tabelas usadas em gatilhos também são bloqueadas implicitamente, conforme descrito em LOCK TABLES e Triggers.

`UNLOCK TABLES` libera explicitamente quaisquer bloqueios de tabela mantidos pela sessão atual. `LOCK TABLES` libera implicitamente quaisquer bloqueios de tabela mantidos pela sessão atual antes de adquirir novos bloqueios.

Outro uso para `UNLOCK TABLES` é liberar o bloqueio de leitura global adquirido com a declaração `FLUSH TABLES WITH READ LOCK`, o que permite bloquear todas as tabelas em todos os bancos de dados. Veja a Seção 13.7.6.3, “Declaração FLUSH”. (Esta é uma maneira muito conveniente de obter backups se você tiver um sistema de arquivos como o Veritas que pode capturar instantâneos no tempo.)

`LOCK TABLE` é sinônimo de `LOCK TABLES`; `UNLOCK TABLE` é sinônimo de `UNLOCK TABLES`.

Um bloqueio de tabela protege apenas contra leituras ou escritas inadequadas por outras sessões. Uma sessão que detém um bloqueio `WRITE` pode realizar operações de nível de tabela, como `DROP TABLE` ou `TRUNCATE TABLE`. Para sessões que detêm um bloqueio `READ`, as operações `DROP TABLE` e `TRUNCATE TABLE` não são permitidas.

A discussão a seguir se aplica apenas a tabelas que não são `TEMPORARY`. `LOCK TABLES` é permitido (mas ignorado) para uma tabela `TEMPORARY`. A tabela pode ser acessada livremente pela sessão na qual foi criada, independentemente do que outra bloqueio possa estar em vigor. Nenhum bloqueio é necessário porque nenhuma outra sessão pode ver a tabela.

* Aquisição de bloqueio de tabela
* Liberação de bloqueio de tabela
* Interação entre o bloqueio de tabela e as transações
* LOCK TABLES e gatilhos
* Restrições e condições de bloqueio de tabela

#### Aquisição de bloqueio de mesa

Para adquirir blocos de tabela dentro da sessão atual, use a declaração `LOCK TABLES`, que adquire blocos de metadados (consulte Seção 8.11.4, “Bloqueio de metadados”).

Os seguintes tipos de bloqueio estão disponíveis:

`READ [LOCAL]` bloqueio:

* A sessão que detém o bloqueio pode ler a tabela (mas não escrevê-la).

* Múltiplas sessões podem adquirir um bloqueio `READ` para a tabela ao mesmo tempo.

* Outras sessões podem ler a tabela sem adquirir explicitamente um bloqueio `READ`.

* O modificador `LOCAL` permite que declarações `INSERT` não conflitantes (inserções concorrentes) de outras sessões sejam executadas enquanto o bloqueio é mantido. (Veja a Seção 8.11.3, “Inserções Concorrentes”.) No entanto, `READ LOCAL` não pode ser usado se você vai manipular o banco de dados usando processos externos ao servidor enquanto mantém o bloqueio. Para tabelas `InnoDB`, `READ LOCAL` é o mesmo que `READ`.

`[LOW_PRIORITY] WRITE` bloqueio:

* A sessão que detém o bloqueio pode ler e escrever na tabela.

* Apenas a sessão que possui o bloqueio pode acessar a tabela. Nenhuma outra sessão pode acessá-la até que o bloqueio seja liberado.

* Os pedidos de bloqueio da tabela por outras sessões são bloqueados enquanto o bloqueio `WRITE` é mantido.

* O modificador `LOW_PRIORITY` não tem efeito. Em versões anteriores do MySQL, ele afetava o comportamento de bloqueio, mas isso não é mais verdade. Agora, ele é desaconselhado e seu uso produz um aviso. Use `WRITE` sem `LOW_PRIORITY` em vez disso.

As chaves de bloqueio `WRITE` têm normalmente uma prioridade mais alta do que as chaves de bloqueio `READ` para garantir que as atualizações sejam processadas o mais rápido possível. Isso significa que, se uma sessão obtém uma chave de bloqueio `READ` e, em seguida, outra sessão solicita uma chave de bloqueio `WRITE`, as solicitações subsequentes de chave de bloqueio `READ` aguardam até que a sessão que solicitou a chave de bloqueio `WRITE` tenha obtido a chave e liberado. (Uma exceção a essa política pode ocorrer para valores pequenos da variável de sistema `max_write_lock_count`; consulte Seção 8.11.4, “Bloqueio de Metadados”.)

Se a declaração `LOCK TABLES` precisar esperar devido a bloqueios mantidos por outras sessões em qualquer uma das tabelas, ela fica bloqueada até que todos os bloqueios possam ser adquiridos.

Uma sessão que requer bloqueios deve adquirir todos os bloqueios que ela precisa em uma única declaração `LOCK TABLES`. Enquanto os bloqueios assim obtidos são mantidos, a sessão pode acessar apenas as tabelas bloqueadas. Por exemplo, na sequência de declarações a seguir, ocorre um erro para a tentativa de acessar `t2`, porque ele não foi bloqueado na declaração `LOCK TABLES`:

```sql
mysql> LOCK TABLES t1 READ;
mysql> SELECT COUNT(*) FROM t1;
+----------+
| COUNT(*) |
+----------+
|        3 |
+----------+
mysql> SELECT COUNT(*) FROM t2;
ERROR 1100 (HY000): Table 't2' was not locked with LOCK TABLES
```

As tabelas no banco de dados `INFORMATION_SCHEMA` são uma exceção. Elas podem ser acessadas sem serem explicitamente bloqueadas, mesmo quando uma sessão possui bloqueios de tabela obtidos com `LOCK TABLES`.

Você não pode referenciar uma tabela bloqueada várias vezes em uma única consulta usando o mesmo nome. Em vez disso, use aliases e obtenha um bloqueio separado para a tabela e cada alias:

```sql
mysql> LOCK TABLE t WRITE, t AS t1 READ;
mysql> INSERT INTO t SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> INSERT INTO t SELECT * FROM t AS t1;
```

O erro ocorre para o primeiro `INSERT` porque há duas referências ao mesmo nome para uma tabela bloqueada. O segundo `INSERT` tem sucesso porque as referências à tabela usam nomes diferentes.

Se suas declarações se referirem a uma tabela por meio de um alias, você deve bloquear a tabela usando esse mesmo alias. Não funciona bloquear a tabela sem especificar o alias:

```sql
mysql> LOCK TABLE t READ;
mysql> SELECT * FROM t AS myalias;
ERROR 1100: Table 'myalias' was not locked with LOCK TABLES
```

Por outro lado, se você bloquear uma tabela usando um alias, você deve referenciá-la em suas declarações usando esse alias:

```sql
mysql> LOCK TABLE t AS myalias READ;
mysql> SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> SELECT * FROM t AS myalias;
```

Nota

`LOCK TABLES` ou `UNLOCK TABLES`, quando aplicado a uma tabela particionada, sempre bloqueia ou desbloqueia toda a tabela; essas declarações não suportam poda de bloqueio de particionamento. Veja a Seção 22.6.4, “Particionamento e Bloqueio”.

#### Liberação do bloqueio da mesa

Quando as tabelas que são mantidas por uma sessão são liberadas, todas elas são liberadas ao mesmo tempo. Uma sessão pode liberar suas tabelas explicitamente, ou as tabelas podem ser liberadas implicitamente sob certas condições.

* Uma sessão pode liberar seus bloqueios explicitamente com `UNLOCK TABLES`.

* Se uma sessão emitir uma declaração `LOCK TABLES` para adquirir um bloqueio enquanto já detém blocos, seus blocos existentes são liberados implicitamente antes que os novos blocos sejam concedidos.

* Se uma sessão iniciar uma transação (por exemplo, com `START TRANSACTION`,), uma `UNLOCK TABLES` implícita é realizada, o que faz com que as chaves existentes sejam liberadas. (Para informações adicionais sobre a interação entre o bloqueio de tabela e transações, consulte Interação de Bloqueio de Tabela e Transações.)

Se a conexão para uma sessão de cliente terminar, seja de forma normal ou anormal, o servidor implicitamente libera todos os bloqueios de tabela mantidos pela sessão (transacional e não transacional). Se o cliente se reconectar, os bloqueios permanecem em vigor por mais tempo. Além disso, se o cliente tivesse uma transação ativa, o servidor reverte a transação após a desconexão e, se ocorrer a reconexão, a nova sessão começa com o autocommit habilitado. Por esse motivo, os clientes podem desejar desativar o auto-reconhecimento. Com o auto-reconhecimento em vigor, o cliente não é notificado se ocorrer a reconexão, mas quaisquer bloqueios de tabela ou transações atuais são perdidos. Com o auto-reconhecimento desativado, se a conexão cair, ocorre um erro para a próxima declaração emitida. O cliente pode detectar o erro e tomar as ações apropriadas, como reaquisição dos bloqueios ou refazer a transação. Veja o Controle de Reconhecimento Automático.

Nota

Se você usar `ALTER TABLE` em uma tabela bloqueada, ela pode se tornar desbloqueada. Por exemplo, se você tentar uma segunda operação `ALTER TABLE`, o resultado pode ser um erro `Table 'tbl_name' was not locked with LOCK TABLES`. Para lidar com isso, bloqueie a tabela novamente antes da segunda alteração. Veja também a Seção B.3.6.1, “Problemas com ALTER TABLE”.

#### Interação do bloqueio de tabela e transações

`LOCK TABLES` e `UNLOCK TABLES` interagem com o uso de transações da seguinte forma:

* `LOCK TABLES` não é seguro para transações e implicitamente compromete qualquer transação ativa antes de tentar bloquear as tabelas.

* `UNLOCK TABLES` compromete implicitamente qualquer transação ativa, mas apenas se `LOCK TABLES` tiver sido usado para adquirir bloqueios de tabela. Por exemplo, no seguinte conjunto de declarações, `UNLOCK TABLES` libera o bloqueio de leitura global, mas não compromete a transação porque não há bloqueios de tabela em vigor:

  ```sql
  FLUSH TABLES WITH READ LOCK;
  START TRANSACTION;
  SELECT ... ;
  UNLOCK TABLES;
  ```

* Começar uma transação (por exemplo, com `START TRANSACTION`) compromete implicitamente qualquer transação atual e libera as bloqueadoras de tabela existentes.

* `FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global e não bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabela e compromissos implícitos. Por exemplo, `START TRANSACTION` não libera o bloqueio de leitura global. Veja a Seção 13.7.6.3, “Declaração FLUSH”.

* Outras declarações que implicitamente fazem com que transações sejam comprometidas não liberam bloqueios de tabela existentes. Para uma lista dessas declarações, consulte a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

* A maneira correta de usar `LOCK TABLES` e `UNLOCK TABLES` com tabelas transacionais, como as tabelas `InnoDB`, é iniciar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguido por `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você comprove explicitamente a transação. Por exemplo, se você precisa escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```sql
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

Quando você chama `LOCK TABLES`, `InnoDB` internamente assume seu próprio bloqueio de tabela, e o MySQL assume seu próprio bloqueio de tabela. `InnoDB` libera seu bloqueio de tabela interno na próxima comissão, mas para o MySQL liberar seu bloqueio de tabela, você tem que chamar `UNLOCK TABLES`. Você não deve ter `autocommit = 1`, porque então `InnoDB` libera seu bloqueio de tabela imediatamente após a chamada de `LOCK TABLES`, e deadlocks podem acontecer muito facilmente. `InnoDB` não adquire o bloqueio de tabela interno se `autocommit = 1`, para ajudar as aplicações antigas a evitar deadlocks desnecessários.

* `ROLLBACK` não libera bloqueios de tabela.

#### LOCK TABLES e Triggers

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, todas as tabelas usadas em gatilhos também são bloqueadas implicitamente:

* As chaves são tomadas ao mesmo tempo que aquelas adquiridas explicitamente com a declaração `LOCK TABLES`.

* O bloqueio de uma tabela usada em um gatilho depende se a tabela é usada apenas para leitura. Se for o caso, um bloqueio de leitura é suficiente. Caso contrário, um bloqueio de escrita é usado.

* Se uma tabela for explicitamente bloqueada para leitura com `LOCK TABLES`, mas precisa ser bloqueada para escrita porque pode ser modificada dentro de um gatilho, uma bloqueadora de escrita é tomada em vez de uma bloqueadora de leitura. (Ou seja, uma bloqueadora de escrita implícita necessária devido à aparência da tabela dentro de um gatilho causa um pedido de bloqueadora de leitura implícita para que a tabela seja convertida em um pedido de bloqueadora de escrita.)

Suponha que você bloqueie duas tabelas, `t1` e `t2`, usando esta declaração:

```sql
LOCK TABLES t1 WRITE, t2 READ;
```

Se `t1` ou `t2` tiverem algum gatilho, as tabelas utilizadas dentro dos gatilhos também serão bloqueadas. Suponha que `t1` tenha um gatilho definido da seguinte forma:

```sql
CREATE TRIGGER t1_a_ins AFTER INSERT ON t1 FOR EACH ROW
BEGIN
  UPDATE t4 SET count = count+1
      WHERE id = NEW.id AND EXISTS (SELECT a FROM t3);
  INSERT INTO t2 VALUES(1, 2);
END;
```

O resultado da declaração `LOCK TABLES` é que `t1` e `t2` estão bloqueados porque aparecem na declaração, e `t3` e `t4` estão bloqueados porque são usados dentro do gatilho:

* `t1` está bloqueado para escrita de acordo com a solicitação de bloqueio `WRITE`.

* `t2` está bloqueado para escrita, embora o pedido seja para um bloqueio `READ`. Isso ocorre porque `t2` é inserido dentro do gatilho, então o pedido `READ` é convertido em um pedido `WRITE`.

* `t3` está bloqueado para leitura porque só pode ser lido dentro do gatilho.

* `t4` está bloqueado para escrita porque pode ser atualizado dentro do gatilho.

#### Restrições e condições de bloqueio de tabela

Você pode usar com segurança `KILL` para encerrar uma sessão que está aguardando um bloqueio de tabela. Veja a Seção 13.7.6.4, “Declaração KILL”.

`LOCK TABLES` e `UNLOCK TABLES` não podem ser utilizados em programas armazenados.

As tabelas no banco de dados `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

O escopo de um bloqueio gerado por `LOCK TABLES` é um único servidor MySQL. Não é compatível com o NDB Cluster, que não tem como impor um bloqueio em nível SQL em várias instâncias de `mysqld`. Você pode impor o bloqueio em um aplicativo de API, em vez disso. Consulte a Seção 21.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

As seguintes declarações são proibidas enquanto uma declaração `LOCK TABLES` estiver em vigor: `CREATE TABLE`, `CREATE TABLE ... LIKE`, `CREATE VIEW`, `DROP VIEW` e declarações DDL sobre funções e procedimentos armazenados e eventos.

Para algumas operações, as tabelas do sistema no banco de dados `mysql` devem ser acessadas. Por exemplo, a declaração `HELP` requer o conteúdo das tabelas de ajuda do lado do servidor, e `CONVERT_TZ()` pode precisar ler as tabelas de fuso horário. O servidor implicitamente bloqueia as tabelas do sistema para leitura conforme necessário, para que você não precise bloqueá-las explicitamente. Essas tabelas são tratadas como descrito acima:

```sql
mysql.help_category
mysql.help_keyword
mysql.help_relation
mysql.help_topic
mysql.proc
mysql.time_zone
mysql.time_zone_leap_second
mysql.time_zone_name
mysql.time_zone_transition
mysql.time_zone_transition_type
```

Se você quiser explicitamente colocar um bloqueio `WRITE` em qualquer uma dessas tabelas com uma declaração `LOCK TABLES`, a tabela deve ser a única bloqueada; nenhuma outra tabela pode ser bloqueada com a mesma declaração.

Normalmente, você não precisa bloquear tabelas, porque todas as declarações `UPDATE` individuais são atômicas; nenhuma outra sessão pode interferir em qualquer outra declaração SQL atualmente em execução. No entanto, há alguns casos em que bloquear tabelas pode proporcionar uma vantagem:

* Se você vai executar muitas operações em um conjunto de tabelas `MyISAM`, é muito mais rápido para bloquear as tabelas que você vai usar. Bloquear as tabelas `MyISAM` acelera a inserção, atualização ou exclusão nelas, porque o MySQL não limpa o cache de chave para as tabelas bloqueadas até que `UNLOCK TABLES` seja chamado. Normalmente, o cache de chave é limpo após cada declaração SQL.

O inconveniente de bloquear as tabelas é que nenhuma sessão pode atualizar uma tabela bloqueada `READ` (incluindo a que contém o bloqueio) e nenhuma sessão pode acessar uma tabela bloqueada `WRITE` que não seja a que contém o bloqueio.

* Se você estiver usando tabelas para um motor de armazenamento não transacional, você deve usar `LOCK TABLES` se quiser garantir que nenhuma outra sessão modifique as tabelas entre um `SELECT` e um `UPDATE`. O exemplo mostrado aqui requer `LOCK TABLES` para ser executado com segurança:

  ```sql
  LOCK TABLES trans READ, customer WRITE;
  SELECT SUM(value) FROM trans WHERE customer_id=some_id;
  UPDATE customer
    SET total_value=sum_from_previous_statement
    WHERE customer_id=some_id;
  UNLOCK TABLES;
  ```

Sem `LOCK TABLES`, é possível que outra sessão possa inserir uma nova string na tabela `trans` entre a execução das instruções `SELECT` e `UPDATE`.

Você pode evitar o uso de `LOCK TABLES` em muitos casos usando atualizações relativas (`UPDATE customer SET value=value+new_value`) ou a função `LAST_INSERT_ID()`.

Você também pode evitar bloquear tabelas em alguns casos, usando as funções de bloqueio de nível de usuário `GET_LOCK()` e `RELEASE_LOCK()`. Esses bloqueios são salvos em uma tabela de hash no servidor e implementados com `pthread_mutex_lock()` e `pthread_mutex_unlock()` para alta velocidade. Veja a Seção 12.14, “Funções de Bloqueio”.

Consulte a Seção 8.11.1, “Métodos de bloqueio interno”, para obter mais informações sobre a política de bloqueio.

### 13.3.6 Declaração de SET TRANSACTION

```sql
SET [GLOBAL | SESSION] TRANSACTION
    transaction_characteristic [, transaction_characteristic] ...

transaction_characteristic: {
    ISOLATION LEVEL level
  | access_mode
}

level: {
     REPEATABLE READ
   | READ COMMITTED
   | READ UNCOMMITTED
   | SERIALIZABLE
}

access_mode: {
     READ WRITE
   | READ ONLY
}
```

Esta declaração especifica as características da transação. Ela recebe uma lista de um ou mais valores característicos separados por vírgulas. Cada valor característico define o nível de isolamento da transação ou o modo de acesso. O nível de isolamento é usado para operações em tabelas `InnoDB`. O modo de acesso especifica se as transações operam no modo de leitura/escrita ou apenas de leitura.

Além disso, `SET TRANSACTION` pode incluir uma palavra-chave opcional `GLOBAL` ou `SESSION` para indicar o escopo da declaração.

* Níveis de Isolamento de Transação
* Modo de Acesso à Transação
* Escopo das Características da Transação

#### Níveis de Isolamento de Transação

Para definir o nível de isolamento de transação, use uma cláusula `ISOLATION LEVEL level`. Não é permitido especificar múltiplas cláusulas `ISOLATION LEVEL` na mesma declaração `SET TRANSACTION`.

O nível de isolamento padrão é `REPEATABLE READ`. Outros valores permitidos são `READ COMMITTED`, `READ UNCOMMITTED` e `SERIALIZABLE`. Para informações sobre esses níveis de isolamento, consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transação”.

#### Modo de Acesso à Transação

Para definir o modo de acesso à transação, use uma cláusula `READ WRITE` ou `READ ONLY`. Não é permitido especificar múltiplas cláusulas de modo de acesso na mesma declaração `SET TRANSACTION`.

Por padrão, uma transação ocorre no modo de leitura/escrita, com leituras e escritas permitidas para tabelas utilizadas na transação. Esse modo pode ser especificado explicitamente usando `SET TRANSACTION` com um modo de acesso de `READ WRITE`.

Se o modo de acesso à transação estiver configurado como `READ ONLY`, as alterações nas tabelas serão proibidas. Isso pode permitir que os motores de armazenamento realizem melhorias de desempenho que são possíveis quando as escritas não são permitidas.

No modo somente leitura, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Os modos de acesso `READ WRITE` e `READ ONLY` também podem ser especificados para uma transação individual usando a declaração `START TRANSACTION`.

#### Âmbito das características da transação

Você pode definir as características das transações globalmente, para a sessão atual ou apenas para a próxima transação:

* Com a palavra-chave `GLOBAL`:

+ A declaração se aplica globalmente para todas as sessões subsequentes.

As sessões existentes não são afetadas. * Com a palavra-chave `SESSION`:

+ A declaração se aplica a todas as transações subsequentes realizadas dentro da sessão atual.

+ A declaração é permitida dentro das transações, mas não afeta a transação em andamento atual.

+ Se executada entre transações, a declaração substitui qualquer declaração anterior que defina o valor da próxima transação das características nomeadas.

* Sem nenhuma palavra-chave `SESSION` ou `GLOBAL`:

+ A declaração se aplica apenas à próxima transação única realizada dentro da sessão.

+ As transações subsequentes retornam ao uso do valor da sessão das características nomeadas.

+ A declaração não é permitida em transações:

    ```sql
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

Uma mudança nas características de transação global requer o privilégio `SUPER`. Qualquer sessão pode alterar suas características de sessão (mesmo no meio de uma transação) ou as características para sua próxima transação (antes do início dessa transação).

Para definir o nível de isolamento global no início da inicialização do servidor, use a opção `--transaction-isolation=level` na string de comando ou em um arquivo de opções. Os valores de *`level`* para esta opção usam travessões em vez de espaços, portanto, os valores permitidos são `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`.

Da mesma forma, para definir o modo de acesso de transação global na inicialização do servidor, use a opção `--transaction-read-only`. O padrão é `OFF` (modo de leitura/escrita), mas o valor pode ser definido para `ON` para um modo de leitura apenas.

Por exemplo, para definir o nível de isolamento para `REPEATABLE READ` e o modo de acesso para `READ WRITE`, use essas strings na seção `[mysqld]` de um arquivo de opção:

```sql
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

No momento da execução, as características nos níveis de escopo global, sessão e próxima transação podem ser definidas indiretamente usando a declaração `SET TRANSACTION`, conforme descrito anteriormente. Elas também podem ser definidas diretamente usando a declaração `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only`:

* `SET TRANSACTION` permite palavras-chave opcionais `GLOBAL` e `SESSION` para definir características de transação em diferentes níveis de escopo.

* A declaração `SET` para atribuir valores às variáveis de sistema `transaction_isolation` e `transaction_read_only` tem sintaxes para definir essas variáveis em diferentes níveis de escopo.

As tabelas a seguir mostram o nível de escopo característico definido por cada `SET TRANSACTION` e sintaxe de atribuição de variáveis.

**Tabela 13.6 Sintaxe de SET TRANSACTION para características de transação**

<table summary="Syntax for setting transaction characteristics using SET TRANSACTION and affected scope."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Syntax</th> <th>Affected Characteristic Scope</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL TRANSACTION <code>transaction_characteristic</code></code></td> <td>Global</td> </tr><tr> <td><code>SET SESSION TRANSACTION <code>transaction_characteristic</code></code></td> <td>Session</td> </tr><tr> <td><code>SET TRANSACTION <code>transaction_characteristic</code></code></td> <td>Next transaction only</td> </tr></tbody></table>

**Tabela 13.7 Sintaxe SET para características de transação**

<table summary="Syntax for setting transaction characteristics using SET and affected scope."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Syntax</th> <th>Affected Characteristic Scope</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL <code>var_name</code> = <code>value</code></code></td> <td>Global</td> </tr><tr> <td><code>SET @@GLOBAL.<code>var_name</code> = <code>value</code></code></td> <td>Global</td> </tr><tr> <td><code>SET SESSION <code>var_name</code> = <code>value</code></code></td> <td>Session</td> </tr><tr> <td><code>SET @@SESSION.<code>var_name</code> = <code>value</code></code></td> <td>Session</td> </tr><tr> <td><code>SET <code>var_name</code> = <code>value</code></code></td> <td>Session</td> </tr><tr> <td><code>SET @@<code>var_name</code> = <code>value</code></code></td> <td>Next transaction only</td> </tr></tbody></table>

É possível verificar os valores globais e de sessão das características das transações em tempo de execução:

```sql
SELECT @@GLOBAL.transaction_isolation, @@GLOBAL.transaction_read_only;
SELECT @@SESSION.transaction_isolation, @@SESSION.transaction_read_only;
```

Antes do MySQL 5.7.20, use `tx_isolation` e `tx_read_only` em vez de `transaction_isolation` e `transaction_read_only`.

### 13.3.7 Transações XA

O suporte para transações XA está disponível para o motor de armazenamento `InnoDB`. A implementação MySQL XA é baseada no documento X/Open CAE *Processamento de Transações Distribuídas: A Especificação XA*. Este documento é publicado pelo The Open Group e está disponível em <http://www.opengroup.org/public/pubs/catalog/c193.htm>. As limitações da implementação XA atual são descritas na Seção 13.3.7.3, “Restrições em Transações XA”.

Do lado do cliente, não há requisitos especiais. A interface XA para um servidor MySQL consiste em declarações SQL que começam com a palavra-chave `XA`. Os programas de cliente MySQL devem ser capazes de enviar declarações SQL e entender a semântica da interface de declaração XA. Eles não precisam ser vinculados contra uma biblioteca de cliente recente. Bibliotecas de cliente mais antigas também funcionam.

Entre os Conectivos MySQL, o MySQL Connector/J 5.0.0 e versões superiores suportam o XA diretamente, por meio de uma interface de classe que lida com a interface de declaração SQL XA para você.

O XA suporta transações distribuídas, ou seja, a capacidade de permitir que vários recursos transacionais separados participem de uma transação global. Os recursos transacionais são frequentemente RDBMS, mas podem ser outros tipos de recursos.

Uma transação global envolve várias ações que são transacionais em si, mas que todas devem completar com sucesso como um grupo, ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades ACID “para um nível superior”, de modo que múltiplas transações ACID podem ser executadas em conjunto como componentes de uma operação global que também tem propriedades ACID. (Assim como nas transações não distribuídas, `SERIALIZABLE` pode ser preferido se suas aplicações são sensíveis a fenômenos de leitura. `REPEATABLE READ` pode não ser suficiente para transações distribuídas.)

Alguns exemplos de transações distribuídas:

* Um aplicativo pode atuar como uma ferramenta de integração que combina um serviço de mensagens com um RDBMS. O aplicativo garante que as transações que lidam com envio, recuperação e processamento de mensagens, que também envolvem um banco de dados transacional, ocorram em uma transação global. Você pode pensar nisso como "e-mail transacional".

* Uma aplicação realiza ações que envolvem diferentes servidores de banco de dados, como um servidor MySQL e um servidor Oracle (ou vários servidores MySQL), onde as ações que envolvem vários servidores devem ocorrer como parte de uma transação global, em vez de como transações separadas locais em cada servidor.

* Um banco mantém as informações das contas em um RDBMS e distribui e recebe dinheiro através de caixas eletrônicos (ATMs). É necessário garantir que as ações dos ATMs sejam corretamente refletidas nas contas, mas isso não pode ser feito apenas com o RDBMS. Um gerenciador de transações global integra os recursos dos ATMs e do banco de dados para garantir a consistência geral das transações financeiras.

Aplicações que utilizam transações globais envolvem um ou mais Gestores de Recursos e um Gestor de Transações:

* Um Gestor de Recursos (RM) fornece acesso a recursos transacionais. Um servidor de banco de dados é um tipo de gestor de recursos. Deve ser possível realizar ou reverter transações gerenciadas pelo RM.

* Um Gestor de Transações (TM) coordena as transações que fazem parte de uma transação global. Ele se comunica com os Gestores de Mercado (RM) que lidam com cada uma dessas transações. As transações individuais dentro de uma transação global são "ramificações" da transação global. As transações globais e suas ramificações são identificadas por um esquema de nomenclatura descrito mais adiante.

A implementação do MySQL do XA permite que um servidor MySQL atue como um Gestor de Recursos que lida com transações XA dentro de uma transação global. Um programa cliente que se conecta ao servidor MySQL atua como o Gestor de Transações.

Para realizar uma transação global, é necessário saber quais componentes estão envolvidos e levar cada componente a um ponto em que ele pode ser comprometido ou desfeito. Dependendo do que cada componente relata sobre sua capacidade de sucesso, todos eles devem comprometer ou desfazer como um grupo atômico. Ou seja, todos os componentes devem comprometer ou desfazer. Para gerenciar uma transação global, é necessário levar em conta que qualquer componente ou a rede de conexão pode falhar.

O processo para executar uma transação global utiliza o commit de duas fases (2PC). Isso ocorre após as ações realizadas pelas ramificações da transação global terem sido executadas.

1. Na primeira fase, todos os ramos são preparados. Isso significa que eles são informados pelo TM para se prepararem para o compromisso. Tipicamente, isso significa que cada RM que gerencia um ramo registra as ações para o ramo em armazenamento estável. Os ramos indicam se eles são capazes de fazer isso, e esses resultados são usados para a segunda fase.

2. Na segunda fase, o TM informa aos RM se devem comprometer ou recuar. Se todos os ramos indicarem que podem comprometer quando foram preparados, todos os ramos são informados para comprometer. Se algum ramo indicar que não pode comprometer quando foi preparado, todos os ramos são informados para recuar.

Em alguns casos, uma transação global pode usar o commit de uma fase (1PC). Por exemplo, quando um Gestor de Transações descobre que uma transação global consiste em apenas um recurso transacional (ou seja, um único ramo), esse recurso pode ser orientado a se preparar e se comprometer ao mesmo tempo.

#### 13.3.7.1 Ensaios de Transação XA SQL
#### 13.3.7.2 Ensaios de Transação XA em SQL Server

Para realizar transações XA no MySQL, use as seguintes declarações:

```sql
XA {START|BEGIN} xid [JOIN|RESUME]

XA END xid [SUSPEND [FOR MIGRATE]]

XA PREPARE xid

XA COMMIT xid [ONE PHASE]

XA ROLLBACK xid

XA RECOVER [CONVERT XID]
```

Para `XA START`, as cláusulas `JOIN` e `RESUME` são reconhecidas, mas não têm efeito.

Para `XA END`, a cláusula `SUSPEND [FOR MIGRATE]` é reconhecida, mas não tem efeito.

Cada declaração XA começa com a palavra-chave `XA`, e a maioria delas requer um valor *`xid`*. Um *`xid`* é um identificador de transação XA. Ele indica para qual transação a declaração se aplica. Os valores *`xid`* são fornecidos pelo cliente ou gerados pelo servidor MySQL. Um valor *`xid`* tem de uma a três partes:

```sql
xid: gtrid [, bqual [, formatID ]]
```

*`gtrid`* é um identificador de transação global, *`bqual`* é um qualificador de agência, e *`formatID`* é um número que identifica o formato usado pelos valores de *`gtrid`* e *`bqual`*. Como indicado pela sintaxe, *`bqual`* e *`formatID`* são opcionais. O valor padrão de *`bqual`* é `''` se não for fornecido. O valor padrão de *`formatID`* é 1 se não for fornecido.

*`gtrid`* e *`bqual`* devem ser literais de string, cada um com até 64 bytes (não caracteres). *`gtrid`* e *`bqual`* podem ser especificados de várias maneiras. Você pode usar uma string citada (`'ab'`), string hexadecimal (`X'6162'`, `0x6162`), ou valor de bit (`b'nnnn'`).

*`formatID`* é um inteiro não assinado.

Os valores *`gtrid`* e *`bqual`* são interpretados em bytes pelas rotinas de suporte XA subjacentes do servidor MySQL. No entanto, enquanto uma declaração SQL contendo uma declaração XA está sendo analisada, o servidor trabalha com algum conjunto de caracteres específico. Para ser seguro, escreva *`gtrid`* e *`bqual`* como strings hex.

Os valores de *`xid`* são, normalmente, gerados pelo Gerenciador de Transações. Os valores gerados por um TM devem ser diferentes dos valores gerados por outros TMs. Um determinado TM deve ser capaz de reconhecer seus próprios valores de *`xid`* em uma lista de valores retornada pela declaração `XA RECOVER`.

`XA START xid` inicia uma transação XA com o valor dado em *`xid`*. Cada transação XA deve ter um valor único em *`xid`*, portanto, o valor não deve estar atualmente sendo usado por outra transação XA. A unicidade é avaliada usando os valores em *`gtrid`* e *`bqual`*. Todas as declarações subsequentes de XA para a transação XA devem ser especificadas usando o mesmo valor em *`xid`* que o dado na declaração em *`XA START`*. Se você usar qualquer uma dessas declarações, mas especificar um valor em *`xid`* que não corresponda a alguma transação XA existente, ocorre um erro.

Uma ou mais transações XA podem fazer parte da mesma transação global. Todas as transações XA dentro de uma transação global dada devem usar o mesmo valor *`gtrid`* no valor *`xid`*. Por essa razão, os valores *`gtrid`* devem ser globalmente únicos para que não haja ambiguidade sobre qual transação global faz parte de uma dada transação XA. A parte *`bqual`* do valor *`xid`* deve ser diferente para cada transação XA dentro de uma transação global. (O requisito de que os valores *`bqual`* sejam diferentes é uma limitação da implementação atual do MySQL XA. Não faz parte da especificação XA.)

A declaração `XA RECOVER` retorna informações para aquelas transações XA no servidor MySQL que estão no estado `PREPARED`. (Veja a Seção 13.3.7.2, “Estados das Transações XA”.) A saída inclui uma string para cada transação XA desse tipo no servidor, independentemente de qual cliente a iniciou.

As strings de saída do `XA RECOVER` parecem assim (para um exemplo *`xid`* composto pelas partes `'abc'`, `'def'` e `7`):

```sql
mysql> XA RECOVER;
+----------+--------------+--------------+--------+
| formatID | gtrid_length | bqual_length | data   |
+----------+--------------+--------------+--------+
|        7 |            3 |            3 | abcdef |
+----------+--------------+--------------+--------+
```

As colunas de saída têm os seguintes significados:

* `formatID` é a parte *`formatID`* da transação *`xid`*

* `gtrid_length` é o comprimento em bytes da parte *`gtrid`* do *`xid`*

* `bqual_length` é o comprimento em bytes da parte *`bqual`* do *`xid`*

* `data` é a concatenação das partes *`gtrid`* e *`bqual`* do *`xid`*

Os valores XID podem conter caracteres não imprimíveis. A partir do MySQL 5.7.5, `XA RECOVER` permite uma cláusula opcional `CONVERT XID` para que os clientes possam solicitar valores XID em hexadecimal.

#### 13.3.7.2 Estados de Transação XA

Uma transação XA progride pelos seguintes estados:

1. Use `XA START` para iniciar uma transação XA e colocá-la no estado `ACTIVE`.

2. Para uma transação `ACTIVE` XA, emita as instruções SQL que compõem a transação, e em seguida, emita uma declaração `XA END`. `XA END` coloca a transação no estado `IDLE`.

3. Para uma transação `IDLE` XA, você pode emitir uma declaração `XA PREPARE` ou uma declaração `XA COMMIT ... ONE PHASE`:

* `XA PREPARE` coloca a transação no estado `PREPARED`. Uma declaração `XA RECOVER` neste ponto inclui o valor *`xid`* da transação em sua saída, porque `XA RECOVER` lista todas as transações XA que estão no estado `PREPARED`.

* `XA COMMIT ... ONE PHASE` prepara e compromete a transação. O valor do *`xid`* não é listado pelo `XA RECOVER` porque a transação é encerrada.

Para uma transação `PREPARED` XA, você pode emitir uma declaração `XA COMMIT` para confirmar e encerrar a transação, ou `XA ROLLBACK` para reverter e encerrar a transação.

Aqui está uma transação XA simples que insere uma string em uma tabela como parte de uma transação global:

```sql
mysql> XA START 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO mytable (i) VALUES(10);
Query OK, 1 row affected (0.04 sec)

mysql> XA END 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA PREPARE 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA COMMIT 'xatest';
Query OK, 0 rows affected (0.00 sec)
```

No contexto de uma conexão com um cliente específico, as transações XA e as transações locais (não XA) são mutuamente exclusivas. Por exemplo, se `XA START` foi emitida para iniciar uma transação XA, uma transação local não pode ser iniciada até que a transação XA tenha sido comprometida ou desfeita. Por outro lado, se uma transação local foi iniciada com `START TRANSACTION`, nenhuma declaração XA pode ser usada até que a transação tenha sido comprometida ou desfeita.

Se uma transação XA estiver no estado `ACTIVE`, você não pode emitir quaisquer declarações que causem um compromisso implícito. Isso violaria o contrato XA, porque você não poderia reverter a transação XA. O seguinte erro é exibido se você tentar executar tal declaração:

```sql
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

As declarações às quais a observação anterior se aplica estão listadas na Seção 13.3.3, “Declarações que causam um compromisso implícito”.

#### 13.3.7.3 Restrições às Transações XA

O suporte para transações XA é limitado ao motor de armazenamento `InnoDB`.

Para o "XA externo", um servidor MySQL atua como Gerenciador de Recursos e os programas cliente atuam como Gerenciadores de Transação. Para o "XA interno", os motores de armazenamento dentro de um servidor MySQL atuam como RM, e o próprio servidor atua como TM. O suporte interno ao XA é limitado pelas capacidades dos motores de armazenamento individuais. O XA interno é necessário para o tratamento de transações XA que envolvem mais de um motor de armazenamento. A implementação do XA interno exige que um motor de armazenamento suporte o compromisso de duas fases no nível do manipulador de tabela, e atualmente isso é verdadeiro apenas para `InnoDB`.

Para `XA START`, as cláusulas `JOIN` e `RESUME` são reconhecidas, mas não têm efeito.

Para `XA END`, a cláusula `SUSPEND [FOR MIGRATE]` é reconhecida, mas não tem efeito.

O requisito de que a parte *`bqual`* do valor *`xid`* seja diferente para cada transação XA dentro de uma transação global é uma limitação da implementação atual do MySQL XA. Não faz parte da especificação XA.

Antes do MySQL 5.7.7, as transações XA não eram compatíveis com a replicação. Isso ocorreu porque uma transação XA que estava no estado `PREPARED` seria revertida na interrupção limpa do servidor ou na desconexão do cliente. Da mesma forma, uma transação XA que estava no estado `PREPARED` ainda existiria no estado `PREPARED` caso o servidor fosse desligado anormalmente e, em seguida, reiniciado, mas o conteúdo da transação não poderia ser escrito no log binário. Em ambas as situações, a transação XA não poderia ser replicada corretamente.

Em MySQL 5.7.7 e versões posteriores, há uma mudança de comportamento e uma transação XA é escrita no log binário em duas partes. Quando `XA PREPARE` é emitido, a primeira parte da transação até `XA PREPARE` é escrita usando um GTID inicial. Um `XA_prepare_log_event` é usado para identificar tais transações no log binário. Quando `XA COMMIT` ou `XA ROLLBACK` é emitido, uma segunda parte da transação contendo apenas a declaração `XA COMMIT` ou `XA ROLLBACK` é escrita usando um segundo GTID. Note que a parte inicial da transação, identificada por `XA_prepare_log_event`, não é necessariamente seguida por seu `XA COMMIT` ou `XA ROLLBACK`, o que pode causar registro binário entrelaçado de qualquer duas transações XA. As duas partes da transação XA podem até aparecer em diferentes arquivos de log binário. Isso significa que uma transação XA no estado `PREPARED` é agora persistente até que uma declaração explícita `XA COMMIT` ou `XA ROLLBACK` seja emitida, garantindo que as transações XA sejam compatíveis com a replicação.

Em uma replica, imediatamente após a transação XA ser preparada, ela é desvinculada do thread do aplicador de replica e pode ser comprometida ou desfeita por qualquer thread na replica. Isso significa que a mesma transação XA pode aparecer na tabela `events_transactions_current` com diferentes estados em diferentes threads. A tabela `events_transactions_current` exibe o status atual do evento de transação monitorado mais recente no thread, e não atualiza esse status quando o thread está parado. Portanto, a transação XA ainda pode ser exibida no estado `PREPARED` para o thread original de aplicador, após ter sido processada por outro thread. Para identificar positivamente as transações XA que ainda estão no estado `PREPARED` e precisam ser recuperadas, use a declaração `XA RECOVER` em vez das tabelas de transação do Schema de Desempenho.

As seguintes restrições existem para o uso de transações XA no MySQL 5.7.7 e versões posteriores:

* As transações XA não são totalmente resistentes a uma parada inesperada em relação ao log binário. Se houver uma parada inesperada enquanto o servidor estiver em meio à execução de uma declaração `XA PREPARE`, `XA COMMIT`, `XA ROLLBACK` ou `XA COMMIT ... ONE PHASE`, o servidor pode não ser capaz de se recuperar a um estado correto, deixando o servidor e o log binário em um estado inconsistente. Nessa situação, o log binário pode conter transações XA extras que não são aplicadas ou pode faltar transações XA que são aplicadas. Além disso, se GTIDs estiverem habilitados, após a recuperação `@@GLOBAL.GTID_EXECUTED`, pode não descrever corretamente as transações que foram aplicadas. Note que, se uma parada inesperada ocorrer antes de `XA PREPARE`, entre `XA PREPARE` e `XA COMMIT` (ou `XA ROLLBACK`, ou após `XA COMMIT` (ou `XA ROLLBACK`, o servidor e o log binário são corretamente recuperados e levados a um estado consistente.

* O uso de filtros de replicação ou filtros de log binário em combinação com transações XA não é suportado. O filtro de tabelas pode fazer com que uma transação XA fique vazia em uma replica, e transações XA vazias não são suportadas. Além disso, com as configurações `master_info_repository=TABLE` e `relay_log_info_repository=TABLE` em uma replica, que se tornaram os padrões no MySQL 8.0, o estado interno da transação do motor de dados é alterado após uma transação XA filtrada, e pode se tornar inconsistente com o estado do contexto da transação de replicação.

O erro `ER_XA_REPLICATION_FILTERS` é registrado sempre que uma transação XA é impactada por um filtro de replicação, independentemente de a transação ter sido vazia como resultado. Se a transação não for vazia, a replica pode continuar a ser executada, mas você deve tomar medidas para descontinuar o uso de filtros de replicação com transações XA, a fim de evitar possíveis problemas. Se a transação não for vazia, a replica para. Nesse caso, a replica pode estar em um estado indeterminado, no qual a consistência do processo de replicação pode ser comprometida. Em particular, o conjunto `gtid_executed` em uma replica da replica pode ser inconsistente com o da fonte. Para resolver essa situação, isole a fonte e pare toda a replicação, em seguida, verifique a consistência do GTID em toda a topologia de replicação. Desfaça a transação XA que gerou a mensagem de erro, em seguida, reinicie a replicação.

* Antes do MySQL 5.7.19, `FLUSH TABLES WITH READ LOCK` não é compatível com transações XA.

As transações XA são consideradas inseguras para replicação baseada em declarações. Se duas transações XA comprometidas em paralelo na fonte estão sendo preparadas na replica na ordem inversa, podem ocorrer dependências de bloqueio que não podem ser resolvidas com segurança, e é possível que a replicação falhe com um impasse na replica. Essa situação pode ocorrer em uma replica de um único thread ou de vários threads. Quando `binlog_format=STATEMENT` é definido, um aviso é emitido para declarações DML dentro das transações XA. Quando `binlog_format=MIXED` ou `binlog_format=ROW` é definido, as declarações DML dentro das transações XA são registradas usando replicação baseada em strings, e o problema potencial não está presente.