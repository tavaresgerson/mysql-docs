#### B.3.4.7 Resolvendo Problemas sem Linhas Correspondentes

Se você tiver uma consulta complicada que usa muitas tabelas, mas que não retorna nenhuma linha, você deve usar o seguinte procedimento para descobrir o que está errado:

1. Teste a consulta com `EXPLAIN` para verificar se você pode encontrar algo obviamente errado. Veja a Seção 15.8.2, “Instrução EXPLAIN”.

2. Selecione apenas as colunas que são usadas na cláusula `WHERE`.

3. Remova uma tabela de cada vez da consulta até que ela retorne algumas linhas. Se as tabelas forem grandes, é uma boa ideia usar `LIMIT 10` com a consulta.

4. Efetue uma `SELECT` para a coluna que deveria ter correspondido a uma linha contra a tabela que foi removida da consulta.

5. Se você está comparando colunas `FLOAT` - `FLOAT`, `DOUBLE") ou `DOUBLE` - `FLOAT, DOUBLE") com números que têm decimais, você não pode usar comparações de igualdade (`=`). Esse problema é comum na maioria das linguagens de programação porque nem todos os valores de ponto flutuante podem ser armazenados com precisão exata. Em alguns casos, alterar `FLOAT` - `FLOAT, DOUBLE") para `DOUBLE` - `FLOAT, DOUBLE") resolve esse problema. Veja a Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”.

6. Se você ainda não conseguir descobrir o que está errado, crie um teste mínimo que possa ser executado com `mysql test < query.sql` que mostre seus problemas. Você pode criar um arquivo de teste drenando as tabelas com **mysqldump --quick db_name *`tbl_name_1`* ... *`tbl_name_n`* > query.sql**. Abra o arquivo em um editor, remova algumas linhas de inserção (se houver mais do que o necessário para demonstrar o problema) e adicione sua instrução `SELECT` no final do arquivo.

Verifique se o arquivo de teste demonstra o problema executando esses comandos:

```
   $> mysqladmin create test2
   $> mysql test2 < query.sql
   ```

Anexe o arquivo de teste a um relatório de erro, que você pode registrar seguindo as instruções na Seção 1.6, “Como relatar erros ou problemas”.