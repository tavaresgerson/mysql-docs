#### 16.2.5.3 Interações Entre Opções de Replication Filtering

Se você usar uma combinação de opções de Replication Filtering de nível de Database e de nível de Table, a Replica primeiro aceita ou ignora eventos usando as opções de Database e, em seguida, avalia todos os eventos permitidos por essas opções de acordo com as opções de Table. Isso às vezes pode levar a resultados que parecem contraintuitivos. Também é importante notar que os resultados variam dependendo se a operação é registrada usando o Binary Logging Format baseado em Statement (statement-based) ou baseado em Row (row-based). Se você deseja garantir que seus Replication Filters sempre operem da mesma forma, independentemente do Binary Logging Format, o que é particularmente importante se você estiver usando o Mixed Binary Logging Format, siga a orientação neste tópico.

O efeito das opções de Replication Filtering difere entre os Binary Logging Formats devido à forma como o nome da Database é identificado. Com o formato statement-based, os Statements DML são tratados com base na Database atual, conforme especificado pelo Statement [`USE`](use.html "13.8.4 USE Statement"). Com o formato row-based, os Statements DML são tratados com base na Database onde a Table modificada existe. Os Statements DDL são sempre filtrados com base na Database atual, conforme especificado pelo Statement [`USE`](use.html "13.8.4 USE Statement"), independentemente do Binary Logging Format.

Uma operação que envolve múltiplas Tables também pode ser afetada de forma diferente pelas opções de Replication Filtering, dependendo do Binary Logging Format. Operações a serem observadas incluem Transactions que envolvem Statements [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas Tables, Triggers, chaves estrangeiras em cascata, Stored Functions que atualizam múltiplas Tables e Statements DML que invocam Stored Functions que atualizam uma ou mais Tables. Se essas operações atualizarem Tables que estão tanto "filtradas para dentro" (filtered-in) quanto "filtradas para fora" (filtered-out), os resultados podem variar conforme o Binary Logging Format.

Se você precisar garantir que seus Replication Filters operem de forma consistente, independentemente do Binary Logging Format, especialmente se estiver usando o Mixed Binary Logging Format ([`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format)), use apenas opções de Replication Filtering de nível de Table e não use opções de Replication Filtering de nível de Database. Além disso, não use Statements DML de múltiplas Tables que atualizam tanto as Tables incluídas quanto as Tables excluídas pelo filtro.

Se você precisar usar uma combinação de Replication Filters de nível de Database e de nível de Table, e desejar que eles operem da forma mais consistente possível, escolha uma das seguintes estratégias:

1. Se você usar o Binary Logging Format baseado em Row ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), para Statements DDL, confie no Statement [`USE`](use.html "13.8.4 USE Statement") para definir a Database e não especifique o nome da Database. Você pode considerar mudar para o Binary Logging Format baseado em Row para melhorar a consistência com o Replication Filtering. Consulte [Section 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format") para as condições que se aplicam à mudança do Binary Logging Format.

2. Se você usar o Binary Logging Format statement-based ou mixed ([`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) ou `MIXED`), tanto para Statements DML quanto DDL, confie no Statement [`USE`](use.html "13.8.4 USE Statement") e não use o nome da Database. Além disso, não use Statements DML de múltiplas Tables que atualizam tanto as Tables incluídas quanto as Tables excluídas pelo filtro.

**Exemplo 16.7 Uma opção [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) e uma opção [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table)**

Na Source, os seguintes Statements são executados:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

A Replica possui as seguintes opções de Replication Filtering definidas:

```sql
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

O Statement DDL [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") cria a Table em `db1`, conforme especificado pelo Statement [`USE`](use.html "13.8.4 USE Statement") anterior. A Replica filtra este Statement de acordo com sua opção [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db), pois `db1` é a Database atual. Este resultado é o mesmo, independentemente do Binary Logging Format na Source. No entanto, o resultado do Statement DML [`INSERT`](insert.html "13.2.5 INSERT Statement") é diferente dependendo do Binary Logging Format:

* Se o Binary Logging Format baseado em Row estiver em uso na Source ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), a Replica avalia a operação [`INSERT`](insert.html "13.2.5 INSERT Statement") usando a Database onde a Table existe, que é nomeada como `db2`. A opção de nível de Database [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db), que é avaliada primeiro, portanto, não se aplica. A opção de nível de Table [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) se aplica, então a Replica aplica a alteração à Table `t3`.

* Se o Binary Logging Format baseado em Statement estiver em uso na Source ([`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format)), a Replica avalia a operação [`INSERT`](insert.html "13.2.5 INSERT Statement") usando a Database padrão, que foi definida pelo Statement [`USE`](use.html "13.8.4 USE Statement") como `db1` e não foi alterada. De acordo com sua opção de nível de Database [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db), ela ignora a operação e não aplica a alteração à Table `t3`. A opção de nível de Table [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) não é verificada, porque o Statement já correspondeu a uma opção de nível de Database e foi ignorado.

Se a opção [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db) na Replica for necessária, e o uso do Binary Logging Format statement-based (ou mixed) na Source também for necessário, os resultados podem ser tornados consistentes omitindo o nome da Database do Statement [`INSERT`](insert.html "13.2.5 INSERT Statement") e contando com um Statement [`USE`](use.html "13.8.4 USE Statement") em vez disso, conforme segue:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

Neste caso, a Replica sempre avalia o Statement [`INSERT`](insert.html "13.2.5 INSERT Statement") com base na Database `db2`. Se a operação for registrada em formato binário statement-based ou row-based, os resultados permanecem os mesmos.