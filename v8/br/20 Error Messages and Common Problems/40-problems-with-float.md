#### B.3.4.8 Problemas com Valores de Ponto Flutuante

Os números de ponto flutuante às vezes causam confusão porque são aproximados e não são armazenados como valores exatos. Um valor de ponto flutuante conforme escrito em uma declaração SQL pode não ser o mesmo que o valor representado internamente. Tentativas de tratar valores de ponto flutuante como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou implementação. Os tipos de dados `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") estão sujeitos a esses problemas. Para as colunas `DECIMAL` - DECIMAL, NUMERIC")`, o MySQL realiza operações com uma precisão de 65 dígitos decimais, o que deve resolver a maioria dos problemas de imprecisão comuns.

O exemplo a seguir usa `DOUBLE` - FLOAT, DOUBLE") para demonstrar como os cálculos feitos usando operações de ponto flutuante estão sujeitos a erros de ponto flutuante.

```
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

O resultado é correto. Embora os primeiros cinco registros pareçam não satisfazer a comparação (os valores de `a` e `b` não parecem ser diferentes), eles podem fazê-lo porque a diferença entre os números aparece por volta do décimo dígito decimal ou mais, dependendo de fatores como a arquitetura da CPU ou a versão ou nível de otimização do compilador. Por exemplo, diferentes CPUs podem avaliar números de ponto flutuante de maneira diferente.

Se as colunas `d1` e `d2` tivessem sido definidas como `DECIMAL` - DECIMAL, NUMERIC") em vez de `DOUBLE` - FLOAT, DOUBLE"), o resultado da consulta `SELECT` teria contido apenas uma linha — a última mostrada acima.

A maneira correta de fazer comparações de números de ponto flutuante é primeiro decidir sobre uma tolerância aceitável para diferenças entre os números e depois fazer a comparação contra o valor da tolerância. Por exemplo, se concordamos que números de ponto flutuante devem ser considerados iguais se forem iguais dentro de uma precisão de um em dez mil (0,0001), a comparação deve ser escrita para encontrar diferenças maiores que o valor da tolerância:

```
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

```
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

```
CREATE TABLE t1(c1 FLOAT(53,0), c2 FLOAT(53,0));
INSERT INTO t1 VALUES('1e+52','-1e+52');
SELECT * FROM t1;
```

Em algumas plataformas, a instrução `SELECT` retorna `inf` e `-inf`. Em outras, retorna `0` e `-0`.

Uma implicação dos problemas anteriores é que, se você tentar criar uma réplica drenando o conteúdo da tabela com `mysqldump` na fonte e recarregando o arquivo de dump na réplica, as tabelas que contêm colunas de ponto flutuante podem diferir entre os dois hosts.