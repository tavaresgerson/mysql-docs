#### 10.2.2.3 Otimizando subconsultas com a estratégia EXISTS

Algumas otimizações são aplicáveis a comparações que utilizam o operador `IN` (ou `=ANY`) para testar os resultados de subconsultas. Esta seção discute essas otimizações, particularmente em relação aos desafios que os valores `NULL` apresentam. A última parte da discussão sugere como você pode ajudar o otimizador.

Considere a seguinte comparação de subconsultas:

```
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

O MySQL avalia as consultas "de fora para dentro". Ou seja, ele primeiro obtém o valor da expressão externa `outer_expr`, e depois executa a subconsulta e captura as linhas que ela produz.

Uma otimização muito útil é "informar" a subconsulta que as únicas linhas de interesse são aquelas onde a expressão interna `inner_expr` é igual a `outer_expr`. Isso é feito empurrando uma igualdade apropriada para a cláusula `WHERE` da subconsulta para torná-la mais restritiva. A comparação convertida parece assim:

```
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
```

Após a conversão, o MySQL pode usar a igualdade empurrada para limitar o número de linhas que ele deve examinar para avaliar a subconsulta.

De forma mais geral, uma comparação dos valores de `N` com uma subconsulta que retorna linhas com valores de `N` está sujeita à mesma conversão. Se `oe_i` e `ie_i` representarem os valores correspondentes das expressões externa e interna, essa comparação da subconsulta:

```
(oe_1, ..., oe_N) IN
  (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

Se torna:

```
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND oe_1 = ie_1
                          AND ...
                          AND oe_N = ie_N)
```

Para simplificar, a discussão a seguir assume um único par de valores de expressão externa e interna.

A estratégia de "empurrar para baixo" descrita acima funciona se uma dessas condições for verdadeira:

- `outer_expr` e `inner_expr` não podem ser `NULL`.

- Você não precisa distinguir os resultados das subconsultas `NULL` de `FALSE`. Se a subconsulta for parte de uma expressão `OR` ou `AND` na cláusula `WHERE`, o MySQL assume que você não se importa. Outra situação em que o otimizador percebe que os resultados das subconsultas `NULL` e `FALSE` não precisam ser distinguidos é essa construção:

  ```
  ... WHERE outer_expr IN (subquery)
  ```

  Neste caso, a cláusula `WHERE` rejeita a linha se `IN (subquery)` retornar `NULL` ou `FALSE`.

Suponha que `outer_expr` seja conhecido como um valor não `NULL` e que a subconsulta não produza uma linha na qual `outer_expr` = `inner_expr`. Então, `outer_expr IN (SELECT ...)` é avaliado da seguinte forma:

- `NULL`, se o `SELECT` produzir qualquer linha onde `inner_expr` é `NULL`

- `FALSE`, se o `SELECT` produz apenas valores não `NULL` ou não produz nada

Nessa situação, a abordagem de procurar linhas com `outer_expr = inner_expr` já não é válida. É necessário procurar tais linhas, mas, se nenhuma for encontrada, também procure linhas onde `inner_expr` é `NULL`. Grosso modo, a subconsulta pode ser convertida em algo como:

```
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND
        (outer_expr=inner_expr OR inner_expr IS NULL))
```

A necessidade de avaliar a condição extra `IS NULL` é a razão pela qual o MySQL tem o método de acesso `ref_or_null`:

```
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

A situação é muito pior quando `outer_expr` pode ser `NULL`. De acordo com a interpretação SQL de `NULL` como “valor desconhecido”, `NULL IN (SELECT inner_expr ...)` deve ser avaliado como:

- `NULL`, se o `SELECT` produzir quaisquer linhas

- `FALSE`, se o `SELECT` não produzir nenhuma linha

Para uma avaliação adequada, é necessário verificar se o `SELECT` produziu alguma linha, para que o `outer_expr = inner_expr` não possa ser impulsionado para a subconsulta. Esse é um problema porque muitas subconsultas do mundo real tornam-se muito lentas, a menos que a igualdade possa ser impulsionada.

Essencialmente, deve haver diferentes maneiras de executar a subconsulta, dependendo do valor de `outer_expr`.

O otimizador escolhe a conformidade com o SQL em vez da velocidade, portanto, ele leva em conta a possibilidade de que `outer_expr` possa ser `NULL`:

- Se `outer_expr` for `NULL`, para avaliar a expressão a seguir, é necessário executar o `SELECT` para determinar se ele produz quaisquer linhas:

  ```
  NULL IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  É necessário executar o `SELECT` original aqui, sem quaisquer igualdades empurradas para baixo do tipo mencionado anteriormente.

- Por outro lado, quando `outer_expr` não é `NULL`, é absolutamente essencial que essa comparação:

  ```
  outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

  Converta-se a esta expressão que utiliza uma condição deslocada para baixo:

  ```
  EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
  ```

  Sem essa conversão, as subconsultas são lentas.

Para resolver o dilema de se deve ou não aplicar condições na subconsulta, as condições são envolvidas em funções "trigger". Assim, uma expressão da seguinte forma:

```
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

É convertido em:

```
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(outer_expr=inner_expr))
```

De forma mais geral, se a comparação da subconsulta for baseada em vários pares de expressões externas e internas, a conversão leva essa comparação:

```
(oe_1, ..., oe_N) IN (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

E converte-o para esta expressão:

```
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(oe_1=ie_1)
                          AND ...
                          AND trigcond(oe_N=ie_N)
       )
```

Cada `trigcond(X)` é uma função especial que avalia os seguintes valores:

- `X` quando a expressão externa "ligada" `oe_i` não é `NULL`

- `TRUE` quando a expressão externa "ligada" `oe_i` é `NULL`

Nota

As funções de disparo *não* são disparadores do tipo que você cria com `CREATE TRIGGER`.

As igualdades que estão envolvidas em funções `trigcond()` não são predicados de primeira classe para o otimizador de consultas. A maioria das otimizações não pode lidar com predicados que podem ser ativados e desativados no momento da execução da consulta, então elas assumem que qualquer `trigcond(X)` é uma função desconhecida e a ignoram. As igualdades disparadas podem ser usadas por essas otimizações:

- O otimização de referência: `trigcond(X=Y [OR Y IS NULL])` pode ser usado para construir acessos de tabela `ref`, `eq_ref` ou `ref_or_null`.

- Motores de execução de subconsultas baseados em busca de índice: `trigcond(X=Y)` pode ser usado para construir acessos `unique_subquery` ou `index_subquery`.

- Gerador de condições de tabela: Se a subconsulta for uma junção de várias tabelas, a condição acionada é verificada o mais rápido possível.

Quando o otimizador usa uma condição acionada para criar algum tipo de acesso baseado em pesquisa de índice (como nos dois primeiros itens da lista anterior), ele deve ter uma estratégia de fallback para o caso em que a condição seja desativada. Essa estratégia de fallback é sempre a mesma: fazer uma varredura completa da tabela. Na saída `EXPLAIN`, o fallback aparece como `Full scan on NULL key` na coluna `Extra`:

```
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

Se você executar `EXPLAIN` seguido de `SHOW WARNINGS`, você poderá ver a condição acionada:

```
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

O uso de condições desencadeadas tem algumas implicações de desempenho. Uma expressão `NULL IN (SELECT ...)` agora pode causar uma varredura completa da tabela (o que é lento) quando anteriormente não o fazia. Esse é o preço pago por resultados corretos (o objetivo da estratégia de condição desencadeada é melhorar a conformidade, não a velocidade).

Para subconsultas de múltiplas tabelas, a execução de `NULL IN (SELECT ...)` é particularmente lenta porque o otimizador de junção não otimiza para o caso em que a expressão externa é `NULL`. Ele assume que as avaliações de subconsultas com `NULL` no lado esquerdo são muito raras, mesmo que existam estatísticas que indiquem o contrário. Por outro lado, se a expressão externa pode ser `NULL`, mas nunca realmente for, não há penalidade de desempenho.

Para ajudar o otimizador de consultas a executar suas consultas de forma mais eficiente, use essas sugestões:

- Declare uma coluna como `NOT NULL` se realmente for. Isso também ajuda outros aspectos do otimizador ao simplificar a verificação de condições para a coluna.

- Se você não precisa distinguir entre o resultado de uma subconsulta `NULL` e `FALSE`, você pode facilmente evitar o caminho de execução lento. Substitua uma comparação que parece assim:

  ```
  outer_expr [NOT] IN (SELECT inner_expr FROM ...)
  ```

  com esta expressão:

  ```
  (outer_expr IS NOT NULL) AND (outer_expr [NOT] IN (SELECT inner_expr FROM ...))
  ```

  Então, `NULL IN (SELECT ...)` nunca é avaliado porque o MySQL para de avaliar as partes de `AND` assim que o resultado da expressão estiver claro.

  Outra possível reescrita:

  ```
  [NOT] EXISTS (SELECT inner_expr FROM ...
          WHERE inner_expr=outer_expr)
  ```

A bandeira `subquery_materialization_cost_based` da variável de sistema `optimizer_switch` permite controlar a escolha entre materialização de subconsultas e transformação de subconsultas de `IN` para `EXISTS`. Veja a Seção 10.9.2, “Otimizações Desconectables”.
