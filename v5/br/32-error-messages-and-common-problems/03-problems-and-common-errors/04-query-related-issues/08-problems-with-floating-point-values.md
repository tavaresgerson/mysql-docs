#### B.3.4.8 Problemas com Valores de Ponto Flutuante

Números de ponto flutuante (floating-point numbers) às vezes causam confusão porque são aproximados e não são armazenados como valores exatos. Um valor de ponto flutuante conforme escrito em uma instrução SQL pode não ser o mesmo que o valor representado internamente. Tentativas de tratar valores de ponto flutuante como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou de implementação. Os tipos de dados [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") e [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") estão sujeitos a essas questões. Para colunas [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), o MySQL executa operações com uma precisão de 65 dígitos decimais, o que deve resolver a maioria dos problemas comuns de imprecisão.

O exemplo a seguir usa [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") para demonstrar como cálculos realizados usando operações de ponto flutuante estão sujeitos a erros de ponto flutuante.

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

O resultado está correto. Embora os cinco primeiros registros pareçam não satisfazer a comparação (os valores de `a` e `b` não parecem ser diferentes), eles podem satisfazê-la porque a diferença entre os números aparece por volta do décimo decimal, ou algo parecido, dependendo de fatores como arquitetura do computador, versão do compilador ou nível de otimização. Por exemplo, diferentes CPUs podem avaliar números de ponto flutuante de maneiras distintas.

Se as colunas `d1` e `d2` tivessem sido definidas como [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") em vez de [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), o resultado da Query [`SELECT`](select.html "13.2.9 SELECT Statement") conteria apenas uma linha — a última mostrada acima.

A maneira correta de realizar a comparação de números de ponto flutuante é primeiro decidir uma tolerância aceitável para as diferenças entre os números e, em seguida, fazer a comparação em relação ao valor da tolerância. Por exemplo, se concordarmos que os números de ponto flutuante devem ser considerados iguais se estiverem dentro de uma precisão de um em dez mil (0.0001), a comparação deve ser escrita para encontrar diferenças maiores que o valor da tolerância:

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

Por outro lado, para obter linhas onde os números são iguais, o teste deve encontrar diferenças dentro do valor da tolerância:

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

Valores de ponto flutuante estão sujeitos a dependências de plataforma ou de implementação. Suponha que você execute as seguintes instruções:

```sql
CREATE TABLE t1(c1 FLOAT(53,0), c2 FLOAT(53,0));
INSERT INTO t1 VALUES('1e+52','-1e+52');
SELECT * FROM t1;
```

Em algumas plataformas, a instrução `SELECT` retorna `inf` e `-inf`. Em outras, retorna `0` e `-0`.

Uma implicação das questões anteriores é que, se você tentar criar uma réplica despejando o conteúdo da tabela com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") na origem e recarregando o arquivo dump na réplica, as tabelas contendo colunas de ponto flutuante podem diferir entre os dois hosts.