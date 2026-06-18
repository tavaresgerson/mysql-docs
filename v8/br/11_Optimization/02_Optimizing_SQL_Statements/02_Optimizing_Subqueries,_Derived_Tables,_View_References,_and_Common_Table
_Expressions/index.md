### 10.2.2 Otimizando subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comuns

10.2.2.1 Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin

10.2.2.2 Otimização de subconsultas com materialização

10.2.2.3 Otimização de subconsultas com a estratégia EXISTS

10.2.2.4 Otimização de tabelas derivadas, referências de visualização e expressões de tabela comuns com fusão ou materialização

10.2.2.5 Otimização de empilhamento de condições derivadas

O otimizador de consultas do MySQL tem diferentes estratégias disponíveis para avaliar subconsultas:

- Para uma subconsulta usada com um predicado `IN`, `= ANY` ou `EXISTS`, o otimizador tem essas opções:

  - Semijoin
  - Materialização
  - Estratégia `EXISTS`
- Para uma subconsulta usada com um predicado `NOT IN`, `<> ALL` ou `NOT EXISTS`, o otimizador tem essas opções:

  - Materialização
  - Estratégia `EXISTS`

Para uma tabela derivada, o otimizador tem essas opções (que também se aplicam a referências de visualização e expressões de tabela comuns):

- Junte a tabela derivada ao bloco de consulta externa
- Materialize a tabela derivada em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização anteriores.

Nota

Uma limitação das instruções `UPDATE` e `DELETE` que utilizam uma subconsulta para modificar uma única tabela é que o otimizador não utiliza otimizações de subconsulta por junção parcial ou materialização. Como solução alternativa, tente reescrevê-las como instruções `UPDATE` e `DELETE` de múltiplas tabelas que utilizam uma junção em vez de uma subconsulta.
