#### 10.2.1.4 Otimização de Conjunções Hash

Por padrão, o MySQL emprega junções hash sempre que possível. É possível controlar se as junções hash são empregadas usando uma das dicas de otimizador `BNL` e `NO_BNL`, ou definindo `block_nested_loop=on` ou `block_nested_loop=off` como parte da definição da variável de sistema do servidor optimizer_switch.

O MySQL emprega uma junção hash para qualquer consulta para a qual cada junção tenha uma condição de junção equi, e na qual não haja índices que possam ser aplicados a quaisquer condições de junção, como esta:

```
SELECT *
    FROM t1
    JOIN t2
        ON t1.c1=t2.c1;
```

Uma junção hash também pode ser usada quando há um ou mais índices que podem ser usados para predicados de uma única tabela.

No exemplo mostrado e nos exemplos restantes desta seção, assumimos que as três tabelas `t1`, `t2` e `t3` foram criadas usando as seguintes declarações:

```
CREATE TABLE t1 (c1 INT, c2 INT);
CREATE TABLE t2 (c1 INT, c2 INT);
CREATE TABLE t3 (c1 INT, c2 INT);
```

Você pode ver que uma junção hash está sendo empregada usando `EXPLAIN`, assim:

```
mysql> EXPLAIN
    -> SELECT * FROM t1
    ->     JOIN t2 ON t1.c1=t2.c1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t2
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using where; Using join buffer (hash join)
```

`EXPLAIN ANALYZE` também exibe informações sobre as junções hash usadas.

A junção hash também é usada para consultas que envolvem múltiplas junções, desde que pelo menos uma condição de junção para cada par de tabelas seja uma junção equi, como a consulta mostrada aqui:

```
SELECT * FROM t1
    JOIN t2 ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
    JOIN t3 ON (t2.c1 = t3.c1);
```

Em casos como o mostrado, que faz uso de uma junção interna, quaisquer condições extras que não sejam junções equi são aplicadas como filtros após a junção ser executada. (Para junções externas, como junções à esquerda, junções parciais e junções inversas, elas são impressas como parte da junção.) Isso pode ser visto aqui na saída de `EXPLAIN`:

```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT *
    ->     FROM t1
    ->     JOIN t2
    ->         ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
    ->     JOIN t3
    ->         ON (t2.c1 = t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join (t3.c1 = t1.c1)  (cost=1.05 rows=1)
    -> Table scan on t3  (cost=0.35 rows=1)
    -> Hash
        -> Filter: (t1.c2 < t2.c2)  (cost=0.70 rows=1)
            -> Inner hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
                -> Table scan on t2  (cost=0.35 rows=1)
                -> Hash
                    -> Table scan on t1  (cost=0.35 rows=1)
```

Como também pode ser visto na saída mostrada, múltiplas junções hash podem ser (e são) usadas para junções com múltiplas condições de junção equi.

Uma junção hash é usada mesmo se qualquer par de tabelas juncionadas não tiver pelo menos uma condição de junção equi, como mostrado aqui:

Uma união hash também é aplicada para um produto cartesiano — ou seja, quando nenhuma condição de junção é especificada, como mostrado aqui:

```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT * FROM t1
    ->     JOIN t2 ON (t1.c1 = t2.c1)
    ->     JOIN t3 ON (t2.c1 < t3.c1)\G
*************************** 1. row ***************************
EXPLAIN: -> Filter: (t1.c1 < t3.c1)  (cost=1.05 rows=1)
    -> Inner hash join (no condition)  (cost=1.05 rows=1)
        -> Table scan on t3  (cost=0.35 rows=1)
        -> Hash
            -> Inner hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
                -> Table scan on t2  (cost=0.35 rows=1)
                -> Hash
                    -> Table scan on t1  (cost=0.35 rows=1)
```

Não é necessário que a junção contenha pelo menos uma condição de junção equi para que uma união hash seja usada. Isso significa que os tipos de consultas que podem ser otimizados usando uniões hash incluem as seguintes (com exemplos):

* *Junção não equi interna*:

  ```
mysql> EXPLAIN FORMAT=TREE
    -> SELECT *
    ->     FROM t1
    ->     JOIN t2
    ->     WHERE t1.c2 > 50\G
*************************** 1. row ***************************
EXPLAIN: -> Inner hash join  (cost=0.70 rows=1)
    -> Table scan on t2  (cost=0.35 rows=1)
    -> Hash
        -> Filter: (t1.c2 > 50)  (cost=0.35 rows=1)
            -> Table scan on t1  (cost=0.35 rows=1)
```

* *Semijoin*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 JOIN t2 ON t1.c1 < t2.c1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Filter: (t1.c1 < t2.c1)  (cost=4.70 rows=12)
      -> Inner hash join (no condition)  (cost=4.70 rows=12)
          -> Table scan on t2  (cost=0.08 rows=6)
          -> Hash
              -> Table scan on t1  (cost=0.85 rows=6)
  ```

* *Antijoin*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1
      ->     WHERE t1.c1 IN (SELECT t2.c2 FROM t2)\G
  *************************** 1. row ***************************
  EXPLAIN: -> Hash semijoin (t2.c2 = t1.c1)  (cost=0.70 rows=1)
      -> Table scan on t1  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t2  (cost=0.35 rows=1)
  ```

* *Junção esquerda externa*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t2
      ->     WHERE NOT EXISTS (SELECT * FROM t1 WHERE t1.c1 = t2.c1)\G
  *************************** 1. row ***************************
  EXPLAIN: -> Hash antijoin (t1.c1 = t2.c1)  (cost=0.70 rows=1)
      -> Table scan on t2  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t1  (cost=0.35 rows=1)

  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1276
  Message: Field or reference 't3.t2.c1' of SELECT #2 was resolved in SELECT #1
  ```

* *Junção direita externa* (observe que o MySQL reescreve todas as junções externas direitas como junções externas esquerdas):

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 LEFT JOIN t2 ON t1.c1 = t2.c1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Left hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
      -> Table scan on t1  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t2  (cost=0.35 rows=1)
  ```

Por padrão, o MySQL emprega uniões hash sempre que possível. É possível controlar se as uniões hash são empregadas usando uma das dicas de otimizador `BNL` e `NO_BNL`.

O uso de memória por uniões hash pode ser controlado usando a variável de sistema `join_buffer_size`; uma união hash não pode usar mais memória do que essa quantidade. Quando a memória necessária para uma união hash excede a quantidade disponível, o MySQL lida com isso usando arquivos no disco. Se isso acontecer, você deve estar ciente de que a junção pode não ser bem-sucedida se uma união hash não puder caber na memória e criar mais arquivos do que o definido para `open_files_limit`. Para evitar tais problemas, faça uma das seguintes alterações:

* Aumente `join_buffer_size` para que a união hash não seja derramada para o disco.

* Aumente `open_files_limit`.

Os buffers para junções hash são alocados incrementalmente; assim, você pode definir `join_buffer_size` maior sem que consultas pequenas aloquem grandes quantidades de RAM, mas as junções externas alocam todo o buffer. As junções hash também são usadas para junções externas (incluindo antijunções e semijunções), então isso não é mais um problema.