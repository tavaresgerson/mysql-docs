### 15.2.10 Declaração `LOAD XML`

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

A declaração `LOAD XML` lê dados de um arquivo XML em uma tabela. O *`file_name`* deve ser fornecido como uma string literal. O *`tagname`* na cláusula opcional `ROWS IDENTIFIED BY` também deve ser fornecido como uma string literal, e deve ser envolto por chaves angulares (`<` e `>`).

`LOAD XML` atua como o complemento da execução do cliente **mysql** no modo de saída XML (ou seja, iniciando o cliente com a opção `--xml`). Para escrever dados de uma tabela em um arquivo XML, você pode invocar o cliente **mysql** com as opções `--xml` e `-e` a partir do shell do sistema, como mostrado aqui:

```
$> mysql --xml -e 'SELECT * FROM mydb.mytable' > file.xml
```

Para ler o arquivo de volta para uma tabela, use `LOAD XML`. Por padrão, o elemento `<row>` é considerado o equivalente a uma linha de tabela de banco de dados; isso pode ser alterado usando a cláusula `ROWS IDENTIFIED BY`.

Esta declaração suporta três formatos diferentes de XML:

* Nomes de colunas como atributos e valores de coluna como valores de atributo:

  ```
  <row column1="value1" column2="value2" .../>
  ```

* Nomes de colunas como tags e valores de coluna como conteúdo dessas tags:

  ```
  <row>
    <column1>value1</column1>
    <column2>value2</column2>
  </row>
  ```

* Nomes de colunas são os atributos `name` das tags `<field>` e os valores são o conteúdo dessas tags:

  ```
  <row>
    <field name='column1'>value1</field>
    <field name='column2'>value2</field>
  </row>
  ```

Este é o formato usado por outras ferramentas do MySQL, como **mysqldump**.

Todos os três formatos podem ser usados no mesmo arquivo XML; a rotina de importação detecta automaticamente o formato para cada linha e interpreta corretamente. As tags são correspondidas com base no nome da tag ou atributo e no nome da coluna.

As seguintes cláusulas funcionam essencialmente da mesma maneira para `LOAD XML` como para `LOAD DATA`:

* `LOW_PRIORITY` ou `CONCURRENT`
* `LOCAL`
* `REPLACE` ou `IGNORE`
* `CHARACTER SET`
* `SET`

Veja a Seção 15.2.9, “Declaração `LOAD DATA`”, para mais informações sobre essas cláusulas.

`(campo_nome_ou_var_usuario, ...)` é uma lista de um ou mais campos XML separados por vírgula ou variáveis de usuário. O nome de uma variável de usuário usada para esse propósito deve corresponder ao nome de um campo do arquivo XML, precedido por `@`. Você pode usar os nomes de campos para selecionar apenas os campos desejados. As variáveis de usuário podem ser usadas para armazenar os valores correspondentes dos campos para uso posterior.

A cláusula `IGNORE número LINHAS` ou `IGNORE número LINHAS` faz com que as primeiras *`número`* linhas no arquivo XML sejam ignoradas. É análogo à cláusula `LOAD DATA` da instrução `IGNORE ... LINHAS`.

Suponha que tenhamos uma tabela chamada `pessoa`, criada como mostrado aqui:

```
USE test;

CREATE TABLE person (
    person_id INT NOT NULL PRIMARY KEY,
    fname VARCHAR(40) NULL,
    lname VARCHAR(40) NULL,
    created TIMESTAMP
);
```

Suponha ainda que essa tabela esteja inicialmente vazia.

Agora, suponha que tenhamos um simples arquivo XML `pessoa.xml`, cujo conteúdo é mostrado aqui:

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

Cada um dos formatos XML permitidos discutidos anteriormente é representado neste arquivo de exemplo.

Para importar os dados em `pessoa.xml` para a tabela `pessoa`, você pode usar esta instrução:

```
mysql> LOAD XML LOCAL INFILE 'person.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';

Query OK, 8 rows affected (0.00 sec)
Records: 8  Deleted: 0  Skipped: 0  Warnings: 0
```

Aqui, assumimos que `pessoa.xml` está localizado no diretório de dados do MySQL. Se o arquivo não for encontrado, o seguinte erro será gerado:

```
ERROR 2 (HY000): File '/person.xml' not found (Errcode: 2)
```

A cláusula `ROWS IDENTIFIED BY '<pessoa>'` significa que cada elemento `<pessoa>` no arquivo XML é considerado equivalente a uma linha na tabela na qual os dados devem ser importados. Neste caso, é a tabela `pessoa` no banco de dados `test`.

Como pode ser visto na resposta do servidor, 8 linhas foram importadas para a tabela `test.pessoa`. Isso pode ser verificado por uma simples instrução `SELECT`:

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

Isso mostra, como afirmado anteriormente nesta seção, que qualquer ou todos os 3 formatos XML permitidos podem aparecer em um único arquivo e serem lidos usando `LOAD XML`.

O inverso da operação de importação mostrada anteriormente — ou seja, descarregar dados de uma tabela do MySQL em um arquivo XML — pode ser feito usando o cliente **mysql** do shell do sistema, como mostrado aqui:

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

Observação

A opção `--xml` faz com que o cliente **mysql** use a formatação XML para sua saída; a opção `-e` faz com que o cliente execute a instrução SQL imediatamente após a opção. Veja a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Você pode verificar se o dump é válido criando uma cópia da tabela `person` e importando o arquivo do dump na nova tabela, assim:

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

Não há necessidade de que cada campo no arquivo XML seja correspondido a uma coluna na tabela correspondente. Campos que não têm colunas correspondentes são ignorados. Você pode ver isso primeiro vazando a tabela `person2` e excluindo a coluna `created`, depois usando a mesma instrução `LOAD XML` que acabamos de usar anteriormente, assim:

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

A ordem em que os campos são fornecidos dentro de cada linha do arquivo XML não afeta a operação `LOAD XML`; a ordem dos campos pode variar de linha para linha e não é obrigatória ser a mesma ordem que as colunas correspondentes na tabela.

Como mencionado anteriormente, você pode usar uma lista `(field_name_or_user_var, ...)` de um ou mais campos XML (para selecionar apenas os campos desejados) ou variáveis de usuário (para armazenar os valores correspondentes dos campos para uso posterior). Variáveis de usuário podem ser especialmente úteis quando você deseja inserir dados de um arquivo XML em colunas de tabela cujos nomes não correspondem aos dos campos XML. Para ver como isso funciona, primeiro criamos uma tabela chamada `individual` cuja estrutura corresponde à da tabela `person`, mas cujas colunas são nomeadas de maneira diferente:

```
mysql> CREATE TABLE individual (
    ->     individual_id INT NOT NULL PRIMARY KEY,
    ->     name1 VARCHAR(40) NULL,
    ->     name2 VARCHAR(40) NULL,
    ->     made TIMESTAMP
    -> );
Query OK, 0 rows affected (0.42 sec)
```

Neste caso, você não pode simplesmente carregar o arquivo XML diretamente na tabela, porque os nomes dos campos e colunas não correspondem:

```
mysql> LOAD XML INFILE '../bin/person-dump.xml' INTO TABLE test.individual;
ERROR 1263 (22004): Column set to default value; NULL supplied to NOT NULL column 'individual_id' at row 1
```

Isso acontece porque o servidor MySQL procura por nomes de campos que correspondam aos nomes das colunas da tabela de destino. Você pode contornar esse problema selecionando os valores dos campos em variáveis de usuário, depois definindo as colunas da tabela de destino iguais aos valores dessas variáveis usando `SET`. Você pode realizar ambas as operações em uma única instrução, como mostrado aqui:

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

Os nomes das variáveis de usuário *devem* corresponder aos nomes dos campos correspondentes do arquivo XML, com a adição do prefixo `@` necessário para indicar que são variáveis. As variáveis de usuário não precisam ser listadas ou atribuídas na mesma ordem que os campos correspondentes.

Usando uma cláusula `ROWS IDENTIFIED BY '<tagname>'`, é possível importar dados do mesmo arquivo XML em tabelas de banco de dados com definições diferentes. Para este exemplo, suponha que você tenha um arquivo chamado `address.xml` que contém o seguinte XML:

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

Você pode novamente usar a tabela `test.person` definida anteriormente nesta seção, após limpar todos os registros existentes da tabela e depois mostrar sua estrutura como mostrado aqui:

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

Para importar os dados do arquivo XML para a tabela `person`, execute a seguinte instrução `LOAD XML`, que especifica que as linhas devem ser especificadas pelo elemento `<person>`, como mostrado aqui;

```
mysql> LOAD XML LOCAL INFILE 'address.xml'
    ->   INTO TABLE person
    ->   ROWS IDENTIFIED BY '<person>';
Query OK, 2 rows affected (0.00 sec)
Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
```

Você pode verificar que os registros foram importados usando uma instrução `SELECT`:

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

Você pode ver que os dados foram importados usando uma instrução `SELECT` como esta:

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

Os dados do elemento `<address>` que estão entre comentários XML não são importados. No entanto, como há uma coluna `person_id` na tabela `address`, o valor do atributo `person_id` do elemento `<person>` pai para cada `<address>` *é* importado para a tabela `address`.

**Considerações de Segurança.** Como com a instrução `LOAD DATA`, a transferência do arquivo XML do host do cliente para o host do servidor é iniciada pelo servidor MySQL. Teoricamente, pode ser construído um servidor com uma correção que informaria ao programa cliente para transferir um arquivo escolhido pelo servidor, em vez do arquivo nomeado pelo cliente na instrução `LOAD XML`. Tal servidor poderia acessar qualquer arquivo no host do cliente para o qual o usuário cliente tenha acesso de leitura.

Em um ambiente Web, os clientes geralmente se conectam ao MySQL a partir de um servidor Web. Um usuário que pode executar qualquer comando contra o servidor MySQL pode usar `LOAD XML LOCAL` para ler quaisquer arquivos para os quais o processo do servidor Web tenha acesso de leitura. Neste ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor Web, não o programa remoto que está sendo executado pelo usuário que se conecta ao servidor Web.

Você pode desabilitar o carregamento de arquivos XML de clientes iniciando o servidor com `--local-infile=0` ou `--local-infile=OFF`. Esta opção também pode ser usada ao iniciar o cliente **mysql** para desabilitar `LOAD XML` durante a sessão do cliente.

Para impedir que um cliente carregue arquivos XML do servidor, não conceda o privilégio `FILE` à conta de usuário MySQL correspondente, ou revogue esse privilégio se a conta de usuário do cliente já o tiver.

Importante

Revocar o privilégio `FILE` (ou não concedê-lo em primeiro lugar) impede que o usuário execute apenas a instrução `LOAD XML` (bem como a função `LOAD_FILE()`; isso *não* impede que o usuário execute `LOAD XML LOCAL`. Para impedir essa instrução, você deve iniciar o servidor ou o cliente com `--local-infile=OFF`.

Em outras palavras, o privilégio `FILE` afeta apenas se o cliente pode ler arquivos no servidor; ele não tem nenhuma influência sobre se o cliente pode ler arquivos no sistema de arquivos local.