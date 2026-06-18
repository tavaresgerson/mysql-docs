#### 15.1.20.2 Declaração de Criação de Tabela Temporária

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Isso significa que duas sessões diferentes podem usar o mesmo nome de tabela temporária sem conflitar entre si ou com uma tabela não `TEMPORARY` existente com o mesmo nome. (A tabela existente é oculta até que a tabela temporária seja eliminada.)

`InnoDB` não suporta tabelas temporárias compactadas. Quando `innodb_strict_mode` está habilitado (padrão), `CREATE TEMPORARY TABLE` retorna um erro se `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se `innodb_strict_mode` for desativado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado. A opção `innodb_file_per-table` não afeta a criação de tabelas temporárias `InnoDB`.

`CREATE TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

As tabelas `TEMPORARY` têm uma relação muito laxa com os bancos de dados (schemas). A remoção de um banco de dados não exclui automaticamente quaisquer tabelas `TEMPORARY` criadas dentro desse banco de dados.

Para criar uma tabela temporária, você deve ter o privilégio `CREATE TEMPORARY TABLES`. Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão criadora pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`.

Uma implicação desse comportamento é que uma sessão pode manipular suas tabelas temporárias mesmo que o usuário atual não tenha privilégio para criá-las. Suponha que o usuário atual não tenha o privilégio `CREATE TEMPORARY TABLES`, mas seja capaz de executar um procedimento armazenado definidor de contexto que é executado com os privilégios de um usuário que tem `CREATE TEMPORARY TABLES` e que cria uma tabela temporária. Enquanto o procedimento é executado, a sessão usa os privilégios do usuário definidor. Após o procedimento retornar, os privilégios efetivos retornam para os do usuário atual, que ainda pode ver a tabela temporária e realizar qualquer operação nela.

Você não pode usar `CREATE TEMPORARY TABLE ... LIKE` para criar uma tabela vazia com base na definição de uma tabela que reside no espaço de tabelas `mysql`, no espaço de tabelas do sistema `InnoDB` (`innodb_system`) ou em um espaço de tabelas geral. A definição do espaço de tabelas para essa tabela inclui um atributo `TABLESPACE` que define o espaço de tabelas onde a tabela reside, e os espaços de tabelas mencionados não suportam tabelas temporárias. Para criar uma tabela temporária com base na definição de uma tabela desse tipo, use a seguinte sintaxe:

```
CREATE TEMPORARY TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 8.0.13; espere que ele seja removido em uma versão futura do MySQL.
