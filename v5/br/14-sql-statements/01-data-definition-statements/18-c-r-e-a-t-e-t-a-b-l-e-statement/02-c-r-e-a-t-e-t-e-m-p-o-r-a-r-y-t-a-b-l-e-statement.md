#### 13.1.18.2 Declaração de Criação de Tabela Temporária

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Isso significa que duas sessões diferentes podem usar o mesmo nome de tabela temporária sem conflitar entre si ou com uma tabela não `TEMPORARY` existente com o mesmo nome. (A tabela existente é oculta até que a tabela temporária seja eliminada.)

`CREATE TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

As tabelas `TEMPORARY` têm uma relação muito laxa com os bancos de dados (schemas). A remoção de um banco de dados não exclui automaticamente quaisquer tabelas `TEMPORARY` criadas dentro desse banco de dados. Além disso, você pode criar uma tabela `TEMPORARY` em um banco de dados inexistente se qualificar o nome da tabela com o nome do banco de dados na instrução `CREATE TABLE`. Nesse caso, todas as referências subsequentes à tabela devem ser qualificadas com o nome do banco de dados.

Para criar uma tabela temporária, você deve ter o privilégio `CREATE TEMPORARY TABLES`. Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégios na tabela. A sessão criadora pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`.

Uma implicação desse comportamento é que uma sessão pode manipular suas tabelas temporárias mesmo que o usuário atual não tenha privilégio para criá-las. Suponha que o usuário atual não tenha o privilégio `CREATE TEMPORARY TABLES` mas seja capaz de executar um procedimento armazenado de contexto definidor que é executado com os privilégios de um usuário que tem o `CREATE TEMPORARY TABLES` e que cria uma tabela temporária. Enquanto o procedimento estiver sendo executado, a sessão usa os privilégios do usuário definidor. Após o procedimento retornar, os privilégios efetivos retornam para os do usuário atual, que ainda pode ver a tabela temporária e realizar qualquer operação nela.

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 5.7.24; espere-se que ele seja removido em uma versão futura do MySQL.
