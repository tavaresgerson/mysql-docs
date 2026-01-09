#### B.3.4.8 Problemas com valores de ponto flutuante

Os números de ponto flutuante às vezes causam confusão porque são aproximados e não são armazenados como valores exatos. Um valor de ponto flutuante conforme escrito em uma declaração SQL pode não ser o mesmo que o valor representado internamente. Tentativas de tratar valores de ponto flutuante como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências da plataforma ou implementação. Os tipos de dados [`FLOAT`](floating-point-types.html) e [`DOUBLE`](floating-point-types.html) estão sujeitos a esses problemas. Para as colunas [`DECIMAL`](fixed-point-types.html), o MySQL realiza operações com uma precisão de 65 dígitos decimais, o que deve resolver a maioria dos problemas de imprecisão comuns.

O exemplo a seguir usa [`DOUBLE`](tipos-de-ponto-flutuante.html) para demonstrar como os cálculos realizados com operações de ponto flutuante estão sujeitos a erros de ponto flutuante.

```sql
mysql> CREATE TABLE t1 (i INT, d1 DOUBLE, d2 DOUBLE);
mysql> INSERT INTO t1 VALUES (1, 101.40, 21.40), (1, -80.00, 0.00),
    -> (2, 0.00, 0.00), (2, -13.20, 0.00), (2, 59.60, 46.40),
    -> (2, 30.40, 30.40), (3, 37.00, 7.40), (3, -29.60, 0.00),
    -> (4, 60.00, 15.40), (4, -10.60, 0.00), (4, -34.00, 0.00),
    -> (5, 33.00, 0.00), (5, -25.80, 0.00), (5, 0.00, 7.20),
    -> (6, 0.00, 0.00), (6, -51.40, 0.00);

mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b
    -> FROM t1 GROUP BY i HAVING a <> b;

+------+-------+------+
| i    | a     | b    |
+------+-------+------+
|    1 |  21.4 | 21.4 |
|    2 |  76.8 | 76.8 |
|    3 |   7.4 |  7.4 |
|    4 |  15.4 | 15.4 |
|    5 |   7.2 |  7.2 |
|    6 | -51.4 |    0 |
+------+-------+------+
```

O resultado está correto. Embora os primeiros cinco registros pareçam não satisfazer a comparação (os valores de `a` e `b` não parecem ser diferentes), isso pode acontecer porque a diferença entre os números aparece por volta do décimo dígito, dependendo de fatores como a arquitetura do computador, a versão do compilador ou o nível de otimização. Por exemplo, diferentes CPUs podem avaliar números em ponto flutuante de maneira diferente.

Se as colunas `d1` e `d2` tivessem sido definidas como [`DECIMAL`](tipos-de-pontos-fixos.html) em vez de [`DOUBLE`](tipos-de-pontos-flutuantes.html), o resultado da consulta [`SELECT`](select.html) teria contido apenas uma linha — a última mostrada acima.

A maneira correta de fazer a comparação de números de ponto flutuante é primeiro decidir sobre uma tolerância aceitável para as diferenças entre os números e, em seguida, fazer a comparação em relação ao valor da tolerância. Por exemplo, se concordarmos que os números de ponto flutuante devem ser considerados iguais se forem iguais com uma precisão de um em dez mil (0,0001), a comparação deve ser feita para encontrar diferenças maiores que o valor da tolerância:

```sql
mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b FROM t1
    -> GROUP BY i HAVING ABS(a - b) > 0.0001;
+------+-------+------+
| i    | a     | b    |
+------+-------+------+
|    6 | -51.4 |    0 |
+------+-------+------+
1 row in set (0.00 sec)
```

Por outro lado, para obter linhas onde os números são iguais, o teste deve encontrar diferenças dentro do valor de tolerância:

```sql
mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b FROM t1
    -> GROUP BY i HAVING ABS(a - b) <= 0.0001;
+------+------+------+
| i    | a    | b    |
+------+------+------+
|    1 | 21.4 | 21.4 |
|    2 | 76.8 | 76.8 |
|    3 |  7.4 |  7.4 |
|    4 | 15.4 | 15.4 |
|    5 |  7.2 |  7.2 |
+------+------+------+
5 rows in set (0.03 sec)
```

Os valores de ponto flutuante estão sujeitos a dependências da plataforma ou implementação. Suponha que você execute as seguintes instruções:

```sql
CREATE TABLE t1(c1 FLOAT(53,0), c2 FLOAT(53,0));
INSERT INTO t1 VALUES('1e+52','-1e+52');
SELECT * FROM t1;
```

Em algumas plataformas, a instrução `SELECT` retorna `inf` e `-inf`. Em outras, ela retorna `0` e `-0`.

Uma implicação das questões anteriores é que, se você tentar criar uma replica descarregando o conteúdo da tabela com [**mysqldump**](mysqldump.html) no host de origem e recarregando o arquivo de descarregamento na replica, as tabelas que contêm colunas de ponto flutuante podem diferir entre os dois hosts.
