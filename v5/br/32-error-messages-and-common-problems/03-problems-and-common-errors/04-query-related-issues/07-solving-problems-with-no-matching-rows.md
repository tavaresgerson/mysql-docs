#### B.3.4.7 Solucionando Problemas com Nenhuma Linha Correspondente

Se você tem uma Query complicada que usa muitas tabelas, mas que não retorna nenhuma linha, você deve usar o seguinte procedimento para descobrir o que está errado:

1. Teste a Query com [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") para verificar se você consegue encontrar algo que esteja obviamente errado. Consulte [Seção 13.8.2, “EXPLAIN Statement”](explain.html "13.8.2 EXPLAIN Statement").

2. Selecione apenas as colunas que são usadas na cláusula `WHERE`.

3. Remova uma tabela por vez da Query até que ela retorne algumas linhas. Se as tabelas forem grandes, é uma boa ideia usar `LIMIT 10` com a Query.

4. Execute um [`SELECT`](select.html "13.2.9 SELECT Statement") para a coluna que deveria ter correspondido a uma linha na tabela que foi removida por último da Query.

5. Se você estiver comparando colunas [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") ou [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") com números que possuem decimais, você não pode usar comparações de igualdade (`=`). Este problema é comum na maioria das linguagens de computador, pois nem todos os valores de ponto flutuante podem ser armazenados com precisão exata. Em alguns casos, alterar o [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") para um [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") resolve isso. Consulte [Seção B.3.4.8, “Problems with Floating-Point Values”](problems-with-float.html "B.3.4.8 Problems with Floating-Point Values").

6. Se você ainda não conseguir descobrir o que está errado, crie um teste mínimo que possa ser executado com `mysql test < query.sql` e que demonstre seus problemas. Você pode criar um arquivo de teste fazendo o dump das tabelas com [**mysqldump --quick db_name *`tbl_name_1`* ... *`tbl_name_n`* > query.sql**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). Abra o arquivo em um editor, remova algumas linhas de `INSERT` (se houver mais do que o necessário para demonstrar o problema) e adicione sua instrução [`SELECT`](select.html "13.2.9 SELECT Statement") no final do arquivo.

   Verifique se o arquivo de teste demonstra o problema executando estes comandos:

   ```sql
   $> mysqladmin create test2
   $> mysql test2 < query.sql
   ```

   Anexe o arquivo de teste a um relatório de bug, que você pode registrar usando as instruções na [Seção 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").