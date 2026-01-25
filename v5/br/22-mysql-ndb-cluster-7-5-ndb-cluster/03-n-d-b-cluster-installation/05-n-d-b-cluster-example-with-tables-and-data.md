### 21.3.5 Exemplo de NDB Cluster com Tables e Data

Nota

As informações nesta seção se aplicam ao NDB Cluster executando em plataformas Unix e Windows.

Trabalhar com database tables e data no NDB Cluster não é muito diferente de fazê-lo no MySQL padrão. Existem dois pontos chave a serem considerados:

* Para que uma table seja replicada no cluster, ela deve usar o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Para especificar isso, use a opção `ENGINE=NDBCLUSTER` ou `ENGINE=NDB` ao criar a table:

  ```sql
  CREATE TABLE tbl_name (col_name column_definitions) ENGINE=NDBCLUSTER;
  ```

  Alternativamente, para uma table existente que usa um storage engine diferente, use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para mudar a table para usar [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"):

  ```sql
  ALTER TABLE tbl_name ENGINE=NDBCLUSTER;
  ```

* Toda table [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") possui uma primary key. Se nenhuma primary key for definida pelo usuário quando uma table é criada, o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") gera uma oculta automaticamente. Tal key ocupa espaço assim como qualquer outro table Index. (Não é incomum encontrar problemas devido à memória insuficiente para acomodar esses indexes criados automaticamente.)

Se você estiver importando tables de um database existente usando a saída do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), você pode abrir o script SQL em um editor de texto e adicionar a opção `ENGINE` a quaisquer declarações de criação de table, ou substituir quaisquer opções `ENGINE` existentes. Suponha que você tenha o sample database `world` em outro MySQL server que não suporta NDB Cluster, e você queira exportar a table `City`:

```sql
$> mysqldump --add-drop-table world City > city_table.sql
```

O arquivo `city_table.sql` resultante contém esta declaração de criação de table (e as declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") necessárias para importar o table data):

```sql
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Você precisa garantir que o MySQL use o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para esta table. Existem duas maneiras de conseguir isso. Uma delas é modificar a definição da table *antes* de importá-la para o Cluster database. Usando a table `City` como exemplo, modifique a opção `ENGINE` da definição da seguinte forma:

```sql
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=NDBCLUSTER DEFAULT CHARSET=latin1;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Isso deve ser feito para a definição de cada table que fará parte do clustered database. A maneira mais fácil de conseguir isso é fazer uma busca e substituição no arquivo que contém as definições e substituir todas as instâncias de `TYPE=engine_name` ou `ENGINE=engine_name` por `ENGINE=NDBCLUSTER`. Se você não quiser modificar o arquivo, você pode usar o arquivo não modificado para criar as tables e, em seguida, usar [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para alterar seu storage engine. Os detalhes são fornecidos mais adiante nesta seção.

Assumindo que você já criou um database chamado `world` no SQL node do cluster, você pode então usar o cliente de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para ler `city_table.sql`, e criar e popular a table correspondente da maneira usual:

```sql
$> mysql world < city_table.sql
```

É muito importante ter em mente que o comando anterior deve ser executado no host onde o SQL node está rodando (neste caso, na máquina com o IP address `198.51.100.20`).

Para criar uma cópia do database `world` inteiro no SQL node, use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") no server que não é cluster para exportar o database para um arquivo chamado `world.sql` (por exemplo, no diretório `/tmp`). Em seguida, modifique as definições das tables conforme descrito e importe o arquivo para o SQL node do cluster desta forma:

```sql
$> mysql world < /tmp/world.sql
```

Se você salvar o arquivo em um local diferente, ajuste as instruções anteriores de acordo.

Executar [`SELECT`](select.html "13.2.9 SELECT Statement") queries no SQL node não é diferente de executá-las em qualquer outra instância de um MySQL server. Para executar queries a partir da linha de comando, você precisa primeiro logar no MySQL Monitor da maneira usual (especifique a senha `root` no prompt `Enter password:`):

```sql
$> mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 5.7.44-ndb-7.6.36

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

Nós simplesmente usamos a conta `root` do MySQL server e assumimos que você seguiu as precauções de segurança padrão para a instalação de um MySQL server, incluindo a definição de uma `root` password forte. Para mais informações, consulte [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").

Vale a pena levar em consideração que os Cluster nodes *não* utilizam o sistema de privilégios do MySQL ao acessar uns aos outros. Configurar ou alterar as contas de usuário do MySQL (incluindo a conta `root`) afeta apenas as aplicações que acessam o SQL node, e não a interação entre os nodes. Consulte [Section 21.6.18.2, “NDB Cluster and MySQL Privileges”](mysql-cluster-security-mysql-privileges.html "21.6.18.2 NDB Cluster and MySQL Privileges"), para mais informações.

Se você não modificou as cláusulas `ENGINE` nas definições das tables antes de importar o script SQL, você deve executar as seguintes declarações neste ponto:

```sql
mysql> USE world;
mysql> ALTER TABLE City ENGINE=NDBCLUSTER;
mysql> ALTER TABLE Country ENGINE=NDBCLUSTER;
mysql> ALTER TABLE CountryLanguage ENGINE=NDBCLUSTER;
```

Selecionar um database e executar uma **SELECT** query em uma table nesse database também é realizado da maneira usual, assim como sair do MySQL Monitor:

```sql
mysql> USE world;
mysql> SELECT Name, Population FROM City ORDER BY Population DESC LIMIT 5;
+-----------+------------+
| Name      | Population |
+-----------+------------+
| Bombay    |   10500000 |
| Seoul     |    9981619 |
| São Paulo |    9968485 |
| Shanghai  |    9696300 |
| Jakarta   |    9604900 |
+-----------+------------+
5 rows in set (0.34 sec)

mysql> \q
Bye

$>
```

Aplicações que usam MySQL podem empregar APIs padrão para acessar tables [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). É importante lembrar que sua aplicação deve acessar o SQL node, e não os management nodes ou data nodes. Este breve exemplo mostra como podemos executar a declaração [`SELECT`](select.html "13.2.9 SELECT Statement") mostrada usando a extensão `mysqli` do PHP 5.X rodando em um Web server em outro lugar na network:

```sql
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type"
           content="text/html; charset=iso-8859-1">
  <title>SIMPLE mysqli SELECT</title>
</head>
<body>
<?php
  # connect to SQL node:
  $link = new mysqli('198.51.100.20', 'root', 'root_password', 'world');
  # parameters for mysqli constructor are:
  #   host, user, password, database

  if( mysqli_connect_errno() )
    die("Connect failed: " . mysqli_connect_error());

  $query = "SELECT Name, Population
            FROM City
            ORDER BY Population DESC
            LIMIT 5";

  # if no errors...
  if( $result = $link->query($query) )
  {
?>
<table border="1" width="40%" cellpadding="4" cellspacing ="1">
  <tbody>
  <tr>
    <th width="10%">City</th>
    <th>Population</th>
  </tr>
<?
    # then display the results...
    while($row = $result->fetch_object())
      printf("<tr>\n  <td align=\"center\">%s</td><td>%d</td>\n</tr>\n",
              $row->Name, $row->Population);
?>
  </tbody
</table>
<?
  # ...and verify the number of rows that were retrieved
    printf("<p>Affected rows: %d</p>\n", $link->affected_rows);
  }
  else
    # otherwise, tell us what went wrong
    echo mysqli_error();

  # free the result set and the mysqli connection object
  $result->close();
  $link->close();
?>
</body>
</html>
```

Assumimos que o processo rodando no Web server pode alcançar o IP address do SQL node.

De forma similar, você pode usar o MySQL C API, Perl-DBI, Python-mysql ou MySQL Connectors para executar as tarefas de data definition e manipulation da mesma forma que faria normalmente com MySQL.
