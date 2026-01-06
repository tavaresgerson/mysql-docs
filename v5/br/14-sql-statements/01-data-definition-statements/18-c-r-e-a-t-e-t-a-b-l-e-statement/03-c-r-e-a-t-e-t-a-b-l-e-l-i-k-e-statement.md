#### 13.1.18.3 Declaração `CREATE TABLE ... LIKE`

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

```sql
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento de tabela do original. O privilégio `SELECT` é necessário na tabela original.

O comando `LIKE` funciona apenas para tabelas básicas, não para visualizações.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma instrução `LOCK TABLES` estiver em vigor.

`CREATE TABLE ... LIKE` faz as mesmas verificações que `CREATE TABLE` e não apenas copia o arquivo `.frm`. Isso significa que, se o modo SQL atual for diferente do modo em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo modo, e a declaração falha.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações das colunas geradas da tabela original.

A opção `CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` que foi especificada para a tabela original, nem as definições de chave estrangeira.

Se a tabela original for uma tabela `TEMPORARY`, a instrução `CREATE TABLE ... LIKE` não preserva a tabela `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use `CREATE TEMPORARY TABLE ... LIKE`.
