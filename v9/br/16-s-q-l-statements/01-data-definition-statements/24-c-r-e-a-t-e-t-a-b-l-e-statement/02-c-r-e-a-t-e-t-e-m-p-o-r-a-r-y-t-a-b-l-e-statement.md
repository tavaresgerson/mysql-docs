#### 15.1.24.2 Declaração de Criação de Tabela Temporária

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Isso significa que duas sessões diferentes podem usar o mesmo nome de tabela temporária sem conflitar entre si ou com uma tabela não `TEMPORARY` existente do mesmo nome. (A tabela existente é oculta até que a tabela temporária seja eliminada.)

O `InnoDB` não suporta tabelas temporárias compactadas. Quando o `innodb_strict_mode` está habilitado (o padrão), o `CREATE TEMPORARY TABLE` retorna um erro se `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` for especificado. Se o `innodb_strict_mode` estiver desabilitado, avisos são emitidos e a tabela temporária é criada usando um formato de linha não compactado. A opção `innodb_file_per-table` não afeta a criação de tabelas temporárias `InnoDB`.

O `CREATE TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 15.3.3, “Declarações que Causam um Commit Implícito”.

As tabelas `TEMPORARY` têm uma relação muito laxa com as bases de dados (schemas). A eliminação de uma base de dados não elimina automaticamente quaisquer tabelas `TEMPORARY` criadas dentro dessa base de dados.

Para criar uma tabela temporária, você deve ter o privilégio `CREATE TEMPORARY TABLES`. Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão criadora pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`.

Uma implicação desse comportamento é que uma sessão pode manipular suas tabelas temporárias mesmo que o usuário atual não tenha privilégio para criá-las. Suponha que o usuário atual não tenha o privilégio `CREATE TEMPORARY TABLES`, mas seja capaz de executar um procedimento armazenado de contexto definidor que é executado com os privilégios de um usuário que tem `CREATE TEMPORARY TABLES` e que cria uma tabela temporária. Enquanto o procedimento é executado, a sessão usa os privilégios do usuário definidor. Após o procedimento retornar, os privilégios efetivos retornam para os do usuário atual, que ainda pode ver a tabela temporária e realizar qualquer operação nela.

Você não pode usar `CREATE TEMPORARY TABLE ... LIKE` para criar uma tabela vazia com base na definição de uma tabela que reside no espaço de tabelas `mysql`, no espaço de tabelas do sistema `InnoDB` (`innodb_system`) ou em um espaço de tabelas geral. A definição do espaço de tabelas para tal tabela inclui um atributo `TABLESPACE` que define o espaço de tabelas onde a tabela reside, e os espaços de tabelas mencionados não suportam tabelas temporárias. Para criar uma tabela temporária com base na definição de tal tabela, use a seguinte sintaxe:

```
CREATE TEMPORARY TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

Observação

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` está desatualizado; espere-o ser removido em uma versão futura do MySQL.