### 13.1.10 Declaração ALTER VIEW

```sql
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Esta declaração altera a definição de uma visão, que deve existir. A sintaxe é semelhante à do `CREATE VIEW` veja Seção 13.1.21, “Declaração CREATE VIEW”). Esta declaração requer os privilégios `CREATE VIEW` e `DROP` para a visão, e alguns privilégios para cada coluna referenciada na declaração `SELECT`. O `ALTER VIEW` é permitido apenas ao definidor ou usuários com o privilégio `SUPER`.
