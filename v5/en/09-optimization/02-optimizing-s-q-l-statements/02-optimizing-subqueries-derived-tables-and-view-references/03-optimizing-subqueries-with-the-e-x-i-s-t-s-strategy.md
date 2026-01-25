#### 8.2.2.3 Otimizando Subqueries com a Estratégia EXISTS

Certos otimizações são aplicáveis a comparações que usam o operador `IN` (ou `=ANY`) para testar resultados de subquery. Esta seção discute essas otimizações, particularmente em relação aos desafios que os valores `NULL` apresentam. A última parte da discussão sugere como você pode auxiliar o Optimizer.

Considere a seguinte comparação de subquery:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

O MySQL avalia as Queries “de fora para dentro.” Ou seja, ele primeiro obtém o valor da expressão externa *`outer_expr`*, e então executa a subquery e captura as linhas que ela produz.

Uma otimização muito útil é “informar” à subquery que as únicas linhas de interesse são aquelas onde a expressão interna *`inner_expr`* é igual a *`outer_expr`*. Isso é feito propagando (pushing down) uma igualdade apropriada para a `WHERE clause` da subquery para torná-la mais restritiva. A comparação convertida se parece com isto:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
```

Após a conversão, o MySQL pode usar a igualdade propagada para limitar o número de linhas que ele deve examinar para avaliar a subquery.

De forma mais geral, uma comparação de *`N`* valores para uma subquery que retorna linhas com *`N`* valores está sujeita à mesma conversão. Se *`oe_i`* e *`ie_i`* representam valores de expressão externa e interna correspondentes, esta comparação de subquery:

```sql
(oe_1, ..., oe_N) IN
  (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

Torna-se:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND oe_1 = ie_1
                          AND ...
                          AND oe_N = ie_N)
```

Para simplificar, a discussão a seguir assume um único par de valores de expressão externa e interna.

A conversão descrita tem suas limitações. Ela é válida apenas se ignorarmos possíveis valores `NULL`. Ou seja, a estratégia de “pushdown” funciona desde que ambas as condições a seguir sejam verdadeiras:

* *`outer_expr`* e *`inner_expr`* não podem ser `NULL`.

* Você não precisa distinguir resultados de subquery `NULL` de `FALSE`. Se a subquery for parte de uma expressão `OR` ou `AND` na `WHERE clause`, o MySQL assume que isso não é relevante. Outra instância em que o Optimizer nota que resultados de subquery `NULL` e `FALSE` não precisam ser distinguidos é esta construção:

  ```sql
  ... WHERE outer_expr IN (subquery)
  ```

  Neste caso, a `WHERE clause` rejeita a linha, independentemente de `IN (subquery)` retornar `NULL` ou `FALSE`.

Quando uma ou ambas as condições não se aplicam, a otimização é mais complexa.

Suponha que *`outer_expr`* seja conhecido por ser um valor não-`NULL`, mas a subquery não produz uma linha tal que *`outer_expr`* = *`inner_expr`*. Então `outer_expr IN (SELECT ...)` é avaliado da seguinte forma:

* `NULL`, se o `SELECT` produzir qualquer linha onde *`inner_expr`* é `NULL`

* `FALSE`, se o `SELECT` produzir apenas valores não-`NULL` ou não produzir nada

Nesta situação, a abordagem de procurar por linhas com `outer_expr = inner_expr` não é mais válida. É necessário procurar por tais linhas, mas se nenhuma for encontrada, também procurar por linhas onde *`inner_expr`* é `NULL`. Grosso modo, a subquery pode ser convertida para algo como isto:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND
        (outer_expr=inner_expr OR inner_expr IS NULL))
```

A necessidade de avaliar a condição `IS NULL` extra é a razão pela qual o MySQL possui o método de acesso `ref_or_null`:

```sql
mysql> EXPLAIN
       SELECT outer_expr IN (SELECT t2.maybe_null_key
                             FROM t2, t3 WHERE ...)
       FROM t1;
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
...
*************************** 2. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t2
         type: ref_or_null
possible_keys: maybe_null_key
          key: maybe_null_key
      key_len: 5
          ref: func
         rows: 2
        Extra: Using where; Using index
...
```

Os métodos de acesso específicos para subquery `unique_subquery` e `index_subquery` também possuem variantes “or `NULL`”.

A condição adicional `OR ... IS NULL` torna a execução da Query ligeiramente mais complicada (e algumas otimizações dentro da subquery tornam-se inaplicáveis), mas geralmente isso é tolerável.

A situação é muito pior quando *`outer_expr`* pode ser `NULL`. De acordo com a interpretação SQL de `NULL` como “valor desconhecido,” `NULL IN (SELECT inner_expr ...)` deve ser avaliado como:

* `NULL`, se o `SELECT` produzir quaisquer linhas

* `FALSE`, se o `SELECT` não produzir nenhuma linha

Para uma avaliação adequada, é necessário poder verificar se o `SELECT` produziu alguma linha, de modo que `outer_expr = inner_expr` não pode ser propagado para a subquery. Isso é um problema porque muitas subqueries do mundo real se tornam muito lentas, a menos que a igualdade possa ser propagada.

Essencialmente, deve haver diferentes maneiras de executar a subquery dependendo do valor de *`outer_expr`*.

O Optimizer escolhe a conformidade SQL em detrimento da velocidade, então ele considera a possibilidade de que *`outer_expr`* possa ser `NULL`:

* Se *`outer_expr`* for `NULL`, para avaliar a seguinte expressão, é necessário executar o `SELECT` para determinar se ele produz quaisquer linhas:

  ```sql
  NULL IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  É necessário executar o `SELECT` original aqui, sem quaisquer igualdades propagadas do tipo mencionado anteriormente.

* Por outro lado, quando *`outer_expr`* não é `NULL`, é absolutamente essencial que esta comparação:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  Seja convertida nesta expressão que usa uma condição propagada:

  ```sql
  EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
  ```

  Sem esta conversão, as subqueries são lentas.

Para resolver o dilema de propagar ou não as condições para a subquery, as condições são envolvidas em funções de “trigger”. Assim, uma expressão da seguinte forma:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

É convertida em:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(outer_expr=inner_expr))
```

De forma mais geral, se a comparação da subquery for baseada em vários pares de expressões externas e internas, a conversão pega esta comparação:

```sql
(oe_1, ..., oe_N) IN (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

E a converte para esta expressão:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(oe_1=ie_1)
                          AND ...
                          AND trigcond(oe_N=ie_N)
       )
```

Cada `trigcond(X)` é uma função especial que é avaliada para os seguintes valores:

* *`X`* quando a expressão externa “linkada” *`oe_i`* não é `NULL`

* `TRUE` quando a expressão externa “linkada” *`oe_i`* é `NULL`

Nota

As funções Trigger *não* são triggers do tipo que você cria com `CREATE TRIGGER`.

Igualdades envolvidas em funções `trigcond()` não são predicados de primeira classe para o Query Optimizer. A maioria das otimizações não pode lidar com predicados que podem ser ativados e desativados no momento da execução da Query, então eles assumem que qualquer `trigcond(X)` é uma função desconhecida e a ignoram. Igualdades com trigger podem ser usadas por estas otimizações:

* Otimizações de referência: `trigcond(X=Y [OR Y IS NULL])` pode ser usado para construir acessos de tabela `ref`, `eq_ref` ou `ref_or_null`.

* Motores de execução de subquery baseados em Index lookup: `trigcond(X=Y)` pode ser usado para construir acessos `unique_subquery` ou `index_subquery`.

* Gerador de condição de tabela: Se a subquery for um JOIN de várias tabelas, a condição triggered é verificada o mais rápido possível.

Quando o Optimizer usa uma condição triggered para criar algum tipo de acesso baseado em Index lookup (como nos dois primeiros itens da lista anterior), ele deve ter uma estratégia de fallback para o caso em que a condição é desativada. Esta estratégia de fallback é sempre a mesma: Realizar um full table scan. Na saída do `EXPLAIN`, o fallback aparece como `Full scan on NULL key` na coluna `Extra`:

```sql
mysql> EXPLAIN SELECT t1.col1,
       t1.col1 IN (SELECT t2.key1 FROM t2 WHERE t2.col2=t1.col2) FROM t1\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
        ...
*************************** 2. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t2
         type: index_subquery
possible_keys: key1
          key: key1
      key_len: 5
          ref: func
         rows: 2
        Extra: Using where; Full scan on NULL key
```

Se você executar `EXPLAIN` seguido por `SHOW WARNINGS`, você pode ver a condição triggered:

```sql
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: select `test`.`t1`.`col1` AS `col1`,
         <in_optimizer>(`test`.`t1`.`col1`,
         <exists>(<index_lookup>(<cache>(`test`.`t1`.`col1`) in t2
         on key1 checking NULL
         where (`test`.`t2`.`col2` = `test`.`t1`.`col2`) having
         trigcond(<is_not_null_test>(`test`.`t2`.`key1`))))) AS
         `t1.col1 IN (select t2.key1 from t2 where t2.col2=t1.col2)`
         from `test`.`t1`
```

O uso de condições triggered tem algumas implicações de desempenho. Uma expressão `NULL IN (SELECT ...)` agora pode causar um full table scan (o que é lento) quando antes não causava. Este é o preço pago por resultados corretos (o objetivo da estratégia de condição de trigger é melhorar a conformidade, não a velocidade).

Para subqueries de múltiplas tabelas, a execução de `NULL IN (SELECT ...)` é particularmente lenta porque o Join Optimizer não otimiza para o caso em que a expressão externa é `NULL`. Ele assume que as avaliações de subquery com `NULL` no lado esquerdo são muito raras, mesmo que existam estatísticas que indiquem o contrário. Por outro lado, se a expressão externa puder ser `NULL` mas nunca for de fato, não há penalidade de desempenho.

Para ajudar o Query Optimizer a executar suas Queries melhor, use estas sugestões:

* Declare uma coluna como `NOT NULL` se ela realmente for. Isso também auxilia outros aspectos do Optimizer, simplificando o teste de condição para a coluna.

* Se você não precisa distinguir um resultado de subquery `NULL` de `FALSE`, você pode facilmente evitar o caminho de execução lento. Substitua uma comparação que se parece com isto:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ...)
  ```

  por esta expressão:

  ```sql
  (outer_expr IS NOT NULL) AND (outer_expr IN (SELECT inner_expr FROM ...))
  ```

  Assim, `NULL IN (SELECT ...)` nunca é avaliado porque o MySQL para de avaliar as partes `AND` assim que o resultado da expressão fica claro.

  Outra reescrita possível:

  ```sql
  EXISTS (SELECT inner_expr FROM ...
          WHERE inner_expr=outer_expr)
  ```

  Isso se aplicaria quando você não precisa distinguir resultados de subquery `NULL` de `FALSE`, caso em que você pode, na verdade, desejar `EXISTS`.

A flag `subquery_materialization_cost_based` da variável de sistema `optimizer_switch` permite controlar a escolha entre a materialização da subquery e a transformação de subquery `IN`-para-`EXISTS`. Veja Seção 8.9.2, “Otimizações Alternáveis”.