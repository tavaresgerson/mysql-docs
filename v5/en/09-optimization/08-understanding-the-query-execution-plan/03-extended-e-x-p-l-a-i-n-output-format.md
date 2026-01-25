### 8.8.3 Formato de Saída EXPLAIN Estendido

Para comandos `SELECT`, o comando `EXPLAIN` produz informações extras ("estendidas") que não fazem parte da saída normal do `EXPLAIN`, mas podem ser visualizadas emitindo um comando `SHOW WARNINGS` após o `EXPLAIN`. O valor `Message` na saída do `SHOW WARNINGS` exibe como o optimizer qualifica nomes de tabelas e colunas no comando `SELECT`, como o `SELECT` se parece após a aplicação das regras de reescrita e otimização, e possivelmente outras notas sobre o processo de otimização.

A informação estendida, visualizável com um comando `SHOW WARNINGS` após o `EXPLAIN`, é produzida apenas para comandos `SELECT`. O `SHOW WARNINGS` exibe um resultado vazio para outros comandos passíveis de `EXPLAIN` (`DELETE`, `INSERT`, `REPLACE` e `UPDATE`).

Nota

Em versões mais antigas do MySQL, informações estendidas eram produzidas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade com versões anteriores, mas a saída estendida agora está habilitada por padrão, de modo que a palavra-chave `EXTENDED` é supérflua e deprecated (descontinuada). Seu uso resulta em um warning (aviso); espera-se que seja removida da sintaxe do `EXPLAIN` em uma futura release do MySQL.

Aqui está um exemplo da saída `EXPLAIN` estendida:

```sql
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

Como o comando exibido pelo `SHOW WARNINGS` pode conter marcadores especiais para fornecer informações sobre a reescrita da Query ou ações do optimizer, o comando não é necessariamente um SQL válido e não se destina a ser executado. A saída também pode incluir linhas com valores `Message` que fornecem notas explicativas adicionais (não-SQL) sobre ações tomadas pelo optimizer.

A lista a seguir descreve marcadores especiais que podem aparecer na saída estendida exibida pelo `SHOW WARNINGS`:

* `<auto_key>`

  Uma chave gerada automaticamente para uma temporary table.

* `<cache>(expr)`

  A expression (como uma scalar subquery) é executada uma vez e o valor resultante é salvo na memória para uso posterior. Para resultados que consistem em múltiplos valores, uma temporary table pode ser criada, e você pode ver `<temporary table>` em seu lugar.

* `<exists>(query fragment)`

  O subquery predicate é convertido para um `EXISTS` predicate e a subquery é transformada para que possa ser usada juntamente com o `EXISTS` predicate.

* `<in_optimizer>(query fragment)`

  Este é um objeto interno do optimizer sem significado para o usuário.

* `<index_lookup>(query fragment)`

  O fragmento da Query é processado usando um Index lookup para encontrar as linhas qualificadas.

* `<if>(condition, expr1, expr2)`

  Se a condição for verdadeira, avalia para *`expr1`*, caso contrário, *`expr2`*.

* `<is_not_null_test>(expr)`

  Um teste para verificar se a expression não avalia para `NULL`.

* `<materialize>(query fragment)`

  A materialização da subquery é utilizada.

* `` `materialized-subquery`.col_name ``

  Uma referência à coluna *`col_name`* em uma temporary table interna materializada para armazenar o resultado da avaliação de uma subquery.

* `<primary_index_lookup>(query fragment)`

  O fragmento da Query é processado usando um Primary Key lookup para encontrar as linhas qualificadas.

* `<ref_null_helper>(expr)`

  Este é um objeto interno do optimizer sem significado para o usuário.

* `/* select#N */ select_stmt`

  O `SELECT` está associado à linha na saída não estendida do `EXPLAIN` que possui um valor `id` de *`N`*.

* `outer_tables semi join (inner_tables)`

  Uma operação de semijoin. *`inner_tables`* mostra as tabelas que não foram puxadas (pulled out). Veja a Seção 8.2.2.1, “Otimizando Subqueries, Derived Tables e Referências de View com Semijoin Transformations”.

* `<temporary table>`

  Isto representa uma temporary table interna criada para fazer cache de um resultado intermediário.

Quando algumas tabelas são do tipo `const` ou `system`, expressions envolvendo colunas dessas tabelas são avaliadas precocemente pelo optimizer e não fazem parte do comando exibido. No entanto, com `FORMAT=JSON`, alguns acessos a tabelas `const` são exibidos como um acesso `ref` que usa um valor const.