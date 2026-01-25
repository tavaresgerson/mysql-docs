### 8.8.1 Otimizando Queries com EXPLAIN

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa as instruções:

* `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

* Quando `EXPLAIN` é usado com uma instrução explicável, o MySQL exibe informações do `optimizer` sobre o `execution plan` da instrução. Ou seja, o MySQL explica como ele processaria a instrução, incluindo informações sobre como as tabelas são `joined` e em qual ordem. Para obter informações sobre como usar `EXPLAIN` para conseguir informações do `execution plan`, consulte a Seção 8.8.2, “EXPLAIN Output Format”.

* Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma instrução explicável, ele exibe o `execution plan` para a instrução que está sendo executada na `connection` nomeada. Consulte a Seção 8.8.4, “Obtaining Execution Plan Information for a Named Connection”.

* Para instruções `SELECT`, `EXPLAIN` produz informações adicionais do `execution plan` que podem ser exibidas usando `SHOW WARNINGS`. Consulte a Seção 8.8.3, “Extended EXPLAIN Output Format”.

* `EXPLAIN` é útil para examinar `queries` envolvendo tabelas particionadas. Consulte a Seção 22.3.5, “Obtaining Information About Partitions”.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações em formato `JSON`.

Com a ajuda de `EXPLAIN`, você pode ver onde deve adicionar `indexes` às tabelas para que a instrução seja executada mais rapidamente, usando `indexes` para encontrar linhas. Você também pode usar `EXPLAIN` para verificar se o `optimizer` une as tabelas em uma ordem ideal. Para dar uma dica ao `optimizer` para usar uma ordem de `JOIN` que corresponda à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, inicie a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Consulte a Seção 13.2.9, “SELECT Statement”.) No entanto, `STRAIGHT_JOIN` pode impedir que `indexes` sejam usados porque desativa as transformações de `semijoin`. Consulte a Seção 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations”.

O `optimizer trace` pode, por vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do `optimizer trace` estão sujeitos a alterações entre versões. Para obter detalhes, consulte a Seção 8.15, “Tracing the Optimizer”.

Se você tiver um problema com `indexes` que não estão sendo usados quando você acredita que deveriam estar, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a `cardinality` das chaves, que podem afetar as escolhas feitas pelo `optimizer`. Consulte a Seção 13.7.2.1, “ANALYZE TABLE Statement”.

Nota

`EXPLAIN` também pode ser usado para obter informações sobre as colunas em uma tabela. `EXPLAIN tbl_name` é sinônimo de `DESCRIBE tbl_name` e `SHOW COLUMNS FROM tbl_name`. Para mais informações, consulte a Seção 13.8.1, “DESCRIBE Statement”, e a Seção 13.7.5.5, “SHOW COLUMNS Statement”.