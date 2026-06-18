#### 10.2.1.4 Otimização da Conjunção Hash

Por padrão, o MySQL (8.0.18 e versões posteriores) utiliza junções hash sempre que possível. É possível controlar se as junções hash são utilizadas usando uma das dicas de otimizador `BNL` e `NO_BNL`, ou definindo `block_nested_loop=on` ou `block_nested_loop=off` como parte da configuração da variável de sistema otimizador\_switch.

Nota

O MySQL 8.0.18 suportava a definição de uma bandeira `hash_join` em `optimizer_switch`, bem como as dicas de otimização `HASH_JOIN` e `NO_HASH_JOIN`. No MySQL 8.0.19 e versões posteriores, nenhuma dessas opções tem mais efeito.

A partir do MySQL 8.0.18, o MySQL utiliza uma união por hash para qualquer consulta para a qual cada junção tenha uma condição de junção equi, e na qual não haja índices que possam ser aplicados a quaisquer condições de junção, como esta:

```
SELECT *
    FROM t1
    JOIN t2
        ON t1.c1=t2.c1;
```

Uma união hash também pode ser usada quando houver um ou mais índices que possam ser usados para predicados de uma única tabela.

Uma união hash é geralmente mais rápida e é destinada a ser usada nesses casos, em vez do algoritmo de junção em laço aninhado de blocos (veja o Algoritmo de Junção em Laço Aninhado de Blocos), empregado em versões anteriores do MySQL. A partir do MySQL 8.0.20, o suporte ao laço aninhado de blocos é removido e o servidor emprega uma junção hash sempre que um laço aninhado de blocos teria sido usado anteriormente.

No exemplo mostrado anteriormente e nos exemplos restantes desta seção, assumimos que as três tabelas `t1`, `t2` e `t3` foram criadas usando as seguintes declarações:

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

(Antes do MySQL 8.0.20, era necessário incluir a opção `FORMAT=TREE` para verificar se as junções de hash estavam sendo usadas para uma junção específica.)

`EXPLAIN ANALYZE` também exibe informações sobre as junções de hash usadas.

A união hash também é usada em consultas que envolvem múltiplas junções, desde que pelo menos uma condição de junção para cada par de tabelas seja uma junção equi, como a consulta mostrada aqui:

```
SELECT * FROM t1
    JOIN t2 ON (t1.c1 = t2.c1 AND t1.c2 < t2.c2)
    JOIN t3 ON (t2.c1 = t3.c1);
```

Em casos como o mostrado, que utiliza uma junção interna, quaisquer condições adicionais que não sejam junções equi são aplicadas como filtros após a execução da junção. (Para junções externas, como junções à esquerda, junções semijoin e junções anti, elas são impressas como parte da junção.) Isso pode ser visto aqui na saída de `EXPLAIN`:

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

Como também pode ser visto na saída mostrada agora, junções de hash múltiplas podem ser (e são) usadas para junções que têm múltiplas condições de junção equi.

Antes do MySQL 8.0.20, uma junção hash não poderia ser usada se qualquer par de tabelas unidas não tivesse pelo menos uma condição de junção equi, e o algoritmo de loop aninhado de bloco mais lento fosse empregado. No MySQL 8.0.20 e versões posteriores, a junção hash é usada nesses casos, como mostrado aqui:

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

(Exemplos adicionais são fornecidos mais adiante nesta seção.)

Uma união hash também é aplicada para um produto cartesiano — ou seja, quando nenhuma condição de junção é especificada, como mostrado aqui:

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

No MySQL 8.0.20 e versões posteriores, não é mais necessário que a junção contenha pelo menos uma condição de junção equi para que uma junção hash seja usada. Isso significa que os tipos de consultas que podem ser otimizados usando junções hash incluem as seguintes (com exemplos):

- *Conexão interna não equivalente*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 JOIN t2 ON t1.c1 < t2.c1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Filter: (t1.c1 < t2.c1)  (cost=4.70 rows=12)
      -> Inner hash join (no condition)  (cost=4.70 rows=12)
          -> Table scan on t2  (cost=0.08 rows=6)
          -> Hash
              -> Table scan on t1  (cost=0.85 rows=6)
  ```

- *Semijoin*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1
      ->     WHERE t1.c1 IN (SELECT t2.c2 FROM t2)\G
  *************************** 1. row ***************************
  EXPLAIN: -> Hash semijoin (t2.c2 = t1.c1)  (cost=0.70 rows=1)
      -> Table scan on t1  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t2  (cost=0.35 rows=1)
  ```

- *Antijoin*:

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

- *Conjunção externa esquerda*:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 LEFT JOIN t2 ON t1.c1 = t2.c1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Left hash join (t2.c1 = t1.c1)  (cost=0.70 rows=1)
      -> Table scan on t1  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t2  (cost=0.35 rows=1)
  ```

- *Conjunção externa direita* (observe que o MySQL reescreve todas as junções externas direitas como junções externas esquerdas):

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 RIGHT JOIN t2 ON t1.c1 = t2.c1\G
  *************************** 1. row ***************************
  EXPLAIN: -> Left hash join (t1.c1 = t2.c1)  (cost=0.70 rows=1)
      -> Table scan on t2  (cost=0.35 rows=1)
      -> Hash
          -> Table scan on t1  (cost=0.35 rows=1)
  ```

Por padrão, o MySQL 8.0.18 e versões posteriores utilizam junções hash sempre que possível. É possível controlar se as junções hash são empregadas usando uma das dicas de otimização `BNL` e `NO_BNL`.

(O MySQL 8.0.18 suporta `hash_join=on` ou `hash_join=off` como parte do ajuste da variável de sistema do servidor `optimizer_switch`, bem como as dicas de otimização `HASH_JOIN` ou `NO_HASH_JOIN`. No MySQL 8.0.19 e versões posteriores, essas opções não têm mais efeito.)

O uso de memória por junções hash pode ser controlado usando a variável de sistema `join_buffer_size`; uma junção hash não pode usar mais memória do que essa quantidade. Quando a memória necessária para uma junção hash excede o valor disponível, o MySQL lida com isso usando arquivos no disco. Se isso acontecer, você deve estar ciente de que a junção pode não ser bem-sucedida se uma junção hash não puder caber na memória e criar mais arquivos do que o definido para `open_files_limit`. Para evitar tais problemas, faça uma das seguintes alterações:

- Aumente `join_buffer_size` para que a junção de hash não seja descarregada no disco.

- Aumente `open_files_limit`.

A partir do MySQL 8.0.18, os buffers de junção para junções hash são alocados incrementalmente; assim, você pode definir `join_buffer_size` mais alto sem que consultas pequenas aloquem grandes quantidades de RAM, mas as junções externas alocam todo o buffer. No MySQL 8.0.20 e versões posteriores, as junções hash são usadas também para junções externas (incluindo antijunções e semijojunções), então isso não é mais um problema.
