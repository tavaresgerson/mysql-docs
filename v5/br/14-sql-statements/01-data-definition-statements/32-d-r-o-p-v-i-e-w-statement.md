### 13.1.32 Instrução DROP VIEW

```sql
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

O `DROP VIEW` remove uma ou mais views. Você deve ter o privilégio `DROP` para cada view.

Se qualquer view nomeada na lista de argumentos não existir, a instrução retorna um erro indicando pelo nome quais views inexistentes ela não conseguiu remover, mas também remove todas as views existentes na lista.

Nota

No MySQL 8.0, `DROP VIEW` falha se qualquer view nomeada na lista de argumentos não existir. Devido à mudança de comportamento, uma operação `DROP VIEW` parcialmente concluída em uma *source* MySQL 5.7 falha quando replicada para uma *replica* MySQL 8.0. Para evitar este cenário de falha, use a sintaxe `IF EXISTS` nas instruções `DROP VIEW` para evitar que um erro ocorra para views que não existem. Para mais informações, consulte Atomic Data Definition Statement Support.

A cláusula `IF EXISTS` impede que um erro ocorra para views que não existem. Quando esta cláusula é fornecida, uma `NOTE` é gerada para cada view inexistente. Consulte Seção 13.7.5.40, “Instrução SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se fornecidos, são analisados e ignorados.