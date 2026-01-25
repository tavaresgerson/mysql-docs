### 2.9.3 Testando o Server

Após o diretório de dados ser inicializado e você ter iniciado o Server, realize alguns testes simples para garantir que ele esteja funcionando satisfatoriamente. Esta seção pressupõe que sua localização atual seja o diretório de instalação do MySQL e que ele possua um subdiretório `bin` contendo os programas MySQL usados aqui. Se isso não for verdade, ajuste os nomes dos caminhos de comando (command path names) conforme necessário.

Alternativamente, adicione o diretório `bin` à configuração da sua variável de ambiente `PATH`. Isso permite que seu shell (interpretador de comandos) encontre os programas MySQL adequadamente, de modo que você possa executar um programa digitando apenas o nome dele, e não seu nome de caminho (path name). Consulte a Seção 4.2.7, “Configurando Variáveis de Ambiente”.

Use **mysqladmin** para verificar se o Server está em execução. Os comandos a seguir fornecem testes simples para verificar se o Server está ativo e respondendo a conexões:

```sql
$> bin/mysqladmin version
$> bin/mysqladmin variables
```

Se você não conseguir conectar-se ao Server, especifique a opção `-u root` para conectar-se como `root`. Se você já tiver atribuído uma senha para a conta `root`, também precisará especificar `-p` na linha de comando e digitar a senha quando solicitado. Por exemplo:

```sql
$> bin/mysqladmin -u root -p version
Enter password: (enter root password here)
```

A saída de **mysqladmin version** varia ligeiramente dependendo da sua plataforma e versão do MySQL, mas deve ser semelhante à mostrada aqui:

```sql
$> bin/mysqladmin version
mysqladmin  Ver 14.12 Distrib 5.7.44, for pc-linux-gnu on i686
...

Server version          5.7.44
Protocol version        10
Connection              Localhost via UNIX socket
UNIX socket             /var/lib/mysql/mysql.sock
Uptime:                 14 days 5 hours 5 min 21 sec

Threads: 1  Questions: 366  Slow queries: 0
Opens: 0  Flush tables: 1  Open tables: 19
Queries per second avg: 0.000
```

Para ver o que mais você pode fazer com **mysqladmin**, invoque-o com a opção `--help`.

Verifique se você consegue desligar o Server (inclua a opção `-p` se a conta `root` já tiver uma senha):

```sql
$> bin/mysqladmin -u root shutdown
```

Verifique se você pode iniciar o Server novamente. Faça isso usando **mysqld_safe** ou invocando **mysqld** diretamente. Por exemplo:

```sql
$> bin/mysqld_safe --user=mysql &
```

Se **mysqld_safe** falhar, consulte a Seção 2.9.2.1, “Solucionando Problemas ao Iniciar o MySQL Server”.

Execute alguns testes simples para verificar se você consegue recuperar informações do Server. A saída deve ser semelhante à mostrada aqui.

Use **mysqlshow** para ver quais Databases existem:

```sql
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

A lista de Databases instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

Se você especificar um nome de Database, **mysqlshow** exibirá uma lista das tables dentro desse Database:

```sql
$> bin/mysqlshow mysql
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

Use o programa **mysql** para selecionar informações de uma table no Database `mysql`:

```sql
$> bin/mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

Neste ponto, seu Server está em execução e você pode acessá-lo. Para reforçar a segurança, caso ainda não tenha atribuído uma senha à conta inicial, siga as instruções na Seção 2.9.4, “Protegendo a Conta Inicial do MySQL”.

Para obter mais informações sobre **mysql**, **mysqladmin** e **mysqlshow**, consulte a Seção 4.5.1, “mysql — The MySQL Command-Line Client”, a Seção 4.5.2, “mysqladmin — Um Programa de Administração do MySQL Server”, e a Seção 4.5.7, “mysqlshow — Exibindo Informações de Database, Table e Column”.