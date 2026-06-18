### 15.1.35 Declaração DROP VIEW

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` remove uma ou mais visualizações. Você deve ter o privilégio `DROP` para cada visualização.

Se alguma das vistas mencionadas na lista de argumentos não existir, a declaração falhará com um erro indicando, pelo nome, quais vistas não existentes não conseguiu excluir e nenhuma alteração será feita.

Nota

No MySQL 5.7 e versões anteriores, `DROP VIEW` retorna um erro se quaisquer vistas nomeadas na lista de argumentos não existirem, mas também exclui todas as vistas na lista que existem. Devido à mudança no comportamento no MySQL 8.0, uma operação `DROP VIEW` parcialmente concluída em um servidor de origem de replicação MySQL 5.7 falha quando replicada em uma replica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` nas instruções `DROP VIEW` para evitar que um erro ocorra para vistas que não existem. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

A cláusula `IF EXISTS` previne que ocorra um erro para visualizações que não existem. Quando essa cláusula é fornecida, um `NOTE` é gerado para cada visualização inexistente. Veja a Seção 15.7.7.42, “Instrução SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se fornecidos, são analisados e ignorados.
