### 8.8.3 Formato de saída do EXPLAIN estendido

Para as instruções `SELECT`, a instrução `EXPLAIN` produz informações extras (extensões) que não fazem parte da saída `EXPLAIN`, mas podem ser visualizadas ao emitir uma instrução `SHOW WARNINGS` após `EXPLAIN`. O valor `Message` na saída `SHOW WARNINGS` exibe como o otimizador qualifica os nomes da tabela e das colunas na instrução `SELECT`, como a instrução `SELECT` parece após a aplicação das regras de reescrita e otimização, e, possivelmente, outras notas sobre o processo de otimização.

A exibição de informações estendida com uma declaração `SHOW WARNINGS` após `EXPLAIN` é produzida apenas para instruções `SELECT`. `SHOW WARNINGS` exibe um resultado vazio para outras instruções explicáveis (`DELETE`, `INSERT`, `REPLACE` e `UPDATE`).

Nota

Em versões mais antigas do MySQL, as informações extensas eram geradas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída estendida agora está habilitada por padrão, então a palavra-chave `EXTENDED` é supérflua e desatualizada. Seu uso resulta em um aviso; espere que ele seja removido da sintaxe `EXPLAIN` em uma futura versão do MySQL.

Aqui está um exemplo de saída de `EXPLAIN` estendida:

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

Como a declaração exibida pelo `SHOW WARNINGS` pode conter marcadores especiais para fornecer informações sobre a reescrita de consultas ou ações do otimizador, a declaração não é necessariamente SQL válida e não está destinada a ser executada. A saída também pode incluir linhas com valores de `Message` que fornecem notas explicativas não SQL adicionais sobre as ações tomadas pelo otimizador.

A lista a seguir descreve marcadores especiais que podem aparecer na saída ampliada exibida pelo `SHOW WARNINGS`:

- `<auto_key>`

  Uma chave gerada automaticamente para uma tabela temporária.

- `<cache>(expr)`

  A expressão (como uma subconsulta escalar) é executada uma vez e o valor resultante é salvo na memória para uso posterior. Para resultados que consistem em vários valores, pode ser criada uma tabela temporária e você pode ver `<tabela temporária>` em vez disso.

- `<existe>(fragmento da consulta)`

  O predicado da subconsulta é convertido em um predicado `EXISTS` e a subconsulta é transformada para que possa ser usada junto com o predicado `EXISTS`.

- `<in_optimizer>(fragmento da consulta)`

  Este é um objeto otimizador interno sem importância para o usuário.

- `<index_lookup>(fragmento da consulta)`

  O fragmento da consulta é processado usando uma pesquisa de índice para encontrar as linhas qualificadas.

- `<if>(condição, expr1, expr2)`

  Se a condição for verdadeira, avalie *`expr1`*, caso contrário, *`expr2`*.

- `<is_not_null_test>(expr)`

  Um teste para verificar se a expressão não avalia como `NULL`.

- `<materializar>(fragmento da consulta)`

  A materialização de subconsultas é usada.

- "materializado-subquery".col\_name

  Uma referência à coluna *`col_name`* em uma tabela temporária interna materializada para armazenar o resultado da avaliação de uma subconsulta.

- `<primary_index_lookup>(fragmento da consulta)`

  O fragmento da consulta é processado usando uma pesquisa de chave primária para encontrar as linhas qualificadas.

- `<ref_null_helper>(expr)`

  Este é um objeto otimizador interno sem importância para o usuário.

- `/* select#N */ select_stmt`

  O `SELECT` está associado à linha na saída `EXPLAIN` não estendida que tem um valor `id` de *`N`*.

- `join externo (tarefas internas)`

  Uma operação de semijoin. *`inner_tables`* mostra as tabelas que não foram extraídas. Veja a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de semijoin”.

- \<tabela temporária>

  Isso representa uma tabela temporária interna criada para armazenar um resultado intermediário.

Quando algumas tabelas são do tipo `const` ou `system`, as expressões que envolvem colunas dessas tabelas são avaliadas precocemente pelo otimizador e não fazem parte da declaração exibida. No entanto, com `FORMAT=JSON`, alguns acessos à tabela `const` são exibidos como um acesso `ref` que usa um valor constante.
