### 22.2.1 RANGE Partitioning

Uma tabela que é particionada por RANGE é particionada de tal forma que cada partition contém linhas para as quais o valor da expressão de partitioning se encontra dentro de um determinado RANGE. Os Ranges devem ser contíguos, mas não sobrepostos, e são definidos usando o operador `VALUES LESS THAN`. Para os próximos exemplos, suponha que você esteja criando uma tabela como a seguinte para armazenar registros de pessoal para uma rede de 20 videolocadoras, numeradas de 1 a 20:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
);
```

Nota

A tabela `employees` usada aqui não possui Primary Keys ou Unique Keys. Embora os exemplos funcionem conforme mostrado para os propósitos da presente discussão, você deve ter em mente que, na prática, é extremamente provável que as tabelas tenham Primary Keys, Unique Keys ou ambos, e que as opções permitidas para colunas de partitioning dependem das colunas usadas para essas Keys, se houver. Para uma discussão sobre esses tópicos, consulte [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys").

Esta tabela pode ser particionada por RANGE de várias maneiras, dependendo das suas necessidades. Uma maneira seria usar a coluna `store_id`. Por exemplo, você pode decidir particionar a tabela de 4 maneiras adicionando uma cláusula `PARTITION BY RANGE` conforme mostrado aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE (store_id) (
    PARTITION p0 VALUES LESS THAN (6),
    PARTITION p1 VALUES LESS THAN (11),
    PARTITION p2 VALUES LESS THAN (16),
    PARTITION p3 VALUES LESS THAN (21)
);
```

Neste esquema de partitioning, todas as linhas correspondentes a funcionários que trabalham nas lojas de 1 a 5 são armazenadas na partition `p0`, aquelas empregadas nas lojas de 6 a 10 são armazenadas na partition `p1`, e assim por diante. Observe que cada partition é definida em ordem, do valor mais baixo ao mais alto. Este é um requisito da sintaxe `PARTITION BY RANGE`; você pode pensar nisso como análogo a uma série de comandos `if ... elseif ...` em C ou Java a esse respeito.

É fácil determinar que uma nova linha contendo os dados `(72, 'Mitchell', 'Wilson', '1998-06-25', DEFAULT, 7, 13)` é inserida na partition `p2`, mas o que acontece quando sua rede adiciona uma 21ª loja? Sob este esquema, não há regra que cubra uma linha cujo `store_id` seja maior que 20, resultando em um erro porque o servidor não sabe onde colocá-la. Você pode evitar que isso ocorra usando uma cláusula "catchall" `VALUES LESS THAN` na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que provê para todos os valores maiores que o valor mais alto explicitamente nomeado:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE (store_id) (
    PARTITION p0 VALUES LESS THAN (6),
    PARTITION p1 VALUES LESS THAN (11),
    PARTITION p2 VALUES LESS THAN (16),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);
```

Outra maneira de evitar um erro quando nenhum valor correspondente é encontrado é usar a palavra-chave `IGNORE` como parte da instrução [`INSERT`](insert.html "13.2.5 INSERT Statement"). Para um exemplo, consulte [Section 22.2.2, “LIST Partitioning”](partitioning-list.html "22.2.2 LIST Partitioning").

`MAXVALUE` representa um valor inteiro que é sempre maior do que o maior valor inteiro possível (em linguagem matemática, ele serve como um limite superior mínimo). Agora, quaisquer linhas cujo valor da coluna `store_id` seja maior ou igual a 16 (o valor mais alto definido) são armazenadas na partition `p3`. Em algum momento futuro—quando o número de lojas aumentar para 25, 30 ou mais—você pode usar uma instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") para adicionar novas partitions para as lojas 21-25, 26-30, e assim por diante (consulte [Section 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management"), para obter detalhes de como fazer isso).

De maneira muito semelhante, você poderia particionar a tabela com base nos códigos de trabalho dos funcionários—ou seja, com base em Ranges dos valores da coluna `job_code`. Por exemplo—assumindo que códigos de trabalho de dois dígitos são usados para trabalhadores regulares (na loja), códigos de três dígitos são usados para pessoal de escritório e suporte, e códigos de quatro dígitos são usados para cargos de gerência—você poderia criar a tabela particionada usando a seguinte instrução:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE (job_code) (
    PARTITION p0 VALUES LESS THAN (100),
    PARTITION p1 VALUES LESS THAN (1000),
    PARTITION p2 VALUES LESS THAN (10000)
);
```

Neste caso, todas as linhas relacionadas a trabalhadores na loja seriam armazenadas na partition `p0`, aquelas relacionadas a funcionários de escritório e suporte em `p1`, e aquelas relacionadas a gerentes na partition `p2`.

Também é possível usar uma expressão em cláusulas `VALUES LESS THAN`. No entanto, o MySQL deve ser capaz de avaliar o valor de retorno da expressão como parte de uma comparação `LESS THAN` (`<`).

Em vez de dividir os dados da tabela de acordo com o número da loja, você pode usar uma expressão baseada em uma das duas colunas [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Por exemplo, vamos supor que você deseja particionar com base no ano em que cada funcionário deixou a empresa; ou seja, o valor de [`YEAR(separated)`](date-and-time-functions.html#function_year). Um exemplo de uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que implementa tal esquema de partitioning é mostrado aqui:

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
PARTITION BY RANGE ( YEAR(separated) ) (
    PARTITION p0 VALUES LESS THAN (1991),
    PARTITION p1 VALUES LESS THAN (1996),
    PARTITION p2 VALUES LESS THAN (2001),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);
```

Neste esquema, para todos os funcionários que saíram antes de 1991, as linhas são armazenadas na partition `p0`; para aqueles que saíram nos anos de 1991 a 1995, em `p1`; para aqueles que saíram nos anos de 1996 a 2000, em `p2`; e para quaisquer trabalhadores que saíram após o ano 2000, em `p3`.

Também é possível particionar uma tabela por `RANGE`, com base no valor de uma coluna [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), usando a função [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), conforme mostrado neste exemplo:

```sql
CREATE TABLE quarterly_report_status (
    report_id INT NOT NULL,
    report_status VARCHAR(20) NOT NULL,
    report_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
PARTITION BY RANGE ( UNIX_TIMESTAMP(report_updated) ) (
    PARTITION p0 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-01-01 00:00:00') ),
    PARTITION p1 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-04-01 00:00:00') ),
    PARTITION p2 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-07-01 00:00:00') ),
    PARTITION p3 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-10-01 00:00:00') ),
    PARTITION p4 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-01-01 00:00:00') ),
    PARTITION p5 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-04-01 00:00:00') ),
    PARTITION p6 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-07-01 00:00:00') ),
    PARTITION p7 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-10-01 00:00:00') ),
    PARTITION p8 VALUES LESS THAN ( UNIX_TIMESTAMP('2010-01-01 00:00:00') ),
    PARTITION p9 VALUES LESS THAN (MAXVALUE)
);
```

Quaisquer outras expressões envolvendo valores [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") não são permitidas. (Consulte Bug #42849.)

O partitioning por RANGE é particularmente útil quando uma ou mais das seguintes condições são verdadeiras:

* Você deseja ou precisa apagar dados “antigos”. Se você estiver usando o esquema de partitioning mostrado anteriormente para a tabela `employees`, você pode simplesmente usar `ALTER TABLE employees DROP PARTITION p0;` para apagar todas as linhas relacionadas a funcionários que pararam de trabalhar para a empresa antes de 1991. (Consulte [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement") e [Section 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management"), para mais informações.) Para uma tabela com muitas linhas, isso pode ser muito mais eficiente do que executar uma Query [`DELETE`](delete.html "13.2.2 DELETE Statement") como `DELETE FROM employees WHERE YEAR(separated) <= 1990;`.

* Você deseja usar uma coluna contendo valores de data ou hora, ou contendo valores provenientes de alguma outra série.

* Você executa frequentemente Queries que dependem diretamente da coluna usada para o partitioning da tabela. Por exemplo, ao executar uma Query como [`EXPLAIN SELECT COUNT(*) FROM employees WHERE separated BETWEEN '2000-01-01' AND '2000-12-31' GROUP BY store_id;`](explain.html "13.8.2 EXPLAIN Statement"), o MySQL pode determinar rapidamente que apenas a partition `p2` precisa ser escaneada porque as partitions restantes não podem conter registros que satisfaçam a cláusula `WHERE`. Consulte [Section 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning"), para mais informações sobre como isso é realizado.

Uma variação deste tipo de partitioning é o partitioning `RANGE COLUMNS`. O partitioning por `RANGE COLUMNS` torna possível empregar múltiplas colunas para definir Ranges de partitioning que se aplicam tanto à colocação de linhas em partitions quanto à determinação da inclusão ou exclusão de partitions específicas ao realizar Partition Pruning. Consulte [Section 22.2.3.1, “RANGE COLUMNS partitioning”](partitioning-columns-range.html "22.2.3.1 RANGE COLUMNS partitioning"), para mais informações.

**Esquemas de Partitioning baseados em intervalos de tempo.** Se você deseja implementar um esquema de partitioning baseado em Ranges ou intervalos de tempo no MySQL 5.7, você tem duas opções:

1. Particione a tabela por `RANGE` e, para a expressão de partitioning, empregue uma função que opere em uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e retorne um valor inteiro, conforme mostrado aqui:

   ```sql
   CREATE TABLE members (
       firstname VARCHAR(25) NOT NULL,
       lastname VARCHAR(25) NOT NULL,
       username VARCHAR(16) NOT NULL,
       email VARCHAR(35),
       joined DATE NOT NULL
   )
   PARTITION BY RANGE( YEAR(joined) ) (
       PARTITION p0 VALUES LESS THAN (1960),
       PARTITION p1 VALUES LESS THAN (1970),
       PARTITION p2 VALUES LESS THAN (1980),
       PARTITION p3 VALUES LESS THAN (1990),
       PARTITION p4 VALUES LESS THAN MAXVALUE
   );
   ```

   No MySQL 5.7, também é possível particionar uma tabela por `RANGE` com base no valor de uma coluna [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), usando a função [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), conforme mostrado neste exemplo:

   ```sql
   CREATE TABLE quarterly_report_status (
       report_id INT NOT NULL,
       report_status VARCHAR(20) NOT NULL,
       report_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )
   PARTITION BY RANGE ( UNIX_TIMESTAMP(report_updated) ) (
       PARTITION p0 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-01-01 00:00:00') ),
       PARTITION p1 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-04-01 00:00:00') ),
       PARTITION p2 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-07-01 00:00:00') ),
       PARTITION p3 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-10-01 00:00:00') ),
       PARTITION p4 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-01-01 00:00:00') ),
       PARTITION p5 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-04-01 00:00:00') ),
       PARTITION p6 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-07-01 00:00:00') ),
       PARTITION p7 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-10-01 00:00:00') ),
       PARTITION p8 VALUES LESS THAN ( UNIX_TIMESTAMP('2010-01-01 00:00:00') ),
       PARTITION p9 VALUES LESS THAN (MAXVALUE)
   );
   ```

   No MySQL 5.7, quaisquer outras expressões envolvendo valores [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") não são permitidas. (Consulte Bug #42849.)

   Nota

   Também é possível no MySQL 5.7 usar [`UNIX_TIMESTAMP(timestamp_column)`](date-and-time-functions.html#function_unix-timestamp) como uma expressão de partitioning para tabelas que são particionadas por `LIST`. No entanto, geralmente não é prático fazer isso.

2. Particione a tabela por `RANGE COLUMNS`, usando uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") como a coluna de partitioning. Por exemplo, a tabela `members` poderia ser definida usando a coluna `joined` diretamente, conforme mostrado aqui:

   ```sql
   CREATE TABLE members (
       firstname VARCHAR(25) NOT NULL,
       lastname VARCHAR(25) NOT NULL,
       username VARCHAR(16) NOT NULL,
       email VARCHAR(35),
       joined DATE NOT NULL
   )
   PARTITION BY RANGE COLUMNS(joined) (
       PARTITION p0 VALUES LESS THAN ('1960-01-01'),
       PARTITION p1 VALUES LESS THAN ('1970-01-01'),
       PARTITION p2 VALUES LESS THAN ('1980-01-01'),
       PARTITION p3 VALUES LESS THAN ('1990-01-01'),
       PARTITION p4 VALUES LESS THAN MAXVALUE
   );
   ```

Nota

O uso de colunas de partitioning que empregam tipos de data ou hora diferentes de [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") não é suportado com `RANGE COLUMNS`.