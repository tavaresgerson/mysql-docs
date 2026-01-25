#### 22.2.4.1 LINEAR HASH Partitioning

O MySQL também suporta linear hashing, que difere do regular hashing no sentido de que o linear hashing utiliza um algoritmo linear de potências de dois, enquanto o regular hashing emprega o módulo do valor da função de hashing.

Sintaticamente, a única diferença entre linear-hash partitioning e regular hashing é a adição da palavra-chave `LINEAR` na cláusula `PARTITION BY`, conforme mostrado aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY LINEAR HASH( YEAR(hired) )
PARTITIONS 4;
```

Dada uma expressão *`expr`*, a partition na qual o record é armazenado quando o linear hashing é usado é a partition número *`N`* entre *`num`* partitions, onde *`N`* é derivado de acordo com o seguinte algoritmo:

1. Encontre a próxima potência de 2 maior que *`num`*. Chamamos esse valor de *`V`*; ele pode ser calculado como:

   ```sql
   V = POWER(2, CEILING(LOG(2, num)))
   ```

   (Suponha que *`num`* seja 13. Então [`LOG(2,13)`](mathematical-functions.html#function_log) é 3.7004397181411. [`CEILING(3.7004397181411)`](mathematical-functions.html#function_ceiling) é 4, e *`V`* = [`POWER(2,4)`](mathematical-functions.html#function_power), que é 16.)

2. Defina *`N`* = *`F`*(*`column_list`*) & (*`V`* - 1).

3. Enquanto *`N`* >= *`num`*:

   * Defina *`V`* = *`V`* / 2

   * Defina *`N`* = *`N`* & (*`V`* - 1)

Suponha que a table `t1`, usando linear hash partitioning e tendo 6 partitions, seja criada usando esta declaração:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY LINEAR HASH( YEAR(col3) )
    PARTITIONS 6;
```

Agora, assuma que você deseja inserir dois records na `t1` com os valores da column `col3` de `'2003-04-14'` e `'1998-10-19'`. O número da partition para o primeiro é determinado da seguinte forma:

```sql
V = POWER(2, CEILING( LOG(2,6) )) = 8
N = YEAR('2003-04-14') & (8 - 1)
   = 2003 & 7
   = 3

(3 >= 6 is FALSE: record stored in partition #3)
```

O número da partition onde o segundo record é armazenado é calculado conforme mostrado aqui:

```sql
V = 8
N = YEAR('1998-10-19') & (8 - 1)
  = 1998 & 7
  = 6

(6 >= 6 is TRUE: additional step required)

N = 6 & ((8 / 2) - 1)
  = 6 & 3
  = 2

(2 >= 6 is FALSE: record stored in partition #2)
```

A vantagem do partitioning por linear hash é que a adição (adding), remoção (dropping), união (merging) e divisão (splitting) de partitions se torna muito mais rápida, o que pode ser benéfico ao lidar com tables contendo volumes de dados extremamente grandes (terabytes). A desvantagem é que os dados têm menos probabilidade de serem distribuídos uniformemente entre as partitions em comparação com a distribuição obtida usando regular hash partitioning.