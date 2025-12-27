## 5.3 Criando e Usando uma Base de Dados

5.3.1 Criando e Selecionando uma Base de Dados

5.3.2 Criando uma Tabela

5.3.3 Carregando Dados em uma Tabela

5.3.4 Recuperando Informações de uma Tabela

Depois de saber como inserir instruções SQL, você está pronto para acessar uma base de dados.

Suponha que você tenha vários animais em sua casa (sua zoológico) e queira acompanhar vários tipos de informações sobre eles. Você pode fazer isso criando tabelas para armazenar seus dados e carregando-os com as informações desejadas. Em seguida, você pode responder a diferentes tipos de perguntas sobre seus animais, recuperando dados das tabelas. Esta seção mostra como realizar as seguintes operações:

* Criar uma base de dados
* Criar uma tabela
* Carregar dados na tabela
* Recuperar dados da tabela de várias maneiras
* Usar múltiplas tabelas

O banco de dados do zoológico é simples (deliberadamente), mas não é difícil pensar em situações do mundo real em que um tipo semelhante de banco de dados poderia ser usado. Por exemplo, um banco de dados como este poderia ser usado por um fazendeiro para acompanhar o gado, ou por um veterinário para acompanhar os registros dos pacientes. Uma distribuição do zoológico contendo algumas das consultas e dados de amostra usados nas seções seguintes pode ser obtida no site do MySQL. Está disponível tanto em formato **tar** comprimido quanto em formato Zip em https://dev.mysql.com/doc/.

Use a instrução `SHOW` para descobrir quais bases de dados atualmente existem no servidor:

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

A base de dados `mysql` descreve os privilégios de acesso do usuário. A base de dados `test` geralmente está disponível como um espaço de trabalho para os usuários experimentarem coisas.

A lista de bancos de dados exibida pelo comando pode ser diferente na sua máquina; o comando `SHOW DATABASES` não exibe bancos de dados para os quais você não tenha privilégios, caso você não tenha o privilégio `SHOW DATABASES`. Consulte a Seção 15.7.7.16, “Comando SHOW DATABASES”.

Se o banco de dados `test` existir, tente acessá-lo:

```
mysql> USE test
Database changed
```

O comando `USE`, assim como `QUIT`, não requer ponto e vírgula. (Você pode encerrar tais comandos com ponto e vírgula, se preferir; isso não faz mal algum.) O comando `USE` também é especial de outra maneira: ele deve ser dado em uma única linha.

Você pode usar o banco de dados `test` (se tiver acesso a ele) para os exemplos que se seguem, mas qualquer coisa que você criar nesse banco de dados pode ser removida por qualquer outra pessoa com acesso a ele. Por essa razão, você provavelmente deve pedir ao seu administrador do MySQL permissão para usar um banco de dados próprio. Suponha que você queira chamá-lo de `menagerie`. O administrador precisa executar um comando como este:

```
mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';
```

onde `your_mysql_name` é o nome de usuário do MySQL atribuído a você e `your_client_host` é o host a partir do qual você se conecta ao servidor.