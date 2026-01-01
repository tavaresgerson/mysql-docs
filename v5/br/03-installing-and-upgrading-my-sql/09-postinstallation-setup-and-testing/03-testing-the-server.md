### 2.9.3 Testando o servidor

Depois que o diretório de dados é inicializado e você iniciou o servidor, realize alguns testes simples para garantir que ele funcione satisfatoriamente. Esta seção assume que sua localização atual é o diretório de instalação do MySQL e que ele possui um subdiretório `bin` contendo os programas MySQL usados aqui. Se isso não for verdade, ajuste os nomes dos caminhos do comando conforme necessário.

Como alternativa, adicione o diretório `bin` à sua configuração da variável de ambiente `PATH`. Isso permite que seu shell (interpretador de comandos) encontre os programas do MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não seu nome de caminho. Veja a Seção 4.2.7, “Definindo Variáveis de Ambiente”.

Use **mysqladmin** para verificar se o servidor está em execução. Os seguintes comandos fornecem testes simples para verificar se o servidor está ativo e respondendo às conexões:

```sql
$> bin/mysqladmin version
$> bin/mysqladmin variables
```

Se você não conseguir se conectar ao servidor, especifique a opção `-u root` para se conectar como `root`. Se você já tiver atribuído uma senha para a conta `root`, também precisará especificar `-p` na linha de comando e digitar a senha quando solicitado. Por exemplo:

```sql
$> bin/mysqladmin -u root -p version
Enter password: (enter root password here)
```

A saída da **versão mysqladmin** varia um pouco dependendo da sua plataforma e da versão do MySQL, mas deve ser semelhante à mostrada aqui:

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

Para ver o que mais você pode fazer com **mysqladmin**, invocá-lo com a opção `--help`.

Verifique se você pode desligar o servidor (inclua a opção `-p` se a conta `root` já tiver uma senha):

```sql
$> bin/mysqladmin -u root shutdown
```

Verifique se você pode iniciar o servidor novamente. Faça isso usando **mysqld\_safe** ou invocando diretamente o **mysqld**. Por exemplo:

```sql
$> bin/mysqld_safe --user=mysql &
```

Se o **mysqld\_safe** falhar, consulte a Seção 2.9.2.1, “Soluções para problemas ao iniciar o servidor MySQL”.

Execute alguns testes simples para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante à mostrada aqui.

Use **mysqlshow** para ver quais bancos de dados existem:

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

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

Se você especificar um nome de banco de dados, o **mysqlshow** exibe uma lista das tabelas dentro do banco de dados:

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

Use o programa **mysql** para selecionar informações de uma tabela no banco de dados **mysql**:

```sql
$> bin/mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

Neste ponto, seu servidor está em execução e você pode acessá-lo. Para aumentar a segurança, se ainda não tiver atribuído uma senha à conta inicial, siga as instruções na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

Para obter mais informações sobre **mysql**, **mysqladmin** e **mysqlshow**, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”, a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL” e a Seção 4.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.
