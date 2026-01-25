### 8.2.2 Otimizando Subqueries, Derived Tables e Referências de View

8.2.2.1 Otimizando Subqueries, Derived Tables e Referências de View com Transformações Semijoin

8.2.2.2 Otimizando Subqueries com Materialization

8.2.2.3 Otimizando Subqueries com a Estratégia EXISTS

8.2.2.4 Otimizando Derived Tables e Referências de View com Merging ou Materialization

O otimizador de Query do MySQL possui diferentes estratégias disponíveis para avaliar subqueries:

* Para subqueries `IN` (ou `=ANY`), o otimizador tem estas escolhas:

  + Semijoin
  + Materialization
  + Estratégia `EXISTS`
* Para subqueries `NOT IN` (ou `<>ALL`), o otimizador tem estas escolhas:

  + Materialization
  + Estratégia `EXISTS`

Para derived tables, o otimizador tem estas escolhas (que também se aplicam a referências de view):

* Merge a derived table no bloco de Query externo
* Materialize a derived table em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização precedentes.

Nota

Uma limitação em comandos `UPDATE` e `DELETE` que usam uma subquery para modificar uma única tabela é que o otimizador não utiliza otimizações de subquery semijoin ou materialization. Como solução alternativa (workaround), tente reescrevê-los como comandos `UPDATE` e `DELETE` de múltiplas tabelas que utilizam um JOIN em vez de uma subquery.