### 26.2.1 Partição por intervalo

Uma tabela que é particionada por intervalo é particionada de forma que cada partição contenha linhas para as quais o valor da expressão de particionamento esteja dentro de um intervalo dado. Os intervalos devem ser contínuos, mas não sobrepostos, e são definidos usando o operador `MENOS QUE`. Para os próximos exemplos, suponha que você esteja criando uma tabela como a seguinte para armazenar registros de pessoal para uma cadeia de 20 lojas de vídeo, numeradas de 1 a 20:

```
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

A tabela `employees` usada aqui não tem chaves primárias ou únicas. Embora os exemplos funcionem como mostrado para os propósitos da presente discussão, você deve ter em mente que, na prática, as tabelas têm uma alta probabilidade de ter chaves primárias, chaves únicas ou ambas, e que as escolhas permitidas para as colunas de particionamento dependem das colunas usadas para essas chaves, se houver alguma presente. Para uma discussão dessas questões, consulte a Seção 26.6.1, “Chaves de particionamento, chaves primárias e chaves únicas”.

Esta tabela pode ser particionada por intervalo de várias maneiras, dependendo das suas necessidades. Uma maneira seria usar a coluna `store_id`. Por exemplo, você pode decidir particionar a tabela 4 maneiras adicionando uma cláusula `PARTITION BY RANGE` como mostrado aqui:

```
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

Neste esquema de particionamento, todas as linhas correspondentes a funcionários que trabalham em lojas 1 a 5 são armazenadas na partição `p0`, para aqueles empregados em lojas 6 a 10 são armazenados na partição `p1`, e assim por diante. Cada partição é definida em ordem, do menor para o maior. Isso é um requisito da sintaxe `PARTITION BY RANGE`; você pode pensar nisso como sendo análogo a uma série de declarações `if ... elseif ...` em C ou Java nesse sentido.

É fácil determinar que uma nova linha contendo os dados `(72, 'Mitchell', 'Wilson', '1998-06-25', DEFAULT, 7, 13)` é inserida na partição `p2`, mas o que acontece quando sua cadeia adiciona uma 21ª loja? Sob este esquema, não há nenhuma regra que cubra uma linha cujo `store_id` é maior que 20, então ocorre um erro porque o servidor não sabe onde colocá-la. Você pode evitar isso usando uma cláusula `VALUES MENOS QUE` como parte da instrução `CREATE TABLE` que prevê todos os valores maiores que o valor mais alto explicitamente nomeado:

```
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

(Como com os outros exemplos neste capítulo, assumimos que o motor de armazenamento padrão é `InnoDB`.

Outra maneira de evitar um erro quando não é encontrado um valor correspondente é usar a palavra-chave `IGNORE` como parte da instrução `INSERT`. Para um exemplo, veja a Seção 26.2.2, “LIST Partitioning”.

`MAXVALUE` representa um valor inteiro que é sempre maior que o valor inteiro mais alto possível (em linguagem matemática, serve como um limite inferior máximo). Agora, quaisquer linhas cujo valor da coluna `store_id` é maior ou igual a 16 (o valor mais alto definido) são armazenadas na partição `p3`. Em algum momento no futuro — quando o número de lojas tiver aumentado para 25, 30 ou mais — você pode usar uma instrução `ALTER TABLE` para adicionar novas partições para as lojas 21-25, 26-30, e assim por diante (veja a Seção 26.3, “Partition Management”, para detalhes de como fazer isso).

Da mesma forma, você pode particionar a tabela com base nos códigos de emprego dos funcionários — ou seja, com base em faixas de valores da coluna `job_code`. Por exemplo, supondo que códigos de dois dígitos sejam usados para trabalhadores regulares (na loja), códigos de três dígitos sejam usados para funcionários de escritório e suporte, e códigos de quatro dígitos sejam usados para cargos de gestão — você pode criar a tabela particionada usando a seguinte instrução:

```
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

Neste caso, todas as linhas relacionadas a trabalhadores na loja seriam armazenadas na partição `p0`, as relacionadas a funcionários de escritório e suporte na `p1`, e as relacionadas a gestores na partição `p2`.

Também é possível usar uma expressão nas cláusulas `VALUES LESS THAN`. No entanto, o MySQL deve ser capaz de avaliar o valor de retorno da expressão como parte de uma comparação `LESS THAN` (`<`).

Em vez de dividir os dados da tabela de acordo com o número da loja, você pode usar uma expressão baseada em uma das duas colunas `DATE`. Por exemplo, vamos supor que você queira particionar com base no ano em que cada funcionário deixou a empresa; ou seja, o valor de `YEAR(separated)`. Um exemplo de instrução `CREATE TABLE` que implementa um esquema de particionamento assim é mostrado aqui:

```
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

Neste esquema, para todos os funcionários que deixaram antes de 1991, as linhas são armazenadas na partição `p0`; para aqueles que deixaram nos anos de 1991 a 1995, na `p1`; para aqueles que deixaram nos anos de 1996 a 2000, na `p2`; e para quaisquer trabalhadores que deixaram após o ano de 2000, na `p3`.

Também é possível particionar uma tabela por `RANGE`, com base no valor de uma coluna `TIMESTAMP`, usando a função `UNIX_TIMESTAMP()`, como mostrado neste exemplo:

```
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

Quaisquer outras expressões que envolvam valores de `TIMESTAMP` não são permitidas. (Veja o bug #42849.)

A partição por intervalo é particularmente útil quando uma ou mais das seguintes condições são verdadeiras:

* Você deseja ou precisa deletar dados "antigos". Se você estiver usando o esquema de partição mostrado anteriormente para a tabela `employees`, você pode simplesmente usar `ALTER TABLE employees DROP PARTITION p0;` para deletar todas as linhas relacionadas a funcionários que pararam de trabalhar para a empresa antes de 1991. (Veja a Seção 15.1.11, “Instrução ALTER TABLE”, e a Seção 26.3, “Gestão de Partições”, para mais informações.) Para uma tabela com muitas linhas, isso pode ser muito mais eficiente do que executar uma consulta `DELETE` como `DELETE FROM employees WHERE YEAR(separated) <= 1990;`.

* Você deseja usar uma coluna que contenha valores de data ou hora, ou que contenha valores provenientes de alguma outra série.

* Você executa frequentemente consultas que dependem diretamente da coluna usada para a partição da tabela. Por exemplo, ao executar uma consulta como `EXPLAIN SELECT COUNT(*) FROM employees WHERE separated BETWEEN '2000-01-01' AND '2000-12-31' GROUP BY store_id;`, o MySQL pode determinar rapidamente que apenas a partição `p2` precisa ser analisada, porque as partições restantes não podem conter nenhum registro que satisfaça a cláusula `WHERE`. Veja a Seção 26.4, “Pruning de Partições”, para mais informações sobre como isso é realizado.

Uma variante deste tipo de partição é a partição `RANGE COLUMNS`. A partição por `RANGE COLUMNS` permite o uso de múltiplas colunas para definir intervalos de partição que se aplicam tanto ao posicionamento das linhas nas partições quanto para determinar a inclusão ou exclusão de partições específicas ao realizar o pruning de partições. Veja a Seção 26.2.3.1, “Partição RANGE COLUMNS”, para mais informações.

**Sistemas de partição baseados em intervalos de tempo.** Se você deseja implementar um esquema de partição baseado em intervalos ou faixas de tempo no MySQL 9.5, você tem duas opções:

1. Partilhe a tabela por `RANGE`, e, para a expressão de partição, utilize uma função que opere em uma coluna `DATE`, `TIME` ou `DATETIME` e retorne um valor inteiro, conforme mostrado aqui:

   ```
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

   No MySQL 9.5, também é possível partilhar uma tabela por `RANGE` com base no valor de uma coluna `TIMESTAMP`, usando a função `UNIX_TIMESTAMP()`, conforme mostrado neste exemplo:

   ```
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

   No MySQL 9.5, quaisquer outras expressões que envolvam valores de `TIMESTAMP` não são permitidas. (Veja o Bug #42849.)

   Nota

   Também é possível, no MySQL 9.5, usar `UNIX_TIMESTAMP(timestamp_column)` como uma expressão de partição para tabelas que são particionadas por `LIST`. No entanto, geralmente não é prático fazer isso.

2. Partilhe a tabela por `RANGE COLUMNS`, usando uma coluna `DATE` ou `DATETIME` como a coluna de partição. Por exemplo, a tabela `members` poderia ser definida usando a coluna `joined` diretamente, conforme mostrado aqui:

   ```
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

O uso de colunas de partição que empregam tipos de data ou hora diferentes de `DATE` ou `DATETIME` não é suportado com `RANGE COLUMNS`.