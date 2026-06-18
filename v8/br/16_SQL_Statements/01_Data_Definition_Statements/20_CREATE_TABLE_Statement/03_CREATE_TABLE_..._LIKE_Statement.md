#### 15.1.20.3 CREATE TABLE ... LIKE Instrução

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

```
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento de tabela do original. O privilégio `SELECT` é necessário na tabela original.

`LIKE` funciona apenas para tabelas básicas, não para visualizações.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma instrução `LOCK TABLES` estiver em vigor.

`CREATE TABLE ... LIKE` faz as mesmas verificações que `CREATE TABLE`. Isso significa que, se o modo SQL atual for diferente do modo em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo modo e causar o falhar da instrução.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações da coluna gerada da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as restrições `CHECK` da tabela original, exceto que todos os nomes das restrições são gerados.

`CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` especificada para a tabela original, nem as definições de chave estrangeira.

Se a tabela original for uma tabela `TEMPORARY`, a tabela `CREATE TABLE ... LIKE` não preserva a tabela `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use a opção `CREATE TEMPORARY TABLE ... LIKE`.

As tabelas criadas no espaço de tabelas `mysql` (`InnoDB`), no espaço de tabelas do sistema `innodb_system` ou em espaços de tabelas gerais incluem um atributo `TABLESPACE` na definição da tabela, que define o espaço de tabelas onde a tabela reside. Devido a uma regressão temporária, `CREATE TABLE ... LIKE` preserva o atributo `TABLESPACE` e cria a tabela no espaço de tabelas definido, independentemente da configuração `innodb_file_per_table`. Para evitar o atributo `TABLESPACE` ao criar uma tabela vazia com base na definição de uma tabela desse tipo, use a seguinte sintaxe:

```
CREATE TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

As operações `CREATE TABLE ... LIKE` aplicam todos os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` à nova tabela.
