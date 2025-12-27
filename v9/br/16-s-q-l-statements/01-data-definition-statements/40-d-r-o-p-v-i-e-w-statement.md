### 15.1.40 Declaração `DROP VIEW`

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` remove uma ou mais visualizações. Você deve ter o privilégio `DROP` para cada visualização. `DROP VIEW` funciona com visualizações SQL (consulte a Seção 27.6, “Usando Visualizações”) e também com visualizações de dualidade JSON (consulte a Seção 27.7, “Visualizações de Dualidade JSON”).

Se alguma visualização mencionada na lista de argumentos não existir, a declaração falhará com um erro indicando, por nome, quais visualizações não existentes não puderam ser excluídas, e nenhuma alteração será feita.

A cláusula `IF EXISTS` previne que um erro ocorra para visualizações que não existem. Quando esta cláusula é fornecida, uma `NOTA` é gerada para cada visualização inexistente. Consulte a Seção 15.7.7.43, “Declaração SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se fornecidos, são analisados e ignorados.