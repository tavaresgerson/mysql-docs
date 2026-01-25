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

Esta instrução altera a definição de uma VIEW, que deve existir. A sintaxe é semelhante à da instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") (veja [Seção 13.1.21, “CREATE VIEW Statement”](create-view.html "13.1.21 CREATE VIEW Statement")). Esta instrução requer os privilégios [`CREATE VIEW`](privileges-provided.html#priv_create-view) e [`DROP`](privileges-provided.html#priv_drop) para a VIEW, e algum privilégio para cada coluna referenciada na instrução [`SELECT`](select.html "13.2.9 SELECT Statement"). [`ALTER VIEW`](alter-view.html "13.1.10 ALTER VIEW Statement") é permitida apenas ao definidor ou usuários com o privilégio [`SUPER`](privileges-provided.html#priv_super).