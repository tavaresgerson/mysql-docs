### 13.2.7 LOAD XML Statement

```sql
LOAD XML
    [LOW_PRIORITY | CONCURRENT] [LOCAL]
    INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE [db_name.]tbl_name
    [CHARACTER SET charset_name]
    [ROWS IDENTIFIED BY '<tagname>']
    [IGNORE number {LINES | ROWS}]
    [(field_name_or_user_var
        [, field_name_or_user_var] ...)]
    [SET col_name={expr | DEFAULT}
        [, col_name={expr | DEFAULT}] ...]
```

A instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") lê dados de um arquivo XML para uma table. O *`file_name`* deve ser fornecido como uma string literal. O *`tagname`* na cláusula opcional `ROWS IDENTIFIED BY` também deve ser fornecido como uma string literal e deve ser cercado por colchetes angulares (`<` e `>`).

[`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") atua como o complemento da execução do [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client no modo de saída XML (ou seja, iniciando o client com a opção [`--xml`](mysql-command-options.html#option_mysql_xml)). Para escrever dados de uma table para um arquivo XML, você pode invocar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client com as opções [`--xml`](mysql-command-options.html#option_mysql_xml) e [`-e`](mysql-command-options.html#option_mysql_execute) a partir do shell do sistema, conforme mostrado aqui:

```sql
$> mysql --xml -e 'SELECT * FROM mydb.mytable' > file.xml
```

Para ler o arquivo de volta para uma table, use [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement"). Por padrão, o elemento `<row>` é considerado o equivalente a uma linha de table de Database; isso pode ser alterado usando a cláusula `ROWS IDENTIFIED BY`.

Esta instrução suporta três formatos XML diferentes:

* Nomes de coluna como atributos e valores de coluna como valores de atributos:

  ```sql
  <row column1="value1" column2="value2" .../>
  ```

* Nomes de coluna como tags e valores de coluna como o conteúdo dessas tags:

  ```sql
  <row>
    <column1>value1</column1>
    <column2>value2</column2>
  </row>
  ```

* Nomes de coluna são os atributos `name` de tags `<field>`, e os valores são o conteúdo dessas tags:

  ```sql
  <row>
    <field name='column1'>value1</field>
    <field name='column2'>value2</field>
  </row>
  ```

  Este é o formato usado por outras ferramentas MySQL, como o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

Todos os três formatos podem ser usados no mesmo arquivo XML; a rotina de importação detecta automaticamente o formato para cada linha e o interpreta corretamente. As Tags são pareadas com base no nome da tag ou atributo e no nome da coluna.

No MySQL 5.7, o `LOAD XML` não suporta seções `CDATA` no XML de origem. Esta limitação é removida no MySQL 8.0. (Bug #30753708, Bug #98199)

As seguintes cláusulas funcionam essencialmente da mesma forma para [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") como funcionam para [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"):

* `LOW_PRIORITY` ou `CONCURRENT`

* `LOCAL`
* `REPLACE` ou `IGNORE`
* `CHARACTER SET`
* `SET`

Consulte [Seção 13.2.6, “LOAD DATA Statement”](load-data.html "13.2.6 LOAD DATA Statement"), para obter mais informações sobre essas cláusulas.

`(field_name_or_user_var, ...)` é uma lista de um ou mais campos XML ou variáveis de usuário, separados por vírgulas. O nome de uma variável de usuário usada para este fim deve corresponder ao nome de um campo do arquivo XML, prefixado com `@`. Você pode usar nomes de campo para selecionar apenas os campos desejados. Variáveis de usuário podem ser empregadas para armazenar os valores de campo correspondentes para reutilização subsequente.

A cláusula `IGNORE number LINES` ou `IGNORE number ROWS` faz com que as primeiras *`number`* linhas no arquivo XML sejam ignoradas. É análoga à cláusula `IGNORE ... LINES` da instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

Suponha que tenhamos uma table chamada `person`, criada como mostrado aqui:

```sql
USE test;

CREATE TABLE person (
    person_id INT NOT NULL PRIMARY KEY,
    fname VARCHAR(40) NULL,
    lname VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Suponha ainda que esta table esteja inicialmente vazia.

Agora, suponha que tenhamos um arquivo XML simples `person.xml`, cujo conteúdo é mostrado aqui:

```sql
<list>
  <person person_id="1" fname="Kapek" lname="Sainnouine"/>
  <person person_id="2" fname="Sajon" lname="Rondela"/>
  <person person_id="3"><fname>Likame</fname><lname>Örrtmons</lname></person>
  <person person_id="4"><fname>Slar</fname><lname>Manlanth</lname></person>
  <person><field name="person_id">5</field><field name="fname">Stoma</field>
    <field name="lname">Milu</field></person>
  <person><field name="person_id">6</field><field name="fname">Nirtam</field>
    <field name="lname">Sklöd</field></person>
  <person person_id="7"><fname>Sungam</fname><lname>Dulbåd</lname></person>
  <person person_id="8" fname="Sraref" lname="Encmelt"/>
</list>
```

Cada um dos formatos XML permitidos discutidos anteriormente está representado neste arquivo de exemplo.

Para importar os dados em `person.xml` para a table `person`, você pode usar esta instrução:

```sql
mysql> LOAD XML LOCAL INFILE 'person.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';

Query OK, 8 rows affected (0.00 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0
```

Aqui, assumimos que `person.xml` está localizado no diretório de dados do MySQL. Se o arquivo não for encontrado, o seguinte erro será retornado:

```sql
ERROR 2 (HY000): File '/person.xml' not found (Errcode: 2)
```

A cláusula `ROWS IDENTIFIED BY '<person>'` significa que cada elemento `<person>` no arquivo XML é considerado equivalente a uma linha na table para a qual os dados devem ser importados. Neste caso, esta é a table `person` no Database `test`.

Como pode ser visto pela resposta do Server, 8 linhas foram importadas para a table `test.person`. Isso pode ser verificado por meio de uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") simples:

```sql
mysql> SELECT * FROM person;
+-----------+--------+------------+---------------------+
| person_id | fname  | lname      | created             |
+-----------+--------+------------+---------------------+
|         1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|         2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|         3 | Likame | Örrtmons   | 2007-07-13 16:18:47 |
|         4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|         5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|         6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|         7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|         8 | Sreraf | Encmelt    | 2007-07-13 16:18:47 |
+-----------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Isso mostra, conforme declarado anteriormente nesta seção, que qualquer um ou todos os 3 formatos XML permitidos podem aparecer em um único arquivo e ser lidos usando [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement").

O inverso da operação de importação mostrada — isto é, fazer o Dump de dados da table MySQL para um arquivo XML — pode ser realizado usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client a partir do shell do sistema, conforme mostrado aqui:

```sql
$> mysql --xml -e "SELECT * FROM test.person" > person-dump.xml
$> cat person-dump.xml
<?xml version="1.0"?>

<resultset statement="SELECT * FROM test.person" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <row>
	<field name="person_id">1</field>
	<field name="fname">Kapek</field>
	<field name="lname">Sainnouine</field>
  </row>

  <row>
	<field name="person_id">2</field>
	<field name="fname">Sajon</field>
	<field name="lname">Rondela</field>
  </row>

  <row>
	<field name="person_id">3</field>
	<field name="fname">Likema</field>
	<field name="lname">Örrtmons</field>
  </row>

  <row>
	<field name="person_id">4</field>
	<field name="fname">Slar</field>
	<field name="lname">Manlanth</field>
  </row>

  <row>
	<field name="person_id">5</field>
	<field name="fname">Stoma</field>
	<field name="lname">Nilu</field>
  </row>

  <row>
	<field name="person_id">6</field>
	<field name="fname">Nirtam</field>
	<field name="lname">Sklöd</field>
  </row>

  <row>
	<field name="person_id">7</field>
	<field name="fname">Sungam</field>
	<field name="lname">Dulbåd</field>
  </row>

  <row>
	<field name="person_id">8</field>
	<field name="fname">Sreraf</field>
	<field name="lname">Encmelt</field>
  </row>
</resultset>
```

Nota

A opção [`--xml`](mysql-command-options.html#option_mysql_xml) faz com que o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client use formatação XML para sua saída; a opção [`-e`](mysql-command-options.html#option_mysql_execute) faz com que o client execute a instrução SQL imediatamente após a opção. Consulte [Seção 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

Você pode verificar se o Dump é válido criando uma cópia da table `person` e importando o arquivo de Dump para a nova table, assim:

```sql
mysql> USE test;
mysql> CREATE TABLE person2 LIKE person;
Query OK, 0 rows affected (0.00 sec)

mysql> LOAD XML LOCAL INFILE 'person-dump.xml'
    ->   INTO TABLE person2;
Query OK, 8 rows affected (0.01 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM person2;
+-----------+--------+------------+---------------------+
| person_id | fname  | lname      | created             |
+-----------+--------+------------+---------------------+
|         1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|         2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|         3 | Likema | Örrtmons   | 2007-07-13 16:18:47 |
|         4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|         5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|         6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|         7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|         8 | Sreraf | Encmelt    | 2007-07-13 16:18:47 |
+-----------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Não há exigência de que todo campo no arquivo XML corresponda a uma coluna na table correspondente. Campos que não possuem colunas correspondentes são ignorados. Você pode ver isso primeiro esvaziando a table `person2` e removendo a coluna `created`, e em seguida usando a mesma instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") que empregamos anteriormente, assim:

```sql
mysql> TRUNCATE person2;
Query OK, 8 rows affected (0.26 sec)

mysql> ALTER TABLE person2 DROP COLUMN created;
Query OK, 0 rows affected (0.52 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE person2\G
*************************** 1. row ***************************
       Table: person2
Create Table: CREATE TABLE `person2` (
  `person_id` int(11) NOT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `lname` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set (0.00 sec)

mysql> LOAD XML LOCAL INFILE 'person-dump.xml'
    ->   INTO TABLE person2;
Query OK, 8 rows affected (0.01 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM person2;
+-----------+--------+------------+
| person_id | fname  | lname      |
+-----------+--------+------------+
|         1 | Kapek  | Sainnouine |
|         2 | Sajon  | Rondela    |
|         3 | Likema | Örrtmons   |
|         4 | Slar   | Manlanth   |
|         5 | Stoma  | Nilu       |
|         6 | Nirtam | Sklöd      |
|         7 | Sungam | Dulbåd     |
|         8 | Sreraf | Encmelt    |
+-----------+--------+------------+
8 rows in set (0.00 sec)
```

A ordem em que os campos são fornecidos dentro de cada linha do arquivo XML não afeta a operação do [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement"); a ordem dos campos pode variar de linha para linha e não é obrigatório que seja a mesma ordem das colunas correspondentes na table.

Como mencionado anteriormente, você pode usar uma lista `(field_name_or_user_var, ...)` de um ou mais campos XML (para selecionar apenas os campos desejados) ou variáveis de usuário (para armazenar os valores de campo correspondentes para uso posterior). Variáveis de usuário podem ser especialmente úteis quando você deseja inserir dados de um arquivo XML em colunas de table cujos nomes não correspondem aos nomes dos campos XML. Para ver como isso funciona, primeiro criamos uma table chamada `individual` cuja estrutura corresponde à da table `person`, mas cujas colunas têm nomes diferentes:

```sql
mysql> CREATE TABLE individual (
    ->     individual_id INT NOT NULL PRIMARY KEY,
    ->     name1 VARCHAR(40) NULL,
    ->     name2 VARCHAR(40) NULL,
    ->     made TIMESTAMP
    -> );
Query OK, 0 rows affected (0.42 sec)
```

Neste caso, você não pode simplesmente carregar o arquivo XML diretamente na table, porque os nomes dos campos e colunas não correspondem:

```sql
mysql> LOAD XML INFILE '../bin/person-dump.xml' INTO TABLE test.individual;
ERROR 1263 (22004): Column set to default value; NULL supplied to NOT NULL column 'individual_id' at row 1
```

Isso ocorre porque o MySQL Server procura nomes de campo que correspondam aos nomes das colunas da table de destino. Você pode contornar esse problema selecionando os valores dos campos em variáveis de usuário e, em seguida, definindo as colunas da table de destino iguais aos valores dessas variáveis usando `SET`. Você pode executar ambas as operações em uma única instrução, conforme mostrado aqui:

```sql
mysql> LOAD XML INFILE '../bin/person-dump.xml'
    ->     INTO TABLE test.individual (@person_id, @fname, @lname, @created)
    ->     SET individual_id=@person_id, name1=@fname, name2=@lname, made=@created;
Query OK, 8 rows affected (0.05 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0

mysql> SELECT * FROM individual;
+---------------+--------+------------+---------------------+
| individual_id | name1  | name2      | made                |
+---------------+--------+------------+---------------------+
|             1 | Kapek  | Sainnouine | 2007-07-13 16:18:47 |
|             2 | Sajon  | Rondela    | 2007-07-13 16:18:47 |
|             3 | Likema | Örrtmons   | 2007-07-13 16:18:47 |
|             4 | Slar   | Manlanth   | 2007-07-13 16:18:47 |
|             5 | Stoma  | Nilu       | 2007-07-13 16:18:47 |
|             6 | Nirtam | Sklöd      | 2007-07-13 16:18:47 |
|             7 | Sungam | Dulbåd     | 2007-07-13 16:18:47 |
|             8 | Srraf  | Encmelt    | 2007-07-13 16:18:47 |
+---------------+--------+------------+---------------------+
8 rows in set (0.00 sec)
```

Os nomes das variáveis de usuário *devem* corresponder aos dos campos correspondentes do arquivo XML, com a adição do prefixo `@` necessário para indicar que são variáveis. As variáveis de usuário não precisam ser listadas ou atribuídas na mesma ordem que os campos correspondentes.

Usando uma cláusula `ROWS IDENTIFIED BY '<tagname>'`, é possível importar dados do mesmo arquivo XML para tables de Database com definições diferentes. Para este exemplo, suponha que você tenha um arquivo chamado `address.xml` que contém o seguinte XML:

```sql
<?xml version="1.0"?>

<list>
  <person person_id="1">
    <fname>Robert</fname>
    <lname>Jones</lname>
    <address address_id="1" street="Mill Creek Road" zip="45365" city="Sidney"/>
    <address address_id="2" street="Main Street" zip="28681" city="Taylorsville"/>
  </person>

  <person person_id="2">
    <fname>Mary</fname>
    <lname>Smith</lname>
    <address address_id="3" street="River Road" zip="80239" city="Denver"/>
    <!-- <address address_id="4" street="North Street" zip="37920" city="Knoxville"/> -->
  </person>

</list>
```

Você pode usar novamente a table `test.person` conforme definido anteriormente nesta seção, após limpar todos os registros existentes da table e então mostrar sua estrutura, conforme mostrado aqui:

```sql
mysql< TRUNCATE person;
Query OK, 0 rows affected (0.04 sec)

mysql< SHOW CREATE TABLE person\G
*************************** 1. row ***************************
       Table: person
Create Table: CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `lname` varchar(40) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Agora, crie uma table `address` no Database `test` usando a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"):

```sql
CREATE TABLE address (
    address_id INT NOT NULL PRIMARY KEY,
    person_id INT NULL,
    street VARCHAR(40) NULL,
    zip INT NULL,
    city VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Para importar os dados do arquivo XML para a table `person`, execute a seguinte instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement"), que especifica que as linhas devem ser especificadas pelo elemento `<person>`, conforme mostrado aqui:

```sql
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode verificar se os registros foram importados usando uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> SELECT * FROM person;
+-----------+--------+-------+---------------------+
| person_id | fname  | lname | created             |
+-----------+--------+-------+---------------------+
|         1 | Robert | Jones | 2007-07-24 17:37:06 |
|         2 | Mary   | Smith | 2007-07-24 17:37:06 |
+-----------+--------+-------+---------------------+
2 rows in set (0.00 sec)
```

Como os elementos `<address>` no arquivo XML não têm colunas correspondentes na table `person`, eles são ignorados.

Para importar os dados dos elementos `<address>` para a table `address`, use a instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") mostrada aqui:

```sql
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE address
    ->   ROWS IDENTIFIED BY '<address>';
Query OK, 3 rows affected (0.00 sec)
Records: 3  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode ver que os dados foram importados usando uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") como esta:

```sql
mysql> SELECT * FROM address;
+------------+-----------+-----------------+-------+--------------+---------------------+
| address_id | person_id | street          | zip   | city         | created             |
+------------+-----------+-----------------+-------+--------------+---------------------+
|          1 |         1 | Mill Creek Road | 45365 | Sidney       | 2007-07-24 17:37:37 |
|          2 |         1 | Main Street     | 28681 | Taylorsville | 2007-07-24 17:37:37 |
|          3 |         2 | River Road      | 80239 | Denver       | 2007-07-24 17:37:37 |
+------------+-----------+-----------------+-------+--------------+---------------------+
3 rows in set (0.00 sec)
```

Os dados do elemento `<address>` que estão contidos em comentários XML não são importados. No entanto, como há uma coluna `person_id` na table `address`, o valor do atributo `person_id` do elemento pai `<person>` para cada `<address>` *é* importado para a table `address`.

**Considerações de Segurança.** Assim como na instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), a transferência do arquivo XML do host do Client para o host do Server é iniciada pelo MySQL Server. Em teoria, um Server modificado poderia ser construído para instruir o programa Client a transferir um arquivo de escolha do Server, em vez do arquivo nomeado pelo Client na instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement"). Tal Server poderia acessar qualquer arquivo no host do Client ao qual o usuário do Client tenha acesso de leitura.

Em um ambiente Web, os Clients geralmente se conectam ao MySQL a partir de um Web Server. Um usuário que pode executar qualquer comando contra o MySQL Server pode usar [`LOAD XML LOCAL`](load-xml.html "13.2.7 LOAD XML Statement") para ler quaisquer arquivos aos quais o processo do Web Server tenha acesso de leitura. Neste ambiente, o Client em relação ao MySQL Server é, na verdade, o Web Server, e não o programa remoto sendo executado pelo usuário que se conecta ao Web Server.

Você pode desabilitar o carregamento de arquivos XML de Clients iniciando o Server com [`--local-infile=0`](server-system-variables.html#sysvar_local_infile) ou [`--local-infile=OFF`](server-system-variables.html#sysvar_local_infile). Esta opção também pode ser usada ao iniciar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client para desabilitar o [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") durante a sessão do client.

Para impedir que um client carregue arquivos XML do Server, não conceda o privilégio [`FILE`](privileges-provided.html#priv_file) à conta de usuário MySQL correspondente, ou revogue este privilégio se a conta de usuário do client já o possuir.

Importante

Revogar o privilégio [`FILE`](privileges-provided.html#priv_file) (ou não concedê-lo em primeiro lugar) impede o usuário apenas de executar a instrução [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") (bem como a função [`LOAD_FILE()`](string-functions.html#function_load-file)); isso *não* impede o usuário de executar [`LOAD XML LOCAL`](load-xml.html "13.2.7 LOAD XML Statement"). Para desabilitar esta instrução, você deve iniciar o Server ou o Client com `--local-infile=OFF`.

Em outras palavras, o privilégio [`FILE`](privileges-provided.html#priv_file) afeta apenas se o client pode ler arquivos no Server; ele não tem relação com o fato de o client poder ler arquivos no sistema de arquivos local.

Para tables particionadas que usam storage engines que empregam table locks, como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), quaisquer Locks causados por [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement") aplicam Locks em todas as partitions da table. Isso não se aplica a tables que usam storage engines que empregam row-level locking, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Para mais informações, consulte [Seção 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").