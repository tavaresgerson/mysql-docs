#### 8.2.1.19 Otimização de Expressões Row Constructor

Row constructors permitem comparações simultâneas de múltiplos valores. Por exemplo, estas duas instruções são semanticamente equivalentes:

```sql
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

Além disso, o optimizer trata ambas as expressões da mesma forma.

O optimizer tem menos probabilidade de usar Indexes disponíveis se as colunas do row constructor não cobrirem o prefixo de um Index. Considere a seguinte tabela, que possui uma Primary Key em `(c1, c2, c3)`:

```sql
CREATE TABLE t1 (
  c1 INT, c2 INT, c3 INT, c4 CHAR(100),
  PRIMARY KEY(c1,c2,c3)
);
```

Nesta Query, a cláusula `WHERE` utiliza todas as colunas no Index. No entanto, o próprio row constructor não cobre um prefixo de Index, resultando no optimizer usando apenas `c1` (`key_len=4`, o tamanho de `c1`):

```sql
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

Nesses casos, reescrever a expressão row constructor utilizando uma expressão nonconstructor equivalente pode resultar em um uso de Index mais completo. Para a Query fornecida, as expressões row constructor e nonconstructor equivalente são:

```sql
(c2,c3) > (1,1)
c2 > 1 OR ((c2 = 1) AND (c3 > 1))
```

Reescrever a Query para usar a expressão nonconstructor resulta no optimizer utilizando todas as três colunas no Index (`key_len=12`):

```sql
mysql> EXPLAIN SELECT * FROM t1
       WHERE c1 = 1 AND (c2 > 1 OR ((c2 = 1) AND (c3 > 1)))\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 12
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using where
```

Portanto, para obter melhores resultados, evite misturar row constructors com expressões `AND`/`OR`. Use uma ou outra.

Sob certas condições, o optimizer pode aplicar o método de acesso de Range a expressões `IN()` que possuem argumentos row constructor. Consulte Otimização de Range de Expressões Row Constructor.