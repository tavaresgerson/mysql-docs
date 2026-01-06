### 8.8.4 Obter informações do plano de execução para uma conexão nomeada

Para obter o plano de execução de uma declaração explicável que esteja sendo executada em uma conexão nomeada, use esta declaração:

```sql
EXPLAIN [options] FOR CONNECTION connection_id;
```

`EXPLAIN PARA CONEXÃO` retorna as informações `EXPLAIN` que estão sendo usadas atualmente para executar uma consulta em uma conexão específica. Devido às alterações nos dados (e nas estatísticas de suporte), isso pode produzir um resultado diferente da execução de `EXPLAIN` no texto equivalente da consulta. Essa diferença de comportamento pode ser útil no diagnóstico de problemas de desempenho mais transitórios. Por exemplo, se você estiver executando uma declaração em uma sessão que leva muito tempo para ser concluída, usar `EXPLAIN PARA CONEXÃO` em outra sessão pode fornecer informações úteis sobre a causa do atraso.

*`connection_id`* é o identificador de conexão, obtido da tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou da instrução `SHOW PROCESSLIST`. Se você tiver o privilégio `PROCESS`, pode especificar o identificador para qualquer conexão. Caso contrário, pode especificar o identificador apenas para suas próprias conexões.

Se a conexão nomeada não estiver executando uma instrução, o resultado será vazio. Caso contrário, `EXPLAIN FOR CONNECTION` só se aplica se a instrução executada na conexão nomeada for explicável. Isso inclui `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. (No entanto, `EXPLAIN FOR CONNECTION` não funciona para instruções preparadas, mesmo que sejam instruções preparadas desses tipos.)

Se a conexão nomeada estiver executando uma instrução explicável, o resultado será o que você obteria ao usar `EXPLAIN` na própria instrução.

Se a conexão nomeada estiver executando uma instrução que não pode ser explicada, um erro ocorrerá. Por exemplo, você não pode nomear o identificador da conexão para sua sessão atual, porque `EXPLAIN` não pode ser explicado:

```sql
mysql> SELECT CONNECTION_ID();
+-----------------+
| CONNECTION_ID() |
+-----------------+
|             373 |
+-----------------+
1 row in set (0.00 sec)

mysql> EXPLAIN FOR CONNECTION 373;
ERROR 1889 (HY000): EXPLAIN FOR CONNECTION command is supported
only for SELECT/UPDATE/INSERT/DELETE/REPLACE
```

A variável de status `Com_explain_other` indica o número de instruções `EXPLAIN FOR CONNECTION` executadas.
