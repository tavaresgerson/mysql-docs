### 10.3.13 Índices de Descendência

O MySQL suporta índices descendentes: `DESC` em uma definição de índice não é mais ignorado, mas faz com que os valores de chave sejam armazenados em ordem decrescente. Anteriormente, os índices podiam ser pesquisados em ordem inversa, mas com uma penalidade de desempenho. Um índice descendente pode ser pesquisado em ordem direta, o que é mais eficiente. Os índices descendentes também permitem que o otimizador use índices de múltiplas colunas quando a ordem de varredura mais eficiente mistura a ordem crescente para algumas colunas e a ordem decrescente para outras.

Considere a definição da tabela a seguir, que contém duas colunas e quatro definições de índices de duas colunas para as várias combinações de índices ascendentes e descendentes nas colunas:

```
CREATE TABLE t (
  c1 INT, c2 INT,
  INDEX idx1 (c1 ASC, c2 ASC),
  INDEX idx2 (c1 ASC, c2 DESC),
  INDEX idx3 (c1 DESC, c2 ASC),
  INDEX idx4 (c1 DESC, c2 DESC)
);
```

A definição da tabela resulta em quatro índices distintos. O otimizador pode realizar uma varredura de índice para cada uma das cláusulas `ORDER BY` e não precisa usar uma operação `filesort`:

```
ORDER BY c1 ASC, c2 ASC    -- optimizer can use idx1
ORDER BY c1 DESC, c2 DESC  -- optimizer can use idx4
ORDER BY c1 ASC, c2 DESC   -- optimizer can use idx2
ORDER BY c1 DESC, c2 ASC   -- optimizer can use idx3
```

O uso de índices descendentes está sujeito a estas condições:

- Os índices descendentes são suportados apenas para o mecanismo de armazenamento `InnoDB`, com essas limitações:

  - A alteração de buffer não é suportada para um índice secundário se o índice contiver uma coluna de chave de índice descendente ou se a chave primária incluir uma coluna de índice descendente.

  - O analisador de SQL `InnoDB` não utiliza índices descendentes. Para a pesquisa de texto completo `InnoDB`, isso significa que o índice necessário na coluna `FTS_DOC_ID` da tabela indexada não pode ser definido como um índice descendente. Para mais informações, consulte a Seção 17.6.2.4, “Índices de Texto Completo InnoDB”.

- Os índices descendentes são suportados para todos os tipos de dados para os quais índices ascendentes estão disponíveis.

- Os índices descendentes são suportados para colunas comuns (não geradas) e geradas (tanto `VIRTUAL` quanto `STORED`).

- `DISTINCT` pode usar qualquer índice que contenha colunas correspondentes, incluindo partes de chave em ordem decrescente.

- Os índices que têm partes de chave descendente não são usados para a otimização de consultas que invocam funções agregadas, mas não têm uma cláusula `GROUP BY`.

- Os índices descendentes são suportados para os índices `BTREE`, mas não para os índices `HASH`. Os índices descendentes não são suportados para os índices `FULLTEXT` ou `SPATIAL`.

  Especificar explicitamente os identificadores `ASC` e `DESC` para os índices `HASH`, `FULLTEXT` e `SPATIAL` resulta em um erro.

Você pode ver na coluna `Extra` do resultado de `EXPLAIN` que o otimizador consegue usar um índice descendente, como mostrado aqui:

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

Na saída `EXPLAIN FORMAT=TREE`, o uso de um índice descendente é indicado pela adição de `(reverse)` após o nome do índice, da seguinte forma:

```
mysql> EXPLAIN FORMAT=TREE SELECT * FROM t1 ORDER BY a ASC\G
*************************** 1. row ***************************
EXPLAIN: -> Index scan on t1 using a_desc_b_asc (reverse)  (cost=0.35 rows=1)
```

Veja também EXPLAIN Informações Adicionais.
