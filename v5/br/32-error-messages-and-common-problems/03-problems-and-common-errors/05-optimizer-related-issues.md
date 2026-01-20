### B.3.5 Problemas relacionados ao otimizador

O MySQL utiliza um otimizador baseado em custos para determinar a melhor maneira de resolver uma consulta. Em muitos casos, o MySQL pode calcular o melhor plano de consulta possível, mas às vezes o MySQL não tem informações suficientes sobre os dados disponíveis e tem que fazer suposições “educadas” sobre os dados.

Para os casos em que o MySQL não faz a coisa "certa", as ferramentas que você tem disponíveis para ajudar o MySQL são:

- Use a instrução [`EXPLAIN`](explain.html) para obter informações sobre como o MySQL processa uma consulta. Para usá-la, basta adicionar a palavra-chave [`EXPLAIN`](explain.html) na frente da sua instrução [`SELECT`](select.html):

  ```sql
  mysql> EXPLAIN SELECT * FROM t1, t2 WHERE t1.i = t2.i;
  ```

  [`EXPLAIN`](explain.html) é discutido em mais detalhes na [Seção 13.8.2, "Instrução EXPLAIN"](explain.html).

- Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chaves da tabela digitalizada. Consulte [Seção 13.7.2.1, “Instrução ANALYZE TABLE”](analyze-table.html).

- Use `FORCE INDEX` na tabela digitalizada para informar ao MySQL que as consultas à tabela são muito caras em comparação com o uso do índice fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
  WHERE t1.col_name=t2.col_name;
  ```

  `USE INDEX` e `IGNORE INDEX` também podem ser úteis. Veja [Seção 8.9.4, “Dicas de índice”](index-hints.html).

- `STRAIGHT_JOIN` global e em nível de tabela. Veja [Seção 13.2.9, “Instrução SELECT”](select.html).

- Você pode ajustar variáveis de sistema globais ou específicas de um thread. Por exemplo, inicie o [**mysqld**](mysqld.html) com a opção [`--max-seeks-for-key=1000`](server-system-variables.html#sysvar_max_seeks_for_key) ou use `SET max_seeks_for_key=1000` para informar ao otimizador que nenhuma varredura de chave causa mais de 1.000 buscas de chave. Veja [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html).
