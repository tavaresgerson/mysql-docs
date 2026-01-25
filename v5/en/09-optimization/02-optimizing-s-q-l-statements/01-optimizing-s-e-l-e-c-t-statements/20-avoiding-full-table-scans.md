#### 8.2.1.20 Evitando Full Table Scans

A saída do `EXPLAIN` mostra `ALL` na coluna `type` quando o MySQL utiliza um *full table scan* para resolver uma Query. Isso geralmente ocorre nas seguintes condições:

* A tabela é tão pequena que é mais rápido realizar um *table scan* do que se preocupar com um *key lookup*. Isso é comum para tabelas com menos de 10 linhas e um comprimento de linha curto.

* Não há restrições utilizáveis nas cláusulas `ON` ou `WHERE` para colunas Indexadas.

* Você está comparando colunas indexadas com valores constantes e o MySQL calculou (com base na Index tree) que as constantes cobrem uma parte muito grande da tabela e que um *table scan* seria mais rápido. Consulte a Seção 8.2.1.1, “WHERE Clause Optimization”.

* Você está usando uma *key* com baixa cardinalidade (muitas linhas correspondem ao valor da *key*) através de outra coluna. Neste caso, o MySQL assume que, ao usar a *key*, é provável que ele execute muitos *key lookups* e que um *table scan* seria mais rápido.

Para tabelas pequenas, um *table scan* é frequentemente apropriado e o impacto no desempenho é negligenciável. Para tabelas grandes, tente as seguintes técnicas para evitar que o Optimizer escolha incorretamente um *table scan*:

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de *key* para a tabela *scanned*. Consulte a Seção 13.7.2.1, “ANALYZE TABLE Statement”.

* Use `FORCE INDEX` para a tabela *scanned* para informar ao MySQL que *table scans* são muito caros em comparação ao uso do Index fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
    WHERE t1.col_name=t2.col_name;
  ```

  Consulte a Seção 8.9.4, “Index Hints”.

* Inicie o **mysqld** com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para informar ao Optimizer que ele deve assumir que nenhum *key scan* causa mais de 1.000 *key seeks*. Consulte a Seção 5.1.7, “Server System Variables”.