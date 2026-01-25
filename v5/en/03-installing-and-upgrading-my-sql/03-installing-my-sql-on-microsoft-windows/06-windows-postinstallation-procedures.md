### 2.3.6 Procedimentos Pós-instalação no Windows

Existem ferramentas GUI (Interface Gráfica do Usuário) que executam a maioria das tarefas descritas nesta seção, incluindo:

*   MySQL Installer: Usado para instalar e atualizar produtos MySQL.
*   MySQL Workbench: Gerencia o servidor MySQL e edita instruções SQL.

Se necessário, inicialize o `data directory` e crie as tabelas de concessão (grant tables) do MySQL. Distribuições para Windows anteriores ao MySQL 5.7.7 incluíam um `data directory` com um conjunto de contas pré-inicializadas no `database` `mysql`. A partir da versão 5.7.7, as operações de instalação no Windows realizadas pelo MySQL Installer inicializam o `data directory` automaticamente. Para instalação a partir de um pacote ZIP Archive, inicialize o `data directory` conforme descrito na Seção 2.9.1, “Initializing the Data Directory”.

Em relação às senhas, se você instalou o MySQL usando o MySQL Installer, é possível que já tenha atribuído uma senha à conta `root` inicial. (Veja Seção 2.3.3, “MySQL Installer for Windows”.) Caso contrário, use o procedimento de atribuição de senha fornecido na Seção 2.9.4, “Securing the Initial MySQL Account”.

Antes de atribuir uma senha, você pode tentar executar alguns programas `client` para garantir que pode se conectar ao `server` e que ele está operando corretamente. Certifique-se de que o `server` esteja em execução (consulte Seção 2.3.4.5, “Starting the Server for the First Time”). Você também pode configurar um `service` MySQL que é executado automaticamente quando o Windows inicia (consulte Seção 2.3.4.8, “Starting MySQL as a Windows Service”).

Estas instruções pressupõem que sua localização atual é o diretório de instalação do MySQL e que ele possui um subdiretório `bin` contendo os programas MySQL usados aqui. Se isso não for verdade, ajuste os nomes dos caminhos dos comandos de acordo.

Se você instalou o MySQL usando o MySQL Installer (consulte Seção 2.3.3, “MySQL Installer for Windows”), o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 5.7`:

```sql
C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7"
```

Um local de instalação comum para instalação a partir de um ZIP Archive é `C:\mysql`:

```sql
C:\> cd C:\mysql
```

Alternativamente, adicione o diretório `bin` à configuração da sua variável de ambiente `PATH`. Isso permite que seu interpretador de comandos encontre os programas MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não seu nome de caminho. Consulte Seção 2.3.4.7, “Customizing the PATH for MySQL Tools”.

Com o `server` em execução, emita os seguintes comandos para verificar se você pode recuperar informações dele. A saída deve ser semelhante à mostrada aqui.

Use **mysqlshow** para ver quais `databases` existem:

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

A lista de `databases` instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`. Antes do MySQL 5.7.7, um `database` `test` também pode ser criado automaticamente.

O comando anterior (e comandos para outros programas MySQL, como **mysql**) pode não funcionar se a conta MySQL correta não existir. Por exemplo, o programa pode falhar com um `error`, ou você pode não conseguir visualizar todos os `databases`. Se você instalar o MySQL usando o MySQL Installer, o usuário `root` é criado automaticamente com a senha que você forneceu. Neste caso, você deve usar as opções `-u root` e `-p`. (Você deve usar essas opções se já tiver protegido as contas MySQL iniciais.) Com `-p`, o programa `client` solicita a senha do `root`. Por exemplo:

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

Se você especificar um nome de `database`, **mysqlshow** exibe uma lista das `tables` dentro do `database`:

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

Use o programa **mysql** para selecionar informações de uma `table` no `database` `mysql`:

```sql
C:\> bin\mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

Para mais informações sobre **mysql** e **mysqlshow**, consulte Seção 4.5.1, “mysql — The MySQL Command-Line Client”, e Seção 4.5.7, “mysqlshow — Display Database, Table, and Column Information”.