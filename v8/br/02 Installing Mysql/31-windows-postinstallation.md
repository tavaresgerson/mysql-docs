### 2.3.5 Procedimentos Pós-Instalação do Windows

Existem ferramentas de interface gráfica que realizam a maioria das tarefas descritas nesta seção, incluindo:

*  MySQL Configurator: Usado para configurar o servidor MySQL.
*  MySQL Workbench: Gerencia o servidor MySQL e edita instruções SQL.

Se necessário, inicie o diretório de dados e crie as tabelas de concessão do MySQL. As operações de instalação do Windows realizadas pelo MySQL Configurator podem inicializar o diretório de dados automaticamente. Para a instalação a partir de um pacote de arquivo ZIP, inicie o diretório de dados conforme descrito na Seção 2.9.1, “Inicializando o Diretório de Dados”.

Quanto às senhas, se você configurou o MySQL usando o MySQL Configurator, pode ter atribuído uma senha à conta inicial `root`. (Veja a Seção 2.3.2, “Configuração: Usando o MySQL Configurator”.) Caso contrário, use o procedimento de atribuição de senha dado na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Antes de atribuir uma senha, você pode querer tentar executar alguns programas cliente para garantir que você possa se conectar ao servidor e que ele esteja funcionando corretamente. Certifique-se de que o servidor esteja em execução (veja  Seção 2.3.3.5, “Iniciando o Servidor pela Primeira Vez”). Você também pode configurar um serviço MySQL que seja executado automaticamente quando o Windows iniciar (veja  Seção 2.3.3.8, “Iniciando o MySQL como Serviço do Windows”).

Essas instruções assumem que sua localização atual é o diretório de instalação do MySQL e que ele tem um subdiretório `bin` contendo os programas MySQL usados aqui. Se isso não for verdade, ajuste os nomes dos caminhos dos comandos de acordo.

Se você instalou o MySQL usando o MSI, o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 8.4`:

```
C:\> cd "C:\Program Files\MySQL\MySQL Server 8.4"
```

Uma localização comum para a instalação a partir de um arquivo ZIP é `C:\mysql`:

```
C:\> cd C:\mysql
```

Como alternativa, adicione o diretório `bin` à configuração da variável de ambiente `PATH`. Isso permite que o interpretador de comandos encontre os programas do MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não seu nome de caminho.

Com o servidor em execução, execute os seguintes comandos para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante à mostrada aqui.

Use `mysqlshow` para ver quais bancos de dados existem:

```
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

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

O comando anterior (e comandos para outros programas do MySQL, como `mysql`) podem não funcionar se a conta correta do MySQL não existir. Por exemplo, o programa pode falhar com um erro ou você pode não conseguir visualizar todos os bancos de dados. Se você configurou o MySQL usando o MySQL Configurator, o usuário `root` é criado automaticamente com a senha que você forneceu. Nesse caso, você deve usar as opções `-u root` e `-p`. (Você deve usar essas opções se já tiver protegido as contas iniciais do MySQL.) Com `-p`, o programa cliente solicita a senha do `root`. Por exemplo:

```
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

Se você especificar um nome de banco de dados, o `mysqlshow` exibe uma lista das tabelas dentro do banco de dados:

```
C:\> bin\mysqlshow mysql
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

Use o programa `mysql` para selecionar informações de uma tabela no banco de dados `mysql`:

```
C:\> bin\mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | caching_sha2_password |
+------+-----------+-----------------------+
```

Para obter mais informações sobre `mysql` e `mysqlshow`, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”, e a Seção 6.5.6, “mysqlshow — Exibir Informações de Banco de Dados, Tabela e Coluna”.