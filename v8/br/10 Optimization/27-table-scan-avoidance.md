#### 10.2.1.23 Evitando varreduras completas da tabela

A saída do `EXPLAIN` mostra `ALL` na coluna `type` quando o MySQL usa uma varredura completa da tabela para resolver uma consulta. Isso geralmente acontece nas seguintes condições:

* A tabela é tão pequena que é mais rápido realizar uma varredura da tabela do que se preocupar com uma busca por chave. Isso é comum para tabelas com menos de 10 linhas e um comprimento de linha curto.
* Não há restrições utilizáveis na cláusula `ON` ou `WHERE` para colunas indexadas.
* Você está comparando colunas indexadas com valores constantes e o MySQL calculou (com base na árvore de índice) que os constantes cobrem uma parte muito grande da tabela e que uma varredura da tabela seria mais rápida. Veja a Seção 10.2.1.1, “Otimização da cláusula WHERE”.
* Você está usando uma chave com baixa cardinalidade (muitas linhas correspondem ao valor da chave) por meio de outra coluna. Neste caso, o MySQL assume que usar a chave provavelmente requer muitas buscas por chave e que uma varredura da tabela seria mais rápida.

Para tabelas pequenas, uma varredura da tabela muitas vezes é apropriada e o impacto no desempenho é negligenciável. Para tabelas grandes, tente as seguintes técnicas para evitar que o otimizador escolha incorretamente uma varredura da tabela:

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chaves para a tabela varrida. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.
* Use `FORCE INDEX` para a tabela varrida para dizer ao MySQL que varreduras da tabela são muito caras em comparação com o uso do índice dado:

  ```
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
    WHERE t1.col_name=t2.col_name;
  ```

  Veja a Seção 10.9.4, “Dicas de índice”.
* Inicie o `mysqld` com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para dizer ao otimizador que nenhuma busca por chave causa mais de 1.000 buscas por chave. Veja a Seção 7.1.8, “Variáveis do sistema do servidor”.