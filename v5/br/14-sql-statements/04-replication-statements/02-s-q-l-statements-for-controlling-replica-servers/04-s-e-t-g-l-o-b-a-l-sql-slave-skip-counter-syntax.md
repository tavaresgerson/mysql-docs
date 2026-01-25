#### 13.4.2.4 Sintaxe de SET GLOBAL sql_slave_skip_counter

```sql
SET GLOBAL sql_slave_skip_counter = N
```

Esta statement ignora os próximos *`N`* events do master. Isso é útil para recuperação de paradas de replication causadas por uma statement.

Esta statement é válida apenas quando as slave threads não estão em execução. Caso contrário, ela produz um error.

Ao usar esta statement, é importante entender que o binary log está, na verdade, organizado como uma sequência de grupos conhecidos como event groups (grupos de eventos). Cada event group consiste em uma sequência de events.

* Para tabelas transacionais, um event group corresponde a uma transaction.

* Para tabelas não transacionais, um event group corresponde a uma única SQL statement.

Nota

Uma única transaction pode conter alterações em tabelas transacionais e não transacionais.

Quando você usa [`SET GLOBAL sql_slave_skip_counter`](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax") para ignorar events e o resultado está no meio de um grupo, o slave continua a ignorar events até atingir o final do grupo. A execução então começa com o próximo event group.