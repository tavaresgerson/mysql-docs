### B.3.5 Problemas Relacionados ao Optimizer

O MySQL utiliza um Optimizer baseado em custo para determinar a melhor maneira de resolver uma Query. Em muitos casos, o MySQL pode calcular o melhor plano de Query possível, mas, às vezes, o MySQL não tem informações suficientes sobre os dados disponíveis e precisa fazer suposições "embasadas" sobre os dados.

Nos casos em que o MySQL não faz a coisa "certa", as ferramentas que você tem disponíveis para ajudar o MySQL são:

* Use a instrução [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") para obter informações sobre como o MySQL processa uma Query. Para usá-la, basta adicionar a palavra-chave [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") na frente da sua instrução [`SELECT`](select.html "13.2.9 SELECT Statement"):

  ```sql
  mysql> EXPLAIN SELECT * FROM t1, t2 WHERE t1.i = t2.i;
  ```

  [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") é discutido em mais detalhes na [Seção 13.8.2, “EXPLAIN Statement”](explain.html "13.8.2 EXPLAIN Statement").

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de Index (chaves) para a tabela escaneada. Consulte a [Seção 13.7.2.1, “ANALYZE TABLE Statement”](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

* Use `FORCE INDEX` para a tabela escaneada para informar ao MySQL que os Table Scans são muito caros em comparação ao uso do Index fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
  WHERE t1.col_name=t2.col_name;
  ```

  `USE INDEX` e `IGNORE INDEX` também podem ser úteis. Consulte a [Seção 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints").

* `STRAIGHT_JOIN` global e no nível de tabela. Consulte a [Seção 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

* Você pode ajustar variáveis de sistema globais ou específicas de Thread. Por exemplo, inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--max-seeks-for-key=1000`](server-system-variables.html#sysvar_max_seeks_for_key) ou use `SET max_seeks_for_key=1000` para informar ao Optimizer que nenhum Key Scan causa mais de 1.000 Key Seeks. Consulte a [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").