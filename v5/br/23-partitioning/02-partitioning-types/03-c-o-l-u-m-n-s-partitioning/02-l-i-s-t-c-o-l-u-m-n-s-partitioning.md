#### 22.2.3.2 Partição de colunas da lista

O MySQL 5.7 oferece suporte à partição `LIST COLUMNS`. Esta é uma variante da partição `LIST` que permite o uso de múltiplas colunas como chaves de partição e, para colunas de tipos de dados diferentes dos inteiros, como colunas de partição; você pode usar tipos de string, colunas `[DATA]` (datetime.html) e `[DATA/Hora]` (datetime.html). (Para mais informações sobre os tipos de dados permitidos para as colunas de partição `COLUMNS`, consulte Seção 22.2.3, “Partição COLUMNS”.)

Suponha que você tenha um negócio com clientes em 12 cidades, que, para fins de vendas e marketing, você organiza em 4 regiões de 3 cidades cada, conforme mostrado na tabela a seguir:

<table summary="O exemplo descrito no texto anterior de uma empresa com quatro regiões de vendas e marketing, com cada região tendo três cidades."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Região</th> <th>Cidades</th> </tr></thead><tbody><tr> <td>1</td> <td>Oskarshamn, Högsby, Mönsterås</td> </tr><tr> <td>2</td> <td>Vimmerby, Hultsfred, Västervik</td> </tr><tr> <td>3</td> <td>Nässjö, Eksjö, Vetlanda</td> </tr><tr> <td>4</td> <td>Uppvidinge, Alvesta, Växjo</td> </tr></tbody></table>

Com a partição `LIST COLUMNS`, você pode criar uma tabela para dados de clientes que atribui uma linha a qualquer uma das 4 partições correspondentes a essas regiões com base no nome da cidade onde um cliente reside, como mostrado aqui:

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

Assim como na partição por `COLUNAS DE CAMPO`, você não precisa usar expressões na cláusula `COLUMNS()` para converter os valores das colunas em inteiros. (Na verdade, o uso de expressões diferentes dos nomes das colunas não é permitido com `COLUMNS()`.

Também é possível usar as colunas `DATE` e `DATETIME`, como mostrado no exemplo a seguir, que usa o mesmo nome e colunas da tabela `customers_1` mostrada anteriormente, mas emprega a partição `LIST COLUMNS` com base na coluna `renewal` para armazenar linhas em uma das 4 partições, dependendo da semana de fevereiro de 2010 em que a conta do cliente está programada para ser renovada:

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

Isso funciona, mas torna-se complicado definir e manter se o número de datas envolvidas crescer muito; nesses casos, geralmente é mais prático usar o particionamento `RANGE` ou `RANGE COLUMNS`. Neste caso, como a coluna que desejamos usar como chave de particionamento é uma coluna `[DATE]` (datetime.html), usamos o particionamento `RANGE COLUMNS`, como mostrado aqui:

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

Para mais informações, consulte Seção 22.2.3.1, “Particionamento de COLUNAS DE ÁREA”.

Além disso (como no caso da partição `RANGE COLUMNS`), você pode usar várias colunas na cláusula `COLUMNS()`.

Consulte Seção 13.1.18, “Instrução CREATE TABLE” para obter informações adicionais sobre a sintaxe `PARTITION BY LIST COLUMNS()`.
