### 13.1.32 Declaração DROP VIEW

```sql
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` remove uma ou mais visualizações. Você deve ter o privilégio `DROP` para cada visualização.

Se alguma das vistas mencionadas na lista de argumentos não existir, a instrução retorna um erro indicando, por nome, quais vistas não existentes não conseguiu excluir, mas também exclui todas as vistas da lista que existem.

Nota

No MySQL 8.0, a instrução `DROP VIEW` falha se qualquer vista nomeada na lista de argumentos não existir. Devido à mudança no comportamento, uma operação de `DROP VIEW` (drop-view\.html) parcialmente concluída em uma fonte MySQL 5.7 falha quando replicada para uma réplica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` nas instruções de `DROP VIEW` (drop-view\.html) para evitar que um erro ocorra para vistas que não existem. Para mais informações, consulte Suporte à Declaração de Definição de Dados Atômica.

A cláusula `IF EXISTS` impede que ocorra um erro para visualizações que não existem. Quando essa cláusula é fornecida, uma `NOTA` é gerada para cada visualização inexistente. Veja Seção 13.7.5.40, “Instrução SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se fornecidos, são analisados e ignorados.
