### 15.2.10 Declaração de CARGA XML

```
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

A declaração `LOAD XML` lê dados de um arquivo XML em uma tabela. O `file_name` deve ser fornecido como uma string literal. O `tagname` na cláusula opcional `ROWS IDENTIFIED BY` também deve ser fornecido como uma string literal, e deve ser envolvido por colchetes angulares (`<` e `>`).

`LOAD XML` atua como complemento para executar o cliente **mysql** no modo de saída XML (ou seja, iniciar o cliente com a opção `--xml`). Para escrever dados de uma tabela em um arquivo XML, você pode invocar o cliente **mysql** com as opções `--xml` e `-e` a partir do shell do sistema, conforme mostrado aqui:

```
$> mysql --xml -e 'SELECT * FROM mydb.mytable' > file.xml
```

Para ler o arquivo de volta em uma tabela, use `LOAD XML`. Por padrão, o elemento `<row>` é considerado o equivalente a uma linha de tabela de banco de dados; isso pode ser alterado usando a cláusula `ROWS IDENTIFIED BY`.

Esta declaração suporta três formatos de XML diferentes:

- Nomes de colunas como atributos e valores de coluna como valores de atributo:

  ```
  <row column1="value1" column2="value2" .../>
  ```

- Nomes das colunas como etiquetas e valores das colunas como conteúdo dessas etiquetas:

  ```
  <row>
    <column1>value1</column1>
    <column2>value2</column2>
  </row>
  ```

- Os nomes das colunas são os atributos `name` das tags `<field>` e os valores são o conteúdo dessas tags:

  ```
  <row>
    <field name='column1'>value1</field>
    <field name='column2'>value2</field>
  </row>
  ```

  Este é o formato usado por outras ferramentas do MySQL, como o **mysqldump**.

Todos os três formatos podem ser usados no mesmo arquivo XML; a rotina de importação detecta automaticamente o formato de cada linha e interpreta-o corretamente. As tags são correspondidas com base no nome da tag ou atributo e no nome da coluna.

Antes do MySQL 8.0.21, o `LOAD XML` não suportava seções `CDATA` no XML de origem. (Bug #30753708, Bug #98199)

As seguintes cláusulas funcionam essencialmente da mesma maneira para `LOAD XML` do que para `LOAD DATA`:

- `LOW_PRIORITY` ou `CONCURRENT`

- `LOCAL`

- `REPLACE` ou `IGNORE`

- `CHARACTER SET`

- `SET`

Consulte a Seção 15.2.9, “Instrução LOAD DATA”, para obter mais informações sobre essas cláusulas.

`(field_name_or_user_var, ...)` é uma lista de um ou mais campos XML separados por vírgula ou variáveis de usuário. O nome de uma variável de usuário usada para esse propósito deve corresponder ao nome de um campo do arquivo XML, precedido por `@`. Você pode usar os nomes dos campos para selecionar apenas os campos desejados. As variáveis de usuário podem ser usadas para armazenar os valores correspondentes dos campos para uso subsequente.

A cláusula `IGNORE number LINES` ou `IGNORE number ROWS` faz com que as primeiras `number` linhas do arquivo XML sejam ignoradas. É análogo à cláusula `IGNORE ... LINES` da instrução `LOAD DATA`.

Suponha que tenhamos uma tabela chamada `person`, criada conforme mostrado aqui:

```
USE test;

CREATE TABLE person (
    person_id INT NOT NULL PRIMARY KEY,
    fname VARCHAR(40) NULL,
    lname VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Suponha, ainda, que essa tabela esteja inicialmente vazia.

Agora, vamos supor que temos um arquivo XML simples `person.xml`, cujos conteúdos são mostrados aqui:

```
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

Para importar os dados em `person.xml` para a tabela `person`, você pode usar esta declaração:

```
mysql> LOAD XML LOCAL INFILE 'person.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';

Query OK, 8 rows affected (0.00 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0
```

Aqui, assumimos que `person.xml` está localizado no diretório de dados do MySQL. Se o arquivo não for encontrado, o seguinte erro será gerado:

```
ERROR 2 (HY000): File '/person.xml' not found (Errcode: 2)
```

A cláusula `ROWS IDENTIFIED BY '<person>'` significa que cada elemento `<person>` no arquivo XML é considerado equivalente a uma linha na tabela na qual os dados devem ser importados. Neste caso, esta é a tabela `person` no banco de dados `test`.

Como pode ser visto na resposta do servidor, 8 linhas foram importadas para a tabela `test.person`. Isso pode ser verificado por meio de uma simples declaração `SELECT`:

```
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

Isso mostra, conforme mencionado anteriormente nesta seção, que qualquer um ou todos os 3 formatos de XML permitidos podem aparecer em um único arquivo e serem lidos usando `LOAD XML`.

A operação de importação inversa mostrada anteriormente, ou seja, o descarte de dados de uma tabela do MySQL em um arquivo XML, pode ser realizada usando o cliente **mysql** do shell do sistema, conforme mostrado aqui:

```
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

A opção `--xml` faz com que o cliente **mysql** use a formatação XML para sua saída; a opção `-e` faz com que o cliente execute a instrução SQL imediatamente após a opção. Veja a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Você pode verificar se o dump é válido criando uma cópia da tabela `person` e importando o arquivo do dump na nova tabela, da seguinte maneira:

```
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

Não há necessidade de que todos os campos do arquivo XML sejam correspondidos a uma coluna na tabela correspondente. Os campos que não têm colunas correspondentes são ignorados. Você pode ver isso primeiro esvaziando a tabela `person2` e removendo a coluna `created`, depois usando a mesma declaração `LOAD XML` que acabamos de usar anteriormente, assim:

```
mysql> TRUNCATE person2;
Query OK, 8 rows affected (0.26 sec)

mysql> ALTER TABLE person2 DROP COLUMN created;
Query OK, 0 rows affected (0.52 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE person2\G
*************************** 1. row ***************************
       Table: person2
Create Table: CREATE TABLE `person2` (
  `person_id` int NOT NULL,
  `fname` varchar(40) DEFAULT NULL,
  `lname` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
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

A ordem em que os campos são apresentados em cada linha do arquivo XML não afeta o funcionamento do `LOAD XML`; a ordem dos campos pode variar de linha para linha e não precisa ser a mesma ordem das colunas correspondentes na tabela.

Como mencionado anteriormente, você pode usar uma lista `(field_name_or_user_var, ...)` de um ou mais campos XML (para selecionar apenas os campos desejados) ou variáveis de usuário (para armazenar os valores correspondentes do campo para uso posterior). As variáveis de usuário podem ser especialmente úteis quando você deseja inserir dados de um arquivo XML em colunas de tabela cujos nomes não correspondem aos dos campos XML. Para ver como isso funciona, primeiro criamos uma tabela chamada `individual` cuja estrutura corresponde à da tabela `person`, mas cujas colunas são nomeadas de maneira diferente:

```
mysql> CREATE TABLE individual (
    ->     individual_id INT NOT NULL PRIMARY KEY,
    ->     name1 VARCHAR(40) NULL,
    ->     name2 VARCHAR(40) NULL,
    ->     made TIMESTAMP
    -> );
Query OK, 0 rows affected (0.42 sec)
```

Nesse caso, você não pode simplesmente carregar o arquivo XML diretamente na tabela, porque os nomes dos campos e das colunas não correspondem:

```
mysql> LOAD XML INFILE '../bin/person-dump.xml' INTO TABLE test.individual;
ERROR 1263 (22004): Column set to default value; NULL supplied to NOT NULL column 'individual_id' at row 1
```

Isso acontece porque o servidor MySQL procura por nomes de campos que correspondam aos nomes das colunas da tabela de destino. Você pode contornar esse problema selecionando os valores dos campos em variáveis de usuário e, em seguida, definindo as colunas da tabela de destino iguais aos valores dessas variáveis usando `SET`. Você pode realizar ambas as operações em uma única instrução, como mostrado aqui:

```
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

Os nomes das variáveis do usuário *devem* corresponder aos campos correspondentes do arquivo XML, com a adição do prefixo `@` necessário para indicar que são variáveis. As variáveis do usuário não precisam ser listadas ou atribuídas na mesma ordem que os campos correspondentes.

Usando uma cláusula `ROWS IDENTIFIED BY '<tagname>'`, é possível importar dados do mesmo arquivo XML para tabelas de banco de dados com definições diferentes. Para este exemplo, suponha que você tenha um arquivo chamado `address.xml` que contém o seguinte XML:

```
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

Você pode novamente usar a tabela `test.person` conforme definido anteriormente nesta seção, após limpar todos os registros existentes da tabela e, em seguida, mostrar sua estrutura conforme mostrado aqui:

```
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Agora, crie uma tabela `address` no banco de dados `test` usando a seguinte instrução `CREATE TABLE`:

```
CREATE TABLE address (
    address_id INT NOT NULL PRIMARY KEY,
    person_id INT NULL,
    street VARCHAR(40) NULL,
    zip INT NULL,
    city VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Para importar os dados do arquivo XML para a tabela `person`, execute a seguinte instrução `LOAD XML`, que especifica que as linhas devem ser especificadas pelo elemento `<person>`, conforme mostrado aqui;

```
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode verificar se os registros foram importados usando uma declaração `SELECT`:

```
mysql> SELECT * FROM person;
+-----------+--------+-------+---------------------+
| person_id | fname  | lname | created             |
+-----------+--------+-------+---------------------+
|         1 | Robert | Jones | 2007-07-24 17:37:06 |
|         2 | Mary   | Smith | 2007-07-24 17:37:06 |
+-----------+--------+-------+---------------------+
2 rows in set (0.00 sec)
```

Como os elementos `<address>` no arquivo XML não têm colunas correspondentes na tabela `person`, eles são ignorados.

Para importar os dados dos elementos `<address>` para a tabela `address`, use a instrução `LOAD XML` mostrada aqui:

```
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE address
    ->   ROWS IDENTIFIED BY '<address>';
Query OK, 3 rows affected (0.00 sec)
Records: 3  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode ver que os dados foram importados usando uma declaração `SELECT` como esta:

```
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

Os dados do elemento `<address>` que está dentro de comentários XML não são importados. No entanto, como há uma coluna `person_id` na tabela `address`, o valor do atributo `person_id` do elemento pai `<person>` para cada `<address>` *é* importado para a tabela `address`.

**Considerações de segurança.** Assim como na declaração `LOAD DATA`, a transferência do arquivo XML do host do cliente para o host do servidor é iniciada pelo servidor MySQL. Em teoria, poderia ser construído um servidor com correções que informaria ao programa cliente para transferir um arquivo escolhido pelo servidor, em vez do arquivo nomeado pelo cliente na declaração `LOAD XML`. Tal servidor poderia acessar qualquer arquivo no host do cliente para o qual o usuário do cliente tenha acesso de leitura.

Em um ambiente web, os clientes geralmente se conectam ao MySQL a partir de um servidor web. Um usuário que pode executar qualquer comando contra o servidor MySQL pode usar `LOAD XML LOCAL` para ler quaisquer arquivos para os quais o processo do servidor web tenha acesso de leitura. Nesse ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor web, e não o programa remoto executado pelo usuário que se conecta ao servidor web.

Você pode desabilitar o carregamento de arquivos XML dos clientes iniciando o servidor com `--local-infile=0` ou `--local-infile=OFF`. Esta opção também pode ser usada ao iniciar o cliente **mysql** para desabilitar `LOAD XML` durante a sessão do cliente.

Para impedir que um cliente carregue arquivos XML do servidor, não conceda o privilégio `FILE` à conta de usuário MySQL correspondente, ou revogue esse privilégio se a conta de usuário do cliente já o tiver.

Importante

Revocar o privilégio `FILE` (ou não concedê-lo em primeiro lugar) impede que o usuário execute apenas a instrução `LOAD XML` (bem como a função `LOAD_FILE()`; isso *não* impede que o usuário execute `LOAD XML LOCAL`. Para impedir essa instrução, você deve iniciar o servidor ou o cliente com `--local-infile=OFF`.

Em outras palavras, o privilégio `FILE` afeta apenas se o cliente pode ler arquivos no servidor; ele não tem nenhuma influência sobre se o cliente pode ler arquivos no sistema de arquivos local.
