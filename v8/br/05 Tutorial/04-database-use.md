## 5.3 Criação e utilização de uma base de dados

Uma vez que você sabe como inserir instruções SQL, você está pronto para acessar um banco de dados.

Suponha que você tenha vários animais de estimação em sua casa (sua menagerie) e queira manter o controle de vários tipos de informações sobre eles. Você pode fazer isso criando tabelas para armazenar seus dados e carregando-os com as informações desejadas. Então você pode responder a diferentes tipos de perguntas sobre seus animais recuperando dados das tabelas. Esta seção mostra como executar as seguintes operações:

- Criar uma base de dados
- Criar uma tabela
- Carregar dados na tabela
- Recuperar dados da tabela de várias maneiras
- Usar várias tabelas

O banco de dados de menagerie é simples (deliberadamente), mas não é difícil pensar em situações do mundo real em que um tipo semelhante de banco de dados pode ser usado. Por exemplo, um banco de dados como este poderia ser usado por um fazendeiro para manter o controle do gado, ou por um veterinário para manter o controle de registros de pacientes. Uma distribuição de menagerie contendo algumas das consultas e dados de amostra usados nas seções seguintes pode ser obtida a partir do site MySQL. Ele está disponível em arquivo comprimido **tar** e formatos Zip em \[<https://dev.mysql.com/doc/>] (<https://dev.mysql.com/doc/>).

Use a instrução `SHOW` para descobrir quais bancos de dados existem atualmente no servidor:

```
mysql> SHOW DATABASES;
+----------+
| Database |
+----------+
| mysql    |
| test     |
| tmp      |
+----------+
```

O banco de dados `mysql` descreve os privilégios de acesso do usuário. O banco de dados `test` está frequentemente disponível como um espaço de trabalho para os usuários experimentarem as coisas.

A lista de bancos de dados exibidos pela instrução pode ser diferente na sua máquina; `SHOW DATABASES` não mostra bancos de dados para os quais você não tem privilégios se você não tiver o privilégio `SHOW DATABASES`.

Se o banco de dados `test` existir, tente acessá-lo:

```
mysql> USE test
Database changed
```

A instrução `USE`, como `QUIT`, não requer um ponto e vírgula. (Você pode terminar tais instruções com um ponto e vírgula, se quiser; não faz mal.) A instrução `USE` é especial de outra forma também: ela deve ser dada em uma única linha.

Você pode usar o banco de dados `test` (se você tiver acesso a ele) para os exemplos a seguir, mas qualquer coisa que você criar nesse banco de dados pode ser removida por qualquer outra pessoa com acesso a ele. Por esta razão, você provavelmente deve pedir ao seu administrador do MySQL permissão para usar um banco de dados próprio. Suponha que você queira chamar o seu `menagerie`. O administrador precisa executar uma instrução como esta:

```
mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';
```

onde `your_mysql_name` é o nome de usuário MySQL atribuído a você e `your_client_host` é o host a partir do qual você se conecta ao servidor.
