### 22.2.1 Partição de alcance

Uma tabela que é particionada por intervalo é particionada de forma que cada partição contenha linhas para as quais o valor da expressão de particionamento esteja dentro de um intervalo dado. Os intervalos devem ser contínuos, mas não sobrepostos, e são definidos usando o operador `MENOS QUE`. Para os próximos exemplos, suponha que você esteja criando uma tabela como a seguinte para armazenar registros de pessoal para uma cadeia de 20 lojas de vídeo, numeradas de 1 a 20:

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

A tabela `employees` usada aqui não tem chaves primárias ou únicas. Embora os exemplos funcionem conforme mostrado para os propósitos da presente discussão, você deve ter em mente que, na prática, as tabelas têm uma grande probabilidade de ter chaves primárias, chaves únicas ou ambas, e que as opções permitidas para a partição de colunas dependem das colunas usadas para essas chaves, se houver alguma presente. Para uma discussão sobre essas questões, consulte Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”.

Essa tabela pode ser particionada por intervalo de várias maneiras, dependendo das suas necessidades. Uma maneira seria usar a coluna `store_id`. Por exemplo, você pode decidir particionar a tabela de 4 maneiras, adicionando uma cláusula `PARTITION BY RANGE`, como mostrado aqui:

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

Nesse esquema de particionamento, todas as linhas correspondentes a funcionários que trabalham nas lojas 1 a 5 são armazenadas na partição `p0`, aqueles empregados nas lojas 6 a 10 são armazenados na partição `p1`, e assim por diante. Observe que cada partição é definida em ordem, do menor para o maior. Esse é um requisito da sintaxe `PARTITION BY RANGE`; você pode pensar nisso como sendo análogo a uma série de instruções `if ... elseif ...` em C ou Java nesse sentido.

É fácil determinar que uma nova linha contendo os dados `(72, 'Mitchell', 'Wilson', '1998-06-25', DEFAULT, 7, 13)` é inserida na partição `p2`, mas o que acontece quando sua cadeia adiciona uma 21ª loja? Sob este esquema, não há nenhuma regra que cubra uma linha cujo `store_id` é maior que 20, então ocorre um erro porque o servidor não sabe onde colocá-lo. Você pode evitar isso usando uma cláusula `VALUES MENOS QUE` de "catchall" na declaração `CREATE TABLE` que prevê todos os valores maiores que o valor mais alto explicitamente nomeado:

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

Outra maneira de evitar um erro quando não for encontrado um valor correspondente é usar a palavra-chave `IGNORE` como parte da instrução `INSERT`. Para um exemplo, veja Seção 22.2.2, “Divisão de LISTA”.

`MAXVALUE` representa um valor inteiro que é sempre maior que o valor inteiro mais alto possível (em linguagem matemática, ele serve como um limite inferior). Agora, quaisquer linhas cujo valor na coluna `store_id` seja maior ou igual a 16 (o valor mais alto definido) são armazenadas na partição `p3`. Em algum momento no futuro — quando o número de lojas tiver aumentado para 25, 30 ou mais — você pode usar uma declaração `ALTER TABLE` (alter-table-partition-operations.html) para adicionar novas partições para as lojas 21-25, 26-30, e assim por diante (consulte Seção 22.3, “Gestão de Partições”, para detalhes de como fazer isso).

Da mesma forma, você poderia particionar a tabela com base nos códigos de emprego dos funcionários — ou seja, com base em intervalos de valores da coluna `job_code`. Por exemplo, supondo que códigos de emprego de dois dígitos sejam usados para trabalhadores regulares (na loja), códigos de três dígitos sejam usados para pessoal de escritório e suporte, e códigos de quatro dígitos sejam usados para cargos de gestão — você poderia criar a tabela particionada usando a seguinte declaração:

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

Nesse caso, todas as linhas relacionadas aos funcionários da loja seriam armazenadas na partição `p0`, as relacionadas ao pessoal de escritório e suporte na `p1`, e as relacionadas aos gerentes na partição `p2`.

Também é possível usar uma expressão nas cláusulas `VALUES MENOS QUE`. No entanto, o MySQL deve ser capaz de avaliar o valor de retorno da expressão como parte de uma comparação `MENOS QUE` (`<`).

Em vez de dividir os dados da tabela de acordo com o número da loja, você pode usar uma expressão baseada em uma das duas colunas de `DATA`. Por exemplo, vamos supor que você deseja particionar com base no ano em que cada funcionário deixou a empresa; ou seja, o valor de `ANO(separado)`. Um exemplo de uma instrução `CREATE TABLE` que implementa um esquema de particionamento desse tipo é mostrado aqui:

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

Nesse esquema, para todos os funcionários que saíram antes de 1991, as linhas são armazenadas na partição `p0`; para aqueles que saíram nos anos de 1991 a 1995, na `p1`; para aqueles que saíram nos anos de 1996 a 2000, na `p2`; e para quaisquer trabalhadores que saíram após o ano de 2000, na `p3`.

Também é possível particionar uma tabela por `RANGE`, com base no valor de uma coluna de tipo `[TIMESTAMP]` (datetime.html), usando a função `[UNIX_TIMESTAMP()` (date-and-time-functions.html#function\_unix-timestamp), como mostrado neste exemplo:

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

Quaisquer outras expressões que envolvam valores de `TIMESTAMP` não são permitidas. (Veja o Bug #42849.)

A partição de faixa é particularmente útil quando uma ou mais das seguintes condições são verdadeiras:

- Você deseja ou precisa deletar dados “antigos”. Se você estiver usando o esquema de particionamento mostrado anteriormente para a tabela `employees`, você pode simplesmente usar `ALTER TABLE employees DROP PARTITION p0;` para deletar todas as linhas relacionadas a funcionários que pararam de trabalhar para a empresa antes de 1991. (Veja Seção 13.1.8, “Instrução ALTER TABLE” e Seção 22.3, “Gestão de Partições” para mais informações.) Para uma tabela com muitas linhas, isso pode ser muito mais eficiente do que executar uma consulta de `DELETE` como `DELETE FROM employees WHERE YEAR(separated) <= 1990;`.

- Você deseja usar uma coluna que contenha valores de data ou hora ou valores provenientes de outras séries.

- Você executa frequentemente consultas que dependem diretamente da coluna usada para particionar a tabela. Por exemplo, ao executar uma consulta como `EXPLAIN SELECT COUNT(*) FROM employees WHERE separated BETWEEN '2000-01-01' AND '2000-12-31' GROUP BY store_id;`, o MySQL pode determinar rapidamente que apenas a partição `p2` precisa ser analisada, porque as partições restantes não podem conter nenhum registro que satisfaça a cláusula `WHERE`. Consulte Seção 22.4, “Pruning de Partições” para obter mais informações sobre como isso é feito.

Uma variante deste tipo de particionamento é o particionamento por `RANGE COLUMNS`. O particionamento por `RANGE COLUMNS` permite o uso de múltiplas colunas para definir intervalos de particionamento que se aplicam tanto ao posicionamento das linhas nas partições quanto para determinar a inclusão ou exclusão de partições específicas ao realizar o corte de partições. Consulte Seção 22.2.3.1, “Particionamento por RANGE COLUMNS” para obter mais informações.

**Sistemas de partição baseados em intervalos de tempo.** Se você deseja implementar um sistema de partição baseado em faixas ou intervalos de tempo no MySQL 5.7, você tem duas opções:

1. Divida a tabela por `RANGE` e, para a expressão de particionamento, utilize uma função que opere em uma coluna de `DATA`, `HORÁRIO` ou `DATA/HORÁRIO` e retorne um valor inteiro, conforme mostrado aqui:

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

   No MySQL 5.7, também é possível particionar uma tabela por `RANGE` com base no valor de uma coluna de tipo `[TIMESTAMP]` (datetime.html), usando a função `[UNIX_TIMESTAMP()` (date-and-time-functions.html#function\_unix-timestamp), como mostrado neste exemplo:

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

   No MySQL 5.7, quaisquer outras expressões que envolvam valores de `TIMESTAMP` não são permitidas. (Veja o bug #42849.)

   Nota

   Também é possível, no MySQL 5.7, usar `UNIX_TIMESTAMP(timestamp_column)` como uma expressão de partição para tabelas que são particionadas por `LIST`. No entanto, geralmente não é prático fazer isso.

2. Divida a tabela por `RANGE COLUMNS`, usando uma coluna `[DATA]` (datetime.html) ou `DATETIME` (datetime.html) como a coluna de particionamento. Por exemplo, a tabela `members` pode ser definida usando a coluna `joined` diretamente, como mostrado aqui:

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

O uso de colunas de partição que empregam tipos de data ou hora diferentes de `DATE` ou `DATETIME` não é suportado com `COLUMNS DE CAMADA DE RANGEMENTE`.
