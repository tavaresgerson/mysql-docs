### 2.3.6 Procedimentos pós-instalação do Windows

Existem ferramentas de interface gráfica que realizam a maioria das tarefas descritas nesta seção, incluindo:

- Instalador do MySQL: usado para instalar e atualizar produtos do MySQL.

- MySQL Workbench: Gerencia o servidor MySQL e edita instruções SQL.

Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. As distribuições do Windows anteriores ao MySQL 5.7.7 incluem um diretório de dados com um conjunto de contas pré-inicializadas no banco de dados `mysql`. A partir do 5.7.7, as operações de instalação do Windows realizadas pelo Instalador do MySQL inicializam o diretório de dados automaticamente. Para a instalação a partir de um pacote de arquivo ZIP, inicie o diretório de dados conforme descrito na Seção 2.9.1, “Inicializando o Diretório de Dados”.

Em relação às senhas, se você instalou o MySQL usando o Instalador do MySQL, já pode ter atribuído uma senha à conta inicial `root`. (Veja a Seção 2.3.3, “Instalador do MySQL para Windows”.) Caso contrário, use o procedimento de atribuição de senha descrito na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Antes de atribuir uma senha, você pode querer tentar executar alguns programas cliente para garantir que você possa se conectar ao servidor e que ele esteja funcionando corretamente. Certifique-se de que o servidor esteja em execução (consulte a Seção 2.3.4.5, “Iniciar o Servidor pela Primeira Vez”). Você também pode configurar um serviço MySQL que seja executado automaticamente quando o Windows for iniciado (consulte a Seção 2.3.4.8, “Iniciar o MySQL como um Serviço do Windows”).

Essas instruções assumem que sua localização atual é o diretório de instalação do MySQL e que ele possui um subdiretório `bin` contendo os programas MySQL usados aqui. Se isso não for verdade, ajuste os nomes dos caminhos do comando conforme necessário.

Se você instalou o MySQL usando o Instalador do MySQL (consulte a Seção 2.3.3, “Instalador do MySQL para Windows”), o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 5.7`:

```sql
C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7"
```

Um local comum de instalação para a instalação a partir de um arquivo ZIP é `C:\mysql`:

```sql
C:\> cd C:\mysql
```

Como alternativa, adicione o diretório `bin` à sua configuração da variável de ambiente `PATH`. Isso permite que o interpretador de comandos encontre os programas do MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não seu nome de caminho. Veja a Seção 2.3.4.7, “Personalizando o PATH para Ferramentas do MySQL”.

Com o servidor em execução, execute os seguintes comandos para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante à mostrada aqui.

Use **mysqlshow** para ver quais bancos de dados existem:

```sql
C:\> bin\mysqlshow
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`. Antes do MySQL 5.7.7, um banco de dados `test` também pode ser criado automaticamente.

O comando anterior (e comandos para outros programas MySQL, como **mysql**) podem não funcionar se a conta correta do MySQL não existir. Por exemplo, o programa pode falhar com um erro ou você pode não conseguir visualizar todos os bancos de dados. Se você instalar o MySQL usando o MySQL Installer, o usuário `root` é criado automaticamente com a senha que você forneceu. Nesse caso, você deve usar as opções `-u root` e `-p`. (Você deve usar essas opções se já tiver protegido as contas iniciais do MySQL.) Com `-p`, o programa cliente solicita a senha do `root`. Por exemplo:

```sql
C:\> bin\mysqlshow -u root -p
Enter password: (enter root password here)
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

Se você especificar um nome de banco de dados, o **mysqlshow** exibe uma lista das tabelas dentro do banco de dados:

```sql
C:\> bin\mysqlshow mysql
Database: mysql
+---------------------------+
|          Tables           |
+---------------------------+
| columns_priv              |
| db                        |
| engine_cost               |
| event                     |
| func                      |
| general_log               |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
```

Use o programa **mysql** para selecionar informações de uma tabela no banco de dados **mysql**:

```sql
C:\> bin\mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

Para obter mais informações sobre **mysql** e **mysqlshow**, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”, e a Seção 4.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.
