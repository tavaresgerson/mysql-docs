### 10.2.2 Otimização de Subconsultas, Tabelas Derivadas, Referências de Visualização e Expressões de Tabela Comuns

O otimizador de consultas do MySQL tem diferentes estratégias disponíveis para avaliar subconsultas:

* Para uma subconsulta usada com um predicado `IN`, `= ANY` ou `EXISTS`, o otimizador tem essas opções:

  + Semijoin
  + Materialização
  + Estratégias `EXISTS`
* Para uma subconsulta usada com um predicado `NOT IN`, `<> ALL` ou `NOT EXISTS`, o otimizador tem essas opções:

  + Materialização
  + Estratégias `EXISTS`

Para uma tabela derivada, o otimizador tem essas opções (que também se aplicam a referências de visualização e expressões de tabela comum):

* Mesclar a tabela derivada no bloco de consulta externa
* Materializar a tabela derivada em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização anteriores.

::: info Nota

Uma limitação em declarações `UPDATE` e `DELETE` que usam uma subconsulta para modificar uma única tabela é que o otimizador não usa otimizações de subconsulta semijoin ou materialização. Como solução alternativa, tente reescrevê-las como declarações `UPDATE` e `DELETE` de várias tabelas que usam uma junção em vez de uma subconsulta.