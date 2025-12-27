#### 15.1.24.3 Declaração `CREATE TABLE ... LIKE`

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

```
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento de tabela da tabela original. O privilégio `SELECT` é necessário na tabela original.

`LIKE` funciona apenas para tabelas base, não para visualizações.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma declaração `LOCK TABLES` estiver em vigor.

`CREATE TABLE ... LIKE` faz os mesmos verificações que `CREATE TABLE`. Isso significa que, se o modo SQL atual for diferente do modo em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo modo e causar o falha da declaração.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações de coluna geradas da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as restrições `CHECK` da tabela original, exceto que todos os nomes das restrições são gerados.

`CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` que foram especificadas para a tabela original, nem nenhuma definição de chave estrangeira.

Se a tabela original for uma tabela `TEMPORARY`, `CREATE TABLE ... LIKE` não preserva `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use `CREATE TEMPORARY TABLE ... LIKE`.

As operações de `CREATE TABLE ... LIKE` aplicam todos os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` à nova tabela.