### 15.1.11 Declaração ALTER VIEW

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Esta declaração altera a definição de uma visão, que deve existir. A sintaxe é semelhante à do `CREATE VIEW` (ver Seção 15.1.23, “Declaração CREATE VIEW”). Esta declaração requer os privilégios `CREATE VIEW` e `DROP` para a visão, e alguns privilégios para cada coluna referenciada na declaração `SELECT`. `ALTER VIEW` é permitido apenas ao definidor ou aos usuários com o privilégio `SET_USER_ID` (ou o privilégio descontinuado `SUPER`).
