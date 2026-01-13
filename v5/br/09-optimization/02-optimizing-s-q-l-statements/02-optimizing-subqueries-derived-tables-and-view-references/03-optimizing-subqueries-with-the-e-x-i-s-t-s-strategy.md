#### 8.2.2.3 Otimizando subconsultas com a estratégia EXISTS

Algumas otimizações são aplicáveis a comparações que utilizam o operador `IN` (ou `=ANY`) para testar os resultados de subconsultas. Esta seção discute essas otimizações, particularmente em relação aos desafios que os valores `NULL` apresentam. A última parte da discussão sugere como você pode ajudar o otimizador.

Considere a seguinte comparação de subconsultas:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

O MySQL avalia as consultas "de fora para dentro". Ou seja, ele primeiro obtém o valor da expressão externa *`outer_expr`*, e depois executa a subconsulta e captura as linhas que ela produz.

Uma otimização muito útil é "informar" a subconsulta que as únicas linhas de interesse são aquelas onde a expressão interna *`inner_expr`* é igual a *`outer_expr`*. Isso é feito empurrando uma comparação de igualdade apropriada para a cláusula `WHERE` da subconsulta para torná-la mais restritiva. A comparação convertida parece assim:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
```

Após a conversão, o MySQL pode usar a igualdade empurrada para limitar o número de linhas que ele deve examinar para avaliar a subconsulta.

De forma mais geral, uma comparação de valores de *`N`* com uma subconsulta que retorna linhas com valores de *`N`* está sujeita à mesma conversão. Se *`oe_i`* e *`ie_i`* representam os valores correspondentes das expressões externas e internas, essa comparação da subconsulta:

```sql
(oe_1, ..., oe_N) IN
  (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

Se torna:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND oe_1 = ie_1
                          AND ...
                          AND oe_N = ie_N)
```

Para simplificar, a discussão a seguir assume um único par de valores de expressão externa e interna.

A conversão descrita acima tem suas limitações. Ela só é válida se ignorarmos possíveis valores `NULL`. Ou seja, a estratégia de "pushdown" funciona enquanto ambas essas condições forem verdadeiras:

- *`outer_expr`* e *`inner_expr`* não podem ser `NULL`.

- Você não precisa distinguir entre os resultados de subconsultas `NULL` e `FALSE`. Se a subconsulta for parte de uma expressão `OR` ou `AND` na cláusula `WHERE`, o MySQL assume que você não se importa. Outra situação em que o otimizador percebe que os resultados de subconsultas `NULL` e `FALSE` não precisam ser distinguidos é essa construção:

  ```sql
  ... WHERE outer_expr IN (subquery)
  ```

  Nesse caso, a cláusula `WHERE` rejeita a linha se `IN (subquery)` retornar `NULL` ou `FALSE`.

Quando uma ou ambas essas condições não são atendidas, a otimização se torna mais complexa.

Suponha que *`outer_expr`* seja conhecido como um valor não `NULL`, mas a subconsulta não produza uma linha em que *`outer_expr`* = *`inner_expr`*. Então, `outer_expr IN (SELECT ...)` é avaliado da seguinte forma:

- `NULL`, se o `SELECT` produzir qualquer linha onde *`inner_expr`* é `NULL`

- `FALSE`, se o `SELECT` produzir apenas valores não `NULL` ou produzir nada

Nessa situação, a abordagem de procurar linhas com `outer_expr = inner_expr` já não é válida. É necessário procurar tais linhas, mas, se nenhuma for encontrada, também procure linhas onde *`inner_expr`* é `NULL`. Grosso modo, a subconsulta pode ser convertida em algo como:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND
        (outer_expr=inner_expr OR inner_expr IS NULL))
```

A necessidade de avaliar a condição extra `IS NULL` é a razão pela qual o MySQL tem o método de acesso `ref_or_null`:

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

Os métodos de acesso específicos para subconsultas `unique_subquery` e `index_subquery` também têm variantes de “ou `NULL`”.

A condição adicional `OR ... IS NULL` torna a execução da consulta um pouco mais complicada (e algumas otimizações dentro da subconsulta tornam-se inaplicáveis), mas, geralmente, isso é tolerável.

A situação é muito pior quando *`outer_expr`* pode ser `NULL`. De acordo com a interpretação SQL de `NULL` como "valor desconhecido", `NULL IN (SELECT inner_expr ...)` deve ser avaliado como:

- `NULL`, se o `SELECT` produzir qualquer linha

- `FALSE`, se o `SELECT` não produzir nenhuma linha

Para uma avaliação adequada, é necessário verificar se a consulta `SELECT` produziu alguma linha, portanto, `outer_expr = inner_expr` não pode ser empurrado para baixo na subconsulta. Esse é um problema porque muitas subconsultas do mundo real tornam-se muito lentas, a menos que a igualdade possa ser empurrada para baixo.

Essencialmente, deve haver diferentes maneiras de executar a subconsulta, dependendo do valor de *`outer_expr`*.

O otimizador escolhe a conformidade com SQL em vez de velocidade, portanto, ele leva em conta a possibilidade de que *`outer_expr`* possa ser `NULL`:

- Se *`outer_expr`* for `NULL`, para avaliar a expressão seguinte, é necessário executar o `SELECT` para determinar se ele produz alguma linha:

  ```sql
  NULL IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  É necessário executar o `SELECT` original aqui, sem quaisquer igualdades empurradas para baixo do tipo mencionado anteriormente.

- Por outro lado, quando *`outer_expr`* não é `NULL`, é absolutamente essencial que essa comparação:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  Converta-se a esta expressão que utiliza uma condição deslocada para baixo:

  ```sql
  EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
  ```

  Sem essa conversão, as subconsultas são lentas.

Para resolver o dilema de se deve ou não aplicar condições na subconsulta, as condições são envolvidas em funções "trigger". Assim, uma expressão da seguinte forma:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

É convertido em:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(outer_expr=inner_expr))
```

De forma mais geral, se a comparação da subconsulta for baseada em vários pares de expressões externas e internas, a conversão leva essa comparação:

```sql
(oe_1, ..., oe_N) IN (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

E converte-o para esta expressão:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(oe_1=ie_1)
                          AND ...
                          AND trigcond(oe_N=ie_N)
       )
```

Cada `trigcond(X)` é uma função especial que retorna os seguintes valores:

- *`X`* quando a expressão externa "ligada" *`oe_i`* não for `NULL`

- `TRUE` quando a expressão externa `linked` *`oe_i`* for `NULL`

Nota

As funções de disparo *não* são disparadores do tipo que você cria com `CREATE TRIGGER`.

As igualdades que estão envolvidas nas funções `trigcond()` não são predicados de primeira classe para o otimizador de consultas. A maioria das otimizações não consegue lidar com predicados que podem ser ativados ou desativados no momento da execução da consulta, então elas assumem que qualquer `trigcond(X)` é uma função desconhecida e a ignoram. As igualdades disparadas podem ser usadas por essas otimizações:

- As otimizações de referência: `trigcond(X=Y [OU Y É NULL])` podem ser usadas para criar acessos de tabela `ref`, `eq_ref` ou `ref_or_null`.
- Motores de execução de subconsultas baseados em busca de índice: `trigcond(X=Y)` pode ser usado para construir acessos `unique_subquery` ou `index_subquery`.
- Gerador de condições de tabela: Se a subconsulta for uma junção de várias tabelas, a condição acionada é verificada o mais rápido possível.

Quando o otimizador usa uma condição acionada para criar algum tipo de acesso baseado em pesquisa de índice (como nos dois primeiros itens da lista anterior), ele deve ter uma estratégia de fallback para o caso em que a condição seja desativada. Essa estratégia de fallback é sempre a mesma: fazer uma varredura completa da tabela. Na saída `EXPLAIN`, o fallback aparece como `Varredura completa em chave NULL` na coluna `Extra`:

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

Se você executar `EXPLAIN` seguido de `SHOW WARNINGS`, você poderá ver a condição desencadeada:

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

O uso de condições desencadeadas tem algumas implicações de desempenho. Uma expressão `NULL IN (SELECT ...)` agora pode causar uma varredura completa da tabela (o que é lento) quando anteriormente não o fazia. Esse é o preço pago por resultados corretos (o objetivo da estratégia de condição de gatilho é melhorar a conformidade, não a velocidade).

Para subconsultas de múltiplas tabelas, a execução de `NULL IN (SELECT ...)` é particularmente lenta porque o otimizador de junção não otimiza para o caso em que a expressão externa é `NULL`. Ele assume que as avaliações da subconsulta com `NULL` no lado esquerdo são muito raras, mesmo que existam estatísticas que indiquem o contrário. Por outro lado, se a expressão externa pode ser `NULL`, mas nunca realmente for, não há penalidade de desempenho.

Para ajudar o otimizador de consultas a executar suas consultas de forma mais eficiente, use essas sugestões:

- Declare uma coluna como `NOT NULL` se realmente for. Isso também ajuda outros aspectos do otimizador ao simplificar a verificação de condições para a coluna.

- Se você não precisa distinguir entre o resultado de uma subconsulta `NULL` e `FALSE`, você pode facilmente evitar o caminho de execução lento. Substitua uma comparação que parece assim:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ...)
  ```

  com esta expressão:

  ```sql
  (outer_expr IS NOT NULL) AND (outer_expr IN (SELECT inner_expr FROM ...))
  ```

  Então, `NULL IN (SELECT ...)` nunca é avaliado porque o MySQL para de avaliar as partes `AND` assim que o resultado da expressão estiver claro.

  Outra possível reescrita:

  ```sql
  EXISTS (SELECT inner_expr FROM ...
          WHERE inner_expr=outer_expr)
  ```

  Isso se aplicaria quando você não precisa distinguir entre os resultados de subconsultas `NULL` e `FALSE`, nesse caso, você pode realmente querer `EXISTS`.

A flag `subquery_materialization_cost_based` da variável de sistema `optimizer_switch` permite controlar a escolha entre a materialização de subconsultas e a transformação de subconsultas `IN` para `EXISTS`. Veja a Seção 8.9.2, “Otimizações Desconectables”.
