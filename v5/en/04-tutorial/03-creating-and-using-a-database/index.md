## 3.3 Criação e Uso de um Database

[3.3.1 Criando e Selecionando um Database](creating-database.html)

[3.3.2 Criando uma Tabela](creating-tables.html)

[3.3.3 Carregando Dados em uma Tabela](loading-tables.html)

[3.3.4 Recuperando Informações de uma Tabela](retrieving-data.html)

Assim que você souber como inserir comandos SQL (SQL statements), você estará pronto para acessar um database.

Suponha que você tenha vários animais de estimação em sua casa (seu "menagerie") e gostaria de acompanhar vários tipos de informações sobre eles. Você pode fazer isso criando tabelas para armazenar seus dados (data) e carregando-as com as informações desejadas. Em seguida, você pode responder a diferentes tipos de questões sobre seus animais, recuperando dados das tabelas. Esta seção mostra como executar as seguintes operações:

* Criar um database
* Criar uma tabela
* Carregar dados (data) na tabela
* Recuperar dados (data) da tabela de várias maneiras
* Usar múltiplas tabelas

O database menagerie é simples (deliberadamente), mas não é difícil pensar em situações do mundo real nas quais um tipo de database semelhante poderia ser usado. Por exemplo, um database como este poderia ser usado por um fazendeiro para monitorar o gado, ou por um veterinário para acompanhar registros de pacientes. Uma distribuição menagerie contendo algumas das Queries e dados de exemplo usados nas seções seguintes pode ser obtida no website do MySQL. Ela está disponível nos formatos compactados de arquivo **tar** e Zip em [https://dev.mysql.com/doc/](/doc/).

Use o comando (statement) [`SHOW`](show.html "13.7.5 SHOW Statements") para descobrir quais databases existem atualmente no server:

```sql
mysql> SHOW DATABASES;
+----------+
| Database |
+----------+
| mysql    |
| test     |
| tmp      |
+----------+
```

O database `mysql` descreve os privilégios de acesso do usuário. O database `test` está frequentemente disponível como um workspace para os usuários testarem funcionalidades.

A lista de databases exibida pelo comando (statement) pode ser diferente em sua máquina; [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") não exibe databases para os quais você não possui privilégios, caso você não tenha o privilégio [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). Veja [Section 13.7.5.14, “SHOW DATABASES Statement”](show-databases.html "13.7.5.14 SHOW DATABASES Statement").

Se o database `test` existir, tente acessá-lo:

```sql
mysql> USE test
Database changed
```

[`USE`](use.html "13.8.4 USE Statement"), assim como `QUIT`, não requer ponto e vírgula. (Você pode encerrar tais comandos (statements) com ponto e vírgula se desejar; isso não causa problemas.) O comando [`USE`](use.html "13.8.4 USE Statement") é especial de outra forma também: ele deve ser fornecido em uma única linha.

Você pode usar o database `test` (se tiver acesso a ele) para os exemplos a seguir, mas tudo o que você criar nesse database pode ser removido por qualquer outra pessoa com acesso a ele. Por esta razão, você provavelmente deve pedir ao seu administrador MySQL permissão para usar um database próprio. Suponha que você queira chamá-lo de `menagerie`. O administrador precisa executar um comando (statement) como este:

```sql
mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';
```

onde `your_mysql_name` é o nome de usuário (user name) MySQL atribuído a você e `your_client_host` é o host a partir do qual você se conecta ao server.
