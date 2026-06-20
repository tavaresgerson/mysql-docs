## 22.2 Tipos de Partição

Esta seção discute os tipos de particionamento disponíveis no MySQL 5.7. Estes incluem os tipos listados aqui:

* **Partitionamento de intervalo.** Este tipo de particionamento atribui linhas a partições com base nos valores de coluna que caem dentro de um intervalo dado. Consulte a Seção 22.2.1, “Partitionamento de intervalo”. Para informações sobre uma extensão deste tipo, `RANGE COLUMNS`, consulte a Seção 22.2.3.1, “Partitionamento de COLUNAS de intervalo”.

* **Partição LIST.** Semelhante à partição por `RANGE`, exceto que a partição é selecionada com base em colunas que correspondem a um dos conjuntos de valores discretos. Consulte a Seção 22.2.2, “Partição LIST”. Para informações sobre uma extensão deste tipo, `LIST COLUMNS`, consulte a Seção 22.2.3.2, “Partição de COLUNAS LIST”.

* **Partição HASH.** Com este tipo de partição, uma partição é selecionada com base no valor retornado por uma expressão definida pelo usuário que opera nos valores das colunas nas linhas que serão inseridas na tabela. A função pode consistir em qualquer expressão válida no MySQL que produza um valor inteiro. Veja a Seção 22.2.4, “Partição HASH”.

Uma extensão deste tipo, `LINEAR HASH`, também está disponível, veja a Seção 22.2.4.1, “Divisão de Partição de HASH LINEAR”.

* **Partição de chave.** Este tipo de partição é semelhante à partição por `HASH`, exceto que apenas uma ou mais colunas a serem avaliadas são fornecidas, e o servidor MySQL fornece sua própria função de hashing. Essas colunas podem conter valores que não são inteiros, uma vez que a função de hashing fornecida pelo MySQL garante um resultado inteiro, independentemente do tipo de dados da coluna. Uma extensão para este tipo, `LINEAR KEY`, também está disponível. Veja a Seção 22.2.5, “Partição de Chave”.

Um uso muito comum da partição de banco de dados é segregar os dados por data. Alguns sistemas de banco de dados suportam partição explícita de data, o que o MySQL não implementa no 5.7. No entanto, não é difícil no MySQL criar esquemas de partição com base nas colunas `DATE`, `TIME` ou `DATETIME`, ou com base em expressões que utilizam tais colunas.

Ao particionar por `KEY` ou `LINEAR KEY`, você pode usar uma coluna `DATE`, `TIME` ou `DATETIME` como a coluna de particionamento sem realizar nenhuma modificação no valor da coluna. Por exemplo, essa declaração de criação de tabela é perfeitamente válida no MySQL:

```sql
CREATE TABLE members (
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(35),
    joined DATE NOT NULL
)
PARTITION BY KEY(joined)
PARTITIONS 6;
```

Em MySQL 5.7, também é possível usar uma coluna `DATE` ou `DATETIME` como coluna de particionamento usando a particionamento `RANGE COLUMNS` e `LIST COLUMNS`.

Os outros tipos de particionamento do MySQL, no entanto, exigem uma expressão de particionamento que produza um valor inteiro ou `NULL`. Se você deseja usar particionamento baseado em data por `RANGE`, `LIST`, `HASH` ou `LINEAR HASH`, você pode simplesmente empregar uma função que opere em uma coluna `DATE`, `TIME` ou `DATETIME` e retorne tal valor, como mostrado aqui:

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

Exemplos adicionais de particionamento usando datas podem ser encontrados nas seções seguintes deste capítulo:

* Seção 22.2.1, “Divisão de alcance”  
* Seção 22.2.4, “Divisão de HASH”  
* Seção 22.2.4.1, “Divisão de HASH LINEAR”

Para exemplos mais complexos de partição baseada em data, consulte as seções a seguir:

* Seção 22.4, “Rugosidade de Partição” * Seção 22.2.6, “Subpartição”

A partição do MySQL é otimizada para uso com as funções `TO_DAYS()`, `YEAR()` e `TO_SECONDS()`. No entanto, você pode usar outras funções de data e hora que retornam um inteiro ou `NULL`, como `WEEKDAY()`, `DAYOFYEAR()` ou `MONTH()`. Consulte a Seção 12.7, “Funções de Data e Hora”, para obter mais informações sobre essas funções.

É importante lembrar — independentemente do tipo de particionamento que você usa — que as partições são sempre numeradas automaticamente e em sequência quando criadas, começando com `0`. Quando uma nova linha é inserida em uma tabela particionada, são esses números de partição que são usados para identificar a partição correta. Por exemplo, se sua tabela usa 4 partições, essas partições são numeradas `0`, `1`, `2` e `3`. Para os tipos de particionamento `RANGE` e `LIST`, é necessário garantir que haja uma partição definida para cada número de partição. Para o particionamento `HASH`, a expressão fornecida pelo usuário deve avaliar a um valor inteiro. Para o particionamento `KEY`, essa questão é cuidada automaticamente pela função de hashing que o servidor MySQL emprega internamente.

Os nomes das partições geralmente seguem as regras que regem outros identificadores do MySQL, como os das tabelas e bancos de dados. No entanto, você deve notar que os nomes das partições não são sensíveis ao caso. Por exemplo, a seguinte declaração `CREATE TABLE` falha como mostrado:

```sql
mysql> CREATE TABLE t2 (val INT)
    -> PARTITION BY LIST(val)(
    ->     PARTITION mypart VALUES IN (1,3,5),
    ->     PARTITION MyPart VALUES IN (2,4,6)
    -> );
ERROR 1488 (HY000): Duplicate partition name mypart
```

O erro ocorre porque o MySQL não vê nenhuma diferença entre os nomes das partições `mypart` e `MyPart`.

Quando você especificar o número de partições para a tabela, isso deve ser expresso como um literal inteiro positivo e não nulo, sem zeros na frente, e não pode ser uma expressão como `0.8E+01` ou `6-2`, mesmo que se evolva para um valor inteiro. Frações decimais não são permitidas.

Nas seções que se seguem, não fornecemos necessariamente todas as formas possíveis para a sintaxe que pode ser usada para criar cada tipo de partição; essas informações podem ser encontradas na Seção 13.1.18, “Declaração CREATE TABLE”.

### 22.2.1 Particionamento de alcance

Uma tabela que é dividida por intervalo é dividida de tal forma que cada partição contém linhas para as quais o valor da expressão de partição está dentro de um intervalo dado. Os intervalos devem ser contínuos, mas não sobrepostos, e são definidos usando o operador `VALUES LESS THAN`. Para os próximos exemplos, suponha que você esteja criando uma tabela como a seguinte para armazenar registros de pessoal para uma cadeia de 20 lojas de vídeo, numeradas de 1 a 20:

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

A tabela `employees` usada aqui não possui chaves primárias ou únicas. Embora os exemplos funcionem conforme mostrado para os propósitos da presente discussão, você deve ter em mente que, na prática, as tabelas têm grande probabilidade de ter chaves primárias, chaves únicas ou ambas, e que as escolhas permitidas para a partição de colunas dependem das colunas usadas para essas chaves, se houver alguma presente. Para uma discussão sobre essas questões, consulte a Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”.

Essa tabela pode ser dividida por intervalo de várias maneiras, dependendo das suas necessidades. Uma maneira seria usar a coluna `store_id`. Por exemplo, você pode decidir dividir a tabela de 4 maneiras, adicionando uma cláusula `PARTITION BY RANGE` como mostrado aqui:

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

Neste esquema de particionamento, todas as linhas correspondentes aos funcionários que trabalham nas lojas 1 a 5 são armazenadas na partição `p0`, as empregadas nas lojas 6 a 10 são armazenadas na partição `p1`, e assim por diante. Note que cada partição é definida em ordem, do menor para o maior. Este é um requisito da sintaxe do `PARTITION BY RANGE`; você pode pensar nisso como sendo análogo a uma série de declarações `if ... elseif ...` em C ou Java a esse respeito.

É fácil determinar que uma nova linha contendo os dados `(72, 'Mitchell', 'Wilson', '1998-06-25', DEFAULT, 7, 13)` é inserida na partição `p2`, mas o que acontece quando sua cadeia adiciona uma 21ª loja? Sob este esquema, não há nenhuma regra que cubra uma linha cujo `store_id` é maior que 20, então um erro resulta porque o servidor não sabe onde colocá-lo. Você pode evitar que isso ocorra usando uma cláusula de “catchall” `VALUES LESS THAN` na declaração `CREATE TABLE` que prevê todos os valores maiores que o valor mais alto explicitamente nomeado:

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

Outra maneira de evitar um erro quando não é encontrado um valor correspondente é usar a palavra-chave `IGNORE` como parte da declaração `INSERT`. Para um exemplo, veja a Seção 22.2.2, “Divisão de LIST”.

`MAXVALUE` representa um valor inteiro que é sempre maior que o valor inteiro mais alto possível (em linguagem matemática, serve como um limite inferior). Agora, quaisquer linhas cujos valores na coluna `store_id` são maiores ou iguais a 16 (o valor mais alto definido) são armazenadas na partição `p3`. Em algum momento no futuro — quando o número de lojas tiver aumentado para 25, 30 ou mais — você pode usar uma declaração `ALTER TABLE` para adicionar novas partições para as lojas 21-25, 26-30, e assim por diante (consulte a Seção 22.3, “Gestão de Partições”, para detalhes de como fazer isso).

De maneira muito semelhante, você poderia particionar a tabela com base nos códigos de emprego dos funcionários, ou seja, com base em intervalos de valores da coluna `job_code`. Por exemplo, supondo que códigos de emprego de dois dígitos são usados para trabalhadores regulares (no local) e códigos de três dígitos são usados para pessoal de escritório e suporte, e códigos de quatro dígitos são usados para posições de gestão, você poderia criar a tabela particionada usando a seguinte declaração:

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

Neste caso, todas as linhas relacionadas aos trabalhadores da loja seriam armazenadas na partição `p0`, as relacionadas ao pessoal de escritório e suporte na `p1`, e as relacionadas aos gerentes na partição `p2`.

É também possível usar uma expressão nas cláusulas de `VALUES LESS THAN`. No entanto, o MySQL deve ser capaz de avaliar o valor de retorno da expressão como parte de uma comparação de `LESS THAN` (`<`).

Em vez de dividir os dados da tabela de acordo com o número da loja, você pode usar uma expressão com base em uma das duas colunas `DATE`. Por exemplo, vamos supor que você queira particionar com base no ano em que cada funcionário deixou a empresa; ou seja, o valor de `YEAR(separated)`. Um exemplo de uma declaração `CREATE TABLE` que implementa tal esquema de particionamento é mostrado aqui:

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

Neste esquema, para todos os funcionários que saíram antes de 1991, as linhas são armazenadas na partição `p0`; para aqueles que saíram nos anos de 1991 a 1995, na `p1`; para aqueles que saíram nos anos de 1996 a 2000, na `p2`; e para quaisquer trabalhadores que saíram após o ano de 2000, na `p3`.

É também possível particionar uma tabela por `RANGE`, com base no valor de uma coluna `TIMESTAMP`, usando a função `UNIX_TIMESTAMP()`, conforme mostrado neste exemplo:

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

A divisão de faixa é particularmente útil quando uma ou mais das seguintes condições são verdadeiras:

* Você quer ou precisa deletar dados "antigos". Se você está usando o esquema de particionamento mostrado anteriormente para a tabela `employees`, pode simplesmente usar `ALTER TABLE employees DROP PARTITION p0;` para deletar todas as linhas relacionadas a funcionários que pararam de trabalhar para a empresa antes de 1991. (Consulte a Seção 13.1.8, "Declaração ALTER TABLE", e a Seção 22.3, "Gestão de Partições", para mais informações.) Para uma tabela com muitas linhas, isso pode ser muito mais eficiente do que executar uma consulta `DELETE`, como `DELETE FROM employees WHERE YEAR(separated) <= 1990;`.

* Você deseja usar uma coluna que contenha valores de data ou hora, ou que contenha valores resultantes de outras séries.

* Você executa frequentemente consultas que dependem diretamente da coluna usada para particionar a tabela. Por exemplo, ao executar uma consulta como `EXPLAIN SELECT COUNT(*) FROM employees WHERE separated BETWEEN '2000-01-01' AND '2000-12-31' GROUP BY store_id;`, o MySQL pode rapidamente determinar que apenas a partição `p2` precisa ser analisada, porque as partições restantes não podem conter quaisquer registros que satisfaçam a cláusula `WHERE`. Consulte a Seção 22.4, “Rugosidade da Partição”, para obter mais informações sobre como isso é realizado.

Uma variante deste tipo de particionamento é o particionamento `RANGE COLUMNS`. A particionamento por `RANGE COLUMNS` permite o uso de múltiplas colunas para definir os intervalos de particionamento que se aplicam tanto à colocação de linhas nas partições quanto para determinar a inclusão ou exclusão de partições específicas ao realizar o corte de partições. Consulte a Seção 22.2.3.1, “Particionamento de COLUNAS de RANGEMENTE”, para obter mais informações.

**Sistemas de particionamento com base em intervalos de tempo.** Se você deseja implementar um sistema de particionamento com base em intervalos ou faixas de tempo no MySQL 5.7, você tem duas opções:

1. Divida a tabela por `RANGE`, e, para a expressão de particionamento, utilize uma função que opere em uma coluna de `DATE`, `TIME` ou `DATETIME` e retorne um valor inteiro, conforme mostrado aqui:

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

Em MySQL 5.7, também é possível particionar uma tabela por `RANGE` com base no valor de uma coluna `TIMESTAMP`, usando a função `UNIX_TIMESTAMP()`, como mostrado neste exemplo:

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

Em MySQL 5.7, quaisquer outras expressões que envolvam valores de `TIMESTAMP` não são permitidas. (Veja o Bug #42849.)

Nota

Também é possível, no MySQL 5.7, usar `UNIX_TIMESTAMP(timestamp_column)` como uma expressão de partição para tabelas que são particionadas por `LIST`. No entanto, geralmente não é prático fazer isso.

2. Parta a tabela por `RANGE COLUMNS`, usando uma coluna `DATE` ou `DATETIME` como a coluna de partição. Por exemplo, a tabela `members` pode ser definida usando a coluna `joined` diretamente, como mostrado aqui:

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

O uso de colunas de partição que empregam tipos de data ou hora diferentes de `DATE` ou `DATETIME` não é suportado com `RANGE COLUMNS`.

### 22.2.2 Partição da LISTA

A partição de listas no MySQL é semelhante à partição por intervalo em muitos aspectos. Assim como na partição por `RANGE`, cada partição deve ser explicitamente definida. A principal diferença entre os dois tipos de partição é que, na partição de listas, cada partição é definida e selecionada com base na pertença de um valor de coluna em um dos conjuntos de listas de valores, em vez de em um dos conjuntos de intervalos contíguos de valores. Isso é feito usando `PARTITION BY LIST(expr)`, onde *`expr`* é um valor de coluna ou uma expressão baseada em um valor de coluna e retornando um valor inteiro, e então definindo cada partição por meio de um `VALUES IN (value_list)`, onde *`value_list`* é uma lista de inteiros separados por vírgula.

Nota

Em MySQL 5.7, é possível fazer correspondência apenas com uma lista de inteiros (e possivelmente `NULL` — veja Seção 22.2.7, “Como a Partição do MySQL lida com NULL”) ao particionar por `LIST`.

No entanto, outros tipos de colunas podem ser utilizados em listas de valores ao empregar a partição `LIST COLUMN`, que é descrita mais adiante nesta seção.

Ao contrário do que ocorre com as partições definidas por intervalo, as partições de lista não precisam ser declaradas em qualquer ordem específica. Para informações sintáticas mais detalhadas, consulte a Seção 13.1.18, “Instrução CREATE TABLE”.

Para os exemplos que se seguem, assumimos que a definição básica da tabela a ser particionada é fornecida pela declaração `CREATE TABLE` mostrada aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
);
```

(Esta é a mesma tabela usada como base para os exemplos na Seção 22.2.1, “Divisão por intervalo”.)

Suponha que haja 20 lojas de vídeo distribuídas entre 4 franquias, conforme mostrado na tabela a seguir.

<table summary="An example of 20 video stores distributed among 4 regional franchises, as described in the preceding text."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Region</th> <th>Números de identificação de lojas</th> </tr></thead><tbody><tr> <td>North</td> <td>3, 5, 6, 9, 17</td> </tr><tr> <td>East</td> <td>1, 2, 10, 11, 19, 20</td> </tr><tr> <td>West</td> <td>4, 12, 13, 14, 18</td> </tr><tr> <td>Central</td> <td>7, 8, 15, 16</td> </tr></tbody></table>

Para particionar essa tabela de forma que as linhas dos estabelecimentos que pertencem à mesma região sejam armazenadas na mesma partição, você pode usar a declaração `CREATE TABLE` mostrada aqui:

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
PARTITION BY LIST(store_id) (
    PARTITION pNorth VALUES IN (3,5,6,9,17),
    PARTITION pEast VALUES IN (1,2,10,11,19,20),
    PARTITION pWest VALUES IN (4,12,13,14,18),
    PARTITION pCentral VALUES IN (7,8,15,16)
);
```

Isso facilita a adição ou remoção de registros de funcionários relacionados a regiões específicas na tabela. Por exemplo, suponha que todas as lojas da região Oeste sejam vendidas para outra empresa. No MySQL 5.7, todas as linhas relacionadas a funcionários que trabalham em lojas dessa região podem ser excluídas com a consulta `ALTER TABLE employees TRUNCATE PARTITION pWest`, que pode ser executada de forma muito mais eficiente do que a declaração equivalente `DELETE` `DELETE FROM employees WHERE store_id IN (4,12,13,14,18);`. (Usando `ALTER TABLE employees DROP PARTITION pWest` também excluiria todas essas linhas, mas também removeria a partição `pWest` da definição da tabela; você precisaria usar uma declaração `ALTER TABLE ... ADD PARTITION` para restaurar o esquema de partição original da tabela.)

Assim como na partição `RANGE`, é possível combinar a partição `LIST` com a partição por hash ou chave para produzir uma partição composta (subpartição). Veja a Seção 22.2.6, “Subpartição”.

Ao contrário do caso do particionamento `RANGE`, não há um "tudo-pode" como `MAXVALUE`; todos os valores esperados para a expressão de particionamento devem ser cobertos nas cláusulas `PARTITION ... VALUES IN (...)`. Uma declaração `INSERT` que contém um valor de coluna de particionamento não correspondente falha com um erro, como mostrado neste exemplo:

```sql
mysql> CREATE TABLE h2 (
    ->   c1 INT,
    ->   c2 INT
    -> )
    -> PARTITION BY LIST(c1) (
    ->   PARTITION p0 VALUES IN (1, 4, 7),
    ->   PARTITION p1 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.11 sec)

mysql> INSERT INTO h2 VALUES (3, 5);
ERROR 1525 (HY000): Table has no partition for value 3
```

Ao inserir várias linhas usando uma única declaração `INSERT`, o comportamento depende se a tabela usa um mecanismo de armazenamento transacional. Para uma tabela `InnoDB`, a declaração é considerada uma única transação, portanto, a presença de quaisquer valores não correspondentes faz com que a declaração falhe completamente, e nenhuma linha é inserida. Para uma tabela que usa um mecanismo de armazenamento não transacional, como `MyISAM`, quaisquer linhas que vêm antes da linha que contém o valor não correspondente são inseridas, mas quaisquer que vêm depois dela não são.

Você pode fazer com que esse tipo de erro seja ignorado usando a palavra-chave `IGNORE`, embora uma advertência seja emitida para cada linha que contenha valores de coluna de particionamento não correspondentes, como mostrado aqui.

```sql
mysql> TRUNCATE h2;
Query OK, 1 row affected (0.00 sec)

mysql> TABLE h2;
Empty set (0.00 sec)

mysql> INSERT IGNORE INTO h2 VALUES (2, 5), (6, 10), (7, 5), (3, 1), (1, 9);
Query OK, 3 rows affected, 2 warnings (0.01 sec)
Records: 5  Duplicates: 2  Warnings: 2

mysql> SHOW WARNINGS;
+---------+------+------------------------------------+
| Level   | Code | Message                            |
+---------+------+------------------------------------+
| Warning | 1526 | Table has no partition for value 6 |
| Warning | 1526 | Table has no partition for value 3 |
+---------+------+------------------------------------+
2 rows in set (0.00 sec)
```

Você pode ver no resultado da seguinte declaração `TABLE` que as linhas que contêm valores de coluna de particionamento não correspondentes foram silenciosamente rejeitadas, enquanto as linhas que não contêm valores não correspondentes foram inseridas na tabela:

```sql
mysql> TABLE h2;
+------+------+
| c1   | c2   |
+------+------+
|    7 |    5 |
|    1 |    9 |
|    2 |    5 |
+------+------+
3 rows in set (0.00 sec)
```

O MySQL também oferece suporte para a partição `LIST COLUMNS`, uma variante da partição `LIST` que permite que você use colunas de outros tipos que não inteiro para colunas de partição e use múltiplas colunas como chaves de partição. Para mais informações, consulte a Seção 22.2.3.2, “LIST COLUMNS partição”.

### 22.2.3 Partição de COLUNAS

As próximas duas seções discutem a partição `COLUMNS`, que são variantes da partição `RANGE` e `LIST`. A partição `COLUMNS` permite o uso de múltiplas colunas nas chaves de partição. Todas essas colunas são levadas em consideração tanto para o propósito de colocar as linhas em partições quanto para a determinação de quais partições devem ser verificadas para encontrar linhas correspondentes na poda de partição.

Além disso, tanto o particionamento `RANGE COLUMNS` quanto o particionamento `LIST COLUMNS` suportam o uso de colunas não inteiras para definir intervalos de valores ou membros de lista. Os tipos de dados permitidos são mostrados na lista a seguir:

* Todos os tipos inteiros: `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Isso é o mesmo que com a partição por `RANGE` e `LIST`.).

Outros tipos de dados numéricos (como `DECIMAL` - DECIMAL, NUMERIC") ou `FLOAT` - FLOAT, DOUBLE")) não são suportados como colunas de particionamento.

* `DATE` e `DATETIME`.

Colunas que utilizam outros tipos de dados relacionados a datas ou horários não são suportadas como colunas de particionamento.

* Os seguintes tipos de cadeia: `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

As colunas `TEXT` e `BLOB` não são suportadas como colunas de particionamento.

As discussões sobre a partição de `RANGE COLUMNS` e `LIST COLUMNS` nas próximas duas seções pressupõem que você já está familiarizado com a partição baseada em intervalos e listas, conforme suportado no MySQL 5.1 e versões posteriores; para mais informações sobre esses tópicos, consulte a Seção 22.2.1, “Partição de INTERVALO”, e a Seção 22.2.2, “Partição de LISTA”, respectivamente.

#### 22.2.3.1 Partição de colunas de alcance

A partição de colunas de intervalo é semelhante à partição de intervalo, mas permite que você defina partições usando intervalos com base em múltiplos valores de coluna. Além disso, você pode definir os intervalos usando colunas de outros tipos que não são inteiros.

A partição `RANGE COLUMNS` difere significativamente da partição `RANGE` nas seguintes maneiras:

* `RANGE COLUMNS` não aceita expressões, apenas nomes de colunas.

* `RANGE COLUMNS` aceita uma lista de uma ou mais colunas.

As partições `RANGE COLUMNS` são baseadas em comparações entre tuplas (listas de valores de coluna) e não em comparações entre valores escalares. A colocação das linhas nas partições `RANGE COLUMNS` também é baseada em comparações entre tuplas; isso é discutido mais adiante nesta seção.

* As colunas de particionamento `RANGE COLUMNS` não são restritas a colunas numéricas; as colunas de tipo string, `DATE` e `DATETIME` também podem ser usadas como colunas de particionamento. (Consulte a Seção 22.2.3, “COLUNAS DE PARTICIONAMENTO”, para detalhes.)

A sintaxe básica para criar uma tabela particionada por `RANGE COLUMNS` é mostrada aqui:

```sql
CREATE TABLE table_name
PARTITION BY RANGE COLUMNS(column_list) (
    PARTITION partition_name VALUES LESS THAN (value_list)[,
    PARTITION partition_name VALUES LESS THAN (value_list)][,
    ...]
)

column_list:
    column_name[, column_name][, ...]

value_list:
    value[, value][, ...]
```

Nota

Nem todas as opções de `CREATE TABLE` que podem ser usadas ao criar tabelas particionadas são mostradas aqui. Para informações completas, consulte a Seção 13.1.18, “Declaração CREATE TABLE”.

Na sintaxe mostrada acima, *`column_list`* é uma lista de uma ou mais colunas (às vezes chamada de lista de colunas de particionamento), e *`value_list`* é uma lista de valores (ou seja, é uma lista de valores de definição de particionamento). Um *`value_list`* deve ser fornecido para cada definição de particionamento, e cada *`value_list`* deve ter o mesmo número de valores que o *`column_list`* tem colunas. De forma geral, se você usar *`N`* colunas na cláusula *`COLUMNS`*, então cada cláusula *`VALUES LESS THAN`* também deve ser fornecida com uma lista de *`N`* valores.

Os elementos na lista da coluna de particionamento e na lista de valores que definem cada particionamento devem ocorrer na mesma ordem. Além disso, cada elemento na lista de valores deve ser do mesmo tipo de dados que o elemento correspondente na lista de colunas. No entanto, a ordem dos nomes das colunas na lista de colunas de particionamento e nas listas de valores não precisa ser a mesma que a ordem das definições de coluna da tabela na parte principal da declaração `CREATE TABLE`. Assim como na tabela particionada por `RANGE`, você pode usar `MAXVALUE` para representar um valor de forma que qualquer valor legal inserido em uma coluna dada sempre seja menor que este valor. Aqui está um exemplo de uma declaração `CREATE TABLE` que ajuda a ilustrar todos esses pontos:

```sql
mysql> CREATE TABLE rcx (
    ->     a INT,
    ->     b INT,
    ->     c CHAR(3),
    ->     d INT
    -> )
    -> PARTITION BY RANGE COLUMNS(a,d,c) (
    ->     PARTITION p0 VALUES LESS THAN (5,10,'ggg'),
    ->     PARTITION p1 VALUES LESS THAN (10,20,'mmm'),
    ->     PARTITION p2 VALUES LESS THAN (15,30,'sss'),
    ->     PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
    -> );
Query OK, 0 rows affected (0.15 sec)
```

A tabela `rcx` contém as colunas `a`, `b`, `c`, `d`. A lista de colunas de particionamento fornecida para a cláusula `COLUMNS` usa 3 dessas colunas, na ordem `a`, `d`, `c`. Cada lista de valores usada para definir uma partição contém 3 valores na mesma ordem; ou seja, cada tupla da lista de valores tem a forma (`INT`, `INT`, `CHAR(3)`), que corresponde aos tipos de dados usados pelas colunas `a`, `d`, e `c` (naquela ordem).

A colocação de linhas em partições é determinada pela comparação do tuplo de uma linha a ser inserida que corresponde à lista de colunas na cláusula `COLUMNS` com os tuplos usados nas cláusulas `VALUES LESS THAN` para definir as partições da tabela. Como estamos comparando tuplos (ou seja, listas ou conjuntos de valores) e não valores escalares, a semântica de `VALUES LESS THAN` conforme usado com as partições `RANGE COLUMNS` difere um pouco do caso com partições simples `RANGE`. Na partição `RANGE`, uma linha que gera um valor de expressão que é igual a um valor limite em uma `VALUES LESS THAN` nunca é colocada na partição correspondente; no entanto, ao usar a partição `RANGE COLUMNS`, às vezes é possível que uma linha cujo primeiro elemento da lista de colunas de partição tenha o mesmo valor que o primeiro elemento em uma lista de valores `VALUES LESS THAN` seja colocada na partição correspondente.

Considere a tabela particionada `RANGE` criada por esta declaração:

```sql
CREATE TABLE r1 (
    a INT,
    b INT
)
PARTITION BY RANGE (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos 3 linhas nesta tabela de modo que o valor da coluna para `a` seja `5` para cada linha, todas as 3 linhas serão armazenadas na partição `p1`, pois o valor da coluna `a` não é, em cada caso, menor que 5, como podemos ver executando a consulta adequada contra a tabela do Esquema de Informação `PARTITIONS`:

```sql
mysql> INSERT INTO r1 VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'r1';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Agora, considere uma tabela semelhante `rc1` que utilize a partição `RANGE COLUMNS` com as duas colunas `a` e `b` referenciadas na cláusula `COLUMNS`, criada conforme mostrado aqui:

```sql
CREATE TABLE rc1 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a, b) (
    PARTITION p0 VALUES LESS THAN (5, 12),
    PARTITION p3 VALUES LESS THAN (MAXVALUE, MAXVALUE)
);
```

Se inserimos exatamente as mesmas linhas no `rc1` que acabamos de inserir no `r1`, a distribuição das linhas é bastante diferente:

```sql
mysql> INSERT INTO rc1 VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'rc1';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          2 |
| p3             |          1 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Isso ocorre porque estamos comparando linhas em vez de valores escalares. Podemos comparar os valores das linhas inseridos com o valor da linha limite da cláusula `VALUES THAN LESS THAN`, usada para definir a partição `p0` na tabela `rc1`, da seguinte forma:

```sql
mysql> SELECT (5,10) < (5,12), (5,11) < (5,12), (5,12) < (5,12);
+-----------------+-----------------+-----------------+
| (5,10) < (5,12) | (5,11) < (5,12) | (5,12) < (5,12) |
+-----------------+-----------------+-----------------+
|               1 |               1 |               0 |
+-----------------+-----------------+-----------------+
1 row in set (0.00 sec)
```

Os 2 tuplos `(5,10)` e `(5,11)` são avaliados como menos que `(5,12)`, portanto, são armazenados na partição `p0`. Como 5 não é menos que 5 e 12 não é menos que 12, `(5,12)` é considerado não menos que `(5,12)`, e é armazenado na partição `p1`.

A declaração `SELECT` no exemplo anterior também poderia ter sido escrita usando construtores de linha explícitos, como este:

```sql
SELECT ROW(5,10) < ROW(5,12), ROW(5,11) < ROW(5,12), ROW(5,12) < ROW(5,12);
```

Para mais informações sobre o uso de construtores de linha no MySQL, consulte a Seção 13.2.10.5, “Subconsultas de linha”.

Para uma tabela particionada por `RANGE COLUMNS`, utilizando apenas uma única coluna de particionamento, o armazenamento de linhas nas partições é o mesmo que o de uma tabela equivalente que é particionada por `RANGE`. A seguinte declaração `CREATE TABLE` cria uma tabela particionada por `RANGE COLUMNS`, utilizando 1 coluna de particionamento:

```sql
CREATE TABLE rx (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos as linhas `(5,10)`, `(5,11)` e `(5,12)` nesta tabela, podemos ver que seu posicionamento é o mesmo que o da tabela `r` que criamos e preenchemos anteriormente:

```sql
mysql> INSERT INTO rx VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME,TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'rx';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Também é possível criar tabelas particionadas por `RANGE COLUMNS`, onde os valores limitantes de uma ou mais colunas são repetidos em definições de particionamento sucessivas. Você pode fazer isso, desde que os tuplos de valores de coluna usados para definir as particionamentos sejam estritamente crescentes. Por exemplo, cada uma das seguintes declarações `CREATE TABLE` é válida:

```sql
CREATE TABLE rc2 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a,b) (
    PARTITION p0 VALUES LESS THAN (0,10),
    PARTITION p1 VALUES LESS THAN (10,20),
    PARTITION p2 VALUES LESS THAN (10,30),
    PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE)
 );

CREATE TABLE rc3 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a,b) (
    PARTITION p0 VALUES LESS THAN (0,10),
    PARTITION p1 VALUES LESS THAN (10,20),
    PARTITION p2 VALUES LESS THAN (10,30),
    PARTITION p3 VALUES LESS THAN (10,35),
    PARTITION p4 VALUES LESS THAN (20,40),
    PARTITION p5 VALUES LESS THAN (MAXVALUE,MAXVALUE)
 );
```

A seguinte declaração também é válida, embora possa parecer à primeira vista que não seria, uma vez que o valor limite da coluna `b` é de 25 para a partição `p0` e de 20 para a partição `p1`, e o valor limite da coluna `c` é de 100 para a partição `p1` e de 50 para a partição `p2`:

```sql
CREATE TABLE rc4 (
    a INT,
    b INT,
    c INT
)
PARTITION BY RANGE COLUMNS(a,b,c) (
    PARTITION p0 VALUES LESS THAN (0,25,50),
    PARTITION p1 VALUES LESS THAN (10,20,100),
    PARTITION p2 VALUES LESS THAN (10,30,50),
    PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
 );
```

Ao projetar tabelas particionadas por `RANGE COLUMNS`, você sempre pode testar definições de particionamento sucessivas comparando os tuplos desejados usando o cliente **mysql**, como este:

```sql
mysql> SELECT (0,25,50) < (10,20,100), (10,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (10,20,100) | (10,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        1 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Se uma declaração `CREATE TABLE` contiver definições de partição que não estão em ordem estritamente crescente, ela falha com um erro, conforme mostrado neste exemplo:

```sql
mysql> CREATE TABLE rcf (
    ->     a INT,
    ->     b INT,
    ->     c INT
    -> )
    -> PARTITION BY RANGE COLUMNS(a,b,c) (
    ->     PARTITION p0 VALUES LESS THAN (0,25,50),
    ->     PARTITION p1 VALUES LESS THAN (20,20,100),
    ->     PARTITION p2 VALUES LESS THAN (10,30,50),
    ->     PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
    ->  );
ERROR 1493 (HY000): VALUES LESS THAN value must be strictly increasing for each partition
```

Quando você recebe um erro desse tipo, pode deduzir quais definições de partição são inválidas fazendo comparações de “menos que” entre suas listas de colunas. Neste caso, o problema está com a definição da partição `p2`, porque o tuplo usado para defini-la não é menos que o tuplo usado para definir a partição `p3`, conforme mostrado aqui:

```sql
mysql> SELECT (0,25,50) < (20,20,100), (20,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (20,20,100) | (20,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        0 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Também é possível que `MAXVALUE` apareça para a mesma coluna em mais de uma cláusula `VALUES LESS THAN` ao usar `RANGE COLUMNS`. No entanto, os valores limitantes para colunas individuais em definições de partição consecutivas devem ser, em outras palavras, crescentes, não deve haver mais de uma partição definida onde `MAXVALUE` é usado como o limite superior para todos os valores das colunas, e essa definição de partição deve aparecer na última posição na lista de cláusulas `PARTITION ... VALUES LESS THAN`. Além disso, não é possível usar `MAXVALUE` como o valor limitante para a primeira coluna em mais de uma definição de partição.

Como mencionado anteriormente, também é possível, com a partição `RANGE COLUMNS`, usar colunas não inteiras como colunas de partição. (Consulte a Seção 22.2.3, “PARTIÇÃO DE COLUNAS”, para uma lista completa dessas.) Considere uma tabela denominada `employees` (que não está particionada), criada usando a seguinte declaração:

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

Usando a partição `RANGE COLUMNS`, você pode criar uma versão dessa tabela que armazena cada linha em uma das quatro partições com base no sobrenome do funcionário, como este:

```sql
CREATE TABLE employees_by_lname (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Como alternativa, você pode fazer com que a tabela `employees`, criada anteriormente, seja particionada usando esse esquema, executando a seguinte instrução `ALTER TABLE`:

```sql
ALTER TABLE employees PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Nota

Como diferentes conjuntos de caracteres e codificações têm diferentes ordens de classificação, os conjuntos de caracteres e codificações em uso podem afetar em qual partição de uma tabela particionada por `RANGE COLUMNS` uma determinada linha é armazenada ao usar colunas de texto como colunas de particionamento. Além disso, alterar o conjunto de caracteres ou codificação de um banco de dados, tabela ou coluna específica após a criação de uma tabela pode causar mudanças na forma como as linhas são distribuídas. Por exemplo, ao usar uma codificação sensível ao caso, `'and'` é classificado antes de `'Andersen'`, mas ao usar uma codificação que é sensível ao caso, o contrário é verdadeiro.

Para informações sobre como o MySQL lida com conjuntos de caracteres e colatinas, consulte o Capítulo 10, * Conjuntos de caracteres, colatinas, Unicode *.

Da mesma forma, você pode fazer com que a tabela `employees` seja dividida de tal forma que cada linha seja armazenada em uma das várias partições com base na década em que o funcionário correspondente foi contratado, usando a declaração `ALTER TABLE` mostrada aqui:

```sql
ALTER TABLE employees PARTITION BY RANGE COLUMNS (hired)  (
    PARTITION p0 VALUES LESS THAN ('1970-01-01'),
    PARTITION p1 VALUES LESS THAN ('1980-01-01'),
    PARTITION p2 VALUES LESS THAN ('1990-01-01'),
    PARTITION p3 VALUES LESS THAN ('2000-01-01'),
    PARTITION p4 VALUES LESS THAN ('2010-01-01'),
    PARTITION p5 VALUES LESS THAN (MAXVALUE)
);
```

Consulte a Seção 13.1.18, “Instrução CREATE TABLE”, para obter informações adicionais sobre a sintaxe do `PARTITION BY RANGE COLUMNS`.

#### 22.2.3.2 Partição de colunas de lista

O MySQL 5.7 oferece suporte para a partição `LIST COLUMNS`. Esta é uma variante da partição `LIST` que permite o uso de múltiplos colunas como chaves de partição e para colunas de tipos de dados que não são inteiros serem usadas como colunas de partição; você pode usar tipos de string, colunas `DATE` e `DATETIME`. (Para mais informações sobre os tipos de dados permitidos para colunas de partição `COLUMNS`, consulte a Seção 22.2.3, “COLUNAS DE PARTIÇÃO”.)

Suponha que você tenha um negócio com clientes em 12 cidades, que, para fins de vendas e marketing, você organiza em 4 regiões de 3 cidades cada, conforme mostrado na tabela a seguir:

<table summary="The example described in the preceding text of a business with four sales and marketing regions, with each region having three cities."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Region</th> <th>Cidades</th> </tr></thead><tbody><tr> <td>1</td> <td>Oskarshamn, Högsby, Mönsterås</td> </tr><tr> <td>2</td> <td>Vimmerby, Hultsfred, Västervik</td> </tr><tr> <td>3</td> <td>Nässjö, Eksjö, Vetlanda</td> </tr><tr> <td>4</td> <td>Uppvidinge, Alvesta, Växjo</td> </tr></tbody></table>

Com a partição `LIST COLUMNS`, você pode criar uma tabela para dados de clientes que atribui uma linha a qualquer uma das 4 partições correspondentes a essas regiões com base no nome da cidade onde um cliente reside, conforme mostrado aqui:

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

Assim como na partição por `RANGE COLUMNS`, você não precisa usar expressões na cláusula `COLUMNS()` para converter os valores das colunas em inteiros. (De fato, o uso de expressões que não são nomes de colunas não é permitido com `COLUMNS()`.)

É também possível usar as colunas `DATE` e `DATETIME`, conforme mostrado no exemplo a seguir, que utiliza o mesmo nome e colunas que a tabela `customers_1` mostrada anteriormente, mas emprega a partição `LIST COLUMNS` com base na coluna `renewal` para armazenar linhas em uma das 4 partições, dependendo da semana em fevereiro de 2010 em que a conta do cliente está programada para ser renovada:

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

Isso funciona, mas torna-se complicado definir e manter se o número de datas envolvidas cresce muito; nesses casos, geralmente é mais prático usar a partição `RANGE` ou `RANGE COLUMNS` em vez disso. Neste caso, uma vez que a coluna que desejamos usar como chave de partição é uma coluna `DATE`, usamos a partição `RANGE COLUMNS`, como mostrado aqui:

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

Consulte a Seção 22.2.3.1, “Particionamento de COLUNAS DE ÁREA”, para obter mais informações.

Além disso (assim como no caso da partição `RANGE COLUMNS`, você pode usar várias colunas na cláusula `COLUMNS()`.

Consulte a Seção 13.1.18, “Instrução CREATE TABLE”, para obter informações adicionais sobre a sintaxe do `PARTITION BY LIST COLUMNS()`.

### 22.2.4 Partição HASH

A partição por `HASH` é usada principalmente para garantir uma distribuição uniforme dos dados entre um número predeterminado de partições. Com a partição por intervalo ou lista, você deve especificar explicitamente em qual partição um valor de coluna dado ou um conjunto de valores de coluna deve ser armazenado; com a partição por hash, o MySQL cuida disso por você, e você só precisa especificar um valor de coluna ou expressão com base em um valor de coluna que deve ser hashado e o número de partições em que a tabela particionada deve ser dividida.

Para particionar uma tabela usando a partição `HASH`, é necessário acrescentar à declaração `CREATE TABLE` uma cláusula `PARTITION BY HASH (expr)`, onde *`expr`* é uma expressão que retorna um inteiro. Isso pode ser simplesmente o nome de uma coluna cujo tipo é um dos tipos inteiros do MySQL. Além disso, você provavelmente deseja seguir isso com `PARTITIONS num`, onde *`num`* é um inteiro positivo que representa o número de partições em que a tabela deve ser dividida.

Nota

Por simplicidade, as tabelas nos exemplos a seguir não utilizam nenhuma chave. Você deve estar ciente de que, se uma tabela tiver qualquer chave única, todas as colunas utilizadas na expressão de particionamento para essa tabela devem fazer parte de cada chave única, incluindo a chave primária. Consulte a Seção 22.6.1, “Chaves de particionamento, chaves primárias e chaves únicas”, para obter mais informações.

A seguinte declaração cria uma tabela que utiliza hashing na coluna `store_id` e é dividida em 4 partições:

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
PARTITION BY HASH(store_id)
PARTITIONS 4;
```

Se você não incluir uma cláusula `PARTITIONS`, o número de partições será o padrão `1`.

Usar a palavra-chave `PARTITIONS` sem um número após ela resulta em um erro de sintaxe.

Você também pode usar uma expressão SQL que retorne um inteiro para *`expr`*. Por exemplo, você pode querer particionar com base no ano em que um funcionário foi contratado. Isso pode ser feito conforme mostrado aqui:

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
PARTITION BY HASH( YEAR(hired) )
PARTITIONS 4;
```

*`expr`* deve retornar um valor inteiro não constante e não aleatório (ou seja, deve variar, mas ser determinístico), e não deve conter quaisquer construções proibidas, conforme descrito na Seção 22.6, “Restrições e Limitações de Partição”. Também deve-se ter em mente que essa expressão é avaliada cada vez que uma linha é inserida ou atualizada (ou possivelmente excluída); isso significa que expressões muito complexas podem gerar problemas de desempenho, particularmente ao realizar operações (como inserções em lote) que afetam muitas linhas de uma só vez.

A função de hashing mais eficiente é aquela que opera em uma única coluna de tabela e cujo valor aumenta ou diminui consistentemente com o valor da coluna, pois isso permite a "poda" em intervalos de partições. Isso significa que, quanto mais próxima a expressão variar com o valor da coluna em que se baseia, mais eficientemente o MySQL pode usar a expressão para partição por hash.

Por exemplo, onde `date_col` é uma coluna do tipo `DATE`, então a expressão `TO_DAYS(date_col)` é dita variar diretamente com o valor de `date_col`, porque para cada mudança no valor de `date_col`, o valor da expressão muda de maneira consistente. A variância da expressão `YEAR(date_col)` em relação a `date_col` não é tão direta quanto a de `TO_DAYS(date_col)`, porque nem toda mudança possível em `date_col` produz uma mudança equivalente em `YEAR(date_col)`. Mesmo assim, `YEAR(date_col)` é um bom candidato para uma função de hashing, porque varia diretamente com uma porção de `date_col` e não há mudança possível em `date_col` que produza uma mudança desproporcional em `YEAR(date_col)`.

Por outro lado, suponha que você tenha uma coluna chamada `int_col` cujo tipo é `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Agora, considere a expressão `POW(5-int_col,3) + 6`. Esta seria uma escolha ruim para uma função de hashing, porque uma mudança no valor de `int_col` não garante uma mudança proporcional no valor da expressão. Alterar o valor de `int_col` por um determinado valor pode produzir mudanças amplamente diferentes no valor da expressão. Por exemplo, alterar `int_col` de `5` para `6` produz uma mudança de `-1` no valor da expressão, mas alterar o valor de `int_col` de `6` para `7` produz uma mudança de `-7` no valor da expressão.

Em outras palavras, quanto mais próxima a curva do valor da coluna em relação ao valor da expressão segue uma linha reta, conforme traçada pela equação `y=cx`, onde *`c`* é uma constante não nula, melhor a expressão é adequada para a agregação. Isso tem a ver com o fato de que quanto mais não linear uma expressão é, mais irregular a distribuição dos dados entre as partições que tende a produzir.

Em teoria, a poda também é possível para expressões que envolvem mais de um valor de coluna, mas determinar quais dessas expressões são adequadas pode ser bastante difícil e demorado. Por essa razão, o uso de expressões de hashing que envolvem múltiplas colunas não é particularmente recomendado.

Quando o `PARTITION BY HASH` é usado, o MySQL determina quais partições de *`num`* devem ser usadas com base no módulo do resultado da expressão. Em outras palavras, para uma expressão dada *`expr`*, a partição na qual o registro é armazenado é o número de partição *`N`*, onde `N = MOD(expr, num)`. Suponha que a tabela `t1` seja definida da seguinte forma, de modo que ela tenha 4 partições:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY HASH( YEAR(col3) )
    PARTITIONS 4;
```

Se você inserir um registro no `t1` cujo valor no `col3` é `'2005-09-15'`, a partição na qual ele é armazenado é determinada da seguinte forma:

```sql
MOD(YEAR('2005-09-01'),4)
=  MOD(2005,4)
=  1
```

O MySQL 5.7 também suporta uma variante da partição `HASH`, conhecida como hashing linear, que emprega um algoritmo mais complexo para determinar a colocação de novas linhas inseridas na tabela particionada. Consulte a Seção 22.2.4.1, “Partição de HASH LINEAR”, para uma descrição desse algoritmo.

A expressão fornecida pelo usuário é avaliada cada vez que um registro é inserido ou atualizado. Ela também pode — dependendo das circunstâncias — ser avaliada quando os registros são excluídos.

#### 22.2.4.1 Partição de Hash Linear

O MySQL também suporta hashing linear, que difere do hashing regular porque o hashing linear utiliza um algoritmo de potências lineares de dois, enquanto o hashing regular emprega o módulo do valor da função de hashing.

Sintaticamente, a única diferença entre a partição de hash linear e o hashing regular é a adição da palavra-chave `LINEAR` na cláusula `PARTITION BY`, conforme mostrado aqui:

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

Dado uma expressão *`expr`*, a partição na qual o registro é armazenado quando o hashing linear é usado é o número de partição *`N`* entre as *`num`* partições, onde *`N`* é derivado de acordo com o seguinte algoritmo:

1. Encontre o próximo número de potência de 2 maior que *`num`*. Chamamos esse valor de *`V`*; ele pode ser calculado da seguinte forma:

   ```sql
   V = POWER(2, CEILING(LOG(2, num)))
   ```

(Suponha que *`num`* seja 13. Então, `LOG(2,13)` é 3,7004397181411. `CEILING(3.7004397181411)` é 4, e *`V`* = `POWER(2,4)`, que é 16.)

2. Defina *`N`* = *`F`*(*`column_list`*) & (*`V`* - 1).

3. Enquanto *`N`* >= *`num`*:

* Definir *`V`* = *`V`* / 2

* Definir *`N`* = *`N`* & (*`V`* - 1)

Suponha que a tabela `t1`, utilizando partição hash linear e com 6 partições, seja criada usando esta declaração:

```sql
CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATE)
    PARTITION BY LINEAR HASH( YEAR(col3) )
    PARTITIONS 6;
```

Agora, suponha que você queira inserir dois registros no `t1` com os valores das colunas `'2003-04-14'` e `'1998-10-19'` do `col3`. O número de partição para o primeiro desses registros é determinado da seguinte forma:

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

A vantagem na partição por hash linear é que a adição, remoção, fusão e divisão de partições são feitas muito mais rapidamente, o que pode ser benéfico ao lidar com tabelas que contêm quantidades extremamente grandes (terabytes) de dados. A desvantagem é que os dados têm menos probabilidade de serem distribuídos uniformemente entre as partições em comparação com a distribuição obtida usando partição de hash regular.

### 22.2.5 Partição de chave

A partição por chave é semelhante à partição por hash, exceto que, onde a partição por hash emprega uma expressão definida pelo usuário, a função de hashing para partição por chave é fornecida pelo servidor MySQL. O NDB Cluster usa `MD5()` para esse propósito; para tabelas que utilizam outros motores de armazenamento, o servidor emprega sua própria função de hashing interna, que é baseada no mesmo algoritmo que `PASSWORD()`.

As regras de sintaxe para `CREATE TABLE ... PARTITION BY KEY` são semelhantes às regras para criar uma tabela que é particionada por hash. As principais diferenças estão listadas aqui:

* `KEY` é usado em vez de `HASH`.

* `KEY` aceita apenas uma lista de zero ou mais nomes de coluna. Quaisquer colunas utilizadas como chave de particionamento devem compor parte ou toda a chave primária da tabela, se a tabela tiver uma. Se não for especificado nenhum nome de coluna como chave de particionamento, a chave primária da tabela é usada, se houver uma. Por exemplo, a seguinte declaração `CREATE TABLE` é válida no MySQL 5.7:

  ```sql
  CREATE TABLE k1 (
      id INT NOT NULL PRIMARY KEY,
      name VARCHAR(20)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

Se não houver uma chave primária, mas houver uma chave única, então a chave única é usada como chave de partição:

  ```sql
  CREATE TABLE k1 (
      id INT NOT NULL,
      name VARCHAR(20),
      UNIQUE KEY (id)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

No entanto, se a coluna de chave única não fosse definida como `NOT NULL`, a declaração anterior falharia.

Em ambos os casos, a chave de partição é a coluna `id`, mesmo que não seja mostrada na saída do `SHOW CREATE TABLE` ou na coluna `PARTITION_EXPRESSION` da tabela do Esquema de Informação `PARTITIONS`.

Ao contrário do que ocorre com outros tipos de particionamento, as colunas utilizadas para particionar por `KEY` não são restritas a valores inteiros ou `NULL`. Por exemplo, a seguinte declaração `CREATE TABLE` é válida:

  ```sql
  CREATE TABLE tm1 (
      s1 CHAR(32) PRIMARY KEY
  )
  PARTITION BY KEY(s1)
  PARTITIONS 10;
  ```

A afirmação anterior não seria válida, se um tipo de particionamento diferente fosse especificado. (Neste caso, simplesmente usar `PARTITION BY KEY()` também seria válido e teria o mesmo efeito que `PARTITION BY KEY(s1)`, uma vez que `s1` é a chave primária da tabela.)

Para obter informações adicionais sobre este assunto, consulte a Seção 22.6, “Restrições e Limitações de Partição”.

As colunas com prefixos de índice não são suportadas em chaves de particionamento. Isso significa que as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY` podem ser usadas em uma chave de particionamento, desde que não empreguem prefixos; porque um prefixo deve ser especificado para as colunas `BLOB` e `TEXT` nas definições de índice, não é possível usar colunas desses dois tipos em chaves de particionamento. Em MySQL 5.7, colunas que usam prefixos são permitidas ao criar, alterar ou atualizar tabelas particionadas, mesmo que não estejam incluídas na chave de particionamento da tabela. Esse é um problema conhecido no MySQL 5.7 que é abordado no MySQL 8.0, onde esse comportamento permissivo é descontinuado, e o servidor exibe avisos ou erros apropriados ao tentar usar tais colunas nesses casos. Consulte Prefixos de índice de coluna não suportados para particionamento de chave, para mais informações e exemplos.

Nota

As tabelas que utilizam o mecanismo de armazenamento `NDB` são implicitamente particionadas por `KEY`, usando a chave primária da tabela como chave de particionamento (como em outros mecanismos de armazenamento MySQL). No caso de a tabela do NDB Cluster não ter uma chave primária explícita, a chave primária "oculta" gerada pelo mecanismo de armazenamento `NDB` para cada tabela do NDB Cluster é usada como chave de particionamento.

Se você definir um esquema de particionamento explícito para uma tabela `NDB`, a tabela deve ter uma chave primária explícita, e quaisquer colunas usadas na expressão de particionamento devem fazer parte dessa chave. No entanto, se a tabela usa uma expressão de particionamento “vazia” — ou seja, `PARTITION BY KEY()` sem referências de coluna — então nenhuma chave primária explícita é necessária.

Você pode observar essa partição usando o utilitário **ndb\_desc** (com a opção `-p`).

Importante

Para uma tabela com partição por chave, você não pode executar um `ALTER TABLE DROP PRIMARY KEY`, pois isso gera o erro ERRO 1466 (HY000): Campo na lista de campos para a função de partição não encontrado na tabela. Esse não é um problema para tabelas do NDB Cluster que são particionadas por `KEY`; em tais casos, a tabela é reorganizada usando a chave primária "oculta" como a nova chave de partição da tabela. Veja o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*.

É também possível particionar uma tabela por chave linear. Aqui está um exemplo simples:

```sql
CREATE TABLE tk (
    col1 INT NOT NULL,
    col2 CHAR(5),
    col3 DATE
)
PARTITION BY LINEAR KEY (col1)
PARTITIONS 3;
```

O uso de `LINEAR` tem o mesmo efeito na partição de `KEY` que na partição de `HASH`, com o número de partição sendo derivado usando um algoritmo de potências de dois em vez de aritmética de módulo. Veja a Seção 22.2.4.1, “Partição de HASH LINEAR”, para uma descrição desse algoritmo e suas implicações.

### 22.2.6 Subpartição

A subpartição, também conhecida como partição composta, é a divisão adicional de cada partição em uma tabela particionada. Considere a seguinte declaração `CREATE TABLE`:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) )
    SUBPARTITIONS 2 (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (2000),
        PARTITION p2 VALUES LESS THAN MAXVALUE
    );
```

A tabela `ts` tem 3 `RANGE` divisões. Cada uma dessas divisões—`p0`, `p1` e `p2`—é dividida em 2 subdivisões adicionais. Na verdade, toda a tabela é dividida em `3 * 2 = 6` divisões. No entanto, devido à ação da cláusula `PARTITION BY RANGE`, os primeiros 2 desses armazenam apenas os registros com um valor menor que 1990 na coluna `purchased`.

Em MySQL 5.7, é possível subparticipar tabelas que são particionadas por `RANGE` ou `LIST`. As subpartições podem usar a particionamento `HASH` ou `KEY`. Isso também é conhecido como particionamento composto.

Nota

`SUBPARTITION BY HASH` e `SUBPARTITION BY KEY` geralmente seguem as mesmas regras de sintaxe que `PARTITION BY HASH` e `PARTITION BY KEY`, respectivamente. Uma exceção a isso é que `SUBPARTITION BY KEY` (ao contrário de `PARTITION BY KEY`) atualmente não suporta uma coluna padrão, portanto, a coluna usada para esse propósito deve ser especificada, mesmo que a tabela tenha uma chave primária explícita. Este é um problema conhecido que estamos trabalhando para resolver; consulte Problemas com subpartições, para mais informações e um exemplo.

Também é possível definir subpartições explicitamente usando cláusulas `SUBPARTITION` para especificar opções para subpartições individuais. Por exemplo, uma forma mais detalhada de criar a mesma tabela `ts` como mostrado no exemplo anterior seria:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0,
            SUBPARTITION s1
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s2,
            SUBPARTITION s3
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s4,
            SUBPARTITION s5
        )
    );
```

Alguns itens sintáticos de destaque estão listados aqui:

* Cada partição deve ter o mesmo número de subpartições. * Se você definir explicitamente quaisquer subpartições usando `SUBPARTITION` em qualquer partição de uma tabela particionada, você deve defini-las todas. Em outras palavras, a seguinte declaração falha:

  ```sql
  CREATE TABLE ts (id INT, purchased DATE)
      PARTITION BY RANGE( YEAR(purchased) )
      SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
          PARTITION p0 VALUES LESS THAN (1990) (
              SUBPARTITION s0,
              SUBPARTITION s1
          ),
          PARTITION p1 VALUES LESS THAN (2000),
          PARTITION p2 VALUES LESS THAN MAXVALUE (
              SUBPARTITION s2,
              SUBPARTITION s3
          )
      );
  ```

Essa declaração ainda falharia mesmo se incluísse uma cláusula `SUBPARTITIONS 2`.

* Cada cláusula `SUBPARTITION` deve incluir (como mínimo) um nome para a subpartição. Caso contrário, você pode definir qualquer opção desejada para a subpartição ou permitir que ela assuma sua configuração padrão para essa opção.

* Os nomes das subpartições devem ser únicos em toda a tabela. Por exemplo, a seguinte declaração `CREATE TABLE` é válida no MySQL 5.7:

  ```sql
  CREATE TABLE ts (id INT, purchased DATE)
      PARTITION BY RANGE( YEAR(purchased) )
      SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
          PARTITION p0 VALUES LESS THAN (1990) (
              SUBPARTITION s0,
              SUBPARTITION s1
          ),
          PARTITION p1 VALUES LESS THAN (2000) (
              SUBPARTITION s2,
              SUBPARTITION s3
          ),
          PARTITION p2 VALUES LESS THAN MAXVALUE (
              SUBPARTITION s4,
              SUBPARTITION s5
          )
      );
  ```

As subpartições podem ser usadas em tabelas `MyISAM` especialmente grandes para distribuir dados e índices em muitos discos. Suponha que você tenha 6 discos montados como `/disk0`, `/disk1`, `/disk2`, e assim por diante. Agora, considere o seguinte exemplo:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    ENGINE = MYISAM
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0
                DATA DIRECTORY = '/disk0/data'
                INDEX DIRECTORY = '/disk0/idx',
            SUBPARTITION s1
                DATA DIRECTORY = '/disk1/data'
                INDEX DIRECTORY = '/disk1/idx'
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s2
                DATA DIRECTORY = '/disk2/data'
                INDEX DIRECTORY = '/disk2/idx',
            SUBPARTITION s3
                DATA DIRECTORY = '/disk3/data'
                INDEX DIRECTORY = '/disk3/idx'
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s4
                DATA DIRECTORY = '/disk4/data'
                INDEX DIRECTORY = '/disk4/idx',
            SUBPARTITION s5
                DATA DIRECTORY = '/disk5/data'
                INDEX DIRECTORY = '/disk5/idx'
        )
    );
```

Nesse caso, um disco separado é usado para os dados e para os índices de cada `RANGE`. Muitas outras variações são possíveis; outro exemplo pode ser:

```sql
CREATE TABLE ts (id INT, purchased DATE)
    ENGINE = MYISAM
    PARTITION BY RANGE(YEAR(purchased))
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0a
                DATA DIRECTORY = '/disk0'
                INDEX DIRECTORY = '/disk1',
            SUBPARTITION s0b
                DATA DIRECTORY = '/disk2'
                INDEX DIRECTORY = '/disk3'
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s1a
                DATA DIRECTORY = '/disk4/data'
                INDEX DIRECTORY = '/disk4/idx',
            SUBPARTITION s1b
                DATA DIRECTORY = '/disk5/data'
                INDEX DIRECTORY = '/disk5/idx'
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s2a,
            SUBPARTITION s2b
        )
    );
```

Aqui, o armazenamento é o seguinte:

* As linhas com datas `purchased` de antes de 1990 ocupam uma grande quantidade de espaço, então são divididas em 4 partes, com um disco separado dedicado aos dados e aos índices para cada uma das duas subpartições (`s0a` e `s0b`) que compõem a partição `p0`. Em outras palavras:

+ Os dados para a subpartição `s0a` são armazenados em `/disk0`.

+ Os índices para subpartição `s0a` são armazenados em `/disk1`.

+ Os dados para a subpartição `s0b` são armazenados em `/disk2`.

+ Os índices para subpartição `s0b` são armazenados em `/disk3`.

* As linhas que contêm datas que variam de 1990 a 1999 (partição `p1`) não exigem tanto espaço quanto as que estão antes de 1990. Essas são divididas entre 2 discos (`/disk4` e `/disk5`) em vez de 4 discos, como os registros legados armazenados em `p0`:

+ Os dados e índices pertencentes à primeira subpartição de `p1` (`s1a`) são armazenados em `/disk4`—os dados em `/disk4/data` e os índices em `/disk4/idx`.

+ Os dados e índices pertencentes à segunda subpartição de `p1` (`s1b`) são armazenados em `/disk5`—os dados em `/disk5/data` e os índices em `/disk5/idx`.

* As linhas que refletem datas do ano 2000 até o presente (partição `p2`) não ocupam tanto espaço quanto o necessário para qualquer uma das duas faixas anteriores. Atualmente, é suficiente armazenar todas essas informações na localização padrão.

No futuro, quando o número de compras para a década que começa com o ano de 2000 crescer para um ponto em que a localização padrão não forneça mais espaço suficiente, as linhas correspondentes podem ser movidas usando uma declaração `ALTER TABLE ... REORGANIZE PARTITION`. Veja a Seção 22.3, “Gestão de Partições”, para uma explicação de como isso pode ser feito.

As opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são permitidas nas definições de partição quando o modo SQL do servidor `NO_DIR_IN_CREATE` está em vigor. No MySQL 5.7, essas opções também não são permitidas ao definir subpartições (Bug #42954).

### 22.2.7 Como o Partição do MySQL lida com NULL

A partição no MySQL não impede que `NULL` seja o valor de uma expressão de partição, seja ela um valor de coluna ou o valor de uma expressão fornecida pelo usuário. Embora seja permitido usar `NULL` como o valor de uma expressão que deve, de outra forma, produzir um número inteiro, é importante ter em mente que `NULL` não é um número. A implementação de partição do MySQL trata `NULL` como sendo menor que qualquer valor que não seja `NULL`, assim como `ORDER BY` faz.

Isso significa que o tratamento de `NULL` varia entre a partição de diferentes tipos, e pode produzir comportamentos que você não espera se não estiver preparado para isso. Como este é o caso, discutimos nesta seção como cada tipo de partição do MySQL lida com os valores de `NULL` ao determinar a partição na qual uma linha deve ser armazenada, e fornecemos exemplos para cada um.

**Tratamento de NULL com particionamento RANGE.** Se você inserir uma linha em uma tabela particionada por `RANGE` de tal forma que o valor da coluna usado para determinar a partição seja `NULL`, a linha é inserida na partição mais baixa. Considere essas duas tabelas em um banco de dados chamado `p`, criado da seguinte forma:

```sql
mysql> CREATE TABLE t1 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY RANGE(c1) (
    ->     PARTITION p0 VALUES LESS THAN (0),
    ->     PARTITION p1 VALUES LESS THAN (10),
    ->     PARTITION p2 VALUES LESS THAN MAXVALUE
    -> );
Query OK, 0 rows affected (0.09 sec)

mysql> CREATE TABLE t2 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY RANGE(c1) (
    ->     PARTITION p0 VALUES LESS THAN (-5),
    ->     PARTITION p1 VALUES LESS THAN (0),
    ->     PARTITION p2 VALUES LESS THAN (10),
    ->     PARTITION p3 VALUES LESS THAN MAXVALUE
    -> );
Query OK, 0 rows affected (0.09 sec)
```

Você pode ver as partições criadas por essas duas declarações `CREATE TABLE` usando a seguinte consulta contra a tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA`:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 't_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| t1         | p0             |          0 |              0 |           0 |
| t1         | p1             |          0 |              0 |           0 |
| t1         | p2             |          0 |              0 |           0 |
| t2         | p0             |          0 |              0 |           0 |
| t2         | p1             |          0 |              0 |           0 |
| t2         | p2             |          0 |              0 |           0 |
| t2         | p3             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.00 sec)
```

(Para mais informações sobre esta tabela, consulte a Seção 24.3.16, “A tabela de PARTITIONS do INFORMATION\_SCHEMA”.) Agora, vamos preencher cada uma dessas tabelas com uma única linha contendo um `NULL` na coluna usada como chave de partição, e verificar se as linhas foram inseridas usando um par de declarações `SELECT`:

```sql
mysql> INSERT INTO t1 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO t2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM t1;
+------+--------+
| id   | name   |
+------+--------+
| NULL | mothra |
+------+--------+
1 row in set (0.00 sec)

mysql> SELECT * FROM t2;
+------+--------+
| id   | name   |
+------+--------+
| NULL | mothra |
+------+--------+
1 row in set (0.00 sec)
```

Você pode ver quais partições são usadas para armazenar as linhas inseridas, executando novamente a consulta anterior contra `INFORMATION_SCHEMA.PARTITIONS` e inspecionando a saída:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 't_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| t1         | p0             |          1 |             20 |          20 |
| t1         | p1             |          0 |              0 |           0 |
| t1         | p2             |          0 |              0 |           0 |
| t2         | p0             |          1 |             20 |          20 |
| t2         | p1             |          0 |              0 |           0 |
| t2         | p2             |          0 |              0 |           0 |
| t2         | p3             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.01 sec)
```

Você também pode demonstrar que essas linhas foram armazenadas na partição mais baixa de cada tabela, eliminando essas partições e, em seguida, executando novamente as instruções do `SELECT`:

```sql
mysql> ALTER TABLE t1 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> ALTER TABLE t2 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> SELECT * FROM t1;
Empty set (0.00 sec)

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

(Para mais informações sobre `ALTER TABLE ... DROP PARTITION`, consulte a Seção 13.1.8, “Instrução ALTER TABLE”.)

`NULL` também é tratado dessa maneira para expressões de partição que utilizam funções SQL. Suponha que definamos uma tabela usando uma declaração `CREATE TABLE` como esta:

```sql
CREATE TABLE tndate (
    id INT,
    dt DATE
)
PARTITION BY RANGE( YEAR(dt) ) (
    PARTITION p0 VALUES LESS THAN (1990),
    PARTITION p1 VALUES LESS THAN (2000),
    PARTITION p2 VALUES LESS THAN MAXVALUE
);
```

Assim como outras funções do MySQL, `YEAR(NULL)` retorna `NULL`. Uma linha com um valor na coluna `dt` de `NULL` é tratada como se a expressão de partição tivesse avaliado a um valor menor que qualquer outro valor, e, portanto, é inserida na partição `p0`.

**Tratamento de NULL com particionamento LIST.** Uma tabela que é particionada por `LIST` admite valores de `NULL` se e somente se uma de suas particionamentos é definida usando aquela lista de valores que contém `NULL`. A inversa disso é que uma tabela particionada por `LIST` que não usa explicitamente `NULL` em uma lista de valores rejeita linhas resultando em um valor de `NULL` para a expressão de particionamento, como mostrado neste exemplo:

```sql
mysql> CREATE TABLE ts1 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7),
    ->     PARTITION p2 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO ts1 VALUES (9, 'mothra');
ERROR 1504 (HY000): Table has no partition for value 9

mysql> INSERT INTO ts1 VALUES (NULL, 'mothra');
ERROR 1504 (HY000): Table has no partition for value NULL
```

Apenas as linhas que possuem um valor `c1` entre `0` e `8`, inclusive, podem ser inseridas em `ts1`. `NULL` fica fora desse intervalo, assim como o número `9`. Podemos criar tabelas `ts2` e `ts3` com listas de valores contendo `NULL`, conforme mostrado aqui:

```sql
mysql> CREATE TABLE ts2 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7),
    ->     PARTITION p2 VALUES IN (2, 5, 8),
    ->     PARTITION p3 VALUES IN (NULL)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE ts3 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7, NULL),
    ->     PARTITION p2 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.01 sec)
```

Ao definir listas de valores para particionamento, você pode (e deve) tratar `NULL` da mesma forma que qualquer outro valor. Por exemplo, tanto `VALUES IN (NULL)` quanto `VALUES IN (1, 4, 7, NULL)` são válidos, assim como `VALUES IN (1, NULL, 4, 7)`, `VALUES IN (NULL, 1, 4, 7)`, e assim por diante. Você pode inserir uma linha com `NULL` para a coluna `c1` em cada uma das tabelas `ts2` e `ts3`:

```sql
mysql> INSERT INTO ts2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO ts3 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)
```

Ao emitir a consulta apropriada contra a tabela do esquema de informações `PARTITIONS`, você pode determinar quais partições foram usadas para armazenar as linhas que foram inseridas (a gente assume, como nos exemplos anteriores, que as tabelas particionadas foram criadas no banco de dados `p`):

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 'ts_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| ts2        | p0             |          0 |              0 |           0 |
| ts2        | p1             |          0 |              0 |           0 |
| ts2        | p2             |          0 |              0 |           0 |
| ts2        | p3             |          1 |             20 |          20 |
| ts3        | p0             |          0 |              0 |           0 |
| ts3        | p1             |          1 |             20 |          20 |
| ts3        | p2             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.01 sec)
```

Como mostrado anteriormente nesta seção, você também pode verificar quais partições foram usadas para armazenar as linhas, excluindo essas partições e, em seguida, realizando um `SELECT`.

**Tratamento de NULL com particionamento HASH e KEY.** `NULL` é tratado de maneira um pouco diferente para tabelas particionadas por `HASH` ou `KEY`. Nesses casos, qualquer expressão de particionamento que produza um valor de `NULL` é tratada como se seu valor de retorno fosse zero. Podemos verificar esse comportamento examinando os efeitos no sistema de arquivos da criação de uma tabela particionada por `HASH` e sua população com um registro contendo valores apropriados. Suponha que você tenha uma tabela `th` (também na base de dados `p`) criada usando a seguinte declaração:

```sql
mysql> CREATE TABLE th (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY HASH(c1)
    -> PARTITIONS 2;
Query OK, 0 rows affected (0.00 sec)
```

As partições pertencentes a esta tabela podem ser visualizadas usando a consulta mostrada aqui:

```sql
mysql> SELECT TABLE_NAME,PARTITION_NAME,TABLE_ROWS,AVG_ROW_LENGTH,DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME ='th';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| th         | p0             |          0 |              0 |           0 |
| th         | p1             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
2 rows in set (0.00 sec)
```

`TABLE_ROWS` para cada partição é 0. Agora, insira duas linhas no `th` cujos valores na coluna `c1` são `NULL` e 0, e verifique se essas linhas foram inseridas, conforme mostrado aqui:

```sql
mysql> INSERT INTO th VALUES (NULL, 'mothra'), (0, 'gigan');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM th;
+------+---------+
| c1   | c2      |
+------+---------+
| NULL | mothra  |
+------+---------+
|    0 | gigan   |
+------+---------+
2 rows in set (0.01 sec)
```

Lembre-se de que, para qualquer inteiro *`N`*, o valor de `NULL MOD N` é sempre `NULL`. Para tabelas que são particionadas por `HASH` ou `KEY`, esse resultado é tratado para determinar a partição correta como `0`. Verificando a tabela do Esquema de Informações `PARTITIONS` novamente, podemos ver que ambas as linhas foram inseridas na partição `p0`:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME ='th';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| th         | p0             |          2 |             20 |          20 |
| th         | p1             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
2 rows in set (0.00 sec)
```

Repetindo o último exemplo usando `PARTITION BY KEY` no lugar de `PARTITION BY HASH` na definição da tabela, você pode verificar que `NULL` também é tratado como 0 para este tipo de particionamento.