#### 8.2.1.20 Evitar varreduras completas da tabela

A saída do `EXPLAIN` mostra `ALL` na coluna `type` quando o MySQL usa uma varredura completa da tabela para resolver uma consulta. Isso geralmente acontece nas seguintes condições:

- A tabela é tão pequena que é mais rápido realizar uma varredura da tabela do que se preocupar com uma busca por chave. Isso é comum para tabelas com menos de 10 linhas e comprimento de linha curto.

- Não há restrições utilizáveis na cláusula `ON` ou `WHERE` para colunas indexadas.

- Você está comparando colunas indexadas com valores constantes e o MySQL calculou (com base na árvore de índice) que os constantes cobrem uma parte muito grande da tabela e que uma varredura da tabela seria mais rápida. Veja a Seção 8.2.1.1, “Otimização da Cláusula WHERE”.

- Você está usando uma chave com baixa cardinalidade (muitas linhas correspondem ao valor da chave) através de outra coluna. Nesse caso, o MySQL assume que, ao usar a chave, é provável que realize muitas consultas de chave e que uma varredura da tabela seria mais rápida.

Para tabelas pequenas, uma varredura da tabela geralmente é apropriada e o impacto no desempenho é negligenciável. Para tabelas grandes, experimente as seguintes técnicas para evitar que o otimizador escolha incorretamente uma varredura da tabela:

- Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chaves da tabela digitalizada. Consulte a Seção 13.7.2.1, “Instrução ANALYZE TABLE”.

- Use `FORCE INDEX` na tabela digitalizada para informar ao MySQL que as consultas à tabela são muito caras em comparação com o uso do índice fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
    WHERE t1.col_name=t2.col_name;
  ```

  Consulte a Seção 8.9.4, “Dicas de índice”.

- Inicie o **mysqld** com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para informar o otimizador de que nenhuma varredura de chave causa mais de 1.000 buscas de chave. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.
