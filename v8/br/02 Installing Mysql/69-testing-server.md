### 2.9.3 Teste do servidor

Depois que o diretório de dados for inicializado e você tiver iniciado o servidor, execute alguns testes simples para garantir que ele funcione de forma satisfatória. Esta seção assume que sua localização atual é o diretório de instalação do MySQL e que ele tem um subdiretório `bin` contendo os programas do MySQL usados aqui. Se isso não for verdade, ajuste os nomes do caminho de comando de acordo.

Alternativamente, adicione o diretório `bin` à sua configuração de variável de ambiente `PATH`. Isso permite que o seu shell (interpretador de comandos) encontre os programas MySQL corretamente, para que você possa executar um programa digitando apenas o seu nome, não o seu nome de caminho. Veja Seção 6.2.9, Setting Environment Variables.

Use `mysqladmin` para verificar se o servidor está em execução. Os seguintes comandos fornecem testes simples para verificar se o servidor está em funcionamento e respondendo a conexões:

```
$> bin/mysqladmin version
$> bin/mysqladmin variables
```

Se você não conseguir se conectar ao servidor, especifique uma opção `-u root` para se conectar como `root`. Se você já atribuiu uma senha para a conta `root`, você também precisará especificar `-p` na linha de comando e digitar a senha quando solicitado. Por exemplo:

```
$> bin/mysqladmin -u root -p version
Enter password: (enter root password here)
```

A saída de `mysqladmin version` varia ligeiramente dependendo da sua plataforma e versão do MySQL, mas deve ser semelhante ao mostrado aqui:

```
$> bin/mysqladmin version
mysqladmin  Ver 14.12 Distrib 8.4.6, for pc-linux-gnu on i686
...

Server version          8.4.6
Protocol version        10
Connection              Localhost via UNIX socket
UNIX socket             /var/lib/mysql/mysql.sock
Uptime:                 14 days 5 hours 5 min 21 sec

Threads: 1  Questions: 366  Slow queries: 0
Opens: 0  Flush tables: 1  Open tables: 19
Queries per second avg: 0.000
```

Para ver o que mais você pode fazer com `mysqladmin`, invoque-o com a opção `--help`.

Verifique se você pode desligar o servidor (incluir uma opção `-p` se a conta `root` já tiver uma senha):

```
$> bin/mysqladmin -u root shutdown
```

Verifique se você pode iniciar o servidor novamente. Faça isso usando `mysqld_safe` ou invocando `mysqld` diretamente. Por exemplo:

```
$> bin/mysqld_safe --user=mysql &
```

Se `mysqld_safe` falhar, consulte a Seção 2.9.2.1, "Solução de Problemas ao iniciar o Servidor MySQL".

Execute alguns testes simples para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante à mostrada aqui.

Use `mysqlshow` para ver quais bancos de dados existem:

```
$> bin/mysqlshow
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

Se você especificar um nome de banco de dados, `mysqlshow` exibirá uma lista das tabelas dentro do banco de dados:

```
$> bin/mysqlshow mysql
Database: mysql
+---------------------------+
|          Tables           |
+---------------------------+
| columns_priv              |
| component                 |
| db                        |
| default_roles             |
| engine_cost               |
| func                      |
| general_log               |
| global_grants             |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| password_history          |
| plugin                    |
| procs_priv                |
| proxies_priv              |
| role_edges                |
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

Use o programa `mysql` para selecionar informações de uma tabela no esquema `mysql`:

```
$> bin/mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | caching_sha2_password |
+------+-----------+-----------------------+
```

Neste ponto, o seu servidor está em execução e você pode acessá-lo. Para reforçar a segurança, se você ainda não atribuiu uma senha para a conta inicial, siga as instruções na Seção 2.9.4, "Securing the Initial MySQL Account".

Para mais informações sobre `mysql`, `mysqladmin`, e `mysqlshow`, veja Seção 6.5.1, mysql  The MySQL Command-Line Client, Seção 6.5.2, mysqladmin  A MySQL Server Administration Program, e Seção 6.5.6, mysqlshow  Display Database, Table, and Column Information.
