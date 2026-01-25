#### 13.1.18.3 Instrução CREATE TABLE ... LIKE

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia baseada na definição de outra tabela, incluindo quaisquer atributos de coluna e Indexes definidos na tabela original:

```sql
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento da tabela (table storage format) que a tabela original. O privilégio [`SELECT`](privileges-provided.html#priv_select) é exigido na tabela original.

`LIKE` funciona apenas para tabelas base, não para views.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma instrução [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") estiver em vigor.

[`CREATE TABLE ... LIKE`](create-table.html "13.1.18 CREATE TABLE Statement") faz as mesmas verificações que [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e não apenas copia o arquivo `.frm`. Isso significa que, se o SQL mode atual for diferente do mode em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo mode, e a instrução falhará.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações de coluna gerada da tabela original.

`CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` que foi especificada para a tabela original, nem quaisquer definições de Foreign Key.

Se a tabela original for uma tabela `TEMPORARY`, `CREATE TABLE ... LIKE` não preserva `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use `CREATE TEMPORARY TABLE ... LIKE`.