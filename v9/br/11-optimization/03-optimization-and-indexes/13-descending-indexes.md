### 10.3.13 Índices Descendentes

O MySQL suporta índices descendentes: o uso do comando `DESC` em uma definição de índice não é mais ignorado, mas faz com que os valores de chave sejam armazenados em ordem decrescente. Anteriormente, os índices podiam ser pesquisados em ordem inversa, mas com uma penalidade de desempenho. Um índice descendente pode ser pesquisado em ordem crescente, o que é mais eficiente. Os índices descendentes também permitem que o otimizador use índices de múltiplas colunas quando a ordem de varredura mais eficiente mistura ordem crescente para algumas colunas e ordem decrescente para outras.

Considere a seguinte definição de tabela, que contém duas colunas e quatro definições de índice de duas colunas para as várias combinações de índices ascendentes e descendentes nas colunas:

```
CREATE TABLE t (
  c1 INT, c2 INT,
  INDEX idx1 (c1 ASC, c2 ASC),
  INDEX idx2 (c1 ASC, c2 DESC),
  INDEX idx3 (c1 DESC, c2 ASC),
  INDEX idx4 (c1 DESC, c2 DESC)
);
```

A definição de tabela resulta em quatro índices distintos. O otimizador pode realizar uma varredura de índice em ordem crescente para cada uma das cláusulas `ORDER BY` e não precisa usar uma operação `filesort`:

```
ORDER BY c1 ASC, c2 ASC    -- optimizer can use idx1
ORDER BY c1 DESC, c2 DESC  -- optimizer can use idx4
ORDER BY c1 ASC, c2 DESC   -- optimizer can use idx2
ORDER BY c1 DESC, c2 ASC   -- optimizer can use idx3
```

O uso de índices descendentes está sujeito a estas condições:

* Os índices descendentes são suportados apenas pelo motor de armazenamento `InnoDB`, com estas limitações:

  + A mudança de buffer não é suportada para um índice secundário se o índice contiver uma coluna de chave de índice descendente ou se a chave primária incluir uma coluna de índice descendente.

  + O analisador de SQL do `InnoDB` não usa índices descendentes. Para a pesquisa de texto completo `InnoDB`, isso significa que o índice necessário na coluna `FTS_DOC_ID` da tabela indexada não pode ser definido como um índice descendente. Para mais informações, consulte a Seção 17.6.2.4, “Índices de Texto Completo `InnoDB’”.

* Os índices descendentes são suportados para todos os tipos de dados para os quais índices ascendentes estão disponíveis.

* Os índices descendentes são suportados para colunas ordinárias (não geradas) e colunas geradas (tanto `VIRTUAL` quanto `STORED`).

* O `DISTINCT` pode usar qualquer índice que contenha colunas correspondentes, incluindo partes da chave em ordem decrescente.

* Índices que têm partes da chave em ordem decrescente não são usados para otimização de consultas que invocam funções agregadas, mas não têm uma cláusula `GROUP BY`.

* Índices em ordem decrescente são suportados para `BTREE`, mas não para índices `HASH`. Índices em ordem decrescente não são suportados para índices `FULLTEXT` ou `SPATIAL`.

Especificar explicitamente os designators `ASC` e `DESC` para índices `HASH`, `FULLTEXT` e `SPATIAL` resulta em um erro.

Você pode ver na coluna **`Extra`** do resultado da consulta `EXPLAIN` que o otimizador consegue usar um índice em ordem decrescente, como mostrado aqui:

```
mysql> CREATE TABLE t1 (
    -> a INT,
    -> b INT,
    -> INDEX a_desc_b_asc (a DESC, b ASC)
    -> );

mysql> EXPLAIN SELECT * FROM t1 ORDER BY a ASC\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: index
possible_keys: NULL
          key: a_desc_b_asc
      key_len: 10
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Backward index scan; Using index
```

Na saída `EXPLAIN FORMAT=TREE`, o uso de um índice em ordem decrescente é indicado pela adição de `(reverse)` após o nome do índice, como este:

```
mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 ORDER BY a ASC\G
*************************** 1. row ***************************
EXPLAIN: -> Index scan on t1 using a_desc_b_asc (reverse)  (cost=0.35 rows=1)
```

Veja também a Informação Extra do EXPLAIN.