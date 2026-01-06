#### 22.2.4.1 Partição por Hash Linear

O MySQL também suporta hashing linear, que difere do hashing regular porque o hashing linear utiliza um algoritmo de potências lineares de dois, enquanto o hashing regular emprega o módulo do valor da função de hashing.

Sintaticamente, a única diferença entre a partição por hash linear e a partição por hash regular é a adição da palavra-chave `LINEAR` na cláusula `PARTITION BY`, conforme mostrado aqui:

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

Dado uma expressão *`expr`*, a partição na qual o registro é armazenado quando o hashing linear é usado é o número de partição *`N`* entre *`num`* partições, onde *`N`* é derivado de acordo com o seguinte algoritmo:

1. Encontre o próximo número de potência de 2 maior que *`num`*. Chamamos esse valor de *`V`*; ele pode ser calculado da seguinte forma:

   ```sql
   V = POWER(2, CEILING(LOG(2, num)))
   ```

   (Suponha que *`num`* seja 13. Então, `LOG(2,13)` é 3,7004397181411. `CEILING(3,7004397181411)` é 4, e *`V`* = `POWER(2,4)`, que é 16.)

2. Defina *`N`* = *`F`*(*`column_list`*) & (*`V`* - 1).

3. Enquanto *`N`* >= *`num`*:

   - Defina *`V`* = *`V`* / 2

   - Defina *`N`* = *`N`* & (*`V`* - 1)

Suponha que a tabela `t1`, usando partição hash linear e com 6 partições, seja criada usando essa declaração:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY LINEAR HASH( YEAR(col3) )
    PARTITIONS 6;
```

Agora, suponha que você queira inserir dois registros em `t1` com os valores da coluna `col3` `'2003-04-14'` e `'1998-10-19'`. O número de partição para o primeiro desses registros é determinado da seguinte forma:

```sql
V = POWER(2, CEILING( LOG(2,6) )) = 8
N = YEAR('2003-04-14') & (8 - 1)
   = 2003 & 7
   = 3

(3 >= 6 is FALSE: record stored in partition #3)
```

O número da partição onde o segundo registro é armazenado é calculado conforme mostrado aqui:

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

A vantagem da partição por hash linear é que a adição, remoção, fusão e divisão de partições são feitas muito mais rapidamente, o que pode ser benéfico ao lidar com tabelas que contêm quantidades extremamente grandes (terabytes) de dados. A desvantagem é que os dados têm menos probabilidade de serem distribuídos uniformemente entre as partições em comparação com a distribuição obtida usando a partição por hash regular.
