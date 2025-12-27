### 10.2.2 Otimização de Subconsultas, Tabelas Derivadas, Referências de Visualização e Expressões de Tabela Comuns

10.2.2.1 Otimização de Predicados de Subconsultas IN e EXISTS com Transformações Semijoin e Antijoin

10.2.2.2 Otimização de Subconsultas com Materialização

10.2.2.3 Otimização de Subconsultas com a Estratégia EXISTS

10.2.2.4 Otimização de Tabelas Derivadas, Referências de Visualização e Expressões de Tabela Comuns com Fusão ou Materialização

10.2.2.5 Otimização de Subconsultas ANY e ALL com Pushdown

O otimizador de consultas do MySQL tem diferentes estratégias disponíveis para avaliar subconsultas:

* Para uma subconsulta usada com um predicado `IN`, `= ANY` ou `EXISTS`, o otimizador tem essas opções:

  + Semijoin
  + Materialização
  + Estratégia EXISTS
* Para uma subconsulta usada com um predicado `NOT IN`, `<> ALL` ou `NOT EXISTS`, o otimizador tem essas opções:

  + Materialização
  + Estratégia EXISTS

Para uma tabela derivada, o otimizador tem essas opções (que também se aplicam a referências de visualização e expressões de tabela comuns):

* Fusão da tabela derivada no bloco de consulta externo
* Materialização da tabela derivada em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização anteriores.

Nota

Uma limitação em declarações `UPDATE` e `DELETE` que usam uma subconsulta para modificar uma única tabela é que o otimizador não usa otimizações de subconsultas semijoin ou materialização. Como solução alternativa, tente reescrevê-las como declarações `UPDATE` e `DELETE` de múltiplas tabelas que usam uma junção em vez de uma subconsulta.