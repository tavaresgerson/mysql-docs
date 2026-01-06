### 8.2.2 Otimizando subconsultas, tabelas derivadas e referências de visualização

8.2.2.1 Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações de semijoin

8.2.2.2 Otimização de subconsultas com materialização

8.2.2.3 Otimização de subconsultas com a estratégia EXISTS

8.2.2.4 Otimização de tabelas derivadas e referências de visualizações com fusão ou materialização

O otimizador de consultas do MySQL tem diferentes estratégias disponíveis para avaliar subconsultas:

- Para subconsultas `IN` (ou `=ANY`), o otimizador tem essas opções:

  - Semijoin
  - Materialização
  - Estratégia `EXISTS`
- Para subconsultas `NOT IN` (ou `<>ALL`), o otimizador tem essas opções:

  - Materialização
  - Estratégia `EXISTS`

Para tabelas derivadas, o otimizador tem essas opções (que também se aplicam às referências de visualização):

- Junte a tabela derivada ao bloco de consulta externa
- Materialize a tabela derivada em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização anteriores.

Nota

Uma limitação das instruções `UPDATE` e `DELETE` que utilizam uma subconsulta para modificar uma única tabela é que o otimizador não utiliza otimizações de subconsulta por junção parcial ou materialização. Como solução alternativa, tente reescrevê-las como múltiplas instruções `UPDATE` e `DELETE` que utilizam uma junção em vez de uma subconsulta.
