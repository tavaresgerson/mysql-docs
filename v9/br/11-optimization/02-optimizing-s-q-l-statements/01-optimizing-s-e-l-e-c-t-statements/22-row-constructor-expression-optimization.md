#### 10.2.1.22 Otimização da Expressão de Construtor de Linha

Os construtores de linha permitem comparações simultâneas de múltiplos valores. Por exemplo, essas duas declarações são semanticamente equivalentes:

```
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

Além disso, o otimizador trata ambas as expressões da mesma maneira.

O otimizador é menos propenso a usar índices disponíveis se as colunas do construtor de linha não cobrem o prefixo de um índice. Considere a seguinte tabela, que tem uma chave primária em `(c1, c2, c3)`:

```
CREATE TABLE t1 (
  c1 INT, c2 INT, c3 INT, c4 CHAR(100),
  PRIMARY KEY(c1,c2,c3)
);
```

Nesta consulta, a cláusula `WHERE` usa todas as colunas no índice. No entanto, o próprio construtor de linha não cobre um prefixo de índice, com o resultado de que o otimizador usa apenas `c1` (`key_len=4`, o tamanho de `c1`)

Nesses casos, a reescrita da expressão do construtor de linha usando uma expressão não-construtor equivalente pode resultar em um uso mais completo do índice. Para a consulta dada, as expressões do construtor de linha e não-construtor equivalentes são:

```
mysql> EXPLAIN SELECT * FROM t1
       WHERE c1=1 AND (c2,c3) > (1,1)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ref
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: const
         rows: 3
     filtered: 100.00
        Extra: Using where
```

A reescrita da consulta para usar a expressão não-construtor resulta no otimizador usando todas as três colunas no índice (`key_len=12`)

Assim, para melhores resultados, evite misturar construtores de linha com expressões `AND`/`OR`. Use um ou outro.

Sob certas condições, o otimizador pode aplicar o método de acesso de intervalo às expressões `IN()` que têm argumentos de construtor de linha. Veja Otimização de Intervalo de Expressões de Construtor de Linha.