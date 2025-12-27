### B.3.5 Problemas Relacionados ao Otimizador

O MySQL utiliza um otimizador baseado em custos para determinar a melhor maneira de resolver uma consulta. Em muitos casos, o MySQL pode calcular o melhor plano de consulta possível, mas, às vezes, o MySQL não tem informações suficientes sobre os dados disponíveis e tem que fazer suposições "educadas" sobre os dados.

Para os casos em que o MySQL não faz a coisa "certa", as ferramentas que você tem disponíveis para ajudar o MySQL são:

* Use a instrução `EXPLAIN` para obter informações sobre como o MySQL processa uma consulta. Para usá-la, basta adicionar a palavra-chave `EXPLAIN` na frente da sua instrução `SELECT`:

  ```
  mysql> EXPLAIN SELECT * FROM t1, t2 WHERE t1.i = t2.i;
  ```

  A instrução `EXPLAIN` é discutida com mais detalhes na Seção 15.8.2, “Instrução EXPLAIN”.

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chaves para a tabela escaneada. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

* Use `FORCE INDEX` para a tabela escaneada para dizer ao MySQL que as consultas à tabela são muito caras em comparação com o uso do índice dado:

  ```
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
  WHERE t1.col_name=t2.col_name;
  ```

  `USE INDEX` e `IGNORE INDEX` também podem ser úteis. Veja a Seção 10.9.4, “Dicas de índice”.

* `STRAIGHT_JOIN` global e de nível de thread. Veja a Seção 15.2.13, “Instrução SELECT”.

* Você pode ajustar variáveis de sistema globais ou específicas de thread. Por exemplo, inicie o **mysqld** com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para dizer ao otimizador que nenhuma consulta de chave causa mais de 1.000 buscas de chave. Veja a Seção 7.1.8, “Variáveis de sistema do servidor”.