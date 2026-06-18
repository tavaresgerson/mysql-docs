### 10.8.3 Formato de saída do EXPLAIN estendido

A declaração `EXPLAIN` produz informações extras (extensões) que não fazem parte da saída `EXPLAIN`, mas podem ser visualizadas ao emitir uma declaração `SHOW WARNINGS` após `EXPLAIN`. A partir do MySQL 8.0.12, as informações extensas estão disponíveis para as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. Antes do 8.0.12, as informações extensas estão disponíveis apenas para as declarações `SELECT`.

O valor `Message` na saída `SHOW WARNINGS` exibe como o otimizador qualifica os nomes de tabelas e colunas na declaração `SELECT`, como o `SELECT` parece após a aplicação das regras de reescrita e otimização, e, possivelmente, outras notas sobre o processo de otimização.

A exibição de informações estendida com uma declaração `SHOW WARNINGS` após `EXPLAIN` é produzida apenas para declarações `SELECT`. `SHOW WARNINGS` exibe um resultado vazio para outras declarações explicáveis (`DELETE`, `INSERT`, `REPLACE` e `UPDATE`).

Aqui está um exemplo de saída `EXPLAIN` estendida:

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

Como a declaração exibida por `SHOW WARNINGS` pode conter marcadores especiais para fornecer informações sobre a reescrita de consultas ou ações do otimizador, a declaração não é necessariamente SQL válida e não está destinada a ser executada. A saída também pode incluir linhas com valores de `Message` que fornecem notas explicativas não SQL adicionais sobre as ações tomadas pelo otimizador.

A lista a seguir descreve marcadores especiais que podem aparecer na saída estendida exibida pelo `SHOW WARNINGS`:

- `<auto_key>`

  Uma chave gerada automaticamente para uma tabela temporária.

- `<cache>(expr)`

  A expressão (como uma subconsulta escalar) é executada uma vez e o valor resultante é salvo na memória para uso posterior. Para resultados que consistem em vários valores, uma tabela temporária pode ser criada e `<temporary table>` é exibida em vez disso.

- `<exists>(query fragment)`

  O predicado da subconsulta é convertido em um predicado `EXISTS` e a subconsulta é transformada para que possa ser usada junto com o predicado `EXISTS`.

- `<in_optimizer>(query fragment)`

  Este é um objeto otimizador interno sem importância para o usuário.

- `<index_lookup>(query fragment)`

  O fragmento da consulta é processado usando uma pesquisa de índice para encontrar as linhas qualificadas.

- `<if>(condition, expr1, expr2)`

  Se a condição for verdadeira, avalie para `expr1`, caso contrário, `expr2`.

- `<is_not_null_test>(expr)`

  Um teste para verificar se a expressão não avalia para `NULL`.

- `<materialize>(query fragment)`

  A materialização de subconsultas é usada.

- `` `materialized-subquery`.col_name ``

  Uma referência à coluna `col_name` em uma tabela temporária interna materializada para armazenar o resultado da avaliação de uma subconsulta.

- `<primary_index_lookup>(query fragment)`

  O fragmento da consulta é processado usando uma pesquisa de chave primária para encontrar as linhas qualificadas.

- `<ref_null_helper>(expr)`

  Este é um objeto otimizador interno sem importância para o usuário.

- `/* select#N */ select_stmt`

  O `SELECT` está associado à linha na saída não estendida `EXPLAIN` que tem um valor de `id` de `N`.

- `outer_tables semi join (inner_tables)`

  Uma operação de semijoin. `inner_tables` mostra as tabelas que não foram extraídas. Veja a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Semijoin”.

- `<temporary table>`

  Isso representa uma tabela temporária interna criada para armazenar um resultado intermediário.

Quando algumas tabelas são do tipo `const` ou `system`, expressões que envolvem colunas dessas tabelas são avaliadas precocemente pelo otimizador e não fazem parte da declaração exibida. No entanto, com `FORMAT=JSON`, alguns acessos à tabela `const` são exibidos como um acesso `ref` que usa um valor constante.
