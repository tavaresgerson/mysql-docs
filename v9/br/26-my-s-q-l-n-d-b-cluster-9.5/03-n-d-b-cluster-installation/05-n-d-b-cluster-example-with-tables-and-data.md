### 25.3.5 Exemplo de NDB Cluster com Tabelas e Dados

Nota

As informações nesta seção se aplicam ao NDB Cluster rodando em plataformas Unix e Windows.

Trabalhar com tabelas e dados do banco de dados no NDB Cluster não difere muito de fazer isso no MySQL padrão. Há dois pontos importantes a serem lembrados:

* Para que uma tabela seja replicada no cluster, ela deve usar o mecanismo de armazenamento `NDBCLUSTER`. Para especificar isso, use a opção `ENGINE=NDBCLUSTER` ou `ENGINE=NDB` ao criar a tabela:

  ```
  CREATE TABLE tbl_name (col_name column_definitions) ENGINE=NDBCLUSTER;
  ```

  Alternativamente, para uma tabela existente que usa um mecanismo de armazenamento diferente, use `ALTER TABLE` para alterar a tabela para usar `NDBCLUSTER`:

  ```
  ALTER TABLE tbl_name ENGINE=NDBCLUSTER;
  ```

* Cada tabela `NDBCLUSTER` tem uma chave primária. Se nenhuma chave primária for definida pelo usuário ao criar uma tabela, o mecanismo de armazenamento `NDBCLUSTER` gera automaticamente uma oculta. Uma chave oculta ocupa espaço assim como qualquer outro índice de tabela. (Não é incomum encontrar problemas devido à memória insuficiente para acomodar esses índices criados automaticamente.)

Se você está importando tabelas de um banco de dados existente usando a saída do **mysqldump**, você pode abrir o script SQL em um editor de texto e adicionar a opção `ENGINE` a quaisquer declarações de criação de tabela, ou substituir quaisquer opções `ENGINE` existentes. Suponha que você tenha o banco de dados de amostra `world` em outro servidor MySQL que não suporta o NDB Cluster e queira exportar a tabela `City`:

```
$> mysqldump --add-drop-table world City > city_table.sql
```

O arquivo `city_table.sql` resultante contém essa declaração de criação de tabela (e as declarações `INSERT` necessárias para importar os dados da tabela):

```
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Você precisa garantir que o MySQL use o mecanismo de armazenamento `NDBCLUSTER` para essa tabela. Existem duas maneiras de realizar isso. Uma delas é modificar a definição da tabela *antes* de importá-la no banco de dados Cluster. Usando a tabela `City` como exemplo, modifique a opção `ENGINE` da definição da seguinte forma:

```
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=NDBCLUSTER;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Isso deve ser feito para a definição de cada tabela que fará parte do banco de dados agrupado. A maneira mais fácil de realizar isso é fazer uma busca e substituição no arquivo que contém as definições e substituir todas as ocorrências de `ENGINE=engine_name` por `ENGINE=NDBCLUSTER`. Se você não quiser modificar o arquivo, pode usar o arquivo não modificado para criar as tabelas e, em seguida, usar `ALTER TABLE` para alterar seu mecanismo de armazenamento. Os detalhes são fornecidos mais adiante nesta seção.

Supondo que você já tenha criado um banco de dados chamado `world` no nó SQL do cluster, você pode então usar o cliente de linha de comando **mysql** para ler `city_table.sql` e criar e preencher a tabela correspondente da maneira usual:

```
$> mysql world < city_table.sql
```

É muito importante ter em mente que o comando anterior deve ser executado no host onde o nó SQL está em execução (neste caso, na máquina com o endereço IP `198.51.100.20`).

Para criar uma cópia de todo o banco de dados `world` no nó SQL, use **mysqldump** no servidor não agrupado para exportar o banco de dados para um arquivo chamado `world.sql` (por exemplo, no diretório `/tmp`). Em seguida, modifique as definições da tabela como descrito anteriormente e importe o arquivo no nó SQL do cluster da seguinte forma:

```
$> mysql world < /tmp/world.sql
```

Se você salvar o arquivo em um local diferente, ajuste as instruções anteriores conforme necessário.

Executar consultas `SELECT` no nó SQL não difere de executá-las em qualquer outra instância de um servidor MySQL. Para executar consultas a partir da linha de comando, você primeiro precisa fazer login no Monitor MySQL da maneira usual (especifique a senha `root` no prompt `Digite a senha:`):

```
$> mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 9.5.0-ndb-9.5.0

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

Nós simplesmente usamos a conta `root` do servidor MySQL e assumimos que você seguiu as precauções de segurança padrão para instalar um servidor MySQL, incluindo a definição de uma senha `root` forte. Para mais informações, consulte a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Vale a pena levar em consideração que os nós do NDB Cluster *não* utilizam o sistema de privilégios do MySQL ao acessarem uns aos outros. Definir ou alterar contas de usuário do MySQL (incluindo a conta `root`) afeta apenas as aplicações que acessam o nó SQL, não a interação entre nós. Consulte a Seção 25.6.19.2, “NDB Cluster e Privilégios do MySQL”, para mais informações.

Se você não modificou as cláusulas `ENGINE` nas definições da tabela antes de importar o script SQL, você deve executar as seguintes instruções neste ponto:

```
mysql> USE world;
mysql> ALTER TABLE City ENGINE=NDBCLUSTER;
mysql> ALTER TABLE Country ENGINE=NDBCLUSTER;
mysql> ALTER TABLE CountryLanguage ENGINE=NDBCLUSTER;
```

Selecionar um banco de dados e executar uma consulta **SELECT** contra uma tabela nesse banco de dados também é feito da maneira usual, assim como sair do Monitor MySQL:

```
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

Aplicações que usam MySQL podem empregar APIs padrão para acessar tabelas `NDB`. É importante lembrar que sua aplicação deve acessar o nó SQL, e não os nós de gerenciamento ou dados. Este breve exemplo mostra como podemos executar a instrução `SELECT` mostrada acima usando a extensão `mysqli` do PHP 5.X rodando em um servidor Web em outro lugar da rede:

```
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

Assumimos que o processo em execução no servidor Web pode alcançar o endereço IP do nó SQL.

Da mesma forma, você pode usar a API C MySQL, Perl-DBI, Python-mysql ou Conectadores MySQL para realizar as tarefas de definição e manipulação de dados, da mesma forma que faria normalmente com o MySQL.