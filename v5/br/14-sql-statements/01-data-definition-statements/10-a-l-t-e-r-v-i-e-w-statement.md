### 13.1.10 Instrução ALTER VIEW

```sql
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Esta instrução altera a definição de uma VIEW, que deve existir. A sintaxe é semelhante à da instrução `CREATE VIEW` (veja Seção 13.1.21, “CREATE VIEW Statement”). Esta instrução requer os privilégios `CREATE VIEW` e `DROP` para a VIEW, e algum privilégio para cada coluna referenciada na instrução `SELECT`. `ALTER VIEW` é permitida apenas ao definidor ou usuários com o privilégio `SUPER`.