#### 5.4.4.2 Configurando o Formato do Binary Log

Você pode selecionar o formato do *binary logging* explicitamente ao iniciar o servidor MySQL com [`--binlog-format=type`](replication-options-binary-log.html#sysvar_binlog_format). Os valores suportados para *`type`* são:

* `STATEMENT` faz com que o *logging* seja baseado em *Statement*.
* `ROW` faz com que o *logging* seja baseado em *Row*.
* `MIXED` faz com que o *logging* use o formato *Mixed*.

Configurar o formato do *binary logging* não ativa o *binary logging* para o servidor. A configuração só entra em vigor quando o *binary logging* está habilitado no servidor, o que ocorre quando a variável de sistema [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) está definida como `ON`. No MySQL 5.7, o *binary logging* não está habilitado por padrão, e você o habilita usando a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin).

O formato de *logging* também pode ser trocado em tempo de execução (*runtime*), embora haja várias situações nas quais isso não é possível, conforme discutido adiante nesta seção. Defina o valor global da variável de sistema [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) para especificar o formato para clientes que se conectarem após a mudança:

```sql
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de *logging* para seus próprios *Statements* definindo o valor de sessão de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format):

```sql
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Alterar o valor global de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) requer privilégios suficientes para definir variáveis de sistema globais. Alterar o valor de sessão de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

Existem várias razões pelas quais um cliente pode querer definir o *binary logging* por sessão (*per-session*):

* Uma sessão que faz muitas pequenas alterações no *Database* pode querer usar o *logging* baseado em *Row*.
* Uma sessão que executa *updates* que correspondem a muitas *Rows* na cláusula `WHERE` pode querer usar o *logging* baseado em *Statement* porque é mais eficiente registrar alguns *Statements* do que muitas *Rows*.
* Alguns *Statements* exigem muito tempo de execução na origem, mas resultam em apenas algumas *Rows* sendo modificadas. Portanto, pode ser benéfico replicá-los usando o *logging* baseado em *Row*.

Existem exceções nas quais você não pode alternar o formato de *Replication* em tempo de execução (*runtime*):

* De dentro de uma função armazenada (*stored function*) ou de um *Trigger*.
* Se o *Storage Engine* [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") estiver habilitado.
* Se a sessão estiver atualmente no modo de *Replication* baseado em *Row* e tiver tabelas temporárias abertas.

Tentar alternar o formato em qualquer um desses casos resulta em um erro.

Não é recomendado alternar o formato de *Replication* em tempo de execução quando existirem tabelas temporárias, porque tabelas temporárias são registradas apenas ao usar *Replication* baseado em *Statement*, enquanto não são registradas com *Replication* baseado em *Row*. Com *Replication Mixed*, as tabelas temporárias são geralmente registradas; exceções ocorrem com funções carregáveis (*loadable functions*) e com a função [`UUID()`](miscellaneous-functions.html#function_uuid).

A alternância do formato de *Replication* enquanto a *Replication* está em andamento também pode causar problemas. Cada Servidor MySQL pode definir seu próprio e somente seu próprio formato de *binary logging* (válido se [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) for definido com escopo global ou de sessão). Isso significa que alterar o formato de *logging* em um servidor de origem de *Replication* não faz com que uma *Replica* altere seu formato de *logging* para corresponder. Ao usar o modo `STATEMENT`, a variável de sistema [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) não é replicada. Ao usar o modo de *logging* `MIXED` ou `ROW`, ela é replicada, mas é ignorada pela *Replica*.

Uma *Replica* não é capaz de converter entradas do *Binary Log* recebidas no formato de *logging* `ROW` para o formato `STATEMENT` para uso em seu próprio *Binary Log*. A *Replica* deve, portanto, usar o formato `ROW` ou `MIXED` se a origem o fizer. Alterar o formato de *binary logging* na origem de `STATEMENT` para `ROW` ou `MIXED` enquanto a *Replication* está em andamento para uma *Replica* com formato `STATEMENT` pode fazer com que a *Replication* falhe com erros como *Error executing row event: 'Cannot execute statement: impossible to write to binary log since statement is in row format and BINLOG_FORMAT = STATEMENT.'* Mudar o formato de *binary logging* na *Replica* para o formato `STATEMENT` quando a origem ainda estiver usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de *Replication*. Para alterar o formato com segurança, você deve interromper a *Replication* e garantir que a mesma alteração seja feita tanto na origem quanto na *Replica*.

Se você estiver usando tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e o nível de isolamento de transação for [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) ou [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), apenas o *logging* baseado em *Row* pode ser usado. É *possível* alterar o formato de *logging* para `STATEMENT`, mas fazê-lo em tempo de execução leva rapidamente a erros porque o `InnoDB` não pode mais realizar *inserts*.

Com o formato do *Binary Log* definido como `ROW`, muitas alterações são escritas no *Binary Log* usando o formato baseado em *Row*. Algumas alterações, no entanto, ainda usam o formato baseado em *Statement*. Exemplos incluem todos os *Statements* DDL (*data definition language*) como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") ou [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement").

A opção [`--binlog-row-event-max-size`](replication-options-binary-log.html#option_mysqld_binlog-row-event-max-size) está disponível para servidores que são capazes de *Replication* baseada em *Row*. As *Rows* são armazenadas no *Binary Log* em *chunks* (pedaços) com um tamanho em *bytes* que não excede o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o *logging* baseado em *Statement* para *Replication*, é possível que os dados na origem e na *Replica* se tornem diferentes se um *Statement* for projetado de tal forma que a modificação dos dados seja não determinística; ou seja, fica a critério do *Query Optimizer*. Em geral, esta não é uma boa prática mesmo fora da *Replication*. Para uma explicação detalhada deste problema, consulte [Section B.3.7, “Known Issues in MySQL”](known-issues.html "B.3.7 Known Issues in MySQL").