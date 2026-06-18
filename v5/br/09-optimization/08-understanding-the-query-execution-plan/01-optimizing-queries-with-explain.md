### 8.8.1 Otimizando Consultas com EXPLAIN

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa as instruções:

- O comando `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

- Quando o `EXPLAIN` é usado com uma instrução explicável, o MySQL exibe informações sobre o plano de execução da instrução do otimizador. Ou seja, o MySQL explica como processaria a instrução, incluindo informações sobre como as tabelas são unidas e em que ordem. Para obter informações sobre o uso do `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 8.8.2, “Formato de Saída do EXPLAIN”.

- Quando o comando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma instrução explicável, ele exibe o plano de execução da instrução que está sendo executada na conexão nomeada. Consulte a Seção 8.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

- Para as instruções `SELECT`, o `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja a Seção 8.8.3, “Formato de Saída EXPLAIN Extendido”.

- O comando `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja a Seção 22.3.5, “Obtendo Informações Sobre Partições”.

- A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Isso é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações no formato JSON.

Com a ajuda do `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a instrução seja executada mais rapidamente, usando índices para encontrar linhas. Você também pode usar `EXPLAIN` para verificar se o otimizador está combinando as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja a Seção 13.2.9, “Instrução SELECT”.) No entanto, `STRAIGHT_JOIN` pode impedir que os índices sejam usados porque desabilita as transformações semijoin. Veja a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações semijoin”.

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para obter detalhes, consulte a Seção 8.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas do otimizador. Veja a Seção 13.7.2.1, “Instrução ANALYZE TABLE”.

Nota

`EXPLAIN` também pode ser usado para obter informações sobre as colunas de uma tabela. `EXPLAIN tbl_name` é sinônimo de `DESCRIBE tbl_name` e `SHOW COLUMNS FROM tbl_name`. Para mais informações, consulte a Seção 13.8.1, “Instrução DESCRIBE”, e a Seção 13.7.5.5, “Instrução SHOW COLUMNS”.
