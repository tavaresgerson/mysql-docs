### 10.8.3 Formato de Saída Extendida do `EXPLAIN`

A instrução `EXPLAIN` produz informações extras (extendidas) que não fazem parte da saída do `EXPLAIN`, mas podem ser visualizadas emitindo uma instrução `SHOW WARNINGS` após `EXPLAIN`. As informações extendidas estão disponíveis para as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

O valor `Message` na saída do `SHOW WARNINGS` exibe como o otimizador qualifica os nomes de tabelas e colunas na instrução `SELECT`, como a instrução `SELECT` parece após a aplicação das regras de reescrita e otimização, e possivelmente outras notas sobre o processo de otimização.

A informação extendida exibida com uma instrução `SHOW WARNINGS` após `EXPLAIN` é produzida apenas para instruções `SELECT`. O `SHOW WARNINGS` exibe um resultado vazio para outras instruções explicáveis (`DELETE`, `INSERT`, `REPLACE` e `UPDATE`).

Aqui está um exemplo de saída extendida do `EXPLAIN`:

```
mysql> EXPLAIN
       SELECT t1.a, t1.a IN (SELECT t2.a FROM t2) FROM t1\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
         type: index
possible_keys: NULL
          key: PRIMARY
      key_len: 4
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: Using index
*************************** 2. row ***************************
           id: 2
  select_type: SUBQUERY
        table: t2
         type: index
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using index
2 rows in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`a` AS `a`,
         <in_optimizer>(`test`.`t1`.`a`,`test`.`t1`.`a` in
         ( <materialize> (/* select#2 */ select `test`.`t2`.`a`
         from `test`.`t2` where 1 having 1 ),
         <primary_index_lookup>(`test`.`t1`.`a` in
         <temporary table> on <auto_key>
         where ((`test`.`t1`.`a` = `materialized-subquery`.`a`))))) AS `t1.a
         IN (SELECT t2.a FROM t2)` from `test`.`t1`
1 row in set (0.00 sec)
```

Como a instrução exibida pelo `SHOW WARNINGS` pode conter marcadores especiais para fornecer informações sobre a reescrita da consulta ou ações do otimizador, a instrução não é necessariamente SQL válida e não é destinada a ser executada. A saída também pode incluir linhas com valores `Message` que fornecem notas explicativas não SQL adicionais sobre as ações tomadas pelo otimizador.

A lista a seguir descreve marcadores especiais que podem aparecer na saída extendida exibida pelo `SHOW WARNINGS`:

* `<auto_key>`

  Uma chave gerada automaticamente para uma tabela temporária.
* `<cache>(expr)`

  A expressão (como uma subconsulta escalar) é executada uma vez e o valor resultante é salvo na memória para uso posterior. Para resultados consistindo de múltiplos valores, uma tabela temporária pode ser criada e `<tabela temporária>` é exibida em vez disso.
* `<exists>(query fragment)`

  O predicado da subconsulta é convertido em um predicado `EXISTS` e a subconsulta é transformada para que possa ser usada junto com o predicado `EXISTS`.
* `<in_optimizer>(query fragment)`

Este é um objeto otimizador interno sem significado para o usuário.
* `<index_lookup>(fragmento da consulta)`

  O fragmento da consulta é processado usando uma consulta de índice para encontrar linhas qualificadoras.
* `<if>(condição, expr1, expr2)`

  Se a condição for verdadeira, avalie para *`expr1`*, caso contrário, *`expr2`*.
* `<is_not_null_test>(expr)`

  Um teste para verificar se a expressão não avalia para `NULL`.
* `<materialize>(fragmento da consulta)`

  A materialização de subconsulta é usada.
* `` `materialized-subquery`.col_name ``

  Uma referência à coluna *`col_name`* em uma tabela temporária interna materializada para armazenar o resultado da avaliação de uma subconsulta.
* `<primary_index_lookup>(fragmento da consulta)`

  O fragmento da consulta é processado usando uma consulta de chave primária para encontrar linhas qualificadoras.
* `<ref_null_helper>(expr)`

  Este é um objeto otimizador interno sem significado para o usuário.
* `/* select#N */ select_stmt`

  O `SELECT` está associado à linha na saída `EXPLAIN` não estendida que tem um valor de `id` de *`N`*.
* `outer_tables semi join (inner_tables)`

  Uma operação de semijoin. *`inner_tables`* mostra as tabelas que não foram extraídas. Veja  Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Semijoin.
* `<tabela temporária>`

  Isso representa uma tabela temporária interna criada para cachear um resultado intermediário.

Quando algumas tabelas são do tipo `const` ou `system`, expressões que envolvem colunas dessas tabelas são avaliadas precocemente pelo otimizador e não fazem parte da declaração exibida. No entanto, com `FORMAT=JSON`, alguns acessos a tabelas `const` são exibidos como um acesso `ref` que usa um valor constante.