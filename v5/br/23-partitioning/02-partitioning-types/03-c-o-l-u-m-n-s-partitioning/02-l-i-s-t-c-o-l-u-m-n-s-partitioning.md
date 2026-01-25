#### 22.2.3.2 Particionamento LIST COLUMNS

O MySQL 5.7 oferece suporte ao particionamento `LIST COLUMNS`. Esta é uma variante do particionamento `LIST` que permite o uso de múltiplas colunas como chaves de Partition, e para que colunas de tipos de dados que não sejam inteiros sejam usadas como colunas de Partitioning; você pode usar tipos string, colunas [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). (Para mais informações sobre tipos de dados permitidos para colunas de particionamento `COLUMNS`, consulte [Section 22.2.3, “COLUMNS Partitioning”](partitioning-columns.html "22.2.3 COLUMNS Partitioning").)

Suponha que você tenha um negócio com clientes em 12 cidades que, para fins de vendas e marketing, você organiza em 4 regiões de 3 cidades cada, conforme mostrado na tabela a seguir:

<table summary="O exemplo descrito no texto anterior de um negócio com quatro regiões de vendas e marketing, com cada região tendo três cidades."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Região</th> <th>Cidades</th> </tr></thead><tbody><tr> <td>1</td> <td>Oskarshamn, Högsby, Mönsterås</td> </tr><tr> <td>2</td> <td>Vimmerby, Hultsfred, Västervik</td> </tr><tr> <td>3</td> <td>Nässjö, Eksjö, Vetlanda</td> </tr><tr> <td>4</td> <td>Uppvidinge, Alvesta, Växjo</td> </tr> </tbody></table>

Com o particionamento `LIST COLUMNS`, você pode criar uma tabela para dados de clientes que atribui uma linha a qualquer uma das 4 Partitions correspondentes a essas regiões, com base no nome da cidade onde o cliente reside, conforme mostrado aqui:

```sql
CREATE TABLE customers_1 (
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    street_1 VARCHAR(30),
    street_2 VARCHAR(30),
    city VARCHAR(15),
    renewal DATE
)
PARTITION BY LIST COLUMNS(city) (
    PARTITION pRegion_1 VALUES IN('Oskarshamn', 'Högsby', 'Mönsterås'),
    PARTITION pRegion_2 VALUES IN('Vimmerby', 'Hultsfred', 'Västervik'),
    PARTITION pRegion_3 VALUES IN('Nässjö', 'Eksjö', 'Vetlanda'),
    PARTITION pRegion_4 VALUES IN('Uppvidinge', 'Alvesta', 'Växjo')
);
```

Assim como no particionamento por `RANGE COLUMNS`, você não precisa usar expressions na cláusula `COLUMNS()` para converter valores de coluna em integers. (Na verdade, o uso de expressions que não sejam nomes de colunas não é permitido com `COLUMNS()`.)

Também é possível usar colunas [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), conforme mostrado no exemplo a seguir que usa o mesmo nome e colunas da tabela `customers_1` mostrada anteriormente, mas emprega o particionamento `LIST COLUMNS` baseado na coluna `renewal` para armazenar linhas em uma de 4 Partitions, dependendo da semana de fevereiro de 2010 em que a conta do cliente está programada para renovar:

```sql
CREATE TABLE customers_2 (
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    street_1 VARCHAR(30),
    street_2 VARCHAR(30),
    city VARCHAR(15),
    renewal DATE
)
PARTITION BY LIST COLUMNS(renewal) (
    PARTITION pWeek_1 VALUES IN('2010-02-01', '2010-02-02', '2010-02-03',
        '2010-02-04', '2010-02-05', '2010-02-06', '2010-02-07'),
    PARTITION pWeek_2 VALUES IN('2010-02-08', '2010-02-09', '2010-02-10',
        '2010-02-11', '2010-02-12', '2010-02-13', '2010-02-14'),
    PARTITION pWeek_3 VALUES IN('2010-02-15', '2010-02-16', '2010-02-17',
        '2010-02-18', '2010-02-19', '2010-02-20', '2010-02-21'),
    PARTITION pWeek_4 VALUES IN('2010-02-22', '2010-02-23', '2010-02-24',
        '2010-02-25', '2010-02-26', '2010-02-27', '2010-02-28')
);
```

Isso funciona, mas torna-se complicado de definir e manter se o número de dates envolvidas crescer muito; nesses casos, geralmente é mais prático empregar o particionamento `RANGE` ou `RANGE COLUMNS`. Neste caso, como a coluna que desejamos usar como chave de Partitioning é uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), usamos o particionamento `RANGE COLUMNS`, conforme mostrado aqui:

```sql
CREATE TABLE customers_3 (
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    street_1 VARCHAR(30),
    street_2 VARCHAR(30),
    city VARCHAR(15),
    renewal DATE
)
PARTITION BY RANGE COLUMNS(renewal) (
    PARTITION pWeek_1 VALUES LESS THAN('2010-02-09'),
    PARTITION pWeek_2 VALUES LESS THAN('2010-02-15'),
    PARTITION pWeek_3 VALUES LESS THAN('2010-02-22'),
    PARTITION pWeek_4 VALUES LESS THAN('2010-03-01')
);
```

Consulte [Section 22.2.3.1, “RANGE COLUMNS partitioning”](partitioning-columns-range.html "22.2.3.1 RANGE COLUMNS partitioning"), para mais informações.

Além disso (assim como no particionamento `RANGE COLUMNS`), você pode usar múltiplas colunas na cláusula `COLUMNS()`.

Consulte [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), para informações adicionais sobre a sintaxe `PARTITION BY LIST COLUMNS()`.