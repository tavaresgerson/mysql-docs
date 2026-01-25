### 8.8.4 Obtendo Informações do Plano de Execução para uma Connection Nomeada

Para obter o plano de execução para uma *statement* explicável que está sendo executada em uma *Connection* nomeada, utilize esta *statement*:

```sql
EXPLAIN [options] FOR CONNECTION connection_id;
```

`EXPLAIN FOR CONNECTION` retorna as informações `EXPLAIN` que estão sendo usadas atualmente para executar uma *Query* em uma determinada *Connection*. Devido a alterações nos dados (e estatísticas de suporte), isso pode produzir um resultado diferente de rodar `EXPLAIN` no texto da *Query* equivalente. Essa diferença de comportamento pode ser útil no diagnóstico de problemas de desempenho mais transitórios. Por exemplo, se você estiver executando uma *statement* em uma sessão que está demorando muito para ser concluída, usar `EXPLAIN FOR CONNECTION` em outra sessão pode fornecer informações úteis sobre a causa do atraso.

*`connection_id`* é o identificador da *Connection*, conforme obtido na tabela `PROCESSLIST` do `INFORMATION_SCHEMA` ou na *statement* `SHOW PROCESSLIST`. Se você tiver o privilégio `PROCESS`, pode especificar o identificador para qualquer *Connection*. Caso contrário, você pode especificar o identificador apenas para suas próprias *Connections*.

Se a *Connection* nomeada não estiver executando uma *statement*, o resultado é vazio. Caso contrário, `EXPLAIN FOR CONNECTION` se aplica apenas se a *statement* que está sendo executada na *Connection* nomeada for explicável. Isso inclui `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. (No entanto, `EXPLAIN FOR CONNECTION` não funciona para *prepared statements*, mesmo *prepared statements* desses tipos.)

Se a *Connection* nomeada estiver executando uma *statement* explicável, a saída é o que você obteria usando `EXPLAIN` na própria *statement*.

Se a *Connection* nomeada estiver executando uma *statement* que não é explicável, ocorre um erro. Por exemplo, você não pode nomear o identificador de *Connection* para sua sessão atual porque `EXPLAIN` não é explicável:

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

A *status variable* `Com_explain_other` indica o número de *statements* `EXPLAIN FOR CONNECTION` executadas.