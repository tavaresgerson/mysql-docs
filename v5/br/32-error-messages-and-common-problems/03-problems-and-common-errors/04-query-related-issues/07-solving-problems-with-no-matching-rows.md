#### B.3.4.7 Resolver problemas sem linhas correspondentes

Se você tiver uma consulta complicada que usa muitas tabelas, mas que não retorna nenhuma linha, você deve usar o seguinte procedimento para descobrir o que está errado:

1. Teste a consulta com [`EXPLAIN`](explain.html) para verificar se você consegue encontrar algo que esteja obviamente errado. Veja [Seção 13.8.2, “Instrução EXPLAIN”](explain.html).

2. Selecione apenas as colunas que são usadas na cláusula `WHERE`.

3. Remova uma tabela de cada vez da consulta até que ela retorne algumas linhas. Se as tabelas forem grandes, é uma boa ideia usar `LIMIT 10` com a consulta.

4. Emita uma consulta [`SELECT`](select.html) para a coluna que deve ter correspondido a uma linha contra a tabela que foi removida da consulta.

5. Se você estiver comparando colunas de tipo `[FLOAT]` ou `[DOUBLE]` com números que têm casas decimais, não é possível usar comparações de igualdade (`=`). Esse problema é comum na maioria das linguagens de programação, pois nem todos os valores de ponto flutuante podem ser armazenados com precisão exata. Em alguns casos, alterar o `[FLOAT]` para `[DOUBLE]` resolve esse problema. Veja [Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”](problemas-com-float.html).

6. Se você ainda não consegue descobrir o que está errado, crie um teste mínimo que possa ser executado com `mysql test < query.sql` que mostre seus problemas. Você pode criar um arquivo de teste drenando as tabelas com [**mysqldump --quick db_name *`tbl_name_1`* ... *`tbl_name_n`* > query.sql**](mysqldump.html). Abra o arquivo em um editor, remova algumas linhas de inserção (se houver mais do que o necessário para demonstrar o problema) e adicione sua instrução `SELECT` no final do arquivo.

   Verifique se o arquivo de teste demonstra o problema executando esses comandos:

   ```sql
   $> mysqladmin create test2
   $> mysql test2 < query.sql
   ```

   Anexe o arquivo de teste a um relatório de erro, que você pode registrar seguindo as instruções na [Seção 1.5, “Como relatar erros ou problemas”](bug-reports.html).
