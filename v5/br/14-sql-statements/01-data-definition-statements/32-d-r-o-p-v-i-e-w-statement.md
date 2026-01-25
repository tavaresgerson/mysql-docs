### 13.1.32 Instrução DROP VIEW

```sql
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

O [`DROP VIEW`](drop-view.html "13.1.32 DROP VIEW Statement") remove uma ou mais views. Você deve ter o privilégio [`DROP`](privileges-provided.html#priv_drop) para cada view.

Se qualquer view nomeada na lista de argumentos não existir, a instrução retorna um erro indicando pelo nome quais views inexistentes ela não conseguiu remover, mas também remove todas as views existentes na lista.

Nota

No MySQL 8.0, [`DROP VIEW`](drop-view.html "13.1.32 DROP VIEW Statement") falha se qualquer view nomeada na lista de argumentos não existir. Devido à mudança de comportamento, uma operação [`DROP VIEW`](drop-view.html "13.1.32 DROP VIEW Statement") parcialmente concluída em uma *source* MySQL 5.7 falha quando replicada para uma *replica* MySQL 8.0. Para evitar este cenário de falha, use a sintaxe `IF EXISTS` nas instruções [`DROP VIEW`](drop-view.html "13.1.32 DROP VIEW Statement") para evitar que um erro ocorra para views que não existem. Para mais informações, consulte [Atomic Data Definition Statement Support](/doc/refman/8.0/en/atomic-ddl.html).

A cláusula `IF EXISTS` impede que um erro ocorra para views que não existem. Quando esta cláusula é fornecida, uma `NOTE` é gerada para cada view inexistente. Consulte [Seção 13.7.5.40, “Instrução SHOW WARNINGS”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").

`RESTRICT` e `CASCADE`, se fornecidos, são analisados e ignorados.