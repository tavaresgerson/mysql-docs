### 15.1.13 Declaração `ALTER VIEW`

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [MATERIALIZED] ...
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Esta declaração altera a definição de uma vista, que deve existir. A sintaxe é semelhante à do `CREATE VIEW`, veja a Seção 15.1.27, “Declaração CREATE VIEW”). Esta declaração requer os privilégios `CREATE VIEW` e `DROP` para a vista, e alguns privilégios para cada coluna referenciada na declaração `SELECT`. A declaração `ALTER VIEW` é permitida apenas ao definidor ou usuários com o privilégio `SET_ANY_DEFINER` ou `ALLOW_NONEXISTENT_DEFINER`.

As vistas materializadas são suportadas apenas no MySQL HeatWave. Veja a consulta Vistas Materializadas para saber mais.